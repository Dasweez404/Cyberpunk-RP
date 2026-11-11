/* =====================================================================
   CARTES 6 — conséquences différées (échos), devoirs & pouvoir,
   nouveaux personnages récurrents
   ===================================================================== */
const EXN = () => (G.lastEx&&FAC[G.lastEx])?FAC[G.lastEx].n:`tes anciens frères`;

/* ---------- Échos : la trahison, le départ, le pouvoir ---------- */
card({id:`hunt_1`,who:`@ex`,tag:`☠ Prime sur ta tête`,cond:()=>false,
  tx:()=>`Une voiture sans plaque te suit depuis deux rues. Deux types descendent, calmes, mains visibles : « Tu as quelque chose qui appartient à <strong>${EXN()}</strong>. Leur loyauté, par exemple. Le chef a mis un prix sur ta tête, et c'est un joli prix. »`,
  ch:[
    {t:`Les affronter`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:9,ok:{cred:8,hum:-3,msg:`Deux corps au sol, le silence, puis la nuit. Le message est passé : tu ne te laisseras pas faire.`},ko:{hp:-38,ed:-500,msg:`Tu t'en sors à moitié mort(e). Ils ont pris ce qu'ils voulaient sur toi.`}}},
    {t:`Fuir par les toits`,s:`RÉFLEXES`,chk:{a:`ref`,dc:8,ok:{cred:3,msg:`Un câble, trois toits, un saut. Ils ont perdu ta trace — pour cette fois.`},ko:{hp:-24,msg:`Une balle te frôle l'épaule. Tu t'échappes en saignant.`}}},
    {t:`Racheter ta peau`,s:`−3 000 €$ · annule la suite`,req:R.ed(3000),fx:{ed:-3000,fn:`cancelHunt`,msg:`Un virement, un regard plein de mépris. « La prochaine fois, tu seras seul(e). » La prime est levée.`}}
  ]});
card({id:`hunt_2`,who:`@ex`,tag:`☠ Face à face`,cond:()=>false,
  tx:()=>`Un visage que tu connais : un de <strong>${EXN()}</strong> avec qui tu partageais le pain. Il se tient face à toi, l'arme baissée. « Je n'ai rien contre toi. Mais le chef a donné l'ordre. Et un ordre, c'est un ordre. » Ses yeux disent le contraire.`,
  ch:[
    {t:`Le convaincre de te laisser partir`,s:`SANG-FROID`,heavy:`Un échec peut te coûter cher.`,chk:{a:`cool`,dc:9,ok:{unflag:[`hunted`],cred:6,hum:6,msg:`Il baisse l'arme. « Va-t'en. Et ne reviens jamais. » Tu viens de gagner ta liberté.`},ko:{hp:-30,hum:-4,msg:`Il hésite, puis tire. Tu t'en sors, mais il t'a manqué de peu.`}}},
    {t:`Le combattre`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:9,ok:{unflag:[`hunted`],cred:8,hum:-8,msg:`Un combat bref et terrible. Il tombe. Tu regardes ton ancien ami un long moment.`},ko:{hp:-40,msg:`Il est meilleur que toi ce soir. Tu fuis, sanglant(e).`}}},
    {t:`Offrir tout ce que tu as`,s:`−5 000 €$ · réconciliation partielle`,req:R.ed(5000),fx:{ed:-5000,unflag:[`hunted`],hum:4,msg:`Tu lui tends l'argent. Il le regarde, puis toi. « Ça ne rachète rien. Mais je dirai que j'ai échoué. »`}}
  ]});
