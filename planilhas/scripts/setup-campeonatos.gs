/**
 * Setup Inicial dos Campeonatos
 *
 * Cria:
 * - A planilha mãe ("Planilha dos Campeonatos")
 * - A aba "Campeonatos" com todos os campos necessários
 * - Um formulário para Criar/Editar/Apagar campeonatos
 * - Conecta o formulário à planilha mãe
 * - Restringe o acesso do formulário de administração ao email que executou o script
 * - Envia as variáveis de ambiente para o email da pessoa logada (se disponível)
 * - Também faz Logger separado para debug visual
 *
 * Observações futuras:
 * - Poderíamos adaptar a configuração para permitir 2 ou 3 administradores
 *   (em vez de apenas 1 email, usar uma lista de emails e adicionar todos como editores).
 * const emailsAutorizados = ['admin1@email.com', 'admin2@email.com'];
 * emailsAutorizados.forEach(email => arquivoFormulario.addEditor(email));
 */
function criarSetupInicial() {
  const NOME_PLANILHA_MAE = 'Planilha dos Campeonatos';
  const NOME_ABA_MAE = 'Campeonatos';
  const NOME_FORMULARIO = 'Formulário de Criação/Edição/Remoção de Campeonatos';

  // 1. Criar Planilha Mãe
  const planilhaMae = SpreadsheetApp.create(NOME_PLANILHA_MAE);
  const planilhaMaeId = planilhaMae.getId();
  Logger.log('📄 Planilha dos Campeonatos criada: ' + planilhaMae.getUrl());

  // 2. Renomear aba principal e adicionar cabeçalhos COMPLETOS
  const aba = planilhaMae.getActiveSheet();
  aba.setName(NOME_ABA_MAE);
  aba.appendRow([
    'Nome do Campeonato',
    'Nome Interno (slug)',
    'Data de Início',
    'Data de Término',
    'Observações',
    'Planilha URL',
    'GID Partidas',
    'GID Clubes',
    'GID Formularios',
    'URL Form Criar',
    'URL Form Cadastrar',
    'URL Form Editar'
  ]);

  // 3. Criar Formulário de Criar/Editar/Apagar Campeonato
  const formulario = FormApp.create(NOME_FORMULARIO);
  const formularioUrl = formulario.getPublishedUrl();
  Logger.log('📝 Formulário criado: ' + formularioUrl);

  formulario.addMultipleChoiceItem()
    .setTitle('Ação')
    .setChoices([
      formulario.createChoice('Criar'),
      formulario.createChoice('Editar'),
      formulario.createChoice('Apagar')
    ])
    .setRequired(true);

  formulario.addTextItem().setTitle('Nome do Campeonato').setRequired(true);
  formulario.addTextItem().setTitle('Nome Interno (slug)').setRequired(false);
  formulario.addDateItem().setTitle('Data de Início').setRequired(false);
  formulario.addDateItem().setTitle('Data de Término').setRequired(false);
  formulario.addParagraphTextItem().setTitle('Observações').setRequired(false);

  // 4. Vincular respostas do formulário à Planilha Mãe
  formulario.setDestination(FormApp.DestinationType.SPREADSHEET, planilhaMaeId);

  // 5. 🔒 Restringir o acesso do Formulário Admin
  const emailUsuario = Session.getActiveUser().getEmail();
  if (emailUsuario) {
    const arquivoFormulario = DriveApp.getFileById(formulario.getId());
    arquivoFormulario.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    arquivoFormulario.addEditor(emailUsuario);

    Logger.log(`🔒 Acesso restrito configurado para o formulário admin (${emailUsuario})`);
  } else {
    Logger.log('⚠️ Não foi possível detectar o email do usuário para configurar o acesso ao formulário.');
  }

  // 6. Montar variáveis de ambiente
  const gidAbaCampeonatos = aba.getSheetId();
  const urlCsvPlanilhaMae = `https://docs.google.com/spreadsheets/d/${planilhaMaeId}/export?format=csv&gid=${gidAbaCampeonatos}`;

  // 7. Logger completo (separado)
  Logger.log('🔧 Variáveis de ambiente para configuração:');
  Logger.log('');
  Logger.log(`NG_APP_PLANILHA_MAE_URL=${urlCsvPlanilhaMae}`);
  Logger.log(`NG_APP_FORMULARIO_CAMPEONATO_URL=${formularioUrl}`);
  Logger.log('');
  Logger.log('✅ Setup inicial completo!');

  // 8. Enviar Email
  if (emailUsuario) {
    const assunto = 'Setup Inicial - Variáveis de Ambiente do Sistema de Campeonatos';
    const corpoEmail = `
Setup inicial concluído com sucesso!

🔧 Variáveis de ambiente para configuração:

NG_APP_PLANILHA_MAE_URL=${urlCsvPlanilhaMae}
NG_APP_FORMULARIO_CAMPEONATO_URL=${formularioUrl}

✅ Lembre-se de preencher estas variáveis no environment.ts do seu projeto Angular.
    `.trim();

    MailApp.sendEmail({
      to: emailUsuario,
      subject: assunto,
      body: corpoEmail
    });

    Logger.log(`📧 Email enviado para ${emailUsuario}`);
  }
}
