/* =====================================================================
   CARTES 14 — l'Afterlife côté factions et fixers, ordres d'un patron,
   quêtes locales en 3 étapes (selon le quartier où tu arrives),
   trames de ta propre faction (netrunners, gang, fixers, nomades)
   ===================================================================== */
const SRV_OK = () => G.stats.cards-(G.facSrvP===undefined?-9:G.facSrvP)>=5?``:`Déjà sollicité récemment`;

/* ---------- Hub : factions & fixers ---------- */
card({id:`hub_fac`,quick:true,who:`@hub`,tag:`🛡 Afterlife · Factions & fixers`,cond:()=>false,
  tx:()=>{
    if(G.member&&!isLeader()) return `Dans un coin de l'Afterlife, quelqu'un de <strong>${FAC[G.member].n}</strong> te fait signe. « ${rankTitle()}. Tu es là. Parlons famille. »`;
    if(G.mine||isLeader()) return `Tes hommes t'attendent à une table du fond. Les affaires de <strong>${G.mine?G.mine.name:FAC[G.member].n}</strong> n'attendent pas.`;
    return `L'Afterlife, c'est aussi le marché des loyautés. Des recruteurs de gangs, des fixers qui cherchent des mains. Qui veux-tu écouter ?`; },
  dyn:()=>{
    const out=[], back={t:`Retourner au bar`,s:`Tu gardes ton tour`,fx:{hubBack:true}};
    if(G.member&&!isLeader()){
      const f=FAC[G.member], r=G.rank;
      out.push({t:`Prendre les ordres de ${f.n}`,s:`Une mission · du poids pour ta promotion`,fx:{next:`fjob_${G.member}`,nav:true,hub:`fac`}});
      out.push({t:`Demander des soins à tes frères`,s:`Rang 1 · +35 Santé · gratuit`,req:()=>r<1?`Rang 1 requis`:SRV_OK(),fx:{hp:35,hum:3,fn:`facSrv`,hub:`fac`,msg:`Un des tiens te recoud dans l'arrière-salle, sans poser de questions.`}});
      out.push({t:`Demander qu'on t'oublie un peu`,s:`Rang 2 · toutes les poursuites −15`,req:()=>r<2?`Rang 2 requis`:SRV_OK(),fx:{bloc:{loi:18,corpo:18,rue:18,nomad:18},fn:`facSrv`,hub:`fac`,msg:`Quelques coups de fil, un dossier qui se perd. Tu sens la pression retomber.`}});
      out.push({t:`Toucher ta part de la famille`,s:`Rang 3 · +1 500 €$`,req:()=>r<3?`Rang 3 requis`:SRV_OK(),fx:{ed:1500,fn:`facSrv`,hub:`fac`,msg:`Une enveloppe épaisse, glissée sous la table. « Pour ta loyauté. »`}});
    } else if(G.mine||isLeader()){
      if(typeof empireEligible===`function`&&empireEligible()) out.push({t:`Passer tes recrues en revue`,s:`Des candidats t'attendent`,fx:{next:`emp_recruit`,nav:true,hub:`fac`}});
      if(typeof ownedList===`function`&&ownedList().length) out.push({t:`Faire la tournée de tes affaires`,s:`Racket, protection, tenue des quartiers`,fx:{next:`emp_collect`,nav:true,hub:`fac`}});
      if(typeof empireEligible===`function`&&empireEligible()) out.push({t:`Préparer une opération`,s:`Un quartier mal gardé`,fx:{next:`emp_siege_1`,nav:true,hub:`fac`}});
    } else {
      shuffle(ENC_ORDER.filter(id=>FAC[id]&&canJoin(id))).slice(0,2).forEach(id=>{ const f=FAC[id];
        out.push({t:`Écouter le recruteur de ${f.n}`,s:`${f.perk}`,heavy:`Tu prêtes serment à ${f.n}. Ses ennemis deviennent les tiens, et tu ne pourras plus fonder ta propre faction.`,fx:{join:id,cred:2,hub:`fac`,msg:`Une poignée de main, un regard long. Tu es des leurs.`}}); });
      if(!G.patron){ const fx=FIXERS.filter(i=>WHO[i]); const id=fx[rnd(0,fx.length-1)];
        out.push({t:`Te mettre au service de ${WHO[id].n}`,s:`Fixer · des ordres réguliers, des gains +15 %, un lien fort`,fx:{patron:id,rel:{[id]:12},cred:2,hub:`fac`,msg:`${WHO[id].n} sourit sans chaleur. « Maintenant, tu travailles pour moi. Les ordres arriveront. »`}}); }
      else out.push({t:`Prendre les ordres de ${WHO[G.patron].n}`,s:`Ton patron a une tâche pour toi`,fx:{next:`patron_order`,nav:true,hub:`fac`}});
      out.push({t:`Prendre un contrat en plusieurs temps`,s:`Un fixer te présente une affaire`,req:()=>QOK()?``:`Une quête est déjà en cours`,fx:{next:`fix_board`,nav:true,hub:`fac`}});
    }
    out.push(back); return out; },ch:[]});

