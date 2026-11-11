/* =====================================================================
   CARTES 5 — quêtes secondaires en chaînes (3 cartes), contrats de
   fixer au choix, quêtes liées aux personnages
   ===================================================================== */
const qon  = {flag:[`q_active`]};
const qend = id => ({unflag:[`q_active`],flag:[`qdone_${id}`],loot:2});
const QOK  = () => !G.flags.q_active;

/* ---------- Contrats de fixer : 3 quêtes au choix ---------- */
card({id:`fix_board`,who:`dex`,tag:`Contrats de fixer`,w:7,cond:()=>QOK()&&G.cred>=8&&(G.flags.dex||G.flags.fixer||G.cred>=20),
  tx:`Dex étale trois dossiers sur le comptoir de l'Afterlife : « Je n'ai qu'un exécutant pour trois contrats. Choisis. Chacun est une affaire en plusieurs temps — pas un simple coup de main. »`,
  ch:[
    {t:`L'entrepôt oublié`,s:`● ● ○ · ~3 000 €$ · 3 étapes · Maelstrom`,req:()=>G.flags.qdone_q1?`Déjà accompli`:``,fx:{...qon,next:`q1_1`,rel:{dex:3},msg:`Dex pousse le dossier vers toi. « Fais-moi honneur. »`}},
    {t:`Le client fantôme`,s:`● ○ ○ · ~2 500 €$ · 3 étapes · corpos`,req:()=>G.flags.qdone_q4?`Déjà accompli`:``,fx:{...qon,next:`q4_1`,rel:{dex:3},msg:`Un dossier mince, des clauses étranges. Ça sent le piège.`}},
    {t:`Le passeur`,s:`● ● ● · ~4 000 €$ · 3 étapes · Badlands`,req:()=>G.flags.qdone_q7?`Déjà accompli`:``,fx:{...qon,next:`q7_1`,rel:{dex:3},msg:`Des gens à faire passer, une frontière à traverser, des flics à éviter.`}},
    {t:`Pas aujourd'hui`,fx:{unonce:`fix_board`}}
  ]});

/* ---------- Q1 · L'entrepôt oublié ---------- */
card({id:`q1_1`,who:`dex`,tag:`Quête · L'entrepôt oublié (1/3)`,once:true,
  tx:`Northside, un entrepôt que les Maelstrom ont déserté en pleine nuit. Il reste du matériel Militech là-dedans, et peut-être plus. Trois façons d'entrer : les toits, les systèmes, ou la porte.`,
  ch:[
    {t:`Passer par les toits`,s:`SANG-FROID · furtivité`,chk:{a:`cool`,k:`stl`,dc:7,ok:{next:`q1_2`,flag:[`q1_clean`],msg:`Une lucarne, un câble, un silence parfait. Personne ne sait que tu es entré(e).`},ko:{next:`q1_2`,hp:-10,msg:`Une tuile glisse, un chien aboie. Tu entres, mais pas discrètement.`}}},
    {t:`Pirater les accès`,s:`INTELLECT · hack`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:7,ok:{next:`q1_2`,flag:[`q1_clean`],msg:`Les caméras se figent, les portes s'ouvrent. Propre.`},ko:{next:`q1_2`,hp:-8,msg:`Le système sonne une alarme muette. Tu entres quand même.`}}},
    {t:`Forcer la porte`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:7,ok:{next:`q1_2`,cred:2,msg:`Un coup, une charnière, la porte tombe. Subtil comme un camion.`},ko:{next:`q1_2`,hp:-14,msg:`La porte résiste, puis cède sur toi. Tu entres sonné(e).`}}}
  ]});
