/* =====================================================================
   CARTES 11 — poursuites et captures, coup du sort de départ,
   missions secondaires générées, offre d'empire
   ===================================================================== */
Object.assign(ENDS,{
  prison:{t:`DERRIÈRE LES BARREAUX`,e:`Une cellule sans fenêtre, un numéro à la place du nom. Night City t'a déjà oublié(e).`,m:.5},
  executed:{t:`EXÉCUTÉ(E)`,e:`Ceux que tu avais contre toi ont fini par te trouver. Ils n'ont pas pris la peine de cacher le corps.`,m:.5},
  desert:{t:`PERDU(E) DANS LES BADLANDS`,e:`Les clans t'ont laissé(e) sans eau, sans roues, sans nom. Le sable a fait le reste.`,m:.5},
});
ENDS.debt={t:`MORT(E) DANS LA MISÈRE`,e:`Plus un eddie, plus un toit, plus personne. Les créanciers ont pris ce qu'il restait.`};
const HV = b => Math.round((G.heat||{})[b]||0);
const hot = b => HV(b)>=70;
const hw = b => () => HV(b)>=40 ? 2+HV(b)/6 : 0;

/* ---------- Poursuites (dès 40) ---------- */
card({id:`ht_loi`,who:`ncpd`,tag:`🚔 Police · tu es recherché(e)`,w:hw(`loi`),cond:()=>HV(`loi`)>=40,
  tx:()=>hot(`loi`)?`Gyrophares dans le rétro, un drone au-dessus de ta tête. Ton visage est sur tous les écrans de patrouille : la NCPD ne te contrôle plus, elle te <strong>traque</strong>. « À genoux. Mains sur la tête. »`
    :`Une patrouille NCPD ralentit à ta hauteur. L'agent compare ton visage à son écran, puis pose la main sur son arme. « Toi. On a quelques questions. »`,
  dyn:()=>{ const h=hot(`loi`), bribe=Math.round((h?1800:700)*infl());
    return [
      {t:`Graisser la patte`,s:`${money(bribe)} · la poursuite retombe`,req:()=>G.ed>=bribe?``:`${money(bribe)} requis`,fx:{ed:-bribe,bloc:{loi:h?18:14},msg:`Les billets disparaissent dans une poche d'uniforme. « On ne t'a pas vu(e). »`}},
      {t:`Semer la patrouille`,s:`RÉFLEXES`,chk:{a:`ref`,k:`drv`,dc:h?10:8,ok:{bloc:{loi:8},cred:2,msg:`Une ruelle, un parking, un tunnel. Les sirènes s'éloignent.`},ko:{hp:h?-28:-16,bloc:{loi:-8},msg:`Un taser dans le dos, des coups de matraque. Tu t'en sors, mais ils ont ton nom.`}}},
      {t:`Résister`,s:`CORPS · combat · aggrave ton cas`,chk:{a:`body`,k:`cmb`,dc:h?10:9,ok:{cred:4,bloc:{loi:-10},msg:`Deux agents à terre. Tu es libre. Et beaucoup plus recherché(e).`},ko:{hp:h?-36:-24,bloc:{loi:-14},msg:`Ils appellent des renforts. Tu t'échappes en sang.`}}},
      {t:`Te laisser embarquer`,s:`Amende et garde à vue`,fx:{ed:-Math.round(Math.max(300,G.ed*.2)),bloc:{loi:20},hp:-6,cred:-3,msg:`Une nuit en cellule, une amende salée, une réputation écornée. Mais ton dossier se referme.`}}
    ]; },ch:[]});
