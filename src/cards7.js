/* =====================================================================
   CARTES 7 — fixers & contacts connus (Muamar Reyes, Faraday, Nancy
   Hartley, River Ward…) + missions propres à chaque fixer
   ===================================================================== */
Object.assign(WHO,{
  muamar:{n:`Muamar Reyes`,r:`Fixer · Les gros coups`,c:`#ffd166`,st:`shades`,sk:22},
  faraday:{n:`Faraday`,r:`Fixer · Edgerunners`,c:`#ff9f1c`,st:`cap`,sk:24},
  nancy:{n:`Nancy Hartley`,r:`Détective NCPD`,c:`#3b8bff`,st:`short`,sk:30},
  river:{n:`River Ward`,r:`Détective NCPD · The Glen`,c:`#3b8bff`,st:`short`,sk:26},
});
FIXERS.push(`muamar`,`faraday`);

/* ---------- Fixers déjà connus : lien + mission de niveau 2 ---------- */
card({id:`wk_2`,who:`wakako`,tag:`Wakako Okada · Faveur de Japantown`,once:true,w:7,cond:()=>rel(`wakako`)>=15,
  tx:`Wakako te reçoit dans son salon de thé, derrière un paravent. « Je suis une femme d'affaires. Dans ce milieu, on ne me doit rien, mais on m'est redevable. Un contrat difficile attend quelqu'un de discret. Je te l'offre. »`,
  ch:[
    {t:`Accepter le contrat`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{ed:3200,cred:7,rel:{wakako:12},fac:{tygers:4},msg:`Tout se passe dans la discrétion. Wakako verse le thé : « Voilà qui est bien fait. »`},ko:{hp:-18,ed:400,rel:{wakako:4},msg:`Un imprévu, une blessure. Wakako te regarde avec une déception polie.`}}},
    {t:`Lui offrir un service en retour`,s:`+Lien`,fx:{rel:{wakako:10},cred:3,msg:`Elle sourit à peine. « Dans ce monde, la gratitude est une monnaie. »`}}
  ]});
card({id:`rg_2`,who:`regina`,tag:`Regina Jones · Contrat spécial`,once:true,w:7,cond:()=>rel(`regina`)>=15,
  tx:`Regina déplie une carte : « Un client veut qu'une certaine personne arrête de causer des problèmes. Un cas… sensible. Je ne confie ça qu'aux gens en qui j'ai confiance. »`,
  ch:[
    {t:`Mener l'opération avec discrétion`,s:`RÉFLEXES · furtivité`,chk:{a:`ref`,k:`stl`,dc:8,ok:{ed:3400,cred:7,rel:{regina:12},msg:`Ni vu ni connu. Regina te remet l'enveloppe sans un mot.`},ko:{hp:-24,ed:300,rel:{regina:4},msg:`Un témoin. Tu t'en sors, mais l'affaire est moins propre que prévu.`}}},
    {t:`Refuser, trop dangereux`,s:`+Humanité`,fx:{hum:5,rel:{regina:2},msg:`« Je comprends. Je confierai à quelqu'un d'autre. »`}}
  ]});
card({id:`pd_2`,who:`padre`,tag:`Padre · Dans le barrio`,once:true,w:7,cond:()=>rel(`padre`)>=15,
  tx:`Padre t'accueille à l'arrière de son église, les bras ouverts : « Tu as aidé mon barrio, et tu n'as rien demandé. Ici, on n'oublie pas. Une famille de Wellsprings a besoin d'un protecteur. Tu serais le bon. »`,
  ch:[
    {t:`Protéger la famille`,s:`CORPS`,chk:{a:`body`,k:`cmb`,dc:8,ok:{ed:1800,hum:8,cred:6,rel:{padre:12},fac:{valentinos:8},msg:`Quelques nuits de garde, un casseur dissuadé. La famille t'embrasse comme un fils.`},ko:{hp:-22,hum:4,rel:{padre:6},msg:`Un cambriolage tourne mal, mais personne n'est mort. Padre te remercie quand même.`}}},
    {t:`Leur offrir de l'argent`,s:`−600 €$`,req:R.ed(600),fx:{ed:-600,hum:8,rel:{padre:12},msg:`Padre bénit ta générosité. Elle sera rendue, d'une façon ou d'une autre.`}}
  ]});

