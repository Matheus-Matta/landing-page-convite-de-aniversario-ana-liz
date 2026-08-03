# Convite de aniversário — Ana Liz

Site estático com convite, sugestões de presentes e confirmação de presença.

## Configuração

Edite `assets/config.js` e informe:

- `webhookUrl`: URL de produção do Webhook do n8n.
- `mapsUrl`: link completo da localização da festa no Google Maps.

O formulário envia um `POST` JSON com `nome`, `whatsapp`, `presenca`, `quantidade_pessoas`, `mensagem`, `evento` e `enviado_em`.

## n8n e CORS

No workflow, use um nó **Webhook** com método `POST`, responda com o nó **Respond to Webhook** e retorne status `200`. Se o n8n estiver atrás de proxy, permita a origem do GitHub Pages nas respostas a `OPTIONS` e `POST`:

```
Access-Control-Allow-Origin: https://matheus-matta.github.io
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

O navegador controla CORS; ele precisa ser liberado no n8n/proxy, não no HTML.

## Publicação

O workflow `.github/workflows/deploy-pages.yml` publica automaticamente a cada commit enviado à branch `main`. No GitHub, em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.

Para testar localmente, execute um servidor HTTP na raiz do projeto, por exemplo `python -m http.server 8080`.
