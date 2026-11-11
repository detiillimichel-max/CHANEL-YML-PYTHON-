# Arquitetura

A especificação normativa é [estruracompleta](estruracompleta).

## Fronteiras

1. IPTV escreve exclusivamente em `data/iptv/catalog.json`.
2. Google Drive escreve exclusivamente em `data/drive/catalog.json`.
3. A interface lê os dois arquivos de forma independente.
4. Os workflows executam na branch `develop` e fazem commit apenas do seu arquivo de catálogo.
5. A publicação Pages distribui `web/` e `data/` preservando a relação de caminhos.

## Fluxo de execução

- IPTV: GitHub repository search → árvore de arquivos → playlists M3U/M3U8 → validação limitada → parsing → deduplicação cumulativa.
- Drive: SearXNG JSON configurado → resultados indexados → extração de URL/ID/resource key → deduplicação cumulativa.
- Web: carrega os dois JSON independentemente, apresenta estados e não confunde descoberta com disponibilidade.
- Reprodução: navegador usa HTMLMediaElement quando há suporte; host Android deve implementar a ponte nativa LibVLC.

## Isolamento

Os workflows usam `git add -- data/iptv/catalog.json` ou `git add -- data/drive/catalog.json`. Nenhum deles adiciona a árvore inteira. Conflitos concorrentes são reduzidos por grupos `concurrency` distintos; ambos fazem push apenas para `develop`.
