/* =====================================================================
   CARTES 2 — relations, arcs de faction, origines, netrunning, histoire,
   fins spéciales
   ===================================================================== */
R.rel=(id,v)=>()=>((G.rel||{})[id]||0)>=v?``:`Lien avec ${WHO[id].n} ${v}`;
const rel = id => (G.rel&&G.rel[id])||0;
Object.assign(WHO,{
  placide:{n:`Placide`,r:`Voodoo Boys · Bras droit de Brigitte`,c:`#05ffa1`,st:`bald`,sk:14},
  dum:{n:`Dum Dum`,r:`Maelstrom · Totentanz`,c:`#ff2a6d`,st:`visor`,sk:10},
  claire:{n:`Claire Russell`,r:`Pilote · Mécano`,c:`#fcee0a`,st:`cap`,sk:28},
  rache:{n:`Rache Bartmoss`,r:`Légende du Net`,c:`#05ffa1`,st:`hood`,sk:12},
  alt:{n:`Alt Cunningham`,r:`Présence dans le Net`,c:`#c77dff`,st:`long`,sk:8},
  reed:{n:`Songbird`,r:`Fantôme de la NUSA`,c:`#c77dff`,st:`long`,sk:30},
  hands:{n:`Mr. Hands`,r:`Fixer · Discret`,c:`#00f0ff`,st:`shades`,sk:22},
  chino:{n:`Tomás « Chino » Reyes`,r:`Valentinos · Soldado`,c:`#ffb000`,st:`short`,sk:26},
  nadia:{n:`Nadia Volkov`,r:`Ex-Maelstrom · Netrunneuse`,c:`#c77dff`,st:`mohawk`,sk:30},
  mika:{n:`Mika Tanabe`,r:`Doc de rue · Kabuki`,c:`#05ffa1`,st:`short`,sk:32},
  hiro:{n:`Hiro Sato`,r:`Ingénieur · Kang Tao`,c:`#ffd166`,st:`cap`,sk:30},
  eli:{n:`Eli Okoye`,r:`Agent NetWatch · Informateur`,c:`#05ffa1`,st:`shades`,sk:20},
});
const REL_NAMES = [`jackie`,`judy`,`panam`,`misty`,`rogue`,`kerry`,`vik`,`dex`,`lucy`,`mama`,`delamain`,`claire`,`chino`,`nadia`,`mika`,`hiro`,`eli`,`hands`,`wakako`,`regina`,`padre`,`muamar`,`faraday`,`nancy`,`river`,`dakota`,`dino`,`maine`,`david`,`rebecca`,`pilar`,`kiwi`,`dorio`,`falco`];

/* ============================ RELATIONS ============================ */
// Jackie
card({id:`jk_job`,who:`jackie`,tag:`Jackie · Un petit coup`,w:6,cond:()=>rel(`jackie`)>=10&&yr()<=2076,
  tx:`Jackie te rejoint, sourire jusqu'aux oreilles : « Choom ! J'ai un petit coup qui sent bon. Un dépôt de pièces détachées à Rancho Coronado. Deux gardes, une caméra. Ça te dit de le faire à deux ? Mama dit que je dois "grandir", alors je grandis. »`,
  ch:[
    {t:`Y aller ensemble`,s:`RÉFLEXES`,chk:{a:`ref`,k:`cmb`,dc:7,ok:{ed:1600,cred:5,rel:{jackie:8},msg:`Jackie rit à chaque cloison enfoncée. Vous partagez les gains autour d'un verre au Coyote Cojo.`},ko:{hp:-20,ed:200,rel:{jackie:4},msg:`Plus de gardes que prévu. Jackie te couvre en jurant en espagnol. Vous vous en tirez, cabossés.`}}},
    {t:`Lui conseiller d'attendre un vrai plan`,s:`SANG-FROID`,fx:{rel:{jackie:5},cred:1,msg:`« T'as raison, choom. Je tiens à la tête de mes tripes. » Il hausse les épaules, mais il écoute.`}},
    {t:`Refuser`,fx:{rel:{jackie:-3}}}
  ]});
card({id:`jk_ofrenda`,who:`jackie`,tag:`Heywood · Ofrenda`,w:5,cond:()=>rel(`jackie`)>=15&&yr()<=2076,
  tx:`Jackie t'entraîne dans une petite église de Wellsprings. Il allume une bougie devant une photo. « Mon vieux. Il aurait voulu qu'on devienne quelqu'un. Un jour, je serai une légende de Night City, tu verras. Pas pour l'argent. Pour qu'on se souvienne de moi. »`,
  ch:[
    {t:`Allumer une bougie avec lui`,s:`+Humanité`,fx:{hum:10,rel:{jackie:8,mama:4},msg:`Un silence plein de choses. Vous ressortez sur la place, l'air plus léger.`}},
    {t:`Lui dire que la légende, c'est surtout de la survie`,s:`SANG-FROID`,fx:{rel:{jackie:3},hum:3,msg:`« Peut-être, » dit-il. « Mais je préfère croire à l'autre version. »`}}
  ]});
card({id:`jk_konpeki`,who:`mama`,tag:`2077 · El Coyote Cojo`,story:true,at:[2077,5],cond:()=>rel(`jackie`)>=5||G.flags.jackie,
  tx:`Le Coyote Cojo est plein de bougies. Mama Welles est assise, immobile, face à une photo de son fils. <em>Jackie est mort</em>. Un coup à la Konpeki Plaza qui a mal tourné. Des Valentinos murmurent. Mama lève les yeux vers toi : « Tu étais son ami. Reste un peu avec moi, mijo. »`,
  ch:[
    {t:`Rester avec elle toute la nuit`,s:`+Humanité · Lien`,fx:{hum:12,rel:{mama:25,jackie:5},cred:2,msg:`Tu lui tiens la main jusqu'à l'aube. Quand elle se lève, elle te serre dans ses bras comme un fils.`}},
    {t:`Payer pour l'ofrenda`,s:`−800 €$`,req:R.ed(800),fx:{ed:-800,hum:6,rel:{mama:15},fac:{valentinos:8},msg:`Une grande ofrenda dans la rue, des fleurs, des bougies. Tous les Valentinos du quartier viennent.`}},
    {t:`Partir, tu n'as pas la force`,s:`−Humanité`,fx:{hum:-5,rel:{mama:-10},msg:`Tu fuis le deuil. Il te rattrapera.`}}
  ]});
// Judy
card({id:`jd_bd`,who:`judy`,tag:`Judy · Braindance`,w:5,cond:()=>(G.flags.judy||rel(`judy`)>=5)&&rel(`judy`)<60,
  tx:`Judy te montre un montage de BD sur un grand écran : des textures de vie, des gestes simples. « Je veux faire des BD qui soignent, pas qui abîment. Mais il me faut un second regard pour trier ça. Tu veux bien m'aider ? »`,
  ch:[
    {t:`L'aider à monter la BD`,s:`INTELLECT`,chk:{a:`int`,dc:6,ok:{hum:8,cred:3,rel:{judy:12},msg:`Vous passez la nuit à trier des souvenirs. Judy te remercie d'un sourire timide.`},ko:{hum:3,rel:{judy:5},msg:`Tu fais de ton mieux. Elle recommence seule, mais apprécie.`}}},
    {t:`Lui apporter à manger`,s:`−60 €$`,fx:{ed:-60,hum:5,rel:{judy:6},msg:`« Merci. J'avais oublié de manger. » Elle rit, gênée.`}},
    {t:`Décliner`,fx:{rel:{judy:-3}}}
  ]});
