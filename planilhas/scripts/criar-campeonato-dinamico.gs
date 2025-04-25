/**
 * Criação Dinâmica de Campeonatos
 *
 * Lê respostas do formulário e:
 * - Cria campeonatos (planilha + abas + formulários)
 * - Atualiza a Planilha dos Campeonatos
 * - Gera erro caso a Planilha Mãe não exista
 * - Restringe o acesso dos formulários criados ao email que executou o script
 *
 * Observações futuras:
 * - Poderíamos também implementar uma função para:
 *   - Verificar se os formulários criados têm as permissões configuradas corretamente
 *   - Logar no Admin quais formulários estão "pendentes de configuração"
 *   - Mostrar aos administradores a lista de formulários recém-criados com status de acesso
 * - Assim, seria possível garantir rapidamente que todos os formulários estão seguros sem precisar abrir um a um manualmente.
 */

function criarCampeonatosDinamicamente() {
  const NOME_PLANILHA_MAE = 'Planilha dos Campeonatos';
  const NOME_ABA_CAMPEONATOS = 'Campeonatos';
  const NOME_ABA_RESPOSTAS = 'Form Responses 1'; // aba padrão do Forms

  // Procurar a Planilha dos Campeonatos
  const arquivos = DriveApp.getFilesByName(NOME_PLANILHA_MAE);

  if (!arquivos.hasNext()) {
    throw new Error('❌ Planilha dos Campeonatos não encontrada. Por favor, execute o setup inicial (criarSetupInicial) e configure as variáveis de ambiente no Angular.');
  }

  const planilhaMae = SpreadsheetApp.open(arquivos.next());
  const respostasAba = planilhaMae.getSheetByName(NOME_ABA_RESPOSTAS);
  const campeonatosAba = planilhaMae.getSheetByName(NOME_ABA_CAMPEONATOS);

  if (!respostasAba || !campeonatosAba) {
    throw new Error('❌ Estrutura da Planilha dos Campeonatos incompleta. Verifique se a aba "Form Responses 1" e a aba "Campeonatos" existem corretamente.');
  }

  const respostas = respostasAba.getDataRange().getValues();
  const cabeçalhos = respostas[0];

  for (let i = 1; i < respostas.length; i++) {
    const linha = respostas[i];
    const acao = linha[cabeçalhos.indexOf('Ação')];
    const nomeCampeonato = linha[cabeçalhos.indexOf('Nome do Campeonato')];
    const nomeInterno = linha[cabeçalhos.indexOf('Nome Interno (slug)')];
    const dataInicio = linha[cabeçalhos.indexOf('Data de Início')];
    const dataTermino = linha[cabeçalhos.indexOf('Data de Término')];
    const observacoes = linha[cabeçalhos.indexOf('Observações')];

    // Checar se já foi criado (existe Planilha URL preenchida)
    const planilhaUrlIndex = cabeçalhos.indexOf('Planilha URL');
    if (linha[planilhaUrlIndex] && linha[planilhaUrlIndex] !== '') {
      continue; // já processado, pula
    }

    if (acao === 'Criar') {
      // Criar nova planilha do campeonato
      const novaPlanilha = SpreadsheetApp.create(nomeCampeonato);
      const novaPlanilhaId = novaPlanilha.getId();
      const novaPlanilhaUrl = novaPlanilha.getUrl();

      const partidasAba = novaPlanilha.getActiveSheet();
      partidasAba.setName('Partidas');
      const clubesAba = novaPlanilha.insertSheet('Clubes');
      const formulariosAba = novaPlanilha.insertSheet('Formularios');

      const gids = {
        partidas: partidasAba.getSheetId(),
        clubes: clubesAba.getSheetId(),
        formularios: formulariosAba.getSheetId()
      };

      const formCadastrarPartida = FormApp.create(`Cadastrar Partida - ${nomeCampeonato}`);
      const formEditarPartida = FormApp.create(`Editar Partida - ${nomeCampeonato}`);

      const formCadastrarPartidaUrl = formCadastrarPartida.getPublishedUrl();
      const formEditarPartidaUrl = formEditarPartida.getPublishedUrl();

      formCadastrarPartida.setDestination(FormApp.DestinationType.SPREADSHEET, novaPlanilhaId);
      formEditarPartida.setDestination(FormApp.DestinationType.SPREADSHEET, novaPlanilhaId);

      // 🔒 Restringir acesso dos formulários ao usuário logado
      const emailCriador = Session.getActiveUser().getEmail();
      if (emailCriador) {
        configurarAcessoFormulario(formCadastrarPartida, emailCriador);
        configurarAcessoFormulario(formEditarPartida, emailCriador);
      } else {
        Logger.log('⚠️ Não foi possível detectar o email ativo para restringir acesso aos formulários.');
      }

      campeonatosAba.appendRow([
        nomeCampeonato,
        nomeInterno,
        dataInicio,
        dataTermino,
        observacoes,
        novaPlanilhaUrl,
        gids.partidas,
        gids.clubes,
        gids.formularios,
        '', // Form Criar (não utilizado por enquanto)
        formCadastrarPartidaUrl,
        formEditarPartidaUrl
      ]);

      Logger.log(`✅ Campeonato criado: ${nomeCampeonato}`);
    }

    // Futuro: ações de "Editar" e "Apagar" podem ser tratadas aqui também.
  }

  Logger.log('🏁 Processamento de campeonatos finalizado!');
}

/**
 * Configura o acesso de um formulário:
 * - Define como privado
 * - Adiciona o email do criador como editor
 *
 * @param {FormApp.Form} formulario - O formulário a configurar
 * @param {string} emailCriador - O email que receberá permissão
 *
 * Observação:
 * - No futuro, esta função pode ser adaptada para aceitar múltiplos emails:
 *   - Em vez de um único `emailCriador`, poderia receber um array `emailsCriadores`
 *   - E para cada email, chamar `addEditor(email)`
 * - Isso permitiria, por exemplo, que 2 ou 3 administradores tivessem acesso aos formulários criados.
 */
function configurarAcessoFormulario(formulario, emailCriador) {
  const file = DriveApp.getFileById(formulario.getId());
  file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  file.addEditor(emailCriador);

  Logger.log(`🔒 Acesso configurado para o formulário: ${formulario.getTitle()} (${emailCriador})`);
}
