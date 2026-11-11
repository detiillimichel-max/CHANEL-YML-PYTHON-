# Reprodução e fronteira Android

## Botão Abrir no VLC (Android)

A interface web oferece um botão **Abrir no VLC** por registro IPTV com URL HTTP/HTTPS válida. No Android, o botão envia um Intent explícito ao pacote `org.videolan.vlc`, preservando host, caminho, consulta e esquema HTTP/HTTPS da URL original. A página não baixa nem reescreve o stream.

O navegador e o Android precisam permitir a abertura de intents externos, e o VLC precisa estar instalado. A presença do botão confirma apenas que existe uma URL válida para encaminhar; não garante que a origem ou o codec funcionarão no VLC.

## Player web

O player tenta, nesta ordem:
1. HLS nativo quando o navegador declara suporte.
2. HLS.js (carregado sob demanda) quando Media Source Extensions estiver disponível.
3. Reprodução direta para formatos não-HLS suportados pelo elemento `video`.

HLS.js não elimina CORS. O manifesto e os segmentos precisam permitir acesso cross-origin. Uma página HTTPS também pode ser impedida de carregar mídia HTTP por mixed content. Falhas do navegador devem orientar o usuário a tentar o VLC, sem marcar o stream como reproduzido.

## Android nativo / LibVLC

JavaScript executado no GitHub Pages não carrega nem executa LibVLC. Um aplicativo Android nativo que hospede esta interface deve implementar uma ponte explícita, por exemplo:

```kotlin
interface NativeVlcBridge {
    fun play(url: String)
    fun pause()
    fun stop()
    fun setVolume(value: Float)
}
```

O host deve validar esquema HTTP(S), encaminhar a URL ao LibVLC, tratar callbacks de estado/erro, liberar MediaPlayer/LibVLC e não expor credenciais. Esta interface web não declara a ponte instalada e não finge que LibVLC está disponível. Nenhum repositório Android externo é alterado por este projeto.