/* ---------- Muamar Reyes ---------- */
card({id:`meet_muamar`,who:`muamar`,tag:`Rencontre · Muamar Reyes`,once:true,w:6,cond:()=>rel(`muamar`)<5&&G.cred>=14,
  tx:`Un homme élégant t'aborde dans un bar de Westbrook, un cigare éteint aux lèvres. « Muamar Reyes. Fixer. On m'a parlé de toi. Je n'aime pas perdre mon temps, alors voici l'idée : un coffre dans un entrepôt de Pacifica, trois hommes dessus, et un client prêt à payer cher. »`,
  ch:[
    {t:`Poser des questions`,s:`INTELLECT`,chk:{a:`int`,dc:7,ok:{rel:{muamar:14},cred:3,ed:600,msg:`Tu as pris le temps de comprendre. Il apprécie : « Prudent. J'aime ça. »`},ko:{rel:{muamar:6},msg:`Il s'impatiente. Mais t'a retenu(e).`}}},
    {t:`Dire oui tout de suite`,s:`Impulsif`,fx:{rel:{muamar:8},cred:2,ed:300,msg:`« Enthousiaste. Voyons si ça dure. »`}}
  ]});
card({id:`muamar_job`,who:`muamar`,tag:`Muamar · Le coffre`,w:7,once:true,cond:()=>rel(`muamar`)>=10,
  tx:`Muamar te retrouve devant l'entrepôt de Pacifica. « Trois gardes, une caméra, un coffre. Je ne te dis pas comment. Je te dis combien : <strong>4 000 €$</strong>. »`,
  ch:[
    {t:`Crocheter le coffre en silence`,s:`TECHNIQUE`,chk:{a:`tech`,dc:8,ok:{ed:4000,cred:7,rel:{muamar:12},msg:`Un clic, un deuxième, le coffre s'ouvre. Muamar sourit sans rien dire.`},ko:{hp:-20,ed:400,msg:`L'alarme se déclenche. Tu t'enfuis avec un lingot, pas plus.`}}},
    {t:`Maîtriser les gardes`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:8,ok:{ed:4000,cred:8,rel:{muamar:10},msg:`Trois gardes, trois sacs de sable. Le coffre est à toi.`},ko:{hp:-30,ed:500,msg:`Une fusillade plus longue que prévu.`}}},
    {t:`Pirater les caméras`,s:`INTELLECT · hack`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:7,ok:{ed:4000,cred:7,rel:{muamar:12},role:{net:1},msg:`Les caméras se figent. Tu repars avec le coffre sous le bras.`},ko:{hp:-12,ed:400,msg:`Les caméras te voient une seconde de trop.`}}}
  ]});
card({id:`muamar_gift`,who:`muamar`,tag:`Muamar · Une part`,once:true,w:7,cond:()=>rel(`muamar`)>=30,
  tx:`Muamar te tend une valise : « Une partie de ce qu'on a gagné ensemble. Plus ce que je réserve à mes gens de confiance. »`,
  ch:[
    {t:`Prendre la valise`,s:`+Gain`,fx:{ed:5000,cred:4,rel:{muamar:8},msg:`Elle est lourde, elle est belle. Muamar sourit : « À la prochaine. »`}},
    {t:`La lui laisser`,s:`+Lien`,fx:{rel:{muamar:16},cred:6,msg:`Il lève un sourcil, puis un verre. « Tu es spécial(e). »`}}
  ]});

/* ---------- Faraday (époque Edgerunners) ---------- */
card({id:`meet_faraday`,who:`faraday`,tag:`Rencontre · Faraday`,once:true,w:6,cond:()=>rel(`faraday`)<5&&yr()>=2074&&G.cred>=12,
  tx:`Un homme à la voix posée t'invite à sa table à l'Afterlife : « Faraday. Je fixe pour ceux qui n'ont plus rien à perdre. Les Edgerunners, on les connaît. Tu veux travailler pour moi ? »`,
  ch:[
    {t:`Accepter de l'écouter`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{rel:{faraday:14},cred:3,msg:`Il te jauge puis acquiesce. « Je sens que tu iras loin. »`},ko:{rel:{faraday:6},msg:`Il fronce les sourcils. « Tu as encore du chemin. »`}}},
    {t:`Refuser`,fx:{rel:{faraday:-2},msg:`« Comme tu voudras. Les Edgerunners ne manquent pas. »`}}
  ]});
card({id:`faraday_job`,who:`faraday`,tag:`Faraday · Contrat à haut risque`,once:true,w:7,cond:()=>rel(`faraday`)>=10,
  tx:`Faraday te glisse une puce : « Un transfert de données pour un client discret. Un convoi Militech, deux escortes, un gamin avec un Sandevistan. <strong>5 000 €$</strong>. Ce n'est pas pour les timides. »`,
  ch:[
    {t:`Intercepter le convoi`,s:`RÉFLEXES · combat`,chk:{a:`ref`,k:`cmb`,dc:9,ok:{ed:5000,cred:9,rel:{faraday:12},role:{solo:2},msg:`Tu coupes la route, tu enfonces les portes. Faraday paie sans cligner.`},ko:{hp:-36,ed:500,msg:`Le gamin au Sandevistan est trop rapide. Tu fuis, saignant(e).`}}},
    {t:`Pirater le convoi à distance`,s:`INTELLECT · hack`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:9,ok:{ed:5000,cred:8,rel:{faraday:12},role:{net:2},msg:`Un frein piraté, un convoi à l'arrêt. Propre.`},ko:{hp:-18,ed:400,msg:`Les contre-mesures te brûlent la nuque.`}}}
  ]});
