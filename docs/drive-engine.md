# Motor Google Drive

O motor usa uma instância SearXNG informada por `SEARXNG_BASE_URL`. A URL é validada em execução: a resposta deve ser JSON e conter uma lista `results`. Uma instância que não cumpra o contrato encerra a execução com erro claro; não há fallback silencioso nem instância pública presumida.

Consultas padrão: documentários, filmes, séries e M3U/M3U8 no domínio drive.google.com. `DRIVE_QUERIES` pode substituir a lista.

O parser reconhece IDs em `/file/d/ID` e `?id=ID`, preserva `resourcekey` quando fornecida e não tenta contornar permissões. Os metadados vêm somente dos resultados estruturados; MIME type e acesso permanecem não verificados quando não fornecidos.
