/* =====================================================================
   CARTES 8 — menaces tardives (la difficulté monte avec les années)
   et vie de ta famille
   ===================================================================== */
const LATE = () => G.age>=32;
card({id:`lg_hit`,who:`corpo`,tag:`☠ Contrat sur ta tête`,w:9,cd:10,cond:()=>LATE()&&G.cred>=45,
  tx:`Ta réputation ne passe plus inaperçue. Un message anonyme : « Une corporation a mis un prix sur ton nom. Des professionnels, pas des gamins. Ils seront là avant ce soir. » La liste de tes ennemis est longue ; ceux-là sont les plus patients.`,
  ch:[
    {t:`Les attendre et les affronter`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:10,ok:{cred:8,hum:-4,ed:1500,msg:`Une fusillade courte, précise. Ils ne s'attendaient pas à ça. Tu récupères leur matériel.`},ko:{hp:-50,ed:-800,msg:`Ils sont meilleurs que toi ce soir. Tu t'en sors en rampant.`}}},
    {t:`Disparaître quelques jours`,s:`RÉFLEXES · furtivité`,chk:{a:`ref`,k:`stl`,dc:9,ok:{cred:-2,msg:`Tu quittes ta planque une heure avant leur arrivée. Ils fouillent un lit vide.`},ko:{hp:-32,ed:-500,msg:`Ils te retrouvent. L'issue est brutale.`}}},
    {t:`Racheter le contrat`,s:`−4 000 €$`,req:R.ed(4000),fx:{ed:-4000,cred:-2,msg:`Un virement, une poignée de main sans chaleur. Le contrat est levé — jusqu'au prochain.`}},
    {t:`Appeler ta famille à la rescousse`,s:`Requiert une faction avec membres`,req:()=>crewOf().length?``:`Aucun allié dans ta faction`,fx:{ed:-800,cred:3,hum:2,msg:`Tes alliés accourent. Ils paient un prix, toi aussi. Mais personne ne meurt cette nuit.`}}
  ]});
card({id:`lg_rival`,who:`@fac`,tag:`Un jeune loup`,w:8,cd:10,cond:()=>LATE()&&G.cred>=50,
  tx:`Un jeune solo à l'air féroce t'attend devant l'Afterlife. Chrome neuf, regard vide. « On dit que tu es une légende. Les légendes, ça se dépasse. Je te défie. Ici, maintenant. »`,
  ch:[
    {t:`Relever le défi`,s:`RÉFLEXES · combat`,chk:{a:`ref`,k:`cmb`,dc:10,ok:{cred:6,hum:-4,msg:`Tu es plus lent qu'avant, mais plus malin. Il tombe à genoux, stupéfait.`},ko:{hp:-42,cred:-6,msg:`Il est plus rapide. Tu comprends que ton temps passe.`}}},
    {t:`Décliner avec élégance`,s:`SANG-FROID`,chk:{a:`cool`,dc:9,ok:{cred:2,hum:3,msg:`Tu lui offres un verre. « Le jour où tu auras quelque chose à prouver, reviens. » Il baisse les yeux.`},ko:{cred:-5,msg:`On se moque de toi dans ton dos.`}}},
    {t:`L'humilier devant tout le monde`,s:`INTELLECT`,chk:{a:`int`,dc:9,ok:{cred:7,msg:`Une phrase, deux pièges. Il se ridiculise seul.`},ko:{hp:-20,cred:-3,msg:`Ça se retourne contre toi.`}}}
  ]});
card({id:`lg_debt`,who:`fix`,tag:`Une vieille dette`,w:7,cd:12,cond:()=>G.age>=36,
  tx:`Un visage du passé, plus vieux, plus dur : « Tu te souviens de moi ? Tu m'as laissé en plan, il y a des années. Pas de rancune. Juste une dette. Une grosse. Et les dettes ne s'éteignent pas à Night City. »`,
  ch:[
    {t:`Payer ce que tu dois`,s:`−3 500 €$`,req:R.ed(3500),fx:{ed:-3500,hum:5,msg:`Tu règles tout. Pour la première fois depuis longtemps, tu dors sans surveiller la porte.`}},
    {t:`Nier avoir une dette`,s:`SANG-FROID`,chk:{a:`cool`,dc:10,ok:{cred:3,msg:`Tu le regardes droit dans les yeux. Il baisse les siens.`},ko:{hp:-32,ed:-1500,msg:`Il n'est pas venu seul.`}}},
    {t:`Rembourser autrement : un service`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:9,ok:{hum:-3,cred:4,msg:`Un petit boulot sanglant. La dette est soldée.`},ko:{hp:-36,msg:`Le « petit boulot » tourne à la catastrophe.`}}}
  ]});
