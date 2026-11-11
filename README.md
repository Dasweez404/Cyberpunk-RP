# NIGHT CITY LEGEND

Jeu à choix façon *Reigns* dans l'univers de **Cyberpunk 2077** (lore 2020 / RED / 2077 / Edgerunners).
Fais une carrière de 18 à 40 ans à Night City **sans mourir** avec le meilleur score — ou choisis ton **Dernier Run**.

▶ Ouvre simplement `index.html` dans un navigateur (fichier autonome, mobile & desktop).

## Contenu
- Origines : Street Kid (Heywood / Watson / Santo Domingo), Corpo (Arasaka, Militech, Kang Tao, Biotechnica), Nomade (Aldecaldos, Wraiths, sans clan)
- 4 jauges : Santé, **Humanité** (cyberpsychose / MaxTac), Street Cred, Eddies — + 5 attributs (CORPS, RÉFLEXES, TECH, INT, COOL)
- ~180 cartes, relations (Jackie, Judy, Panam, Misty, Rogue, Kerry, Vik, Dex…), arcs de faction, prise de pouvoir, 11 fins spéciales : fixers (Dex, Wakako, Regina, Padre), ripperdocs (Viktor, Fingers), Rogue, Misty, Edgerunners (Maine, David, Lucy, Smasher), événements 2077 (Konpeki Plaza, Saburo, Tour Arasaka, Dogtown)…
- 16 factions à rejoindre, trahir ou quitter (Valentinos, Maelstrom, Tyger Claws, 6th Street, Voodoo Boys, Animals, Mox, Aldecaldos, Wraiths, Barghest, NCPD, Arasaka, Militech, Kang Tao, Biotechnica, Trauma Team) + **fonde la tienne**
- Carte de Night City : 18 quartiers à conquérir (assaut, hack, diplomatie ou argent)
- Cyberware (Sandevistan, Mantis, Monowire, Gorilla Arms, cyberdecks…), quickhacks, armes, véhicules
- Voies de carrière : Edgerunner, Netrunner, Fixer, Techie, Medtech, Rockerboy, Flic, Chef de faction
- Équilibre à la Reigns : 4 blocs d'influence (Rue, Corpos, Loi, Badlands) à garder au milieu
- Score final, Hall of Fame (localStorage), sauvegarde automatique

## Dev
Hors ligne : `index.html` est autonome (ouvrable en fichier local). Servi en https, `sw.js` + `manifest.webmanifest` le rendent installable (PWA) et jouable sans connexion.

Sources dans `src/` ; `./build.sh` assemble `index.html`.
