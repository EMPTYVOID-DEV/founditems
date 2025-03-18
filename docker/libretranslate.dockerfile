FROM libretranslate/libretranslate:latest

ENV LT_LOAD_ONLY="ar,fr,en"

RUN libretranslate --load-only $LT_LOAD_ONLY --download-models
