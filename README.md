# Travel Planner

O aplicativo inicia sem nenhuma viagem ou registro pré-cadastrado.

## Conectar a uma planilha Google

1. Crie uma planilha Google vazia e copie o ID que aparece na URL.
2. Abra **Extensões → Apps Script** nessa planilha e substitua o código pelo conteúdo do arquivo google-apps-script/Code.gs.
3. Cole o ID na constante SPREADSHEET_ID.
4. Em **Implantar → Nova implantação**, escolha **Aplicativo da Web**, e copie a URL da implantação.
5. Cole essa URL na constante GOOGLE_APPS_SCRIPT_URL, no começo de app.js.

Ao salvar qualquer cadastro, as abas Viagens, Destinos, Passagens, Hospedagens, Passeios, Gastos, Programas de milhas e Câmbio são criadas e atualizadas automaticamente.

## Publicar no GitHub Pages

Envie a pasta outputs/travel-planner para um repositório GitHub. Nas configurações do repositório, abra **Pages** e selecione a branch principal e a pasta raiz como fonte.

> Uma implantação pública do Apps Script permite gravações para quem possuir a URL. Para uma versão pública, use autenticação Google antes de compartilhar o site.
