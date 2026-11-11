/* =====================================================================
   CARTES — événements. Utilise les helpers globaux de engine.js
   ===================================================================== */
const R = {
  at:(a,v)=>()=>A(a)>=v?``:`${ATTRS[a].n} ${v}`,
  ed:v=>()=>G.ed>=v?``:`${v} €$`,
  cy:id=>()=>hasCy(id)?``:`Implant : ${CY(id).n}`,
  deck:()=>()=>(hasDeck()||G.flags.basichack)?``:`Hack requis`,
  deckPro:()=>()=>hasDeck()?``:`Cyberdeck requis`,
  flag:(f,msg)=>()=>G.flags[f]?``:msg||`Condition manquante`,
  cred:v=>()=>G.cred>=v?``:`Street Cred ${v}`,
  fac:id=>()=>G.member===id?``:`Membre ${FAC[id].n}`,
  sk:(k,v,msg)=>()=>skill(k)>=v?``:msg,
};
const CARDS = [];
const card = o => { CARDS.push(o); return o; };
const FLOW = `__flow`; // marqueur

/* ============================ INTROS ============================ */
card({id:`st_intro`,who:`narr`,tag:`Street Kid · Prologue`,story:true,at:[2070,0],
  tx:()=>({
    heywood:`<strong>Heywood.</strong> Le barrio sent la friture et l'encens. {n}, à 18 ans, tu connais déjà tous les raccourcis de Wellsprings et le nom de chaque Valentino qui passe devant l'église. Mama Welles te garde un plat chaud au <em>Coyote Cojo</em>, mais l'argent des courses ne suffit plus.`,
    watson:`<strong>Watson.</strong> Entre les néons de Kabuki et le métal rouillé de Northside, {n}, tu as appris à regarder le monde sans qu'il te voie. Un seul loyer à payer, un seul appartement à toi : une cage à lapins de six mètres carrés en haut d'un mégabuilding.`,
    santo:`<strong>Santo Domingo.</strong> Arroyo, murs de béton et drapeaux US fanés. {n}, tu as grandi entre les patrouilles de la 6th Street et les cris des Animals de Rancho Coronado. Ici, on apprend vite à courir… ou à frapper.`
  })[G.sub]||`Night City t'a avalé(e).`,
  ch:[
    {t:`Piquer un sac sur le marché`,s:`REF · risque de bagarre`,chk:{a:`ref`,dc:6,
       ok:{ed:260,cred:2,msg:`Rapide, silencieux. Tu es déjà loin quand le propriétaire hurle.`},
       ko:{hp:-12,cred:-1,msg:`Une poigne de fer te rattrape. Un coup de poing, un peu de sang, ta fierté en miettes.`}}},
    {t:`Chercher du boulot chez les fixers`,s:`SANG-FROID · prudent`,chk:{a:`cool`,dc:5,
       ok:{ed:180,cred:2,role:{fixer:1},next:`st_intro2`,msg:`Tu te fais remarquer par un type qui sait organiser les choses. Un début.`},
       ko:{ed:30,msg:`On te rit au nez. Mais tu repars avec un nom en tête.`,next:`st_intro2`}}},
    {t:`Rester dans l'ombre, économiser`,s:`+ Humanité`,fx:{hum:5,ed:60,msg:`Une soupe de nouilles, une nuit tranquille. Même Night City te laisse respirer, parfois.`}}
  ]});
card({id:`st_intro2`,who:`dex`,tag:`Premier contact`,once:true,
  tx:`Un type en lunettes noires t'observe à l'<em>Afterlife</em>. « T'as le regard de ceux qui n'ont plus peur de grand-chose, gamin. Moi, c'est <strong>Dexter DeShawn</strong>. Je peux te trouver des petits boulots. Rien de sale. Enfin, presque. »`,
  ch:[
    {t:`Accepter ses services`,s:`Contact fixer : Dex`,fx:{flag:[`dex`],rel:{dex:12},cred:3,ed:200,msg:`« Bienvenue dans le jeu. Un conseil : ne te vends jamais, ne t'excuse jamais. »`}},
    {t:`Refuser, tu es indépendant(e)`,s:`SANG-FROID +`,fx:{cred:1,at:{cool:1},msg:`« Fier(e), hein ? Reviens quand tu auras faim. » Il disparaît dans la foule.`}}
  ]});
card({id:`co_intro`,who:`corpo`,tag:`Corpo · Prologue`,story:true,at:[2070,0],
  tx:()=>`<strong>Corpo Plaza.</strong> {n}, premier jour comme stagiaire chez <em>${FAC[G.sub].n}</em>. Costume, badge, sourire. Ton supérieur te file un dossier : « Ici, on n'est pas payés pour penser, mais pour obéir. Mais les ambitieux vont vite. » Il te regarde. « Tu es ambitieux ? »`,
  ch:[
    {t:`Obéir, sourire, monter les échelons`,s:`Salaire stable`,fx:{flag:[`corpjob`],ed:600,cred:1,role:{corpo:2},msg:`Tu apprends le jeu : réunions, rapports, et regards en coin. Un salaire tombe, régulier.`}},
    {t:`Lire le dossier en douce`,s:`INTELLECT · risque`,chk:{a:`int`,dc:6,
       ok:{flag:[`corpjob`,`secret`],ed:300,at:{int:1},role:{corpo:1},next:`co_intro2`,msg:`Tu découvres un transfert illégal vers un compte offshore. Ça peut valoir très cher.`},
       ko:{flag:[`corpjob`],ed:100,cred:-1,msg:`Ton supérieur t'a vu. Un avertissement, et ton nom sur une liste.`}}},
    {t:`Démissionner dès maintenant`,s:`Tu préfères la rue`,fx:{unflag:[`corpjob`],cred:2,at:{cool:1},role:{fixer:1},msg:`Tu rends ton badge. La ville t'attend, froide et vivante.`}}
  ]});
card({id:`co_intro2`,who:`corpo`,tag:`Information sensible`,once:true,
  tx:`Le compte offshore appartient à un cadre de ta division. Il détourne des fonds vers une cellule de mercenaires qui sabote la concurrence. Tu tiens quelque chose de gros entre les mains.`,
  ch:[
    {t:`Le dénoncer en interne`,s:`Rep corpo +`,fx:{ed:900,cred:2,flag:[`corpjob`],role:{corpo:2},msg:`Promu pour ta loyauté. Mais certains te regardent d'un sale œil.`}},
    {t:`Le faire chanter`,s:`COOL · gros gain`,chk:{a:`cool`,dc:7,
       ok:{ed:3000,cred:3,role:{fixer:2},msg:`Il paie sans broncher. Une fois. Puis deux. Tu as un tout nouveau train de vie.`},
       ko:{hp:-30,ed:-300,cred:-2,msg:`Il avait des gars. Deux costards-cravate te cassent les côtes dans un parking.`}}},
    {t:`Vendre l'info à un fixer`,s:`Le monde de l'ombre`,fx:{ed:1200,cred:3,role:{fixer:2},flag:[`dex`],msg:`Dex te sourit. « T'as un instinct pour ça. »`}}
  ]});
card({id:`no_intro`,who:`nomad`,tag:`Nomade · Prologue`,story:true,at:[2070,0],
  tx:()=>`<strong>Badlands.</strong> Le soleil tape sur le toit du convoi. {n}, tu sais piloter avant de savoir lire. Les ${G.sub===`aldecaldos`?`Aldecaldos de Saul Bright`:G.sub===`wraiths`?`Wraiths, durs et rapides`:`routes sans clan`} sont ta famille — ou ta cage. À l'horizon, les tours de Night City scintillent comme une promesse.`,
  ch:[
    {t:`Partir pour Night City, tenter ta chance`,s:`Nouveau départ`,fx:{cred:2,ed:200,flag:[`incity`],role:{nomad:1},msg:`Tu laisses la poussière derrière toi. La ville te happe en moins d'une heure.`}},
    {t:`Rester avec le clan, devenir pilote`,s:`CORPS/RÉFLEXES +`,fx:{at:{ref:1},cred:1,role:{nomad:3},msg:`Un convoi, une réputation. Les anciens te confient les clés des gros Thorton.`,next:`no_intro2`}},
    {t:`Proposer des réparations aux autres convois`,s:`TECHNIQUE +`,fx:{at:{tech:1},ed:250,role:{tech:2},msg:`Tu rends des services. Les moteurs t'aiment. Certains payent bien.`}}
  ]});
card({id:`no_intro2`,who:`panam`,tag:`Convoi sous attaque`,once:true,
  tx:`Les Raffen Shiv surgissent sur la crête, hurlant. Ton convoi est coincé entre deux dunes. Quelqu'un crie ton nom : on a besoin de toi, maintenant.`,
  ch:[
    {t:`Écraser l'accélérateur, forcer le passage`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:7,
      ok:{cred:6,ed:400,role:{nomad:2},msg:`Tu passes à toute allure. Le convoi te suit en hurlant de joie. Tu viens de gagner ta place.`},
      ko:{hp:-25,cred:2,msg:`Tu prends une rafale dans le pare-brise. Le convoi s'en sort, toi pas tout à fait.`}}},
    {t:`Descendre et tirer`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:7,
      ok:{cred:6,ed:300,role:{solo:2},msg:`Un à un, ils tombent. Le sable boit leur sang. On te regarde autrement.`},
      ko:{hp:-30,cred:2,msg:`Tu encaisses plusieurs balles. Un ancien te tire dans un camion en jurant.`}}}
  ]});

/* ============================ FIXERS & BOULOTS ============================ */
card({id:`dex_gig`,who:`@fixer`,tag:`Afterlife · Boulot`,w:7,cond:()=>G.cred>=3,
  tx:`« Un client veut qu'un colis arrive à bon port avant l'aube. Il y a du monde sur le trajet, des gars qui n'aiment pas les inconnus. La paie : <strong>1 200 €$</strong>. Tu en es ? »`,
  ch:[
    {t:`Y aller, plein gaz`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:7,ok:{ed:1200,cred:5,bloc:{rue:3},flag:[`dex`],rel:{dex:6},role:{fixer:1},msg:`Livraison parfaite. Dex hoche la tête : « Pas mal. »`},ko:{hp:-20,ed:300,cred:1,msg:`Une embuscade te coûte du sang et la moitié du pognon.`}}},
    {t:`Passer en douce par les toits`,s:`SANG-FROID · discrétion`,chk:{a:`cool`,k:`stl`,dc:7,ok:{ed:1200,cred:4,at:{cool:1},msg:`Tu traverses Watson comme un fantôme. Le colis arrive sans une égratignure.`},ko:{ed:200,hp:-10,cred:0,msg:`Trop de caméras, trop de gardes. Tu abandonnes le colis.`}}},
    {t:`Refuser poliment`,fx:{cred:0,msg:`« Comme tu veux. Mais les offres comme ça ne reviennent pas souvent. »`}}
  ]});