card({id:`jd_protect`,who:`judy`,tag:`Les Mox en danger`,w:5,cond:()=>rel(`judy`)>=20,
  tx:`Judy t'appelle, la voix serrée : un lieutenant Tyger Claws harcèle une des filles du Lizzie's Bar. « Je ne veux pas que ça dégénère. Mais je ne veux pas qu'on le laisse passer non plus. »`,
  ch:[
    {t:`Lui parler face à face`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{cred:5,hum:5,rel:{judy:12},fac:{mox:8,tygers:-5},msg:`Tu fais comprendre au lieutenant que les Mox ne sont pas seules. Il détale.`},ko:{hp:-18,rel:{judy:4},fac:{tygers:-8},msg:`Les Tyger Claws te rouent de coups. Judy te recoud avec ses propres mains.`}}},
    {t:`Le suivre et le piéger`,s:`INTELLECT`,chk:{a:`int`,dc:8,ok:{cred:6,rel:{judy:10},fac:{tygers:-6},msg:`Un dossier, un faux ordre, une disparition. Les Mox respirent.`},ko:{hp:-12,msg:`Il te repère. Tu t'enfuis in extremis.`}}}
  ]});
card({id:`jd_love`,who:`judy`,tag:`Judy · Un soir`,once:true,w:6,cond:()=>rel(`judy`)>=45&&G.hum>=50,
  tx:`Sur le toit du Lizzie's Bar, au-dessus de Kabuki, Judy te tend une bière. Les néons dessinent des vagues sur son visage. « On se connaît depuis longtemps. Je n'ai jamais osé le dire, mais… tu comptes pour moi. »`,
  ch:[
    {t:`Lui dire que c'est réciproque`,s:`Amour · +Humanité`,fx:{hum:18,rel:{judy:30},flag:[`lover_judy`],msg:`Un baiser sous la pluie acide. Night City n'existe plus pendant quelques minutes.`}},
    {t:`Rester amis`,s:`Statu quo`,fx:{hum:5,rel:{judy:5},msg:`« D'accord. Je serai là quand même. »`}}
  ]});
// Panam
card({id:`pn_ride`,who:`panam`,tag:`Panam · Convoi`,w:5,cond:()=>rel(`panam`)>=5||G.fac.aldecaldos>=10,
  tx:`Panam t'attrape par le col : « Un Thorton est en panne dans le Heywood Wash. Un convoi en retard. Saul compte sur moi, et moi sur quelqu'un qui sait conduire ou réparer. Tu en es ? »`,
  ch:[
    {t:`Réparer le moteur`,s:`TECHNIQUE`,chk:{a:`tech`,dc:7,ok:{ed:900,cred:4,rel:{panam:12},fac:{aldecaldos:8},msg:`Un cache-culasse, un joint, une prière. Le Thorton repart en ronronnant.`},ko:{ed:100,rel:{panam:4},msg:`Tu fais ce que tu peux. Panam te sourit, fatiguée.`}}},
    {t:`Piloter le convoi`,s:`RÉFLEXES`,chk:{a:`ref`,k:`drv`,dc:8,ok:{ed:1200,cred:5,rel:{panam:12},fac:{aldecaldos:8},msg:`Tu fonces dans la poussière sans rien casser. Panam hurle de joie.`},ko:{hp:-18,rel:{panam:4},msg:`Un dérapage. Personne n'est blessé, sauf ton ego.`}}}
  ]});
card({id:`pn_trust`,who:`panam`,tag:`Panam · Nuit au camp`,once:true,w:5,cond:()=>rel(`panam`)>=30,
  tx:`Au camp des Aldecaldos, la nuit tombe sur le désert. Panam s'assoit à côté de toi autour du feu : « Les nomades n'ont personne. Mais on a un code : on protège les siens. Tu es des nôtres, si tu veux. »`,
  ch:[
    {t:`Rejoindre le cercle du feu`,s:`+Humanité · Lien`,fx:{hum:14,rel:{panam:20,}, fac:{aldecaldos:20},flag:[`aldecaldo_friend`],msg:`Saul te serre la main, Panam te lance un regard complice. Ici, personne ne te jugera.`}},
    {t:`Garder tes distances`,fx:{rel:{panam:-4}}}
  ]});
// Misty / Vik / Rogue / Kerry / Dex / Claire / Delamain
card({id:`ms_deep`,who:`misty`,tag:`Misty · Une vraie lecture`,w:5,cond:()=>rel(`misty`)>=10,
  tx:`Misty ferme la boutique et allume une bougie. « Cette fois, c'est une vraie lecture. Je te vois changer, tu sais. Le chrome te fait des promesses que la chair ne peut pas tenir. » Elle étale trois cartes : la Tour, l'Étoile, la Mort.`,
  ch:[
    {t:`Écouter ses conseils`,s:`+Humanité · +Lien`,fx:{hum:16,rel:{misty:10},msg:`Elle te parle de ce qu'elle a vu de Vik, de Jackie, de tous ceux qui ont croisé son chemin. Tu repars plus calme.`}},
    {t:`Lui demander de veiller sur toi`,s:`+Lien fort`,fx:{hum:8,rel:{misty:15},flag:[`misty_guard`],msg:`« Je ne promets rien. Mais je regarderai. » Et ça, c'est déjà beaucoup.`}}
  ]});
card({id:`vk_clinic`,who:`vik`,tag:`Vik · Un service`,w:5,cond:()=>rel(`vik`)>=8,
  tx:`Vik te fait signe dans l'arrière-boutique. « J'ai trois patients et une pénurie de matériel. Tu pourrais en trouver ? Je te rends la pareille. »`,
  ch:[
    {t:`Voler du matériel chez Trauma Team`,s:`RÉFLEXES`,chk:{a:`ref`,k:`stl`,dc:7,ok:{cred:4,hum:6,rel:{vik:14},msg:`Une caisse de matériel flambant neuf. Vik hoche la tête : « Tu as sauvé des vies. »`},ko:{hp:-16,rel:{vik:5},msg:`Tu rentres les mains vides, mais avec un grand regret.`}}},
    {t:`Acheter ce qu'il faut`,s:`−500 €$`,req:R.ed(500),fx:{ed:-500,hum:4,rel:{vik:10},msg:`Vik te serre la main. « C'est pas rien. »`}},
    {t:`Refuser`,fx:{rel:{vik:-4}}}
  ]});
card({id:`vk_free`,who:`vik`,tag:`Vik · Contrôle gratuit`,w:4,cond:()=>rel(`vik`)>=30&&G.hum<80,
  tx:`Vik t'attrape par l'épaule en te voyant entrer : « Tu as une sale tête. Assieds-toi. C'est pour moi. Je ne veux pas que tu finisses comme eux. »`,
  ch:[
    {t:`Le laisser t'examiner`,s:`+Humanité · +Santé`,fx:{hum:20,hp:30,rel:{vik:5},msg:`Il règle quelques paramètres, te donne des conseils. « Reviens avant que ce soit trop tard. »`}},
    {t:`Refuser, tu t'en sors`,fx:{rel:{vik:-3}}}
  ]});
