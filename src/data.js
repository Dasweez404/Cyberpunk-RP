/* =====================================================================
   NIGHT CITY LEGEND — données du jeu (lore Cyberpunk 2077 / 2020 / RED)
   ===================================================================== */
const START_YEAR = 2070, START_AGE = 18, RETIRE_AGE = 48, HARD_AGE = 60, STEP = 4, BASE = 5; // STEP = mois par carte ; BASE = période de référence des revenus

const ATTRS = {
  body:{n:`CORPS`,d:`Force, endurance, encaisser les coups`},
  ref:{n:`RÉFLEXES`,d:`Vitesse, tir, conduite, esquive`},
  tech:{n:`TECHNIQUE`,d:`Bidouille, réparation, armes, chrome`},
  int:{n:`INTELLECT`,d:`Piratage, analyse, culture de la rue`},
  cool:{n:`SANG-FROID`,d:`Charisme, nerfs, négociation`},
};

const ROLES = {
  solo:`Edgerunner`, net:`Netrunner`, fixer:`Fixer`, tech:`Techie`, med:`Medtech`,
  rocker:`Rockerboy`, corpo:`Corpo`, nomad:`Nomade`, cop:`Flic NCPD`, boss:`Chef de faction`
};

/* ---------- Personnages (portraits procéduraux) ---------- */
const WHO = {
  narr:{n:`Night City`,r:`La Ville`,c:`#fcee0a`,st:`hood`,sk:30},
  you:{n:`Toi`,r:`Pensée`,c:`#00f0ff`,st:`short`,sk:25},
  dex:{n:`Dexter DeShawn`,r:`Fixer · Afterlife`,c:`#00f0ff`,st:`shades`,sk:20},
  rogue:{n:`Rogue Amendiares`,r:`Reine de l'Afterlife`,c:`#ff2a6d`,st:`long`,sk:30},
  vik:{n:`Viktor Vektor`,r:`Ripperdoc · Little China`,c:`#05ffa1`,st:`bald`,sk:20},
  misty:{n:`Misty Olszewski`,r:`Esoterica · Little China`,c:`#c77dff`,st:`long`,sk:30},
  fingers:{n:`Fingers Abernathy`,r:`Ripperdoc · Dangereux`,c:`#ff9f1c`,st:`mask`,sk:28},
  wakako:{n:`Wakako Okada`,r:`Fixer · Japantown`,c:`#ff2a6d`,st:`long`,sk:32},
  regina:{n:`Regina Jones`,r:`Fixer · Véhicules`,c:`#fcee0a`,st:`mohawk`,sk:24},
  padre:{n:`Padre`,r:`Fixer · Heywood`,c:`#ff9f1c`,st:`cap`,sk:26},
  jackie:{n:`Jackie Welles`,r:`Mercenaire · Heywood`,c:`#ff9f1c`,st:`short`,sk:26},
  mama:{n:`Mama Welles`,r:`El Coyote Cojo`,c:`#ff9f1c`,st:`long`,sk:26},
  maine:{n:`Maine`,r:`Chef de crew · Edgerunner`,c:`#ff2a6d`,st:`helmet`,sk:22},
  david:{n:`David Martinez`,r:`Edgerunner`,c:`#fcee0a`,st:`mohawk`,sk:28},
  lucy:{n:`Lucy`,r:`Netrunner · Edgerunner`,c:`#c77dff`,st:`long`,sk:30},
  rebecca:{n:`Rebecca`,r:`Edgerunner · Petite et létale`,c:`#ff2a6d`,st:`short`,sk:30},
  smasher:{n:`Adam Smasher`,r:`Arasaka · Cyborg intégral`,c:`#ff2a6d`,st:`visor`,sk:5},
  johnny:{n:`Johnny Silverhand`,r:`Légende · Samurai`,c:`#fcee0a`,st:`shades`,sk:22},
  kerry:{n:`Kerry Eurodyne`,r:`Rockerboy`,c:`#c77dff`,st:`long`,sk:26},
  lizzie:{n:`Lizzie Wizzy`,r:`Lizzie's Bar · Mox`,c:`#ff2a6d`,st:`mohawk`,sk:28},
  judy:{n:`Judy Alvarez`,r:`Technicienne BD · Mox`,c:`#05ffa1`,st:`short`,sk:30},
  panam:{n:`Panam Palmer`,r:`Aldecaldos`,c:`#ff9f1c`,st:`cap`,sk:28},
  saul:{n:`Saul Bright`,r:`Chef des Aldecaldos`,c:`#ff9f1c`,st:`cap`,sk:22},
  royce:{n:`Royce`,r:`Maelstrom · Totentanz`,c:`#ff2a6d`,st:`visor`,sk:10},
  brick:{n:`Brick`,r:`Chef des Voodoo Boys`,c:`#05ffa1`,st:`hood`,sk:15},
  sas:{n:`Sasquatch`,r:`Chef des Animals`,c:`#ff9f1c`,st:`bald`,sk:25},
  capitan:{n:`El Capitán`,r:`Chef des Valentinos`,c:`#ffb000`,st:`cap`,sk:27},
  claws:{n:`Lieutenant Tyger Claws`,r:`Tyger Claws`,c:`#ff2a6d`,st:`mask`,sk:34},
  sixth:{n:`Vétéran de la 6th Street`,r:`6th Street`,c:`#00f0ff`,st:`helmet`,sk:24},
  meredith:{n:`Meredith Stout`,r:`Militech · Cadre`,c:`#05ffa1`,st:`short`,sk:30},
  takemura:{n:`Goro Takemura`,r:`Arasaka · Garde du corps`,c:`#ff2a6d`,st:`short`,sk:32},
  hanako:{n:`Hanako Arasaka`,r:`Arasaka`,c:`#ff2a6d`,st:`long`,sk:35},
  hansen:{n:`Kurt Hansen`,r:`Barghest · Dogtown`,c:`#05ffa1`,st:`helmet`,sk:24},
  delamain:{n:`Delamain`,r:`IA de taxi · Delamain`,c:`#fcee0a`,st:`visor`,sk:5},
  ncpd:{n:`Agent NCPD`,r:`Night City Police Dept.`,c:`#00f0ff`,st:`helmet`,sk:26},
  maxtac:{n:`MaxTac`,r:`Unité anti-cyberpsychos`,c:`#ff2a6d`,st:`visor`,sk:5},
  scav:{n:`Scav`,r:`Charognard d'organes`,c:`#ff9f1c`,st:`mask`,sk:28},
  corpo:{n:`Cadre corpo`,r:`Corporation`,c:`#05ffa1`,st:`shades`,sk:30},
  fix:{n:`Contact de la rue`,r:`Quelqu'un qui sait`,c:`#00f0ff`,st:`hood`,sk:26},
  nomad:{n:`Nomade`,r:`Badlands`,c:`#ff9f1c`,st:`cap`,sk:26},
  doc:{n:`Doc`,r:`Medtech`,c:`#05ffa1`,st:`mask`,sk:28},
  lover:{n:`Quelqu'un`,r:`Une rencontre`,c:`#ff2a6d`,st:`long`,sk:28},
  psycho:{n:`Cyberpsycho`,r:`Alerte NCPD`,c:`#ff2a6d`,st:`visor`,sk:6},
};