card({id:`faraday_gift`,who:`faraday`,tag:`Faraday · Reconnaissance`,once:true,w:7,cond:()=>rel(`faraday`)>=30,
  tx:`Faraday te remet un étui : « Ceux qui travaillent pour moi et qui survivent ont droit à un peu de matériel. Pas de la camelote. »`,
  ch:[
    {t:`Un revolver de qualité`,s:`Overture`,fx:{gear:`overture`,rel:{faraday:10},msg:`Il est parfaitement équilibré. Faraday hoche la tête.`}},
    {t:`Un bonus en cash`,s:`+4 500 €$`,fx:{ed:4500,rel:{faraday:10},msg:`Une épaisse enveloppe. « Dépense-la bien. »`}}
  ]});

/* ---------- Détectives NCPD ---------- */
card({id:`meet_nancy`,who:`nancy`,tag:`Rencontre · Nancy Hartley`,once:true,w:6,cond:()=>rel(`nancy`)<5&&G.cred>=10,
  tx:`Une détective NCPD, manteau gris, café tiède, te fait signe depuis un banc : « Nancy Hartley. Je ne suis pas là pour t'arrêter. Je cherche quelqu'un qui connaît les rues. Quelqu'un qui parle, discrètement. »`,
  ch:[
    {t:`Coopérer`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{rel:{nancy:14},bloc:{loi:6},ed:500,msg:`Quelques noms, un contexte. Elle note tout sans un mot.`},ko:{rel:{nancy:6},msg:`Tu bafouilles. Elle sourit, sans méchanceté.`}}},
    {t:`Lui dire de te laisser tranquille`,s:`Rue +`,fx:{rel:{nancy:-4},bloc:{rue:4,loi:-4},msg:`Elle hausse les épaules. « On se reverra. »`}}
  ]});
card({id:`nancy_job`,who:`nancy`,tag:`Nancy · Une enquête`,once:true,w:7,cond:()=>rel(`nancy`)>=10,
  tx:`Nancy étale des photos sur le capot de sa voiture : trois disparitions, un même point commun, une BD qui circule. « J'ai besoin d'un œil extérieur. Tu es mon seul recours. »`,
  ch:[
    {t:`Enquêter sur le terrain`,s:`INTELLECT`,chk:{a:`int`,dc:8,ok:{ed:1500,cred:6,rel:{nancy:14},bloc:{loi:5},msg:`Tu relies les points. Nancy sourit en fermant son carnet.`},ko:{hp:-14,rel:{nancy:6},msg:`Une impasse, une menace. Tu reviens avec peu.`}}},
    {t:`Lui laisser faire`,fx:{rel:{nancy:-3}}}
  ]});
card({id:`meet_river`,who:`river`,tag:`Rencontre · River Ward`,once:true,w:6,cond:()=>rel(`river`)<5&&G.cred>=12,
  tx:`Un détective large d'épaules, imperméable défraîchi, te croise devant une épicerie de The Glen : « River Ward. NCPD. Pas de ça avec moi : je ne prends pas de pots-de-vin. J'ai un cas difficile, une famille qui n'a personne d'autre. Tu m'aides ? »`,
  ch:[
    {t:`L'aider`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{rel:{river:14},bloc:{loi:5},hum:5,msg:`Il te regarde avec une gravité nouvelle. « Merci. Vraiment. »`},ko:{rel:{river:6},msg:`Tu fais de ton mieux. Il hoche la tête, fatigué.`}}},
    {t:`Refuser`,fx:{rel:{river:-3},msg:`« Je comprends. La vie est dure pour tout le monde. »`}}
  ]});
card({id:`river_job`,who:`river`,tag:`River · La famille`,once:true,w:7,cond:()=>rel(`river`)>=10,
  tx:`River te présente une famille de The Glen : un fils disparu, une fille qui ne dort plus. « Les gangs sont derrière, mais je n'ai pas les preuves. Si tu retrouves le garçon… »`,
  ch:[
    {t:`Retrouver le garçon`,s:`CORPS/RÉFLEXES`,chk:{a:`ref`,k:`cmb`,dc:8,ok:{hum:12,cred:7,rel:{river:16},bloc:{loi:5},msg:`Une cave de Wellsprings, un garçon terrorisé. Tu le ramènes à sa mère en pleurs.`},ko:{hp:-24,hum:6,rel:{river:8},msg:`Il est vivant, mais tu paies cher.`}}},
    {t:`Payer pour qu'il le relâche`,s:`−1 500 €$`,req:R.ed(1500),fx:{ed:-1500,hum:6,rel:{river:10},msg:`Les ravisseurs prennent l'argent. Le garçon revient, muet.`}}
  ]});