card({id:`ex_grudge`,who:`@ex`,tag:`Un ancien frère`,cond:()=>false,
  tx:()=>`Au détour d'un marché, un ancien de <strong>${EXN()}</strong> te croise. Rien n'est dit. Mais tout est dans le regard : la trahison n'a pas de prescription dans la rue.`,
  ch:[
    {t:`Lui parler franchement`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{hum:5,cred:2,msg:`Un échange court, sans excuses. Il hoche la tête. Une trêve de fait.`},ko:{hp:-10,msg:`Il crache à terre. Un coup de poing que tu n'as pas vu venir.`}}},
    {t:`L'ignorer`,fx:{hum:-2,msg:`Tu passes ton chemin. Il ne te lâche pas du regard.`}},
    {t:`Le provoquer`,s:`Cred · risque`,chk:{a:`body`,dc:7,ok:{cred:4,msg:`Tu le fais reculer devant tout le monde.`},ko:{hp:-14,cred:-2,msg:`Il frappe plus fort que prévu.`}}}
  ]});
card({id:`duty_tribute`,who:`@fac`,tag:`Devoirs de la famille`,w:6,cond:()=>G.member&&G.flags.duty&&G.rank>=2&&!isLeader(),
  tx:()=>`Un haut gradé de <strong>${FAC[G.member].n}</strong> te rappelle les règles : « Plus on monte, plus on paie. La famille réclame sa part sur tes gains. C'est la loi. Tu es ${RANKS[FAC[G.member].k][G.rank]}, pas un touriste. »`,
  ch:[
    {t:`Payer ta part`,s:`−${`1 500`} €$ · loyauté`,req:R.ed(1500),fx:{ed:-1500,fn:`facLoyal`,hum:2,msg:`Tu payes sans un mot. Les anciens notent ta loyauté.`}},
    {t:`Négocier un délai`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{cred:3,msg:`Tu obtiens un sursis, sans perdre la face.`},ko:{ed:-1500,fac:{},cred:-2,msg:`On te rappelle à l'ordre. Tu paies quand même.`}}},
    {t:`Refuser de payer`,s:`Défi · rep −`,heavy:`Refuser de payer ta famille est un défi ouvert. Elle s'en souviendra.`,fx:{cred:2,hum:-2,msg:`Silence glacial. Tu viens de te faire des ennemis dans ta propre maison.`,fn:`facDefy`}}
  ]});
card({id:`maelstrom_chrome`,who:`dum`,tag:`Maelstrom · Offre de chrome`,once:true,w:8,cond:()=>G.member===`maelstrom`&&G.rank>=1,
  tx:`Dum Dum te tape sur l'épaule, un sourire mécanique : « Un frère du Maelstrom ne se contente pas de sa chair. J'ai du chrome pour toi, gratuit. Un cadeau de la famille. Tu ne vas pas refuser, hein ? »`,
  ch:[
    {t:`Accepter le chrome`,s:`Gratuit · −Humanité`,heavy:`Le chrome Maelstrom ne coûte pas d'argent. Il coûte ce que tu as de plus précieux : ton humanité.`,fx:{cy:`kerenzikov`,hum:-12,fac:{maelstrom:8},cred:2,msg:`La lame brille sous ta peau. Dum Dum rit. « Bienvenue dans la lumière. »`}},
    {t:`Refuser poliment`,s:`Rep − · +Humanité`,fx:{hum:4,fac:{maelstrom:-10},cred:2,msg:`Le sourire de Dum Dum se fige. « Tu vois ça comme une insulte. Moi aussi. »`}}
  ]});