/* ---------- Ordres d'un patron fixer ---------- */
const PO_WAYS = [{t:`Exécuter à la lettre`,a:`cool`,ko:10},{t:`Régler ça par la force`,a:`body`,k:`cmb`,ko:20},{t:`Ruser et contourner`,a:`int`,ko:12},{t:`Y aller discrètement`,a:`ref`,k:`stl`,ko:14}];
card({id:`patron_order`,who:`fix`,tag:`📞 Ordres de ton patron`,cond:()=>false,
  tx:()=>{ const id=G.patron; G.tmp={g:rnd(0,SM_GOALS.length-1)}; return `<strong>${id?WHO[id].n:`Ton patron`}</strong> n'a pas de temps à perdre : « J'ai un boulot. <strong>${SM_GOALS[G.tmp.g]}</strong>. Tu es mon exécutant, c'est le moment de le prouver. »`; },
  dyn:()=>{ const pay=Math.round((650+G.cred*38)*1.15/50)*50, id=G.patron||`dex`;
    const out=shuffle(PO_WAYS).slice(0,3).map(w=>({t:w.t,s:`${ATTRS[w.a].n} · ${money(pay)}`,chk:{a:w.a,k:w.k,dc:7+(G.cred>=40?1:0),
      ok:{ed:pay,cred:3,rel:{[id]:6},fn:`sideDone`,loot:pay>=2000?1:0,msg:`Boulot fait. Ton patron te paie sans un mot, signe de respect.`},
      ko:{hp:-w.ko,rel:{[id]:-3},cred:-1,msg:`Ça tourne mal. Ton patron te le fera payer.`}}}));
    out.push({t:`Refuser`,s:`Ton patron ne l'oubliera pas`,heavy:`Refuser un ordre fâche ton patron. Trois refus, et il te lâche.`,fx:{rel:{[id]:-8},fn:`patronRefuse`,msg:`« Je m'en souviendrai. »`}});
    return out; },ch:[]});

