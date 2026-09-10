# FitManager

Plataforma para personal trainers e instrutores de academia organizarem seus alunos, treinos e rotina em um só lugar.

> ⚠️ **Status: protótipo em desenvolvimento.** As telas de interface já estão sendo desenhadas em HTML/CSS. As funcionalidades (busca, cadastro, geração de treino, etc.) ainda estão sendo implementadas.

## Sobre o projeto

O FitManager nasceu da necessidade de personal trainers terem um jeito simples de acompanhar seus alunos: quem está ativo, quem está prestes a vencer o plano, quais treinos precisam de revisão e quais são os compromissos do dia — tudo em um dashboard centralizado.

## Funcionalidades planejadas

- **Dashboard** — visão geral com total de alunos, treinos ativos, sessões do dia e agenda
- **Gestão de alunos** — listagem com busca por nome/matrícula e filtros por situação (Ativo, Novo, Vencendo)
- **Cadastro de aluno** — formulário para adicionar novos alunos à base
- **Criação de treino** — montagem de treinos por aluno, com apoio de IA para gerar rascunhos com base em objetivo, foco e nível do aluno
- **Perfil do personal** — *(planejado)*

## Tecnologias

- HTML5 e CSS3
- JavaScript (interatividade e lógica do frontend)
- Font Awesome / Material Symbols (ícones)
- Integração com API de IA para geração de treinos *(planejado)*

## Estrutura do projeto

```
AgendaPersonal/
└── Telas/
    ├── dashboard.html            # Visão geral do personal
    ├── alunos.html               # Listagem e busca de alunos
    ├── card_cadastro_aluno.html  # Formulário de cadastro de aluno
    └── criacao_treino.html       # Criação de treino com apoio de IA
```

## Como executar

Por enquanto o projeto é somente frontend estático, sem dependências:

1. Clone o repositório
   ```bash
   git clone https://github.com/seu-usuario/fitmanager.git
   ```
2. Abra qualquer arquivo dentro de `Telas/` diretamente no navegador (ex: `dashboard.html`)

## Contribuindo

Sugestões e contribuições são bem-vindas! Sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

## Licença

Este projeto ainda não possui uma licença definida.