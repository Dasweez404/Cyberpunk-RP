#!/bin/sh
# Assemble src/* en un seul fichier index.html autonome
cd "$(dirname "$0")"
{
cat <<'HEAD'
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#07070d">
<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon.svg"><link rel="apple-touch-icon" href="icon.svg">
<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">
<title>Night City Legend</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<style>
HEAD
cat src/style.css
echo '</style></head><body><div id="root"><div style="color:#fcee0a;font:700 18px sans-serif;text-align:center;margin:40vh auto 0;letter-spacing:.2em">NIGHT CITY…<noscript><br>JavaScript requis</noscript></div></div><script>'
cat src/data.js src/cards.js src/cards2.js src/cards3.js src/cards4.js src/cards5.js src/cards6.js src/engine.js src/ui.js
echo "if('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(()=>{});"
echo '</script></body></html>'
} > index.html
echo "index.html: $(wc -c < index.html) octets"