/* ---------- Quêtes locales : chaque quartier a ses histoires ---------- */
const LQT = {
  gang:[
    [`Dans {D}, les gens de {F} te remarquent. Un lieutenant te propose un test : une dette impayée à récupérer chez un commerçant têtu.`,[[`Lui faire peur sans le blesser`,`cool`,null,7,`Il paie, tremblant. Le lieutenant hoche la tête.`],[`Lui casser une vitrine, pour l'exemple`,`body`,`cmb`,7,`Tout le quartier entend. La dette est payée à midi.`]]],
    [`Le lieutenant te présente à son supérieur. « Un rival nous vole des livraisons. Trouve qui. »`,[[`Surveiller les entrepôts`,`int`,null,8,`Une camionnette, un horaire, un nom.`],[`Corrompre un chauffeur`,`cool`,null,8,`Un billet, un nom, une adresse.`]]],
    [`Tu tiens le voleur : un jeune de ton âge, terrifié, mais avec des amis armés. {F} attend ton verdict.`,[[`Le régler dans la rue`,`body`,`cmb`,9,`Un duel court. {F} te tape sur l'épaule.`],[`Négocier une trêve`,`cool`,null,8,`Une poignée de main devant témoins. {F} te doit une faveur.`]]]],
  net:[
    [`Dans {D}, un netrunner de {F} t'aborde discrètement : « Un serveur local contient une clé qu'on veut. Tu as l'air capable. »`,[[`Analyser le serveur`,`int`,`hck`,7,`Un point faible dans le pare-feu.`],[`Observer les gardes physiques`,`ref`,`stl`,7,`Le planning des rondes est clair.`]]],
    [`Le serveur est protégé par une IA de défense. Elle te parle, poliment : « Tu es perdu(e) ? »`,[[`Lui faire croire que tu es un admin`,`cool`,null,8,`Elle s'excuse et te laisse passer.`],[`Lui injecter un virus`,`int`,`hck`,8,`Elle hurle en binaire, puis se tait.`]]],
    [`La clé est entre tes mains. {F} te propose de la leur remettre... ou de la garder pour toi.`,[[`La remettre à {F}`,`cool`,null,7,`Ils te rendent hommage devant tout le Net.`],[`La copier avant de la rendre`,`int`,`hck`,9,`Une copie secrète. Qui sait ce qu'elle ouvre ?`]]]],
  mox:[
    [`Dans {D}, une des {F} te prend à part : « Un client violent harcèle une de nos filles. On ne peut pas appeler la police. Tu peux nous aider ? »`,[[`Le trouver et lui parler`,`cool`,null,7,`Il comprend vite que tu n'es pas seul(e).`],[`Le filer jusqu'à sa planque`,`ref`,`stl`,7,`Tu sais où il dort.`]]],
    [`Il a des amis : trois types, un bar, une bande qui se sent protégée. Les {F} comptent sur toi pour les convaincre.`,[[`Les affronter`,`body`,`cmb`,8,`Tu ne leur laisses pas une chance de rire.`],[`Les piéger par la parole`,`cool`,null,8,`Tu leur fais dire ce qu'il ne fallait pas.`]]],
    [`La fille est en sécurité. Susie Q veut remercier ceux qui se sont battus pour elles. Tu es invité(e) à la fête.`,[[`Raconter ce qui s'est passé`,`cool`,null,6,`La salle s'éclaire. Tu fais partie du décor.`],[`Offrir ton aide pour la suite`,`int`,null,7,`Tu es désormais un allié des {F}.`]]]],
  clan:[
    [`Dans {D}, un convoi de {F} est bloqué par une panne. Un ancien t'appelle : « Un coup de main, étranger ? »`,[[`Réparer le moteur`,`tech`,null,7,`Le camion rugit. L'ancien te sourit.`],[`Remorquer avec ton véhicule`,`ref`,`drv`,7,`Une chaîne, un coup d'accélérateur : ça tire.`]]],
    [`Le convoi repart. Une embuscade de pillards t'attend sur la crête. {F} compte sur toi.`,[[`Briser l'embuscade au volant`,`ref`,`drv`,8,`Tu passes entre deux camions, ils se bousculent.`],[`Les prendre à revers`,`body`,`cmb`,8,`Une rafale, un cri : ils s'enfuient.`]]],
    [`Au camp, l'ancien t'offre un siège près du feu. « Un chef de {F} te cherchait. Tu veux savoir pourquoi ? »`,[[`Écouter jusqu'au bout`,`cool`,null,6,`Un grand chef parle de toi à voix basse.`],[`Offrir ton aide pour la prochaine route`,`tech`,null,7,`Ils t'invitent au prochain convoi.`]]]],
  corp:[
    [`Dans {D}, un cadre de {F} te repère. « Une mission, un pourcentage, aucune trace. Intéressé(e) ? »`,[[`Écouter les détails`,`cool`,null,7,`Un dossier à récupérer, rien de plus.`],[`Vérifier sa fiche en douce`,`int`,`hck`,8,`Il est réglo. Pour une corpo.`]]],
    [`Le dossier est dans un coffre, au quarantième étage. La sécurité est stricte.`,[[`Entrer comme un employé`,`cool`,null,8,`Un badge, un sourire, un ascenseur.`],[`Pirater le coffre`,`int`,`hck`,8,`Il s'ouvre sans un bip.`]]],
    [`Tu as le dossier. Il contient des preuves contre un autre cadre de {F}. Qui veux-tu servir ?`,[[`Remettre le dossier tel quel`,`cool`,null,6,`Le cadre te paie, satisfait.`],[`Le revendre à un rival`,`int`,null,8,`Un virement, un frisson : tu viens de changer d'camp.`]]]],
  scav:[
    [`Dans {D}, un gamin des rues te prévient : des {F} rôdent autour d'une clinique de fortune. « Ils veulent prendre des organes. »`,[[`Aller voir sur place`,`ref`,`stl`,7,`Une camionnette blanche, deux silhouettes en blouse.`],[`Prévenir le docteur`,`cool`,null,6,`Il barricade les portes avec des chaises.`]]],
    [`Les {F} arrivent en force. Le docteur est paniqué. Tu as quelques minutes.`,[[`Tenir la porte`,`body`,`cmb`,8,`Ils reculent sous les coups.`],[`Piéger l'entrée`,`tech`,null,8,`Un câble, un seau d'huile : le premier tombe.`]]],
    [`Les charognards ont fui. Le docteur te regarde, bouleversé. Un de ses patients est blessé gravement.`,[[`L'aider à opérer`,`tech`,null,8,`Une heure de sueur. Le patient vit.`],[`Le transporter à la clinique de Vik`,`ref`,`drv`,8,`Une course, des feux brûlés, un patient sauvé.`]]]],
  law:[
    [`Dans {D}, un agent de {F} te fait signe : « Un trafic d'armes passe par ici. Tu connais les gens. Aide-nous. »`,[[`Repérer le dépôt`,`int`,null,7,`Une porte de garage, des horaires.`],[`Interroger un indic`,`cool`,null,7,`Il parle contre un verre.`]]],
    [`Le dépôt est gardé. L'agent veut un témoin discret, pas une fusillade.`,[[`Entrer en douce`,`ref`,`stl`,8,`Tu photographies chaque caisse.`],[`Faire diversion`,`cool`,null,8,`Un faux incendie, les gardes courent.`]]],
    [`L'arrestation tourne mal : un des gardes s'enfuit avec une valise. L'agent te regarde.`,[[`Le poursuivre`,`ref`,`drv`,8,`Une course, un tonneau : il est à terre.`],[`Le piéger par radio`,`int`,`hck`,8,`Ses portes se verrouillent, il est coincé.`]]]],
};
const LQF = (t,F,D) => t.replace(/\{F\}/g,F).replace(/\{D\}/g,D);
card({id:`lq_1`,who:`@enemy`,tag:`📍 Quêtes du quartier (1/3)`,cond:()=>false,
  tx:()=>{ const own=locOwner(); let fid=SCN[own]?own:pickR(ENC_ORDER); const kind=ARCH[fid]||`gang`, d=DMAP[G.loc]||DMAP.kabuki;
    G.lq={fid,kind,d:d.n,w:0}; G.tmp={fid}; return `<strong>${entName(fid)} · ${d.n}</strong><br>${LQF(LQT[kind][0][0],entName(fid),d.n)}`; },
  dyn:()=>{ const q=G.lq||{kind:`gang`,fid:`valentinos`,d:`ici`}; return LQT[q.kind][0][1].map(o=>({t:LQF(o[0],entName(q.fid),q.d),s:`${ATTRS[o[1]].n}${o[2]?` · ${{cmb:`combat`,stl:`furtivité`,hck:`hack`,drv:`conduite`}[o[2]]}`:``}`,
    chk:{a:o[1],k:o[2],dc:o[3],ok:{flag:[`q_active`],next:`lq_2`,fn:`lqWin`,msg:LQF(o[4],entName(q.fid),q.d)},ko:{flag:[`q_active`],hp:-10,next:`lq_2`,msg:KO[o[1]]}}})); },ch:[]});