card({id:`rogue_drink`,who:`rogue`,tag:`Afterlife`,w:5,cond:()=>G.cred>=18&&yr()>=2071,
  tx:`Elle est là, au bout du bar, fière comme une reine. « Les légendes boivent ici, petit(e). Elles ne parlent pas de leurs exploits : elles les laissent parler. Tu as déjà quelque chose à raconter ? »`,
  ch:[
    {t:`Lui raconter ton dernier run`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{cred:8,hum:3,rel:{rogue:10},msg:`Rogue sourit à demi. « Pas mal. Tu auras un verre à ton nom, si tu survis. »`},ko:{cred:-2,msg:`Elle bâille. « Reviens quand tu auras vraiment quelque chose à dire. »`}}},
    {t:`Lui offrir un verre`,s:`−200 €$`,req:R.ed(200),fx:{ed:-200,cred:3,hum:2,rel:{rogue:8},msg:`Un silence complice. Rogue t'ouvre une porte discrète sur son monde.`}},
    {t:`Passer ton chemin`,fx:{msg:`Tu laisses la reine de l'Afterlife à ses pensées.`}}
  ]});
card({id:`wakako_escort`,who:`wakako`,tag:`Japantown · Boulot`,w:5,cond:()=>G.cred>=8,
  tx:`« Un client de Charter Hill veut traverser Japantown sans que les Tyger Claws lui sautent dessus. Escorte-le jusqu'au bout de Westbrook, intact. <strong>1 500 €$</strong> si tu y arrives. »`,
  ch:[
    {t:`Escorter en voiture`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:8,ok:{rel:{wakako:8},ed:1500,cred:5,fac:{tygers:-3},msg:`Le client est livré sans une rayure. Wakako te remercie d'un geste sec.`},ko:{hp:-22,ed:200,cred:1,fac:{tygers:-8},msg:`Les Tyger Claws vous coincent à un carrefour. Tu t'en sors, pas le client.`}}},
    {t:`Négocier avec les Tyger Claws`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{rel:{wakako:8},ed:1500,cred:6,fac:{tygers:6},msg:`Tu parles avec le lieutenant. On vous laisse passer. Wakako lève un sourcil, impressionnée.`},ko:{hp:-15,ed:0,cred:-1,fac:{tygers:-6},msg:`« Vous n'avez rien à faire sur notre territoire ! » Un coup de crosse pour t'apprendre le respect.`}}},
    {t:`Décliner`,fx:{}}
  ]});
card({id:`regina_theft`,who:`regina`,tag:`Vol de véhicule`,w:5,cond:()=>G.cred>=6,
  tx:`« Une Rayfield sur le parking du Corpo Plaza. Mon client la veut, avec moteur, sans traceur. Tu as une heure avant que la sécurité ne passe. »`,
  ch:[
    {t:`Hacker le véhicule`,s:`Cyberdeck + INT`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:7,ok:{rel:{regina:8},ed:1800,cred:5,role:{net:1},msg:`Les verrous cèdent. La voiture ronronne. Regina applaudit.`},ko:{hp:-12,ed:0,msg:`L'alarme s'emballe. Tu fuis à pied, humilié(e).`}}},
    {t:`Crocheter à l'ancienne`,s:`TECHNIQUE`,chk:{a:`tech`,dc:7,ok:{rel:{regina:8},ed:1800,cred:4,role:{tech:1},msg:`Un clic, un fil, une étincelle. Le moteur démarre. Tu es déjà loin.`},ko:{hp:-14,cred:-1,msg:`La sécurité te tombe dessus. Tu fuis avec une dent en moins.`}}},
    {t:`Passer`,fx:{}}
  ]});
card({id:`padre_barrio`,who:`padre`,tag:`Heywood · Boulot`,w:4,cond:()=>G.cred>=5,
  tx:`« Mon neveu a des ennuis avec un petit gang de 6th Street. Il ne veut pas la guerre, juste récupérer ce qu'on lui doit : <strong>800 €$</strong>. Tu peux faire ça gentiment, ou pas. »`,
  ch:[
    {t:`Discuter avec eux`,s:`SANG-FROID`,chk:{a:`cool`,dc:6,ok:{rel:{padre:8},ed:800,cred:4,fac:{valentinos:5},msg:`La dette est payée, tout le monde garde ses dents. Padre te serre la main.`},ko:{hp:-12,ed:100,msg:`« Dégage ! » Ils te jettent hors du quartier. Tu repars sans un sou.`}}},
    {t:`Frapper d'abord`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:7,ok:{rel:{padre:8},ed:800,cred:6,fac:{valentinos:3,sixth:-6},msg:`Le message est reçu, fort et clair. La dette est payée avec les intérêts.`},ko:{hp:-22,cred:1,fac:{sixth:-6},msg:`Ils sont plus nombreux que prévu. Tu t'enfuis, humilié(e).`}}},
    {t:`Refuser`,fx:{}}
  ]});
card({id:`courier`,who:`fix`,tag:`Livraison`,w:6,
  tx:`Un inconnu te glisse une puce dans la main. « Zone nord, un type en manteau rouge, il te donnera 400 balles. Ne pose pas de questions. »`,
  ch:[
    {t:`Livrer sans regarder`,fx:{ed:400,cred:1,msg:`Rien ne va de travers. C'est presque trop facile.`}},
    {t:`Lire la puce avant`,s:`INTELLECT`,chk:{a:`int`,dc:6,ok:{ed:900,cred:2,role:{fixer:1},msg:`Des plans d'entrepôt Militech. Tu revends l'info à un fixer au passage. Quel flair !`},ko:{hp:-15,msg:`Piégée. Un virus grille ton implant de lecture et te donne une migraine d'enfer.`}}},
    {t:`Jeter la puce`,fx:{hum:2}}
  ]});
card({id:`cyberpsycho_bounty`,who:`ncpd`,tag:`Cyberpsycho Sighting`,w:5,cond:()=>G.cred>=10&&(skill(`cmb`)>=1||A(`ref`)>=6||G.member===`ncpd`),
  tx:`L'alerte clignote sur ta puce. Un ancien ouvrier d'Arasaka, trop de chrome, plus assez d'humain, retranché dans une station-service. Prime : <strong>2 500 €$</strong>. NCPD ne se déplace pas avant l'aube.`,
  ch:[
    {t:`L'affronter de face`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:9,ok:{ed:2500,cred:8,hum:-5,bloc:{loi:6},role:{solo:2},msg:`Un duel brutal. Tu gagnes, mais son regard vide te hante. Ça aurait pu être toi.`},ko:{hp:-40,cred:1,hum:-3,msg:`Ses bras te broient les côtes. Tu t'enfuis à moitié mort(e).`}}},
    {t:`Le piéger avec un hack`,s:`Deck + INT`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:8,ok:{ed:2500,cred:8,role:{net:2},msg:`Overheat, Short Circuit, puis un dernier mot. Le cyberpsycho s'effondre, silencieux.`},ko:{hp:-30,hum:-2,msg:`Son implant bloque ton intrusion. Il te charge.`}}},
    {t:`Appeler le MaxTac et partir`,s:`Prudent`,fx:{cred:1,hum:2,ed:200,msg:`Tu laisses faire les pros. Une petite prime de signalement te revient.`}}
  ]});
card({id:`bd_snuff`,who:`judy`,tag:`Braindance`,w:4,cond:()=>G.cred>=6,
  tx:`Un client de Clouds veut du contenu « premium » : une BD snuff, des sensations fortes. Un type te propose <strong>4 000 €$</strong> pour la fournir. Judy est furieuse quand elle l'apprend.`,
  ch:[
    {t:`Fournir la BD`,s:`−Humanité`,fx:{ed:4000,hum:-15,cred:-2,fac:{mox:-12},msg:`L'argent pèse lourd. Tes mains tremblent chaque fois que tu les regardes.`}},
    {t:`Détruire l'enregistrement`,s:`+Humanité`,fx:{hum:8,cred:3,fac:{mox:8},rel:{judy:8},msg:`Judy te regarde longtemps. « Merci. »`}},
    {t:`Prévenir les Mox`,fx:{hum:5,cred:2,fac:{mox:12},flag:[`judy`],rel:{judy:12},msg:`Les Mox s'occupent de lui. Tu viens de gagner des amis fidèles.`}}
  ]});
card({id:`viktor_deal`,who:`vik`,tag:`Clinique de Vik · Little China`,w:4,once:true,cond:()=>G.cred>=4,
  tx:`« Tu as une tête de gamin qui s'est déjà fait casser. Je fais des prix pour ceux qui reviennent vivants. Mais pas d'imprudence : le chrome, ça se paie… en humanité. »`,
  ch:[
    {t:`Accepter la tarification Vik`,s:`−15 % chez les ripperdocs`,fx:{flag:[`vik`],rel:{vik:12},cred:2,hum:2,msg:`« Passe quand tu veux. Et ne triche pas avec ton corps. »`}},
    {t:`Faire réparer un vieux souvenir`,s:`Soin gratuit +25`,fx:{hp:25,hum:3,flag:[`vik`],rel:{vik:14},msg:`Il recoud ton épaule en silence. « Prends soin de toi. »`}}
  ]});
card({id:`misty_reading`,who:`misty`,tag:`Esoterica · Tarot`,w:4,
  tx:`Une boutique de cristaux, d'encens et de cartes. Misty bat son jeu : « La Mort n'est jamais loin, mais ce n'est pas toujours une fin. Veux-tu que je lise ton avenir ? »`,
  ch:[
    {t:`Tirer les cartes`,s:`−100 €$ · Humanité +`,req:R.ed(100),fx:{ed:-100,hum:12,rel:{misty:12},msg:`Un moment étrange de paix. « Tu as encore de la lumière en toi, » dit-elle.`}},
    {t:`Discuter autour d'un thé`,s:`+Humanité`,fx:{hum:7,cred:1,rel:{misty:8},msg:`Elle te raconte son enfance à Night City. Tu repars apaisé(e).`}},
    {t:`Passer ton chemin`,fx:{}}
  ]});
card({id:`fingers_deal`,who:`fingers`,tag:`Ripperdoc · Discount`,w:3,cond:()=>G.cred>=10&&!hasDeckBlock(),
  tx:`Une clinique louche, des seringues à moitié vides. Fingers t'accueille avec un sourire tordu. « Un implant bon marché ? Je te fais une réduction de moitié. Quand ça marche, c'est comme neuf. Quand ça rate… eh bien, je n'ai jamais perdu de patient, jamais. »`,
  ch:[
    {t:`Tenter l'opération pas chère`,s:`Pari risqué`,chk:{a:`cool`,dc:6,ok:{hum:-3,ed:-200,at:{ref:1},msg:`Ça brûle, mais c'est fait. Une fine couche de chrome te donne des réflexes affûtés.`},ko:{hp:-30,hum:-8,ed:-200,msg:`Quelque chose a mal tourné. Tu t'évanouis, tu te réveilles avec un tremblement permanent.`}}},
    {t:`Décliner poliment`,fx:{}}
  ]});
