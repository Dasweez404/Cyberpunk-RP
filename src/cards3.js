/* =====================================================================
   CARTES 3 — hacking accessible, rencontres, relations de niveau 2,
   conséquences (alliés en danger, trahisons)
   ===================================================================== */

/* ---------- Quête : apprendre le Net (mentor) ---------- */
card({id:`hk_q1`,who:`lucy`,tag:`Quête · Apprendre le Net`,w:7,cond:()=>!G.flags.hackmentor&&!G.flags.hk_q&&A(`int`)>=4&&yr()>=2070,
  tx:`Une netrunneuse te regarde forcer un distributeur de nouilles avec un vieux script. Elle sourit : « Mignon. Tu as du talent, mais tu pirates comme on casse une porte. Je peux t'apprendre à passer par les murs. Trois leçons. Ça te dit ? »`,
  ch:[
    {t:`Accepter ses leçons`,s:`Quête · Hacking avancé`,fx:{flag:[`hk_q`],next:`hk_q2`,rel:{lucy:6},msg:`« Alors commençons. Ne lève pas les yeux de l'écran. »`}},
    {t:`Décliner`,s:`Tu verras plus tard`,fx:{unonce:`hk_q1`,msg:`« Comme tu veux. Je suis souvent dans le coin. »`}}
  ]});
card({id:`hk_q2`,who:`lucy`,tag:`Quête 2/3 · L'épreuve du pare-feu`,once:true,
  tx:`Elle te tend un vieux terminal : trois couches de pare-feu simulées. « Passe-les sans te faire griller. À toi de décider de la méthode. »`,
  ch:[
    {t:`Les contourner par la logique`,s:`INTELLECT`,chk:{a:`int`,k:`hck`,dc:7,ok:{xp:{int:4},next:`hk_q3`,rel:{lucy:8},msg:`Une brèche, un pivot, une sortie propre. Elle hoche la tête.`},ko:{hp:-6,xp:{int:2},next:`hk_q3`,rel:{lucy:3},msg:`Tu te fais griller deux fois, mais tu t'accroches. « Pas mal, pour une première fois. »`}}},
    {t:`Improviser avec ton instinct`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{xp:{cool:3,int:2},next:`hk_q3`,rel:{lucy:6},msg:`Tu passes à l'instinct, sans te figer. Elle sourit.`},ko:{hp:-8,next:`hk_q3`,msg:`Le terminal grésille. Tu tiens bon malgré la migraine.`}}}
  ]});
card({id:`hk_q3`,who:`lucy`,tag:`Quête 3/3 · Premier run`,once:true,
  tx:`Dernière leçon : un vrai serveur, une vraie corpo. Elle reste derrière toi, les bras croisés. « Je ne touche à rien. À toi de jouer. Ne te débranche pas avant que je le dise. »`,
  ch:[
    {t:`Plonger prudemment`,s:`INTELLECT · hack`,chk:{a:`int`,k:`hck`,dc:7,ok:{fn:`hackMentor`,ed:800,rel:{lucy:12},cred:3,msg:`Tu reviens avec des données et un sourire. « Tu es prêt(e). Bienvenue dans le Net. »`},ko:{fn:`hackMentor`,hp:-12,rel:{lucy:6},msg:`Tu manques de te griller, mais Lucy te débranche à temps. « Bon. La suite, on la fera ensemble. »`}}},
    {t:`Plonger à fond`,s:`Risqué · INTELLECT`,chk:{a:`int`,k:`hck`,dc:9,ok:{fn:`hackMentor`,ed:1800,rel:{lucy:14},cred:5,msg:`Tu fais fondre le pare-feu comme du beurre. Lucy applaudit en silence.`},ko:{fn:`hackMentor`,hp:-25,hum:-3,msg:`Un contre-feu te brûle la nuque. Elle te sort de là, moqueuse mais fière.`}}}
  ]});