/* ---------- Factions ---------- */
const FAC = {
  valentinos:{n:`Valentinos`,c:`#ffb000`,k:`gang`,leader:`capitan`,home:`wellsprings`,foes:[`maelstrom`,`tygers`],
    d:`Gang de Heywood. Foi, famille, honneur. Ils protègent leur barrio et ne trahissent jamais les leurs.`,
    perk:`+1 CORPS · protection à Wellsprings`,at:{body:1},
    lines:[`Un Valentino te demande de livrer des armes à une église de Heywood.`,`Un vieux du barrio a un contentieux avec des Maelstrom. À toi de le régler.`,`El Capitán veut des ex-voto en eddies : une collecte "protection" à faire.`]},
  maelstrom:{n:`Maelstrom`,c:`#ff2a6d`,k:`gang`,leader:`royce`,home:`northside`,foes:[`valentinos`,`mox`,`sixth`],
    d:`Chromés jusqu'à l'os, adorateurs du progrès sans limite. Totentanz est leur forteresse. Ils t'ouvriront les portes du chrome… et de la cyberpsychose.`,
    perk:`+1 RÉFLEXES · chrome à prix cassé (−10 % Humanité par promo)`,at:{ref:1},
    lines:[`Royce a besoin de mains pour un casse sanglant dans un entrepôt de Northside.`,`Un lot de cyberware volé est à récupérer. Les Maelstrom ne font jamais dans la dentelle.`,`Une démonstration de force contre un petit gang : les Maelstrom veulent du bruit.`]},
  tygers:{n:`Tyger Claws`,c:`#ff4d6d`,k:`gang`,leader:`claws`,home:`japantown`,foes:[`maelstrom`,`mox`],
    d:`Le gang des tatouages de tigre. Japantown et Kabuki. Racket, trafic d'êtres humains, dojo.`,
    perk:`+1 SANG-FROID · entrée libre à Japantown`,at:{cool:1},
    lines:[`Un commerçant de Little China a "oublié" de payer son tribut aux Tyger Claws.`,`Un convoi de ripperdocs illégaux est à escorter jusqu'à Japantown.`,`Un duel d'honneur dans un dojo. Le perdant paie en cash — ou en sang.`]},
  sixth:{n:`6th Street`,c:`#00f0ff`,k:`gang`,leader:`sixth`,home:`arroyo`,foes:[`animals`,`maelstrom`],
    d:`Anciens soldats et patriotes autoproclamés de Santo Domingo. Ils patrouillent leurs rues, chassent les "indésirables" et rêvent d'une Amérique unie.`,
    perk:`+1 TECHNIQUE · armes de guerre à prix réduit`,at:{tech:1},
    lines:[`Une patrouille de la 6th Street va "nettoyer" un carrefour. Veux-tu en être ?`,`Un dépôt de munitions militaires change de main. La 6th Street te veut en couverture.`,`Des Scavs rôdent à Santo Domingo. On t'envoie les repousser.`]},
  voodoo:{n:`Voodoo Boys`,c:`#05ffa1`,k:`gang`,leader:`brick`,home:`coastview`,foes:[`arasaka`],
    d:`Netrunners haïtiens de Pacifica. Ils connaissent le Blackwall mieux que quiconque et ne font confiance à personne.`,
    perk:`+1 INTELLECT · accès au marché des quickhacks`,at:{int:1},
    lines:[`Brick veut qu'on perce le pare-feu d'une corpo mineure. Du boulot propre.`,`Un netrunner voodoo disparu : on t'envoie fouiller le Net profond.`,`Un transfert de données sensibles à Pacifica. Zéro trace, zéro erreur.`]},
  animals:{n:`Animals`,c:`#ff9f1c`,k:`gang`,leader:`sas`,home:`rancho`,foes:[`sixth`],
    d:`Culturistes sous stéroïdes et chrome musculaire de Santo Domingo. Respect de la force brute.`,
    perk:`+1 CORPS · gagne les bagarres plus facilement`,at:{body:1},
    lines:[`Sasquatch organise un combat clandestin. Il faut un nouveau champion.`,`Un petit dealer croit pouvoir se passer des Animals. Remets-le à sa place.`,`Des bidons de stéroïdes doivent traverser la ville sans que la 6th Street ne les voie.`]},
  mox:{n:`Les Mox`,c:`#ff6ec7`,k:`mox`,leader:`lizzie`,home:`kabuki`,foes:[`tygers`,`maelstrom`],
    d:`Le collectif qui protège les travailleuses du sexe. Lizzie's Bar est leur cœur. Ils ne se laissent plus faire.`,
    perk:`+1 SANG-FROID · +Humanité à chaque promo`,at:{cool:1},
    lines:[`Un client violent rôde autour d'une des filles du Lizzie's Bar. Les Mox ont besoin de toi.`,`Un racketteur des Tyger Claws harcèle le club. Fais-lui passer l'envie de revenir.`,`Judy a besoin d'aide pour une BD volée à récupérer.`]},
  aldecaldos:{n:`Aldecaldos`,c:`#ff9f1c`,k:`clan`,leader:`saul`,home:`badlands`,foes:[`wraiths`],
    d:`La famille nomade de Saul Bright. Un clan qui tient parole, répare tout, et défend la liberté des Badlands.`,
    perk:`+1 TECHNIQUE · véhicule du clan`,at:{tech:1},
    lines:[`Panam a besoin d'un pilote pour un convoi qui doit éviter les Raffen Shiv.`,`Une pièce rare pour le moteur d'un Thorton : va la chercher en ville.`,`Un convoi Biotechnica traverse le territoire du clan. Négocie le péage.`]},
  wraiths:{n:`Wraiths`,c:`#ff4d6d`,k:`clan`,leader:`nomad`,home:`badlands`,foes:[`aldecaldos`],
    d:`Nomades durs, rapides, sans pitié. Des pillards de la route qui vénèrent la vitesse.`,
    perk:`+1 RÉFLEXES · bonus de conduite`,at:{ref:1},
    lines:[`Un convoi isolé traverse notre territoire. Attaque éclair.`,`Une course à mort sur l'autoroute de la Badlands. Le gagnant prend tout.`,`Des Aldecaldos ont franchi la frontière. On leur donne une leçon.`]},
  barghest:{n:`Barghest`,c:`#7bffb0`,k:`corp`,leader:`hansen`,home:`dogtown`,foes:[],
    d:`Mercenaires ex-Militech menés par Kurt Hansen, maîtres de Dogtown depuis la guerre. Discipline militaire.`,
    perk:`+1 CORPS · contrats de guerre bien payés`,at:{body:1},
    lines:[`Hansen veut un opérateur pour une extraction dans les ruines de Dogtown.`,`Une patrouille Barghest a besoin de renfort face à des pillards.`,`Un contrat de sécurité pour un convoi NUSA.`]},
  ncpd:{n:`NCPD`,c:`#3b8bff`,k:`ncpd`,leader:`ncpd`,home:`downtown`,foes:[`maelstrom`,`tygers`],
    d:`La police de Night City : sous-financée, corrompue, débordée. Mais une plaque ouvre des portes que l'argent ne peut pas.`,
    perk:`+1 INTELLECT · accès au signalement des cyberpsychos`,at:{int:1},
    lines:[`Un "Cyberpsycho Sighting" est signalé à Watson. Tu es le plus proche.`,`Une enquête sur un trafic de cyberware touche un haut gradé. Prudence.`,`Une patrouille de nuit à Downtown tourne mal.`]},
  arasaka:{n:`Arasaka`,c:`#ff0033`,k:`corp`,leader:`takemura`,home:`corpo`,foes:[`militech`,`voodoo`],
    d:`La corporation japonaise par excellence. Loyauté absolue, discipline, avenir assuré — ou fin brutale.`,
    perk:`+1 SANG-FROID · salaire élevé`,at:{cool:1},
    lines:[`Arasaka te confie une mission d'infiltration dans une filiale rivale.`,`Un cadre soupçonné de trahison doit être "convaincu" de rester loyal.`,`Un dossier à transférer entre deux tours — en secret, bien sûr.`]},
  militech:{n:`Militech`,c:`#7bd88f`,k:`corp`,leader:`meredith`,home:`downtown`,foes:[`arasaka`],
    d:`L'arsenal de l'Amérique, rivale éternelle d'Arasaka. Des contrats militaires, des armes qui ne ratent jamais.`,
    perk:`+1 RÉFLEXES · armes Militech à prix réduit`,at:{ref:1},
    lines:[`Meredith Stout t'envoie escorter un prototype d'arme vers Pacifica.`,`Un agent Arasaka rôde près d'une usine Militech. Il faut le neutraliser.`,`Un test de terrain pour une nouvelle génération d'implants.`]},
  kangtao:{n:`Kang Tao`,c:`#ffd166`,k:`corp`,leader:`corpo`,home:`corpo`,foes:[`militech`],
    d:`La corpo chinoise des armes intelligentes. Précise, élégante, discrète.`,
    perk:`+1 TECHNIQUE · smart weapons`,at:{tech:1},
    lines:[`Un test de smart weapons à Charter Hill. On a besoin de quelqu'un de calme.`,`Un espion Militech a copié un plan. Retrouve la fuite.`,`Un salon d'armement privé. Charme et discrétion.`]},
  biotechnica:{n:`Biotechnica`,c:`#a3e635`,k:`corp`,leader:`corpo`,home:`corpo`,foes:[],
    d:`Agriculture, nourriture synthétique et biotechnologie. Ils nourrissent la ville et achètent les Badlands.`,
    perk:`+1 INTELLECT · accès aux convois nomades`,at:{int:1},
    lines:[`Une négociation avec un clan nomade pour sécuriser une route de convoi.`,`Un champ expérimental vandalisé. Retrouve les saboteurs.`,`Un échantillon de graines OGM à faire passer en douce.`]},
  trauma:{n:`Trauma Team`,c:`#ff2a6d`,k:`trauma`,leader:`doc`,home:`downtown`,foes:[],
    d:`Les ambulances blindées de Night City. Tu payes l'abonnement, ils débarquent en hélico. Sinon… bonne chance.`,
    perk:`+1 TECHNIQUE · soin gratuit chaque promo`,at:{tech:1},
    lines:[`Une intervention en zone hostile : sauver un client Platinum sous le feu.`,`Un client récalcitrant refuse de payer. On le récupère quand même.`,`Un gros accident de la route : triage en urgence.`]},
};
const RANKS = {
  gang:[`Recrue`,`Soldat`,`Lieutenant`,`Bras droit`],
  corp:[`Stagiaire`,`Agent`,`Cadre`,`Vice-président`],
  clan:[`Nouveau`,`Éclaireur`,`Pilote`,`Conseiller`],
  ncpd:[`Cadet`,`Agent`,`Détective`,`Capitaine`],
  mox:[`Protégée`,`Membre`,`Protectrice`,`Voix du club`],
  trauma:[`Ambulancier`,`Paramedic`,`Chef d'équipe`,`Directeur Platinum`],
};