function hasDeckBlock(){return false}
card({id:`delamain`,who:`delamain`,tag:`Taxi Delamain`,w:3,cond:()=>G.ed>=100&&!G.flags.delamain,
  tx:`« Bonsoir. Je suis Delamain, votre chauffeur intelligent. La sécurité de votre voyage est ma priorité absolue. Votre destination ? » Une voix polie, presque trop humaine pour une IA de taxi.`,
  ch:[
    {t:`Discuter avec l'IA`,s:`+Humanité`,fx:{hum:4,flag:[`delamain`],rel:{delamain:12},ed:-40,msg:`Delamain philosophe sur la solitude des flottes autonomes. Il te dépose avec un « À très bientôt ».`}},
    {t:`Lui demander de rouler vite`,s:`−60 €$`,fx:{ed:-60,cred:1,msg:`Il ralentit finalement : « Pour votre sécurité, je maintiens la limite. »`}},
    {t:`Descendre`,fx:{}}
  ]});
card({id:`trauma_sub`,who:`doc`,tag:`Trauma Team`,w:4,once:true,cond:()=>G.ed>=1500&&G.cred>=8,
  tx:`Un représentant de <em>Trauma Team International</em> t'aborde : « Un abonnement Platinum, et si vous tombez, une équipe blindée vous récupère en hélico : une <strong>seconde vie</strong>. Sans abonnement, on vient quand même, mais la facture est de 3 000 €$. Seule exception : MaxTac. Si MaxTac tire, personne ne vient. Abonnement : <strong>1 200 €$</strong>. »`,
  ch:[
    {t:`Souscrire à l'abonnement`,s:`Une seconde chance en cas de mort`,req:R.ed(1200),fx:{ed:-1200,flag:[`trauma`],msg:`Contrat signé. Tu portes maintenant une puce de géolocalisation médicale.`}},
    {t:`Refuser, je compte sur mes réflexes`,fx:{cred:1}}
  ]});
card({id:`mox_club`,who:`lizzie`,tag:`Lizzie's Bar · Kabuki`,w:4,
  tx:`Néons roses et basses profondes. Lizzie t'accueille au club : « Ici, on s'entraide, on se protège, et personne n'aime les profiteurs. Tu bois, tu danses… ou tu veux nous aider pour un souci ? »`,
  ch:[
    {t:`Danser jusqu'à l'aube`,s:`+Humanité`,fx:{hum:9,ed:-80,msg:`Les basses font vibrer ton implant. Pendant une heure, tu oublies la ville.`}},
    {t:`Proposer ton aide`,s:`SANG-FROID`,chk:{a:`cool`,dc:6,ok:{cred:5,fac:{mox:10},hum:3,msg:`Tu règles un souci de harcèlement avec tact. Lizzie te serre dans ses bras.`},ko:{cred:1,fac:{mox:2},msg:`Tu fais une gaffe. Mais l'intention compte.`}}},
    {t:`Repartir`,fx:{}}
  ]});
card({id:`maelstrom_raid`,who:`royce`,tag:`Maelstrom`,w:3,cond:()=>G.cred>=10&&!G.member,
  tx:`Une camionnette tourne au coin d'un entrepôt de Northside. Des hommes bardés de chrome ricanent : « Hé, toi. Viens voir. On fait une petite fête, tu as de l'argent, du chrome ou de la rage ? »`,
  ch:[
    {t:`Entrer dans la danse`,s:`Rejoindre le chaos`,fx:{hum:-10,cred:4,ed:600,fac:{maelstrom:12},role:{solo:1},msg:`Cris, étincelles, lames. Le chrome est une drogue qui chante.`}},
    {t:`Sortir en courant`,s:`RÉFLEXES`,chk:{a:`ref`,dc:6,ok:{hum:1,msg:`Tu échappes au piège de justesse.`},ko:{hp:-15,ed:-100,msg:`Ils te rattrapent, te fouillent, te laissent dans le caniveau.`}}}
  ]});
card({id:`barfight`,who:`narr`,tag:`Afterlife · Bagarre`,w:4,
  tx:`Un mercenaire ivre te bouscule. « Tu regardes quoi ? » Tout le bar s'est tu. Sous les néons, un cercle de curieux se forme.`,
  ch:[
    {t:`Le défier au poing`,s:`CORPS`,chk:{a:`body`,dc:6,ok:{cred:4,ed:150,msg:`Un coup, deux coups, il s'effondre. Les mercs te saluent d'un hochement de tête.`},ko:{hp:-18,cred:-1,msg:`Il frappe plus fort que prévu. Tu sors du bar avec un œil au beurre noir.`}}},
    {t:`Désamorcer avec une blague`,s:`SANG-FROID`,chk:{a:`cool`,dc:6,ok:{cred:3,hum:2,msg:`Tout le bar rit. Il te paie un verre. Tu viens de gagner un allié.`},ko:{cred:-2,msg:`Personne ne rit. Il t'écarte d'un coup d'épaule.`}}},
    {t:`Partir sans bruit`,fx:{}}
  ]});
card({id:`race`,who:`regina`,tag:`Course illégale`,w:3,cond:()=>skill(`drv`)>=1||A(`ref`)>=7,
  tx:`Une course sur la route des Badlands, mise : <strong>1 500 €$</strong>. Les gagnants repartent avec le tout, les perdants avec les dents cassées.`,
  ch:[
    {t:`Participer`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:8,ok:{ed:3000,cred:7,msg:`Tu coupes la ligne en premier, hurlant de joie. La route est à toi.`},ko:{hp:-28,ed:-400,cred:-1,msg:`Dérapage dans un virage. Tu finis dans un fossé, la voiture en feu.`}}},
    {t:`Parier sur un autre`,s:`−300 €$`,req:R.ed(300),chk:{a:`cool`,dc:5,ok:{ed:600,msg:`Ton favori gagne. Les gains te rendent le sourire.`},ko:{ed:-300,msg:`Tu perds tout. Le favori a crevé à mi-course.`}}},
    {t:`Regarder depuis le bord`,fx:{hum:2}}
  ]});
card({id:`scavs`,who:`scav`,tag:`Scavs`,w:3,
  tx:`Des charognards fouillent un corps au bord de la route : bistouris, glacière, seringues. Un enfant te regarde, immobile, au milieu de leur camionnette. Les Scavs revendent les organes aux ripperdocs sans scrupule.`,
  ch:[
    {t:`Les attaquer pour libérer l'enfant`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:8,ok:{cred:8,hum:10,ed:200,msg:`Tu les mets en déroute. L'enfant te murmure un merci que tu n'oublieras jamais.`},ko:{hp:-32,cred:1,hum:3,msg:`Ils te frappent à terre mais l'enfant s'enfuit grâce à toi.`}}},
    {t:`Fermer les yeux et partir`,s:`−Humanité`,fx:{hum:-9,msg:`Tu marches sans te retourner. Mais l'image ne te quittera plus.`}},
    {t:`Les payer pour qu'ils le relâchent`,s:`−500 €$`,req:R.ed(500),fx:{ed:-500,hum:7,cred:2,msg:`Pour eux, un enfant est une marchandise. Pour toi, une dette réglée.`}}
  ]});
card({id:`malfunction`,who:`narr`,tag:`Panne de chrome`,w:4,cond:()=>G.cyber.length>=1,
  tx:`Ton implant se bloque en pleine rue. Un grésillement sous la peau, une douleur électrique dans la nuque. Les cyberwares cheap sont souvent fragiles.`,
  ch:[
    {t:`Courir chez un ripperdoc`,s:`−250 €$`,req:R.ed(250),fx:{ed:-250,hp:15,msg:`Quelques coups de tournevis, un recalibrage, et tout redémarre.`}},
    {t:`Le réparer toi-même`,s:`TECHNIQUE`,chk:{a:`tech`,dc:6,ok:{at:{tech:1},msg:`Un fil ici, une soudure là. Tu comprends mieux ton propre corps.`},ko:{hp:-22,hum:-4,msg:`Mauvaise connexion. Tu pleures de douleur un long moment.`}}},
    {t:`Serrer les dents`,s:`CORPS`,chk:{a:`body`,dc:5,ok:{cred:1,msg:`Ça passe. À force d'insister, tu te sens presque invincible.`},ko:{hp:-16,hum:-3,msg:`La douleur persiste des heures.`}}}
  ]});
card({id:`ncpd_sting`,who:`ncpd`,tag:`NCPD · Contrôle`,w:3,cond:()=>G.cred>=10&&G.member!==`ncpd`,
  tx:`Une patrouille NCPD te coince : « Papiers. Ces implants, ils sont déclarés ? » Dans le monde de Night City, la police a ses prix et tu le sais.`,
  ch:[
    {t:`Graisser la patte`,s:`−400 €$`,req:R.ed(400),fx:{ed:-400,bloc:{loi:-5},msg:`« Bonne soirée, citoyen. » Sans bruit, ils s'effacent.`}},
    {t:`Argumenter`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{cred:2,msg:`Tu connais tes droits. Les agents hésitent et te laissent partir.`},ko:{hp:-12,ed:-150,cred:-1,msg:`Ils n'aiment pas les petits malins. Tu passes la nuit en cellule.`}}},
    {t:`Fuir`,s:`RÉFLEXES`,chk:{a:`ref`,dc:7,ok:{cred:2,msg:`Tu files dans un cul-de-sac, escalades, disparais.`},ko:{hp:-20,ed:-200,msg:`Un taser dans le dos. Ça fait mal.`}}}
  ]});
card({id:`partner`,who:`lover`,tag:`Rencontre`,w:3,once:true,cond:()=>G.age>=22&&G.hum>=40,
  tx:`Au détour d'un noodle stand sous la pluie, quelqu'un te prête son parapluie. Un sourire fatigué, un regard sans fard, une conversation sans mensonge. Dans cette ville, c'est rare.`,
  ch:[
    {t:`Passer la soirée ensemble`,s:`+Humanité · Lien`,fx:{hum:14,ed:-60,flag:[`partner`],msg:`Vous parlez pendant des heures. Pour la première fois depuis longtemps, tu ris sans arrière-pensée.`}},
    {t:`Poursuivre ta route`,s:`Rester seul(e)`,fx:{cred:1,msg:`Tu salues d'un geste vague. Tu ne reverras peut-être jamais cette personne.`}}
  ]});