card({id:`leader_dispute`,who:`@fac`,tag:`Le poids du pouvoir`,cond:()=>false,
  tx:()=>`Deux de tes lieutenants se disputent devant tout le monde, au sujet d'un territoire. L'un est brillant et loyal, l'autre ambitieux et brutal. Tout le monde attend ton verdict. <strong>${FAC[G.member]?FAC[G.member].n:`La famille`}</strong> retient son souffle.`,
  ch:[
    {t:`Donner raison au loyal`,s:`Sûr · l'ambitieux t'en voudra`,fx:{cred:3,hum:3,echo:{leader_coup:6},msg:`Le loyal baisse la tête, reconnaissant. L'ambitieux serre la mâchoire. Il s'en souviendra.`}},
    {t:`Donner raison à l'ambitieux`,s:`Fort · −Humanité`,fx:{cred:5,hum:-4,msg:`L'ambitieux sourit. Le loyal te regarde avec une déception muette.`}},
    {t:`Trancher en leader`,s:`SANG-FROID`,heavy:`Tu imposes ta propre décision à tes deux lieutenants.`,chk:{a:`cool`,dc:8,ok:{cred:8,hum:3,msg:`Ton verdict est dur mais juste. Personne n'ose le contester.`},ko:{cred:-2,echo:{leader_coup:5},msg:`Ton verdict ne satisfait personne. Les couteaux se préparent.`}}}
  ]});
card({id:`leader_coup`,who:`@fac`,tag:`⚠ Complot`,cond:()=>false,
  tx:()=>`Une rumeur te parvient : un de tes proches lieutenants prépare un coup contre toi. Des discussions la nuit, des armes déplacées, des regards fuyants. <strong>${FAC[G.member]?FAC[G.member].n:`Ta famille`}</strong> pourrait basculer d'un jour à l'autre.`,
  ch:[
    {t:`Frapper en premier`,s:`CORPS · combat`,heavy:`Tu élimines un de tes propres lieutenants pour sauver ta place.`,chk:{a:`body`,k:`cmb`,dc:9,ok:{cred:9,hum:-8,msg:`Le complot meurt avec le traître. La famille te craint — et te suit.`},ko:{hp:-35,fn:`loseLead`,msg:`Le coup tourne mal. Tu perds la couronne et manques de perdre la vie.`}}},
    {t:`Acheter sa loyauté`,s:`−3 000 €$`,req:R.ed(3000),fx:{ed:-3000,cred:2,msg:`Un virement, un sourire. La loyauté s'achète, et se paie en retour.`}},
    {t:`Ignorer la rumeur`,s:`Risque de perdre le pouvoir`,chk:{a:`cool`,dc:7,ok:{cred:2,msg:`Ce n'était qu'une rumeur. Cette fois.`},ko:{fn:`loseLead`,hum:-4,msg:`Elle était vraie. On te retire la couronne au petit matin.`}}}
  ]});
card({id:`mine_traitor`,who:`narr`,tag:`⚠ Un lieutenant te trahit`,once:true,w:5,cond:()=>G.mine&&ownedList().length>=2,
  tx:()=>`Un de tes lieutenants négocie en secret avec un rival : il lui livre des infos sur les défenses de <strong>${G.mine.name}</strong>. Tu le sais. Lui ne sait pas que tu le sais.`,
  ch:[
    {t:`L'expulser`,s:`Puissance −1`,fx:{fn:`mineLose`,hum:2,cred:2,msg:`Il disparaît du jour au lendemain. Tes hommes comprennent le message.`}},
    {t:`Lui pardonner`,s:`Risque · +Humanité`,fx:{hum:8,echo:{leader_coup:8},msg:`Il baisse les yeux. « Merci. » Tu n'es pas sûr(e) que ce soit une bonne idée.`}},
    {t:`L'éliminer`,s:`−Humanité`,heavy:`Tu élimines quelqu'un qui t'a servi.`,fx:{hum:-10,cred:6,fn:`mineGrow`,msg:`Le silence qui suit est plus lourd que n'importe quel cri.`}}
  ]});

