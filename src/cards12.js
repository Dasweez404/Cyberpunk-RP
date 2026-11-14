/* =====================================================================
   CARTES 12 — fixers de quartier (Dakota Smith, Dino Dinovic), figures
   de faction (Brick, Oda, Mitch), créanciers
   ===================================================================== */
FIXERS.push(`dakota`,`dino`);

/* ---------- Dakota Smith · Badlands ---------- */
card({id:`meet_dakota`,who:`dakota`,tag:`Rencontre · Dakota Smith`,once:true,w:6,cond:()=>rel(`dakota`)<5&&(G.origin===`nomad`||G.cred>=10),
  tx:`Un garage perdu au bord de la route, à la lisière des Badlands. Une femme aux mains tachées d'huile te détaille sans se presser : « Dakota Smith. Je fixe pour ceux qui roulent. Ici, pas de costards, pas de mensonges. Tu sais tenir un volant ou une clé ? »`,
  ch:[
    {t:`Lui montrer ce que tu vaux au volant`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:6,ok:{rel:{dakota:14},cred:3,ed:400,msg:`Un tour de piste dans la poussière. Elle hoche la tête : « Tu feras l'affaire. »`},ko:{rel:{dakota:6},hp:-6,msg:`Tu plantes le pick-up dans un fossé. Elle rit. « On apprend. »`}}},
    {t:`L'aider à l'atelier`,s:`TECHNIQUE`,chk:{a:`tech`,dc:6,ok:{rel:{dakota:14},xp:{tech:3},msg:`Vous remontez un moteur en silence. C'est sa façon de faire connaissance.`},ko:{rel:{dakota:5},msg:`Tu perds une vis. Elle soupire, mais te garde.`}}}
  ]});
card({id:`dakota_job`,who:`dakota`,tag:`Dakota · Convoi clandestin`,once:true,w:7,cond:()=>rel(`dakota`)>=10,
  tx:`Dakota déplie une carte sur un capot brûlant : « Un chargement à faire passer sous le nez de Militech. Les Wraiths rôdent sur la route, et la patrouille frontalière a soif. <strong>3 500 €$</strong>. Les Badlands paient ceux qui arrivent. »`,
  ch:[
    {t:`Couper par le désert`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:8,ok:{ed:3500,cred:7,rel:{dakota:12},bloc:{nomad:6},loot:2,msg:`Tu traces une piste que personne ne connaît. Livraison à l'heure, moteur fumant.`},ko:{hp:-24,ed:400,rel:{dakota:4},msg:`Les Wraiths te tombent dessus. Tu sauves ta peau, pas la cargaison.`}}},
    {t:`Maquiller le chargement`,s:`TECHNIQUE`,chk:{a:`tech`,dc:8,ok:{ed:3500,cred:6,rel:{dakota:12},msg:`Faux plancher, faux papiers. La patrouille ne voit que de la ferraille.`},ko:{ed:300,bloc:{loi:-8},msg:`Un douanier trop curieux. Tu abandonnes le camion.`}}},
    {t:`Décliner`,fx:{rel:{dakota:-2}}}
  ]});

/* ---------- Dino Dinovic · City Center ---------- */
card({id:`meet_dino`,who:`dino`,tag:`Rencontre · Dino Dinovic`,once:true,w:6,cond:()=>rel(`dino`)<5&&G.cred>=18,
  tx:`Un club privé de Downtown, cuir rouge et fumée chère. Un ancien rocker aux bagues trop nombreuses te fait signe : « Dino Dinovic. Je m'occupe du City Center. Ici les clients ont des noms qu'on ne prononce pas et des problèmes qu'on règle sans bruit. Tu sais être discret(e) ? »`,
  ch:[
    {t:`Lui prouver ta discrétion`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{rel:{dino:14},cred:4,ed:600,msg:`Tu ne poses aucune question. Il apprécie : « Rare. »`},ko:{rel:{dino:6},msg:`Tu parles un peu trop. Il sourit quand même.`}}},
    {t:`Parler musique avec lui`,s:`+Lien`,fx:{rel:{dino:10},hum:4,msg:`Il a joué avant de fixer. Une heure plus tard, vous êtes presque amis.`}}
  ]});