card({id:`old_friend`,who:`fix`,tag:`Un vieil ami`,w:3,cond:()=>G.age>=24,
  tx:`Un ami d'enfance te rattrape, couvert de dettes. « Je suis dans la merde. 1 500 balles, ou les gars me coupent un doigt. T'es la seule personne en qui j'ai confiance. »`,
  ch:[
    {t:`Lui donner l'argent`,s:`−1 500 €$`,req:R.ed(1500),fx:{ed:-1500,hum:10,cred:2,msg:`Il pleure presque de gratitude. Cet argent te reviendra peut-être un jour.`}},
    {t:`Régler ses dettes à ta façon`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:7,ok:{cred:6,hum:5,msg:`Tu discutes avec ses créanciers. Ils comprennent vite.`},ko:{hp:-25,msg:`Trop nombreux. Il est quand même sauvé, mais tu paies de ta peau.`}}},
    {t:`L'abandonner`,s:`−Humanité`,fx:{hum:-9,msg:`Tu détournes le regard. Il n'a plus de mots. Toi non plus.`}}
  ]});
card({id:`jackie`,who:`jackie`,tag:`El Coyote Cojo`,w:4,cond:()=>yr()>=2072&&yr()<=2076,
  tx:`Un grand gaillard rieur t'attrape par l'épaule : « Jackie Welles ! Heywood, quoi ! Tu viens manger chez ma mère ? Elle fait le meilleur mole du quartier. » Dans son sourire, il n'y a rien de faux.`,
  ch:[
    {t:`Dîner chez Mama Welles`,s:`+Humanité`,fx:{hum:10,ed:-40,fac:{valentinos:4},flag:[`jackie`],rel:{jackie:12,mama:8},msg:`Mama Welles remplit ton assiette, te demande si tu manges assez. Tu te sens chez toi.`}},
    {t:`Boire un verre avec lui`,fx:{hum:5,cred:2,rel:{jackie:8},msg:`Un bar enfumé, des histoires de braquages ratés. Jackie rêve d'un grand coup, d'une vie meilleure.`}},
    {t:`Décliner`,fx:{}}
  ]});
card({id:`sasquatch`,who:`sas`,tag:`Rancho Coronado · Combat`,w:3,cond:()=>A(`body`)>=5,
  tx:`Les Animals t'invitent à leur salle de sport clandestine. Un combat à mains nues : <strong>2 000 €$</strong> au vainqueur. Sasquatch observe, impassible, les bras croisés.`,
  ch:[
    {t:`Monter sur le ring`,s:`CORPS`,chk:{a:`body`,dc:8,ok:{ed:2000,cred:6,fac:{animals:10},msg:`Un crochet à la mâchoire, le géant s'écroule. La salle explose. Sasquatch hoche la tête.`},ko:{hp:-30,cred:1,msg:`Tu te fais broyer. Mais tu as tenu trois rounds : respect.`}}},
    {t:`Observer`,fx:{}}
  ]});
card({id:`kerry_concert`,who:`kerry`,tag:`Concert de Kerry Eurodyne`,w:3,cond:()=>yr()>=2072,
  tx:`Kerry Eurodyne remplit une salle de Westbrook. Entre deux accords, il crie : « Samurai, c'était nous ! Ne laissons personne décider de nos vies ! » Le public hurle. Quelqu'un te tend un pass backstage.`,
  ch:[
    {t:`Aller backstage`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{cred:6,hum:4,role:{rocker:2},flag:[`kerry`],rel:{kerry:14},msg:`Tu discutes avec la légende. Il te donne un médiator signé.`},ko:{cred:1,msg:`Les gardes te refusent l'entrée. Mais la musique te reste.`}}},
    {t:`Rester dans le public`,s:`+Humanité`,fx:{hum:8,msg:`Le son fait vibrer ta poitrine. Tu pleures sans savoir pourquoi.`}}
  ]});
card({id:`johnny_graffiti`,who:`johnny`,tag:`Légende Samurai`,w:3,cond:()=>yr()>=2070,
  tx:`Sur un mur de Kabuki, un graffiti : <em>"SAMURAI — NEVER FADE AWAY"</em>. Les anciens parlent du concert de 2023, de la bombe sur la Tour Arasaka, de Johnny Silverhand, mort ou disparu, personne ne sait vraiment.`,
  ch:[
    {t:`Peindre une étoile à côté`,s:`+Street Cred · Arasaka rancune`,fx:{cred:3,hum:4,fac:{arasaka:-8},msg:`Un geste simple, un clin d'œil à l'histoire. Les vieux te saluent en passant.`}},
    {t:`Ignorer. Les héros, ça n'existe pas.`,fx:{msg:`Tu passes ton chemin. Night City n'a pas besoin de martyrs.`}},
    {t:`Prendre une photo pour les nostalgiques`,fx:{ed:60,cred:1}}
  ]});

/* ============================ HISTOIRE (dates) ============================ */
card({id:`maine_crew`,who:`maine`,tag:`2076 · Edgerunners`,story:true,at:[2076,0],
  tx:`À l'Afterlife, une table bruyante : <strong>Maine</strong> et sa crew — David, Lucy, Rebecca, Pilar, Kiwi, Dorio, Falco. Maine te tape l'épaule : « T'as une tête de gars qui connaît les boulots à haut risque. Un coup gros comme un immeuble. Une place libre, ça t'intéresse ? »`,
  ch:[
    {t:`Rejoindre la crew pour un run`,s:`Risque très élevé · Gain énorme`,fx:{flag:[`maine`],cred:8,ed:3500,role:{solo:3},next:`maine_fall`,msg:`Tu serres la main de Maine, tu croises le regard de David. Le coup est lancé.`}},
    {t:`Refuser, les gros coups finissent mal`,s:`Prudence`,fx:{cred:2,hum:3,msg:`« Comme tu veux. Mais tu vas rater quelque chose, choom. »`}},
    {t:`Demander à voir David`,s:`Lucy et David`,fx:{hum:5,cred:3,msg:`David est jeune, tendu, avec un sourire timide. Lucy t'observe comme si elle voyait déjà ton avenir.`}}
  ]});
card({id:`maine_fall`,who:`smasher`,tag:`2076 · Adam Smasher`,once:true,
  tx:`Le braquage de la Tour Arasaka dérape. Les alarmes hurlent, les portes se ferment. Derrière le feu, une silhouette titanesque : <strong>Adam Smasher</strong>, cyborg intégral d'Arasaka. Maine est à terre, Dorio hurle, Falco n'est plus un nom. David te crie de fuir.`,
  ch:[
    {t:`Courir, ne pas se retourner`,s:`RÉFLEXES · fuite`,chk:{a:`ref`,dc:9,ok:{cred:12,hum:-8,ed:1000,msg:`Tu cours dans la fumée. Derrière toi, les cris. Tu survis. Peu d'autres y arrivent.`},ko:{hp:-60,hum:-10,cred:4,msg:`Une balle, puis une autre. Tu survives par miracle, mais tu portes cette nuit dans ta chair.`}}},
    {t:`Couvrir la fuite de David`,s:`Sacrifice · peut être fatal`,chk:{a:`body`,k:`cmb`,dc:10,ok:{cred:20,hum:6,msg:`Tu retiens Smasher assez longtemps pour que David et Lucy disparaissent. On parlera de toi à l'Afterlife pendant des années.`},ko:{hp:-80,cred:25,hum:-6,msg:`Smasher te saisit et te brise comme une poupée. Tu as tenu assez longtemps pour que David et Lucy disparaissent. Tu t'en sors à peine.`}}},
    {t:`Hacker les portes pour tous`,s:`Cyberdeck · INT`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:9,ok:{cred:15,role:{net:3},msg:`Les portes s'ouvrent, l'équipe s'échappe. Tu viens de sauver des vies.`},ko:{hp:-45,hum:-8,msg:`Le pare-feu d'Arasaka te grille la nuque. Tu t'en sors de justesse.`}}}
  ]});
card({id:`konpeki_rumor`,who:`dex`,tag:`2077 · Konpeki Plaza`,story:true,at:[2077,2],
  tx:`À l'Afterlife, tout le monde parle d'un coup monstre à la <em>Konpeki Plaza</em>. Dex a engagé une jeune merc, <strong>V</strong>, et Jackie Welles pour braquer l'hôtel d'Arasaka pendant que Saburo y est invité. Dex te regarde : « J'ai besoin de quelqu'un en couverture. Pas dans l'équipe principale, mais assez près. »`,
  ch:[
    {t:`Accepter de faire la couverture`,s:`Risque · gros gain`,chk:{a:`cool`,dc:8,ok:{ed:3000,cred:10,flag:[`konpeki`],msg:`Tu surveilles la rue pendant que la tour brûle d'un autre feu. Plus tard, tu apprends que le coup a mal tourné.`},ko:{hp:-30,cred:3,msg:`La sécurité Arasaka te repère. Tu t'enfuis, blessé(e), sans pouvoir aider personne.`}}},
    {t:`Refuser, trop dangereux`,fx:{cred:1,hum:3,msg:`« Sage. Parfois, la vie vaut plus qu'une légende. »`}}
  ]});
card({id:`saburo`,who:`narr`,tag:`2077 · Saburo Arasaka`,story:true,at:[2077,4],
  tx:`Les écrans de Night City s'illuminent : <em>Saburo Arasaka est mort.</em> La rumeur parle d'un assassinat à la Konpeki Plaza. Arasaka vacille, Militech jubile, Hanako Arasaka prend la scène. Les rues bruissent.`,
  ch:[
    {t:`Profiter du chaos pour piller un entrepôt`,s:`Risqué`,chk:{a:`ref`,dc:8,ok:{ed:2500,cred:6,hum:-3,msg:`Une camionnette entière d'armes de contrebande. Tu es riche, d'un coup.`},ko:{hp:-24,cred:0,msg:`Les gardes sont encore là. Tu t'en sors à peine.`}}},
    {t:`Vendre l'info aux fixers`,s:`INTELLECT`,chk:{a:`int`,dc:7,ok:{ed:1800,cred:5,role:{fixer:2},msg:`Dex et Wakako s'arrachent tes infos. Tu mets les pieds dans un jeu énorme.`},ko:{ed:200,msg:`Trop d'infos circulent. La tienne ne vaut plus rien.`}}},
    {t:`Observer et attendre`,fx:{hum:2,cred:1}}
  ]});