card({id:`ht_corpo`,who:`corpo`,tag:`🏢 Corpos · tu es dans leur viseur`,w:hw(`corpo`),cond:()=>HV(`corpo`)>=40,
  tx:()=>hot(`corpo`)?`Tes comptes sont gelés depuis ce matin. Un SUV noir stationne en bas de chez toi depuis trois jours. Aujourd'hui, les portières s'ouvrent : une équipe d'intervention corporative, calme, méthodique.`
    :`Un costume gris s'assoit à ta table sans y être invité : « Vous dérangez des gens qui ont les moyens de ne pas être dérangés. Considérez ceci comme un avertissement. »`,
  dyn:()=>{ const h=hot(`corpo`), pay=Math.round((h?2500:1000)*infl());
    return [
      {t:`Payer un "dédommagement"`,s:`${money(pay)} · ils classent le dossier`,req:()=>G.ed>=pay?``:`${money(pay)} requis`,fx:{ed:-pay,bloc:{corpo:18},msg:`Un virement, un accusé de réception. Le dossier passe dans une autre pile.`}},
      {t:`Effacer tes traces`,s:`INTELLECT · hack`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:h?10:8,ok:{bloc:{corpo:16},role:{net:1},msg:`Ton nom disparaît de leurs bases. Un fantôme de plus.`},ko:{hp:-14,hum:-3,bloc:{corpo:-8},msg:`Leur contre-mesure te brûle la nuque. Ils savent que tu as essayé.`}}},
      {t:`Retourner la situation`,s:`SANG-FROID`,chk:{a:`cool`,dc:h?10:8,ok:{bloc:{corpo:10},cred:3,msg:`Tu leur rappelles ce que tu sais sur eux. Le costume se lève, livide.`},ko:{hp:h?-30:-12,ed:-500,msg:`Ils ne négocient pas. Ils facturent.`}}},
      {t:`Disparaître quelque temps`,s:`Tu perds du terrain`,fx:{bloc:{corpo:12},cred:-4,ed:-200,msg:`Tu changes de planque, de numéro, de trajet. On t'oublie un peu — toi aussi.`}}
    ]; },ch:[]});
card({id:`ht_rue`,who:`@fixer`,tag:`🔪 Gangs · ta tête est mise à prix`,w:hw(`rue`),cond:()=>HV(`rue`)>=40,
  tx:()=>hot(`rue`)?`Ton portrait circule sur tous les réseaux de gangs avec un chiffre dessous. Ce soir, ils sont six à t'attendre devant ta planque. Personne n'a l'air pressé.`
    :`Un fixer te prévient à demi-mot : « Il y a une prime sur toi dans la rue. Petite, pour l'instant. Mais les gamins ont faim. »`,
  dyn:()=>{ const h=hot(`rue`), pay=Math.round((h?2200:900)*infl());
    return [
      {t:`Racheter la prime`,s:`${money(pay)}`,req:()=>G.ed>=pay?``:`${money(pay)} requis`,fx:{ed:-pay,bloc:{rue:18},msg:`Le fixer fait passer le mot : la prime est levée. Pour l'instant.`}},
      {t:`Faire un exemple`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:h?10:8,ok:{cred:6,bloc:{rue:12},hum:-3,msg:`Tu laisses le premier chasseur en vie, exprès. Il racontera.`},ko:{hp:h?-36:-22,msg:`Ils sont trop nombreux. Tu ne dois ta vie qu'à une porte dérobée.`}}},
      {t:`Demander la protection d'une faction`,s:`Membre, allié ou chef requis`,req:()=>(G.member||G.mine||Object.keys(G.allies||{}).length)?``:`Aucune faction derrière toi`,fx:{bloc:{rue:16},ed:-300,msg:`Quelques noms prononcés au bon endroit. Les chasseurs se trouvent d'autres proies.`}},
      {t:`Te terrer`,s:`RÉFLEXES · furtivité`,chk:{a:`ref`,k:`stl`,dc:h?9:7,ok:{bloc:{rue:8},msg:`Trois semaines sans sortir le jour. Ça marche.`},ko:{hp:-18,msg:`Quelqu'un a vendu ta planque.`}}}
    ]; },ch:[]});
card({id:`ht_nomad`,who:`nomad`,tag:`🏜 Badlands · les clans te barrent la route`,w:hw(`nomad`),cond:()=>HV(`nomad`)>=40,
  tx:()=>hot(`nomad`)?`Trois Thorton en travers de la route, moteurs coupés. Les clans ont ton signalement. Ici, on ne livre personne à la police : on règle ça entre soi, dans la poussière.`
    :`Un barrage nomade à la sortie de la ville. Le chef de convoi te dévisage : « Toi, tu ne passes plus gratuitement. »`,
  dyn:()=>{ const h=hot(`nomad`), pay=Math.round((h?1800:700)*infl());
    return [
      {t:`Payer le prix du passage`,s:`${money(pay)}`,req:()=>G.ed>=pay?``:`${money(pay)} requis`,fx:{ed:-pay,bloc:{nomad:18},msg:`Le chef empoche, hoche la tête. Les camions s'écartent.`}},
      {t:`Forcer le barrage`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:h?10:8,ok:{cred:4,bloc:{nomad:-6},msg:`Tu passes entre deux camions dans un nuage de sable. Ils ne l'oublieront pas.`},ko:{hp:h?-32:-20,bloc:{nomad:-8},msg:`Ton véhicule finit sur le toit.`}}},
      {t:`Réparer un de leurs moteurs`,s:`TECHNIQUE`,chk:{a:`tech`,dc:h?9:7,ok:{bloc:{nomad:16},hum:3,msg:`Quand le moteur repart, les visages changent. Chez les nomades, ça vaut une parole.`},ko:{bloc:{nomad:-4},msg:`Tu aggraves la panne. Mauvais point.`}}},
      {t:`Faire demi-tour`,s:`Tu évites les Badlands`,fx:{bloc:{nomad:8},cred:-2,msg:`Tu rentres en ville par la grande route, la tête basse.`}}
    ]; },ch:[]});

