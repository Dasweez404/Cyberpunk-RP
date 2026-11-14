/* =====================================================================
   CARTES 13 — la ville te croise : rencontres de toutes les factions,
   cyberpsychos, Scavs, équipe de Maine ; scènes d'Empire concrètes ;
   trames par voie ; débuts de quartier ; voyage
   ===================================================================== */
Object.assign(WHO,{
  pilar:{n:`Pilar`,r:`Crew de Maine · Mécano`,c:`#ff9f1c`,st:`bald`,sk:26},
  kiwi:{n:`Kiwi`,r:`Crew de Maine · Netrunner`,c:`#c77dff`,st:`short`,sk:30},
  dorio:{n:`Dorio`,r:`Crew de Maine · Solo`,c:`#ff2a6d`,st:`mohawk`,sk:24},
  falco:{n:`Falco`,r:`Crew de Maine · Pilote`,c:`#00f0ff`,st:`cap`,sk:24},
});
const ENT = id => FAC[id] || ({scavs:{n:`Scavs`,c:`#ff9f1c`,k:`gang`,foes:[],d:`Charognards d'organes`}}[id]);
const entName = id => (ENT(id)||{n:id}).n;

/* ---------- Rencontres de factions : tout le monde finit par te croiser ---------- */
const SCN = {
  valentinos:[`Devant une église de Wellsprings, des Valentinos t'observent entre deux prières. L'un d'eux s'avance : « Tu viens souvent par ici. Dis-nous ce que tu veux. »`,`Un camion de fleurs bloque la rue : un enterrement Valentino. Une garde d'honneur en veste brodée te demande de rebrousser chemin — ou de te recueillir.`,`Un jeune Valentino te hèle depuis une Rayfield tape-à-l'œil : « On cherche quelqu'un pour un service. Le barrio paie ses dettes. »`],
  maelstrom:[`Une salve de basses métalliques sort d'un entrepôt de Northside. Des Maelstrom chromés jusqu'aux dents font cercle autour d'un type à genoux. L'un d'eux te remarque : « Tu veux voir ? »`,`Une silhouette aux bras surdimensionnés te barre la route : un Maelstrom ivre de chrome qui cherche un spectacle. « Montre-moi ce que tu as sous la peau. »`,`Un ripperdoc borgne et deux Maelstrom t'invitent dans une arrière-cour : « Le chrome, c'est la liberté. Viens, on t'en offre un échantillon. »`],
  tygers:[`Un dragon doré tatoué sur un cou : un Tyger Claw t'arrête devant un karaoké de Japantown. « Ici, on paie sa dette d'honneur. Tu connais les règles ? »`,`À Kabuki, des Tyger Claws harcèlent un vendeur de nouilles. L'un d'eux te regarde d'un air entendu : « Tu es avec nous ou contre nous ? »`,`Un lieutenant en costume sombre t'attend devant un dojo : « On t'a vu(e) traîner. Un duel d'honneur, ça te dit ? »`],
  sixth:[`Un 4x4 aux couleurs américaines se range à ta hauteur : la 6th Street en patrouille. « Papiers. On nettoie le quartier, citoyen(ne). »`,`À Arroyo, des vétérans en treillis font un barrage improvisé. « On fait le travail que la NCPD ne fait plus. Tu es avec nous ? »`,`Un ancien soldat te fait signe depuis un entrepôt : « On manque de bras pour une opération contre les Animals. Ça t'intéresse ? »`],
  voodoo:[`Une rue de Pacifica quasi déserte. Une jeune femme en capuche te regarde, un doigt sur les lèvres. Des Voodoo Boys, dans l'ombre : « Tu cherches quelque chose dans le Net ? »`,`Un écran traîne dans une ruelle de Coastview, affichant ton nom. Les Voodoo Boys t'observent depuis un toit : « On sait ce que tu as fait hier soir. »`,`Un messager te glisse une puce : « Maman Brigitte veut te voir. Pas un mot sur l'invitation. Une réponse ? »`],
  animals:[`Une salle de sport clandestine à Rancho Coronado. Des Animals, muscles gonflés, te regardent entrer comme du gibier. « Un nouveau ? Viens tester ta force. »`,`Un Animal torse nu soulève une voiture à mains nues pour impressionner la foule. Il te lance : « Tu fais quoi, toi, à part regarder ? »`,`Sasquatch en personne traverse la rue, suivi de sa bande. Il te toise : « T'as de la carrure. Mais pas de cœur. Prouve-moi le contraire. »`],
  mox:[`Une soirée au Lizzie's Bar. Susie Q te voit hésiter à l'entrée : « Entre, ou va-t'en. Mais ne reste pas planté(e) là. Ici, on s'entraide. »`,`Une Mox en larmes te fait signe dans une ruelle de Kabuki : un client violent l'a suivie. Elle a besoin de quelqu'un qui n'a pas peur.`,`Judy passe en courant avec un sac de BD : « Tu veux m'aider à les cacher ? Les Tyger Claws sont à mes trousses. »`],
  aldecaldos:[`Un convoi de Thorton s'arrête au bord de la route. Un Aldecaldo descend, la main sur le capot : « Tu es perdu(e) ? On aide ceux qui demandent honnêtement. »`,`Panam te fait signe depuis un camion : « Un des nôtres est en panne près de la frontière. Tu connais les moteurs ? »`,`Saul Bright en personne règle un différend entre deux familles. Il te regarde : « Un étranger voit souvent mieux. Qu'en dis-tu ? »`],
  wraiths:[`Un nuage de poussière sur la piste : les Wraiths te prennent en chasse, hurlant dans leurs moteurs. Leur chef lève le poing : « Tu roules vite pour un étranger. »`,`Un Wraith te défie à une course sur la route des Badlands. L'enjeu : ta voiture contre sa moto. Les autres hurlent leur approbation.`,`Nash en personne coupe le moteur de sa moto devant toi : « Les Aldecaldos te donnent du pain. Nous, on te donne le choix. »`],
  barghest:[`Un blindé Barghest bloque la rue. Un colonel en treillis te regarde par la fente du casque : « Zone militaire. Tu as dix secondes pour t'expliquer. »`,`Des mercenaires Barghest nettoient un carrefour de Pacifica. L'un d'eux te lance un gilet : « Si tu restes, tu travailles. »`,`Kurt Hansen passe en voiture, vitre baissée : « On a besoin de gens qui savent obéir. Ça, c'est rare. »`],
  scavs:[`Une camionnette blanche sans plaque ralentit à ta hauteur. Des charognards en blouses tachées t'examinent comme un steak : « Beau chrome. On l'estime à combien ? »`,`Dans une ruelle de Rancho Coronado, des Scavs dépècent un corps. Ils t'aperçoivent : « Ne regarde pas. Ou aide-nous. »`,`Un Scav aux yeux jaunes surgit d'une benne : « Pas de panique. Je cherche juste un rein compatible. »`],
  ncpd:[`Une patrouille NCPD t'arrête au coin d'une rue de Watson. L'agent compare ton visage à son écran : « Beaucoup de gens te cherchent. »`,`Un fourgon de police te coupe la route. Deux agents descendent, tasers en main. « Contrôle d'identité. Tu as quelque chose à déclarer ? »`,`Un inspecteur fatigué te tend un gobelet de café : « On discute ? Rien d'officiel. Pour l'instant. »`],
  arasaka:[`Une limousine noire s'arrête devant toi. Un homme en costume sombre, sans expression : « Arasaka souhaite te parler. Monte, ou on revient avec plus d'arguments. »`,`Un drone Arasaka t'escorte depuis dix minutes. Un cadre te rejoint : « Vous avez un talent qui nous intéresse. Ou une dette qui nous coûte. »`,`Une équipe Arasaka fouille un entrepôt voisin. Un agent s'approche : « Tu as vu quelque chose d'inhabituel ? Réponds avec soin. »`],
  militech:[`Un convoi Militech traverse le quartier. Un officier descend et te scrute : « On cherche quelqu'un qui sait se battre sans poser de questions. »`,`Un blindé Militech te dépasse, puis fait marche arrière. Meredith Stout baisse sa vitre : « Tu as des amis chez Arasaka ? »`,`Des soldats Militech nettoient une rue. L'un d'eux te tend un prospectus : « Engagez-vous. Ou écartez-vous. »`],
  kangtao:[`Un homme en blouse Kang Tao te suit depuis un moment. Il s'approche : « Excusez-moi. Je teste un prototype. Vous voudriez essayer ? Avec compensation. »`,`Un salon d'armement privé à Charter Hill. Une hôtesse te guide, souriante : « Kang Tao aime les clients qui savent ce qu'ils veulent. »`,`Une femme d'affaires de Kang Tao te propose un verre : « J'ai entendu parler de toi. Parlons affaires. »`],
  biotechnica:[`Un camion Biotechnica traverse le quartier. Le conducteur te fait signe : « On cherche des gens pour sécuriser un convoi vers les Badlands. »`,`Un cadre Biotechnica en costume vert te tend une carte : « Une récolte est menacée. Vous avez le profil. »`,`Des agents Biotechnica inspectent un champ expérimental. L'un d'eux te regarde : « Tu as vu des saboteurs ? »`],
};
const ENC_ORDER = Object.keys(SCN);
const ARCH = {valentinos:`gang`,maelstrom:`gang`,tygers:`gang`,sixth:`gang`,animals:`gang`,voodoo:`net`,mox:`mox`,aldecaldos:`clan`,wraiths:`clan`,barghest:`corp`,scavs:`scav`,ncpd:`law`,arasaka:`corp`,militech:`corp`,kangtao:`corp`,biotechnica:`corp`};
function pickEnc(){
  const own=locOwner();
  if(G.forceEnc){ G.forceEnc=false; if(SCN[own]) return own; if(own===`neutral`) return pickR([`ncpd`,`arasaka`,`militech`,`kangtao`]); if(own===`player`) return null; }
  const w=ENC_ORDER.map(id=>{ let x=3; const r=G.fac[id]||0; if(r<=-10) x+=Math.min(8,-r/6); if(id===own) x+=5; if(G.member===id) x+=2; if((G.allies||{})[id]) x+=2; if(id===`ncpd`) x+=(G.heat.loi||0)/12; if(FAC[id]&&FAC[id].k===`corp`) x+=(G.heat.corpo||0)/18; return x; });
  let t=w.reduce((a,b)=>a+b,0), r=Math.random()*t; for(let i=0;i<w.length;i++){ r-=w[i]; if(r<=0) return ENC_ORDER[i]; } return ENC_ORDER[0];
}
card({id:`fenc`,who:`@enemy`,tag:`📍 Rencontre`,w:46,cd:2,cond:()=>true,
  tx:()=>{
    const fid=pickEnc()||pickR(ENC_ORDER); const r=(G.fac[fid]||0), stance=(G.member===fid||(G.allies||{})[fid]||r>=35)?`friend`:r<=-20?`hostile`:`neutral`;
    G.tmp={fid,stance,sc:rnd(0,SCN[fid].length-1)};
    const pre=stance===`hostile`?`<em>Ils te connaissent. Ils ne sont pas contents.</em> `:stance===`friend`?`<em>Des visages amis.</em> `:``;
    return `<strong>${entName(fid)} · ${locName()}</strong><br>${pre}${SCN[fid][G.tmp.sc]}`; },
  dyn:()=>{
    const t=G.tmp||{}, fid=t.fid||`valentinos`, st=t.stance||`neutral`, ar=ARCH[fid]||`gang`, hos=st===`hostile`, fr=st===`friend`;
    const price=Math.round((hos?1400:600)*infl()), loot=Math.round((500+G.cred*18)/50)*50;
    const out=[];
    out.push({t:fr?`Prêter main-forte`:ar===`mox`?`Les défendre`:`Faire front`,s:`${ar===`law`?`Résister`:`CORPS · combat`} · butin · ${fr?`réputation +`:`−10 réputation`}`,chk:{a:`body`,k:`cmb`,dc:hos?9:7,
      ok:{ed:loot,cred:4,fac:{[fid]:fr?6:-10},msg:fr?`Vous faites front ensemble. Les liens se resserrent.`:`Tu leur tiens tête et repars avec leur butin. Ils s'en souviendront.`},
      ko:{hp:hos?-26:-16,fac:{[fid]:fr?-2:-5},msg:`Ça tourne mal. Tu t'en sors, mais abîmé(e).`}}});
    if(ar===`net`) out.push({t:`Ruser, retourner leur piège`,s:`INTELLECT${hasDeck()?` · hack`:``} · réputation +`,chk:{a:`int`,k:hasDeck()?`hck`:null,dc:hos?9:7,ok:{fac:{[fid]:10},cred:3,xp:{int:3},msg:`Tu les prends à leur propre jeu. Ils te respectent.`},ko:{hp:-14,fac:{[fid]:-4},msg:`Leur contre-mesure te grille la nuque.`}}});
    else if(ar===`clan`) out.push({t:`Les battre à leur jeu : la route`,s:`RÉFLEXES · conduite · réputation +`,chk:{a:`ref`,k:`drv`,dc:hos?9:7,ok:{fac:{[fid]:10},cred:3,bloc:{nomad:6},msg:`Tu les distances dans la poussière. Ils lèvent le poing.`},ko:{hp:-18,fac:{[fid]:-3},msg:`Tu finis dans le fossé. Ils rient — pas méchamment.`}}});
    else if(ar===`corp`) out.push({t:`Baratiner l'agent`,s:`SANG-FROID · social · réputation +`,chk:{a:`cool`,dc:hos?9:7,ok:{fac:{[fid]:10},cred:3,ed:Math.round(loot/2),msg:`Un sourire, un nom lâché au bon moment. Il te serre la main.`},ko:{hp:-12,fac:{[fid]:-4},bloc:{corpo:-5},msg:`Il note ton nom dans son carnet. Mauvais signe.`}}});
    else if(ar===`mox`) out.push({t:`Les aider à leur manière`,s:`SANG-FROID · réputation +`,chk:{a:`cool`,dc:6,ok:{fac:{[fid]:12},hum:6,cred:3,msg:`Tu fais ce qu'il fallait faire. Susie Q te sourit de loin.`},ko:{fac:{[fid]:3},hp:-8,msg:`Tu maladroitement. Mais les Mox voient l'intention.`}}});
    else if(ar===`scav`) out.push({t:`Fuir`,s:`RÉFLEXES`,chk:{a:`ref`,dc:7,ok:{cred:2,msg:`Tu files entre deux bennes, ton chrome intact.`},ko:{hp:-22,hum:-4,msg:`Ils te griffent au passage. Tu sens une main dans ta poche.`}}});
    else out.push({t:`Parler franchement`,s:`SANG-FROID · réputation +`,chk:{a:`cool`,dc:hos?9:7,ok:{fac:{[fid]:8},cred:2,msg:`Quelques mots posés. On te laisse passer, avec un regard respectueux.`},ko:{hp:-10,fac:{[fid]:-3},msg:`Ils ne prennent pas ça pour du respect.`}}});
    if(fid!==`scavs`) out.push({t:fr?`Offrir un service`:`Payer ton passage`,s:`${money(price)} · réputation +`,req:()=>G.ed>=price?``:`${money(price)} requis`,fx:{ed:-price,fac:{[fid]:hos?14:10},cred:1,msg:`L'argent change de main. On te laisse tranquille — et on se souvient de toi.`}});
    else out.push({t:`Marchander ta peau`,s:`${money(price)}`,req:()=>G.ed>=price?``:`${money(price)} requis`,fx:{ed:-price,msg:`Ils comptent les billets en grognant. « Pas ce soir. »`}});
    if(!G.member&&!G.mine&&FAC[fid]&&canJoin(fid)&&!fr) out.push({t:`Demander à rejoindre ${FAC[fid].n}`,s:`Tu es accepté(e) si tu es à la hauteur`,heavy:`Tu prêtes serment à ${FAC[fid].n}. Ses ennemis deviennent les tiens.`,fx:{join:fid,cred:2,msg:`Un échange de regards, une poignée de main. Tu es des leurs.`}});
    return out; },ch:[]});