card({id:`lg_maxtac`,who:`maxtac`,tag:`Contrôle préventif MaxTac`,w:7,cd:12,cond:()=>G.age>=36&&G.cyber.length>=3,
  tx:`Une camionnette noire se range à ta hauteur. MaxTac vérifie les niveaux de chrome dans ton quartier : « Procédure de routine. Passez votre scan. » Avec autant d'implants, tu n'es pas rassuré(e). Le calme de leurs voix est ce qui fait le plus peur.`,
  ch:[
    {t:`Passer le scan calmement`,s:`SANG-FROID`,chk:{a:`cool`,dc:10,ok:{cred:2,msg:`Tu respires lentement. Le scan affiche « stable ». Ils partent.`},ko:{hum:-12,hp:-14,msg:`Le scan hésite, ils te notent. Tu tiens à peine sur tes jambes.`}}},
    {t:`Montrer des papiers médicaux en règle`,s:`Si tu as une thérapie récente`,req:()=>G.hum>=60?``:`Humanité ≥ 60`,fx:{cred:1,hum:3,msg:`Ton dossier est propre. Ils s'excusent presque.`}},
    {t:`Fuir`,s:`RÉFLEXES`,chk:{a:`ref`,dc:11,ok:{cred:4,hum:-6,msg:`Un hasard, un toit, une chance. MaxTac te cherche encore.`},ko:{die:`psycho`,msg:`Ils ne vous donnent pas deux chances.`}}}
  ]});
card({id:`lg_coalition`,who:`narr`,tag:`⚔ Coalition contre toi`,w:7,cd:12,cond:()=>G.mine&&ownedList().length>=3&&LATE(),
  tx:()=>`Tes rivaux se sont alliés. Une coalition de gangs et de corpos s'est formée pour reprendre ce que <strong>${G.mine.name}</strong> a pris. Les attaques vont pleuvoir sur tes quartiers en même temps.`,
  ch:[
    {t:`Renforcer toutes tes positions`,s:`−2 000 €$`,req:R.ed(2000),fx:{ed:-2000,fn:`holdAll`,cred:3,msg:`Des armes, des gardes, des promesses. Tes quartiers tiennent… pour l'instant.`}},
    {t:`Frapper le chef de la coalition`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:10,ok:{cred:10,hum:-5,fn:`holdAll`,msg:`Une frappe chirurgicale. La coalition s'effondre.`},ko:{hp:-40,fn:`holdLose`,msg:`L'assaut échoue. Des quartiers vacillent.`}}},
    {t:`Négocier une trêve`,s:`SANG-FROID`,chk:{a:`cool`,dc:10,ok:{cred:6,hum:3,msg:`Chacun garde ce qu'il a. Pour l'instant.`},ko:{fn:`holdLose`,ed:-1000,msg:`Les négociations échouent. Ils frappent.`}}}
  ]});
card({id:`lg_heart`,who:`doc`,tag:`⚠ Le corps lâche`,w:7,cd:15,cond:()=>G.age>=44,
  tx:`Une douleur dans la poitrine, soudaine, violente. Tes jambes se dérobent au milieu de la rue. Les années, les excès, le chrome : tout se paie. Un passant appelle une ambulance.`,
  ch:[
    {t:`Te faire soigner d'urgence`,s:`−2 000 €$`,req:R.ed(2000),fx:{ed:-2000,hp:25,hum:3,msg:`Quelques heures, un scanner, un rapport sans détour : « Calmez-vous, ou vous ne verrez pas 60 ans. »`}},
    {t:`Serrer les dents et repartir`,s:`CORPS`,chk:{a:`body`,dc:10,ok:{cred:2,msg:`Tu te redresses. L'éclair est passé. Cette fois.`},ko:{hp:-40,hum:-3,msg:`Tu tiens debout, mais pas pour longtemps.`}}}
  ]});

/* ---------- Vie de ta famille ---------- */
card({id:`crew_favor`,who:`narr`,tag:`Ta famille`,w:7,cd:8,cond:()=>G.mine&&crewOf().length>=1,
  tx:()=>{ const id=crewOf()[rnd(0,crewOf().length-1)]; G.tmp={ally:id}; return `<strong>${WHO[id].n}</strong>, un des tiens dans ${G.mine.name}, vient te trouver : « J'ai un problème, et personne d'autre ne peut le régler. Je ne te le demanderais pas si ce n'était pas important. »`; },
  ch:[
    {t:`L'aider sans poser de question`,s:`−500 €$ · +Lien`,fx:{ed:-500,hum:5,msg:`Il baisse les yeux, soulagé. Ta famille voit comment tu traites les tiens.`}},
    {t:`Résoudre le problème toi-même`,s:`SANG-FROID`,chk:{a:`cool`,dc:9,ok:{cred:5,hum:4,msg:`Un coup de fil, un déplacement. Le problème n'existe plus.`},ko:{hp:-18,msg:`Ça se complique. Tu t'en sors de justesse.`}}},
    {t:`Refuser`,s:`Ta famille s'en souviendra`,fx:{hum:-3,msg:`Il s'en va sans un mot. Ta famille a vu comment tu traites ses membres.`}}
  ]});