card({id:`q1_2`,who:`narr`,tag:`Quête · L'entrepôt oublié (2/3)`,once:true,
  tx:`À l'intérieur : des caisses de matériel Militech empilées jusqu'au plafond… et, derrière un grillage, trois personnes enchaînées. Des captifs des Maelstrom, destinés aux ripperdocs sans scrupules. Leurs yeux t'implorent en silence.`,
  ch:[
    {t:`Prendre les caisses et filer`,s:`+Gain · −Humanité`,fx:{ed:2500,hum:-8,flag:[`q1_loot`],next:`q1_3`,msg:`Tu charges le matériel. Les captifs ne crient pas. C'est pire.`}},
    {t:`Libérer les captifs`,s:`RÉFLEXES`,chk:{a:`ref`,dc:7,ok:{hum:10,cred:3,flag:[`q1_free`],next:`q1_3`,msg:`Les chaînes tombent. Les captifs t'embrassent, en pleurs.`},ko:{hum:6,hp:-14,flag:[`q1_free`],next:`q1_3`,msg:`Un loquet te blesse. Mais ils sont libres.`}}},
    {t:`Tout faire : libérer et récupérer`,s:`SANG-FROID · difficile`,chk:{a:`cool`,dc:9,ok:{ed:2500,hum:8,cred:5,flag:[`q1_loot`,`q1_free`],next:`q1_3`,msg:`Un plan en trois minutes. Les captifs sortent, les caisses aussi. Presque trop beau.`},ko:{hp:-18,flag:[`q1_free`],next:`q1_3`,msg:`Trop ambitieux : tu perds les caisses mais sauves les captifs.`}}}
  ]});
card({id:`q1_3`,who:`royce`,tag:`Quête · L'entrepôt oublié (3/3)`,once:true,
  tx:`Des phares dans la nuit : les Maelstrom reviennent, en nombre, menés par Royce lui-même. Le grillage est ouvert, l'entrepôt exposé. Tu as quelques secondes.`,
  ch:[
    {t:`Les affronter`,s:`CORPS/RÉFLEXES · combat`,chk:{a:`body`,k:`cmb`,dc:9,ok:{...qend(`q1`),flag:[`qdone_q1`],ed:1500,cred:8,fac:{maelstrom:-10},msg:`Une fusillade courte et brutale. Royce recule, furieux. L'entrepôt est à toi.`},ko:{...qend(`q1`),hp:-35,cred:2,fac:{maelstrom:-8},msg:`Tu t'en sors à moitié mort(e). Les Maelstrom pillent ce qui reste.`}}},
    {t:`Fuir par les toits avec les captifs`,s:`RÉFLEXES`,chk:{a:`ref`,dc:8,ok:{...qend(`q1`),hum:6,cred:6,msg:`Tu disparais dans la nuit, les captifs sur tes talons. Royce hurle sur le toit vide.`},ko:{...qend(`q1`),hp:-22,msg:`Tu t'en sors de justesse, un peu plus lourd(e) de plomb.`}}},
    {t:`Négocier avec Royce`,s:`SANG-FROID`,chk:{a:`cool`,dc:9,ok:{...qend(`q1`),ed:2000,cred:7,fac:{maelstrom:4},msg:`Royce rit, te laisse partir avec une part. « Pas mal, pour un(e) civil(e). »`},ko:{...qend(`q1`),hp:-30,ed:-500,msg:`Royce n'est pas d'humeur à négocier. Tu repars en boitant.`}}}
  ]});

/* ---------- Q4 · Le client fantôme ---------- */
card({id:`q4_1`,who:`corpo`,tag:`Quête · Le client fantôme (1/3)`,once:true,
  tx:`Un costume impeccable te paie d'avance pour garder « un VIP » dans un café de Downtown, tous les jours, à la même heure. Il ne te donne ni nom ni photo. « Vous saurez le reconnaître. »`,
  ch:[
    {t:`Surveiller le café avec attention`,s:`INTELLECT`,chk:{a:`int`,dc:7,ok:{next:`q4_2`,flag:[`q4_know`],msg:`Au troisième jour, tu remarques que personne ne s'assoit à la table réservée. C'est un leurre.`},ko:{next:`q4_2`,msg:`Tu surveilles sans comprendre. Le piège se referme lentement.`}}},
    {t:`Accepter sans poser de questions`,s:`Argent facile`,fx:{ed:800,next:`q4_2`,msg:`L'argent est réel. C'est tout ce que tu sais.`}}
  ]});