/* ---------- Cyberpsychos ---------- */
const PSY = [
  `Une ex-comptable d'Arasaka tient une rame de métro en otage, des lames dans les avant-bras. Elle hurle des chiffres, encore et encore.`,
  `Un ancien Valentino titube dans une rue de Heywood, ses bras gonflés de chrome. Il répète le nom de sa fille en balançant des voitures.`,
  `Un livreur des Badlands pousse des cris sur un toit de Westbrook, un lance-grenades à la place de la main. Les passants se sont enfuis.`,
  `Un ripperdoc qui s'est trop servi lui-même se barricade dans sa clinique de Little China. À travers la porte, il murmure à des gens qui n'existent pas.`,
  `Une ex-rockeuse chante à tue-tête sur une scène vide de Kabuki, hors d'elle, ses implants vocaux saturant les haut-parleurs jusqu'à faire saigner les oreilles.`,
  `Un garde du corps de corpo erre dans un parking de Corpo Plaza, ses yeux rouges clignotant, frappant les voitures comme s'il cherchait quelqu'un.`,
  `Un ancien solo de la crew de quelqu'un que tu as connu — ou presque — te reconnaît de loin et crie ton nom en chargeant.`,
  `Un gamin des rues, chrome bricolé aux deux bras, s'en prend à un marché de Santo Domingo. Il pleure en tapant.`,
];
card({id:`psy`,who:`@psy`,tag:`⚠ Cyberpsycho Sighting`,w:()=>14+(G.hum<65?8:0)+Math.min(6,G.cyber.length*1.5)+(G.member===`maelstrom`?5:0),cd:4,cond:()=>yr()>=2071,
  tx:()=>{ const i=rnd(0,PSY.length-1); G.tmp={p:i}; return `<strong>${locName()}</strong> — ${PSY[i]} <em>La NCPD ne viendra pas avant l'aube. Ou jamais.</em>`; },
  dyn:()=>{ const loot=Math.round((900+G.cred*22)/50)*50, d=G.hum<50?-1:0;
    const out=[
      {t:`L'affronter`,s:`CORPS · combat · prime ${money(loot)}`,chk:{a:`body`,k:`cmb`,dc:9,ok:{ed:loot,cred:7,hum:-5,loot:1,bloc:{loi:-4},msg:`Un affrontement brutal. Quand il s'effondre, tu vois ton propre visage dans ses implants.`},ko:{hp:-28,hum:-4,msg:`Ses bras te broient les côtes. Tu t'enfuis en rampant.`}}},
      {t:`Tenter de le raisonner`,s:`SANG-FROID · +Humanité si tu réussis`,chk:{a:`cool`,dc:10+d,ok:{hum:9,cred:7,rel:{mika:4},msg:`Tu parles doucement, longtemps. Ses yeux changent de couleur. Il tombe à genoux, en larmes. Quelqu'un vient le prendre en charge.`},ko:{hp:-20,hum:-3,msg:`Il ne t'entend pas. Il frappe.`}}},
      {t:`Appeler MaxTac et reculer`,s:`Sûr · −Cred`,fx:{ed:Math.round(loot/5),cred:-1,hum:-2,bloc:{loi:-6},msg:`Les hélicoptères arrivent. Tu regardes, de loin, ce qu'il reste d'un être humain.`}},
      {t:`Fuir`,s:`RÉFLEXES`,chk:{a:`ref`,dc:7,ok:{msg:`Tu files avant qu'il ne te voie.`},ko:{hp:-18,hum:-2,msg:`Il t'a vu. Il te poursuit sur trois rues.`}}}
    ];
    if(hasDeck()||G.flags.hackmentor) out.splice(2,0,{t:`Griller ses implants à distance`,s:`INTELLECT · hack · prime ${money(loot)}`,chk:{a:`int`,k:`hck`,dc:8,ok:{ed:loot,cred:7,role:{net:1},hum:-2,msg:`Quelques lignes de code, un hurlement qui s'éteint. Propre. Presque trop propre.`},ko:{hp:-20,hum:-3,msg:`Il grille ton interface à son tour.`}}});
    return out; },ch:[]});