/* ---------- Captures (à 100) ---------- */
card({id:`cap_loi`,who:`maxtac`,tag:`⛓ Arrestation`,cond:()=>false,
  tx:()=>`Portes enfoncées à l'aube, projecteurs, canons dans le visage. La NCPD ne plaisante plus : mandat, fourgon blindé, cellule. Si tu ne sors pas de là dans l'heure, tu ne sortiras plus. <em>Plus ta Street Cred est haute, plus ils tiennent à te garder.</em>`,
  dyn:()=>{ const bail=Math.round((3000+G.cred*60)*infl());
    return [
      {t:`Acheter ta liberté`,s:`${money(bail)} · caution et juge`,req:()=>G.ed>=bail?``:`${money(bail)} requis`,fx:{ed:-bail,bloc:{loi:40},cred:-3,msg:`Un avocat véreux, un juge compréhensif. Tu ressors ruiné(e), mais libre.`}},
      {t:`T'évader pendant le transfert`,s:`RÉFLEXES`,heavy:`Si tu échoues, c'est la prison à vie.`,chk:{a:`ref`,dc:10,ok:{bloc:{loi:25},cred:8,msg:`Un virage, une portière, une course à mort. La légende dit que personne ne s'évade d'un fourgon NCPD.`},ko:{die:`prison`,msg:`Ils te rattrapent au bout de la rue. Cette fois, ils jettent la clé.`}}},
      {t:`Faire jouer ta faction`,s:`Rang 2, chef ou pacte requis`,req:()=>((G.member&&G.rank>=2)||G.mine||isLeader()||Object.keys(G.allies||{}).length)?``:`Personne d'assez haut placé`,fx:{bloc:{loi:35},ed:-800,msg:`Un coup de fil à la bonne personne. Ton dossier « se perd ». Tu leur dois une faveur.`}},
      {t:`Plaider coupable`,s:`Fin : la prison`,heavy:`Tu acceptes la prison. Ta vie à Night City s'arrête ici.`,fx:{die:`prison`,msg:`Tu signes. Le fourgon démarre.`}}
    ]; },ch:[]});
card({id:`cap_corpo`,who:`smasher`,tag:`☠ Équipe de nettoyage`,cond:()=>false,
  tx:()=>`Ils ne préviennent plus. Une équipe de nettoyage corporative investit ton immeuble étage par étage, sans un mot, sans un bruit. Tu es une ligne à effacer dans un rapport.`,
  ch:[
    {t:`Te battre jusqu'au bout`,s:`CORPS · combat`,heavy:`Un échec peut te coûter la vie.`,chk:{a:`body`,k:`cmb`,dc:11,ok:{cred:10,hum:-6,bloc:{corpo:25},msg:`Tu sors de l'immeuble en flammes, seul(e) debout. Ils réévalueront le coût.`},ko:{hp:-70,bloc:{corpo:15},msg:`Tu survis peut-être. À peine.`}}},
    {t:`Fuir par les toits`,s:`RÉFLEXES`,chk:{a:`ref`,k:`stl`,dc:10,ok:{bloc:{corpo:25},msg:`Tu disparais dans la nuit. Ils trouvent un appartement vide.`},ko:{hp:-50,bloc:{corpo:12},msg:`Une balle dans la jambe. Tu rampes jusqu'à une bouche d'égout.`}}},
    {t:`Vendre tout ce que tu sais`,s:`Ils t'épargnent · −Humanité`,fx:{bloc:{corpo:45},hum:-12,cred:-8,msg:`Tu donnes des noms. Tous les noms. Ils rangent leurs armes.`}}
  ]});