card({id:`q4_2`,who:`corpo`,tag:`Quête · Le client fantôme (2/3)`,once:true,
  tx:`Le quatrième jour, un homme s'assoit enfin à la table. Arasaka, sans doute : costume sombre, regard glacé. Il commande un thé, puis te fixe. « Vous êtes le/la garde. Vous ne saviez pas pour qui vous travailliez, n'est-ce pas ? »`,
  ch:[
    {t:`Jouer l'innocence`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{next:`q4_3`,cred:3,msg:`Il hoche la tête. « Bien. Moins on sait, mieux on vit. »`},ko:{next:`q4_3`,hp:-10,msg:`Il ne te croit pas. Quelques regards s'attardent trop longtemps.`}}},
    {t:`Enregistrer discrètement la conversation`,s:`INTELLECT`,chk:{a:`int`,dc:8,ok:{next:`q4_3`,flag:[`q4_rec`],msg:`Ton implant capte chaque mot. Tu viens de mettre la main sur quelque chose de gros.`},ko:{next:`q4_3`,hp:-12,msg:`Il repère ton micro. Un sourire sans joie.`}}}
  ]});
card({id:`q4_3`,who:`meredith`,tag:`Quête · Le client fantôme (3/3)`,once:true,
  tx:`Le lendemain, Meredith Stout (Militech) te contacte : « Il paraît que vous avez rencontré un certain homme. Nous avons des intérêts communs. » Tu as un choix à faire, avec ou sans enregistrement.`,
  ch:[
    {t:`Vendre l'information à Militech`,s:`Gros gain`,fx:{...qend(`q4`),ed:4200,cred:6,fac:{militech:8,arasaka:-10},loot:3,msg:`Meredith sourit. Le virement dépasse tes attentes. Arasaka t'aura dans le viseur.`}},
    {t:`Prévenir Arasaka`,s:`Loyauté`,fx:{...qend(`q4`),ed:2500,cred:5,fac:{arasaka:10,militech:-8},msg:`Ils te remercient d'un geste sobre. Une enveloppe, un regard.`}},
    {t:`Tout effacer et disparaître quelque temps`,s:`+Humanité`,fx:{...qend(`q4`),hum:8,cred:2,msg:`Tu détruis l'enregistrement. Certaines histoires valent mieux qu'on les oublie.`}}
  ]});

/* ---------- Q7 · Le passeur ---------- */
card({id:`q7_1`,who:`nomad`,tag:`Quête · Le passeur (1/3)`,once:true,
  tx:`Une famille de réfugiés veut traverser la frontière des Badlands. Un passeur te propose une part : « Il faut un véhicule, un guide, et quelqu'un qui sait baratiner les barrages. »`,
  ch:[
    {t:`Conduire le convoi`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:7,ok:{next:`q7_2`,cred:3,msg:`La piste est bonne. La famille rit nerveusement dans la soute.`},ko:{next:`q7_2`,hp:-10,msg:`Une crevaison, une panne. Mais vous avancez.`}}},
    {t:`Préparer les papiers`,s:`INTELLECT`,chk:{a:`int`,dc:7,ok:{next:`q7_2`,flag:[`q7_papers`],msg:`Des faux papiers parfaits. Ça passera.`},ko:{next:`q7_2`,msg:`Des papiers bâclés. Le barrage sera plus délicat.`}}}
  ]});
