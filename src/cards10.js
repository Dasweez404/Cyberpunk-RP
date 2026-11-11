/* =====================================================================
   CARTES 10 — conséquences de la diplomatie : représailles, accrochages
   entre factions, appels et cadeaux d'alliés
   ===================================================================== */
const FN_ = id => FAC[id]?FAC[id].n:`eux`;
card({id:`fac_revenge`,who:`@enemy`,tag:`⚔ Représailles`,w:9,cond:()=>hottest()!==null,
  tx:()=>{ const fid=(G.grudge&&FAC[G.grudge]&&(G.fac[G.grudge]||0)<=-10)?G.grudge:(hottest()||G.grudge||`maelstrom`); G.tmp={fid}; G.grudge=null;
    return `<strong>${FN_(fid)}</strong> n'a pas oublié. Une ruelle, trois silhouettes, une voix calme : « Tu nous as coûté cher. On vient chercher ce que tu nous dois — avec les intérêts. » ${(G.fac[fid]||0)<=-60?`<em>C'est la guerre ouverte : ils ne s'arrêteront pas.</em>`:``}`; },
  ch:[
    {t:`Te battre`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:9,ok:{cred:5,fn:`revengeWin`,msg:`Tu leur fais regretter le déplacement. Le message est clair : on ne te touche pas sans payer.`},ko:{hp:-30,ed:-400,msg:`Ils te laissent pour mort(e) dans le caniveau, les poches vides.`}}},
    {t:`Fuir`,s:`RÉFLEXES`,chk:{a:`ref`,dc:8,ok:{msg:`Un mur, un toit, une bouche de métro. Ils te perdent.`},ko:{hp:-18,msg:`Une balle te rattrape avant le coin de la rue.`}}},
    {t:`Payer le prix du sang`,s:`−1 500 €$ · apaise la faction`,req:R.ed(1500),fx:{ed:-1500,fn:`revengePay`,msg:`Tu paies. Ils comptent les billets devant toi. « On est quittes. Pour cette fois. »`}},
    {t:`Appeler du renfort`,s:`Ta faction, ta famille ou tes alliés`,req:()=>(G.member||crewOf().length||Object.keys(G.allies||{}).length)?``:`Personne à appeler`,fx:{ed:-300,cred:3,msg:`Tes renforts arrivent avant le premier coup. Les autres reculent sans un mot.`}}
  ]});
card({id:`fac_clash`,who:`@enemy`,tag:`⚔ Accrochage`,w:9,cond:()=>G.member&&FAC[G.member].foes.length>0,
  tx:()=>{ const foes=FAC[G.member].foes, fid=foes[rnd(0,foes.length-1)]; G.tmp={fid};
    return `Tu portes les couleurs de <strong>${FAC[G.member].n}</strong>, et ça se voit. Une bande de <strong>${FN_(fid)}</strong> te barre la route : « T'es loin de chez toi. » Tes chefs entendront parler de ce que tu fais maintenant.`; },
  ch:[
    {t:`Défendre tes couleurs`,s:`RÉFLEXES · combat · compte comme une mission`,chk:{a:`ref`,k:`cmb`,dc:8,ok:{cred:4,fn:`clashWin`,msg:`Tu les mets en déroute. La nouvelle remonte jusqu'aux chefs avant toi.`},ko:{hp:-24,fn:`clashLose`,msg:`Tu te fais corriger devant témoins. Tes chefs n'apprécieront pas.`}}},
    {t:`Calmer le jeu`,s:`SANG-FROID`,chk:{a:`cool`,dc:8,ok:{hum:3,cred:2,msg:`Quelques mots, un regard. Chacun repart de son côté.`},ko:{hp:-10,msg:`Ils prennent ça pour de la faiblesse.`}}},
    {t:`Baisser les yeux et passer`,s:`Ta faction le saura`,fx:{fn:`clashLose`,msg:`Tu passes ton chemin. Quelqu'un des tiens t'a vu.`}}
  ]});
card({id:`ally_call`,who:`@enemy`,tag:`📜 Un allié t'appelle`,w:7,cond:()=>Object.keys(G.allies||{}).length>0,
  tx:()=>{ const al=Object.keys(G.allies), fid=al[rnd(0,al.length-1)]; G.tmp={fid};
    return `Un messager de <strong>${FN_(fid)}</strong> : « On a un pacte, toi et nous. Nos ennemis frappent ce soir. On compte sur toi. » Un pacte, à Night City, ce n'est pas du papier.`; },
  ch:[
    {t:`Répondre à l'appel`,s:`CORPS · combat`,chk:{a:`body`,k:`cmb`,dc:8,ok:{ed:1500,cred:4,loot:2,fn:`allyHelp`,msg:`Vous tenez la ligne ensemble. Vos alliés s'en souviendront.`},ko:{hp:-26,fn:`allyHelp`,msg:`Ça tourne mal, mais tu étais là. C'est ce qui compte pour eux.`}}},
    {t:`Envoyer de l'argent à la place`,s:`−800 €$`,req:R.ed(800),fx:{ed:-800,msg:`Ils prennent l'argent. Ils auraient préféré te voir.`}},
    {t:`Refuser`,s:`Le pacte est rompu`,heavy:`Refuser l'appel d'un allié rompt le pacte. Ils te le feront payer.`,fx:{fn:`allyBreak`,msg:`Le messager crache par terre. « On saura s'en souvenir. »`}}
  ]});
card({id:`ally_gift`,who:`@enemy`,tag:`📜 Un geste d'allié`,w:4,cond:()=>Object.keys(G.allies||{}).length>0,
  tx:()=>{ const al=Object.keys(G.allies), fid=al[rnd(0,al.length-1)]; G.tmp={fid};
    return `<strong>${FN_(fid)}</strong> honore le pacte : une mallette, quelques hommes disponibles, et un message : « Entre alliés, on partage. »`; },
  ch:[
    {t:`Prendre la mallette`,s:`+Gain`,fx:{ed:900,msg:`Des eddies propres, pour une fois.`}},
    {t:`Prendre les hommes`,s:`Renforce tes quartiers, ou te soigne`,fx:{fn:`holdAll`,hp:15,msg:`Ils montent la garde quelques semaines. Tu dors mieux.`}}
  ]});