/* ---------- Districts (rect SVG) ---------- */
const DIST = [
  {id:`northside`,n:`Northside`,w:`Watson`,o:`maelstrom`,def:3,inc:70,x:10,y:20,wd:100,h:68,d:`Quartier industriel et entrepôts, bastion Maelstrom.`},
  {id:`kabuki`,n:`Kabuki`,w:`Watson`,o:`mox`,def:2,inc:60,x:115,y:20,wd:70,h:68,d:`Marché noir de Kabuki, néons, ripperdocs et le Lizzie's Bar.`},
  {id:`littlechina`,n:`Little China`,w:`Watson`,o:`tygers`,def:3,inc:90,x:10,y:93,wd:100,h:58,d:`Cliniques, vendeurs, la boutique de Misty et la clinique de Vik.`},
  {id:`waterfront`,n:`Arasaka Waterfront`,w:`Watson`,o:`arasaka`,def:5,inc:140,x:115,y:93,wd:70,h:58,d:`Les docks et l'entrepôt d'Arasaka. Sécurité maximale.`},
  {id:`japantown`,n:`Japantown`,w:`Westbrook`,o:`tygers`,def:4,inc:110,x:215,y:20,wd:85,h:68,d:`Quartier des Tyger Claws. Le culte du dragon et du karaoké.`},
  {id:`charter`,n:`Charter Hill`,w:`Westbrook`,o:`kangtao`,def:4,inc:130,x:305,y:20,wd:85,h:68,d:`Quartier huppé. Kang Tao y teste ses smart weapons.`},
  {id:`northoak`,n:`North Oak`,w:`Westbrook`,o:`neutral`,def:5,inc:160,x:215,y:93,wd:175,h:58,d:`Villas de milliardaires. Gardes privés et pelouses millimétrées.`},
  {id:`corpo`,n:`Corpo Plaza`,w:`City Center`,o:`arasaka`,def:5,inc:200,x:115,y:156,wd:100,h:56,d:`Les tours d'Arasaka, de Militech, de Kang Tao… le cœur de l'empire.`},
  {id:`downtown`,n:`Downtown`,w:`City Center`,o:`militech`,def:4,inc:140,x:220,y:156,wd:170,h:56,d:`Bureaux, Trauma Team, NCPD, Afterlife… tout converge ici.`},
  {id:`wellsprings`,n:`Wellsprings`,w:`Heywood`,o:`valentinos`,def:3,inc:70,x:115,y:217,wd:85,h:58,d:`Cœur du barrio Valentino : églises, fresques, bars.`},
  {id:`glen`,n:`The Glen`,w:`Heywood`,o:`neutral`,def:3,inc:100,x:205,y:217,wd:85,h:58,d:`Quartier résidentiel aisé, sous l'œil de la police.`},
  {id:`vista`,n:`Vista del Rey`,w:`Heywood`,o:`neutral`,def:2,inc:60,x:295,y:217,wd:95,h:58,d:`Classes moyennes, tours HLM, Coyote Cojo.`},
  {id:`coastview`,n:`Coastview`,w:`Pacifica`,o:`voodoo`,def:4,inc:90,x:10,y:156,wd:100,h:56,d:`Les ruines du Grand Imperial Mall. Fief des Voodoo Boys.`},
  {id:`westwind`,n:`West Wind Estate`,w:`Pacifica`,o:`neutral`,def:3,inc:100,x:10,y:217,wd:100,h:58,d:`Gated communities en bord de mer.`},
  {id:`dogtown`,n:`Dogtown`,w:`Pacifica`,o:`barghest`,def:5,inc:150,x:10,y:280,wd:100,h:55,d:`Ancienne enclave militaire, ceinturée par les Barghest.`,lock:2077},
  {id:`arroyo`,n:`Arroyo`,w:`Santo Domingo`,o:`sixth`,def:2,inc:60,x:115,y:280,wd:120,h:55,d:`Zone résidentielle patrouillée par la 6th Street.`},
  {id:`rancho`,n:`Rancho Coronado`,w:`Santo Domingo`,o:`animals`,def:3,inc:70,x:240,y:280,wd:150,h:55,d:`Usines et lotissements. Territoire des Animals et des Scavs.`},
  {id:`badlands`,n:`Badlands`,w:`Hors-la-Loi`,o:`aldecaldos`,def:3,inc:80,x:10,y:342,wd:380,h:46,d:`Désert, camps nomades et autoroutes sans loi.`},
];
const WARDS = [{n:`WATSON`,x:12,y:14},{n:`WESTBROOK`,x:217,y:14},{n:`CITY CENTER`,x:117,y:150},{n:`HEYWOOD`,x:117,y:211},{n:`PACIFICA`,x:12,y:150},{n:`SANTO DOMINGO`,x:117,y:274}];