card({id:`cap_rue`,who:`@fixer`,tag:`☠ La rue te condamne`,cond:()=>false,
  tx:()=>`Tous les gangs que tu as froissés se sont mis d'accord, pour une fois. Un entrepôt, une chaise, un cercle de visages. On te laisse dire un dernier mot.`,
  ch:[
    {t:`Les défier tous`,s:`CORPS · combat`,heavy:`Un échec, et c'est l'exécution.`,chk:{a:`body`,k:`cmb`,dc:11,ok:{cred:12,bloc:{rue:30},msg:`Tu brises tes liens, tu brises des os. Ils te laissent partir par respect.`},ko:{die:`executed`,msg:`Tu emportes deux d'entre eux. Ça ne suffit pas.`}}},
    {t:`Plaider ta cause`,s:`SANG-FROID`,chk:{a:`cool`,dc:10,ok:{bloc:{rue:35},cred:4,msg:`Tu parles longtemps. À la fin, quelqu'un rit. On te détache.`},ko:{hp:-45,bloc:{rue:15},msg:`Ils te laissent en vie pour l'exemple. Méconnaissable.`}}},
    {t:`Payer le prix du sang`,s:`Tout ce que tu as`,fx:{fn:`payAll`,bloc:{rue:45},msg:`Ils te vident les poches, les comptes, la planque. Tu repars avec ta peau.`}}
  ]});
card({id:`cap_nomad`,who:`nomad`,tag:`☠ Jugement des clans`,cond:()=>false,
  tx:()=>`Les clans t'ont pris(e) sur la route. Un cercle de véhicules, un feu, des anciens qui débattent de ton sort. La sentence habituelle : te laisser dans le désert, sans eau ni roues.`,
  ch:[
    {t:`Demander l'épreuve de la route`,s:`RÉFLEXES · conduite`,heavy:`Un échec, et ils t'abandonnent au désert.`,chk:{a:`ref`,k:`drv`,dc:10,ok:{cred:8,bloc:{nomad:35},msg:`Tu gagnes la course contre leur meilleur pilote. Les anciens se lèvent.`},ko:{die:`desert`,msg:`Tu perds. Ils tiennent parole.`}}},
    {t:`Offrir tes mains`,s:`TECHNIQUE`,chk:{a:`tech`,dc:9,ok:{bloc:{nomad:35},hum:4,msg:`Tu remets en marche trois camions en une nuit. La dette est payée en sueur.`},ko:{hp:-35,bloc:{nomad:15},msg:`Ils te relâchent loin de tout. Tu marches deux jours.`}}},
    {t:`Offrir ton véhicule et ton argent`,s:`Tout ce que tu as`,fx:{fn:`payAll`,bloc:{nomad:45},msg:`Ils prennent tout. On te dépose à l'entrée de la ville.`}}
  ]});