card({id:`q7_2`,who:`ncpd`,tag:`Quête · Le passeur (2/3)`,once:true,
  tx:`Un barrage NCPD au milieu de la route. Les agents examinent les véhicules un par un. Dans ta soute, une famille retient son souffle. Un mauvais geste et tout bascule.`,
  ch:[
    {t:`Utiliser les faux papiers`,s:`Si tu en as`,req:R.flag(`q7_papers`,`Papiers requis`),fx:{next:`q7_3`,cred:3,msg:`Les agents lisent, hésitent, laissent passer. Un soulagement muet.`}},
    {t:`Distraire les agents`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{next:`q7_3`,cred:4,msg:`Une histoire inventée, un sourire, une cigarette offerte. On t'ouvre la barrière.`},ko:{next:`q7_3`,hp:-14,ed:-300,msg:`Ils veulent fouiller. Un pot-de-vin règle la question.`}}},
    {t:`Forcer le barrage`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:9,ok:{next:`q7_3`,cred:7,bloc:{loi:-5},msg:`Un coup d'accélérateur, une barrière brisée, des tirs derrière toi. Vous passez.`},ko:{next:`q7_3`,hp:-30,bloc:{loi:-6},msg:`Les agents tirent. Vous passez, mais vous saignez.`}}}
  ]});
card({id:`q7_3`,who:`nomad`,tag:`Quête · Le passeur (3/3)`,once:true,
  tx:`De l'autre côté, dans les Badlands, la famille descend. Le père te serre les mains, la mère pleure en silence. Le passeur, lui, compte les billets : « Ta part, comme convenu. Mais tu peux aussi leur laisser. »`,
  ch:[
    {t:`Prendre ta part`,s:`+Gain`,fx:{...qend(`q7`),ed:4000,cred:5,bloc:{nomad:5},msg:`L'argent est réel. Les visages dans le rétroviseur, aussi.`}},
    {t:`Leur laisser ta part`,s:`+Humanité`,fx:{...qend(`q7`),ed:1500,hum:15,cred:7,rel:{panam:5},bloc:{nomad:6},msg:`Le père n'arrive pas à parler. Dans leurs yeux, quelque chose que l'argent ne peut pas payer.`}}
  ]});

/* ---------- Q2 · La BD disparue (Judy) ---------- */
card({id:`q2_1`,who:`judy`,tag:`Quête · La BD disparue (1/3)`,once:true,w:7,cond:()=>QOK()&&rel(`judy`)>=10,
  tx:`Judy t'attrape par le bras, la voix serrée : « Une amie du Lizzie's Bar a disparu. Elle avait enregistré une BD d'elle-même pour sa famille. Elle est introuvable, la BD aussi. Je ne sais pas à qui m'adresser. »`,
  ch:[
    {t:`Enquêter dans les bas-fonds de Kabuki`,s:`INTELLECT`,chk:{a:`int`,dc:7,ok:{...qon,next:`q2_2`,flag:[`q_active`,`q2_lead`],rel:{judy:6},msg:`Un barman parle. Une silhouette, un van, une adresse à Japantown.`},ko:{...qon,next:`q2_2`,rel:{judy:3},msg:`Peu d'indices, mais une piste : Japantown.`}}},
    {t:`Demander à Misty ses visions`,s:`+Humanité`,fx:{...qon,next:`q2_2`,hum:6,rel:{judy:4,misty:6},msg:`Misty bat ses cartes. « Un lieu bruyant. Des tigres. Elle n'est pas morte. »`}},
    {t:`Refuser`,fx:{rel:{judy:-6},unonce:`q2_1`}}
  ]});