/* ---------- Nouveaux personnages ---------- */
card({id:`meet_chino`,who:`chino`,tag:`Rencontre · Chino`,once:true,w:6,cond:()=>rel(`chino`)<5&&(G.sub===`heywood`||(G.fac.valentinos||0)>=5),
  tx:`Devant l'église de Wellsprings, un Valentino aux mains abîmées allume une bougie. « Chino. On se croise souvent, toi et moi, sans jamais se parler. Un petit service ? J'ai besoin de quelqu'un en qui je peux avoir confiance pour porter un message à un vieux de Heywood. »`,
  ch:[
    {t:`Porter le message`,s:`SANG-FROID`,chk:{a:`cool`,dc:6,ok:{rel:{chino:14},fac:{valentinos:5},cred:3,msg:`Le vieux sourit, te serre la main. Chino hoche la tête en silence.`},ko:{rel:{chino:6},hp:-8,msg:`Un malentendu, un coup de bâton. Tu arrives quand même à t'expliquer.`}}},
    {t:`Lui dire de le faire lui-même`,fx:{rel:{chino:-3},msg:`Il hausse les épaules. « Comme tu veux, hermano. »`}}
  ]});
card({id:`chino_2`,who:`chino`,tag:`Chino · Une dette d'honneur`,once:true,w:7,cond:()=>rel(`chino`)>=30,
  tx:`Chino a le regard sombre : « Un des nôtres est tombé. Les Maelstrom. Je dois lui rendre justice, mais je ne veux pas partir seul. Tu es avec moi ? »`,
  ch:[
    {t:`Y aller avec lui`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:8,ok:{rel:{chino:16},fac:{valentinos:8,maelstrom:-8},cred:6,msg:`Une nuit rouge à Northside. Vous repartez ensemble, silencieux, vivants.`},ko:{hp:-30,rel:{chino:10},msg:`Ça tourne mal, mais vous vous couvrez l'un l'autre. Il ne l'oubliera pas.`}}},
    {t:`Le convaincre d'attendre`,s:`SANG-FROID`,fx:{rel:{chino:6},hum:4,msg:`« Peut-être que tu as raison. Mais ils ne vont pas oublier. »`}}
  ]});
card({id:`meet_nadia`,who:`nadia`,tag:`Rencontre · Nadia`,once:true,w:6,cond:()=>rel(`nadia`)<5&&yr()>=2072&&A(`int`)>=4,
  tx:`Une jeune femme aux cheveux rasés d'un côté t'attrape par le bras dans une ruelle de Kabuki. « Je m'appelle Nadia. J'étais Maelstrom. J'ai fui avec des données qu'ils veulent récupérer. J'ai besoin qu'on efface mes traces. Tu t'y connais ? »`,
  ch:[
    {t:`Effacer ses traces par hack`,s:`INTELLECT`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:7,ok:{rel:{nadia:14},cred:3,fac:{maelstrom:-6},msg:`Un nettoyage propre, un code qui se dissout. Nadia soupire de soulagement.`},ko:{rel:{nadia:6},hp:-10,msg:`Un trace subsiste. Elle devra quitter la ville avant la fin de la semaine.`}}},
    {t:`La cacher quelque temps`,s:`SANG-FROID`,fx:{rel:{nadia:12},hum:4,fac:{maelstrom:-4},msg:`Un coin de toit, une couverture, un thé. Elle te regarde avec une reconnaissance silencieuse.`}},
    {t:`La livrer aux Maelstrom`,s:`−Humanité · Gros gain`,heavy:`Tu livres une fuyarde à ses bourreaux.`,fx:{ed:2500,hum:-14,fac:{maelstrom:10},rel:{nadia:-30},msg:`Ils te paient grassement. Elle crie ton nom quand ils l'emmènent.`}}
  ]});
card({id:`nadia_2`,who:`nadia`,tag:`Nadia · Une leçon`,once:true,w:7,cond:()=>rel(`nadia`)>=30,
  tx:`Nadia t'apprend ses astuces de netrunneuse maelstrom : des angles que personne n'enseigne. « Ils ne les ont pas inventés. Ils les ont volés. Je te les donne. »`,
  ch:[
    {t:`Apprendre`,s:`+XP INT`,fx:{xp:{int:6},rel:{nadia:10},hum:-2,msg:`Des raccourcis sombres, efficaces. Tu comprends mieux les cerveaux dérangés.`}},
    {t:`Lui demander ce qu'elle a vraiment volé`,fx:{rel:{nadia:8},cred:4,ed:800,msg:`Elle sourit : « Un peu d'argent, beaucoup de secrets. Prends ta part. »`}}
  ]});
