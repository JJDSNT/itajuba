## 📌 Objetivo

Este projeto consiste no desenvolvimento de uma **plataforma digital** para o **Clube de Malha Itajubá**, como parte das atividades de **extensão universitária** do curso de **Análise e Desenvolvimento de Sistemas** da **Universidade Cruzeiro do Sul**.

O sistema tem como objetivo principal:
- Acompanhar e divulgar resultados de partidas de malha.
- Oferecer uma plataforma de administração de campeonatos totalmente baseada em tecnologias gratuitas (Google Sheets + Google Forms).
- Permitir a criação e gestão dinâmica de múltiplos campeonatos.


## 🚀 Funcionalidades

✅ **Resultados de Partidas** → Registro e consulta de resultados dos jogos.  
✅ **Acompanhamento de Campeonatos** → Acesso dinâmico a múltiplos campeonatos cadastrados.  
✅ **Criação de Campeonatos** → Administrações autorizadas podem criar, editar ou apagar campeonatos via formulário protegido do Google.


## 🛠 Tecnologias Utilizadas

- **Frontend** → Desenvolvido em **Angular**, responsável pela interface do usuário e comunicação com o backend.
- **PWA** → Permite acesso direto em dispositivos móveis com instalação como app.
- **Backend** → Baseado no **Google Sheets** como banco de dados principal.
- **Administração** → Utilização de **Google Forms** para cadastro e gestão de campeonatos.

## 🔧 Configuração e Execução

- O comando de build para produção é:

```bash
npm run build:prod
```

- As variáveis de ambiente necessárias são:

```bash
NG_APP_PLANILHA_MAE_URL=https://docs.google.com/spreadsheets/d/<ID>/export?format=csv&gid=<GID_DA_ABA_CAMPEONATOS>
NG_APP_FORMULARIO_CAMPEONATO_URL=https://docs.google.com/forms/d/e/<ID_DO_FORMULARIO>/viewform
```
Observação:
A Planilha Mãe gerencia todos os campeonatos. As respostas do Formulário de Criação são processadas para criar novas planilhas e formulários automaticamente.

## 🌐 Alternativas recomendadas para SPA

Para uma melhor experiência, especialmente se SEO é importante, recomenda-se usar plataformas que suportam SPAs de forma nativa:

- **Netlify** → Suporte a redirecionamentos e SPA-ready.
- **Cloudflare Pages** → Configuração fácil para SPAs.
- **Vercel** → Foco em front-end moderno e deploy contínuo.
- **Azure Static Web Apps** → Integração nativa com GitHub e suporte completo a SPAs.

Essas plataformas permitem configurar regras de redirecionamento que retornam status HTTP 200 para todas as rotas, garantindo compatibilidade total com SPAs.

## ⚠️ Considerações sobre hospedagem no GitHub Pages

O GitHub Pages **não oferece suporte nativo ao roteamento de Single Page Applications (SPAs)**. Isso significa que, ao acessar diretamente uma rota que não seja a raiz (exemplo: `https://seusite.github.io/rota`), o servidor retornará erro 404, pois procura por um arquivo que não existe.

### 🛠️ Soluções possíveis

**1. Uso de HashLocationStrategy**  
Configure sua aplicação Angular para usar `HashLocationStrategy`. As URLs terão o formato `https://seusite.github.io/#/rota`, e o conteúdo após o `#` será tratado inteiramente no lado do cliente.

**2. Criação de um arquivo `404.html`**  
Você pode gerar uma cópia do `index.html` com o nome `404.html` após o build. Isso garante que, mesmo em erro 404, o Angular carregue e trate a URL corretamente.  
⚠️ Atenção: o status HTTP retornado ainda será 404, o que pode impactar o SEO e causar mensagens de erro visuais em navegadores como o Brave.


## 🛠️ Estrutura Administrativa (Administração de Campeonatos)

- Uma **Planilha Mãe** centraliza todos os campeonatos (**Planilha dos Campeonatos**).
- Um **Formulário Google** permite que administradores autorizados **criem**, **editem** ou **apaguem** campeonatos.
- **Scripts Google Apps** automatizam:
  - A criação das planilhas específicas para cada campeonato.
  - A criação dos formulários de cadastro e edição de partidas.
  - A integração entre planilhas e formulários.
- O **controle de acesso ao formulário** é gerenciado nativamente pelo Google:
  - Exigência de login Google obrigatório.
  - Restrição de acesso a usuários autorizados via configuração no próprio Google Forms.