card({id:`q2_2`,who:`claws`,tag:`Quête · La BD disparue (2/3)`,once:true,
  tx:`Un dojo de Japantown, fermé pour la nuit. Des Tyger Claws gardent la porte. Derrière, on entend des sanglots étouffés. Tu pourrais les affronter, les contourner, ou négocier un accès.`,
  ch:[
    {t:`Entrer par la force`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:8,ok:{next:`q2_3`,cred:5,fac:{tygers:-8},msg:`Deux gardes au sol, un troisième qui détale. La porte cède.`},ko:{next:`q2_3`,hp:-24,fac:{tygers:-8},msg:`Les Tyger Claws te repoussent. Tu entres quand même, à genoux.`}}},
    {t:`Négocier avec le lieutenant`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{next:`q2_3`,ed:-600,fac:{tygers:3},msg:`Une somme, un geste. On t'ouvre, sans bruit.`},ko:{next:`q2_3`,hp:-12,msg:`On te laisse entrer, mais on te rappellera cet affront.`}}},
    {t:`Passer par le toit`,s:`RÉFLEXES · furtivité`,chk:{a:`ref`,k:`stl`,dc:8,ok:{next:`q2_3`,cred:4,msg:`Tuiles, câble, lucarne. Tu es déjà à l'intérieur.`},ko:{next:`q2_3`,hp:-14,msg:`Un faux pas. Tu atterris dans la salle, un peu brutalement.`}}}
  ]});
card({id:`q2_3`,who:`judy`,tag:`Quête · La BD disparue (3/3)`,once:true,
  tx:`Dans une salle de karaoké désaffectée, l'amie de Judy, attachée, la BD dans les mains d'un Tyger. Il te regarde avec un sourire cassé : « Tu veux la BD ? Elle vaut cher. Mais elle, elle ne vaut rien. »`,
  ch:[
    {t:`Libérer l'amie`,s:`CORPS/RÉFLEXES`,chk:{a:`ref`,k:`cmb`,dc:8,ok:{...qend(`q2`),hum:12,cred:7,rel:{judy:16},fac:{mox:10},msg:`Les liens tombent. Judy fond en larmes en la serrant dans ses bras.`},ko:{...qend(`q2`),hp:-26,hum:8,rel:{judy:10},fac:{mox:6},msg:`Tu la sauves, mais payes cher.`}}},
    {t:`Récupérer la BD d'abord`,s:`Risqué`,fx:{...qend(`q2`),hum:-6,rel:{judy:-6},ed:1500,msg:`La BD est à toi. L'amie, moins. Judy ne te le pardonnera pas.`}}
  ]});

/* ---------- Q3 · Convoi maudit (Panam) ---------- */
card({id:`q3_1`,who:`panam`,tag:`Quête · Convoi maudit (1/3)`,once:true,w:7,cond:()=>QOK()&&(rel(`panam`)>=10||G.fac.aldecaldos>=15),
  tx:`Panam, inquiète : « Un convoi des nôtres devait rentrer hier. Plus de signal. Dans les Badlands, ça signifie des Raffen Shiv ou pire. Je veux y aller avec quelqu'un en qui j'ai confiance. »`,
  ch:[
    {t:`Partir avec elle en voiture`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:7,ok:{...qon,next:`q3_2`,rel:{panam:8},msg:`Une course dans la poussière. Vous trouvez des traces de pneus qui dévient.`},ko:{...qon,next:`q3_2`,hp:-8,rel:{panam:4},msg:`Un ensablement. Vous perdez du temps.`}}},
    {t:`Lui conseiller de prévenir Saul`,fx:{rel:{panam:-4},unonce:`q3_1`,msg:`« On n'a pas le temps. » Elle part sans toi.`}}
  ]});
card({id:`q3_2`,who:`nomad`,tag:`Quête · Convoi maudit (2/3)`,once:true,
  tx:`Une épave à l'orée du désert : le Thorton du convoi, vide, sans une goutte d'essence. Des empreintes de bottes, des douilles, une silhouette qui rôde derrière une dune. Les Raffen Shiv.`,
  ch:[
    {t:`Les attaquer avec Panam`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:8,ok:{next:`q3_3`,cred:6,rel:{panam:8},msg:`Un échange de tirs bref. Les Raffen Shiv détalent.`},ko:{next:`q3_3`,hp:-26,rel:{panam:5},msg:`Une balle, puis deux. Vous les mettez en fuite, mais mal en point.`}}},
    {t:`Les piéger avec une fausse cargaison`,s:`INTELLECT`,chk:{a:`int`,dc:8,ok:{next:`q3_3`,cred:5,rel:{panam:10},msg:`Un leurre, une ruse. Les Raffen Shiv se jettent dessus.`},ko:{next:`q3_3`,hp:-14,msg:`Le piège rate à moitié. Vous vous en tirez.`}}}
  ]});
