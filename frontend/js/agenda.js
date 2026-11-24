document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================================================
       BLOCO 1: CONFIGURAÇÃO E PERSISTÊNCIA LOCAL (LocalStorage)
       Responsabilidade: Salvar e carregar os compromissos agendados na memória
       do navegador para que não sumam ao atualizar (F5) a página.
       ========================================================================== */
    const APPOINTMENTS_STORAGE_KEY = "fitmanager.agenda.compromissos.v1";
    const storedAppointments = loadStoredAppointments();

    // Carrega os compromissos gravados no navegador; se não houver, retorna lista vazia
    function loadStoredAppointments() {
        try {
            const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_STORAGE_KEY) || "[]");
            return Array.isArray(appointments) ? appointments : [];
        } catch (error) {
            return [];
        }
    }

    // Salva a lista atualizada de compromissos no LocalStorage
    function saveStoredAppointments() {
        try {
            localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(storedAppointments));
            return true;
        } catch (error) {
            return false;
        }
    }


    /* ==========================================================================
       BLOCO 2: FUNÇÕES UTILITÁRIAS DE DATA E HORA
       Responsabilidade: Fazer cálculos matemáticos de horários.
       (Ex.: transformar 08:00 em 09:00 para definir o fim do treino de 60min).
       ========================================================================== */
    function addMinutesToLocalDateTime(dateValue, timeValue, minutesToAdd) {
        const [year, month, day] = dateValue.split("-").map(Number);
        const [hour, minute] = timeValue.split(":").map(Number);
        
        // Cria a data e soma os minutos da duração
        const end = new Date(year, month - 1, day, hour, minute + minutesToAdd);
        
        // Formata de volta para o padrão YYYY-MM-DDTHH:mm:ss aceito pelo FullCalendar
        const date = [
            end.getFullYear(),
            String(end.getMonth() + 1).padStart(2, "0"),
            String(end.getDate()).padStart(2, "0")
        ].join("-");
        
        const time = [
            String(end.getHours()).padStart(2, "0"),
            String(end.getMinutes()).padStart(2, "0")
        ].join(":");

        return `${date}T${time}:00`;
    }


    /* ==========================================================================
       BLOCO 3: INICIALIZAÇÃO DO CALENDÁRIO (FullCalendar)
       Responsabilidade: Renderizar a grade mensal do calendário na tela
       em português e exibir os eventos previamente salvos.
       ========================================================================== */
    var calendarEl = document.getElementById("calendar");
    var calendar = null;

    if (calendarEl && typeof FullCalendar !== "undefined") {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth", // Visualização mensal em grade
            locale: "pt-br",             // Meses e dias da semana em português
            firstDay: 1,                 // Segunda-feira como primeiro dia da semana
            events: storedAppointments,  // Carrega os compromissos salvos
        });
        calendar.render();
    }


    /* ==========================================================================
       BLOCO 4: CONTROLE DO MODAL FLUTUANTE (Abrir e Fechar Janela)
       Responsabilidade: Gerenciar a exibição da janela de agendamento por cima
       da página (abrir no botão, fechar no X, no Cancelar, no clique fora ou ESC).
       ========================================================================== */
    const btnAbrirModal = document.getElementById("btn-abrir-modal");
    const modalCompromisso = document.getElementById("modal-compromisso");
    const btnFecharModal = document.getElementById("btn-fechar-modal-x");
    const btnCancelarModal = document.getElementById("btn-cancelar");

    // Mostra a janela removendo a classe CSS 'hidden'
    function abrirModal() {
        if (modalCompromisso) {
            modalCompromisso.classList.remove("hidden");
            modalCompromisso.setAttribute("aria-hidden", "false");
        }
    }

    // Oculta a janela adicionando a classe CSS 'hidden'
    function fecharModal() {
        if (modalCompromisso) {
            modalCompromisso.classList.add("hidden");
            modalCompromisso.setAttribute("aria-hidden", "true");
        }
    }

    // Gatilhos de abertura e fechamento
    btnAbrirModal?.addEventListener("click", abrirModal);
    btnFecharModal?.addEventListener("click", fecharModal);
    btnCancelarModal?.addEventListener("click", fecharModal);

    // Fecha se o usuário clicar no fundo escuro fora da caixinha branca
    modalCompromisso?.addEventListener("click", function (event) {
        if (event.target === modalCompromisso) {
            fecharModal();
        }
    });

    // Atalho: fecha ao pressionar a tecla 'Esc'
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modalCompromisso && !modalCompromisso.classList.contains("hidden")) {
            fecharModal();
        }
    });


    /* ==========================================================================
       BLOCO 5: PROCESSAMENTO DO FORMULÁRIO E CRIAÇÃO DO COMPROMISSO
       Responsabilidade: Capturar o aluno, data, horário e tipo escolhidos,
       adicionar o card no calendário, salvar no navegador e fechar o modal.
       ========================================================================== */
    const formCompromisso = document.getElementById("form-compromisso");
    const selectAluno = document.getElementById("comp-aluno");
    const inputData = document.getElementById("comp-data");
    const inputHora = document.getElementById("comp-hora");
    const selectTipo = document.getElementById("comp-tipo");

    formCompromisso?.addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o recarregamento padrão da página

        if (!calendar) {
            alert("Não foi possível carregar o calendário.");
            return;
        }

        // 1. Extrai os textos selecionados
        const studentOption = selectAluno.options[selectAluno.selectedIndex];
        const activityOption = selectTipo.options[selectTipo.selectedIndex];
        const studentName = studentOption.textContent.trim();
        const activityName = activityOption.textContent.trim();
        const start = `${inputData.value}T${inputHora.value}:00`;

        // 2. Monta o objeto de compromisso no padrão esperado pelo FullCalendar
        const commitment = {
            id: `compromisso-${Date.now()}`,
            title: `${studentName} - ${activityName}`,
            start: start,
            end: addMinutesToLocalDateTime(inputData.value, inputHora.value, 60), // Duração padrão: 60min
            backgroundColor: "#6366f1",
            borderColor: "#6366f1",
            extendedProps: {
                studentId: selectAluno.value,
                studentName: studentName,
                activityName: activityName
            }
        };

        // 3. Adiciona visualmente no calendário
        calendar.addEvent(commitment);

        // 4. Salva na lista e grava no LocalStorage
        storedAppointments.push(commitment);
        if (!saveStoredAppointments()) {
            alert("O compromisso entrou no calendário, mas não pôde ser salvo neste navegador.");
        }

        // 5. Fecha o modal e limpa os campos para o próximo agendamento
        fecharModal();
        formCompromisso.reset();
    });

});