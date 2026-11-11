#!/bin/sh
# Assemble src/* en un seul fichier index.html autonome
cd "$(dirname "$0")"
{
cat <<'HEAD'
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="theme-color" content="#07070d">
<title>Night City Legend</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
HEAD
cat src/style.css
echo '</style></head><body><div id="root"></div><script>'
cat src/data.js src/cards.js src/engine.js src/ui.js
echo '</script></body></html>'
} > index.html
echo "index.html: $(wc -c < index.html) octets"