/* ---------- Cyberware ---------- */
const SLOTS = {optique:`Optiques`,nerveux:`Système nerveux`,mains:`Mains`,squelette:`Squelette`,peau:`Peau / Organes`,neural:`Interface neurale`,deck:`Cyberdeck`};
const CYBER = [
  {id:`kiroshi`,n:`Kiroshi Opticam`,slot:`optique`,p:900,h:4,at:{int:1},d:`Zoom, scan thermique, enregistrement. Les yeux de la rue.`},
  {id:`targeting`,n:`Kiroshi Smartlink Scope`,slot:`optique`,p:2200,h:6,at:{ref:1},k:{cmb:1},d:`Visée assistée : les balles trouvent leur chemin.`},
  {id:`kerenzikov`,n:`Kerenzikov`,slot:`nerveux`,p:2600,h:6,at:{ref:1},d:`Ralentit ta perception. Le monde se met à ramper.`},
  {id:`sandy`,n:`Sandevistan Dynalar`,slot:`nerveux`,p:7000,h:12,at:{ref:2},k:{cmb:1},d:`Le temps se fige. Tu bouges, ils attendent. Le prix : ton système nerveux.`},
  {id:`apogee`,n:`Sandevistan Apogee (Militech)`,slot:`nerveux`,p:15000,h:18,at:{ref:3},k:{cmb:2},cred:40,d:`Le top du top. Une machine de guerre pour la moelle épinière.`},
  {id:`mantis`,n:`Lames Mantis`,slot:`mains`,p:4500,h:10,at:{body:1},k:{cmb:2},d:`Deux lames rétractables dans tes avant-bras. Signature d'Edgerunner.`},
  {id:`monowire`,n:`Monowire`,slot:`mains`,p:5200,h:8,at:{ref:1},k:{cmb:2},d:`Un fil monomoléculaire. Plus fin qu'une idée, plus tranchant qu'un regret.`},
  {id:`gorilla`,n:`Gorilla Arms`,slot:`mains`,p:6000,h:12,at:{body:2},k:{cmb:1},d:`Des bras surdimensionnés. Les portes ne te résistent plus.`},
  {id:`launcher`,n:`Projectile Launch System`,slot:`mains`,p:5000,h:8,at:{tech:1},k:{cmb:2},d:`Un lance-projectiles dans le poignet. Un petit bijou explosif.`},
  {id:`grip`,n:`Subdermal Grip`,slot:`mains`,p:700,h:3,at:{ref:1},d:`Smartlink dans la paume : l'arme fait corps avec toi.`},
  {id:`tendons`,n:`Reinforced Tendons`,slot:`squelette`,p:1500,h:3,at:{ref:1},d:`Sauts impossibles, esquives de félin.`},
  {id:`titanium`,n:`Squelette en titane`,slot:`squelette`,p:3200,h:5,at:{body:1},mit:.10,d:`Tes os ne casseront plus.`},
  {id:`armor`,n:`Subdermal Armor`,slot:`peau`,p:3800,h:6,mit:.20,d:`Une plaque de kevlar sous la peau. Les balles ricochent.`},
  {id:`biomon`,n:`Biomonitor`,slot:`peau`,p:1200,h:2,regen:6,d:`Surveille ta santé et libère des soins automatiquement.`},
  {id:`camo`,n:`Optical Camo`,slot:`peau`,p:6800,h:8,at:{cool:1},k:{stl:2},d:`Invisible pour quelques secondes. Un rêve pour tout assassin.`},
  {id:`plug`,n:`Interface neurale (Neural Link)`,slot:`neural`,p:900,h:3,at:{int:1},d:`Le port d'entrée : sans lui, pas de deck, pas de Net.`},
  {id:`cyberdeck`,n:`Cyberdeck Raven Microcyber`,slot:`deck`,p:1500,h:4,at:{int:1},k:{hck:1},deck:3,d:`Deck d'entrée de gamme, interface neurale incluse. Pour débuter dans le Net.`},
  {id:`paraline`,n:`Cyberdeck Militech Paraline`,slot:`deck`,p:9000,h:8,at:{int:2},k:{hck:2},deck:5,d:`Militaire. Rapide, brutal, fiable.`},
  {id:`rippler`,n:`Cyberdeck Tetratronic Rippler`,slot:`deck`,p:16000,h:10,at:{int:3},k:{hck:3},deck:7,cred:35,d:`Le deck des légendes du Net. Pour percer le Blackwall en rêve.`},
];
const HACKS = [
  {id:`ping`,n:`Ping`,p:500,int:3,d:`Révèle la position des ennemis.`},
  {id:`shortc`,n:`Short Circuit`,p:900,int:4,d:`Surcharge électrique. Grésille les cyberwares.`},
  {id:`reboot`,n:`Reboot Optics`,p:1100,int:4,d:`Aveugle temporairement la cible.`},
  {id:`overheat`,n:`Overheat`,p:1800,int:5,d:`Fait surchauffer les circuits d'une cible.`},
  {id:`contagion`,n:`Contagion`,p:2400,int:6,d:`Poison numérique qui ronge les organes.`},
  {id:`sonic`,n:`Sonic Shock`,p:2800,int:6,d:`Onde sonore directement dans le crâne.`},
  {id:`cripple`,n:`Cripple Movement`,p:2200,int:5,d:`Bloque les jambes de la cible.`},
  {id:`burnout`,n:`Synapse Burnout`,p:5500,int:8,d:`Grille les synapses. Souvent fatal.`},
  {id:`suicide`,n:`Suicide`,p:7500,int:9,d:`Force la cible à se retourner contre elle-même. Interdit chez les Voodoo.`},
];
/* ---------- Gear ---------- */
const GEAR = [
  /* ---- armes ---- */
  {id:`lexington`,n:`Militech M-10AF Lexington`,t:`arme`,r:`c`,p:600,k:{cmb:1},d:`Pistolet automatique fiable. Le choix du débutant.`},
  {id:`unity`,n:`Techtronika Unity`,t:`arme`,r:`c`,p:1300,k:{cmb:1},d:`Pistolet léger, rapide à dégainer.`},
  {id:`nue`,n:`Nue`,t:`arme`,r:`c`,p:2200,k:{cmb:2},d:`Revolver à haute puissance d'arrêt.`},
  {id:`crusher`,n:`Shotgun Crusher`,t:`arme`,r:`c`,p:2000,k:{cmb:2},d:`Un fusil à pompe qui règle les discussions.`},
  {id:`tamayura`,n:`Katana Tamayura`,t:`arme`,r:`c`,p:3000,k:{cmb:2},d:`Katana tranchant, bien équilibré.`},
  {id:`overture`,n:`Overture`,t:`arme`,r:`r`,p:3600,k:{cmb:2,stl:1},d:`Revolver à canon silencieux, le favori des infiltrés.`},
  {id:`liberty`,n:`Militech Liberty`,t:`arme`,r:`r`,p:4600,k:{cmb:3},cred:20,d:`Pistolet lourd et précis, signé Militech.`},
  {id:`dyingnight`,n:`Dying Night`,t:`arme`,r:`r`,p:5200,k:{cmb:3},cred:25,d:`Une arme de légende de rue. Elle porte la signature du chaos.`},
  {id:`nekomata`,n:`Nekomata`,t:`arme`,r:`r`,p:7800,k:{cmb:3,stl:1},cred:30,d:`Fusil de précision d'Arasaka. Un tir, un nom.`},
  {id:`skippy`,n:`Skippy`,t:`arme`,r:`r`,p:6200,k:{cmb:3,soc:1},cred:25,d:`Un pistolet "intelligent" qui commente chaque tir. Étonnamment sociable.`},
  {id:`masamune`,n:`Arasaka HJSH-18 Masamune`,t:`arme`,r:`e`,p:11000,k:{cmb:3},cred:35,d:`Fusil d'assaut "smart" d'Arasaka. Un luxe de guerre.`},
  {id:`comrade`,n:`Comrade's Hammer`,t:`arme`,r:`e`,p:12500,k:{cmb:4},cred:40,d:`Un pistolet d'une puissance absurde. Il laisse des trous.`},
  {id:`malorian`,n:`Malorian Arms 3516`,t:`arme`,r:`l`,p:0,k:{cmb:5,soc:1},fame:1,loot:1,d:`LÉGENDAIRE · Le pistolet de Johnny Silverhand. Un monstre de puissance.`},
  {id:`satori`,n:`Katana Satori`,t:`arme`,r:`l`,p:0,k:{cmb:5,stl:1},fame:1,loot:1,d:`LÉGENDAIRE · La lame d'Arasaka. Les rumeurs disent qu'elle ne s'est jamais ébréchée.`},
  /* ---- armures ---- */
  {id:`kevlar`,n:`Veste en kevlar`,t:`armure`,r:`c`,p:700,mit:.10,d:`Une protection légère sous la veste.`},
  {id:`valjacket`,n:`Veste Valentinos`,t:`armure`,r:`c`,p:1100,mit:.08,k:{soc:1},d:`Cuir brodé aux couleurs du barrio. Les Valentinos te saluent.`},
  {id:`clawsjacket`,n:`Veste Tyger Claws`,t:`armure`,r:`c`,p:1300,mit:.08,k:{soc:1},d:`Cuir noir, tigre brodé. Impressionnant à Japantown.`},
  {id:`militecharm`,n:`Armure Militech`,t:`armure`,r:`r`,p:3500,mit:.20,d:`Armure de combat. Fait de toi un tank.`},
  {id:`aldejacket`,n:`Veste Aldecaldos`,t:`armure`,r:`r`,p:3200,mit:.12,k:{drv:1},d:`Cuir usé par les tempêtes. Les nomades reconnaissent les leurs.`},
  {id:`ghostsuit`,n:`Combinaison furtive`,t:`armure`,r:`r`,p:4200,mit:.10,k:{stl:2},d:`Tissu absorbant, silencieux. Un vêtement de fantôme.`},
  {id:`kangarmor`,n:`Armure Kang Tao`,t:`armure`,r:`r`,p:5000,mit:.22,k:{cmb:1},cred:20,d:`Plaques légères, électronique embarquée.`},
  {id:`arasakaarm`,n:`Armure Arasaka`,t:`armure`,r:`e`,p:7500,mit:.30,cred:30,d:`Plaques composites, finition impeccable.`},
  {id:`barghestarm`,n:`Blindage Barghest`,t:`armure`,r:`e`,p:9500,mit:.35,cred:35,d:`Armure militaire lourde de Dogtown. Les balles s'en lassent.`},
  {id:`samuraijacket`,n:`Veste Samurai (authentique)`,t:`armure`,r:`l`,p:0,mit:.18,k:{soc:3},at:{cool:1},fame:1,loot:1,d:`LÉGENDAIRE · La veste de Johnny. Cuir, étoile, histoire. Tout le monde la reconnaît.`},
  /* ---- véhicules ---- */
  {id:`archer`,n:`Archer Quartz "Bandit"`,t:`véhicule`,r:`c`,p:1600,k:{drv:1},d:`Voiture bon marché. Elle roule — la plupart du temps.`},
  {id:`thorton`,n:`Thorton Colby`,t:`véhicule`,r:`c`,p:2400,k:{drv:1},d:`Pick-up robuste, parfait dans les Badlands.`},
  {id:`mizutani`,n:`Mizutani Shion MZ2`,t:`véhicule`,r:`r`,p:3800,k:{drv:2},d:`Sportive japonaise. Rapide, nerveuse.`},
  {id:`herrera`,n:`Herrera Outlaw GTS`,t:`véhicule`,r:`r`,p:5200,k:{drv:2},d:`Coupé nerveux. Il dérape comme il respire.`},
  {id:`alvarado`,n:`Villefort Alvarado`,t:`véhicule`,r:`r`,p:6000,k:{drv:2,soc:1},d:`Berline luxueuse. Pour les rendez-vous qui comptent.`},
  {id:`kusanagi`,n:`Yaiba Kusanagi CT-3X`,t:`véhicule`,r:`e`,p:7800,k:{drv:3},cred:25,d:`Moto de course. Un missile sur deux roues.`},
  {id:`javelina`,n:`Quadra Type-66 Javelina`,t:`véhicule`,r:`e`,p:9500,k:{drv:3},cred:25,d:`Muscle car néo-rétro. Tu fais tourner les têtes.`},
  {id:`caliburn`,n:`Rayfield Caliburn`,t:`véhicule`,r:`e`,p:48000,k:{drv:3,soc:2},cred:50,fame:1,d:`Hypercar de collection. Une déclaration de puissance.`},
  {id:`nazare`,n:`Arch Nazaré`,t:`véhicule`,r:`l`,p:0,k:{drv:4,stl:1},fame:1,loot:1,d:`LÉGENDAIRE · Une moto devenue mythe. Elle t'obéit mieux que la plupart des gens.`},
  /* ---- style ---- */
  {id:`jacket`,n:`Veste de style (corpo-chic)`,t:`style`,r:`c`,p:900,k:{soc:1},d:`Elle coûte cher. Elle le dit.`},
  {id:`samurai`,n:`Réplique de veste Samurai`,t:`style`,r:`c`,p:1400,k:{soc:1},fame:1,d:`Le style de Johnny Silverhand. Les nostalgiques te saluent.`},
  {id:`kiroshisun`,n:`Lunettes Kiroshi "Sunset"`,t:`style`,r:`r`,p:2200,k:{soc:1,stl:1},d:`Verres fumés, enregistrement discret. Parfait pour les rendez-vous.`},
  {id:`gala`,n:`Tenue de gala Arasaka-Mode`,t:`style`,r:`r`,p:3500,k:{soc:2},cred:15,d:`Coupe parfaite, tissu impossible à froisser. Les portes s'ouvrent.`},
  {id:`silvertalk`,n:`Chaîne Samurai en argent`,t:`style`,r:`e`,p:6200,k:{soc:2},at:{cool:1},fame:1,cred:30,d:`Un pendentif devenu légende. Il parle pour toi.`},
];
const RARITY = {c:[`Commun`,`#8a8aa8`],r:[`Rare`,`#00f0ff`],e:[`Épique`,`#c77dff`],l:[`Légendaire`,`#fcee0a`]};