/* ---------- L'équipe de Maine ---------- */
const CREW = {
  maine:[`Maine`,`Maine t'invite à sa table à l'Afterlife : « Une crew, ça ne se recrute pas. Ça se reconnaît. Qu'est-ce que tu as dans le ventre ? »`,`Lui parler franchement`,`Lui offrir un verre`],
  david:[`David Martinez`,`David, un peu gêné, te tend la main : « On m'a dit que tu connais les astuces. Je suis nouveau dans le milieu. Tu m'apprends ? »`,`Lui montrer des astuces`,`Lui offrir à manger`],
  rebecca:[`Rebecca`,`Rebecca vide un chargeur sur un mur pour passer le temps : « Tu es plus lent(e) que je pensais. Tu veux t'entraîner avec moi ? Ou tu préfères parler ? »`,`T'entraîner avec elle`,`La faire rire`],
  pilar:[`Pilar`,`Pilar essuie ses énormes mains sur un chiffon : « Chaque chrome que je pose, je le connais. Si tu veux de la qualité, assieds-toi. »`,`Regarder son travail`,`L'aider à ranger`],
  kiwi:[`Kiwi`,`Kiwi te fait signe, un écran sur les genoux : « Je cherche quelqu'un pour tester une intrusion. Rien d'illégal. Enfin, presque. »`,`Tester son intrusion`,`Parler musique`],
  dorio:[`Dorio`,`Dorio te claque le dos : « T'as des réflexes ? Montre-moi. On joue : tu me touches, je t'offre un verre. »`,`Relever le défi`,`Décliner en riant`],
  falco:[`Falco`,`Falco, au volant d'une caisse pourrie, klaxonne : « Monte ! Je veux voir si tu as les nerfs. »`,`Monter`,`Décliner poliment`],
};
card({id:`crew_scene`,who:`maine`,tag:`🌃 L'équipe de Maine`,w:()=>(yr()>=2074&&yr()<=2078)?9:0,cd:4,cond:()=>yr()>=2074&&yr()<=2078,
  tx:()=>{ const k=pickR(Object.keys(CREW)); G.tmp={k}; return CREW[k][1]; },
  dyn:()=>{ const k=(G.tmp&&G.tmp.k)||`maine`, c=CREW[k];
    const attr={maine:`cool`,david:`int`,rebecca:`ref`,pilar:`tech`,kiwi:`int`,dorio:`ref`,falco:`ref`}[k];
    return [
      {t:c[2],s:`${ATTRS[attr].n} · +Lien`,chk:{a:attr,dc:7,ok:{rel:{[k]:14},xp:{[attr]:3},cred:3,msg:`Quelques heures passées ensemble. Le lien est de ceux qu'on n'oublie pas.`},ko:{rel:{[k]:6},hp:-8,msg:`Tu te plantes un peu. Il/elle rit, pas méchamment.`}}},
      {t:c[3],s:`+Humanité · +Lien`,fx:{rel:{[k]:10},hum:5,ed:-60,msg:`Rien de spectaculaire. Juste un moment vrai.`}},
      {t:`Passer ton chemin`,fx:{msg:`Tu t'éloignes. La nuit reprend sa place.`}}
    ]; },ch:[]});