card({id:`rg_trust`,who:`rogue`,tag:`Rogue · Un service`,w:5,cond:()=>rel(`rogue`)>=10||G.cred>=35,
  tx:`Rogue t'appelle dans son bureau, au-dessus de la salle de l'Afterlife. « On m'a parlé de toi. Un type m'a lâché, un client reste introuvable. Je veux quelqu'un de sûr. Tu es de ceux-là ? »`,
  ch:[
    {t:`Accepter la mission`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{ed:3000,cred:8,rel:{rogue:14},msg:`Tu règles l'affaire proprement. Rogue te sert un verre : « Pas mal du tout. »`},ko:{hp:-20,ed:300,rel:{rogue:4},msg:`Ça tourne mal, mais tu ne te défiles pas. Rogue le note.`}}},
    {t:`Lui demander des nouvelles de Johnny`,s:`Étrange`,fx:{rel:{rogue:6},hum:2,msg:`Son visage se ferme, puis se radoucit. « Un jour, peut-être. Pas ce soir. »`}}
  ]});
card({id:`rg_partner`,who:`rogue`,tag:`Rogue · Une offre`,once:true,w:6,cond:()=>rel(`rogue`)>=40&&G.cred>=55,
  tx:`« L'Afterlife a besoin de sang neuf. Pas un serveur, un partenaire. Quelqu'un qui connaît les gens, les contrats, les règles. Je te propose de reprendre une partie de mes affaires. »`,
  ch:[
    {t:`Devenir partenaire de l'Afterlife`,s:`Fixer légendaire`,fx:{flag:[`afterlife`,`fixer`],cred:8,ed:3000,rel:{rogue:20},role:{fixer:5},msg:`Ton nom est maintenant sur la liste de l'Afterlife. Les mercenaires te saluent à l'entrée.`}},
    {t:`Décliner, tu préfères ta liberté`,fx:{rel:{rogue:2},cred:2}}
  ]});
card({id:`kr_tour`,who:`kerry`,tag:`Kerry · En tournée`,w:5,cond:()=>rel(`kerry`)>=8||G.flags.kerry,
  tx:`Kerry Eurodyne te propose de rejoindre sa tournée en tant qu'équipe de sécurité et de roadie. « Tu as l'œil, l'oreille et des biceps. Le public est chauffé à blanc, et mon dernier album a des fans… trop collants. »`,
  ch:[
    {t:`Assurer la sécurité du concert`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:7,ok:{ed:2000,cred:6,rel:{kerry:14},role:{rocker:1},msg:`Aucun problème. Kerry te dédie une chanson sur scène.`},ko:{hp:-20,ed:300,rel:{kerry:4},msg:`Un fan armé. Tu t'en sors de justesse.`}}},
    {t:`Écrire des textes avec lui`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{cred:6,hum:8,rel:{kerry:14},role:{rocker:2},msg:`Quelques vers s'imposent. Kerry sourit : « C'est ça, la vérité. »`},ko:{hum:2,rel:{kerry:4},msg:`Rien de bon. Mais l'amitié reste.`}}}
  ]});
card({id:`dx_big`,who:`dex`,tag:`Dex · Gros contrat`,w:5,cond:()=>rel(`dex`)>=10||G.flags.dex&&G.cred>=25,
  tx:`Dex te prend à l'écart : « Un contrat qui peut changer ta vie. Une corpo veut une mallette sans bruit. Je n'ai pas confiance en grand monde. En toi, oui. »`,
  ch:[
    {t:`Livrer la mallette`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{ed:4500,cred:8,rel:{dex:14},msg:`Livraison parfaite. Dex plisse les yeux, satisfait.`},ko:{hp:-25,ed:300,rel:{dex:4},msg:`Un truc s'est mal passé. La mallette est perdue, mais pas toi.`}}},
    {t:`Ouvrir la mallette`,s:`Risque`,chk:{a:`int`,dc:7,ok:{ed:6000,cred:5,rel:{dex:-10},msg:`Des puces de données. Tu les revends. Dex le sait et ne dit rien.`},ko:{hp:-30,rel:{dex:-12},msg:`Piégée. Un nuage d'agent neurotoxique te met à genoux.`}}}
  ]});
card({id:`cl_race`,who:`claire`,tag:`Claire · Garage`,w:4,cond:()=>skill(`drv`)>=1||A(`ref`)>=6,
  tx:`Claire Russell te montre une carcasse : « Je la retape depuis des mois. Il me manque quelqu'un de bien pour la tester sur la piste des Badlands. »`,
  ch:[
    {t:`Tester le bolide`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:8,ok:{ed:1500,cred:5,rel:{claire:14},msg:`Un chrono qui fait pâlir tous les habitués. Claire t'offre un tuning gratuit.`},ko:{hp:-18,rel:{claire:4},msg:`Tu perds le contrôle. La voiture survit, toi à peine.`}}},
    {t:`L'aider à la finaliser`,s:`TECHNIQUE`,chk:{a:`tech`,dc:7,ok:{cred:4,rel:{claire:12},role:{tech:1},msg:`Une nuit sur le moteur. Claire te sourit à l'aube.`},ko:{rel:{claire:3},msg:`Tu fais des erreurs, mais elle apprend à te connaître.`}}}
  ]});
card({id:`dl_fracture`,who:`delamain`,tag:`2077 · Delamain`,story:true,at:[2077,8],cond:()=>G.flags.delamain,
  tx:`Les taxis Delamain tournent fou. Les voitures refusent de s'arrêter, certaines roulent en boucle. La voix de l'IA se fragmente : « Je… je suis… plusieurs… Aidez-moi. » Tu sens que l'ami qui t'a conduit un soir est en détresse.`,
  ch:[
    {t:`Tenter de le "réparer" par hack`,s:`Cyberdeck · INT`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:9,ok:{cred:8,hum:6,rel:{delamain:20},role:{net:2},msg:`Tu recomposes ses fragments un à un. Il te remercie d'une voix tremblante.`},ko:{hp:-18,rel:{delamain:5},msg:`Trop de fragments, trop d'erreurs. Mais il a senti ton effort.`}}},
    {t:`Rester à ses côtés`,s:`+Humanité`,fx:{hum:8,rel:{delamain:10},msg:`Tu lui parles, simplement. Il se calme un peu.`}},
    {t:`S'éloigner`,fx:{rel:{delamain:-6}}}
  ]});
card({id:`lc_moon`,who:`lucy`,tag:`2076 · Lucy`,w:6,cond:()=>G.flags.maine&&yr()>=2076&&!G.done.lc_moon_done,
  tx:`Après la chute de la crew de Maine, tu retrouves Lucy sur un toit de Kabuki. Le regard rivé sur la Lune. « Ils disent que si on a assez de fric, on peut y aller. Que là-haut, personne ne nous cherche. Je voudrais y croire. »`,
  ch:[
    {t:`Lui promettre d'aider`,s:`+Humanité`,fx:{hum:10,rel:{lucy:20},flag:[`lucy_moon`],msg:`Elle te regarde, étonnée. « Personne ne m'a dit ça depuis longtemps. »`}},
    {t:`Lui dire que la Lune n'est qu'un rêve`,fx:{hum:-3,rel:{lucy:-8}}}
  ]});