/* ---------- Gigs du tableau ---------- */
const GIGS = [
  {n:`Livraison de colis (aucune question)`,a:`cool`,dc:6,pay:350,cr:2,dm:6,k:null,d:`Un sac qui sent la poudre. Un client nerveux.`},
  {n:`Vol de voiture sur commande`,a:`ref`,dc:7,pay:600,cr:3,dm:12,k:`drv`,d:`Regina a un acheteur pour une Quadra rouge.`},
  {n:`Récupération de dette`,a:`body`,dc:7,pay:550,cr:3,dm:14,k:`cmb`,d:`Un joueur de BD doit 2 000 eddies à un fixer.`},
  {n:`Piratage d'un distributeur corpo`,a:`int`,dc:7,pay:700,cr:3,dm:8,k:`hck`,d:`Le pare-feu est maigre. Sa sécurité aussi.`},
  {n:`Escorte d'un cargo à Pacifica`,a:`ref`,dc:8,pay:1000,cr:5,dm:18,k:`cmb`,d:`Deux Maelstrom s'intéressent au chargement.`},
  {n:`Infiltrer une fête de corpos`,a:`cool`,dc:8,pay:1100,cr:4,dm:10,k:`stl`,d:`Voler une puce de données sans lever un sourcil.`},
  {n:`Élimination d'un cyberpsycho`,a:`ref`,dc:9,pay:1600,cr:7,dm:26,k:`cmb`,d:`Un ex-Valentino a pété les plombs à Heywood.`},
  {n:`Extraction d'un scientifique`,a:`tech`,dc:8,pay:1400,cr:6,dm:16,k:`stl`,d:`Un ingénieur Kang Tao veut déserter.`},
  {n:`Contre-piratage pour Voodoo Boys`,a:`int`,dc:9,pay:1900,cr:7,dm:12,k:`hck`,d:`Un intrus rôde au bord du Blackwall.`},
  {n:`Braquage d'un convoi Militech`,a:`body`,dc:10,pay:3000,cr:10,dm:30,k:`cmb`,d:`Une affaire à grand risque et à grands eddies.`},
];

