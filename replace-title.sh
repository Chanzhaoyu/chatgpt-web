#!/bin/sh

SITE_TITLE=${SITE_TITLE:-ChatGPT Web}

sed -i -E "s/<title>([^<]*)<\/title>/<title>${SITE_TITLE}<\/title>/g" /app/public/index.html