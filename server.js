import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './persona.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Inicializa a SDK do Gemini com a chave do .env
const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
let ai = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

app.use(cors());
app.use(express.json());

// Serve a pasta frontend estaticamente (index.html, css, js, fotos, Telas, etc.)
app.use(express.static(path.join(__dirname, 'frontend')));

// Endpoint proxy para o chat da IA
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem não fornecida.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no arquivo .env. Obtenha uma chave gratuita em https://aistudio.google.com/apikey e adicione ao .env'
      });
    }

    if (!ai) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    const contents = [];

    if (history && Array.isArray(history)) {
      history.forEach((msg) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Lista de modelos ordenados por prioridade (se o principal estiver com 503 por alta demanda, tenta o próximo)
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const candidateModels = [
      primaryModel,
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-3.5-flash'
    ].filter((m, index, arr) => arr.indexOf(m) === index); // remove duplicatas

    let responseText = '';
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          }
        });
        responseText = response.text;
        lastError = null;
        break; // Sucesso na geração
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini] Modelo ${modelName} indisponível ou com alta demanda (status ${err.status || err.code}). Tentando alternativo...`);
      }
    }

    if (lastError && !responseText) {
      throw lastError;
    }

    res.json({ response: responseText });
  } catch (error) {
    console.error('Erro na integração com o Gemini:', error);
    res.status(500).json({
      error: 'Erro ao processar a resposta do assistente: ' + (error.message || 'Erro interno')
    });
  }
});

// Redireciona qualquer rota não encontrada para o frontend/index.html se necessário
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(` Servidor AgendaPersonal rodando em: http://localhost:${port}`);
  console.log(` Landing Page: http://localhost:${port}/`);
  console.log(` Telas Auth:   http://localhost:${port}/Telas/auth/login_personal.html`);
  console.log(` API Chat:     POST http://localhost:${port}/api/chat`);
  console.log(`======================================================\n`);
});