// Arcs de la crew : les liens ouvrent des coups
card({id:`crew_heist`,who:`maine`,tag:`🌃 Crew de Maine · Le coup`,once:true,w:12,cond:()=>yr()>=2075&&yr()<=2077&&['maine','dorio','rebecca','falco','pilar','kiwi','david'].filter(i=>relv(i)>=12).length>=2,
  tx:`Maine étale un plan sur la table : un entrepôt, six gardes, un coffre. Ses yeux brillent. « Il me faut une équipe de confiance. Dorio sur le terrain, Falco au volant, Kiwi dans le Net. Et toi. Tu es des nôtres ? »`,
  ch:[
    {t:`Mener l'assaut avec la crew`,s:`CORPS · combat`,heavy:`Un coup de crew peut mal finir pour tout le monde.`,chk:{a:`body`,k:`cmb`,dc:9,ok:{ed:5500,cred:9,loot:3,rel:{maine:12,dorio:8},msg:`Une symphonie d'explosions. La crew sort riant, couverte de poussière et de gloire.`},ko:{hp:-40,ed:600,cred:3,rel:{maine:6},msg:`Ça dérape. Falco vous tire de là, Dorio saigne. Mais vous êtes ensemble.`}}},
    {t:`Piloter la fuite`,s:`RÉFLEXES · conduite`,chk:{a:`ref`,k:`drv`,dc:9,ok:{ed:4500,cred:8,rel:{falco:12,maine:8},msg:`Tu fais voler la caisse entre deux camions. Falco hurle de joie.`},ko:{hp:-26,ed:500,rel:{falco:5},msg:`Un dérapage de trop. La caisse finit dans un mur, mais tout le monde sort.`}}},
    {t:`Refuser, trop dangereux`,s:`Les liens se distendent`,fx:{rel:{maine:-6},hum:3,msg:`Maine hoche la tête, déçu. « Chacun fait son choix. »`}}
  ]});

/* ---------- Empire : scènes concrètes ---------- */
const OD = () => { const o=ownedList(); return o.length?o[rnd(0,o.length-1)]:null; };
card({id:`emp_collect`,who:`@fac`,tag:`📯 Empire · Le racket`,cond:()=>empireEligible()&&ownedList().length>=1,w:0,
  tx:()=>{ const d=OD(); G.tmp={d:d.id}; return `Dans <strong>${d.n}</strong>, un commerçant n'a pas versé sa part depuis deux mois. Ton lieutenant te regarde, les poings serrés : « On fait quoi ? Si on laisse passer, tout le quartier va croire qu'on est mous. »`; },
  ch:[
    {t:`Lui faire peur, vraiment`,s:`CORPS · +1 400 €$ · −Humanité`,chk:{a:`body`,dc:7,ok:{ed:1400,cred:3,hum:-5,fn:`holdUp`,msg:`Un comptoir fracassé, une main sur la gorge. L'argent apparaît. Le quartier te craint.`},ko:{hp:-14,fn:`holdDown`,msg:`Il avait des amis. La scène se retourne contre vous.`}}},
    {t:`Protéger son échoppe contre un vrai racketteur`,s:`SANG-FROID · +Humanité · tenue +`,fx:{hum:6,cred:2,fn:`holdUp`,rel:{padre:2},msg:`Un voyou de passage prend la fuite devant tes hommes. Le commerçant te paie — de bon cœur.`}},
    {t:`Passer l'éponge`,s:`Tu perds de la face`,fx:{cred:-2,fn:`holdDown`,msg:`Ton lieutenant serre la mâchoire. Le quartier prend note.`}}
  ]});
card({id:`emp_recruit`,who:`@fac`,tag:`📯 Empire · Les candidats`,cond:()=>empireEligible(),w:0,
  tx:`Trois jeunes de ton quartier font la queue pour entrer dans ta famille. Une gamine aux poings usés, un garçon silencieux avec un deck de seconde main, une ancienne mécano au regard dur. Tu n'as de la place que pour un.`,
  ch:[
    {t:`La gamine aux poings usés`,s:`Combat · défense des quartiers +`,fx:{fn:`recruit`,cred:2,msg:`Elle se redresse, les yeux brillants. « Je ne vous décevrai pas. »`}},
    {t:`Le garçon au deck`,s:`Hack · revenus +`,fx:{fn:`recruit`,xp:{int:3},msg:`Il ne dit rien, mais ses doigts bougent déjà. Un vrai netrunner en devenir.`}},
    {t:`L'ancienne mécano`,s:`Technique · entretien du matériel`,fx:{fn:`recruit`,xp:{tech:3},msg:`« Montre-moi ton matos. » Dix minutes plus tard, tes armes sont mieux réglées qu'au premier jour.`}},
    {t:`Les prendre tous les trois`,s:`−1 200 €$ · 3 recrues`,req:R.ed(1200),fx:{ed:-1200,fn:`recruit`,echo:{emp_recruit_b:1},cred:3,msg:`La salle applaudit. Trois nouvelles voix dans ta famille.`}},
    {t:`Les renvoyer chez eux`,fx:{hum:2,msg:`Tu les envoies trouver autre chose. Ils s'en iront chez un rival.`}}
  ]});
