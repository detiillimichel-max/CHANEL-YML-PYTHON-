# CHANEL-YML-PYTHON-

Plataforma de descoberta, catalogação e navegação de fontes IPTV M3U/M3U8 e links públicos do Google Drive.

## Documento mestre
A especificação obrigatória é [docs/estruracompleta](docs/estruracompleta). Ela governa o escopo e a ordem de desenvolvimento.

## Arquitetura
- Motor IPTV Python: descoberta de playlists em repositórios públicos do GitHub, leitura limitada, parsing M3U, normalização e deduplicação.
- Motor Google Drive Python: pesquisa estruturada por SearXNG configurado, extração de URLs, IDs e resource keys.
- Catálogos separados: `data/iptv/catalog.json` e `data/drive/catalog.json`.
- Interface web própria em `web/`.
- GitHub Actions independentes: cada workflow só atualiza seu próprio catálogo.
- LibVLC somente em host Android nativo que implemente a ponte documentada; navegador e GitHub Pages não executam bibliotecas Android nativas.

## Configuração IPTV
A busca usa a API pública do GitHub para localizar repositórios com playlists. A primeira execução recomendada é pequena: 2 repositórios, 5 playlists e 50 canais. O workflow injeta automaticamente `GITHUB_TOKEN`.

## Configuração Google Drive
Configure a variável de repositório `SEARXNG_BASE_URL` com a URL-base de uma instância SearXNG que aceite `/search?format=json`. A resposta é validada em tempo de execução. Não se presume que uma instância pública funcione. Opcionalmente configure `DRIVE_QUERIES` como consultas separadas por quebra de linha ou ponto e vírgula.

## Segurança
Nenhum motor baixa vídeos completos, contorna DRM, autenticação ou permissões. Encontrar um link não significa que esteja acessível nem reproduzível. Nenhuma chave privada é enviada ao JavaScript.

## Publicação
O workflow de Pages publica a interface e os catálogos no mesmo site. A página inicial do repositório encaminha para `web/`.

## Desenvolvimento
Trabalhar somente na branch `develop`. `main` permanece preservada. Não abrir PR nem fazer merge. Não há etapa de testes automatizados, conforme a especificação.