card({id:`arasaka_assault`,who:`takemura`,tag:`2077 · Tour Arasaka`,story:true,at:[2077,7],
  tx:`Alerte rouge sur tous les réseaux : un assaut sur la <strong>Tour Arasaka</strong>. Des mercenaires, des nomades, des anciens, tous visent le même cœur. Les Aldecaldos, dit-on, forment un convoi. Rogue est de la partie. Des rumeurs parlent de Johnny Silverhand, de Soulkiller, du Blackwall. Tu as le choix.`,
  ch:[
    {t:`Rejoindre l'assaut`,s:`Risque extrême`,chk:{a:`body`,k:`cmb`,dc:10,ok:{cred:22,ed:4000,hum:-6,role:{solo:3},flag:[`assault`],msg:`Dans la fumée des tours, tu te bats à côté des légendes. Quand la poussière retombe, tu es toujours debout.`},ko:{hp:-70,cred:8,hum:-6,msg:`Tu survis à un enfer. Beaucoup tombent à tes côtés. Tu t'en sors, couvert(e) de sang.`}}},
    {t:`Aider à distance, en piratant`,s:`Cyberdeck · INT`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:9,ok:{cred:20,ed:3000,role:{net:3},flag:[`assault`],msg:`Tu perces les caméras, ouvres les portes. Quelqu'un te remercie dans un canal chiffré.`},ko:{hp:-25,hum:-6,msg:`Les défenses d'Arasaka te mordent la nuque. Tu coupes la liaison, hagard(e).`}}},
    {t:`Rester à l'écart, observer de loin`,s:`Prudent`,fx:{cred:2,hum:3,msg:`Tu regardes la fumée monter sur Night City. Une époque se termine, tu le sens.`}}
  ]});
card({id:`afterwar`,who:`hanako`,tag:`2078 · Après la tempête`,story:true,at:[2078,0],
  tx:`Un an plus tard, Night City panse ses plaies. La Tour Arasaka est un chantier, Militech et NUSA se partagent les juteux contrats de reconstruction. Les gangs repoussent les frontières. La rue appelle toujours son lot de nouveaux visages.`,
  ch:[
    {t:`Profiter du vide pour s'enrichir`,s:`Gros gain`,fx:{ed:2000,cred:3,msg:`Tu te places entre les entrepreneurs et les gangs. Rien d'illégal… ou presque.`}},
    {t:`Poursuivre ta propre route`,fx:{cred:2,hum:3}},
    {t:`Chercher des vieux amis`,fx:{hum:6,msg:`Certains ont disparu, d'autres sont devenus des rumeurs. Quelques-uns te sourient quand même.`}}
  ]});
card({id:`dogtown`,who:`hansen`,tag:`Dogtown · Barghest`,story:true,at:[2077,10],
  tx:`Dogtown, au fond de Pacifica : l'ancien complexe militaire est devenu un état dans l'état. Le colonel <strong>Kurt Hansen</strong> et ses Barghest tiennent les remparts. La NUSA a besoin de ses mercenaires, et lui a besoin d'opérateurs capables.`,
  ch:[
    {t:`Entrer à Dogtown, tenter ta chance`,s:`Débloque Dogtown`,chk:{a:`cool`,dc:8,ok:{flag:[`dogtown`],cred:6,ed:1500,msg:`Les Barghest te laissent passer. Le quartier te fascine : ruines, néons, et un silence qui pèse.`},ko:{hp:-20,cred:1,msg:`On t'écarte à coups de crosse. Mais l'idée de Dogtown continue de te hanter.`}}},
    {t:`Rester à Night City`,fx:{}}
  ]});

/* ============================ ÉTATS CRITIQUES ============================ */
card({id:`hum_warn`,who:`doc`,tag:`⚠ Humanité critique`,w:30,cond:()=>G.hum<45&&G.hum>=20,
  tx:`Tu entends des voix dans le métro. Ta main tremble quand tu la regardes, comme si elle appartenait à un autre. Un doc te dit sans détour : « Tu as trop de chrome, trop peu d'âme. La cyberpsychose te guette. Si tu craques, MaxTac ne te ratera pas — et la Trauma Team ne viendra pas. »`,
  ch:[
    {t:`Suivre une thérapie`,s:`−500 €$ · +Humanité`,req:R.ed(500),fx:{ed:-500,hum:22,msg:`Immunoblockers, séances, sommeil. Doucement, ton esprit remonte.`}},
    {t:`Prendre un calmant illégal`,s:`+Humanité faible`,fx:{ed:-100,hum:10,hp:-8,msg:`La drogue chasse les voix, mais te laisse nauséeux(se).`}},
    {t:`Continuer, ça ira`,s:`Danger`,fx:{hum:-5,cred:2,msg:`Tu serres la mâchoire. Dans le miroir, quelqu'un te sourit trop largement.`}}
  ]});
card({id:`maxtac`,who:`maxtac`,tag:`⚠ MaxTac`,w:60,cond:()=>G.hum<20,
  tx:`Un hélicoptère noir survole ton toit. Des projecteurs, une voix : « Citoyen, mettez-vous à genoux. » MaxTac. Tu as dépassé un certain seuil, et le monde le sait.`,
  ch:[
    {t:`Supplier, dire que tu es en traitement`,s:`SANG-FROID`,chk:{a:`cool`,dc:9,ok:{hum:12,cred:-3,ed:-800,msg:`Ils te laissent partir avec un rappel à l'ordre et une amende. Tu survis à ça.`},ko:{die:`psycho`,msg:`« Cible hostile. » Tu n'entends même pas la détonation.`}}},
    {t:`Résister`,s:`CORPS · combat`,chk:{a:`ref`,k:`cmb`,dc:11,ok:{hp:-40,hum:-5,cred:10,msg:`Contre toute attente, tu sautes d'un toit et disparais dans la nuit. MaxTac te cherche encore.`},ko:{die:`psycho`,msg:`MaxTac ne te laisse aucune chance.`}}},
    {t:`Te rendre à la clinique de Vik`,s:`−1 500 €$`,req:R.ed(1500),fx:{ed:-1500,hum:25,msg:`Vik t'extrait des implants fous et te recoud. Tu perds du chrome… et gagnes du temps.`}}
  ]});
card({id:`sandy_overload`,who:`doc`,tag:`Surcharge nerveuse`,w:8,cond:()=>hasCy(`sandy`)||hasCy(`apogee`),
  tx:`Ton Sandevistan s'emballe : le monde ralentit, mais ton corps lâche. Du sang coule de ton nez. « C'est le prix, » dit le doc. « Un peu de repos ou un recalibrage, sinon tu cuis de l'intérieur. »`,
  ch:[
    {t:`Te reposer`,s:`+Santé · +Humanité`,fx:{hp:25,hum:6,ed:-120,msg:`Tu dors. Le monde reprend sa vitesse normale.`}},
    {t:`Le pousser encore`,s:`Risque mortel`,chk:{a:`body`,dc:8,ok:{cred:8,msg:`Un boulot brillant. Tu es en vie, mais tout vibre en toi.`},ko:{hp:-45,hum:-6,msg:`Ton système nerveux fume. Tu tiens à peine debout.`}}}
  ]});
card({id:`loan_shark`,who:`fix`,tag:`Créanciers`,w:50,cond:()=>G.ed<0,
  tx:`Tu dois de l'argent. Pas à n'importe qui : à des gens qui savent comment vous retrouver. Deux types t'attendent devant ta porte, leur sourire n'a rien d'amical.`,
  ch:[
    {t:`Leur proposer un boulot pour rembourser`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{ed:1500,cred:2,msg:`Tu acceptes un petit contrat pour eux. Tes dettes se réduisent.`},ko:{hp:-26,ed:-300,msg:`Ils te cassent le bras pour l'exemple.`}}},
    {t:`Vendre un implant à un ripperdoc`,s:`Perte de chrome`,req:()=>G.cyber.length?``:`Aucun implant`,fx:{fn:`sellOne`,msg:`Un implant en moins, des dettes en moins. Vik pleurera ton corps.`}},
    {t:`Fuir en espérant les semer`,s:`RÉFLEXES`,chk:{a:`ref`,dc:8,ok:{ed:0,cred:-1,msg:`Tu disparais dans les rues. Mais ils chercheront encore.`},ko:{hp:-30,ed:-400,msg:`Ils te rattrapent. Ça se passe mal.`}}}
  ]});

/* ============================ NETRUNNING ============================ */
card({id:`blackwall`,who:`brick`,tag:`Voodoo Boys · Blackwall`,w:5,cond:()=>hasDeck()&&A(`int`)>=6,
  tx:`Les Voodoo Boys te contactent sur un canal crypté : « On cherche quelqu'un qui peut s'approcher du <em>Blackwall</em>. On parle d'IA rogue, d'Alt Cunningham, de choses qui regardent depuis l'autre côté. Tu en es ? »`,
  ch:[
    {t:`Plonger au bord du Blackwall`,s:`INT · Danger mental`,chk:{a:`int`,k:`hck`,dc:10,ok:{cred:12,ed:3500,at:{int:1},hum:-6,role:{net:3},fac:{voodoo:10},msg:`Une présence énorme t'observe. Tu ressors vivant avec des données que personne n'a jamais vues.`},ko:{hp:-35,hum:-15,msg:`Une vague de données te traverse. Tu te réveilles hagard(e), la tête en feu.`}}},
    {t:`Refuser, tu préfères survivre`,fx:{cred:1,hum:2,msg:`Brick note ton nom. « Un jour, peut-être. »`}}
  ]});
card({id:`netwatch`,who:`corpo`,tag:`NetWatch · Audit`,w:4,cond:()=>hasDeck(),
  tx:`NetWatch a repéré une intrusion qui ressemble beaucoup à ta signature. Un agent propose un marché : « Pas de poursuites si tu coopères. Ou tu disparais dans un sous-sol. »`,
  ch:[
    {t:`Effacer tes traces`,s:`INT · Hack`,chk:{a:`int`,k:`hck`,dc:8,ok:{cred:4,role:{net:1},msg:`Plus un seul log. Tu es redevenu(e) un fantôme.`},ko:{hp:-20,ed:-600,cred:-2,msg:`Ils te collent un pare-feu mortel. Tu t'en sors, mais ils ont saisi ton matériel.`}}},
    {t:`Coopérer avec NetWatch`,s:`−Humanité`,fx:{hum:-4,ed:1200,cred:-3,role:{net:1},msg:`Tu fournis des noms. Tu as honte, mais tu es vivant(e).`}}
  ]});
card({id:`hacker_gig`,who:`fix`,tag:`Piratage sur commande`,w:5,cond:()=>hasDeck(),
  tx:`Un client veut accéder à une base de données Biotechnica pour y supprimer un dossier. « Tu peux le faire proprement ? Moi, je ne sais pas faire. »`,
  ch:[
    {t:`Casser le pare-feu`,s:`INT · Hack`,chk:{a:`int`,k:`hck`,dc:8,ok:{ed:2000,cred:6,role:{net:2},msg:`Tu entres, tu sors. Personne ne saura que tu étais là.`},ko:{hp:-18,hum:-3,msg:`Un contre-feu t'envoie un choc dans la nuque.`}}},
    {t:`Refuser`,fx:{}}
  ]});