/* ---------- Rencontres ---------- */
card({id:`meet_panam`,who:`panam`,tag:`Rencontre · Panam`,once:true,w:7,cond:()=>rel(`panam`)<5&&(G.origin===`nomad`||yr()>=2072),
  tx:`Une nomade à la veste usée se bat contre un contrôle de police, un pistolet Techtronika à la main… qu'elle range avec un clin d'œil. « Panam. Aldecaldos. Tu as un problème avec le flic ? Moi oui. Un coup de main, ça t'irait ? »`,
  ch:[
    {t:`Détourner l'attention du flic`,s:`SANG-FROID`,chk:{a:`cool`,dc:6,ok:{rel:{panam:14},cred:3,msg:`Un faux accident, un malentendu. Elle file. « Tu as le chic, toi. »`},ko:{rel:{panam:6},hp:-8,msg:`Tu prends un coup de matraque pour elle. Elle revient te chercher.`}}},
    {t:`Lui laisser gérer`,fx:{rel:{panam:3},msg:`Elle s'en sort seule. « Pas mal pour un(e) spectateur(rice). »`}}
  ]});
card({id:`meet_claire`,who:`claire`,tag:`Rencontre · Claire`,once:true,w:6,cond:()=>rel(`claire`)<5&&(A(`ref`)>=5||skill(`drv`)>=1),
  tx:`Un garage de la périphérie, une odeur d'huile et de métal chaud. Une pilote te jauge au-dessus d'un capot ouvert : « Tu as les mains qui bougent bien. Tu sais conduire ? »`,
  ch:[
    {t:`Faire un tour d'essai`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:6,ok:{rel:{claire:14},cred:3,msg:`Un virage serré, un dérapage maîtrisé. Elle rit. « On se reverra. »`},ko:{rel:{claire:5},hp:-6,msg:`Tu cales deux fois. Elle te regarde, amusée.`}}},
    {t:`L'aider à réparer le moteur`,s:`TECHNIQUE`,chk:{a:`tech`,dc:6,ok:{rel:{claire:12},xp:{tech:3},msg:`Tu comprends l'astuce en deux minutes. Elle te tend une clé de 13.`},ko:{rel:{claire:4},msg:`Tu fais plus de dégâts que de réparations. Elle soupire.`}}}
  ]});
card({id:`meet_lucy`,who:`lucy`,tag:`Rencontre · Lucy`,once:true,w:6,cond:()=>rel(`lucy`)<5&&yr()>=2073&&A(`int`)>=5,
  tx:`Sur un toit de Kabuki, une jeune femme aux cheveux argentés regarde la Lune. « Tu aimes les étoiles ? Ici, on voit surtout des néons. » Elle te tend un écouteur : une chanson, un souvenir, quelque chose de fragile.`,
  ch:[
    {t:`Écouter avec elle`,s:`+Humanité`,fx:{hum:8,rel:{lucy:14},msg:`Pendant trois minutes, Night City se tait. Elle sourit sans te regarder.`}},
    {t:`Lui demander ce qu'elle fait ici`,s:`SANG-FROID`,fx:{rel:{lucy:8},cred:1,msg:`« Je prends l'air. Et je regarde les gens qui ne regardent pas les étoiles. »`}}
  ]});

/* ---------- Relations niveau 2 ---------- */
card({id:`jk_heist`,who:`jackie`,tag:`Jackie · Le grand plan`,once:true,w:8,cond:()=>rel(`jackie`)>=35&&yr()<=2076,
  tx:`Jackie déploie un plan sur la table du Coyote Cojo : « Un entrepôt de Maelstrom plein de matos. Trois étages, deux gardes par palier. Avec toi, ça passe. Et après, Mama n'aura plus à travailler la nuit. »`,
  ch:[
    {t:`Y aller avec lui`,s:`RÉFLEXES · combat`,chk:{a:`ref`,k:`cmb`,dc:9,ok:{ed:4500,cred:8,rel:{jackie:14},msg:`Vous sortez avec le matos et un fou rire. Jackie lève un poing vers le ciel.`},ko:{hp:-35,ed:500,rel:{jackie:6},msg:`Les Maelstrom vous coincent. Jackie te traîne dehors en jurant. Vous vous en sortez de justesse.`}}},
    {t:`Le convaincre d'abandonner`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{hum:6,rel:{jackie:10},msg:`« Tu as raison, choom. On trouvera autre chose. »`},ko:{rel:{jackie:-5},msg:`Il le fait quand même. Sans toi.`}}}
  ]});