/* ---------- Faits de score / fins ---------- */
const ENDS = {
  flatline:{t:`FLATLINE`,e:`Une balle, un couteau, un mauvais calcul. Night City ne pleure personne.`},
  psycho:{t:`CYBERPSYCHOSE`,e:`Il ne restait plus assez d'humain pour te reconnaître. MaxTac s'en est chargé — et la Trauma Team ne vient jamais quand MaxTac tire.`},
  debt:{t:`DETTE MORTELLE`,e:`Les créanciers de Night City n'envoient pas de rappels. Ils envoient des gars.`},
  blaze:{t:`DERNIER RUN`,e:`Tu es parti(e) en flammes, comme les vrais. La ville en parle encore à l'Afterlife.`},
  retire:{t:`RETRAITE`,e:`Tu as survécu. Dans cette ville, ça fait déjà de toi une légende.`},
  quit:{t:`DISPARU`,e:`Tu as tout laissé derrière toi. Peut-être qu'ailleurs il y a encore une chance.`},
  mercy:{t:`FLATLINE`,e:`Un dernier regard sur les néons. Puis le noir.`},
};

/* ---------- blocs d'influence ---------- */
const BLOC = {valentinos:`rue`,maelstrom:`rue`,tygers:`rue`,sixth:`rue`,voodoo:`rue`,animals:`rue`,mox:`rue`,
  arasaka:`corpo`,militech:`corpo`,kangtao:`corpo`,biotechnica:`corpo`,trauma:`corpo`,ncpd:`loi`,barghest:`loi`,aldecaldos:`nomad`,wraiths:`nomad`};
