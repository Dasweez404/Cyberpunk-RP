/* =====================================================================
   CARTES 4 — faveurs/hostilités des blocs, choix selon l'origine,
   choix « expert » verrouillés par attribut
   ===================================================================== */
const CARD_ = id => CARDS.find(c=>c.id===id);
const ORI = (id,origin,ch) => { const c=CARD_(id); if(c) c.ch.push(Object.assign({only:origin},ch)); };
const EXP = (id,a,v,ch) => { const c=CARD_(id); if(c) c.ch.push(Object.assign({req:R.at(a,v),exp:1,s:`${ATTRS[a].n} ${v}`},ch)); };

/* ---------- Faveurs & hostilités de blocs ---------- */
const BP = {
  rue:{hi:[`La rue te porte`,`Dans chaque barrio, on te salue d'un geste. Les petits gangs t'invitent à leurs tables, les marchands sortent leur meilleur matos pour toi. Mais plus on t'aime, plus on attend de toi.`,`Profiter de l'ambiance`,`Rééquilibrer : trinquer avec la police`],
        lo:[`La rue te tourne le dos`,`Les portes claquent, les marchands te fixent. Le mot circule : « Ne lui vends rien. » Quelqu'un a payé pour qu'on te fasse comprendre que tu n'es plus bienvenu(e).`,`Payer ta paix`,`Prouver ta loyauté`]},
  corpo:{hi:[`Les corpos t'adulent`,`Des invitations arrivent par dizaines : cocktails à Corpo Plaza, dîners avec des VP. On te traite comme un atout. Un atout, ça se possède.`,`Accepter les avantages`,`Garder tes distances`],
         lo:[`Les corpos te surveillent`,`Des drones planent trop souvent près de chez toi. Un compte bloqué, un contrat annulé, un message anonyme : « Nous savons. » Tu n'es plus le bienvenu dans les tours.`,`Racheter leur confiance`,`Brouiller les pistes`]},
  loi:{hi:[`La NCPD te couvre`,`Un agent te fait un signe de tête. Ton dossier a disparu d'une base de données. La police est de ton côté — pour l'instant. La rue, elle, commence à murmurer.`,`Profiter de la protection`,`Se montrer discret(e)`],
       lo:[`La NCPD te traque`,`Une voiture de patrouille ralentit à ta hauteur. Contrôles à répétition, perquisitions « de routine ». On te cherche un motif.`,`Graisser quelques pattes`,`Disparaître pour un temps`]},
  nomad:{hi:[`Les clans t'ouvrent la route`,`Des nomades te saluent sur la route. Un convoi t'offre sa protection, un mécano refuse ton argent. Les Badlands te considèrent comme l'un des leurs.`,`Rouler avec le convoi`,`Rendre une faveur au clan`],
         lo:[`Les routes se ferment`,`Un barrage de nomades te bloque l'accès. Tu n'es plus le bienvenu sur la piste. Le péage est devenu un racket.`,`Payer le péage`,`Forcer le passage`]}
};
Object.keys(BP).forEach(b=>['hi','lo'].forEach(side=>{
  const [tag,tx,a,bb]=BP[b][side], hi=side===`hi`, B=BLOCS[b];
  card({id:`bp_${b}_${side}`,who:`narr`,tag:`⚖ ${B.n} · ${hi?`faveur`:`hostilité`}`,w:7,cd:8,
    cond:()=>hi?(G.bloc[b]>=65&&G.bloc[b]<85):(G.bloc[b]<=35&&G.bloc[b]>15),
    tx,ch:[
      hi?{t:a,s:`Gain · le bloc monte encore`,fx:{ed:900,cred:3,bloc:{[b]:6},msg:`Tu profites de la situation. Les avantages sont réels — et ta liberté, un peu moins.`}}
        :{t:a,s:`−900 €$ · le bloc remonte`,req:R.ed(900),fx:{ed:-900,bloc:{[b]:12},msg:`Quelques billets changent de mains. Les regards se radoucissent.`}},
      hi?{t:bb,s:`Rééquilibre le bloc`,fx:{bloc:{[b]:-10},hum:4,cred:2,msg:`Tu rappelles que tu ne dois rien à personne. Le bloc relâche un peu la pression.`}}
        :{t:bb,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{bloc:{[b]:14},cred:4,msg:`Tu retournes la situation par ton sang-froid.`},ko:{hp:-14,bloc:{[b]:-4},msg:`Ça ne prend pas. Le bloc se braque davantage.`}}}
    ]});
}));