/* ---------- Coup du sort : chaque vie commence différemment ---------- */
const TWISTS = [
  [`Une dette de famille`,`Un créancier frappe à ta porte le jour de tes 18 ans : ton père — ou quelqu'un qui portait son nom — a laissé une ardoise. Elle est à toi maintenant.`,[[`Assumer la dette`,`−400 €$ · +Humanité`,{ed:-400,hum:6,cred:2}],[`Nier et claquer la porte`,`Les gangs s'en souviendront`,{bloc:{rue:-12},cred:3}]]],
  [`Un héritage inattendu`,`Une vieille voisine que tu aidais est morte. Elle t'a laissé une boîte en fer : des eddies, et une adresse griffonnée.`,[[`Garder l'argent`,`+900 €$`,{ed:900}],[`Suivre l'adresse`,`Un contact à l'Afterlife`,{rel:{rogue:14},cred:3}]]],
  [`Une vieille blessure`,`Un accident d'enfance t'a laissé une épaule mal réparée. Un ripperdoc te propose de la remplacer à crédit.`,[[`Accepter l'implant`,`Squelette en titane · −Humanité · dette`,{cy:`titanium`,humx:-6,ed:-500}],[`Garder ta chair`,`+Humanité`,{hum:5,xp:{body:3}}]]],
  [`Un casier déjà rempli`,`À 16 ans, tu as pris pour quelqu'un d'autre. La NCPD a ta photo, tes empreintes, et beaucoup de mémoire.`,[[`Faire profil bas`,`La police te surveille`,{bloc:{loi:-18},cred:4}],[`Payer pour effacer le dossier`,`−600 €$`,{ed:-600}]]],
  [`Un don`,`Depuis toujours, il y a une chose que tu fais mieux que les autres, sans savoir pourquoi.`,[[`Tes mains`,`+XP TECHNIQUE et RÉFLEXES`,{xp:{tech:4,ref:4}}],[`Ta tête`,`+XP INTELLECT et SANG-FROID`,{xp:{int:4,cool:4}}],[`Ton corps`,`+XP CORPS`,{xp:{body:7}}]]],
  [`Un ami d'enfance chez les corpos`,`Vous avez grandi dans le même bloc. Lui a signé chez une corporation. Il te doit un service, et il le sait.`,[[`Lui demander de l'argent`,`+700 €$`,{ed:700}],[`Lui demander un nom`,`Les corpos te voient d'un bon œil`,{bloc:{corpo:10},fac:{militech:8},cred:2}]]],
  [`Une promesse`,`Quelqu'un que tu aimais est mort cette année. Tu lui as promis une chose, au bord du lit.`,[[`De rester humain(e)`,`+Humanité · trait Âme intacte`,{hum:5,fn:`twAme`}],[`De ne jamais rester pauvre`,`+500 €$ · −Humanité`,{ed:500,hum:-4,cred:2}]]],
  [`Un coup de chance`,`Tu trouves un sac dans une épave au bord de la route. Dedans : une arme propre et une liasse.`,[[`Garder l'arme`,`Lexington`,{gear:`lexington`}],[`Vendre le tout`,`+800 €$`,{ed:800}],[`Rendre le sac à son propriétaire`,`Un fixer te remarque`,{rel:{dex:14},cred:4,hum:4}]]],
  [`Un mauvais départ`,`Ta première combine a mal tourné. Tu as perdu ce que tu avais, et gagné une cicatrice.`,[[`Recommencer plus prudemment`,`−150 €$ · +XP SANG-FROID`,{ed:-150,xp:{cool:5}}],[`Te venger`,`Les gangs te remarquent`,{bloc:{rue:-10},cred:5,hp:-10}]]],
  [`Un mentor de passage`,`Un vieux solo te prend sous son aile pendant un hiver, avant de disparaître sans un mot.`,[[`Apprendre à te battre`,`+XP CORPS et RÉFLEXES`,{xp:{body:4,ref:4}}],[`Apprendre à survivre`,`Trait Instinct de survie`,{fn:`twSurvie`}]]],
];
card({id:`life_twist`,who:`narr`,tag:`Coup du sort`,cond:()=>false,
  tx:()=>{ const i=rnd(0,TWISTS.length-1); G.tmp={tw:i}; return `<strong>${TWISTS[i][0]}.</strong> ${TWISTS[i][1]}`; },
  dyn:()=>TWISTS[(G.tmp&&G.tmp.tw)||0][2].map(c=>({t:c[0],s:c[1],fx:c[2]})),ch:[]});