card({id:`emp_recruit_b`,who:`narr`,tag:`📯 Empire`,cond:()=>false,tx:`Les deux autres recrues se présentent à toi, silencieuses. Ta famille grandit.`,ch:[{t:`Les accueillir`,fx:{fn:`recruit`,msg:`Trois nouvelles recrues dans le groupe.`}}]});
card({id:`emp_siege_1`,who:`@fac`,tag:`📯 Empire · Plan d'assaut (1/2)`,cond:()=>empireEligible()&&!G.siege&&DIST.some(d=>G.dist[d.id]!==`player`&&!(d.lock&&!G.flags.dogtown)&&!(G.member&&G.dist[d.id]===G.member)),w:0,
  tx:()=>{ const c=DIST.filter(d=>G.dist[d.id]!==`player`&&!(d.lock&&!G.flags.dogtown)&&!(G.member&&G.dist[d.id]===G.member)&&!((G.allies||{})[G.dist[d.id]])); if(!c.length){ G.siege=null; return `Aucune cible ne se présente aujourd'hui.`; } c.sort((a,b)=>a.def-b.def); const d=c[rnd(0,Math.min(2,c.length-1))]; G.siege={d:d.id,scout:0,bribe:0};
    return `Un de tes hommes revient en courant : <strong>${d.n}</strong>, tenu par <em>${ownerName(G.dist[d.id])}</em>, est mal gardé cette semaine. « C'est le moment, chef. Mais il faut préparer. »`; },
  ch:[
    {t:`Envoyer des éclaireurs`,s:`INTELLECT · assaut facilité`,chk:{a:`int`,dc:7,ok:{fn:`siegeSet`,next:`emp_siege_2`,msg:`Tes éclaireurs reviennent avec un plan des relèves et des angles morts.`},ko:{next:`emp_siege_2`,hp:-6,msg:`Un éclaireur est repéré. Vous perdez l'effet de surprise.`}}},
    {t:`Corrompre un garde`,s:`−900 €$ · assaut facilité`,req:R.ed(900),fx:{ed:-900,next:`emp_siege_2`,msg:`Une enveloppe change de main. Une porte restera ouverte à minuit.`}},
    {t:`Foncer sans préparer`,s:`Plus risqué`,fx:{next:`emp_siege_2`,msg:`Tes hommes s'équipent en silence. Pas de plan, juste de la rage.`}}
  ]});
card({id:`emp_siege_2`,who:`@fac`,tag:`📯 Empire · L'assaut (2/2)`,cond:()=>false,
  tx:()=>{ const d=G.siege&&DMAP[G.siege.d]; return d?`Minuit à <strong>${d.n}</strong>. Tes hommes (${Math.max(1,crewN())}) retiennent leur souffle derrière toi. Le signal t'attend. Comment tu les engages ?`:`Rien à faire ce soir.`; },
  dyn:()=>{ const d=G.siege&&DMAP[G.siege.d]; if(!d) return [{t:`Rentrer`,fx:{msg:`Tu rentres.`}}];
    const bon=Math.min(3,Math.floor(crewN()/2)), pre=1;
    const lootOk={fn:`siegeWin`,ed:1200+d.def*300,cred:6+d.def,loot:2};
    return [
      {t:`Assaut frontal, en tête de tes hommes`,s:`CORPS · combat · ${bon?`+${bon} grâce à ta famille`:`seul(e) en première ligne`}`,chk:{a:`body`,k:`cmb`,dc:7+d.def-bon,ok:Object.assign({msg:`Les portes volent, les défenseurs reculent. Au matin, ${d.n} est à toi.`},lootOk),ko:{hp:-34,fn:`siegeLose`,msg:`L'assaut s'enlise. Tu ordonnes la retraite, la mort dans l'âme.`}}},
      {t:`Infiltration en silence`,s:`RÉFLEXES · furtivité`,chk:{a:`ref`,k:`stl`,dc:7+d.def-bon,ok:Object.assign({msg:`Une équipe, trois ombres, une porte. Quand le jour se lève, ${d.n} a changé de main sans un coup de feu.`},lootOk),ko:{hp:-22,fn:`siegeLose`,msg:`Une alarme muette. Tes hommes battent en retraite.`}}},
      {t:`Faire sauter l'alimentation et prendre le noir`,s:`TECHNIQUE`,chk:{a:`tech`,dc:7+d.def-bon,ok:Object.assign({msg:`Le quartier s'éteint d'un coup. Dans la confusion, tes hommes prennent chaque poste.`},lootOk),ko:{hp:-26,fn:`siegeLose`,msg:`Le courant revient trop vite. Vous reculez.`}}},
      {t:`Attendre : ce n'est pas le moment`,s:`Tu laisses passer`,fx:{fn:`siegeLose`,msg:`Tu ordonnes de rentrer. Quelqu'un d'autre profitera de l'ouverture.`}}
    ]; },ch:[]});
card({id:`emp_summit`,who:`@enemy`,tag:`📯 Empire · Sommet`,cond:()=>empireEligible()&&Object.keys(G.allies||{}).length<2,w:0,
  tx:()=>{ const ids=ENC_ORDER.filter(i=>FAC[i]&&!G.allies[i]&&G.member!==i); const fid=ids[rnd(0,ids.length-1)]; G.tmp={fid}; return `<strong>${entName(fid)}</strong> te propose une rencontre en terrain neutre, un soir, sans armes visibles. Une table, trois chaises, un silence tendu. « Tu montes. On préfère te parler avant que tu ne deviennes un problème. »`; },
  ch:[
    {t:`Négocier un pacte`,s:`SANG-FROID · pacte gratuit`,chk:{a:`cool`,dc:9,ok:{fn:`summitPact`,cred:4,msg:`Trois heures de silence, de regards, et enfin une poignée de main. Un pacte, scellé sans un eddie.`},ko:{fn:`summitSour`,hp:-8,msg:`Les mots dérapent. Chacun repart de son côté, plus méfiant.`}}},
    {t:`Montrer ta force`,s:`CORPS · tu leur fais peur`,chk:{a:`body`,k:`cmb`,dc:8,ok:{cred:6,fn:`summitFear`,msg:`Tu déposes ton arme sur la table sans un mot. Ils comprennent.`},ko:{hp:-18,msg:`Ils n'ont pas l'air impressionnés.`}}},
    {t:`Quitter la table`,fx:{msg:`Tu te lèves. « On se reverra. »`}}
  ]});
card({id:`emp_party`,who:`@fac`,tag:`📯 Empire · La fête`,cond:()=>empireEligible()&&ownedList().length>=1,w:0,
  tx:()=>{ const d=OD(); G.tmp={d:d.id}; return `Les gens de <strong>${d.n}</strong> attendent un geste. Une fête de quartier, avec de la musique, de la bouffe et de l'alcool, ferait grimper ta réputation. Mais ça coûte, et les rivaux aiment frapper quand tout le monde danse.`; },
  ch:[
    {t:`Payer une grande fête`,s:`−1 000 €$ · tenue + · Cred +`,req:R.ed(1000),fx:{ed:-1000,cred:4,hum:5,fn:`holdUp`,msg:`Trois nuits de basses et de rires. Le quartier te porte aux nues.`}},
    {t:`Une petite soirée`,s:`−300 €$ · Humanité +`,req:R.ed(300),fx:{ed:-300,hum:6,msg:`Quelques bières, une radio. Les gens retiennent surtout que tu es venu(e).`}},
    {t:`Garder l'argent`,fx:{cred:-1,msg:`Pas de fête cette année. Le quartier fait la tête.`}}
  ]});