card({id:`q3_3`,who:`saul`,tag:`Quête · Convoi maudit (3/3)`,once:true,
  tx:`Les nomades survivants sont là, ligotés dans un coin. Saul Bright en personne arrive peu après, grave. « Merci d'être venu(e). La route nous doit une dette. Choisis ce que tu veux de nous. »`,
  ch:[
    {t:`Un véhicule du clan`,s:`Thorton Colby`,fx:{...qend(`q3`),gear:`thorton`,rel:{panam:14},fac:{aldecaldos:12},bloc:{nomad:6},msg:`Saul te tend les clés d'un Thorton retapé. « Il a besoin d'un conducteur. »`}},
    {t:`Une veste Aldecaldos`,s:`Armure`,fx:{...qend(`q3`),gear:`aldejacket`,rel:{panam:14},fac:{aldecaldos:12},bloc:{nomad:6},msg:`Saul te passe la veste sur les épaules. « Tu es des nôtres. »`}},
    {t:`Rien, ta récompense est ailleurs`,s:`+Humanité`,fx:{...qend(`q3`),hum:12,rel:{panam:18,saul:0},fac:{aldecaldos:15},msg:`Saul sourit. « Un jour, on s'en souviendra. »`}}
  ]});

/* ---------- Q5 · Chasse au chrome (Vik) ---------- */
card({id:`q5_1`,who:`vik`,tag:`Quête · Chasse au chrome (1/3)`,once:true,w:7,cond:()=>QOK()&&rel(`vik`)>=15,
  tx:`Vik te montre un corps sur sa table : un jeune homme, éviscéré, implants arrachés. « Quelqu'un fait ça à des gamins de Watson. Un ripperdoc sans scrupules. Je veux qu'il s'arrête. »`,
  ch:[
    {t:`Remonter la piste des implants`,s:`INTELLECT`,chk:{a:`int`,dc:7,ok:{...qon,next:`q5_2`,rel:{vik:8},flag:[`q_active`,`q5_lead`],msg:`Les numéros de série mènent à un revendeur de Rancho Coronado.`},ko:{...qon,next:`q5_2`,rel:{vik:4},msg:`Tu suis des pistes floues.`}}},
    {t:`Demander aux Mox et à la rue`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{...qon,next:`q5_2`,rel:{vik:6},fac:{mox:4},msg:`Les filles du Lizzie's Bar connaissent le boucher : une camionnette sans plaque.`},ko:{...qon,next:`q5_2`,msg:`On ne te dit rien.`}}}
  ]});
card({id:`q5_2`,who:`scav`,tag:`Quête · Chasse au chrome (2/3)`,once:true,
  tx:`Le revendeur est un Scav bourré, au milieu de sa camionnette de pièces. Il te regarde sans comprendre. « Le doc ? Il ne me dit rien. Mais je sais où il opère. Un ancien entrepôt. »`,
  ch:[
    {t:`L'interroger rudement`,s:`CORPS`,chk:{a:`body`,dc:7,ok:{next:`q5_3`,hum:-3,msg:`Il craque en cinq minutes : une adresse précise.`},ko:{next:`q5_3`,hp:-12,msg:`Il se débat, te griffe. Tu obtiens l'adresse quand même.`}}},
    {t:`Le payer`,s:`−400 €$`,req:R.ed(400),fx:{ed:-400,next:`q5_3`,hum:2,msg:`L'argent parle. Il murmure l'adresse en regardant ailleurs.`}}
  ]});
