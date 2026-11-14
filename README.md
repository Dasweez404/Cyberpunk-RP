# NIGHT CITY LEGEND

Jeu à choix façon *Reigns* dans l'univers de **Cyberpunk 2077** (lore 2020 / RED / 2077 / Edgerunners).
Fais une carrière de 18 à 48 ans (retraite à choisir, jusqu'à 60 en vieillissant) à Night City **sans mourir** avec le meilleur score — ou choisis ton **Dernier Run**.

▶ Ouvre simplement `index.html` dans un navigateur (fichier autonome, mobile & desktop).

## Contenu
- Origines : Street Kid (Heywood / Watson / Santo Domingo), Corpo (Arasaka, Militech, Kang Tao, Biotechnica), Nomade (Aldecaldos, Wraiths, sans clan)
- 4 jauges : Santé, **Humanité** (cyberpsychose / MaxTac), Street Cred, Eddies — + 5 attributs (CORPS, RÉFLEXES, TECH, INT, COOL)
- ~180 cartes, relations (Jackie, Judy, Panam, Misty, Rogue, Kerry, Vik, Dex…), arcs de faction, prise de pouvoir, 11 fins spéciales : fixers (Dex, Wakako, Regina, Padre), ripperdocs (Viktor, Fingers), Rogue, Misty, Edgerunners (Maine, David, Lucy, Smasher), événements 2077 (Konpeki Plaza, Saburo, Tour Arasaka, Dogtown)…
- 16 factions à rejoindre, trahir ou quitter (Valentinos, Maelstrom, Tyger Claws, 6th Street, Voodoo Boys, Animals, Mox, Aldecaldos, Wraiths, Barghest, NCPD, Arasaka, Militech, Kang Tao, Biotechnica, Trauma Team) + **fonde la tienne**
- Carte de Night City : 18 quartiers à conquérir (assaut, hack, diplomatie ou argent)
- Cyberware (Sandevistan, Mantis, Monowire, Gorilla Arms, cyberdecks…), quickhacks, armes, véhicules
- Voies de carrière : Edgerunner, Netrunner, Fixer, Techie, Medtech, Rockerboy, Flic, Chef de faction
- 4 actes de vie, avec une ambition par acte, des traits permanents et une époque tirée au sort
- Poursuites : Police, Corpos, Gangs et Badlands te traquent ; à 100, capture (prison, exécution, désert)
- La Street Cred ouvre les grades de faction et les grandes actions
- Chaque vie est différente : événements tirés au sort, coup du sort de départ, missions secondaires générées, héritage de la vie précédente
- Score final, Hall of Fame (localStorage), sauvegarde automatique

## Dev
Hors ligne : `index.html` est autonome (ouvrable en fichier local). Servi en https, `sw.js` + `manifest.webmanifest` le rendent installable (PWA) et jouable sans connexion.

Sources dans `src/` ; `./build.sh` assemble `index.html`.
