# Reprodução e fronteira Android

## Navegador

A página GitHub Pages roda em navegador. O player usa o elemento HTML `video` apenas quando o registro IPTV tem uma URL de stream e a playlist foi considerada acessível. O suporte a HLS depende do navegador. CORS, codecs, headers, autenticação, políticas de autoplay e indisponibilidade podem impedir a reprodução.

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