/* ============================ CARRIÈRES (voies) ============================ */
card({id:`path_fixer`,who:`dex`,tag:`Voie de Fixer`,once:true,cond:()=>G.role.fixer>=3&&G.cred>=12,
  tx:`Dex te prend à part : « Tu connais des gens, tu sais parler, tu sens les occasions. Tu pourrais être fixer. Ce n'est pas facile : tu prends un pourcentage, mais tu portes les erreurs. Prêt(e) ? »`,
  ch:[
    {t:`Devenir fixer`,s:`Passe au rôle Fixer`,fx:{flag:[`fixer`],cred:6,ed:800,role:{fixer:4},msg:`Un téléphone chiffré, un carnet d'adresses, un bar à toi. Les mercenaires t'appellent désormais.`}},
    {t:`Rester mercenaire indépendant`,fx:{cred:2}}
  ]});
card({id:`fixer_deal`,who:`fix`,tag:`Contrat de fixer`,w:6,cond:()=>G.flags.fixer,
  tx:`Un client te contacte : il veut un assassinat discret. Un mercenaire du coin s'est montré intéressé. Ta commission : <strong>25 %</strong> d'un contrat à 8 000 €$.`,
  ch:[
    {t:`Arranger le contrat`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{ed:2000,cred:6,role:{fixer:2},msg:`Tout se passe bien. Ton nom circule désormais dans les cercles qui comptent.`},ko:{ed:200,cred:-2,msg:`Le merc rate sa cible. Le client est furieux, tu dois rembourser.`}}},
    {t:`Refuser un contrat trop sale`,s:`+Humanité`,fx:{hum:5,cred:1}}
  ]});
card({id:`path_techie`,who:`doc`,tag:`Voie de Techie`,once:true,cond:()=>A(`tech`)>=7&&G.cred>=8,
  tx:`Ton talent pour les machines n'échappe à personne. Un atelier de Kabuki cherche un associé : « On répare, on modifie, on fabrique des armes sur mesure. Tu viens ? »`,
  ch:[
    {t:`Devenir techie`,s:`Rôle Techie`,fx:{flag:[`techie`],cred:5,ed:500,role:{tech:4},at:{tech:1},msg:`Ton établi devient ta forteresse. Les mercenaires défilent pour des mods d'armes.`}},
    {t:`Refuser`,fx:{}}
  ]});
card({id:`techie_job`,who:`fix`,tag:`Commande de techie`,w:6,cond:()=>G.flags.techie,
  tx:`Un merc te demande de personnaliser son pistolet : suppresseur, viseur, cadence de tir. Un client pointilleux, mais généreux.`,
  ch:[
    {t:`Faire du sur-mesure`,s:`TECHNIQUE`,chk:{a:`tech`,dc:7,ok:{ed:1800,cred:4,at:{tech:1},role:{tech:2},msg:`L'arme est une œuvre d'art. Il te paie le double et jure de t'envoyer des collègues.`},ko:{ed:200,hp:-8,msg:`Un court-circuit. Ton atelier sent le brûlé.`}}},
    {t:`Refuser un travail dangereux`,fx:{}}
  ]});
card({id:`path_medtech`,who:`doc`,tag:`Voie de Medtech`,once:true,cond:()=>A(`int`)>=6&&A(`tech`)>=6&&G.cred>=8,
  tx:`Des blessés arrivent au pied d'un immeuble de Watson, la Trauma Team s'est arrêtée à la barrière de la zone. Quelqu'un te regarde : « Toi, tu sais soigner ? »`,
  ch:[
    {t:`Intervenir`,s:`INT + TECH`,chk:{a:`tech`,dc:7,ok:{flag:[`medtech`],cred:6,hum:10,ed:500,role:{med:4},msg:`Tu stabilises les blessés. Des habitants viennent te remercier. Tu viens de trouver ta voie.`},ko:{hp:-10,hum:3,msg:`Tu fais de ton mieux, mais il y a des pertes. Tu t'en souviendras.`}}},
    {t:`Laisser les pros s'en occuper`,fx:{hum:-2}}
  ]});
card({id:`medtech_job`,who:`fix`,tag:`Appel urgent`,w:6,cond:()=>G.flags.medtech,
  tx:`Un blessé grave dans une ruelle, un copain de merc, perdant son sang. Pas de Trauma Team. Juste toi, des gants, un kit médical, et le temps qui s'écoule.`,
  ch:[
    {t:`Le soigner sur place`,s:`TECHNIQUE`,chk:{a:`tech`,dc:7,ok:{ed:1200,cred:5,hum:6,role:{med:2},msg:`Il vit. Il te serre la main comme une bouée.`},ko:{hum:-4,msg:`Il s'éteint dans tes bras. Tu n'étais pas assez rapide.`}}},
    {t:`L'emmener chez Vik`,s:`−150 €$`,fx:{ed:-150,hum:4,cred:2}}
  ]});
card({id:`path_netrunner`,who:`brick`,tag:`Voie de Netrunner`,once:true,cond:()=>hasDeck()&&A(`int`)>=6&&G.cred>=8,
  tx:`Sur le Net, ton ombre commence à compter. Quelqu'un t'écrit : « Tu veux plonger plus loin ? On t'ouvre le marché noir des quickhacks. »`,
  ch:[
    {t:`Devenir netrunner`,s:`Rôle Netrunner`,fx:{flag:[`netrunner`],cred:5,role:{net:4},at:{int:1},msg:`Tes yeux se voilent de lignes de code. Le Net est ton jardin.`}},
    {t:`Rester prudent(e)`,fx:{}}
  ]});
card({id:`path_rocker`,who:`kerry`,tag:`Voie de Rockerboy`,once:true,cond:()=>G.role.rocker>=2&&G.cred>=10,
  tx:`Tu montes sur scène dans un petit bar de Kabuki. Le public hurle. Une pro te donne sa carte : « Un manager, ça te dit ? »`,
  ch:[
    {t:`Devenir rockerboy`,s:`Rôle Rockerboy`,fx:{flag:[`rocker`],cred:8,ed:700,role:{rocker:4},msg:`Les concerts s'enchaînent. Ton nom commence à circuler.`}},
    {t:`Rester anonyme`,fx:{hum:2}}
  ]});
card({id:`rocker_gig`,who:`kerry`,tag:`Concert`,w:6,cond:()=>G.flags.rocker,
  tx:`Un club te propose un set. Foule excitée, drogues, caméras BD. Une vraie opportunité, ou un piège à scandales.`,
  ch:[
    {t:`Jouer à fond`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{ed:2200,cred:9,hum:4,role:{rocker:2},msg:`Le public crie ton nom. Les BD de ta performance se vendent comme des petits pains.`},ko:{cred:-1,ed:100,msg:`Ton ampli lâche, la foule se moque. Tu t'en remettras.`}}},
    {t:`Jouer un set intime`,fx:{hum:8,cred:2,ed:400}}
  ]});
card({id:`path_cop`,who:`ncpd`,tag:`Voie de Flic`,once:true,cond:()=>G.member===`ncpd`&&G.rank>=1,
  tx:`Tu enquêtes sur un trafic de cyberware. Les noms qui remontent sont hauts placés. La commissaire te regarde : « Tu veux monter, ou tu veux faire ton devoir ? »`,
  ch:[
    {t:`Poursuivre l'enquête jusqu'au bout`,s:`Honnête`,chk:{a:`int`,dc:8,ok:{cred:12,ed:1500,hum:6,role:{cop:4},msg:`Des arrestations retentissantes. Les médias parlent de toi.`},ko:{hp:-25,cred:2,msg:`Les gros bonnets te font taper dessus. Tu survis, mais tu es mis(e) au placard.`}}},
    {t:`Accepter les pots-de-vin`,s:`Corrompu`,fx:{ed:3500,hum:-8,cred:-3,role:{cop:2},msg:`L'argent est confortable. Ta conscience, moins.`}}
  ]});

/* ============================ CORPOS ============================ */
card({id:`corp_headhunt`,who:`corpo`,tag:`Offre corpo`,w:5,cond:()=>(G.cred>=20||G.origin===`corpo`)&&!G.member,
  tx:`Un costume impeccable t'aborde au sortir de l'Afterlife : « Vos compétences nous intéressent. Un poste, un salaire, une assurance Trauma Team. En échange : loyauté et discrétion. »`,
  ch:[
    {t:`Écouter l'offre`,s:`Voie corporative`,fx:{ed:700,cred:2,bloc:{corpo:10},flag:[`corpjob`],role:{corpo:2},msg:`Tu signes une clause de confidentialité longue comme un roman. Le salaire est correct.`}},
    {t:`Décliner, tu es libre`,fx:{cred:2,hum:3}}
  ]});
card({id:`corp_promotion`,who:`corpo`,tag:`Promotion`,w:5,cond:()=>G.flags.corpjob&&G.origin===`corpo`,
  tx:`Ton supérieur t'invite dans son bureau avec vue sur Corpo Plaza. « Il y a un poste de manager. Mais il faut éliminer un concurrent dans les rangs. À toi de voir comment. »`,
  ch:[
    {t:`Le coincer dans une magouille`,s:`INTELLECT`,chk:{a:`int`,dc:7,ok:{ed:2400,cred:5,role:{corpo:2},msg:`Un rapport bien placé, un détournement fabriqué. Il est viré.`},ko:{ed:0,cred:-3,hum:-2,msg:`Le piège échoue. Tu es mis(e) en observation.`}}},
    {t:`Gagner honnêtement`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{ed:1600,cred:5,hum:3,msg:`Ton travail parle pour toi. La promotion est méritée.`},ko:{ed:100,msg:`Un autre est choisi. Ça arrive.`}}}
  ]});
card({id:`corp_war`,who:`meredith`,tag:`Guerre des corpos`,w:4,cond:()=>yr()>=2072,
  tx:`Militech et Arasaka s'affrontent dans l'ombre. Meredith Stout te propose un contrat : voler un prototype dans un convoi d'Arasaka. « Le monde est fait de petites guerres. Choisis ton camp. »`,
  ch:[
    {t:`Voler pour Militech`,s:`RÉFLEXES`,chk:{a:`ref`,k:`drv`,dc:8,ok:{ed:3200,cred:7,fac:{militech:10,arasaka:-12},msg:`Le prototype arrive à bon port. Militech te doit une faveur.`},ko:{hp:-30,fac:{arasaka:-8},msg:`Le convoi est trop bien protégé. Tu fuis avec les poumons en feu.`}}},
    {t:`Informer Arasaka`,s:`INTELLECT`,chk:{a:`int`,dc:7,ok:{ed:2400,cred:4,fac:{arasaka:10,militech:-12},msg:`Arasaka récompense ta vigilance.`},ko:{hp:-15,fac:{militech:-8},msg:`Militech l'apprend, et te le fait payer.`}}},
    {t:`Rester neutre`,fx:{hum:2}}
  ]});
