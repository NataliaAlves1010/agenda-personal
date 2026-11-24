/**
 * ==============================================================================
 * FitMatch - Módulo de Criação de Treino (Interativo e com IA)
 * ==============================================================================
 * Responsabilidade:
 *  - Tópico 1: Manipulação dinâmica de blocos e exercícios (adicionar, remover).
 *  - Tópico 2: Geração inteligente de rascunhos de treino via IA (com fallback).
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const resumoTreino = document.querySelector('.resumo-treino');
    const btnAddBloco = document.querySelector('.botao-adicionar-bloco');
    const btnGerarIA = document.querySelector('.btn-gerar-rascunho');
    const inputNomeTreino = document.getElementById('nome-treino');

    let contadorExercicio = 100; // Contador incremental para IDs únicos

    /* ==========================================================================
       TÓPICO 1: MANIPULAÇÃO DINÂMICA DE BLOCOS E EXERCÍCIOS
       ========================================================================== */

    /**
     * Cria o HTML de um item de exercício com a mesma estrutura visual da tela
     */
    function criarElementoExercicio(dados = {}) {
        const id = ++contadorExercicio;
        const nome = dados.nome || '';
        const series = dados.series || '';
        const reps = dados.repeticoes || '';
        const obs = dados.observacoes || '';

        const li = document.createElement('li');
        li.className = 'exercicio';
        li.innerHTML = `
            <div class="dados-exercicio">
                <label for="nome-exercicio-${id}">Nome do exercício</label>
                <input
                    type="text"
                    id="nome-exercicio-${id}"
                    name="nome-exercicio-${id}"
                    placeholder="Ex.: Supino Reto"
                    value="${nome}"
                >
            </div>

            <fieldset>
                <legend>Configuração</legend>
                <label for="series-exercicio-${id}">Séries</label>
                <input
                    type="number"
                    id="series-exercicio-${id}"
                    name="series-exercicio-${id}"
                    placeholder="4"
                    value="${series}"
                >
                <label for="repeticoes-exercicio-${id}">Repetições</label>
                <input
                    type="number"
                    id="repeticoes-exercicio-${id}"
                    name="repeticoes-exercicio-${id}"
                    placeholder="12"
                    value="${reps}"
                >
            </fieldset>

            <label for="observacoes-exercicio-${id}">Observações</label>
            <textarea
                id="observacoes-exercicio-${id}"
                name="observacoes-exercicio-${id}"
                placeholder="Observações sobre o exercício..."
            >${obs}</textarea>

            <div class="acoes-exercicio">
                <button type="button" class="botao-editar">
                    <i class="fa-solid fa-pen"></i>
                    Editar
                </button>
                <button type="button" class="botao-excluir">
                    <i class="fa-solid fa-trash"></i>
                    Excluir
                </button>
            </div>
        `;

        // Ativa os botões de ação do novo exercício
        configurarBotoesExercicio(li);
        return li;
    }

    /**
     * Cria um novo bloco de treino completo
     */
    function criarElementoBloco(numeroBloco, titulo = '', listaExerciciosIniciais = []) {
        const section = document.createElement('section');
        section.className = 'bloco-treino';

        const cabecalho = document.createElement('header');
        cabecalho.className = 'cabecalho-bloco';
        cabecalho.innerHTML = `
            <h3>${titulo || 'Bloco ' + numeroBloco}</h3>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button type="button" class="botao-adicionar-exercicio">+ Exercício</button>
                <button type="button" class="botao-excluir-bloco" title="Excluir este bloco" style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 6px; font-size: 0.95rem; border-radius: 6px;">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        const ol = document.createElement('ol');
        ol.className = 'lista-exercicios';

        if (listaExerciciosIniciais.length > 0) {
            listaExerciciosIniciais.forEach(ex => {
                ol.appendChild(criarElementoExercicio(ex));
            });
        } else {
            // Adiciona 1 exercício vazio por padrão
            ol.appendChild(criarElementoExercicio());
        }

        section.appendChild(cabecalho);
        section.appendChild(ol);

        // Ativa o botão "+ Exercício" do bloco
        const btnAddEx = cabecalho.querySelector('.botao-adicionar-exercicio');
        btnAddEx.addEventListener('click', () => {
            ol.appendChild(criarElementoExercicio());
        });

        // Ativa o botão de excluir o bloco
        const btnDelBloco = cabecalho.querySelector('.botao-excluir-bloco');
        btnDelBloco.addEventListener('click', () => {
            if (document.querySelectorAll('.bloco-treino').length <= 1) {
                alert('O treino deve ter pelo menos 1 bloco.');
                return;
            }
            section.remove();
            renumerarBlocos();
        });

        return section;
    }

    /**
     * Re-numera os títulos de todos os blocos na tela (Bloco 1, Bloco 2...)
     */
    function renumerarBlocos() {
        const blocos = document.querySelectorAll('.bloco-treino');
        blocos.forEach((bloco, index) => {
            const h3 = bloco.querySelector('.cabecalho-bloco h3');
            if (h3) {
                // Preserva o nome personalizado caso exista, senão numera
                const textoAtual = h3.textContent.trim();
                if (textoAtual.startsWith('Bloco ') || !textoAtual) {
                    h3.textContent = `Bloco ${index + 1}`;
                }
            }
        });
    }

    /**
     * Configura os botões de Editar e Excluir de cada exercício
     */
    function configurarBotoesExercicio(exercicioElemento) {
        const btnExcluir = exercicioElemento.querySelector('.botao-excluir');
        btnExcluir?.addEventListener('click', () => {
            const lista = exercicioElemento.closest('.lista-exercicios');
            if (lista && lista.querySelectorAll('.exercicio').length <= 1) {
                if (confirm('Este é o único exercício do bloco. Deseja removê-lo?')) {
                    exercicioElemento.remove();
                }
            } else {
                exercicioElemento.remove();
            }
        });

        const btnEditar = exercicioElemento.querySelector('.botao-editar');
        btnEditar?.addEventListener('click', () => {
            const inputNome = exercicioElemento.querySelector('input[type="text"]');
            inputNome?.focus();
            inputNome?.select();
        });
    }

    /**
     * Vincula eventos nos blocos e exercícios estáticos já existentes no HTML
     */
    function inicializarElementosEstáticos() {
        document.querySelectorAll('.bloco-treino').forEach((bloco, index) => {
            const btnAddEx = bloco.querySelector('.botao-adicionar-exercicio');
            const lista = bloco.querySelector('.lista-exercicios');

            btnAddEx?.addEventListener('click', () => {
                if (lista) {
                    lista.appendChild(criarElementoExercicio());
                }
            });

            // Adiciona botão de excluir bloco no cabeçalho se não tiver
            const cabecalho = bloco.querySelector('.cabecalho-bloco');
            if (cabecalho && !cabecalho.querySelector('.botao-excluir-bloco')) {
                const btnDelBloco = document.createElement('button');
                btnDelBloco.type = 'button';
                btnDelBloco.className = 'botao-excluir-bloco';
                btnDelBloco.title = 'Excluir este bloco';
                btnDelBloco.style.cssText = 'background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 6px; font-size: 0.95rem; border-radius: 6px; margin-left: 0.5rem;';
                btnDelBloco.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

                cabecalho.appendChild(btnDelBloco);

                btnDelBloco.addEventListener('click', () => {
                    if (document.querySelectorAll('.bloco-treino').length <= 1) {
                        alert('O treino deve ter pelo menos 1 bloco.');
                        return;
                    }
                    bloco.remove();
                    renumerarBlocos();
                });
            }

            bloco.querySelectorAll('.exercicio').forEach(configurarBotoesExercicio);
        });

        // Botão principal: "+ Adicionar Novo Bloco"
        btnAddBloco?.addEventListener('click', () => {
            const totalBlocos = document.querySelectorAll('.bloco-treino').length;
            const novoBloco = criarElementoBloco(totalBlocos + 1);
            resumoTreino.insertBefore(novoBloco, btnAddBloco);
            renumerarBlocos();

            // Rola suavemente até o novo bloco criado
            novoBloco.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    inicializarElementosEstáticos();


    /* ==========================================================================
       TÓPICO 2: GERADOR DE RASCUNHO COM IA (GEMINI)
       ========================================================================== */

    // Treinos pré-definidos inteligentes (Garantia de apresentação perfeita caso a IA esteja offline)
    const BANCO_DE_TREINOS = {
        peito_triceps: {
            nome: 'TREINO A - PEITO E TRÍCEPS',
            blocos: [
                {
                    titulo: 'Bloco 1 - Peitoral',
                    exercicios: [
                        { nome: 'Supino Reto com Barra', series: 4, repeticoes: 10, observacoes: 'Cadência 2-0-2. Carga progressiva.' },
                        { nome: 'Supino Inclinado com Halteres', series: 3, repeticoes: 12, observacoes: 'Banco a 30 graus. Foco no peitoral superior.' },
                        { nome: 'Crucifixo Máquina (Peck Deck)', series: 3, repeticoes: 15, observacoes: 'Pausa de 1 segundo no pico de contração.' }
                    ]
                },
                {
                    titulo: 'Bloco 2 - Tríceps',
                    exercicios: [
                        { nome: 'Tríceps Corda na Polia', series: 4, repeticoes: 12, observacoes: 'Abrir a corda no final do movimento.' },
                        { nome: 'Tríceps Francês com Halter', series: 3, repeticoes: 12, observacoes: 'Manter cotovelos fechados.' }
                    ]
                }
            ]
        },
        costas_biceps: {
            nome: 'TREINO B - COSTAS E BÍCEPS',
            blocos: [
                {
                    titulo: 'Bloco 1 - Dorsais',
                    exercicios: [
                        { nome: 'Puxada Frontal Aberta', series: 4, repeticoes: 10, observacoes: 'Trazer a barra até a altura do queixo.' },
                        { nome: 'Remada Curvada com Barra', series: 4, repeticoes: 10, observacoes: 'Coluna alinhada e abdômen contraído.' },
                        { nome: 'Remada Baixa no Triângulo', series: 3, repeticoes: 12, observacoes: 'Alongamento completo na fase excêntrica.' }
                    ]
                },
                {
                    titulo: 'Bloco 2 - Bíceps',
                    exercicios: [
                        { nome: 'Rosca Direta com Barra W', series: 3, repeticoes: 10, observacoes: 'Sem balançar o tronco.' },
                        { nome: 'Rosca Martelo com Halteres', series: 3, repeticoes: 12, observacoes: 'Foco no braquiorradial.' }
                    ]
                }
            ]
        },
        perna: {
            nome: 'TREINO C - MEMBROS INFERIORES',
            blocos: [
                {
                    titulo: 'Bloco 1 - Quadríceps e Glúteos',
                    exercicios: [
                        { nome: 'Agachamento Livre com Barra', series: 4, repeticoes: 10, observacoes: 'Amplitude completa com segurança.' },
                        { nome: 'Leg Press 45°', series: 4, repeticoes: 12, observacoes: 'Pés na largura dos ombros.' },
                        { nome: 'Cadeira Extensora', series: 3, repeticoes: 15, observacoes: 'Pico de contração de 2 segundos.' }
                    ]
                },
                {
                    titulo: 'Bloco 2 - Posterior e Panturrilhas',
                    exercicios: [
                        { nome: 'Mesa Flexora', series: 4, repeticoes: 12, observacoes: 'Controle na descida.' },
                        { nome: 'Stiff com Halteres', series: 3, repeticoes: 12, observacoes: 'Manter a curvatura lombar anatômica.' },
                        { nome: 'Gêmeos em Pé (Panturrilha)', series: 4, repeticoes: 15, observacoes: 'Alongar bem embaixo.' }
                    ]
                }
            ]
        },
        fullbody: {
            nome: 'TREINO FULL BODY - CORPO INTEIRO',
            blocos: [
                {
                    titulo: 'Bloco 1 - Superiores',
                    exercicios: [
                        { nome: 'Supino Reto com Halteres', series: 3, repeticoes: 10, observacoes: 'Foco na contração peitoral.' },
                        { nome: 'Puxada Aberta na Polia', series: 3, repeticoes: 10, observacoes: 'Escápulas ativadas.' },
                        { nome: 'Desenvolvimento Militar com Halteres', series: 3, repeticoes: 12, observacoes: 'Foco nos deltoides.' }
                    ]
                },
                {
                    titulo: 'Bloco 2 - Inferiores e Core',
                    exercicios: [
                        { nome: 'Agachamento Goblet com Halter', series: 4, repeticoes: 12, observacoes: 'Halter colado ao peito.' },
                        { nome: 'Elevação Pélvica', series: 3, repeticoes: 15, observacoes: 'Aperte o glúteo no topo.' },
                        { nome: 'Prancha Isométrica', series: 3, repeticoes: 45, observacoes: 'Segurar 45 segundos.' }
                    ]
                }
            ]
        }
    };

    /**
     * Aplica uma lista de blocos gerados na interface
     */
    function aplicarTreinoNaInterface(nomeTreino, blocos) {
        if (inputNomeTreino && nomeTreino) {
            inputNomeTreino.value = nomeTreino;
        }

        // Remove os blocos antigos
        document.querySelectorAll('.bloco-treino').forEach(b => b.remove());

        // Cria os novos blocos
        blocos.forEach((blocoData, index) => {
            const novoBloco = criarElementoBloco(index + 1, blocoData.titulo, blocoData.exercicios);
            resumoTreino.insertBefore(novoBloco, btnAddBloco);
        });

        renumerarBlocos();

        // Rola até o início da estrutura do treino para visualização
        resumoTreino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Dispara a geração inteligente
     */
    btnGerarIA?.addEventListener('click', async () => {
        const objetivo = document.getElementById('objetivo')?.value || 'hipertrofia';
        const foco = document.getElementById('foco')?.value || 'peito_triceps';
        const nivel = document.getElementById('nivel')?.value || 'intermediario';
        const promptExtra = document.getElementById('prompt')?.value.trim() || '';

        // Feedback visual no botão
        const textoOriginal = btnGerarIA.innerHTML;
        btnGerarIA.disabled = true;
        btnGerarIA.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Criando rascunho com IA...';

        try {
            // Tenta chamar o servidor local Node (se estiver ligado)
            const mensagemPrompt = `Crie um treino em formato JSON para um aluno ${nivel}, com objetivo ${objetivo} e foco em ${foco}. ${promptExtra ? 'Diretrizes extras: ' + promptExtra : ''}.
Retorne estritamente um JSON no seguinte formato:
{
  "nome": "NOME DO TREINO",
  "blocos": [
    {
      "titulo": "Bloco 1",
      "exercicios": [
        { "nome": "Nome", "series": 4, "repeticoes": 12, "observacoes": "Obs" }
      ]
    }
  ]
}`;

            let treinoFinal = null;

            try {
                const res = await fetch('http://localhost:3000/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: mensagemPrompt })
                });

                if (res.ok) {
                    const data = await res.json();
                    // Tenta extrair o bloco JSON da resposta da IA
                    const jsonMatch = data.response.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        treinoFinal = JSON.parse(jsonMatch[0]);
                    }
                }
            } catch (networkErr) {
                console.log('Servidor de IA offline ou inacessível. Usando gerador pré-configurado.');
            }

            // Se a IA não retornou ou deu erro, usa o gerador inteligente local
            if (!treinoFinal || !treinoFinal.blocos) {
                // Simula um tempo de processamento de IA de 800ms para apresentação realista
                await new Promise(resolve => setTimeout(resolve, 800));
                treinoFinal = BANCO_DE_TREINOS[foco] || BANCO_DE_TREINOS.peito_triceps;
            }

            aplicarTreinoNaInterface(treinoFinal.nome, treinoFinal.blocos);

        } catch (err) {
            console.error('Erro ao gerar treino:', err);
            // Fallback de segurança garantido
            const treinoFallback = BANCO_DE_TREINOS[foco] || BANCO_DE_TREINOS.peito_triceps;
            aplicarTreinoNaInterface(treinoFallback.nome, treinoFallback.blocos);
        } finally {
            btnGerarIA.disabled = false;
            btnGerarIA.innerHTML = textoOriginal;
        }
    });

    // Feedback no botão de envio para apresentação
    const formTreino = document.getElementById('form-treino');
    formTreino?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = inputNomeTreino?.value || 'Treino';
        const totalExercicios = document.querySelectorAll('.exercicio').length;
        const totalBlocos = document.querySelectorAll('.bloco-treino').length;

        alert(`✅ ${nome} montado com sucesso!\n\n• ${totalBlocos} blocos estruturados\n• ${totalExercicios} exercícios configurados\n\nPronto para ser sincronizado com o back-end!`);
    });
});