card({id:`jd_lesson`,who:`judy`,tag:`Judy · Atelier de BD`,once:true,w:7,cond:()=>rel(`judy`)>=30,
  tx:`Judy te montre son atelier : des rangées de BD classées, des machines qui ronronnent. « Je te forme à l'édition. Ça pourrait te servir un jour. Écouter les souvenirs des gens, c'est apprendre à les comprendre. »`,
  ch:[
    {t:`Suivre la formation`,s:`+XP INT & COOL`,fx:{xp:{int:4,cool:3},rel:{judy:10},hum:5,msg:`Tu apprends à lire entre les lignes d'un souvenir. Judy sourit, fière.`}},
    {t:`Lui proposer un échange`,s:`Lien`,fx:{rel:{judy:8},hum:4}}
  ]});
card({id:`pn_race`,who:`panam`,tag:`Panam · Un cadeau`,once:true,w:7,cond:()=>rel(`panam`)>=40,
  tx:`Panam t'attend devant un Thorton fraîchement retapé : « Saul dit que tu fais partie de la famille. Alors voilà : une des bêtes du clan. Elle est à toi. Ne la plante pas dans un fossé, hein. »`,
  ch:[
    {t:`Accepter le véhicule`,s:`Véhicule offert`,fx:{gear:`archer`,rel:{panam:10},fac:{aldecaldos:8},cred:3,msg:`Elle te lance les clés. Le moteur tousse puis rugit. Les Aldecaldos applaudissent.`}},
    {t:`Refuser, lui dire que le clan en a plus besoin`,s:`+Humanité`,fx:{hum:8,rel:{panam:14},msg:`Elle ouvre la bouche, puis sourit. « T'es un(e) vrai(e) nomade, toi. »`}}
  ]});
card({id:`vk_secret`,who:`vik`,tag:`Vik · Un secret`,once:true,w:7,cond:()=>rel(`vik`)>=40,
  tx:`Vik verrouille la porte de la clinique. « J'ai un moniteur biologique de seconde main que je n'ai jamais vendu. Il fonctionne mieux que ceux du marché. Je ne le donne qu'à ceux en qui j'ai confiance. »`,
  ch:[
    {t:`L'accepter`,s:`Biomonitor offert`,fx:{cy:`biomon`,rel:{vik:10},hum:3,msg:`Quelques minutes sur la table. Un petit bip : ça tient.`}},
    {t:`Lui dire de le garder pour un patient`,s:`+Humanité`,fx:{hum:10,rel:{vik:14},msg:`Il te serre l'épaule. « Tu vas me rendre sentimental, toi. »`}}
  ]});
card({id:`ms_vision`,who:`misty`,tag:`Misty · Une vision`,once:true,w:7,cond:()=>rel(`misty`)>=40,
  tx:`Misty te regarde longtemps sans parler. « J'ai vu quelque chose pour toi. Pas la mort. Un choix. Quand tu le feras, tu sauras. Rappelle-toi simplement que tu n'es pas seul(e). »`,
  ch:[
    {t:`Lui faire confiance`,s:`+Humanité`,fx:{hum:20,rel:{misty:12},msg:`Une chaleur étrange dans la poitrine. Tu ressors plus léger.`}},
    {t:`Lui demander plus de détails`,fx:{hum:6,cred:2,rel:{misty:6},msg:`« Non. Certaines choses doivent rester des surprises. »`}}
  ]});