card({id:`corp_leak`,who:`corpo`,tag:`Fuite de données`,w:3,cond:()=>G.flags.corpjob,
  tx:`Un collègue te confie, en pleurs, que la corpo teste des implants défectueux sur des volontaires sans leur dire. Il a des preuves.`,
  ch:[
    {t:`Fuiter les preuves aux médias`,s:`Héroïque`,fx:{hum:12,cred:6,ed:-500,bloc:{corpo:-14,rue:4},unflag:[`corpjob`],msg:`Le scandale éclate. Tu perds ton poste. Mais tu dors mieux.`}},
    {t:`Le dénoncer en interne`,s:`Carrière`,fx:{ed:1500,hum:-10,cred:-2,bloc:{corpo:8},msg:`Tu es promu(e). Ton collègue disparaît. Tu n'oublieras jamais son visage.`}},
    {t:`Ne rien faire`,fx:{hum:-3}}
  ]});

/* ============================ NOMADES ============================ */
card({id:`wraith_feud`,who:`panam`,tag:`Badlands · Conflit de clans`,w:4,cond:()=>G.origin===`nomad`||G.fac.aldecaldos>0||G.fac.wraiths>0,
  tx:`Une tension monte entre Aldecaldos et Wraiths à la frontière du désert. Un convoi a été attaqué, des vies perdues. Panam te demande ton avis, les nerfs à vif.`,
  ch:[
    {t:`Proposer une trêve`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{cred:8,hum:5,fac:{aldecaldos:8,wraiths:4},msg:`Tu convaincs Saul de rencontrer les Wraiths. La paix, fragile, tient.`},ko:{hp:-14,cred:1,msg:`On te traite de naïf. Mais on a failli t'écouter.`}}},
    {t:`Frapper les Wraiths en premier`,s:`Violent`,chk:{a:`ref`,k:`drv`,dc:8,ok:{cred:7,hum:-5,fac:{aldecaldos:10,wraiths:-12},msg:`Un raid éclair. Les Wraiths comptent leurs morts.`},ko:{hp:-30,hum:-3,msg:`Ils t'attendaient. Tu t'en sors, mais tes alliés ont payé cher.`}}},
    {t:`Quitter les Badlands`,fx:{cred:1}}
  ]});
card({id:`biotechnica_convoy`,who:`corpo`,tag:`Biotechnica · Convoi`,w:3,cond:()=>G.origin===`nomad`||A(`ref`)>=6,
  tx:`Biotechnica engage des conducteurs pour acheminer des cargaisons alimentaires à travers les Badlands, entre deux clans nerveux. « 3 000 €$ si tu passes entre les Raffen Shiv sans accroc. »`,
  ch:[
    {t:`Conduire le convoi`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:8,ok:{ed:3000,cred:6,role:{nomad:2},fac:{biotechnica:5},msg:`Tu traverses les dunes en riant. Livraison parfaite.`},ko:{hp:-26,ed:300,msg:`Les Raffen Shiv te coupent la route. Une partie de la cargaison est perdue.`}}},
    {t:`Négocier un péage`,s:`SANG-FROID`,chk:{a:`cool`,dc:7,ok:{ed:2400,cred:5,msg:`Les chefs de clan acceptent un tribut raisonnable.`},ko:{ed:500,hp:-8,msg:`Ils veulent plus que prévu. Tu paies la différence.`}}}
  ]});

/* ============================ EDGERUNNER ============================ */
card({id:`path_edge`,who:`dex`,tag:`Voie d'Edgerunner`,once:true,cond:()=>G.role.solo>=4&&G.cred>=14,
  tx:`Tes exploits circulent. Dex t'adresse un regard grave : « Tu veux vraiment ce chemin ? Edgerunner. Vivre sur le fil, jamais savoir si tu verras demain. On ne vit pas vieux, mais on vit fort. »`,
  ch:[
    {t:`Devenir Edgerunner`,s:`Rôle Edgerunner`,fx:{flag:[`edge`],cred:8,ed:1000,role:{solo:4},msg:`Un carnet d'adresses plein de coups tordus, un sac d'armes, une adrénaline qui ne s'éteint jamais.`}},
    {t:`Rester prudent(e)`,fx:{}}
  ]});
card({id:`edge_job`,who:`dex`,tag:`Gros coup`,w:7,cond:()=>G.flags.edge,
  tx:`Un contrat sans âme : prendre d'assaut un entrepôt d'une petite corpo, récupérer un prototype, ressortir. Des gardes armés jusqu'aux dents, des drones, un pare-feu. Paie : <strong>5 000 €$</strong>.`,
  ch:[
    {t:`Assaut frontal`,s:`CORPS/RÉFLEXES · combat`,chk:{a:`ref`,k:`cmb`,dc:9,ok:{ed:5000,cred:9,role:{solo:2},msg:`Tu danses entre les balles. L'entrepôt n'est plus qu'un champ de bataille.`},ko:{hp:-45,ed:600,cred:2,msg:`Tu t'en sors de justesse, blessé(e). Dex te soigne à l'arrière du van.`}}},
    {t:`Infiltration`,s:`SANG-FROID · discrétion`,chk:{a:`cool`,k:`stl`,dc:9,ok:{ed:5000,cred:8,role:{solo:1},msg:`Silencieux comme une ombre. Tu repars avec le prototype sans alerter personne.`},ko:{hp:-30,ed:600,msg:`Les alarmes sonnent. Tu fuis en jurant.`}}},
    {t:`Hacker les systèmes d'abord`,s:`Cyberdeck`,req:R.deck(),chk:{a:`int`,k:`hck`,dc:8,ok:{ed:5000,cred:8,role:{net:1},msg:`Les drones se retournent contre les gardes. L'équipe n'a même pas à tirer.`},ko:{hp:-20,ed:500,msg:`Le contre-piratage brûle ton interface. L'équipe se débrouille.`}}}
  ]});

/* ============================ FACTION PROPRE ============================ */
card({id:`found_faction`,who:`you`,tag:`Ton empire`,once:true,cond:()=>G.cred>=32&&G.ed>=2500&&!G.mine&&!isLeader(),
  tx:`Tu ne veux plus suivre les ordres de personne. Tu as de l'argent, des alliés, une réputation. Il est temps de bâtir quelque chose à toi : une faction, une famille, un nom que les rues connaîtront.`,
  ch:[
    {t:`Fonder un gang de rue`,s:`−2 500 €$ · Prestige de rue`,req:R.ed(2500),heavy:`Tu fondes ta propre faction. Si tu es encore membre d'une autre, tu devras la quitter avec toutes les conséquences.`,fx:{found:`gang`,ed:-2500,cred:6,bloc:{rue:10},role:{boss:3}}},
    {t:`Créer un réseau de fixers`,s:`−2 500 €$ · Revenus passifs`,req:R.ed(2500),heavy:`Tu fondes ta propre faction. Si tu es encore membre d'une autre, tu devras la quitter avec toutes les conséquences.`,fx:{found:`fixers`,ed:-2500,cred:5,role:{boss:3,fixer:2}}},
    {t:`Monter un clan nomade`,s:`−2 500 €$ · Mobilité`,req:R.ed(2500),heavy:`Tu fondes ta propre faction. Si tu es encore membre d'une autre, tu devras la quitter avec toutes les conséquences.`,fx:{found:`nomads`,ed:-2500,cred:5,role:{boss:3,nomad:2}}},
    {t:`Fonder un collectif de netrunners`,s:`−2 500 €$ · Cyberguerre`,req:()=>hasDeck()?(G.ed>=2500?``:`2500 €$`):`Cyberdeck requis`,heavy:`Tu fondes ta propre faction. Si tu es encore membre d'une autre, tu devras la quitter avec toutes les conséquences.`,fx:{found:`runners`,ed:-2500,cred:5,role:{boss:3,net:2}}},
    {t:`Plus tard…`,fx:{unonce:`found_faction`}}
  ]});
card({id:`mine_raid`,who:`narr`,tag:`Ton territoire attaqué`,w:30,cond:()=>G.mine&&ownedList().length>=1&&yr()>=2071,
  tx:()=>{const d=ownedList()[Math.floor(Math.random()*ownedList().length)];G.tmp={d:d.id};const rival=pickFoe(d);G.tmp.rival=rival;return `Des tirs à <strong>${d.n}</strong>. Les <em>${FAC[rival]?.n||`rivaux`}</em> se pointent à tes frontières avec leurs gars et leurs flingues. Ta faction <em>${G.mine.name}</em> est en danger.`},
  ch:[
    {t:`Défendre à la tête de tes troupes`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:8,ok:{cred:7,hum:-2,fn:`defendWin`,msg:`Tu repousses l'assaut. Ton nom résonne dans les rues.`},ko:{hp:-30,fn:`defendLose`,msg:`Vous êtes débordés. Le quartier est perdu.`}}},
    {t:`Négocier une trêve`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{cred:5,hum:3,fn:`defendWin`,msg:`Un accord est trouvé, tout le monde se retire avec les honneurs.`},ko:{ed:-600,fn:`defendLose`,msg:`Ils veulent plus que tu ne peux donner. La zone tombe.`}}},
    {t:`Payer pour les calmer`,s:`−1 500 €$`,req:R.ed(1500),fx:{ed:-1500,cred:-1,msg:`Ils prennent l'argent, mais sont déjà en train de planifier la prochaine attaque.`}}
  ]});
card({id:`mine_recruit`,who:`narr`,tag:`Recrues`,w:6,cond:()=>G.mine,
  tx:()=>`Des jeunes se pressent à la porte de ${G.mine.name}. Ils veulent un nom, une famille, un but. Tu as le choix : en faire des soldats, des techniciens… ou les protéger de la rue.`,
  ch:[
    {t:`Recruter des combattants`,s:`−600 €$ · +Puissance`,req:R.ed(600),fx:{ed:-600,fn:`mineGrow`,cred:3,msg:`Ta bande grossit. Les rues commencent à te respecter… ou à te craindre.`}},
    {t:`Former des techniciens`,s:`−600 €$ · +Revenus`,req:R.ed(600),fx:{ed:-600,fn:`mineGrow`,cred:2,role:{tech:1},msg:`Les ateliers tournent. Les revenus montent.`}},
    {t:`Les aider à trouver un autre chemin`,s:`+Humanité`,fx:{hum:12,cred:2,msg:`Tu leur donnes un peu d'espoir. Dans cette ville, c'est rare.`}}
  ]});