card({id:`lq_2`,who:`@enemy`,tag:`📍 Quêtes du quartier (2/3)`,cond:()=>false,
  tx:()=>{ const q=G.lq; G.tmp={fid:q.fid}; return LQF(LQT[q.kind][1][0],entName(q.fid),q.d); },
  dyn:()=>{ const q=G.lq; return LQT[q.kind][1][1].map(o=>({t:LQF(o[0],entName(q.fid),q.d),s:`${ATTRS[o[1]].n}${o[2]?` · ${{cmb:`combat`,stl:`furtivité`,hck:`hack`,drv:`conduite`}[o[2]]}`:``}`,
    chk:{a:o[1],k:o[2],dc:o[3]+1,ok:{next:`lq_3`,fn:`lqWin`,msg:LQF(o[4],entName(q.fid),q.d)},ko:{hp:-14,next:`lq_3`,msg:KO[o[1]]}}})); },ch:[]});
card({id:`lq_3`,who:`@enemy`,tag:`📍 Quêtes du quartier (3/3)`,cond:()=>false,
  tx:()=>{ const q=G.lq; G.tmp={fid:q.fid}; return LQF(LQT[q.kind][2][0],entName(q.fid),q.d); },
  dyn:()=>{ const q=G.lq, pay=Math.round((900+G.cred*30)*(1+(q.w||0)*.15)/50)*50; return LQT[q.kind][2][1].map(o=>({t:LQF(o[0],entName(q.fid),q.d),s:`${ATTRS[o[1]].n}${o[2]?` · ${{cmb:`combat`,stl:`furtivité`,hck:`hack`,drv:`conduite`}[o[2]]}`:``} · ${money(pay)} · réputation +`,
    chk:{a:o[1],k:o[2],dc:o[3]+1,ok:{unflag:[`q_active`],fn:`lqEnd`,ed:pay,cred:6,loot:2,fac:{[q.fid]:16},msg:LQF(o[4],entName(q.fid),q.d)},ko:{unflag:[`q_active`],hp:-18,ed:Math.round(pay/6),fac:{[q.fid]:4},msg:KO[o[1]]+` Mais ${entName(q.fid)} a vu que tu avais essayé.`}}})); },ch:[]});