card({id:`kr_song`,who:`kerry`,tag:`Kerry · Une chanson`,once:true,w:7,cond:()=>rel(`kerry`)>=30,
  tx:`Kerry gratte une guitare, assis sur un ampli. « J'ai une chanson sur Night City. Je n'arrive pas à finir le refrain. Aide-moi : qu'est-ce que cette ville t'a pris ? »`,
  ch:[
    {t:`Lui raconter une vraie histoire`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{cred:6,hum:8,rel:{kerry:12},role:{rocker:2},msg:`Il note chaque mot. Quelques mois plus tard, tu entends un refrain qui te serre la gorge.`},ko:{hum:3,rel:{kerry:5},msg:`Tu cherches tes mots. Il sourit : « Même le silence, ça se met en musique. »`}}},
    {t:`Plaisanter et jouer un riff`,fx:{hum:5,rel:{kerry:8},cred:2}}
  ]});
card({id:`cl_gift`,who:`claire`,tag:`Claire · Pièce rare`,once:true,w:7,cond:()=>rel(`claire`)>=30,
  tx:`Claire dégage une bâche : une carrosserie rouge sombre, un moteur qui brille. « Je l'ai montée avec des pièces que personne ne voulait. Une bête. Elle n'a pas de propriétaire. Pas encore. »`,
  ch:[
    {t:`La prendre`,s:`Mizutani Shion offerte`,fx:{gear:`mizutani`,rel:{claire:10},cred:4,msg:`Le moteur gronde. Claire sourit, les mains grasses sur les hanches.`}},
    {t:`Lui proposer de la partager`,s:`+Lien`,fx:{rel:{claire:16},hum:5,msg:`Vous rédigez un contrat à l'encre de cambouis. Les courses à venir s'annoncent belles.`}}
  ]});
card({id:`mm_dinner`,who:`mama`,tag:`Mama Welles · À table`,once:true,w:7,cond:()=>rel(`mama`)>=30,
  tx:`Mama Welles te pousse vers la cuisine du Coyote Cojo : « Mange. Ne dis rien. Toi, tu as besoin de manger. Et ensuite, tu m'aideras avec les clients. »`,
  ch:[
    {t:`Manger avec elle`,s:`+Santé · +Humanité`,fx:{hp:30,hum:12,rel:{mama:10},fac:{valentinos:4},msg:`Un plat chaud, une main sur l'épaule, quelques mots simples. Rien d'autre à Night City ne vaut ça.`}},
    {t:`L'aider à servir`,s:`+Lien`,fx:{rel:{mama:14},ed:150,cred:2,fac:{valentinos:6},msg:`Les clients te saluent. Tu fais partie de la famille.`}}
  ]});
card({id:`rg_past`,who:`rogue`,tag:`Rogue · Un souvenir`,once:true,w:7,cond:()=>rel(`rogue`)>=30,
  tx:`Tard dans la nuit, l'Afterlife se vide. Rogue pose une bouteille entre vous : « Avant, je faisais confiance à tout le monde. C'est ce qui m'a presque tuée. Je ne le raconte à personne. Mais toi… »`,
  ch:[
    {t:`L'écouter jusqu'au bout`,s:`+Lien`,fx:{rel:{rogue:16},hum:8,cred:3,msg:`Elle parle de batailles et de pertes. Quand elle s'arrête, elle te sert un autre verre.`}},
    {t:`Lui proposer ton aide`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{rel:{rogue:14},cred:5,msg:`Elle te regarde longtemps. « Peut-être, oui. Un jour. »`},ko:{rel:{rogue:6},msg:`« Je n'ai besoin de personne. » Mais son regard dit autre chose.`}}}
  ]});
card({id:`dx_inner`,who:`dex`,tag:`Dex · Cercle proche`,once:true,w:7,cond:()=>rel(`dex`)>=30,
  tx:`Dex ferme son carnet : « Tu fais partie de mes gens de confiance. Les meilleurs contrats ne passent pas par le tableau. Tu veux entrer dans mon cercle ? »`,
  ch:[
    {t:`Entrer dans son cercle`,s:`Gigs +15 % de gains`,fx:{flag:[`dexvip`],rel:{dex:10},cred:3,msg:`Tu reçois un numéro privé. Les gigs te rapportent désormais plus.`}},
    {t:`Rester indépendant`,s:`+Humanité`,fx:{rel:{dex:6},hum:4}}
  ]});
