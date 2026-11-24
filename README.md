# AgendaPersonal (AgendaFit / FitManager)

Plataforma de gestão inteligente para personal trainers com Landing Page moderna e Assistente Virtual Léo integrado ao Google Gemini.

---

## 🚀 Como Executar o Projeto com o Chatbot

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Chave gratuita da API do Gemini obtida em [Google AI Studio](https://aistudio.google.com/apikey)

### 2. Configurar a chave da API
Crie um arquivo `.env` na raiz do projeto (copiando do `.env.example`):
```bash
Copy-Item .env.example .env
```
Abra o arquivo `.env` e insira sua chave:
```env
GEMINI_API_KEY=sua_chave_aqui_do_google_ai_studio
PORT=3000
```

### 3. Instalar as dependências (se ainda não instalou)
```bash
npm install
```

### 4. Iniciar o servidor
```bash
npm start
```
ou em modo desenvolvimento:
```bash
npm run dev
```

Acesse no navegador:
👉 **http://localhost:3000**

---

## 🤖 Assistente Virtual Léo (Chatbot)
- **Persona:** Definida em [persona.js](file:///c:/Users/alves/code/Projetos/AgendaPersonal/persona.js), seguindo o tom amigável e focado na plataforma.
- **Frontend do chat:** [chat.html / index.html](file:///c:/Users/alves/code/Projetos/AgendaPersonal/frontend/index.html), estilizado em [chat.css](file:///c:/Users/alves/code/Projetos/AgendaPersonal/frontend/css/chat.css) e script em [chat.js](file:///c:/Users/alves/code/Projetos/AgendaPersonal/frontend/js/chat.js).
- **Backend do chat:** Endpoint `POST /api/chat` disponível tanto no servidor Node.js ([server.js](file:///c:/Users/alves/code/Projetos/AgendaPersonal/server.js)) quanto integrado no Django (`backend/config/urls.py`).

---

## 📁 Estrutura de Pastas
```
AgendaPersonal/
├── frontend/
│   ├── index.html                  # Landing Page com o widget do Léo integrado
│   ├── css/
│   │   ├── index.css               # Estilos da Landing Page
│   │   ├── chat.css                # Estilos do widget de chat
│   │   ├── auth/                   # Telas de login e cadastro
│   │   └── personal/               # Telas do painel do personal
│   ├── js/
│   │   ├── index.js                # Menu mobile e formulário de contato
│   │   ├── chat.js                 # Lógica de envio e recebimento do chat Léo
│   │   └── agenda.js               # Calendário e interatividade
│   ├── fotos/                      # Imagens do hero, logo e avatar do Léo
│   └── Telas/                      # Telas internas (auth e personal)
├── backend/                        # Backend Django (autenticação, instrutores, etc.)
├── server.js                       # Servidor Express que serve o frontend e a API do Gemini
├── persona.js                      # Contexto e regras de comportamento do Léo
├── .env.example                    # Exemplo de variáveis de ambiente
└── package.json                    # Dependências Node.js
```
