# Esquema dos catálogos

Ambos os arquivos usam envelope JSON:

- `schema_version`: versão inteira do esquema.
- `updated_at`: instante UTC ISO-8601 ou null antes da primeira execução.
- `item_count`: quantidade cumulativa.
- `items`: registros.

## IPTV

Os registros de canal podem conter `id`, `name`, `group`, `logo`, `source`, `playlist_url`, `stream_url`, `format`, `discovered_at`, `checked_at`, `availability`, `playback_status`, `source_type` e `validation`. Campos ausentes não devem ser inventados.

## Google Drive

Os registros podem conter `id`, `title`, `title_source`, `drive_id`, `url`, `resourcekey`, `mime_type`, `file_extension`, `source_query`, `discovered_at`, `availability`, `playback_status`, `source_type` e `description`.

## Semântica

- IPTV: `accessible` refere-se à playlist consultada, não prova que cada stream individual reproduza.
- Drive: `not_checked` significa que o resultado foi encontrado no índice; não afirma acesso.
- `playback_status=not_confirmed` ou `not_tested` não equivale a reprodução confirmada.
- `title_source=default` identifica títulos genéricos criados pelo motor.