/* ---------- Missions secondaires générées ---------- */
const SM_GOALS = [`récupérer une mallette volée`,`faire sortir un témoin de la ville`,`saboter une livraison`,`retrouver une personne disparue`,`protéger un commerce contre un racket`,`voler un prototype`,`effacer un dossier compromettant`,`escorter un médecin de rue`,`porter un message à un chef de gang`,`faire taire un maître chanteur`,`reprendre un implant impayé`,`photographier une rencontre secrète`,`ramener un gamin fugueur`,`détruire une cargaison de drogue coupée`,`retrouver le tueur d'un ami`,`voler une voiture de collection`];
const SM_TWISTS = [`Le client ment sur un point.`,`Un autre merc est déjà sur le coup.`,`La NCPD surveille le secteur.`,`La cible est quelqu'un que tu connais de vue.`,`Tout doit être réglé avant l'aube.`,`Le paiement dépend de ta discrétion.`,`Des Scavs rôdent dans le coin.`,`La cible est sous protection corpo.`,`Il pleut des cordes et les rues sont vides.`,`Le client a peur et ne dit pas de quoi.`,`Un gang local réclame sa part.`,`L'adresse donnée n'existe pas.`];
const SM_WAYS = [
  {t:`Passer en force`,a:`body`,k:`cmb`,ko:22},{t:`Régler ça au flingue`,a:`ref`,k:`cmb`,ko:22},{t:`T'infiltrer sans bruit`,a:`ref`,k:`stl`,ko:14},
  {t:`Baratiner ton chemin`,a:`cool`,ko:10},{t:`Pirater les accès`,a:`int`,k:`hck`,ko:12},{t:`Bricoler une solution`,a:`tech`,ko:12},
  {t:`Observer, puis frapper au bon moment`,a:`int`,ko:12},{t:`Tout miser sur le volant`,a:`ref`,k:`drv`,ko:18}
];
const SM_OK = [`Propre, rapide. Le client paie sans discuter.`,`Ça s'est joué à une seconde près, mais c'est fait.`,`Personne ne saura jamais comment tu t'y es pris(e).`,`Le client te regarde autrement. Ton nom va circuler.`];
const SM_KO = [`Tout part de travers. Tu sauves ta peau, pas la mission.`,`Quelqu'un t'attendait. Tu repars les mains vides.`,`Un détail t'a échappé, et il a coûté cher.`];
card({id:`sm`,who:`fix`,tag:`Mission secondaire`,w:45,cond:()=>!G.flags.q_active,
  tx:()=>{ const d=DIST.filter(x=>!x.lock||G.flags.dogtown), dd=d[rnd(0,d.length-1)];
    G.tmp={g:rnd(0,SM_GOALS.length-1),tw:rnd(0,SM_TWISTS.length-1),d:dd.n};
    return `« J'ai besoin de quelqu'un pour <strong>${SM_GOALS[G.tmp.g]}</strong>, du côté de <em>${dd.n}</em>. » ${SM_TWISTS[G.tmp.tw]}`; },
  dyn:()=>{ const tier=G.cred>=60?3:G.cred>=30?2:G.cred>=10?1:0;
    const pay=Math.round((450+G.cred*32)*(0.8+Math.random()*0.6)*bm().gig/50)*50;
    const ways=shuffle(SM_WAYS).slice(0,3);
    const out=ways.map(w=>{ const dc=6+tier+rnd(0,1); const heat=w.k===`cmb`?{loi:-3}:w.k===`hck`?{corpo:-2}:null;
      return {t:w.t,s:`${ATTRS[w.a].n}${w.k?` · ${{cmb:`combat`,stl:`furtivité`,hck:`hack`,drv:`conduite`}[w.k]}`:``} · ${money(pay)}`,chk:{a:w.a,k:w.k,dc,
        ok:{ed:pay,cred:2+tier,fn:`sideDone`,loot:pay>=1800?(pay>=3200?2:1):0,msg:pickR(SM_OK)},
        ko:Object.assign({hp:-(w.ko+tier*3),cred:-1,msg:pickR(SM_KO)},heat?{bloc:heat}:{})}}; });
    if(Math.random()<.35) out.push({t:`Prévenir la cible`,s:`+Humanité · tu trahis le client`,fx:{hum:7,cred:-2,ed:Math.round(pay*.25/50)*50,msg:`Tu choisis ton camp. La cible te glisse quelques billets et disparaît. Le client, lui, s'en souviendra.`}});
    out.push({t:`Refuser`,s:`Pas ton genre de boulot`,fx:{msg:`« Dommage. Je trouverai quelqu'un de moins regardant. »`}});
    return out; },ch:[]});

/* ---------- Offre d'empire (réservée aux chefs et hauts gradés) ---------- */
card({id:`emp_offer`,who:`@fixer`,tag:`📯 Empire · une ouverture`,cond:()=>empireEligible(),w:0,
  tx:()=>{ const c=DIST.filter(d=>G.dist[d.id]!==`player`&&!(d.lock&&!G.flags.dogtown)&&!(G.member&&G.dist[d.id]===G.member)); const d=c[rnd(0,c.length-1)]; G.tmp={d:d.id};
    return `Un informateur te souffle une ouverture : les défenses de <strong>${d.n}</strong> sont dégarnies cette semaine. « Si tu veux y planter ton drapeau, c'est maintenant. »`; },
  ch:[
    {t:`Lancer tes hommes`,s:`CORPS · combat · +40 d'influence`,chk:{a:`body`,k:`cmb`,dc:8,ok:{fn:`empPush`,cred:4,msg:`Tes hommes s'installent avant que quiconque réagisse.`},ko:{hp:-20,cred:-2,msg:`C'était un piège. Vous reculez en désordre.`}}},
    {t:`Acheter les bonnes personnes`,s:`−1 200 €$ · +30 d'influence`,req:R.ed(1200),fx:{ed:-1200,fn:`empBuy`,msg:`Quelques enveloppes, quelques portes qui s'ouvrent.`}},
    {t:`Laisser passer`,s:`Garde tes forces`,fx:{msg:`Tu ne bouges pas. Quelqu'un d'autre en profitera.`}}
  ]});