/* ---------- Trames de ta propre faction ---------- */
function chain(A,condFn){
  const lab=o=>`${ATTRS[o[1]].n}${o[2]?` · ${{cmb:`combat`,stl:`furtivité`,hck:`hack`,drv:`conduite`}[o[2]]}`:``}`;
  card({id:`${A.id}_0`,who:A.who,tag:`Trame · ${A.t} (1/3)`,once:true,w:10,cond:()=>condFn()&&!G.flags.q_active&&G.stats.cards>=4,tx:A.s[0][0],
    ch:A.s[0][1].map(o=>({t:o[0],s:lab(o),chk:{a:o[1],k:o[2],dc:o[3],ok:{flag:[`q_active`],fn:`arcWin`,next:`${A.id}_1`,msg:o[4]},ko:{flag:[`q_active`],hp:-10,next:`${A.id}_1`,msg:KO[o[1]]}}}))});
  card({id:`${A.id}_1`,who:A.who,tag:`Trame · ${A.t} (2/3)`,once:true,cond:()=>false,tx:A.s[1][0],
    ch:A.s[1][1].map(o=>({t:o[0],s:lab(o),chk:{a:o[1],k:o[2],dc:o[3],ok:{fn:`arcWin`,next:`${A.id}_2`,msg:o[4]},ko:{hp:-14,next:`${A.id}_2`,msg:KO[o[1]]}}}))});
  card({id:`${A.id}_2`,who:A.who,tag:`Trame · ${A.t} (3/3)`,once:true,cond:()=>false,tx:A.s[2][0],
    ch:A.s[2][1].map(o=>({t:o[0],s:`${lab(o)} · ${A.pay.toLocaleString(`fr`)} €$`,chk:{a:o[1],k:o[2],dc:o[3],ok:{unflag:[`q_active`],fn:`arcEnd`,ed:A.pay,cred:8,loot:2,msg:o[4]},ko:{unflag:[`q_active`],hp:-20,ed:Math.round(A.pay/6),cred:2,msg:KO[o[1]]+` L'affaire se termine, sans gloire.`}}}))});
}
const MQ = [
 {id:`mq_run1`,t:`Le réseau fantôme`,who:`kiwi`,pay:4400,cond:()=>G.mine&&G.mine.type===`runners`,
  s:[[`Un de tes netrunners signale un trafic de données anormal sur ton réseau : quelqu'un te surveille depuis l'intérieur.`,[[`Tracer l'intrus`,`int`,`hck`,7,`Un signal remonte jusqu'à un terminal de ton propre QG.`],[`Couper le réseau le temps de purger`,`tech`,null,7,`Les écrans s'éteignent. L'intrus se trahit en clignant.`]]],
     [`L'intrus est un agent NetWatch infiltré dans ton collectif depuis des mois. Il ne sait pas que tu le sais.`,[[`Le retourner contre eux`,`cool`,null,8,`Il pâlit, puis parle. Il sera ton espion.`],[`L'éliminer du Net`,`int`,`hck`,8,`Son identité se dissout. Plus aucune trace.`]]],
     [`NetWatch lance un raid sur ton QG : serveurs, serveurs, serveurs. Tes hackers attendent ton ordre.`,[[`Défendre le QG avec tes hackers`,`int`,`hck`,9,`Une muraille de code. NetWatch recule, humilié.`],[`Évacuer les serveurs par la route`,`tech`,null,8,`Trois camions, quatre nuits, zéro perte. Ton réseau survit ailleurs.`]]]]},
 {id:`mq_run2`,t:`Le contrat du Blackwall`,who:`rache`,pay:5200,cond:()=>G.mine&&G.mine.type===`runners`&&G.cred>=30,
  s:[[`Un client anonyme propose un contrat énorme à ton collectif : pénétrer un serveur adossé au Blackwall. Tes hackers hésitent.`,[[`Analyser le risque`,`int`,null,8,`Un contrat piégé ? Peut-être. Mais l'argent est réel.`],[`Rassurer tes hommes`,`cool`,null,7,`« Je plonge avec vous. » Ils se rassurent.`]]],
     [`Au bord du Blackwall, une voix résonne : « Vous êtes nombreux. Vous êtes courageux. Et vous êtes dans ma maison. »`,[[`Lui répondre avec respect`,`cool`,null,9,`La voix s'adoucit. Elle te laisse passer.`],[`Brouiller son signal`,`int`,`hck`,9,`Tu coupes l'écho. Elle gronde, puis se tait.`]]],
     [`Au cœur du serveur : une archive d'avant le DataKrash, intacte. Tes hackers te regardent. Qu'en fais-tu ?`,[[`La copier et la revendre`,`int`,`hck`,8,`Une fortune. Ton collectif devient légende.`],[`La détruire, par prudence`,`tech`,null,8,`Un feu de données. Personne ne saura jamais ce qu'elle contenait.`]]]]},
 {id:`mq_gang1`,t:`La guerre des rues`,who:`fix`,pay:4000,cond:()=>G.mine&&G.mine.type===`gang`,
  s:[[`Une bande rivale pille tes commerçants. Tes lieutenants réclament vengeance. Le quartier te regarde.`,[[`Envoyer une patrouille`,`body`,`cmb`,7,`Trois pillards arrêtés. Le quartier respire.`],[`Poser une embuscade`,`ref`,`stl`,7,`Une nuit, un piège, un chef rival surpris.`]]],
     [`Le chef rival propose un face-à-face : un cercle de voitures, un duel. Ou une trêve à ses conditions.`,[[`Accepter le duel`,`body`,`cmb`,9,`Un duel brutal. Tu gagnes le droit de parler.`],[`Négocier la trêve`,`cool`,null,8,`Une trêve, un partage. Pour l'instant.`]]],
     [`La trêve est rompue : des traîtres de ta propre bande ont tout manigancé. Qui te trahit ?`,[[`Débusquer les traîtres`,`int`,null,8,`Deux noms, une confession. Le règlement est brutal.`],[`Pardonner, avec un test`,`cool`,null,8,`Ils jurent fidélité. Tu surveilles leurs mains.`]]]]},
 {id:`mq_gang2`,t:`Le dépôt perdu`,who:`fix`,pay:3800,cond:()=>G.mine&&G.mine.type===`gang`&&crewN()>=1,
  s:[[`Des armes disparaissent de ton dépôt. Quelqu'un te vole, de l'intérieur.`,[[`Poster des guetteurs`,`ref`,`stl`,7,`Un pistolet disparaît sous tes yeux.`],[`Faire parler tes hommes`,`cool`,null,7,`Un regard fuyant : tu tiens un nom.`]]],
     [`Le voleur est un proche, un frère d'armes. Il avoue : il avait besoin d'argent pour sa sœur malade.`,[[`Le comprendre`,`cool`,null,7,`Il fond en larmes. Tu paies les soins.`],[`Le punir, pour l'exemple`,`body`,`cmb`,8,`Le message est clair. Tes hommes se redressent.`]]],
     [`Les armes volées sont chez un revendeur rival, qui exige une rançon.`,[[`Les reprendre par la force`,`body`,`cmb`,9,`Une fusillade courte. Ton dépôt est de retour.`],[`Les racheter en le piégeant`,`int`,null,8,`Une transaction truquée, une cargaison volée à son tour.`]]]]},
 {id:`mq_fix1`,t:`Le grand contrat`,who:`dino`,pay:4600,cond:()=>G.mine&&G.mine.type===`fixers`,
  s:[[`Un client veut trois solos pour un seul coup : une corpo, une nuit, un butin énorme. Ton réseau est sollicité.`,[[`Recruter les meilleurs mercs`,`cool`,null,7,`Trois noms, trois accords. Le coup est monté.`],[`Faire ta propre enquête sur le client`,`int`,null,8,`Il est réglo. Pour un client.`]]],
     [`Le soir du coup, un des solos manque. Il faut le remplacer, vite, ou annuler.`,[[`Prendre sa place`,`body`,`cmb`,8,`Tu enfiles son gilet. Le coup passe.`],[`Appeler un contact en renfort`,`cool`,null,8,`Un vieil ami débarque en dix minutes.`]]],
     [`Le coup réussit, mais le client refuse de payer la totalité. Ton réseau te regarde.`,[[`Le menacer poliment`,`cool`,null,8,`Il pâlit. Le virement arrive.`],[`Faire exploser son contrat`,`int`,null,9,`Une fuite à la presse. Il paie, et plus encore.`]]]]},
 {id:`mq_fix2`,t:`Un client impossible`,who:`dino`,pay:4000,cond:()=>G.mine&&G.mine.type===`fixers`&&G.cred>=25,
  s:[[`Un client exige une exclusivité : tous tes mercs, pour lui seul. Il paie le double. Mais il est dangereux.`,[[`Tester sa solidité`,`int`,null,8,`Ses comptes sont d'une propreté suspecte.`],[`Lui imposer tes règles`,`cool`,null,8,`Il hésite, puis cède.`]]],
     [`Le client te donne un premier ordre : éliminer un rival gênant. Tes mercs attendent ta décision.`,[[`Refuser net`,`cool`,null,9,`Il sourit, froid. « Intéressant. »`],[`Accepter, puis saboter`,`int`,null,9,`Tu envoies un piège à la place d'un tueur.`]]],
     [`Le client découvre ton jeu. Il t'invite à dîner. Un dîner, ou une exécution ?`,[[`Y aller avec une escorte`,`body`,`cmb`,9,`Il comprend qu'il a perdu. Tu repars.`],[`Y aller seul(e), en parlant`,`cool`,null,9,`Une heure de silence, puis un accord.`]]]]},
 {id:`mq_nom1`,t:`Le convoi des Anciens`,who:`dakota`,pay:4000,cond:()=>G.mine&&G.mine.type===`nomads`,
  s:[[`Ton clan doit traverser les Badlands avec ses familles. Un vieux nomade te prévient : la route habituelle est piégée.`,[[`Explorer une route alternative`,`ref`,`drv`,7,`Une piste secrète. Tu l'ouvres pour le clan.`],[`Consulter les anciens`,`cool`,null,7,`Un vieux croque une carte qui n'existe pas.`]]],
     [`Le convoi se met en route. Une tempête de sable se lève, aveuglante. Les familles paniquent.`,[[`Guider à l'instinct`,`ref`,`drv`,8,`Tu sens la route sous tes roues.`],[`Organiser un abri`,`tech`,null,8,`Des bâches, des camions en cercle : la tempête passe.`]]],
     [`Au sortir de la tempête, un clan rival bloque le chemin : « Un tribut, ou un combat. »`,[[`Négocier un partage`,`cool`,null,8,`Ils acceptent un tribut modeste.`],[`Les défier à la course`,`ref`,`drv`,9,`Tu gagnes. Ils s'écartent, impressionnés.`]]]]},
 {id:`mq_nom2`,t:`La tempête rouge`,who:`dakota`,pay:3800,cond:()=>G.mine&&G.mine.type===`nomads`&&G.cred>=25,
  s:[[`Une tempête rouge s'annonce : trois jours de vent, de sable, de silence. Ton clan doit se mettre à l'abri.`,[[`Trouver un site protégé`,`int`,null,7,`Une grotte, un canyon, un abri sûr.`],[`Renforcer les camions`,`tech`,null,7,`Des plaques, des câbles, du ciment improvisé.`]]],
     [`Au deuxième jour, une famille d'un autre clan frappe à tes portes. Ils meurent de soif.`,[[`Les accueillir`,`cool`,null,7,`Ton clan partage ses vivres. Ils pleurent.`],[`Partager l'eau, mais pas l'abri`,`cool`,null,8,`Un compromis dur, mais ils survivent.`]]],
     [`La tempête retombe. Un chef de la famille t'offre une dette d'honneur. Que lui demandes-tu ?`,[[`Un pacte entre vos clans`,`cool`,null,8,`Une alliance scellée à la poussière.`],[`Un véhicule de leur convoi`,`cool`,null,7,`Un Thorton en excellent état. Tu l'acceptes.`]]]]},
];
MQ.forEach(A=>chain(A,A.cond));