card({id:`meet_mika`,who:`mika`,tag:`Rencontre · Mika`,once:true,w:6,cond:()=>rel(`mika`)<5&&(G.hp<75||G.cyber.length>=1),
  tx:`Une porte basse, un néon rose : « MIKA — soins sans questions ». À l'intérieur, une doc fatiguée, des mains sûres, des diplômes qui n'existent pas. « Assieds-toi. Ça va piquer. Mais moins que la rue. »`,
  ch:[
    {t:`La laisser te soigner`,s:`+Santé`,fx:{hp:30,rel:{mika:14},ed:-100,msg:`Quelques points de suture, une piqûre, un regard doux. Elle refuse la moitié du prix.`}},
    {t:`Lui poser des questions sur son travail`,s:`+Humanité`,fx:{hum:6,rel:{mika:10},msg:`Elle parle des cliniques qu'elle a perdues, des gens qu'elle a sauvés. Tu repars plus lourd(e)… et plus humain(e).`}}
  ]});
card({id:`mika_2`,who:`mika`,tag:`Mika · Un cadeau`,once:true,w:7,cond:()=>rel(`mika`)>=30,
  tx:`Mika ferme la porte et sort un étui de sous le comptoir : « Tendons renforcés, d'occasion. Pas de papiers, pas de garantie. Mais ils marchent. Je les gardais pour quelqu'un de bien. »`,
  ch:[
    {t:`Les accepter`,s:`Reinforced Tendons offerts`,fx:{cy:`tendons`,rel:{mika:10},hum:-3,msg:`Quelques minutes de douleur, puis une légèreté nouvelle dans les jambes.`}},
    {t:`Lui dire de les vendre`,s:`+Humanité`,fx:{hum:10,rel:{mika:14},msg:`Elle te regarde longtemps. « Tu es rare, toi. »`}}
  ]});
card({id:`meet_hiro`,who:`hiro`,tag:`Rencontre · Hiro`,once:true,w:6,cond:()=>rel(`hiro`)<5&&G.cred>=15,
  tx:`Dans un bar de Charter Hill, un ingénieur de Kang Tao regarde son verre : « Je suis Hiro. Je travaille sur des armes qu'on n'utilisera jamais dans le bon sens. Je voudrais partir. Si on me reconnaît, je suis mort. »`,
  ch:[
    {t:`L'aider à disparaître`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{rel:{hiro:16},fac:{kangtao:-8},cred:4,msg:`Un faux nom, un billet de train. Il serre ta main longtemps.`},ko:{rel:{hiro:8},hp:-14,fac:{kangtao:-6},msg:`Un témoin te repère. Il s'en sort. Toi, avec une balle dans l'épaule.`}}},
    {t:`Le dénoncer à Kang Tao`,s:`+Rep corpo · −Humanité`,heavy:`Tu livres un homme qui t'a fait confiance.`,fx:{ed:1800,fac:{kangtao:12},hum:-10,rel:{hiro:-30},msg:`Kang Tao te remercie. Il ne sera plus jamais vu.`}}
  ]});
card({id:`hiro_2`,who:`hiro`,tag:`Hiro · Prototype`,once:true,w:7,cond:()=>rel(`hiro`)>=30,
  tx:`Hiro te remet une mallette : « Un prototype d'armure légère. Il m'a coûté mon poste, mais il est à toi. Ne le montre pas aux corpos. »`,
  ch:[
    {t:`L'accepter`,s:`Armure Kang Tao offerte`,fx:{gear:`kangarmor`,rel:{hiro:10},msg:`Elle épouse tes épaules comme une seconde peau. Presque trop belle.`}},
    {t:`Lui conseiller de la garder pour lui`,fx:{hum:8,rel:{hiro:14},msg:`« Tu es vraiment bizarre, toi. Ça me plaît. »`}}
  ]});
