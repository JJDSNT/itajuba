## 📌 Objetivo

Este projeto consiste no desenvolvimento de uma **plataforma digital** para o **Clube de Malha Itajubá**, como parte das atividades de **extensão universitária** do curso de **Análise e Desenvolvimento de Sistemas** da **Universidade Cruzeiro do Sul**.

---

## 🚀 Funcionalidades

✅ **Resultados de Partidas** → Registro e consulta de resultados dos jogos.  
Acompanhamento das partidas dos campeonatos: as que ainda vão acontecer e o resultado das que já ocorreram.

---

## 🛠 Tecnologias Utilizadas

- **Frontend** → Desenvolvido em **Angular**, responsável pela interface do usuário e comunicação com o backend.
- **PWA** → Permite acesso direto em dispositivos móveis com instalação como app.
- **Backend** → Baseado no **Google Sheets**, onde os dados são armazenados e atualizados.

---

## 🔧 Configuração e Execução

- O comando de build para produção é:

```bash
npm run build:prod
```

- O endereço da planilha do Google Sheets pode ser configurado via variável de ambiente.

```bash
NG_APP_PLANILHA_URL=https://docs.google.com/spreadsheets/d/<ID>/export?format=csv&gid=<GID>
```

## 🌐 Alternativas recomendadas para SPA

Para uma melhor experiência, especialmente se SEO é importante, recomenda-se usar plataformas que suportam SPAs de forma nativa:

- **Netlify** → Suporte a redirecionamentos e SPA-ready.
- **Cloudflare Pages** → Configuração fácil para SPAs.
- **Vercel** → Foco em front-end moderno e deploy contínuo.
- **Azure Static Web Apps** → Integração nativa com GitHub e suporte completo a SPAs.

Essas plataformas permitem configurar regras de redirecionamento que retornam status HTTP 200 para todas as rotas, garantindo compatibilidade total com SPAs.

---

## ⚠️ Considerações sobre hospedagem no GitHub Pages

O GitHub Pages **não oferece suporte nativo ao roteamento de Single Page Applications (SPAs)**. Isso significa que, ao acessar diretamente uma rota que não seja a raiz (exemplo: `https://seusite.github.io/rota`), o servidor retornará erro 404, pois procura por um arquivo que não existe.

---

### 🛠️ Soluções possíveis

**1. Uso de HashLocationStrategy**  
Configure sua aplicação Angular para usar `HashLocationStrategy`. As URLs terão o formato `https://seusite.github.io/#/rota`, e o conteúdo após o `#` será tratado inteiramente no lado do cliente.

**2. Criação de um arquivo `404.html`**  
Você pode gerar uma cópia do `index.html` com o nome `404.html` após o build. Isso garante que, mesmo em erro 404, o Angular carregue e trate a URL corretamente.  
⚠️ Atenção: o status HTTP retornado ainda será 404, o que pode impactar o SEO e causar mensagens de erro visuais em navegadores como o Brave.

---