const BLOCS = {rue:{n:`RUE`,c:`#ff9f1c`,d:`Gangs et rues de Night City`,opp:`loi`},corpo:{n:`CORPOS`,c:`#05ffa1`,d:`Arasaka, Militech, Kang Tao…`,opp:`nomad`},
  loi:{n:`LOI`,c:`#3b8bff`,d:`NCPD, MaxTac, Barghest`,opp:`rue`},nomad:{n:`BADLANDS`,c:`#ff4d6d`,d:`Les clans nomades`,opp:`corpo`}};

/* ---------- alliés qui aident aux jets / infos contacts ---------- */
const ALLY = {body:[`jackie`,`panam`],ref:[`claire`,`panam`],tech:[`vik`,`claire`],int:[`lucy`,`dex`,`judy`],cool:[`rogue`,`kerry`,`misty`]};
const CONTACTS = {
  jackie:`Renfort au combat · refuge à Heywood`, mama:`Refuge · soutien des Valentinos`, judy:`Alliée des Mox · BD & hack`,
  panam:`Convoi · véhicules · Aldecaldos`, misty:`Humanité · conseils · intuition`, rogue:`Contrats VIP · Afterlife`,
  kerry:`Concerts · réputation rock`, vik:`Soins · remise chrome`, dex:`Gigs mieux payés`, lucy:`Hacking · netrunning`,
  delamain:`Transport sûr · fuite`, claire:`Mécanique · conduite`
};
const REL_TIERS = [[0,`Inconnu`],[5,`Connaissance`],[20,`Ami`],[40,`Allié`],[65,`Famille`]];