card({id:`dino_job`,who:`dino`,tag:`Dino · Affaire de cols blancs`,once:true,w:7,cond:()=>rel(`dino`)>=10,
  tx:`Dino fait glisser une carte magnétique sur la table : « Un cadre a des dossiers qu'il ne devrait pas avoir. Tour de bureaux à Corpo Plaza, quarantième étage. Tu entres, tu copies, tu sors. <strong>4 500 €$</strong>. Si ça fait du bruit, on ne se connaît pas. »`,
  ch:[
    {t:`Entrer en costume, comme si tu y travaillais`,s:`SANG-FROID · social`,chk:{a:`cool`,dc:8,ok:{ed:4500,cred:7,rel:{dino:12},loot:2,msg:`Un badge, un sourire, un ascenseur. Personne ne te regarde deux fois.`},ko:{hp:-14,ed:400,bloc:{corpo:-10},msg:`La réceptionniste appelle la sécurité. Tu sors par l'escalier de service.`}}},
    {t:`Pirater le serveur depuis le parking`,s:`INTELLECT · hack`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:8,ok:{ed:4500,cred:7,rel:{dino:12},role:{net:2},loot:2,msg:`Les dossiers défilent sur ton écran. Tu n'as même pas quitté ta voiture.`},ko:{hp:-12,bloc:{corpo:-10},msg:`Un contre-piratage. Ils ont une trace de toi.`}}},
    {t:`Décliner`,fx:{rel:{dino:-2}}}
  ]});

/* ---------- Figures de faction ---------- */
card({id:`brick_cell`,who:`brickm`,tag:`Maelstrom · Le prisonnier de Totentanz`,once:true,w:6,cond:()=>yr()>=2074&&(G.member===`maelstrom`||(G.fac.maelstrom||0)>=10||G.cred>=30),
  tx:`Au fond du Totentanz, derrière une porte piégée, un homme enchaîné te regarde à travers la grille : <strong>Brick</strong>, l'ancien chef du Maelstrom, que Royce a renversé et enfermé. « Toi. Tu n'es pas des siens. Ouvre cette porte, et le Maelstrom te devra quelque chose. Royce, lui, te tuera. »`,
  ch:[
    {t:`Libérer Brick`,s:`TECHNIQUE · désamorcer le piège`,heavy:`Libérer Brick, c'est défier Royce. Le Maelstrom se déchirera, et tu seras au milieu.`,chk:{a:`tech`,dc:8,ok:{cred:8,fac:{maelstrom:14},flag:[`brick_free`],echo:{fac_revenge:5},msg:`Le piège cède. Brick se redresse, immense. « Je n'oublie pas. » Royce non plus.`},ko:{hp:-34,fac:{maelstrom:-10},msg:`Le piège explose à moitié. Tu t'enfuis avant que Royce n'arrive.`}}},
    {t:`Prévenir Royce`,s:`Loyauté au chef actuel`,fx:{ed:1500,fac:{maelstrom:10},hum:-5,msg:`Royce ricane et te jette une liasse. Derrière la grille, Brick ne dit rien. Il te regarde.`}},
    {t:`Refermer la porte et partir`,fx:{hum:-2,msg:`Tu n'as rien vu. Tu n'as rien entendu.`}}
  ]});