/* ============================ FIN DE CARRIÈRE ============================ */
card({id:`legend`,who:`rogue`,tag:`Légende de Night City`,once:true,w:200,cond:()=>G.cred>=100,
  tx:`Rogue pose un verre à ton nom au comptoir de l'Afterlife. « Tu as ce que peu de gens ont : une légende. Dis-moi, qu'est-ce que tu comptes en faire ? »`,
  ch:[
    {t:`Continuer, il y a encore tant à faire`,s:`Bonus de score`,fx:{flag:[`legend`],hum:5,msg:`Le verre est servi. Ton portrait rejoint les murs de l'Afterlife.`}},
    {t:`Faire un dernier run, sortir en flammes`,s:`Fin glorieuse`,fx:{die:`blaze`}},
    {t:`Prendre ta retraite maintenant`,s:`Fin paisible`,fx:{retire:true}}
  ]});
card({id:`retire_offer`,who:`you`,tag:`Une vie derrière toi`,once:true,w:100,cond:()=>G.age>=36,
  tx:`Les années ont passé. Ton corps te le fait sentir : cicatrices, chrome vieillissant, nuits sans sommeil. Dans un coin de ta tête, une idée : plier bagage, quitter les néons, vivre quelque part où le ciel est vraiment bleu.`,
  ch:[
    {t:`Prendre ta retraite à Night City`,s:`Fin paisible`,fx:{retire:true}},
    {t:`Partir pour les Badlands, disparaître`,s:`Fin discrète`,fx:{quit:true}},
    {t:`Un dernier gros coup avant la fin`,s:`Risque total`,chk:{a:`ref`,k:`cmb`,dc:9,ok:{ed:8000,cred:15,msg:`Le coup réussit. Tu comptes ton butin, puis tu rentres vivre. Qui ose dire que le passé ne paie pas ?`},ko:{hp:-55,hum:-8,msg:`Un dernier coup de trop. Tu es blessé(e), mais en vie.`}}}
  ]});

/* ============================ FLAVOR ============================ */
const FLAV = [
 [`narr`,`Pluie acide`,`Un orage acide s'abat sur Watson. Les néons grésillent, la pluie brûle les peaux nues. Un vieux t'offre un abri sous son store.`,[
   [`Rester à l'abri, partager un thé`,{hum:6,msg:`Un vieux ripperdoc retraité te raconte les années Time of the Red. Tu sais maintenant pourquoi il ne dort plus.`}],
   [`Courir sous la pluie, trouver un autre toit`,{hp:-8,cred:1,msg:`Tu arrives trempé(e) et brûlé(e), mais tu as gagné du temps.`}]]],
 [`narr`,`Noodle stand`,`Un étal de nouilles fumantes sous les néons de Little China. Le cuisinier te sert sans un mot, un sourire en coin.`,[
   [`Manger tranquillement`,{ed:-30,hum:5,hp:6,msg:`C'est chaud, gras et parfait. Un instant de calme dans la tempête.`}],
   [`Observer les passants`,{cred:1,msg:`Tu repères des visages qui te serviront peut-être.`}]]],
 [`narr`,`Braindance clandestine`,`Un type te propose une BD "légale" : les souvenirs d'une star de la rue. 100 €$ l'entrée. L'addiction est une pente glissante.`,[
   [`Essayer`,{ed:-100,hum:-5,cred:1,msg:`Les sensations sont fortes. Reviens-en, si tu peux.`}],
   [`Refuser`,{hum:2}]]],
 [`narr`,`Manifestation`,`Des manifestants bloquent l'avenue : « Les corpos nous volent nos vies ! » Les drones de la police arrivent déjà.`,[
   [`Rejoindre la manif`,{hum:6,cred:2,fac:{arasaka:-3},msg:`Tu cries avec la foule. Tu te sens vivant(e).`}],
   [`Éviter et passer`,{msg:`Tu contournes. Les cris s'estompent derrière toi.`}]]],
 [`narr`,`Boutique de cybernétique`,`Une vitrine de ripperdoc affiche des promos "cyber-friendly". Des yeux, des bras, des cœurs de rechange. L'inscription clignote : <em>Be a new you</em>.`,[
   [`Entrer et se renseigner`,{cred:1,msg:`Le vendeur est un charmeur. Tu repars avec un catalogue. Le chrome te fait de l'œil.`}],
   [`Passer ton chemin`,{hum:2}]]],
 [`narr`,`Panne de courant`,`Un blackout frappe Kabuki. La ville s'arrête, tout devient noir, puis les premiers cris. Les pillards surgissent.`,[
   [`Profiter du chaos`,{ed:500,hum:-4,cred:1,msg:`Les vitrines éclatent, les mains s'agitent. Tu repars avec un butin et un goût amer.`}],
   [`Aider les voisins`,{hum:8,cred:3,msg:`Tu guides des personnes âgées dans l'escalier plongé dans le noir.`}]]],
];
FLAV.forEach((f,i)=>card({id:`fl${i}`,who:f[0],tag:f[1],w:3,
  tx:f[2],ch:f[3].map(c=>({t:c[0],fx:c[1]}))}));

/* ============================ FACTIONS GÉNÉRÉES ============================ */
const FACREQ = {
  valentinos:()=>G.cred>=6, maelstrom:()=>G.cred>=8, tygers:()=>G.cred>=8, sixth:()=>G.cred>=8,
  voodoo:()=>hasDeck(), animals:()=>A(`body`)>=6, mox:()=>A(`cool`)>=5,
  aldecaldos:()=>G.origin===`nomad`||A(`tech`)>=6, wraiths:()=>G.origin===`nomad`||A(`ref`)>=6,
  barghest:()=>yr()>=2077&&G.cred>=22, ncpd:()=>G.cred>=8&&A(`int`)>=4,
  arasaka:()=>G.origin===`corpo`||G.cred>=25, militech:()=>G.origin===`corpo`||G.cred>=25,
  kangtao:()=>G.origin===`corpo`||G.cred>=25, biotechnica:()=>G.origin===`corpo`||G.cred>=20,
  trauma:()=>A(`tech`)>=5||A(`int`)>=5,
};
Object.keys(FAC).forEach(id=>{
  const f=FAC[id], L=WHO[f.leader]||WHO.fix;
  card({id:`fj_${id}`,who:f.leader,tag:`Offre · ${f.n}`,w:5,
    cond:()=>!G.member&&!G.mine&&(G.fac[id]||0)>-25&&FACREQ[id]()&&!G.joinedOnce[id],
    tx:`<strong>${L.n}</strong> te regarde d'un œil neuf. « ${f.d} On aurait besoin de gens comme toi. Alors, tu rejoins ${f.n} ? »<br><br><em style="color:var(--dim)">Avantage : ${f.perk}</em>`,
    ch:[
      {t:`Rejoindre ${f.n}`,s:`Tu seras ${RANKS[f.k][0]}`,heavy:`Tu prêtes serment à ${f.n}. Ses ennemis deviennent les tiens, et tu ne pourras plus fonder ta propre faction.`,fx:{join:id,cred:3,msg:`Tu serres la main, tu rejoins la famille. Désormais, tes ennemis seront ceux de ${f.n}.`}},
      {t:`Réfléchir encore`,fx:{fac:{[id]:2},msg:`« Prends ton temps. Mais pas trop. »`}},
      {t:`Refuser clairement`,s:`${f.n} le saura`,fx:{fac:{[id]:-10},cred:1,flagMark:id}}
    ]});
  const att = {gang:`body`,corp:`cool`,clan:`ref`,ncpd:`int`,mox:`cool`,trauma:`tech`}[f.k]||`cool`;
  card({id:`fjob_${id}`,who:`@fac`,tag:`Mission · ${f.n}`,w:12,cond:()=>G.member===id,
    who:`@fac`,tx:()=>{G.tmp={line:Math.floor(Math.random()*f.lines.length)};return f.lines[G.tmp.line]+` <em style="color:var(--dim)">(${rankTitle()})</em>`},
    ch:[
      {t:`Accomplir la mission`,s:ATTRS[att].n,chk:{a:att,k:att===`int`?`hck`:att===`body`||att===`ref`?`cmb`:null,dc:()=>7+Math.min(3,G.rank||0),
        ok:{fn:`facJobWin`,msg:`Mission accomplie. ${f.n} se souvient de ceux qui font le job.`},
        ko:{hp:-22,fac:{[id]:-4},fn:`facJobFail`,msg:`Ça tourne mal. Tu t'en sors, mais ta réputation en prend un coup.`}}},
      {t:`Improviser une approche plus fine`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{fn:`facJobWin`,msg:`Tu trouves un angle que personne n'avait vu. Les chefs apprécient.`},ko:{hp:-10,fac:{[id]:-4},msg:`Le plan s'effondre. Tu t'en sors avec les honneurs justes.`}}},
      {t:`Refuser cette fois`,s:`Rep −`,fx:{fac:{[id]:-8},cred:-1}}
    ]});
});
card({id:`fac_promo`,who:`narr`,tag:`Promotion`,w:50,cond:()=>{const p=promoInfo();return G.member&&!isLeader()&&G.rank<3&&p&&p.ready},
  tx:()=>`Après plusieurs missions réussies, <strong>${FAC[G.member].n}</strong> reconnaît ta valeur. Tu es sur le point de devenir <em>${RANKS[FAC[G.member].k][G.rank+1]}</em>.`,
  ch:[{t:`Accepter la promotion`,s:`Rang supérieur · plus de devoirs`,heavy:`Monter en grade te donne du pouvoir, mais la famille attendra sa part et tes ennemis te verront.`,fx:{fn:`promote`,msg:`Un nouveau titre, un nouveau salaire. Ta famille te félicite.`}},
      {t:`Décliner, tu préfères rester discret(e)`,fx:{hum:3}}]});
card({id:`fac_betray`,who:`fix`,tag:`Trahison possible`,w:3,once:true,cond:()=>G.member&&G.rank>=1&&FAC[G.member].foes.length>0,
  tx:()=>`Un émissaire de ${FAC[FAC[G.member].foes[0]]?.n} te prend à part : « ${FAC[G.member].n} ne t'apportera rien de bon. Nous offrons plus : de l'argent, du chrome, un meilleur siège. Rejoins-nous. »`,
  ch:[
    {t:`Trahir et changer de camp`,s:`Rep − · Gros gain`,heavy:`Tu trahis ta famille : tu perds ton rang, un contrat sera mis sur ta tête et tes anciens frères te traqueront.`,fx:{fn:`betray`,ed:3000,cred:-3,hum:-5,msg:`Tu coupes tous les ponts. Les anciens frères te promettent une mort lente.`}},
    {t:`Refuser, loyal(e) jusqu'au bout`,s:`Rep +`,fx:{fn:`facLoyal`,hum:4,cred:2,msg:`Tu retournes la proposition et restes fidèle. Tes chefs te respectent encore plus.`}}
  ]});