card({id:`meet_eli`,who:`eli`,tag:`Rencontre · Eli`,once:true,w:6,cond:()=>rel(`eli`)<5&&A(`int`)>=5,
  tx:`Un homme en costume banal s'assoit en face de toi dans un diner de Downtown. « Eli. NetWatch. Je ne devrais pas être là. Je ne devrais pas te parler. Mais j'ai des choses à dire sur ce qu'on cache sous le Mur. »`,
  ch:[
    {t:`L'écouter jusqu'au bout`,s:`INTELLECT`,chk:{a:`int`,dc:7,ok:{rel:{eli:14},xp:{int:3},cred:3,msg:`Il parle trois heures. Quand il part, tu sais des choses que tu aurais préféré ignorer.`},ko:{rel:{eli:6},hum:-3,msg:`Il parle trop vite. Tu retiens l'essentiel — et l'angoisse.`}}},
    {t:`Le dénoncer à NetWatch`,s:`−Humanité`,heavy:`Tu livres un homme qui te confie des secrets.`,fx:{ed:1500,hum:-8,rel:{eli:-30},msg:`NetWatch te remercie. Eli disparaît dans la semaine.`}}
  ]});
card({id:`eli_2`,who:`eli`,tag:`Eli · Un avertissement`,once:true,w:7,cond:()=>rel(`eli`)>=30,
  tx:`Eli te glisse un message : « NetWatch va lancer un balayage dans ton quartier. Évite le Net trois jours. Et prends ça : une porte dérobée que j'ai laissée pour moi. »`,
  ch:[
    {t:`Prendre la porte dérobée`,s:`+XP INT · +Cred`,fx:{xp:{int:4},cred:4,rel:{eli:10},msg:`Une adresse, un code. Un secret qu'il t'a confié, entre nous.`}},
    {t:`Le remercier et te mettre au vert`,s:`+Humanité`,fx:{hum:6,rel:{eli:12},msg:`Tu te fais discret(e). Le balayage ne trouve rien.`}}
  ]});
card({id:`meet_hands`,who:`hands`,tag:`Rencontre · Mr. Hands`,once:true,w:6,cond:()=>rel(`hands`)<5&&G.cred>=18,
  tx:`Un homme élégant te tend un verre sans te demander ton nom. « On m'appelle Mr. Hands. Je suis un fixer, comme d'autres. Sauf que je ne travaille pas pour tout le monde. Quand j'ai un client discret, je cherche quelqu'un de discret. »`,
  ch:[
    {t:`Écouter son offre`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{rel:{hands:14},ed:2200,cred:5,msg:`Un contrat propre, une enveloppe épaisse. Il hoche la tête : « On se reverra. »`},ko:{rel:{hands:6},ed:300,msg:`Il lit en toi trop de nervosité. Il paie quand même, à contrecœur.`}}},
    {t:`Refuser, tu ne bosses pas pour n'importe qui`,s:`+Cred`,fx:{cred:3,rel:{hands:4},msg:`« Fier(e). J'aime ça. Réfléchis. »`}}
  ]});
card({id:`hands_2`,who:`hands`,tag:`Mr. Hands · Une faveur`,once:true,w:7,cond:()=>rel(`hands`)>=30,
  tx:`Mr. Hands te donne rendez-vous dans un salon vide : « J'ai un client qui ne peut pas être vu avec moi. Tu serais mes yeux. En échange : de l'argent, mon carnet, et ma discrétion. »`,
  ch:[
    {t:`Accepter`,s:`+Gain · +XP COOL`,fx:{ed:3500,xp:{cool:5},rel:{hands:12},cred:4,msg:`Tu fais ce qu'on te demande, sans une question. Il te paie le double.`}},
    {t:`Décliner`,fx:{rel:{hands:-2},hum:3}}
  ]});
