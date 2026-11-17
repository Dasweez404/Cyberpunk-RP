/* =====================================================================
   CARTES 15 — LE CONSEIL : la politique interne de ta faction.
   Trois lieutenants persistants (nom, tempérament, loyauté) et une douzaine
   de situations, chacune avec des choix de natures différentes.
   ===================================================================== */
const LTT = {loyal:`loyal(e)`,ambi:`ambitieux(se)`,cupide:`cupide`,brute:`brutal(e)`,sage:`posé(e)`,jeune:`jeune loup`};
const SKN = {cmb:`combat`,stl:`furtivité`,hck:`hack`,drv:`conduite`};
const ltFid = () => G.member||(G.mine&&G.mine.fac)||null;
function lts(){
  G.lts=G.lts||[];
  for(let i=0;i<3;i++){
    if(G.lts[i]) continue;
    const used=G.lts.filter(Boolean).map(l=>l.t), free=Object.keys(LTT).filter(t=>!used.includes(t)), fid=ltFid(), f=FAC[fid]||{k:`gang`,c:`#ff2a6d`};
    const n=genNpc(f.k,f.c,`Lieutenant`,fid), t=pickR(free.length?free:Object.keys(LTT));
    G.lts[i]={n:n.n,t,q:n.q,loy:0};
  }
  return G.lts;
}
const ltName = l => `<strong>${l.n}</strong>`;
const ltTag = l => `${l.n} (${LTT[l.t]})`;
function ltMove(i,d){
  const l=lts()[i]; if(!l) return; l.loy=clamp(l.loy+d,-4,4);
  chip(d>0?`p`:`n`,`${d>0?`+`:`−`} ${l.n.split(` `)[0]}`);
  if(l.loy<=-3&&[`ambi`,`brute`,`cupide`].includes(l.t)&&!G.flags.coupQ&&(G.mine||isLeader())){ G.flags.coupQ=true; addEcho(`leader_coup`,rnd(4,7)); chip(`n`,`⚠ ${l.n.split(` `)[0]} rumine sa rancune`); }
}
function ltOut(i,why){
  const l=lts()[i]; if(!l) return; G.lts[i]=null; const nl=lts()[i];
  chip(`n`,`${l.n} ${why||`quitte la famille`}`); chip(`i`,`${nl.n} prend sa place`);
  G.log.unshift({d:dateStr(),m:`${l.n} ${why||`quitte la famille`}. ${nl.n} le/la remplace.`});
}
const mn = (k=1) => Math.round((500+G.cred*28)*k/50)*50;
const rp = n => G.member?{fac:{[G.member]:n}}:{};
const mix = (...a) => Object.assign({},...a);
const O = (t,s,fx,x) => Object.assign({t,s,fx},x||{});
const K = (t,a,dc,ok,ko,sk,s) => ({t,s:s||`${ATTRS[a].n}${sk?` · ${SKN[sk]}`:``}`,chk:{a,k:sk,dc,ok,ko}});
const PAY = (t,price,fx,s) => ({t,s:s||`−${price.toLocaleString(`fr`)} €$`,req:R.ed(price),fx:mix({ed:-price},fx)});