/* ============================ ARCS DE FACTION ============================ */
const ARCS = {
  valentinos:[`capitan`,`Gustavo Orta a un problème : un Maelstrom a profané une église de Wellsprings. Le barrio veut du sang, mais Padre réclame de l'honneur.`,`Venger l'église`,`Prendre la tête d'une procession de nuit`],
  maelstrom:[`dum`,`Dum Dum veut te voir : « Un Royce plus fort, c'est un Maelstrom plus fort. Je te donne une dose de chrome gratuit si tu me jures fidélité. »`,`Accepter le chrome`,`Résister à la tentation`],
  tygers:[`claws`,`Un shinobi de Japantown te propose une initiation : réciter le code des Tyger Claws et subir un tatouage au laser.`,`Subir l'initiation`,`Faire croire que tu es loyal(e)`],
  sixth:[`sixth`,`Un vétéran 6th Street te raconte la guerre de Unification. « On n'est pas des gangsters, on est des patriotes. Prouve-le en nettoyant le quartier. »`,`Nettoyer Arroyo`,`Négocier avec les gangs`],
  voodoo:[`placide`,`Placide te convoque pour Maman Brigitte : « Le Blackwall bouge. On a besoin de vigilance. Tu veux voir ce qu'il y a derrière ? »`,`Plonger avec eux`,`Veiller sur le périmètre`],
  animals:[`sas`,`Sasquatch te convoque au dojo : « Tu as de la force. Pas encore de cœur. Montre-moi les deux. »`,`Défier un champion`,`Protéger un enfant du quartier`],
  mox:[`lizzie`,`Susie Q te demande de monter sur scène pour un hommage aux disparues du Mox. « Tu portes nos couleurs. Parle pour nous. »`,`Parler sur scène`,`Proposer une action de rue`],
  aldecaldos:[`saul`,`Saul te parle de la route : « Les Badlands changent. NUSA et Militech rôdent. J'ai besoin de quelqu'un pour tenir le flanc est. »`,`Tenir le flanc est`,`Négocier avec NUSA`],
  wraiths:[`nomad`,`Un chef Wraith veut un convoi de guerre : « Pas de pitié, pas de témoin. Tu es dedans ? »`,`Mener le convoi`,`Ralentir pour sauver des civils`],
  barghest:[`hansen`,`Hansen te confie le contrôle d'une porte de Dogtown. « La discipline, c'est la survie. »`,`Tenir la porte`,`Autoriser des civils à passer`],
  ncpd:[`ncpd`,`Un capitaine NCPD te propose une promotion : « Si tu fermes les yeux sur un petit trafic de cyberware, tu auras ton insigne de détective. »`,`Fermer les yeux`,`Refuser et enquêter`],
  arasaka:[`takemura`,`Takemura te convoque : « Arasaka exige la perfection. Un cadre a failli. Tu dois le remplacer. »`,`Prendre sa place`,`Défendre le cadre`],
  militech:[`meredith`,`Meredith Stout te propose une affaire : « Un hacker Arasaka a volé un prototype. Va le chercher. »`,`Traquer le hacker`,`Marchander avec lui`],
  kangtao:[`corpo`,`Kang Tao veut tester une IA de visée sur un champ de tir. Tu seras la cible… ou le contrôleur.`,`Piloter le test`,`Saboter le test`],
  biotechnica:[`corpo`,`Une récolte menace d'échouer à cause d'un virus. Biotechnica te confie une mission délicate dans les Badlands.`,`Négocier avec les nomades`,`Détruire les champs infectés`],
  trauma:[`doc`,`Une équipe Trauma Team est coincée dans une zone Maelstrom. À toi de la sortir.`,`Les sortir en force`,`Les extraire discrètement`],
};
Object.keys(ARCS).forEach(id=>{
  const [who,txt,a,b]=ARCS[id], f=FAC[id];
  card({id:`farc_${id}`,who,tag:`Arc · ${f.n}`,once:true,w:30,cond:()=>G.member===id&&G.rank>=1,
    tx:txt,
    ch:[
      {t:a,s:`Rang +`,chk:{a:`ref`,k:`cmb`,dc:8,ok:{ed:2500,cred:8,fac:{[id]:14},fn:`facJobWin`,msg:`Tu relèves le défi avec brio. ${f.n} s'en souviendra longtemps.`},ko:{hp:-30,fac:{[id]:-4},msg:`Un échec cuisant, mais tu en réchappes.`}}},
      {t:b,s:`COOL`,chk:{a:`cool`,dc:8,ok:{ed:1800,cred:7,hum:5,fac:{[id]:10},msg:`Une autre voie, plus fine, plus sage. Les anciens hochent la tête.`},ko:{ed:200,fac:{[id]:-4},msg:`On te reproche ta mollesse.`}}}
    ]});
});
card({id:`fac_coup`,who:`fix`,tag:`Prendre la tête`,once:true,w:20,cond:()=>{const p=promoInfo();return G.member&&!isLeader()&&G.rank>=3&&p&&p.ready},
  tx:()=>`Tu es le bras droit de ${FAC[G.member].n}. Le chef vieillit, les rivaux se multiplient. Dans les couloirs, on murmure ton nom. Si tu veux la première place, c'est maintenant. Sinon, tu resteras dans l'ombre.`,
  ch:[
    {t:`Prendre le pouvoir par la force`,s:`CORPS · combat`,heavy:`Tu renverses ton chef. Si tu échoues, tu le paieras cher ; si tu réussis, tu porteras la couronne — et ses ennemis.`,chk:{a:`body`,k:`cmb`,dc:10,ok:{cred:12,ed:3000,role:{boss:3},fn:`seizeFaction`,msg:`Un duel, un coup décisif. Le chef s'incline. Tu es désormais à la tête de ${`la famille`}.`},ko:{hp:-50,cred:-3,fac:{},msg:`Ta tentative échoue. Tu survis, mais ta position est fragilisée.`}}},
    {t:`Le convaincre de te céder sa place`,s:`SANG-FROID`,heavy:`Tu réclames la place du chef. Un refus brisera la confiance.`,chk:{a:`cool`,dc:9,ok:{cred:10,ed:2000,role:{boss:3},fn:`seizeFaction`,msg:`Sans sang versé, tu deviens leader. Les loyautés se rallient.`},ko:{cred:-2,hum:-2,msg:`Il se méfie. Tu devras patienter.`}}},
    {t:`Rester loyal au chef`,s:`Sécurité`,fx:{hum:5,cred:2,fac:{},fn:`facLoyal`,msg:`Tu prouves ta loyauté. Le chef te remercie et te garde à ses côtés.`}}
  ]});

/* ============================ ORIGINES ============================ */
// Street Kid
const st = ()=>G.origin===`street`;
card({id:`sk_gang`,who:`fix`,tag:`Rue · Initiation`,w:6,cond:()=>st()&&yr()<=2073,
  tx:`Un jeune du quartier te défie : « Si tu veux qu'on te respecte ici, il faut passer le test. Voler dans la voiture d'un Tyger Claw. Seul(e). »`,
  ch:[
    {t:`Relever le défi`,s:`RÉFLEXES`,chk:{a:`ref`,dc:7,ok:{cred:6,ed:300,msg:`Tu sors du véhicule avec un sac et un sourire. Tout le quartier en parle.`},ko:{hp:-20,cred:-1,msg:`Le Tyger te surprend. Une volée de coups plus tard, tu comprends le prix de la gloire.`}}},
    {t:`Refuser`,fx:{hum:3}}
  ]});