/* ---------- Choix selon l'origine (visibles seulement pour l'origine concernée) ---------- */
ORI(`dex_gig`,`street`,{t:`Prendre les passages que seuls les gamins de ton quartier connaissent`,s:`Street Kid · RÉFLEXES`,chk:{a:`ref`,dc:6,ok:{ed:1400,cred:5,bloc:{rue:4},rel:{dex:6},msg:`Des ruelles, des toits, un escalier de secours. Personne ne t'a vu passer. Dex hoche la tête : « Tu connais la ville. »`},ko:{hp:-12,ed:200,msg:`Une ruelle bloquée, un type en colère. Tu t'en sors, mais le colis est abîmé.`}}});
ORI(`dex_gig`,`corpo`,{t:`Passer avec ton badge corpo, tête haute`,s:`Corpo · SANG-FROID`,chk:{a:`cool`,dc:6,ok:{ed:1400,cred:3,bloc:{corpo:5},msg:`Un sourire et un badge impeccable. Les gardes s'écartent. Tu as livré en costard.`},ko:{ed:300,cred:-1,msg:`Un garde reconnaît ton badge périmé. Tu abandonnes le colis.`}}});
ORI(`dex_gig`,`nomad`,{t:`Prendre la piste du désert avec ton véhicule`,s:`Nomade · RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:6,ok:{ed:1500,cred:5,bloc:{nomad:5},msg:`Tu coupes par la piste que personne ne surveille. Livraison avant l'aube, poussière sur les vitres.`},ko:{hp:-10,ed:300,msg:`Un ensablement. Tu perds du temps, mais pas la cargaison.`}}});
ORI(`courier`,`street`,{t:`Exiger ta part : la rue connaît les prix`,s:`Street Kid`,fx:{ed:700,cred:2,bloc:{rue:3},msg:`Le type ricane, puis paie. Il a compris que tu savais ce que ça valait.`}});
ORI(`courier`,`corpo`,{t:`Reconnaître le sceau : c'est une puce de ta corpo`,s:`Corpo · INTELLECT`,chk:{a:`int`,dc:6,ok:{ed:1600,cred:3,bloc:{corpo:6},msg:`Tu rapportes la puce à ton ancien service. Récompense, discrète mais généreuse.`},ko:{hp:-10,bloc:{corpo:-4},msg:`Mauvaise idée : on te soupçonne d'avoir tout lu.`}}});
ORI(`courier`,`nomad`,{t:`La livrer à un convoi nomade qui la réclame`,s:`Nomade`,fx:{ed:600,cred:3,bloc:{nomad:6,corpo:-3},msg:`Les nomades te remercient d'une poignée de main de sable et de sueur.`}});
ORI(`ncpd_sting`,`street`,{t:`Citer le nom du flic de ton quartier`,s:`Street Kid · SANG-FROID`,chk:{a:`cool`,dc:6,ok:{bloc:{loi:2},cred:2,msg:`« Ah, tu es des quartiers de Marcus ? » Les agents baissent d'un ton.`},ko:{ed:-300,msg:`Ils n'aiment pas les noms qu'on laisse tomber.`}}});
ORI(`ncpd_sting`,`corpo`,{t:`Sortir ta carte d'employé corpo`,s:`Corpo`,fx:{bloc:{loi:3,corpo:2},msg:`Ils regardent le logo, puis ta tenue. « Excusez-nous, monsieur/madame. »`}});
ORI(`ncpd_sting`,`nomad`,{t:`Dire que tu n'es que de passage`,s:`Nomade · SANG-FROID`,chk:{a:`cool`,dc:6,ok:{cred:2,msg:`« Un nomade ? Circulez. » Personne ne veut s'occuper de tes papiers.`},ko:{ed:-250,hp:-8,msg:`Ils te fouillent à la recherche d'une excuse.`}}});
ORI(`barfight`,`street`,{t:`Reconnaître le type : c'est un voisin de ton bloc`,s:`Street Kid`,fx:{cred:3,hum:4,bloc:{rue:3},msg:`« Hé, mais je te connais ! » Tout le bar relâche la pression. Verre offert.`}});
ORI(`barfight`,`nomad`,{t:`Le provoquer en duel de bras de fer, à la nomade`,s:`Nomade · CORPS`,chk:{a:`body`,dc:6,ok:{cred:5,ed:200,msg:`Un bras de fer qui dure une éternité. Tu gagnes sous les applaudissements.`},ko:{hp:-6,cred:1,msg:`Tu perds de peu, mais la foule respecte.`}}});
ORI(`loan_shark`,`corpo`,{t:`Appeler ton ancien employeur pour une avance`,s:`Corpo · SANG-FROID`,chk:{a:`cool`,dc:6,ok:{ed:2200,bloc:{corpo:4},msg:`Un appel, un sourire, un virement. Les corpos paient toujours pour qu'on les oublie.`},ko:{hp:-12,ed:-200,msg:`On te raccroche au nez. Les créanciers n'attendront pas.`}}});
ORI(`loan_shark`,`nomad`,{t:`Proposer un convoi de livraison en échange`,s:`Nomade · RÉFLEXES`,chk:{a:`ref`,k:`drv`,dc:6,ok:{ed:1800,cred:3,msg:`Tu convaincs le créancier : un convoi, c'est du temps contre de l'argent.`},ko:{hp:-14,ed:-300,msg:`Il refuse. Ses gars te passent à tabac.`}}});
ORI(`loan_shark`,`street`,{t:`Négocier avec ceux de ton quartier`,s:`Street Kid · SANG-FROID`,chk:{a:`cool`,dc:6,ok:{ed:1000,cred:3,bloc:{rue:3},msg:`Un cousin, un ami d'un ami. On s'arrange entre voisins.`},ko:{hp:-10,ed:-200,msg:`Le quartier ne t'aide pas cette fois.`}}});
ORI(`malfunction`,`nomad`,{t:`Bidouiller avec les outils de ton camp`,s:`Nomade · TECHNIQUE`,chk:{a:`tech`,dc:5,ok:{xp:{tech:3},cred:2,msg:`Les nomades savent tout réparer. Ton implant reprend vie, mieux qu'avant.`},ko:{hp:-12,msg:`Cette fois, l'outil a glissé.`}}});
ORI(`malfunction`,`corpo`,{t:`Appeler le SAV de ta corpo`,s:`Corpo`,fx:{hp:15,bloc:{corpo:2},msg:`Un technicien débarque en trente minutes. Gratuit. Les corpos prennent soin de leurs actifs.`}});
ORI(`malfunction`,`street`,{t:`Aller voir le ripperdoc du quartier`,s:`Street Kid`,fx:{hp:10,ed:-80,rel:{vik:3},msg:`Il te répare pour presque rien : « Tu es des nôtres. »`}});
ORI(`cyberpsycho_bounty`,`nomad`,{t:`Le piéger avec ton véhicule`,s:`Nomade · RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:8,ok:{ed:2500,cred:8,bloc:{loi:4},msg:`Un dérapage contrôlé, un choc, un silence. Prime encaissée.`},ko:{hp:-30,hum:-3,msg:`Il saute sur ton capot. Tu perds le contrôle.`}}});
ORI(`cyberpsycho_bounty`,`corpo`,{t:`Utiliser tes accès corpo pour le localiser et le piéger`,s:`Corpo · INTELLECT`,chk:{a:`int`,dc:7,ok:{ed:2500,cred:7,bloc:{corpo:4,loi:3},msg:`Une caméra, un pare-feu, un piège parfait. Il ne voit rien venir.`},ko:{hp:-22,msg:`Il casse le dispositif. Tu t'en sors à peine.`}}});
ORI(`scavs`,`nomad`,{t:`Appeler tes frères nomades en renfort`,s:`Nomade`,fx:{cred:6,hum:8,bloc:{nomad:5},msg:`Un klaxon, deux Thorton, des silhouettes dans la poussière. Les Scavs s'enfuient avant d'avoir compris.`}});
ORI(`race`,`nomad`,{t:`Courir avec ton convoi comme second pilote`,s:`Nomade`,fx:{ed:1800,cred:5,bloc:{nomad:4},msg:`Vous remportez la course en duo. Les nomades te considèrent désormais comme un pilote.`}});
ORI(`wakako_escort`,`corpo`,{t:`Négocier avec les Tyger Claws sur leur terrain : les affaires`,s:`Corpo · SANG-FROID`,chk:{a:`cool`,dc:7,ok:{ed:1800,cred:5,fac:{tygers:4},msg:`Un contrat, un pourcentage, une poignée de main. Le client traverse Japantown sans heurt.`},ko:{hp:-12,fac:{tygers:-4},msg:`Les Tyger Claws ne comprennent pas ton langage.`}}});
ORI(`old_friend`,`street`,{t:`Retrouver les gars qui lui doivent de l'argent, ensemble`,s:`Street Kid · SANG-FROID`,chk:{a:`cool`,dc:6,ok:{cred:5,hum:6,bloc:{rue:4},msg:`Vous leur rendez visite en bande. L'ami est tiré d'affaire.`},ko:{hp:-14,msg:`Ça tourne à la bagarre générale.`}}});

/* ---------- Choix « expert » verrouillés par un attribut élevé ---------- */
EXP(`dex_gig`,`ref`,8,{t:`Livrer le colis par les toits sans toucher le sol`,fx:{ed:1900,cred:7,rel:{dex:8},msg:`Un sprint, trois toits, une chute maîtrisée. Dex te regarde, impressionné.`}});
EXP(`courier`,`int`,8,{t:`Décrypter la puce et la revendre au bon acheteur`,fx:{ed:2600,cred:5,role:{fixer:2},msg:`Ce que contenait la puce valait dix fois la livraison. Tu empoches la différence.`}});
EXP(`barfight`,`body`,8,{t:`L'assommer d'un seul coup`,fx:{cred:7,ed:250,msg:`Un seul crochet. Le bar entier s'est tu. Les mercs t'invitent à leur table.`}});
EXP(`padre_barrio`,`cool`,8,{t:`Récupérer l'argent avec les intérêts, sans lever la voix`,fx:{ed:1300,cred:6,fac:{valentinos:8},bloc:{rue:3},msg:`Ils paient. Ils te remercient, même. Padre sourit.`}});
EXP(`cyberpsycho_bounty`,`ref`,9,{t:`L'abattre d'un seul tir, à distance`,fx:{ed:2800,cred:11,hum:-2,bloc:{loi:5},msg:`Un souffle, un tir. Le cyberpsycho s'effondre sans comprendre.`}});
EXP(`regina_theft`,`tech`,8,{t:`Désactiver le traceur et repartir sans bruit`,fx:{ed:2800,cred:6,role:{tech:2},xp:{tech:3},msg:`Le traceur meurt sans un bip. La voiture glisse hors du parking comme un fantôme.`}});
EXP(`wakako_escort`,`cool`,8,{t:`Faire de l'escorte une démonstration de force tranquille`,fx:{ed:2000,cred:7,fac:{tygers:6},msg:`Le client traverse Japantown, un Tyger sur deux te salue. Wakako s'en souviendra.`}});
EXP(`scavs`,`body`,8,{t:`Les écraser sans effort et libérer l'enfant`,fx:{cred:9,hum:10,ed:300,msg:`Trois Scavs au sol avant qu'ils ne comprennent. L'enfant te prend la main sans un mot.`}});
EXP(`ncpd_sting`,`cool`,8,{t:`Les convaincre de t'escorter jusque chez toi`,fx:{cred:4,bloc:{loi:4},msg:`Un sourire, un « bonne soirée, messieurs ». Ils te raccompagnent par politesse.`}});
EXP(`race`,`ref`,8,{t:`Dépasser à contre-sens dans le dernier virage`,fx:{ed:4000,cred:9,msg:`Un dépassement impossible. La foule hurle. Tu viens d'entrer dans la légende de la piste.`}});
EXP(`loan_shark`,`cool`,8,{t:`Retourner le créancier contre son propre patron`,fx:{ed:1600,cred:4,msg:`Quelques mots bien placés, un doute semé. Il te laisse tranquille — et réclame une trêve.`}});
EXP(`malfunction`,`tech`,8,{t:`Réparer et améliorer l'implant`,fx:{xp:{tech:5},cred:2,msg:`Tu tires le meilleur de ton propre corps. L'implant est plus stable qu'à l'achat.`}});
EXP(`old_friend`,`cool`,8,{t:`Régler ses dettes d'un seul appel`,fx:{hum:8,cred:4,msg:`Un nom, un service rendu. En trois phrases, le problème s'évapore.`}});
EXP(`corp_war`,`int`,8,{t:`Infiltrer les deux camps et jouer l'un contre l'autre`,fx:{ed:4800,cred:8,fac:{militech:4,arasaka:4},msg:`Tu vends à Militech ce qu'Arasaka cache, et inversement. Personne ne sait pour qui tu travailles.`}});
EXP(`nr_ice`,`int`,9,{t:`Percer la glace noire comme si elle n'existait pas`,fx:{ed:4600,cred:10,role:{net:3},msg:`Elle fond sous tes doigts. Le serveur s'ouvre comme un coffre mal fermé.`}});
EXP(`hacker_gig`,`int`,9,{t:`Pirater le serveur en un tour de main`,fx:{ed:3600,cred:8,role:{net:2},msg:`Pas un log, pas un écho. Le dossier disparaît comme s'il n'avait jamais existé.`}});
EXP(`edge_job`,`ref`,9,{t:`Danser entre les balles, sans un coup tiré`,fx:{ed:6500,cred:11,role:{solo:2},msg:`Tu traverses l'entrepôt comme une ombre. Les gardes pensent à des fantômes.`}});
EXP(`hum_warn`,`cool`,8,{t:`Reprendre le contrôle par la seule force de ta volonté`,fx:{hum:20,cred:2,msg:`Tu fermes les yeux, tu respires. Les voix se taisent. Tu regardes tes mains : elles sont à toi.`}});
EXP(`bd_snuff`,`int`,8,{t:`Remonter la piste jusqu'au producteur et le dénoncer`,fx:{hum:10,cred:6,rel:{judy:10},fac:{mox:10},msg:`Tu fournis à Judy un dossier béton. Le producteur disparaît des écrans.`}});
EXP(`kerry_concert`,`cool`,8,{t:`Monter sur scène pour un duo improvisé`,fx:{cred:9,hum:6,rel:{kerry:12},role:{rocker:3},msg:`Kerry t'attrape par l'épaule, la foule hurle. Un moment pour toujours.`}});
EXP(`mox_club`,`cool`,8,{t:`Devenir la voix des Mox ce soir`,fx:{cred:6,hum:8,fac:{mox:10},rel:{judy:6},msg:`Un micro, trois phrases, une salle debout. Lizzie sourit.`}});
EXP(`rogue_drink`,`cool`,8,{t:`Lui parler comme à une égale`,fx:{cred:8,rel:{rogue:12},hum:4,msg:`Rogue lève un sourcil, puis te pousse un verre. Tu viens de marquer un point.`}});