card({id:`oda_duel`,who:`oda`,tag:`Arasaka · Sandayu Oda`,once:true,w:5,cond:()=>G.cred>=40&&yr()>=2075,
  tx:`Un homme masqué, lames mantis repliées, t'attend au milieu d'un parking vide : <strong>Sandayu Oda</strong>, garde du corps de Hanako Arasaka. « Ton nom revient trop souvent dans les rapports. Ma maîtresse veut savoir si tu es une menace ou un outil. Montre-moi. »`,
  ch:[
    {t:`Accepter le duel`,s:`RÉFLEXES · combat`,heavy:`Oda est l'un des meilleurs combattants de Night City.`,chk:{a:`ref`,k:`cmb`,dc:11,ok:{cred:14,fac:{arasaka:10},loot:3,msg:`Tu le touches une fois. Une seule. Il s'incline : « Un outil, donc. Et un bon. »`},ko:{hp:-50,cred:4,msg:`Il s'arrête à un centimètre de ta gorge. « Pas une menace. » Il s'en va.`}}},
    {t:`T'incliner et proposer tes services`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{ed:2500,fac:{arasaka:14},bloc:{corpo:8},msg:`Il te jauge, puis tend une carte. « Arasaka sait récompenser. »`},ko:{cred:-3,msg:`Il te tourne le dos. « Ni l'un ni l'autre. »`}}},
    {t:`Refuser et partir`,fx:{cred:2,fac:{arasaka:-6},msg:`Tu sens son regard dans ton dos jusqu'à la sortie.`}}
  ]});
card({id:`mitch_panzer`,who:`mitch`,tag:`Aldecaldos · Mitch Anderson`,once:true,w:5,cond:()=>G.origin===`nomad`||(G.fac.aldecaldos||0)>=10||rel(`panam`)>=15,
  tx:`Mitch Anderson, vétéran et mécano des Aldecaldos, essuie ses mains sur un chiffon : « On a récupéré un vieux blindé Militech. Il ne démarre pas. Si tu m'aides à le réveiller, le clan te doit un service. Et moi, une bière. »`,
  ch:[
    {t:`Plonger dans le moteur`,s:`TECHNIQUE`,chk:{a:`tech`,dc:7,ok:{xp:{tech:4},fac:{aldecaldos:12},rel:{panam:6},cred:4,msg:`Le blindé tousse, crache, rugit. Mitch pousse un cri de gosse.`},ko:{hp:-8,fac:{aldecaldos:4},msg:`Un retour de flamme. Mitch te soigne en riant.`}}},
    {t:`Piloter l'essai`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:8,ok:{cred:6,fac:{aldecaldos:10},bloc:{nomad:6},msg:`Tu fais danser trente tonnes d'acier dans la poussière. Tout le camp regarde.`},ko:{hp:-16,msg:`Tu emboutis un camion-citerne. Vide, heureusement.`}}},
    {t:`Passer`,fx:{}}
  ]});

/* ---------- Créanciers : la dette fait mal ---------- */
card({id:`debt_collect`,who:`fix`,tag:`⚠ Les créanciers`,w:70,cond:()=>G.ed<=-1500,
  tx:()=>`Tu dois <strong>${Math.abs(G.ed).toLocaleString(`fr`)} €$</strong>. Ils sont quatre dans ton appartement quand tu rentres, assis sur tes meubles. « On ne vient pas discuter. On vient se servir. »`,
  ch:[
    {t:`Leur laisser un implant`,s:`Ils l'arrachent sur place`,req:()=>G.cyber.length?``:`Aucun implant`,fx:{fn:`sellOne`,hp:-12,hum:-4,msg:`Sans anesthésie. Ils repartent avec une pièce de toi.`}},
    {t:`Leur laisser ton matériel`,s:`Tout ton équipement`,req:()=>G.gear.length?``:`Aucun équipement`,fx:{fn:`seizeGear`,msg:`Ils vident ta planque. Il te reste tes mains.`}},
    {t:`Encaisser la leçon`,s:`Ils te passent à tabac`,fx:{hp:-38,hum:-6,fn:`debtCut`,msg:`Ils effacent une partie de la dette à coups de barre de fer.`}},
    {t:`Fuir par la fenêtre`,s:`RÉFLEXES · ils te chercheront`,chk:{a:`ref`,dc:8,ok:{bloc:{rue:-18},msg:`Trois étages, une benne, une course. Ta tête vient de prendre de la valeur dans la rue.`},ko:{hp:-30,bloc:{rue:-12},msg:`Ils te rattrapent dans l'escalier.`}}}
  ]});