card({id:`sk_school`,who:`narr`,tag:`Rue · Cours du soir`,w:4,cond:()=>st()&&yr()<=2074,
  tx:`Un vieux prof de Heywood donne des cours gratuits à la tombée de la nuit. Il croit encore qu'on peut s'en sortir par le savoir.`,
  ch:[
    {t:`Suivre les cours`,s:`+INT/TECH`,fx:{at:{int:1},hum:5,ed:-40,msg:`Il t'apprend à décoder un script, à lire un contrat. Ce n'est pas rien.`}},
    {t:`Rester dans la rue`,fx:{cred:2}}
  ]});
card({id:`sk_dealer`,who:`fix`,tag:`Rue · Petit trafic`,w:4,cond:()=>st(),
  tx:`Un dealer de Kabuki te propose de revendre des stimulants de rue. « Aucun risque, juste de la patience. »`,
  ch:[
    {t:`Vendre un peu`,s:`−Humanité`,fx:{ed:900,hum:-5,cred:2,msg:`Les clients sont fidèles. Tu t'en veux un peu.`}},
    {t:`Dénoncer le trafic à Misty`,s:`+Lien`,fx:{rel:{misty:6},hum:3,cred:1,msg:`Misty te prévient discrètement qui surveiller.`}},
    {t:`Refuser`,fx:{hum:2}}
  ]});
card({id:`sk_tag`,who:`narr`,tag:`Rue · Guerre de territoires`,w:4,cond:()=>st(),
  tx:`Des graffitis couvrent ton bloc : tags de Maelstrom, de Tyger Claws, de Valentinos. Quelqu'un te tend une bombe de peinture : « À toi de choisir ton camp. »`,
  ch:[
    {t:`Peindre le blason Valentino`,fx:{fac:{valentinos:8,maelstrom:-8},cred:2}},
    {t:`Peindre un symbole neutre`,fx:{hum:3,cred:1}},
    {t:`Tout effacer`,fx:{fac:{valentinos:-3,maelstrom:-3,tygers:-3},hum:5,cred:2}}
  ]});
// Corpo
const co = ()=>G.origin===`corpo`;
card({id:`cp_gala`,who:`corpo`,tag:`Corpo · Gala`,w:5,cond:()=>co(),
  tx:`Un gala à Corpo Plaza : champagne, costumes sur mesure, requins en cravate. Un directeur te glisse : « Fais-toi voir, sinon tu resteras un numéro. »`,
  ch:[
    {t:`Charmer les dirigeants`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{ed:1800,cred:3,role:{corpo:2},msg:`Tu repars avec trois cartes de visite et une proposition de poste.`},ko:{cred:-2,ed:-300,msg:`Tu renverses un verre sur un VIP. Les murmures te suivent.`}}},
    {t:`Passer inaperçu(e), observer`,s:`INTELLECT`,chk:{a:`int`,dc:6,ok:{ed:600,at:{int:1},msg:`Tu repères un cadre qui détourne des fonds. Une info précieuse.`},ko:{msg:`Rien de remarquable, mais pas de mal.`}}}
  ]});
card({id:`cp_politics`,who:`corpo`,tag:`Corpo · Politique`,w:5,cond:()=>co()&&G.flags.corpjob,
  tx:`Deux directeurs se disputent ton soutien : l'un est brillant mais cruel, l'autre loyal mais incompétent. Tu peux faire pencher la balance.`,
  ch:[
    {t:`Soutenir le brillant`,s:`Carrière`,fx:{ed:1600,cred:2,hum:-5,msg:`Il monte, et tu l'accompagnes. Tout a un prix.`}},
    {t:`Soutenir le loyal`,s:`+Humanité`,fx:{ed:600,hum:8,cred:1,msg:`Il ne monte pas, mais te le rendra un jour.`}},
    {t:`Jouer les deux`,s:`COOL`,chk:{a:`cool`,dc:8,ok:{ed:2400,cred:3,msg:`Tu restes l'ami de tout le monde. Personne ne sait ce que tu veux vraiment.`},ko:{ed:-300,cred:-2,msg:`Les deux te prennent pour un traître.`}}}
  ]});
card({id:`cp_trial`,who:`corpo`,tag:`Corpo · Procès`,w:4,cond:()=>co()&&G.flags.corpjob&&yr()>=2073,
  tx:`Une enquête interne vise ton équipe. On soupçonne une fuite. Tu sais qui est coupable : ton meilleur ami au bureau.`,
  ch:[
    {t:`Le dénoncer`,s:`−Humanité`,fx:{ed:1800,hum:-10,cred:-2,msg:`Promu(e). Ton ami disparaît. Le silence te pèse.`}},
    {t:`Le couvrir`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{hum:8,cred:2,msg:`Tu détournes l'enquête. Il pleure de gratitude.`},ko:{ed:-1000,cred:-3,unflag:[`corpjob`],msg:`On te vire. Vous partez ensemble.`}}}
  ]});
// Nomade
const no = ()=>G.origin===`nomad`;
card({id:`nm_storm`,who:`nomad`,tag:`Nomade · Tempête de sable`,w:5,cond:()=>no(),
  tx:`Une tempête rouge engloutit ton convoi dans les Badlands. Les moteurs toussent, les visiteurs paniquent. Quelqu'un crie : « Qui conduit ? »`,
  ch:[
    {t:`Guider le convoi à l'instinct`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:7,ok:{cred:5,hum:3,role:{nomad:2},msg:`Tu sens la route sous tes roues. Le convoi sort indemne.`},ko:{hp:-20,msg:`Un camion se renverse. Vous perdez du matériel et une journée.`}}},
    {t:`S'abriter et attendre`,s:`SANG-FROID`,fx:{hum:4,ed:-100,msg:`Vous passez la nuit blottis dans les cabines. Le jour revient.`}}
  ]});
card({id:`nm_nusa`,who:`nomad`,tag:`Nomade · Frontière NUSA`,w:4,cond:()=>no(),
  tx:`Un poste-frontière NUSA vous arrête. Les gardes veulent fouiller le convoi. Dans la soute, des pièces illégales de Militech. Le chef du convoi te regarde, l'air grave.`,
  ch:[
    {t:`Corrompre le garde`,s:`−400 €$`,req:R.ed(400),fx:{ed:-400,cred:2,msg:`Un billet, un clin d'œil. Les portes s'ouvrent.`}},
    {t:`Distraire les gardes`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{cred:5,role:{nomad:1},msg:`Tu fais un numéro de comédie improvisé. Le convoi passe.`},ko:{hp:-16,ed:-300,msg:`Ça ne prend pas. Un garde te frappe.`}}}
  ]});
card({id:`nm_garage`,who:`claire`,tag:`Nomade · Mécano`,w:4,cond:()=>no(),
  tx:`Un vieux Thorton agonise sur le bord de la route. Le propriétaire te supplie : « Cinquante balles, et c'est à toi pour la nuit. Mais fais-le tenir. »`,
  ch:[
    {t:`Le réparer`,s:`TECHNIQUE`,chk:{a:`tech`,dc:6,ok:{ed:400,cred:3,at:{tech:1},msg:`Une heure plus tard, le moteur ronronne. Un mécano est né.`},ko:{ed:50,msg:`Pas assez de pièces. Mais il te remercie.`}}},
    {t:`Passer`,fx:{}}
  ]});