card({id:`lc_lesson`,who:`lucy`,tag:`Lucy · Cours particulier`,once:true,w:7,cond:()=>rel(`lucy`)>=25,
  tx:`Lucy t'invite sur un toit. « Je te montre une technique que personne ne m'a apprise. On l'a juste trouvée, David et moi. Suis mes doigts. »`,
  ch:[
    {t:`Apprendre la technique`,s:`+XP INT · hack`,fx:{xp:{int:5},rel:{lucy:12},hum:4,msg:`Des lignes qui dansent, un rythme étrange. Quand tu rouvres les yeux, ton esprit voit autrement.`}},
    {t:`Lui poser une question sur la Lune`,fx:{hum:6,rel:{lucy:10},msg:`« J'irai. Un jour. Peut-être même avec toi. »`}}
  ]});

/* ---------- Conséquences ---------- */
card({id:`friend_danger`,who:`narr`,tag:`⚠ Un allié en danger`,w:9,cd:12,
  cond:()=>G.stats.cards>=8&&Object.keys(WHO).some(i=>REL_NAMES.includes(i)&&relv(i)>=25&&!(G.dead||{})[i]),
  tx:()=>{
    const l=REL_NAMES.filter(i=>relv(i)>=25&&!(G.dead||{})[i]); const id=l[rnd(0,l.length-1)];
    G.tmp={ally:id}; return `Un appel en pleine nuit : <strong>${WHO[id].n}</strong> est en danger. Une embuscade, une dette, un piège. Tu es peut-être le seul à pouvoir intervenir. Chaque minute compte.`;
  },
  ch:[
    {t:`Foncer à son secours`,s:`RÉFLEXES · combat`,chk:{a:`ref`,k:`cmb`,dc:9,ok:{fn:`allySaved`,cred:6,hum:6,msg:`Tu arrives à temps. Un coup de feu, un cri, le silence. Il/elle respire encore.`},ko:{hp:-35,fn:`allyLost`,msg:`Tu arrives trop tard. Il ne reste que le silence et l'odeur de la poudre.`}}},
    {t:`Payer la rançon`,s:`−2 000 €$ · sauvé(e) à coup sûr`,req:R.ed(2000),fx:{ed:-2000,fn:`allySaved`,hum:3,msg:`Un virement, un échange sec. La menace s'éloigne. Tu as sauvé quelqu'un, avec de l'argent.`}},
    {t:`Ne rien faire`,s:`Il/elle est seul(e)`,fx:{fn:`allyLost`,msg:`Tu fermes les yeux. Le lendemain, la nouvelle tombe. Tu aurais pu.`}}
  ]});
card({id:`dex_betray`,who:`dex`,tag:`Trahison de Dex`,once:true,w:40,cond:()=>G.flags.dex&&rel(`dex`)<=-8,
  tx:`Une embuscade, une bande de Maelstrom qui sait exactement où tu te trouves. Quelqu'un a vendu ta position. Dex te regarde de l'autre côté de la rue, le visage fermé : « Rien de personnel. Les affaires. »`,
  ch:[
    {t:`Te battre pour t'échapper`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:9,ok:{cred:6,hp:-15,msg:`Tu perces leur ligne et disparais. Dex ne t'aura pas aussi facilement.`},ko:{hp:-40,ed:-800,msg:`Tu t'en sors à peine, plus pauvre et plus lucide.`}}},
    {t:`Négocier`,s:`SANG-FROID`,chk:{a:`cool`,dc:9,ok:{ed:-400,rel:{dex:8},msg:`Tu rachètes ta peau et un semblant de paix.`},ko:{hp:-25,ed:-1000,msg:`Il a déjà vendu ton nom.`}}}
  ]});