card({id:`q5_3`,who:`fingers`,tag:`Quête · Chasse au chrome (3/3)`,once:true,
  tx:`Une salle d'opération glauque, des seringues sur la table, un homme en blouse tachée qui sursaute. « Ne me faites pas de mal. Je ne fais que… vendre des pièces. » Des bruits dans la pièce voisine : un jeune patient, sédaté, qui respire à peine.`,
  ch:[
    {t:`Maîtriser le boucher et libérer le patient`,s:`CORPS/RÉFLEXES`,chk:{a:`ref`,k:`cmb`,dc:8,ok:{...qend(`q5`),hum:12,cred:7,rel:{vik:16},msg:`Le boucher est neutralisé, le patient sauvé. Vik te remercie d'une voix étranglée.`},ko:{...qend(`q5`),hp:-24,hum:8,rel:{vik:10},msg:`Le boucher blesse le patient en fuyant. Tu le sauves de justesse.`}}},
    {t:`Le livrer à la police`,s:`Légal`,fx:{...qend(`q5`),cred:3,bloc:{loi:6},rel:{vik:8},msg:`La NCPD le prend en charge. Qui sait ce qui lui arrivera vraiment.`}},
    {t:`Le laisser filer contre de l'argent`,s:`−Humanité`,fx:{...qend(`q5`),ed:2500,hum:-14,rel:{vik:-14},msg:`Tu prends l'argent. Vik ne te le pardonnera pas.`}}
  ]});

/* ---------- Q6 · La bande volée (Kerry) ---------- */
card({id:`q6_1`,who:`kerry`,tag:`Quête · La bande volée (1/2)`,once:true,w:7,cond:()=>QOK()&&rel(`kerry`)>=10,
  tx:`Kerry fait les cent pas dans une loge : « On m'a volé les bandes de mon prochain album. Quelqu'un va les vendre à un label de Westbrook. Je dois les récupérer avant demain soir. »`,
  ch:[
    {t:`Infiltrer le label`,s:`SANG-FROID · furtivité`,chk:{a:`cool`,k:`stl`,dc:8,ok:{...qon,next:`q6_2`,rel:{kerry:8},msg:`Un badge, un faux sourire, une porte entrouverte. Tu les trouves.`},ko:{...qon,next:`q6_2`,hp:-12,rel:{kerry:4},msg:`On te repère. Tu t'enfuis avec un morceau de ce qu'il te fallait.`}}},
    {t:`Menacer le voleur`,s:`CORPS`,chk:{a:`body`,dc:7,ok:{...qon,next:`q6_2`,rel:{kerry:6},msg:`Le voleur ne résiste pas longtemps. Il parle.`},ko:{...qon,next:`q6_2`,hp:-14,msg:`Il avait des amis. Tu repars avec une migraine.`}}}
  ]});
card({id:`q6_2`,who:`kerry`,tag:`Quête · La bande volée (2/2)`,once:true,
  tx:`Tu tiens enfin la bande. Un type du label te rattrape : « Ces bandes valent des millions. Si tu les rends à Kerry, il garde son album. Si tu me les vends, tu deviens riche. » Tu hésites.`,
  ch:[
    {t:`Les rendre à Kerry`,s:`+Lien · +Humanité`,fx:{...qend(`q6`),hum:12,cred:8,rel:{kerry:18},role:{rocker:2},gear:`samurai`,msg:`Kerry te serre contre lui. Il te laisse une veste Samurai en cadeau, en souvenir de ses amis.`}},
    {t:`Les vendre au label`,s:`Gros gain · −Humanité`,heavy:`Tu trahis Kerry pour de l'argent. Il ne te le pardonnera pas.`,fx:{...qend(`q6`),ed:5500,hum:-12,rel:{kerry:-20},msg:`Une fortune. Kerry n'adressera plus jamais la parole à celui/celle qui l'a trahi.`}}
  ]});