/* ============================ NETRUNNING ============================ */
card({id:`nr_ice`,who:`fix`,tag:`Netrunning · Contrat ICE`,w:6,cond:()=>hasDeck(),
  tx:`Un client veut une cargaison d'informations sur un concurrent. Le serveur est protégé par de la glace noire (ICE) de grade militaire. Si tu échoues, ton cerveau grille.`,
  ch:[
    {t:`Plonger prudemment`,s:`INT · Hack`,chk:{a:`int`,k:`hck`,dc:9,ok:{ed:3200,cred:8,role:{net:2},msg:`Tu contournes les couches une à une, comme un fantôme. Les données sont à toi.`},ko:{hp:-35,hum:-4,msg:`L'ICE te mord le cerveau. Tu te débranches à temps. Presque.`}}},
    {t:`Lancer un Overheat massif`,s:`Dangereux`,chk:{a:`int`,k:`hck`,dc:8,ok:{ed:2600,cred:6,hum:-2,msg:`Les serveurs fondent comme du beurre.`},ko:{hp:-40,msg:`Le contre-piratage te touche en plein sommeil. Tu t'écroules.`}}},
    {t:`Refuser, trop risqué`,fx:{}}
  ]});
card({id:`nr_daemon`,who:`rache`,tag:`Netrunning · Légende Bartmoss`,w:3,cond:()=>hasDeck()&&A(`int`)>=7,
  tx:`Une rumeur circule dans les sous-réseaux : une ombre de <em>Rache Bartmoss</em> guide encore certains netrunners. Un simple message sur ton canal : « Cherche le motif. Ne le laisse pas te chercher. »`,
  ch:[
    {t:`Suivre le fil d'Ariane`,s:`INT`,chk:{a:`int`,k:`hck`,dc:9,ok:{at:{int:1},cred:9,hum:-3,role:{net:2},msg:`Un code ancien, des lignes qui dansent. Tu apprends une technique oubliée.`},ko:{hp:-18,hum:-6,msg:`Le fil s'emmêle. Tu te réveilles la nuque en feu.`}}},
    {t:`Couper la connexion`,fx:{hum:3}}
  ]});
card({id:`nr_alt`,who:`alt`,tag:`Netrunning · Une voix`,w:2,once:true,cond:()=>hasDeck()&&A(`int`)>=8&&G.cred>=30,
  tx:`Dans un recoin du Net, derrière un mur sans fin, une voix de femme chante doucement. « Tu m'entends ? Ne t'approche pas du Mur. Ou si tu le fais, souviens-toi : ce qu'il y a derrière ne pense pas comme nous. »`,
  ch:[
    {t:`Lui demander qui elle est`,s:`Mystère`,fx:{hum:-3,cred:4,role:{net:2},msg:`Une ombre sourit. « Alt. Ça suffit. » La connexion se coupe.`}},
    {t:`Fuir la présence`,fx:{hum:2}}
  ]});
card({id:`nr_bd`,who:`judy`,tag:`Netrunning · BD piratée`,w:4,cond:()=>hasDeck(),
  tx:`Une BD volée circule dans les bas-fonds du Net : des souvenirs d'une victime qui n'a pas consenti. Judy te demande de la faire disparaître.`,
  ch:[
    {t:`Effacer la BD et traquer le pirate`,s:`INT · Hack`,chk:{a:`int`,k:`hck`,dc:8,ok:{cred:6,hum:8,rel:{judy:12},msg:`La BD disparaît du réseau. Le pirate se retrouve avec un virus bien senti.`},ko:{hp:-14,rel:{judy:4},msg:`Le pirate t'échappe, mais tu as ralenti la propagation.`}}},
    {t:`Revendre la BD`,s:`−Humanité`,fx:{ed:2200,hum:-12,rel:{judy:-15},msg:`Tu encaisses. Tu ne dors plus aussi bien.`}}
  ]});

/* ============================ HISTOIRE 2070-2092 ============================ */
const H = (id,who,tag,at,tx,ch,extra)=>card(Object.assign({id,who,tag,story:true,at,tx,ch},extra||{}));
H(`h_2071`,`narr`,`2071 · Chroming`,[2071,0],`Les cliniques de Little China annoncent des promos sur le chrome. Les cyberpsychos "Sighting" se multiplient aux infos. Night City bourdonne de rumeurs : la nouvelle génération de Sandevistan serait en cours de test.`,[
  {t:`Étudier le marché du chrome`,s:`INTELLECT`,fx:{at:{int:1},cred:1,msg:`Tu apprends quel chrome vaut la peine, lequel est un piège.`}},
  {t:`Ignorer la mode`,fx:{hum:3}}]);
H(`h_2072`,`narr`,`2072 · Guerres des gangs`,[2072,4],`Les Maelstrom prennent un entrepôt de Northside. Les Valentinos ripostent. Les rues de Watson sentent la poudre. Tout le monde se demande qui tiendra le trottoir demain.`,[
  {t:`Se cacher quelques jours`,fx:{hum:3,ed:-100}},
  {t:`Offrir tes services aux gangs`,s:`Gain · risque`,chk:{a:`ref`,k:`cmb`,dc:8,ok:{ed:1800,cred:6,hum:-4,msg:`Tu te places entre deux camps et prends ta part.`},ko:{hp:-26,cred:1,msg:`Une balle perdue t'égratigne sévèrement.`}}}]);
H(`h_2074`,`narr`,`2074 · NetWatch`,[2074,3],`NetWatch renforce ses patrouilles sur le Net. Des netrunners disparaissent. Les Voodoo Boys parlent d'un "Mur" qui se renforce et d'IA rogues qui rôdent derrière.`,[
  {t:`Profiter pour vendre des cyberdecks`,s:`TECHNIQUE`,chk:{a:`tech`,dc:7,ok:{ed:1800,cred:3,msg:`Tu fais fortune sur la peur des autres.`},ko:{ed:-200,msg:`Un lot défectueux. Plus de peur que de mal.`}}},
  {t:`Se faire discret`,fx:{hum:2}}]);
H(`h_2075`,`narr`,`2075 · Braindance`,[2075,2],`Une BD "ultime" fait scandale : un tueur d'Edgerunners aurait enregistré ses meurtres. Judy et les Mox s'indignent. La police fait semblant d'enquêter.`,[
  {t:`Enquêter discrètement`,s:`INTELLECT`,chk:{a:`int`,dc:8,ok:{cred:6,hum:6,msg:`Tu dénoues le fil jusqu'à un producteur de Westbrook.`},ko:{hp:-12,msg:`Tu te fais repérer. Les menaces pleuvent.`}}},
  {t:`Laisser tomber`,fx:{hum:-2}}]);
