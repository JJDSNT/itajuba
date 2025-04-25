/**
 * Script de criação automática da estrutura do Campeonato
 *
 * Este script realiza as seguintes ações:
 * - Cria a planilha do campeonato
 * - Cria as abas "Partidas", "Clubes" e "Formularios"
 * - Cria três formulários Google (Criar Campeonato, Cadastrar Partida, Editar Partida)
 * - Vincula os formulários à planilha
 * - Registra e exibe os GIDs das abas e as URLs dos formulários
 *
 * Uso:
 * 1. Acesse https://script.google.com/
 * 2. Crie um novo projeto e cole este script
 * 3. Execute a função criarEstruturaCampeonato()
 */

function criarEstruturaCampeonato() {
  const NOME_PLANILHA = 'Campeonato Municipal 2025';

  // 1. Criar planilha
  const planilha = SpreadsheetApp.create(NOME_PLANILHA);
  const planilhaId = planilha.getId();
  Logger.log(`📝 Planilha criada: ${planilha.getUrl()}`);

  // 2. Criar abas principais
  const partidasAba = planilha.getActiveSheet();
  partidasAba.setName('Partidas');

  const clubesAba = planilha.insertSheet('Clubes');
  const formulariosAba = planilha.insertSheet('Formularios');

  // 3. Obter GIDs
  const gids = {
    partidas: partidasAba.getSheetId(),
    clubes: clubesAba.getSheetId(),
    formularios: formulariosAba.getSheetId()
  };

  Logger.log('📄 GIDs das abas:');
  Object.entries(gids).forEach(([nome, gid]) => {
    Logger.log(`${nome}: ${gid}`);
  });

  // 4. Criar formulários
  const forms = [
    { nome: 'Criar Campeonato', form: FormApp.create('Criar Campeonato') },
    { nome: 'Cadastrar Partida', form: FormApp.create('Cadastrar Partida') },
    { nome: 'Editar Partida', form: FormApp.create('Editar Partida') }
  ];

  // 5. Criar aba de registro de formulários
  formulariosAba.clear();
  formulariosAba.appendRow(['Nome', 'URL']);

  forms.forEach((entry) => {
    const url = entry.form.getPublishedUrl();
    formulariosAba.appendRow([entry.nome, url]);

    // Vincular formulário à planilha
    entry.form.setDestination(FormApp.DestinationType.SPREADSHEET, planilhaId);

    Logger.log(`🔗 ${entry.nome}: ${url}`);
  });

  Logger.log('✅ Estrutura completa criada!');
}
