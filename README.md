# CHANEL-YML-PYTHON-

Repositório dos dois motores de descoberta e catalogação do ecossistema MEDEIA.

## Objetivo fechado

Construir **dois motores independentes**, executados por GitHub Actions, escritos em Python e orquestrados por YAML. Eles geram catálogos JSON separados para consumo pelo aplicativo **MEDEIA-ANDROID**.

Este repositório contém os motores e seus catálogos. A interface Android e a reprodução ficam no repositório MEDEIA-ANDROID.

## Arquitetura

```text
GitHub Actions (YAML) + Python
  ├── Motor IPTV
  │     ├── Descoberta de fontes M3U/M3U8
  │     ├── Normalização e validação técnica
  │     └── data/iptv/catalog.json
  │
  └── Motor Google Drive
        ├── Consultas site:drive.google.com
        ├── Extração e deduplicação de URLs/IDs
        └── data/drive/catalog.json

MEDEIA-ANDROID
  ├── Interface e biblioteca
  └── VLC/LibVLC para reprodução compatível
```

## Motor 1 — IPTV (M3U/M3U8)

- Descobrir e catalogar URLs de playlists M3U e M3U8.
- Aceitar fontes públicas e autorizadas.
- Normalizar URLs e metadados de canais.
- Validar sintaxe, tipo de conteúdo e disponibilidade com verificações HTTP limitadas.
- Não baixar transmissões completas, contornar autenticação, DRM ou restrições de acesso.
- Gerar `data/iptv/catalog.json`.

## Motor 2 — Google Drive

- Executar consultas direcionadas, por exemplo: `site:drive.google.com m3u`, `site:drive.google.com m3u8` e consultas de arquivos públicos.
- Extrair links, IDs e metadados que estejam disponíveis nos resultados indexados.
- Deduplicar resultados e preservar a origem da descoberta.
- Marcar acesso e reprodução como não verificados até que sejam testados separadamente.
- Não contornar permissões nem presumir que um resultado indexado seja acessível.
- Gerar `data/drive/catalog.json`.

## Integração com MEDEIA-ANDROID

O aplicativo consome os dois catálogos JSON por URL HTTPS. O Android mantém a interface, pesquisa, biblioteca e reprodução usando VLC/LibVLC. Este repositório não modifica o código Android.

## Segurança e integridade

- Os dois motores e os dois catálogos permanecem separados.
- Execuções experimentais começam com limites pequenos e configuráveis.
- Novos resultados são deduplicados antes de atualizar catálogos.
- Nenhum workflow deve apagar ou sobrescrever o catálogo do outro motor.
- Segredos ficam em GitHub Actions Secrets/Variables, nunca no código.
- Alterações são desenvolvidas primeiro na branch `develop`; `main` só recebe mudanças após validação e autorização explícita.

## Estrutura planejada

```text
.github/workflows/
  iptv-engine.yml
  drive-engine.yml
engine/
  iptv/
  drive/
data/
  iptv/catalog.json
  drive/catalog.json
tests/
docs/
```

## Critérios de entrega

1. Cada motor executa independentemente no GitHub Actions.
2. Cada motor gera e atualiza somente seu próprio catálogo.
3. Os catálogos têm esquema documentado e URLs deduplicadas.
4. Testes offline cobrem parsing, normalização, deduplicação e proteção dos arquivos.
5. O MEDEIA-ANDROID consegue consumir ambos os JSON por HTTPS.
6. A reprodução é responsabilidade do VLC/LibVLC no aplicativo; encontrar uma URL não significa que ela seja reproduzível.

## Regra de escopo

O trabalho deste repositório limita-se aos **dois motores Python/YAML, seus workflows e seus catálogos**. Não adicionar outros motores, projetos, painéis ou funcionalidades fora deste objetivo sem solicitação explícita.