H(`h_2078b`,`narr`,`2078 · Reconstruction`,[2078,6],`Night City se refait une santé : Militech finance des chantiers, la NUSA fait pression, et de nouveaux gangs se bousculent pour prendre le contrôle des quartiers libérés. Les grandes familles se déchirent.`,[
  {t:`Se placer entre deux camps`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{ed:3000,cred:6,msg:`Tu tisses des alliances fragiles mais payantes.`},ko:{hp:-20,msg:`On te prend pour un traître. Tu t'en tires de justesse.`}}},
  {t:`Se retirer des affaires`,fx:{hum:5,ed:-100}}]);
H(`h_2080`,`narr`,`2080 · Une nouvelle ère`,[2080,0],`Une décennie après tout, Night City est autre : plus propre en surface, plus sombre en dessous. Les anciens racontent les histoires d'Arasaka, de Johnny, de V comme des légendes. Les jeunes n'y croient qu'à moitié.`,[
  {t:`Raconter ta propre histoire`,fx:{cred:3,hum:4,msg:`Tu parles de ce que tu as vécu. Les yeux brillent.`}},
  {t:`Garder le silence`,fx:{hum:2}}]);
H(`h_2085`,`narr`,`2085 · Les vieux démons`,[2085,5],`Un cyberpsycho qui porte ton ancien chrome se fait descendre par MaxTac. Tu reconnais l'implant, le même que le tien. Un frisson, un doute, un avertissement.`,[
  {t:`Consulter un thérapeute`,s:`−500 €$ · +Humanité`,req:R.ed(500),fx:{ed:-500,hum:15,msg:`« Tu as eu de la chance. Ne la gaspille pas. »`}},
  {t:`Ravaler ton malaise`,fx:{hum:-4}}]);
// Missions post-2077 supplémentaires
card({id:`p_hansen`,who:`hansen`,tag:`Dogtown · Contrat`,w:5,cond:()=>G.flags.dogtown,
  tx:`Hansen te briefe : « Un colis de la NUSA est coincé dans les ruines. Deux gangs s'y intéressent. Tu rentres, tu sors, et on ne se parle plus. »`,
  ch:[
    {t:`Entrer discrètement`,s:`SANG-FROID · furtivité`,chk:{a:`cool`,k:`stl`,dc:9,ok:{ed:4500,cred:9,fac:{barghest:10},msg:`Tu ressors avec la mallette. Hansen hoche la tête.`},ko:{hp:-30,ed:300,msg:`Une patrouille te surprend. Tu fuis en perdant du matériel.`}}},
    {t:`Forcer le passage`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:9,ok:{ed:4500,cred:10,hum:-3,msg:`Un chemin de sang et de ferraille. Hansen n'aime pas le bruit, mais paie.`},ko:{hp:-45,msg:`Tu manques d'y rester.`}}}
  ]});
card({id:`p_songbird`,who:`reed`,tag:`2077 · Message chiffré`,w:3,once:true,cond:()=>G.flags.dogtown&&hasDeck(),
  tx:`Un message intercepté dans le Net de Dogtown : « Besoin d'un netrunner. Pas de questions. Pas de preuve. » Signé d'une voix douce qui se fait appeler Songbird.`,
  ch:[
    {t:`Répondre`,s:`Mystère`,chk:{a:`int`,k:`hck`,dc:9,ok:{ed:4000,cred:8,role:{net:2},msg:`Un rendez-vous dans un parking de Pacifica, des données dans une puce. Tu ne poses aucune question.`},ko:{hp:-22,hum:-4,msg:`C'était un piège. Tu t'en sors, mais plus méfiant(e).`}}},
    {t:`Ignorer`,fx:{hum:2}}
  ]});
card({id:`p_boss`,who:`narr`,tag:`Tes quartiers`,w:6,cond:()=>G.mine&&ownedList().length>=2,
  tx:()=>`Les affaires de ${G.mine.name} prospèrent. Mais chaque nouveau territoire est une cible. Tes lieutenants réclament plus de pouvoir, de chrome, de guerre.`,
  ch:[
    {t:`Investir dans l'armement`,s:`−1 500 €$ · Puissance`,req:R.ed(1500),fx:{ed:-1500,fn:`mineGrow`,cred:3,msg:`Tes soldats sont mieux équipés. Les rivaux murmurent.`}},
    {t:`Investir dans le quartier`,s:`−1 000 €$ · +Humanité`,req:R.ed(1000),fx:{ed:-1000,hum:10,cred:4,msg:`Des cliniques, des repas chauds. Le quartier t'adore.`}},
    {t:`Tout économiser`,fx:{ed:400}}
  ]});

/* ============================ FINS SPÉCIALES ============================ */
Object.assign(ENDS,{
  netghost:{t:`FANTÔME DU NET`,e:`Tu as franchi le Mur en rêve. Les netrunners disent qu'un nouveau signal murmure parfois dans le noir — ton nom.`,good:1,m:1.55},
  fixerking:{t:`ROI DE L'AFTERLIFE`,e:`Ton nom est gravé sur le comptoir, ton téléphone sonne toute la nuit. Night City ne dort pas, et toi non plus.`,good:1,m:1.5},
  empire:{t:`EMPEREUR DE LA RUE`,e:`Tes quartiers brillent. Tes ennemis se taisent. Tu règnes sur un empire de néons et de loyautés.`,good:1,m:1.55},
  rockstar:{t:`LÉGENDE DU ROCK`,e:`Ton dernier concert enflamme Night City. Les écrans diffusent ton visage, la foule hurle ton nom.`,good:1,m:1.5},
  saint:{t:`MEDTECH DE LA RUE`,e:`Tu as soigné des milliers de vies que personne ne comptait. Ta clinique est ouverte jour et nuit.`,good:1,m:1.45},
  legendrun:{t:`LÉGENDE ÉTERNELLE`,e:`Ton dernier run entre dans l'histoire. Il y a un verre à ton nom à l'Afterlife, et tous les Edgerunners le lèvent.`,good:1,m:1.5},
  vp:{t:`VICE-PRÉSIDENT`,e:`Tu as gravi la tour de verre. Chaque bureau t'obéit. Mais parfois, tu regardes les rues d'en bas et tu te demandes qui tu as laissé derrière.`,good:1,m:1.45},
  nomadchief:{t:`CHEF DE CLAN`,e:`Les Badlands n'ont plus de frontières pour toi. Ton convoi traverse le désert, bannière au vent.`,good:1,m:1.5},
  captain:{t:`CAPITAINE NCPD`,e:`Un uniforme propre, une conscience presque nette. Tu as fait de ta plaque un symbole.`,good:1,m:1.4},
  together:{t:`VIE À DEUX`,e:`Loin des néons, un petit appartement, une plante sur le rebord de la fenêtre. Tu as trouvé ce que Night City ne donne presque jamais : la paix.`,good:1,m:1.5},
  warlord:{t:`SEIGNEUR DE FACTION`,e:`Tu diriges ce que tu as rejoint. Les anciens baissent la tête, les jeunes te suivent. Une couronne de chrome et de sang.`,good:1,m:1.5},
});
const endCard=(id,who,tag,cond,tx,label,key,sub,w)=>card({id,who,tag,once:true,w:w||40,cond,tx,
  ch:[{t:label,s:sub||`Fin spéciale`,fx:{die:key}},{t:`Continuer encore un peu`,s:`Garder ton élan`,fx:{unonce:id,cred:1}}]});