/* ---------- Trames par voie ---------- */
const KO = {body:`Ça tourne mal. Tu t'en sors avec des bleus.`,ref:`Un faux pas, un coup de feu. Tu t'en tires de justesse.`,tech:`Le matériel te lâche au pire moment.`,int:`Tu rates un détail, et il coûte cher.`,cool:`Les mots ne sortent pas comme prévu.`};
const TRAMES = [
 {r:`solo`,id:`ar_solo`,t:`Le Spectre`,who:`dex`,pay:3800,
  s:[[`Un solo légendaire surnommé « le Spectre » a disparu avec une cargaison Militech. Dex veut que tu le retrouves avant tout le monde.`,[[`Remonter sa piste dans les bars de Watson`,`int`,null,7,`Un barman finit par parler : un nom, une adresse.`],[`Frapper aux portes jusqu'à ce que ça cède`,`body`,`cmb`,7,`À force de poings, quelqu'un craque.`]]],
     [`La piste mène à un entrepôt de Pacifica gardé par ses anciens frères d'armes. Ils protègent leur ami, pas la cargaison.`,[[`Parlementer avec eux`,`cool`,null,8,`Ils baissent les armes. « Il est à l'étage. »`],[`Passer par les toits`,`ref`,`stl`,8,`Tu atterris sans un bruit dans leur dos.`]]],
     [`Le Spectre est là, adossé à un mur, blessé, la cargaison à ses pieds. « Militech m'a menti. Cette marchandise tue des enfants. Qu'est-ce que tu fais ? »`,[[`L'aider à détruire la cargaison`,`tech`,null,8,`Une charge, un feu, une colonne de fumée. Le Spectre sourit, fatigué.`],[`Livrer la cargaison à Dex`,`cool`,null,7,`Tu empoches. Le Spectre te regarde partir sans un mot.`]]]]},
 {r:`net`,id:`ar_net`,t:`Le mur de verre`,who:`kiwi`,pay:3600,
  s:[[`Un netrunner de ta connaissance est tombé dans un coma numérique après une plongée. Sa sœur te supplie de retrouver ce qui l'a frappé.`,[[`Analyser ses logs de connexion`,`int`,`hck`,7,`Une signature étrange dans ses derniers paquets.`],[`Interroger ses contacts du Net`,`cool`,null,7,`Un vieux hacker lâche un nom, à voix basse.`]]],
     [`La trace mène à un serveur de NetWatch camouflé dans un hôtel. Une entrée, deux pare-feu, un garde.`,[[`Percer les pare-feu`,`int`,`hck`,8,`Les couches cèdent une à une.`],[`Entrer par la porte avec un faux badge`,`cool`,null,8,`Un sourire, une signature : tu es dedans.`]]],
     [`Sur le serveur : un fragment d'IA rogue qui a mordu ton ami. Elle te regarde à travers l'écran. « Toi aussi, tu veux entrer ? »`,[[`L'isoler et la détruire`,`int`,`hck`,9,`La présence hurle, puis s'éteint. Ton ami se réveille dans la nuit.`],[`Lui parler`,`cool`,null,8,`Elle se calme. Elle te donne le code de réveil, en échange d'un secret.`]]]]},
 {r:`fixer`,id:`ar_fixer`,t:`Le contrat de trop`,who:`dino`,pay:4000,
  s:[[`Un de tes mercs est mort sur un contrat que tu as arrangé. Sa veuve veut savoir pourquoi. Un client t'a menti — ou tu t'es trompé.`,[[`Relire le contrat à la loupe`,`int`,null,7,`Une clause cachée. Le client savait.`],[`Interroger tes propres contacts`,`cool`,null,7,`Un vieux fixer te glisse un nom contre un verre.`]]],
     [`Le client est un cadre de Kang Tao. Il t'invite à dîner dans une tour de verre. Il ne s'attend pas à tes questions.`,[[`Le confronter poliment`,`cool`,null,8,`Il pâlit à chaque phrase. Il parle.`],[`Fouiller son bureau pendant le dîner`,`tech`,null,8,`Dans un tiroir : le dossier complet.`]]],
     [`Tu tiens la preuve. Le client te propose un virement, une promotion de contrat, ton silence. La veuve attend.`,[[`Tout révéler à la veuve et à la presse`,`cool`,null,8,`L'affaire éclate. Le cadre perd tout. La veuve te serre dans ses bras.`],[`Vendre le dossier au plus offrant`,`int`,null,7,`Tu encaisses. Mais tu n'oublieras pas son visage.`]]]]},
 {r:`tech`,id:`ar_tech`,t:`L'atelier de Kabuki`,who:`pilar`,pay:3400,
  s:[[`Pilar t'amène une carcasse : un implant militaire défectueux, retiré d'un cadavre. Elle veut comprendre ce qui l'a rendu fou.`,[[`Le démonter pièce par pièce`,`tech`,null,7,`Un module inconnu, soudé à la main.`],[`Chercher le numéro de série dans les bases`,`int`,`hck`,7,`Un lot Arasaka jamais commercialisé.`]]],
     [`Le lot vient d'un entrepôt oublié de Watson. Les gars de la sécurité sont des vendeurs de chrome au noir, armés jusqu'aux dents.`,[[`Négocier un accès`,`cool`,null,8,`Ils te laissent entrer : « Pas de questions. »`],[`Forcer le verrou à l'ancienne`,`tech`,null,8,`Un clic, un déclic. Tu es dedans.`]]],
     [`Dans les caisses : des centaines d'implants identiques, programmés pour s'emballer au bout de six mois. Un sabotage — ou un test.`,[[`Les détruire tous`,`tech`,null,8,`Une charge thermique, une heure, un entrepôt en cendres. Pilar te serre la main.`],[`En récupérer quelques-uns à étudier`,`int`,null,8,`Tu emportes un échantillon. Tu comprendras plus tard ce que tu as ramené.`]]]]},
 {r:`med`,id:`ar_med`,t:`La clinique du bout de la rue`,who:`mika`,pay:3000,
  s:[[`Une clinique de rue de Santo Domingo manque de tout : antibiotiques, anesthésiants, matériel. Mika vient te demander de l'aide.`,[[`Trouver un fournisseur honnête`,`cool`,null,7,`Un grossiste te fait un prix d'ami.`],[`Détourner un camion de Trauma Team`,`ref`,`drv`,8,`Un virage serré, une porte forcée : le camion est à toi.`]]],
     [`Des gangs rôdent autour de la clinique. Ils exigent un tribut pour laisser entrer les patients.`,[[`Négocier avec les chefs`,`cool`,null,8,`Ils acceptent, à contrecœur.`],[`Les chasser`,`body`,`cmb`,8,`Trois silhouettes détalent. La clinique est à l'abri.`]]],
     [`Un patient dans un état critique arrive, un cyberpsycho à moitié calmé. Mika ne peut pas opérer seule.`,[[`L'opérer toi-même`,`tech`,null,9,`Une heure de sueur. Il respire. Mika pleure.`],[`Le calmer par la parole`,`cool`,null,9,`Tu tiens sa main toute la nuit. Il redevient quelqu'un.`]]]]},
 {r:`rocker`,id:`ar_rock`,t:`Le dernier set`,who:`kerry`,pay:3600,
  s:[[`Un club de Westbrook veut te faire jouer, mais un promoteur exige la moitié de ta recette — ou ton silence sur ses affaires.`,[[`Négocier un meilleur contrat`,`cool`,null,7,`Le promoteur cède, un sourire crispé.`],[`Enquêter sur ses magouilles`,`int`,null,7,`Un tiroir plein de faux contrats.`]]],
     [`La veille du concert, tes micros disparaissent. Quelqu'un veut que tu rates ton set.`,[[`Improviser avec ce que tu as`,`tech`,null,8,`Deux fils, trois bouts de ferraille : ça marche.`],[`Retrouver le saboteur`,`ref`,null,8,`Une course dans les coulisses, un type plaqué au mur.`]]],
     [`Le concert commence. La foule hurle. Tu dois choisir : chanter ce que le public veut, ou ce que tu as sur le cœur.`,[[`Chanter pour toi`,`cool`,null,8,`Un silence de cathédrale, puis une explosion de cris.`],[`Chanter pour eux`,`cool`,null,7,`La salle se soulève. Les caméras BD tournent.`]]]]},
 {r:`corpo`,id:`ar_corpo`,t:`L'étage interdit`,who:`meredith`,pay:4200,
  s:[[`Au dernier étage de ta tour, une salle est fermée depuis des mois. Ton chef t'envoie « vérifier un détail » : tu comprends vite que c'est un test.`,[[`Faire ton travail sans poser de questions`,`cool`,null,7,`Il hoche la tête, satisfait. Tu viens de gagner sa confiance.`],[`Fouiller l'étage en douce`,`int`,null,8,`Des dossiers sur un projet que personne ne mentionne.`]]],
     [`Le projet s'appelle « Chrysalide ». Des volontaires, des implants expérimentaux, un taux d'échec élevé. Quelqu'un te surprend.`,[[`Mentir calmement`,`cool`,null,8,`Il croit à ton histoire. Pour l'instant.`],[`Le piéger pour te protéger`,`tech`,null,8,`Une caméra qui boucle. Il ne sait pas ce qu'il a vu.`]]],
     [`Tu as le choix : étouffer Chrysalide pour garder ton poste, la dénoncer aux médias, ou la vendre à un concurrent.`,[[`Dénoncer`,`cool`,null,8,`L'affaire fait trembler la corpo. Ton poste y passe — pas ta conscience.`],[`Vendre à Militech`,`int`,null,8,`Meredith Stout sourit : « Bienvenue chez nous. »`]]]]},
 {r:`nomad`,id:`ar_nomad`,t:`La route des Anciens`,who:`dakota`,pay:3600,
  s:[[`Un vieux nomade, mourant, te confie les coordonnées d'un dépôt caché dans le désert, plein de matériel d'avant la guerre.`,[[`Décrypter la carte`,`int`,null,7,`Un tracé secret apparaît sous la poussière.`],[`Demander de l'aide au clan`,`cool`,null,7,`Un ancien te donne la moitié de la route.`]]],
     [`La piste traverse le territoire de Raffen Shiv. Leurs éclaireurs surveillent les crêtes.`,[[`Rouler de nuit, phares éteints`,`ref`,`drv`,8,`Tu frôles les rochers dans l'obscurité. Personne ne te voit.`],[`Faire un détour par le marais`,`tech`,null,8,`Ton pick-up gémit, mais passe.`]]],
     [`Le dépôt est ouvert. Un convoi concurrent est déjà là. Une bagarre est inévitable, ou un partage.`,[[`Se battre pour le dépôt`,`body`,`cmb`,9,`La poussière vole, les poings aussi. Le dépôt est à toi.`],[`Partager équitablement`,`cool`,null,8,`Vous repartez avec la moitié chacun. Les Badlands respectent ça.`]]]]},
 {r:`cop`,id:`ar_cop`,t:`Le dossier Ward`,who:`river`,pay:3400,
  s:[[`Un inspecteur t'a laissé une clé USB avant de disparaître : un dossier sur un réseau de corruption qui remonte au commissariat.`,[[`Lire le dossier avec attention`,`int`,null,7,`Des noms, des virements, des dates.`],[`En parler à un ami du service`,`cool`,null,7,`Un vieux collègue t'écoute, nerveux.`]]],
     [`Quelqu'un te suit. Un flic en civil, ou un tueur. Ta voiture de service est piégée — peut-être.`,[[`Semer le suiveur`,`ref`,`drv`,8,`Une ruelle étroite, un virage, tu l'as perdu.`],[`Le piéger à ton tour`,`tech`,null,8,`Un câble, une trappe. Il tombe de tout son long.`]]],
     [`Le chef du commissariat te convoque. Il sait. Il te propose un marché : ton silence contre une promotion.`,[[`Refuser et tout rendre public`,`cool`,null,9,`Les caméras de la presse t'attendent à la sortie.`],[`Accepter pour mieux le piéger`,`int`,null,9,`Une enveloppe, un micro caché : il vient de signer sa perte.`]]]]},
];
TRAMES.forEach(A=>{
  card({id:`${A.id}_0`,who:A.who,tag:`Trame · ${A.t} (1/3)`,once:true,w:9,cond:()=>(G.role[A.r]||0)>=3&&!G.flags.q_active&&G.cred>=8,
    tx:A.s[0][0],ch:A.s[0][1].map(o=>({t:o[0],s:`${ATTRS[o[1]].n}${o[2]?` · ${{cmb:`combat`,stl:`furtivité`,hck:`hack`,drv:`conduite`}[o[2]]}`:``}`,chk:{a:o[1],k:o[2],dc:o[3],ok:{flag:[`q_active`],fn:`arcWin`,next:`${A.id}_1`,msg:o[4]},ko:{flag:[`q_active`],hp:-10,next:`${A.id}_1`,msg:KO[o[1]]}}}))});
  card({id:`${A.id}_1`,who:A.who,tag:`Trame · ${A.t} (2/3)`,once:true,cond:()=>false,
    tx:A.s[1][0],ch:A.s[1][1].map(o=>({t:o[0],s:`${ATTRS[o[1]].n}${o[2]?` · ${{cmb:`combat`,stl:`furtivité`,hck:`hack`,drv:`conduite`}[o[2]]}`:``}`,chk:{a:o[1],k:o[2],dc:o[3],ok:{fn:`arcWin`,next:`${A.id}_2`,msg:o[4]},ko:{hp:-14,next:`${A.id}_2`,msg:KO[o[1]]}}}))});
  card({id:`${A.id}_2`,who:A.who,tag:`Trame · ${A.t} (3/3)`,once:true,cond:()=>false,
    tx:A.s[2][0],ch:A.s[2][1].map(o=>({t:o[0],s:`${ATTRS[o[1]].n}${o[2]?` · ${{cmb:`combat`,stl:`furtivité`,hck:`hack`,drv:`conduite`}[o[2]]}`:``}`,chk:{a:o[1],k:o[2],dc:o[3],ok:{unflag:[`q_active`],flag:[`arcdone_${A.r}`],fn:`arcEnd`,ed:A.pay,cred:8,loot:2,msg:o[4]},ko:{unflag:[`q_active`],hp:-20,ed:Math.round(A.pay/6),cred:2,msg:KO[o[1]]+` L'affaire se termine, sans gloire.`}}}))});
});