/* A, B, C = lieutenants ; F = ta famille ; riv = faction rivale */
const CNC = [
 /* 1. dispute de territoire */
 {id:`dispute`,tag:`Dissension`,tx:(c)=>`${ltName(c.A)} et ${ltName(c.B)} s'affrontent devant tout le monde sur le partage d'un secteur. ${c.A.n.split(` `)[0]} est ${LTT[c.A.t]}, ${c.B.n.split(` `)[0]} est ${LTT[c.B.t]}. Le conseil se tourne vers toi.`,
  o:(c)=>[
   O(`Soutenir ${c.A.n.split(` `)[0]}`,`${c.B.n.split(` `)[0]} t'en voudra`,mix({cred:2,fn:`ltAup_Bdn`,msg:`${c.A.n} hoche la tête. ${c.B.n} ravale sa colère.`},rp(3))),
   O(`Soutenir ${c.B.n.split(` `)[0]}`,`${c.A.n.split(` `)[0]} t'en voudra`,mix({cred:2,fn:`ltBup_Adn`,msg:`${c.B.n} sourit. ${c.A.n} baisse les yeux.`},rp(3))),
   K(`Couper le secteur en deux`,`cool`,7,mix({cred:4,hum:2,fn:`ltAup_Bup`,msg:`Un compromis bancal mais honorable. Les deux repartent à demi satisfaits.`},rp(4)),{cred:-2,fn:`ltAdn_Bdn`,msg:`Ton partage ne contente personne. Le conseil grince.`}),
   K(`Leur faire régler ça au poing, sous tes yeux`,`body`,6,{cred:4,fn:`ltAup_Bup`,msg:`Dix minutes de coups, une poignée de main. L'affaire est close.`},{hp:-10,fn:`ltAdn_Bdn`,msg:`Le duel dégénère, tu dois séparer deux hommes ensanglantés.`},`cmb`),
   PAY(`Compenser les deux avec une prime`,mn(1.2),{cred:2,fn:`ltAup_Bup`,msg:`L'argent calme les egos. Pour cette fois.`}),
   O(`Exclure celui qui a tort`,`Un des deux part pour de bon`,{cred:3,echo:{leader_coup:7},fn:`ltOutB`,msg:`${c.B.n} jette son insigne. La salle se fige.`},{heavy:`Tu exclus ${c.B.n} de la famille. Il pourrait chercher à se venger.`}),
  ]},
 /* 2. la paie */
 {id:`paie`,tag:`Les soldats grondent`,tx:(c)=>`Les hommes réclament une meilleure part : les affaires ont tourné, pas leurs poches. ${ltName(c.A)} porte la voix de la base, ${ltName(c.C)} te regarde sans rien dire.`,
  o:(c)=>[
   PAY(`Augmenter tout le monde`,mn(1.5),{cred:3,hum:2,fn:`ltAup`,msg:`Des cris de joie. Pour quelques semaines, tes ordres sont des cadeaux.`}),
   O(`Refuser, la caisse est vide`,`Les rangs murmurent`,{cred:-2,fn:`ltAdn`,msg:`${c.A.n} serre la mâchoire. Le mécontentement couve.`}),
   K(`Promettre un gros coup avant la fin du mois`,`cool`,7,{cred:3,echo:{fac_revenge:3},msg:`Ta promesse fait taire la salle. Il faudra la tenir.`},{cred:-3,fn:`ltAdn`,msg:`Personne ne te croit. Les regards sont lourds.`}),
   K(`Aller toi-même rapporter la paie`,`ref`,7,{ed:mn(1.4),cred:4,msg:`Tu reviens avec une mallette et un sourire. La base t'applaudit.`},{hp:-12,cred:-1,msg:`Le coup tourne mal. Tu rentres les mains vides et blessé(e).`},`stl`),
   O(`Prélever sur la part des lieutenants`,`Ils ne vont pas aimer`,{cred:2,fn:`ltCdn`,msg:`${c.C.n} encaisse sans un mot. Il/elle s'en souviendra.`}),
  ]},
 /* 3. soupçon de trahison */
 {id:`soupcon`,tag:`Une taupe ?`,tx:(c)=>`${ltName(c.A)} affirme que quelqu'un parle à l'extérieur : une livraison a été interceptée, un rendez-vous éventé. Il/elle accuse ${ltName(c.B)}, qui nie. ${c.B.n.split(` `)[0]} ${c.B.q}.`,
  o:(c)=>[
   K(`Mener ta propre enquête`,`int`,7,{cred:4,hum:2,fn:`ltAup`,msg:`Tu retrouves la trace : ce n'est ni l'un ni l'autre, mais un petit larbin soudoyé. Les deux te doivent une.`},{cred:-2,fn:`ltBdn`,msg:`Tu ne trouves rien de net. Le soupçon reste et ronge.`}),
   O(`Croire ${c.B.n.split(` `)[0]}`,`${c.A.n.split(` `)[0]} se sent désavoué(e)`,{cred:1,fn:`ltBup_Adn`,msg:`${c.B.n} te remercie du regard. ${c.A.n} détourne la tête.`}),
   O(`Croire ${c.A.n.split(` `)[0]} et mettre ${c.B.n.split(` `)[0]} au pas`,`Lui retirer ses responsabilités`,{cred:2,fn:`ltAup_Bdn`,msg:`${c.B.n} est relégué(e) aux tâches ingrates, humilié(e).`}),
   K(`Tendre un piège : une fausse livraison`,`cool`,8,mix({cred:5,ed:mn(.6),msg:`Le piège se referme sur la vraie taupe, un guetteur payé par un rival. Beau coup.`},rp(3)),{cred:-2,hp:-8,msg:`Le piège rate. Ta fausse livraison a vraiment été volée.`}),
   K(`Interroger les deux, seul à seul(e)`,`body`,7,{cred:3,hum:-2,fn:`ltBdn`,msg:`Tu obtiens un nom, au prix d'un peu de peur. L'efficacité a un goût de fer.`},{hum:-3,cred:-1,msg:`Ils ne disent rien. Tu t'es sali les mains pour rien.`},`cmb`),
   O(`Tout le monde reste, mais tu surveilles`,`Prudence`,{cred:1,msg:`Tu fais comme si de rien n'était, et tu gardes un œil sur chacun.`}),
  ]},
 /* 4. succession d'un siège de lieutenant */
 {id:`succession`,tag:`Un poste vacant`,lead:true,tx:(c)=>`Un siège de lieutenant se libère. ${ltName(c.A)} le veut pour sa loyauté, ${ltName(c.B)} pour son talent, et un outsider du quartier propose ses services contre un tribut. Tu as le dernier mot.`,
  o:(c)=>[
   O(`${c.A.n.split(` `)[0]} : le/la fidèle`,`La famille se resserre`,{cred:2,fn:`ltAup_Bdn`,msg:`${c.A.n} prête serment à genoux. La famille s'applaudit elle-même.`}),
   O(`${c.B.n.split(` `)[0]} : le/la plus doué(e)`,`Plus d'efficacité, moins de loyauté`,{cred:3,fn:`ltBup_Adn`,msg:`${c.B.n} prend la place avec un sourire carnassier.`}),
   PAY(`Prendre l'outsider contre tribut`,mn(1),{cred:2,fn:`recruit`,msg:`Un visage neuf, des relations neuves. Les deux autres le regardent de travers.`}),
   K(`Organiser une épreuve publique`,`cool`,7,{cred:5,hum:2,fn:`ltAup_Bup`,msg:`Tout le monde accepte le verdict de l'épreuve. Rare et précieux.`},{cred:-2,fn:`ltAdn_Bdn`,msg:`L'épreuve tourne à la farce. Tu perds en autorité.`}),
   O(`Laisser le siège vacant`,`Aucun content, aucun révolté`,{cred:-1,msg:`Tu gagnes du temps, pas de la reconnaissance.`}),
  ]},
 /* 5. un envoyé rival */
 {id:`envoye`,tag:`Un envoyé rival`,tx:(c)=>`Un émissaire de <strong>${c.riv}</strong> demande audience : il propose une trêve de quelques mois, contre un tribut symbolique. ${ltName(c.B)} flaire le piège, ${ltName(c.A)} veut la paix.`,
  o:(c)=>[
   PAY(`Accepter la trêve avec tribut`,mn(.8),mix({cred:2,hum:3,fn:`ltAup_Bdn`,msg:`Une poignée de main, un coffret d'eddies. La rue se calme.`},{fac:{[c.rivId]:6}})),
   O(`Refuser net`,`${c.riv} le retiendra`,mix({cred:3,msg:`L'envoyé repart sans un mot. La guerre froide s'allonge.`},{fac:{[c.rivId]:-6}})),
   K(`Négocier sans tribut`,`cool`,8,mix({cred:5,msg:`Tu obtiens la trêve sans payer. Ton culot fait le tour du quartier.`},{fac:{[c.rivId]:3}}),mix({cred:-2,msg:`L'envoyé sourit : il avait prévu ta réponse.`},{fac:{[c.rivId]:-3}})),
   K(`Le suivre et lire son terminal`,`int`,8,{ed:mn(.8),cred:3,msg:`Tu apprends son plan et empoches un dossier intéressant.`},{cred:-2,msg:`Il s'en aperçoit. L'incident fait jaser.`},`hck`),
   O(`Lui tendre une embuscade`,`Très risqué`,mix({cred:6,hum:-5,echo:{fac_revenge:4},msg:`Tu fais un exemple. ${c.riv} ne l'oubliera jamais.`},{fac:{[c.rivId]:-18}}),{heavy:`Tuer un émissaire, c'est la guerre ouverte avec ${c.riv}.`}),
  ]},
 /* 6. hommage à un mort */
 {id:`deuil`,tag:`Un enterrement`,tx:(c)=>`Un vieux de la famille est mort cette semaine. ${ltName(c.C)} organise la veillée. Tout le monde attend un mot de toi, sur le toit d'un parking, au milieu des bougies et des canettes.`,
  o:(c)=>[
   PAY(`Offrir des funérailles dignes`,mn(.9),{hum:6,cred:3,fn:`ltCup`,msg:`Une vraie cérémonie. Les anciens essuient une larme.`}),
   K(`Faire un discours`,`cool`,6,{hum:5,cred:4,msg:`Tu trouves les mots. La famille se serre autour de toi.`},{cred:-1,msg:`Les mots s'emmêlent. Le silence est long.`}),
   O(`Jurer vengeance`,`Une dette de sang`,{cred:3,hum:-3,echo:{fac_revenge:3},msg:`Tu lèves un verre à ceux qui paieront. Tout le monde frissonne.`}),
   O(`Rester à l'écart, droit(e) et silencieux(se)`,`Ta présence suffit`,{hum:1,cred:1,msg:`Tu restes debout deux heures sans dire un mot. Ça en dit long.`}),
   O(`Passer ton tour`,`Les affaires n'attendent pas`,{cred:-2,hum:-2,fn:`ltCdn`,msg:`Tu n'es pas venu(e). On s'en souviendra.`}),
  ]},
 /* 7. les jeunes veulent la guerre */
 {id:`jeunes`,tag:`Les jeunes loups`,tx:(c)=>`Une dizaine de jeunes, menés par ${ltName(c.C)}, veulent en découdre avec <strong>${c.riv}</strong> : « On est prêts ! On n'attend plus ! » Les vétérans lèvent les yeux au ciel.`,
  o:(c)=>[
   O(`Donner le feu vert`,`Fierté, mais des risques`,mix({cred:4,hum:-2,hp:-6,echo:{fac_revenge:2},fn:`ltCup`,msg:`Ils partent en hurlant. Certains reviennent, d'autres pas.`},{fac:{[c.rivId]:-10}})),
   O(`Interdire`,`Ils vont mal le prendre`,{cred:-1,fn:`ltCdn`,msg:`Ils baissent les yeux, mais pas les poings.`}),
   K(`Canaliser leur énergie dans un raid maîtrisé`,`cool`,7,mix({ed:mn(1),cred:4,fn:`ltCup`,msg:`Tu transformes une émeute en opération. Ils t'adorent.`},{fac:{[c.rivId]:-5}}),{hp:-8,cred:-2,msg:`Le raid tourne au désordre. Tu limites les dégâts.`}),
   K(`Les accompagner en première ligne`,`body`,7,mix({cred:6,hum:2,fn:`ltCup`,msg:`Tu te bats à leurs côtés. Ils parleront de ce soir pendant des années.`},{fac:{[c.rivId]:-8}}),{hp:-18,cred:-1,msg:`Un guet-apens. Tu t'en tires de justesse.`},`cmb`),
   PAY(`Les calmer avec une soirée`,mn(.6),{cred:1,hum:3,fn:`ltCup`,msg:`Musique, alcool, filles et garçons : la fièvre retombe.`}),
  ]},
 /* 8. un lieutenant écrème */
 {id:`ecreme`,tag:`Scandale de caisse`,tx:(c)=>`Les comptes ne collent pas : ${ltName(c.B)} se serait servi(e) dans la caisse. ${c.B.n.split(` `)[0]} jure que c'est une erreur. ${c.B.n.split(` `)[0]} ${c.B.q}.`,
  o:(c)=>[
   O(`Punir publiquement`,`Exemplaire, brutal`,{cred:4,hum:-3,fn:`ltBdn`,msg:`Tu fais un exemple. Les autres comptent plus honnêtement.`}),
   O(`Faire rembourser en privé`,`Discret, l'ego est sauf`,{cred:2,ed:mn(.5),fn:`ltBup`,msg:`${c.B.n} te remet une enveloppe, penaud(e). Tu gardes ça pour toi.`}),
   O(`Prendre ta part et fermer les yeux`,`Complice`,{ed:mn(.6),hum:-4,cred:-1,fn:`ltBup`,msg:`Tu empoches ta commission. Tout le monde se tait. Tout le monde sait.`}),
   K(`Vérifier si ce n'est pas un coup monté`,`int`,7,{cred:4,fn:`ltBup_Adn`,msg:`C'était ${c.A.n}, qui voulait ta place. Tu le/la remets en place.`},{cred:-1,msg:`Rien de concluant. Tu perds du temps et un peu de crédit.`},`hck`),
   K(`Offrir une seconde chance`,`cool`,6,{hum:5,cred:3,fn:`ltBup`,msg:`${c.B.n} te jure fidélité. Un serment, ça pèse, à Night City.`},{cred:-3,msg:`Il/elle recommence dans la semaine. Tu passes pour naïf(ve).`}),
   O(`Le/la chasser`,`Un nouveau lieutenant arrive`,{cred:2,hum:-2,fn:`ltOutB`,msg:`${c.B.n} part, rouge de honte.`},{heavy:`Tu renvoies ${c.B.n} de la famille. Il/elle gardera des rancunes.`}),
  ]},
 /* 9. offre corpo */
 {id:`corpo`,tag:`Une offre corpo`,tx:(c)=>`Un cadre en costard propre propose un marché à ta famille : un coup de main discret dans le quartier, contre un virement conséquent. ${ltName(c.A)} y voit une chance, ${ltName(c.C)} un risque.`,
  o:(c)=>[
   O(`Accepter`,`Gros virement · les corpos te regardent`,{ed:mn(2),cred:2,bloc:{corpo:8,rue:-4},msg:`Le contrat est signé en une poignée de secondes.`}),
   O(`Refuser, la rue d'abord`,`Réputation de rue`,{cred:3,hum:3,bloc:{rue:-4,corpo:-3},fn:`ltAdn`,msg:`Le cadre quitte la pièce, polissé et vexé.`}),
   K(`Négocier un meilleur prix`,`cool`,8,{ed:mn(3),cred:4,bloc:{corpo:6},msg:`Tu fais doubler la mise. Le cadre sourit, tu souris plus fort.`},{cred:-1,msg:`Il retire son offre, vexé.`}),
   K(`Copier ses fichiers pendant la réunion`,`int`,8,{ed:mn(1.5),cred:4,loot:1,msg:`Tu repars avec un dossier compromettant et un petit extra.`},{cred:-3,bloc:{corpo:10},msg:`Détecté. Les corpos vont réagir.`},`hck`),
   K(`Piéger le cadre et le faire chanter`,`ref`,8,{ed:mn(2),cred:5,hum:-3,msg:`Une photo, une ligne de crédit, un fantôme de conscience.`},{hp:-12,cred:-2,bloc:{corpo:8},msg:`Ses gardes du corps n'étaient pas dans le plan.`},`stl`),
  ]},
 /* 10. quartier en détresse */
 {id:`quartier`,tag:`Le quartier demande de l'aide`,tx:(c)=>`Des familles du quartier viennent te voir : un dealer vend des saletés à leurs enfants, et la police ne bouge pas. ${ltName(c.A)} y voit une occasion de gagner de la sympathie.`,
  o:(c)=>[
   K(`Régler ça toi-même`,`body`,6,{cred:5,hum:5,bloc:{rue:3},msg:`Le dealer disparaît de la rue. Les familles t'ouvrent leurs portes.`},{hp:-12,cred:-1,msg:`Il avait des amis. Tu repars avec des bleus.`},`cmb`),
   O(`Envoyer ${c.A.n.split(` `)[0]}`,`Il/elle y gagnera en prestige`,{cred:3,hum:3,fn:`ltAup`,msg:`${c.A.n} s'en occupe avec brio. Les familles saluent son nom.`}),
   PAY(`Payer une clinique et une patrouille`,mn(1),{hum:6,cred:3,bloc:{rue:3},msg:`Le quartier respire. Ça coûte, mais ça paie en loyauté.`}),
   K(`Retourner le dealer contre ses fournisseurs`,`cool`,7,{ed:mn(.6),cred:4,msg:`Il balance ses patrons, tu encaisses la reconnaissance et un dédommagement.`},{cred:-1,msg:`Il se rétracte devant des menaces. L'affaire est enterrée.`}),
   O(`Prélever une taxe sur les familles`,`Protection payante`,{ed:mn(.9),hum:-5,cred:-1,bloc:{rue:-4},msg:`Tu encaisses. Ils paieront, mais pas sans te détester.`}),
   O(`Ignorer`,`Pas ton problème`,{hum:-2,cred:-1,msg:`Les familles repartent, déçues. Elles s'en souviendront.`}),
  ]},
 /* 11. défection d'un vétéran */
 {id:`veteran`,tag:`Un vétéran veut partir`,tx:(c)=>`${ltName(c.C)}, vieux de la vieille, vient te voir : « Je suis fatigué(e). Je veux raccrocher. » Mais ${c.C.n.split(` `)[0]} en sait trop, et le conseil l'écoute avec attention.`,
  o:(c)=>[
   O(`Le/la laisser partir avec ta bénédiction`,`Digne, un peu risqué`,{hum:5,cred:2,fn:`ltOutC`,msg:`Une accolade, un verre, et ${c.C.n} tire sa révérence.`}),
   O(`Refuser, la famille ne se quitte pas`,`Il/elle restera, amer(e)`,{cred:-1,fn:`ltCdn`,msg:`${c.C.n} reste, mais plus comme avant.`}),
   PAY(`Offrir une retraite généreuse`,mn(1.2),{hum:6,cred:4,fn:`ltOutC`,msg:`${c.C.n} pleure en serrant l'enveloppe. Les anciens sont émus.`}),
   O(`Lui proposer de devenir conseiller·ère`,`Il/elle garde son statut`,{cred:3,hum:2,fn:`ltCup`,msg:`${c.C.n} accepte, ravi(e) : la sagesse sans la poussière.`}),
   K(`Le/la mettre à l'épreuve`,`cool`,8,{cred:4,fn:`ltCup`,msg:`Tu le/la convaincs que la famille a encore besoin de lui/elle.`},{cred:-2,fn:`ltCdn`,msg:`Il/elle te regarde avec dédain et part en claquant la porte.`}),
  ]},
 /* 12. nouvelle chrome / matériel */
 {id:`chrome`,tag:`L'arsenal`,tx:(c)=>`${ltName(c.A)} ramène un lot de matériel : implants d'occasion, armes sans numéro de série, un tableau de bord piraté. « Ça coûte, mais ça vous met à niveau. » Tous les regards tombent sur toi.`,
  o:(c)=>[
   PAY(`Tout acheter`,mn(2),{cred:4,loot:1,fn:`ltAup`,msg:`Ta famille s'équipe. Ta réputation de puissance grimpe.`}),
   PAY(`Acheter la moitié`,mn(1),{cred:2,fn:`ltAup`,msg:`Du matériel solide, sans excès.`}),
   K(`Marchander le lot`,`cool`,7,{cred:3,loot:1,ed:mn(.4),msg:`Tu rapportes le lot pour moitié prix et une remise sur les prochaines.`},{cred:-1,msg:`Il refuse de négocier. Tu repars sans rien.`}),
   K(`Inspecter la marchandise`,`tech`,7,{cred:3,loot:1,fn:`ltAup`,msg:`Tu repères les pièces défectueuses et achètes seulement le bon.`},{ed:-mn(.6),cred:-2,msg:`Un lot piégé. Tu perds de l'argent.`}),
   O(`Refuser, tout ça pue le volé`,`Prudence`,{cred:1,hum:2,fn:`ltAdn`,msg:`${c.A.n} remballe, vexé(e).`}),
  ]},
 /* 13. contestation publique (chef) */
 {id:`defi`,tag:`Ton autorité contestée`,lead:true,tx:(c)=>`${ltName(c.B)} te défie devant tout le monde : « La famille mérite mieux. Je dis ce que les autres pensent. » Les hommes retiennent leur souffle. ${c.B.n.split(` `)[0]} ${c.B.q}.`,
  o:(c)=>[
   K(`Relever le défi en duel`,`body`,8,{cred:7,hum:-2,fn:`ltBdn`,msg:`Tu l'emportes net. Personne ne conteste plus ton autorité.`},{hp:-20,cred:-4,fn:`ltBup`,msg:`Tu perds le duel, pas la face. De justesse.`},`cmb`),
   K(`Le/la retourner par la parole`,`cool`,8,{cred:6,fn:`ltBup`,msg:`Tu retournes sa harangue contre lui/elle. L'assemblée rit, puis t'applaudit.`},{cred:-3,fn:`ltBdn`,msg:`Tes mots tombent à plat. Le doute s'installe.`}),
   PAY(`L'acheter avec un poste`,mn(1.4),{cred:2,fn:`ltBup`,msg:`Le poste est un pot-de-vin déguisé. Ça marche, pour l'instant.`}),
   O(`L'exclure sur-le-champ`,`Autorité brutale`,{cred:4,hum:-3,echo:{leader_coup:6},fn:`ltOutB`,msg:`Tu le/la fais sortir. Le silence est total.`},{heavy:`Tu exclus ${c.B.n} publiquement. Ses amis risquent de ne pas oublier.`}),
   O(`Ignorer la provocation`,`Faible mais calme`,{cred:-4,fn:`ltBup`,msg:`Tu laisses passer. Certains murmurent que tu as peur.`}),
  ]},
 /* 14. une alliée vient de loin */
 {id:`message`,tag:`Une rumeur`,tx:(c)=>`Une rumeur circule : <strong>${c.riv}</strong> prépare un coup contre l'un de vos quartiers. ${ltName(c.A)} veut frapper d'abord, ${ltName(c.C)} préfère renforcer les gardes.`,
  o:(c)=>[
   K(`Frapper d'abord`,`body`,7,mix({cred:5,ed:mn(.8),msg:`Tu prends l'initiative. L'attaque rivale tombe à l'eau.`},{fac:{[c.rivId]:-8}}),mix({hp:-14,cred:-2,msg:`La rumeur était fausse. Tu as frappé dans le vide.`},{fac:{[c.rivId]:-8}}),`cmb`),
   O(`Renforcer les gardes`,`Prudent`,{cred:2,fn:`ltCup`,msg:`Les gardes doublent. Aucune attaque ne vient, la rumeur retombe.`}),
   K(`Envoyer un espion vérifier`,`int`,7,{cred:4,ed:mn(.4),fn:`ltAup`,msg:`Ton espion rapporte la vérité : un simple bluff. Tu gardes ton calme.`},{cred:-1,msg:`Ton espion n'est jamais revenu.`},`stl`),
   O(`Prévenir un allié`,`Ça sert d'avoir des amis`,{cred:2,hum:1,msg:`Ton allié t'envoie des hommes. L'attaque, si elle venait, serait un suicide.`}),
   O(`Ne rien faire`,`La rumeur est une rumeur`,{cred:-1,msg:`Rien ne se passe. Cette fois.`}),
  ]},
];