/* ---------- fin de l'Afterlife : où va-t-on ? (ne coûte aucune action) ---------- */
card({id:`hub_dest`,quick:true,who:`narr`,tag:`📍 En route`,cond:()=>false,
  tx:()=>{ const d=DMAP[G.loc]; return `L'Afterlife se vide dans ton dos. La nuit est à toi, et Night City n'attend pas. Tu es passé(e) par <strong>${d?d.n:`ici`}</strong> en dernier. Où vas-tu ?`; },
  dyn:()=>{
    const seen=G.visited||{}, cur=G.loc;
    const ds=shuffle(DIST.filter(d=>d.id!==cur&&(!d.lock||G.flags.dogtown))).sort((a,b)=>(seen[a.id]||0)-(seen[b.id]||0)+Math.random()*1.6).slice(0,3);
    const tag=d=>{ const o=G.dist[d.id]; return o===`player`?`ton territoire`:FAC[o]?FAC[o].n:`zone neutre`; };
    const out=ds.map(d=>({t:`Aller à ${d.n}`,s:`${d.w} · ${tag(d)}${(seen[d.id]||0)?``:` · jamais visité`}`,fx:{dest:d.id}}));
    const c=DMAP[cur]; if(c) out.push({t:`Revenir à ${c.n}`,s:`Ton dernier quartier · ${tag(c)}`,fx:{dest:c.id}});
    return out; },ch:[]});
