# Motor IPTV

O motor pesquisa repositórios públicos com a API de pesquisa do GitHub, percorre a árvore do repositório e seleciona arquivos terminados em `.m3u` ou `.m3u8`.

Cada playlist é lida com limite máximo de 1.500.000 bytes e timeouts finitos. O parser só cria entradas de canal quando encontra cabeçalho M3U e par `#EXTINF` + URL HTTP(S). URLs são normalizadas sem remover query strings, pois parâmetros podem ser necessários à origem.

A validação confirma apenas se a playlist respondeu e se há sintaxe M3U reconhecível. Não baixa segmentos nem transmissões completas e não comprova reprodução de cada canal.

Limites manuais: repositórios, playlists e registros. Primeira execução recomendada: 2, 5 e 50.