/* ---------- Débuts de quartier ---------- */
const STARTS = {
  heywood:[`Wellsprings, un dimanche`,`Le barrio chante devant l'église. Padre te voit sur le seuil. « Tu connais cette rue depuis toujours. Les Valentinos ont toujours besoin de gens du coin. »`,[[`Allumer une bougie, saluer Padre`,`+Valentinos · +Humanité`,{fac:{valentinos:12},hum:5,rel:{padre:10}}],[`Passer prendre un repas chez Mama Welles`,`+Santé · +Lien`,{hp:15,hum:4,rel:{mama:10,jackie:6}}],[`Aller voir ce que fait la 6th Street`,`Tu t'éloignes du barrio`,{fac:{sixth:8,valentinos:-6},cred:3}]]],
  watson:[`Kabuki, un soir de pluie`,`Les néons rosissent les flaques. Des Mox, des Tyger Claws et des vendeurs se croisent sans se regarder. Judy te fait signe depuis le Lizzie's Bar.`,[[`Entrer au Lizzie's Bar`,`+Mox · +Humanité`,{fac:{mox:12},hum:5,rel:{judy:10}}],[`Rester avec les vendeurs de nouilles`,`+Santé`,{hp:12,hum:4,cred:2}],[`Suivre un Tyger Claw dans la ruelle`,`+Tyger Claws · −Mox`,{fac:{tygers:10,mox:-6},cred:3,hp:-6}]]],
  santo:[`Arroyo, couvre-feu`,`Des vétérans de la 6th Street patrouillent en 4x4, drapeau au vent. Un officier te remarque, curieux : « Tu es d'ici ? On a besoin de gens du coin. »`,[[`Te présenter à la 6th Street`,`+6th Street`,{fac:{sixth:12},cred:3}],[`Éviter la patrouille`,`+Santé`,{hp:10,cred:1}],[`Traverser le terrain des Animals`,`+Animals · −6th Street`,{fac:{animals:10,sixth:-6},cred:4,hp:-8}]]],
  arasaka:[`Corpo Plaza, premier matin`,`Tu franchis les portes de la tour d'Arasaka. Marbre noir, caméras partout, un chef de service t'accueille sans te regarder. « La loyauté est un contrat, pas un sentiment. »`,[[`Te présenter à ton supérieur`,`+Arasaka`,{fac:{arasaka:10},cred:2}],[`Observer les collègues`,`+XP INT`,{xp:{int:3}}],[`Chercher la sortie de secours`,`Tu repères les failles`,{xp:{cool:3},bloc:{corpo:-3}}]]],
  militech:[`Corpo Plaza, premier matin`,`Les couloirs de Militech sentent le métal et l'ambition. Un colonel te serre la main trop fort. « Ici, on gagne les guerres. »`,[[`Te présenter à ton supérieur`,`+Militech`,{fac:{militech:10},cred:2}],[`Visiter le champ de tir`,`+XP RÉFLEXES`,{xp:{ref:3}}],[`Observer discrètement les arrivées d'Arasaka`,`Tu repères les rivaux`,{xp:{int:3}}]]],
  kangtao:[`Corpo Plaza, premier matin`,`Kang Tao t'accueille dans un hall de verre où flottent des hologrammes d'armes. Une ingénieure te sourit : « Bienvenue. Ici, on fabrique des armes qui obéissent. »`,[[`Te présenter à ton supérieur`,`+Kang Tao`,{fac:{kangtao:10},cred:2}],[`Visiter le laboratoire`,`+XP TECHNIQUE`,{xp:{tech:3}}],[`Faire connaissance avec les ingénieurs`,`+Lien`,{rel:{hiro:10}}]]],
  biotechnica:[`Corpo Plaza, premier matin`,`Les couloirs de Biotechnica sentent la terre humide. Un directeur te montre un champ de laboratoire : « Nourrir la ville, voilà notre vrai pouvoir. »`,[[`Te présenter à ton supérieur`,`+Biotechnica`,{fac:{biotechnica:10},cred:2}],[`Visiter les serres`,`+XP INTELLECT`,{xp:{int:3}}],[`Demander à voir les Badlands`,`Tu t'ouvres au monde nomade`,{fac:{aldecaldos:6},cred:2}]]],
  aldecaldos:[`Badlands, au crépuscule`,`Le camp des Aldecaldos s'installe autour d'un feu. Saul Bright raconte une vieille histoire. Panam te fait un signe. « Viens t'asseoir. »`,[[`T'asseoir près de Saul`,`+Aldecaldos`,{fac:{aldecaldos:12},cred:2}],[`Aider Mitch à réparer un camion`,`+XP TECHNIQUE`,{xp:{tech:3},rel:{panam:6}}],[`Partir seul(e) en reconnaissance`,`+XP RÉFLEXES`,{xp:{ref:3},cred:2}]]],
  wraiths:[`Badlands, un convoi de nuit`,`Les Wraiths hurlent dans leurs moteurs en traversant le désert. Nash te regarde du haut de sa moto : « Tu viens avec nous, ou tu restes sur le sable ? »`,[[`Rejoindre la course`,`+Wraiths`,{fac:{wraiths:12},cred:3}],[`Rester à l'atelier`,`+XP TECHNIQUE`,{xp:{tech:3}}],[`Observer l'ennemi, les Aldecaldos`,`+Intel`,{fac:{aldecaldos:4},cred:2}]]],
  solo:[`Badlands, seul(e)`,`Ton pick-up gémit sous le soleil. Tu n'appartiens à aucun clan, ce qui signifie que tous peuvent te croiser — amis ou ennemis.`,[[`Rouler vers un camp d'Aldecaldos`,`+Aldecaldos`,{fac:{aldecaldos:8},cred:2}],[`Suivre une piste Wraith`,`+Wraiths`,{fac:{wraiths:8},cred:2}],[`Continuer seul(e)`,`+XP`,{xp:{ref:3,tech:2},cred:2}]]],
};
card({id:`start_loc`,who:`narr`,tag:`📍 Ton quartier`,cond:()=>false,
  tx:()=>{ const s=STARTS[G.sub]||STARTS.heywood; return `<strong>${s[0]}.</strong> ${s[1]}`; },
  dyn:()=>{ const s=STARTS[G.sub]||STARTS.heywood; return s[2].map(o=>({t:o[0],s:o[1],fx:Object.assign({msg:`Une première prise de contact avec ton quartier. Il t'a déjà remarqué(e).`},o[2])})); },ch:[]});

/* ---------- Voyage ---------- */
card({id:`travel_card`,who:`narr`,tag:`🛣 Prendre la route`,cond:()=>false,
  tx:()=>`Tu pars de <strong>${locName()}</strong>. Quatre routes s'ouvrent. Chaque quartier a ses règles, ses maîtres, ses dangers — et ses opportunités.`,
  dyn:()=>{ const c=shuffle(DIST.filter(d=>d.id!==G.loc&&(!d.lock||G.flags.dogtown))).slice(0,4);
    const out=c.map(d=>{ const own=G.dist[d.id], col=ownerName(own); return {t:`${d.n}`,s:`${d.w} · ${own===`player`?`ton territoire`:col}`,fx:{loc:d.id,next:`fenc`,nav:true,hub:`trip`}}; });
    out.push({t:`Rester où tu es`,s:locName(),fx:{nav:true,hub:`trip`}}); return out; },ch:[]});