function rivalOf(){
  const own=ltFid(), foes=(FAC[own]&&FAC[own].foes||[]).filter(f=>FAC[f]&&f!==own);
  const pool=foes.length?foes:Object.keys(FAC).filter(f=>f!==own&&[`gang`,`clan`,`corp`].includes(FAC[f].k));
  const id=pickR(pool); return {id,n:FAC[id].n};
}
function pickScn(){
  G.cncl=G.cncl||[]; const lead=!!(G.mine||isLeader());
  let pool=CNC.filter(s=>(!s.lead||lead)&&!G.cncl.slice(-7).includes(s.id));
  if(!pool.length) pool=CNC.filter(s=>!s.lead||lead);
  const s=pickR(pool); G.cncl.push(s.id); if(G.cncl.length>20) G.cncl.shift(); return s;
}
card({id:`conseil`,who:`@fac`,tag:`🏛 Conseil`,w:9,cond:()=>(G.mine||(G.member&&G.rank>=2))&&!G.flags.q_active,
  tx:()=>{
    const L=lts(), sc=pickScn(), rv=rivalOf();
    const idx=shuffle([0,1,2]);
    const c={A:L[idx[0]],B:L[idx[1]],C:L[idx[2]],riv:rv.n,rivId:rv.id,F:G.mine?G.mine.name:(FAC[G.member]?FAC[G.member].n:`ta famille`)};
    G.tmp={sc:sc.id,ia:idx[0],ib:idx[1],ic:idx[2],c};
    const me=byId.conseil; if(me) me.tag=`🏛 Conseil · ${sc.tag}`;
    return `${sc.tx(c)}`;
  },
  dyn:()=>{ const sc=CNC.find(s=>s.id===G.tmp.sc); return sc?sc.o(G.tmp.c):[O(`Passer`,``,{})]; },ch:[]});