/* ---------- titres de chef & générateur de personnages ---------- */
const LEADER = {gang:`Chef`,corp:`PDG`,clan:`Chef de clan`,ncpd:`Commissaire`,mox:`Voix des Mox`,trauma:`Directeur général`};
const RANK_PERKS = [`Missions de faction mieux payées`,`Arcs de faction & salaire accru`,`Obligations de la famille · prise de pouvoir possible`];
const NAMES = {
  m:[`Rook`,`Kiko`,`Dante`,`Mateo`,`Ravi`,`Jonas`,`Tariq`,`Luca`,`Kenji`,`Andrei`,`Bao`,`Idris`,`Silas`,`Marek`,`Teo`,`Gaspard`,`Omar`,`Yuri`],
  f:[`Nadja`,`Imani`,`Yuki`,`Carmen`,`Zhen`,`Anouk`,`Dalia`,`Mireille`,`Sana`,`Reva`,`Ingrid`,`Ayo`,`Lena`,`Soraya`,`Mei`,`Paloma`,`Noor`,`Vera`],
  s:[`Reyes`,`Tanaka`,`Okoye`,`Volkov`,`Delacroix`,`Chen`,`Haddad`,`Morales`,`Kowalski`,`Nakamura`,`Silva`,`Ito`,`Brandt`,`Mbeki`,`Vargas`,`Park`,`Lindqvist`,`Moreau`],
  n:[`Chrome`,`Gato`,`Vipère`,`Ombre`,`Spark`,`Bitume`,`Ghost`,`Néon`,`Rasoir`,`Corbeau`]
};
const GENT = {
  fix:{r:`Contact de la rue`,st:[`hood`,`shades`,`cap`,`short`],c:`#00f0ff`},
  corpo:{r:`Cadre corpo`,st:[`shades`,`short`,`long`],c:`#05ffa1`},
  scav:{r:`Charognard`,st:[`mask`,`hood`],c:`#ff9f1c`},
  doc:{r:`Ripperdoc de quartier`,st:[`mask`,`short`,`bald`],c:`#05ffa1`},
  ncpd:{r:`Agent NCPD`,st:[`helmet`,`cap`],c:`#3b8bff`},
  nomad:{r:`Nomade des Badlands`,st:[`cap`,`hood`,`short`],c:`#ff9f1c`},
  claws:{r:`Lieutenant Tyger Claws`,st:[`mask`,`mohawk`],c:`#ff4d6d`},
  sixth:{r:`Vétéran de la 6th Street`,st:[`helmet`,`cap`],c:`#00f0ff`},
  gang:{r:`Lieutenant`,st:[`mohawk`,`visor`,`mask`,`cap`,`bald`],c:`#ff2a6d`},
  corp:{r:`Cadre`,st:[`shades`,`short`,`long`],c:`#05ffa1`},
  clan:{r:`Éclaireur`,st:[`cap`,`hood`,`short`],c:`#ff9f1c`},
  mox:{r:`Membre des Mox`,st:[`mohawk`,`short`,`long`],c:`#ff6ec7`},
  trauma:{r:`Paramedic Trauma Team`,st:[`helmet`,`short`],c:`#ff2a6d`}
};
const pickR = a => a[Math.floor(Math.random()*a.length)];
function genNpc(type,color,role){
  const t=GENT[type]||GENT.fix, g=Math.random()<.5?`m`:`f`;
  let n=`${pickR(NAMES[g])} ${pickR(NAMES.s)}`;
  if(Math.random()<.3) n=`${pickR(NAMES[g])} « ${pickR(NAMES.n)} » ${pickR(NAMES.s)}`;
  return {n,r:role||t.r,c:color||t.c,st:pickR(t.st),sk:14+Math.floor(Math.random()*22),gen:1};
}
const GENERIC_WHO = {fix:`fix`,corpo:`corpo`,scav:`scav`,doc:`doc`,ncpd:`ncpd`,nomad:`nomad`,claws:`claws`,sixth:`sixth`};
const FIXERS = [`dex`,`wakako`,`regina`,`padre`,`hands`];
Object.assign(ALLY,{body:[`jackie`,`panam`,`chino`],ref:[`claire`,`panam`],tech:[`vik`,`claire`,`mika`,`hiro`],int:[`lucy`,`dex`,`judy`,`nadia`,`eli`],cool:[`rogue`,`kerry`,`misty`,`hands`]});
Object.assign(CONTACTS,{
  chino:`Frère d'armes · Valentinos`, nadia:`Netrunneuse · intel Maelstrom`, mika:`Doc de rue · soins discrets`,
  hiro:`Ingénieur Kang Tao · armes`, eli:`Informateur NetWatch`, hands:`Fixer · contrats discrets`
});

Object.assign(CONTACTS,{
  wakako:`Fixer de Japantown · contrats discrets`, regina:`Fixer · véhicules & assassinats`, padre:`Fixer du barrio · protection`,
  muamar:`Fixer · les gros coups`, faraday:`Fixer · Edgerunners`, nancy:`Détective NCPD · intel`, river:`Détective NCPD · protection`
});
ALLY.cool.push(`wakako`,`faraday`); ALLY.ref.push(`regina`); ALLY.body.push(`padre`,`river`); ALLY.int.push(`nancy`,`muamar`);
/* ---------- conditions de promotion (affichées au joueur) ---------- */
const JOB_NEED = [1,2,3];     // missions pour passer au rang 1,2,3
const REP_NEED = [15,30,45];  // réputation dans la faction
const LEAD_NEED = {jobs:5,rep:55,cred:35};
const FOUND_NEED = {cred:15,ed:1000}; // pour prendre la tête

const AGING_AGE = 40;