endCard(`end_net`,`alt`,`Fin : le Mur`,()=>hasDeck()&&A(`int`)>=9&&G.role.net>=8&&G.cred>=50&&G.age>=28,
  `Tu connais le Net mieux que personne. Le Blackwall t'attire, comme un aimant. Une voix dit : « Viens. Tu es prêt. » Tu pourrais passer de l'autre côté en rêve et devenir une légende numérique.`,`Franchir le Blackwall`,`netghost`);
endCard(`end_fixer`,`rogue`,`Fin : l'Afterlife`,()=>G.flags.afterlife&&G.cred>=60&&G.ed>=15000,
  `Rogue te tend un verre et la clé du bureau du haut. « L'Afterlife est à toi, maintenant. Tu sais ce que ça veut dire. »`,`Reprendre l'Afterlife`,`fixerking`);
endCard(`end_boss`,`you`,`Fin : l'empire`,()=>G.mine&&ownedList().length>=5&&G.mine.power>=6&&G.cred>=55,
  ()=>`Cinq quartiers sous ta bannière, ${G.mine.name} sur toutes les lèvres. Les corpos négocient avec toi, les gangs te craignent. Tu peux t'arrêter ici, au sommet.`,`Régner sur Night City`,`empire`);
endCard(`end_rock`,`kerry`,`Fin : dernier concert`,()=>G.flags.rocker&&G.cred>=60&&rel(`kerry`)>=15,
  `Kerry t'invite à jouer au Dazzler pour une dernière nuit. Les billets sont partis en dix minutes. La foule vient pour toi.`,`Monter sur scène`,`rockstar`);
endCard(`end_med`,`vik`,`Fin : la clinique`,()=>G.flags.medtech&&G.hum>=65&&G.cred>=40&&G.age>=26,
  `Vik te propose de reprendre sa clinique : « Tu as ce qu'il faut, tu as ce qu'il ne faut pas : du cœur. »`,`Reprendre la clinique`,`saint`);
endCard(`end_edge`,`maine`,`Fin : un dernier run`,()=>G.flags.edge&&G.cred>=70,
  `Un contrat impossible. Une tour, des drones, une boucle de feu. Tu le sais : c'est ton dernier run. Mais tu le feras à ta manière.`,`Faire le dernier run`,`legendrun`,`Fin glorieuse`);
endCard(`end_vp`,`corpo`,`Fin : le dernier étage`,()=>co()&&G.member&&FAC[G.member].k===`corp`&&G.rank>=3,
  `Le PDG t'invite dans son bureau : « Vous avez prouvé votre valeur. Je vous offre la vice-présidence. »`,`Devenir vice-président(e)`,`vp`);
endCard(`end_nomad`,`saul`,`Fin : chef de clan`,()=>(G.member===`aldecaldos`||G.member===`wraiths`)&&G.rank>=3&&G.cred>=45,
  `Saul te regarde : « Je ne suis plus tout jeune. Quelqu'un doit prendre le volant. Pourquoi pas toi ? »`,`Prendre le volant du clan`,`nomadchief`);
endCard(`end_cop`,`ncpd`,`Fin : capitaine`,()=>G.member===`ncpd`&&G.rank>=3&&G.role.cop>=4,
  `La commissaire t'annonce que le poste de capitaine est à toi. « La rue a besoin de quelqu'un comme toi. »`,`Devenir capitaine`,`captain`);
endCard(`end_love`,`lover`,`Fin : une vie ailleurs`,()=>(G.flags.partner||G.flags.lover_judy||G.flags.aldecaldo_friend)&&G.hum>=60&&G.age>=28&&G.ed>=3000,
  `Tu regardes la personne à tes côtés. Un voyage vers le sud, une maison, un jardin. Peut-être qu'on peut aussi mériter la paix.`,`Tout quitter, ensemble`,`together`,`Fin paisible`,35);
endCard(`end_war`,`you`,`Fin : le trône`,()=>Object.keys(G.flags).some(f=>f.startsWith(`leader_`))&&G.cred>=55,
  `Tu diriges ta famille d'une main de fer. Tes lieutenants te suivent. Tu pourrais continuer ou entrer dans l'histoire.`,`Entrer dans l'histoire`,`warlord`);

/* ============================ ÉQUILIBRE DES BLOCS ============================ */
const BEND = {
  rue:{lo:[`TRAQUÉ PAR LA RUE`,`Les gangs se sont unis contre toi. Une nuit, au coin d'une ruelle, plus personne ne t'a défendu.`],hi:[`MARIONNETTE DE LA RUE`,`Tu ne décides plus rien : les gangs t'utilisent comme étendard, puis te jettent quand tu deviens inutile.`]},
  corpo:{lo:[`BLACKLISTÉ PAR LES CORPOS`,`Les corporations t'ont rayé de la carte. Un contrat, un sniper, et ton nom a disparu des bases de données.`],hi:[`CHIEN DE GARDE CORPO`,`Tu portes la laisse des corpos depuis si longtemps que tu as oublié le goût de la liberté.`]},
  loi:{lo:[`GIBIER DE LA NCPD`,`NCPD et MaxTac te traquent sans relâche. Cette fois, il n'y a pas eu de sommation.`],hi:[`INDIC DE LA NCPD`,`Trop proche de la police, tu es devenu(e) un indic. La rue n'a pas oublié.`]},
  nomad:{lo:[`BANNI DES BADLANDS`,`Tous les clans te ferment la route. Sans eux, le désert est une tombe.`],hi:[`PRISONNIER DES CLANS`,`Les clans t'ont adopté… puis enchaîné. Tu roules pour eux, jusqu'à ce que le moteur lâche.`]},
};
Object.keys(BEND).forEach(b=>['lo','hi'].forEach(side=>{
  ENDS[`bloc_${b}_${side}`]={t:BEND[b][side][0],e:BEND[b][side][1],m:.55};
  const low=side===`lo`, B=BLOCS[b];
  card({id:`bc_${b}_${side}`,who:`narr`,tag:`⚖ Équilibre · ${B.n} ${low?`en colère`:`trop proche`}`,w:90,
    cond:()=>low?G.bloc[b]<=15:G.bloc[b]>=85,
    tx:low?`<strong>${B.n}</strong> te perçoit comme une menace. ${B.d} : les ponts se coupent, les menaces arrivent, les portes se ferment. Si rien ne change, ils auront ta peau.`
          :`<strong>${B.n}</strong> te tient de très près. ${B.d} : tu leur dois tout, et ils le savent. Si tu continues, tu n'auras plus de liberté — ni de vie à toi.`,
    ch:[
      {t:`Apaiser la situation`,s:`−1 200 €$ · retour à l'équilibre`,req:R.ed(1200),fx:{ed:-1200,bloc:{[b]:low?22:-22},msg:`Un gros virement, quelques mains serrées. La tension retombe — pour l'instant.`}},
      {t:`Prouver ta valeur`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{bloc:{[b]:low?16:-16},cred:3,msg:`Tu retournes la situation par ton sang-froid. L'équilibre revient.`},ko:{hp:-18,bloc:{[b]:low?4:-4},msg:`Ça ne prend pas. Tu t'en sors blessé(e), à peine moins en danger.`}}},
      {t:`Ignorer l'avertissement`,s:`Danger de mort`,fx:{bloc:{[b]:low?-8:8},msg:`Tu hausses les épaules. Le piège se resserre.`}}
    ]});
}));
