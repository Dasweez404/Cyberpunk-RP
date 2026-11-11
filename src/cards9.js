/* =====================================================================
   CARTES 9 — l'Afterlife : une halte imposée, tout est un choix.
   Boutique, contrats et repos sont des cartes avec prix et risques.
   ===================================================================== */
const effTxt = o => [
  ...Object.entries(o.at||{}).map(([k,v])=>`+${v} ${ATTRS[k].n}`),
  ...Object.entries(o.k||{}).map(([k,v])=>`+${v} ${{cmb:`combat`,drv:`conduite`,hck:`hack`,stl:`furtivité`,soc:`social`}[k]}`),
  o.mit?`−${Math.round(o.mit*100)}% dégâts`:``, o.regen?`soin auto`:``, o.deck?`${o.deck} slots hack`:``
].filter(Boolean).join(` · `);
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=rnd(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const NOPE = (t,m) => ({t:t||`Repartir sans rien acheter`,s:`Garde tes eddies`,fx:{msg:m||`Tu ranges ton portefeuille. Ça ne se fait pas tous les jours.`}});

card({id:`afterlife_hub`,who:`@hub`,tag:`🍸 Afterlife · Une halte`,cond:()=>false,
  tx:()=>{
    if(!G.inHub){ G.inHub=true; G.hubLeft=2; G.hubUsed={}; }
    const hurt=G.hp<50, broke=G.ed<300, first=G.hubLeft>=2;
    return first
      ? `Tu pousses la porte de l'<strong>Afterlife</strong>. Néons rouges, basses sourdes. Tu as le temps de faire <strong>deux choses</strong> ce soir, pas une de plus.${hurt?` <em>Tu saignes encore.</em>`:``}${broke?` <em>Ton portefeuille est presque vide.</em>`:``}`
      : `La nuit avance à l'<strong>Afterlife</strong>. Il te reste <strong>un dernier moment</strong> avant de repartir.`;
  },
  dyn:()=>{
    const o=(k,t,s,next)=>({t,s,req:()=>G.hubUsed&&G.hubUsed[k]?`Déjà fait ce soir`:``,fx:{next,nav:true,hub:k}});
    return [
      o(`chrome`,`Voir le ripperdoc de passage`,`Chrome & hacks · achète ou repars`,`shop_chrome`),
      o(`gear`,`Fouiller le marché noir`,`Armes, armures, véhicules, style`,`shop_gear`),
      o(`gig`,`Chercher un contrat`,`Un coup à jouer, des risques à prendre`,`gig_board`),
      o(`rest`,`Te reposer`,`Soins · thérapie · fête`,`rest_card`),
      {t:`Repartir dans la rue`,s:G.hubLeft<2?`La soirée est finie`:`Rien aujourd'hui`,fx:{hubEnd:true,nav:true}}
    ];
  },ch:[]});

card({id:`shop_chrome`,quick:true,who:`doc`,tag:`🦾 Ripperdoc de passage`,cond:()=>false,
  tx:()=>`« Je ne reste jamais longtemps au même endroit. J'ai ça aujourd'hui. Tu choisis, tu paies, je te le pose ici même. Aucun remboursement. Et gare à ton humanité, gamin(e). »`,
  dyn:()=>{
    const pool=shuffle(CYBER.filter(c=>!hasCy(c.id)&&(!c.cred||G.cred>=c.cred)&&c.p<=Math.max(2500,G.ed*3)));
    const aff=pool.find(c=>cyPrice(c)<=G.ed); const rest=pool.filter(c=>c!==aff); const picks=(aff?[aff,...rest]:rest).slice(0,hasDeck()?2:3);
    const out=picks.map(c=>{ const price=cyPrice(c), cur=G.cyber.find(i=>CY(i).slot===c.slot&&i!==c.id);
      return {t:c.n,s:`${money(price)} · −${c.h} Humanité · ${effTxt(c)||c.d}${cur?` · remplace ${CY(cur).n}`:``}`,req:()=>G.ed>=price?``:`${money(price)} requis`,
        fx:{ed:-price,humx:-c.h,cy:c.id,msg:`Une piqûre, un grésillement, une odeur de métal chaud. ${c.d}`}}; });
    if(hasDeck()){ const hs=shuffle(HACKS.filter(h=>!G.hacks.includes(h.id)&&A(`int`)>=h.int&&G.hacks.length<deckSlots())).slice(0,1);
      hs.forEach(h=>out.push({t:`Quickhack : ${h.n}`,s:`${money(h.p)} · ${h.d}`,req:()=>G.ed>=h.p?``:`${money(h.p)} requis`,fx:{ed:-h.p,hack:h.id,msg:`Un transfert silencieux. ${h.n} est chargé.`}})); }
    out.push(NOPE(`Refuser et repartir`,`« Comme tu voudras. Reviens quand tu auras de quoi. »`)); return out;
  },ch:[]});

card({id:`shop_gear`,quick:true,who:`fix`,tag:`🔫 Marché noir`,cond:()=>false,
  tx:()=>`Un vendeur ambulant ouvre sa valise sous un néon qui grésille : « Armes, armures, bagnoles. Tout est volé, rien n'est tracé. Les prix ? Non négociables. »`,
  dyn:()=>{
    const pool=shuffle(GEAR.filter(g=>!g.loot&&!G.gear.includes(g.id)&&(!g.cred||G.cred>=g.cred)&&g.p<=Math.max(2500,G.ed*3)));
    const aff=pool.find(g=>gearPrice(g)<=G.ed); const ordered=aff?[aff,...pool.filter(g=>g!==aff)]:pool;
    const seen=new Set(), picks=[]; ordered.forEach(g=>{ if(picks.length<3&&!seen.has(g.t)){ seen.add(g.t); picks.push(g); } });
    const out=picks.map(g=>{ const price=gearPrice(g), cur=G.gear.find(i=>GEARMAP[i].t===g.t);
      return {t:g.n,s:`${money(price)} · ${g.t} · ${effTxt(g)||g.d}${cur?` · remplace ${GEARMAP[cur].n}`:``}`,req:()=>G.ed>=price?``:`${money(price)} requis`,fx:{ed:-price,gear:g.id,msg:g.d}}; });
    out.push(NOPE()); return out;
  },ch:[]});

card({id:`gig_board`,quick:true,who:`@fixer`,tag:`💼 Contrats`,cond:()=>false,
  tx:()=>`« Trois contrats ce soir. Certains paient bien, d'autres te mettent en terre.${G.hp<60?` Et blessé(e) comme tu es… réfléchis.`:``} »`,
  dyn:()=>{
    const cs=[],used=new Set();
    while(cs.length<3){ const g=GIGS[rnd(0,Math.min(GIGS.length-1,Math.floor(2+G.cred/12)+2))]; if(!used.has(g.n)){used.add(g.n);cs.push(g);} }
    const out=cs.map(g=>{ const pay=gigPay(g), cr=gigCr(g), tier=pay>=4000?3:pay>=1800?2:1;
      return {t:g.n,s:`${money(pay)} · +${cr} Cred · échec : −${g.dm} Santé`,chk:{a:g.a,k:g.k,dc:g.dc,
        ok:{ed:pay,cred:cr,loot:tier,msg:`Contrat rempli. Le fixer te paie sans un mot.`},
        ko:{hp:-g.dm,ed:Math.round(pay*.1),hum:g.dm>=18?-4:0,msg:`Le contrat tourne mal. Tu t'en sors, mais pas indemne.`}}}; });
    out.push(NOPE(`Refuser tous les contrats`,`« Pas de travail pour toi, alors. »`)); return out;
  },ch:[]});

card({id:`rest_card`,quick:true,who:`narr`,tag:`🛏 Repos`,cond:()=>false,
  tx:()=>`Une banquette au fond de l'Afterlife, un ripperdoc qui dort au comptoir, une odeur de nouilles froides. Ton corps te lâche presque. Tu peux t'offrir un vrai soin, ou simplement fermer les yeux.`,
  dyn:()=>{
    const cl=Math.round(200*infl()), th=Math.round(600*infl()), tt=Math.round(1200*infl());
    const heal=Math.round(35*Math.max(.5,1-Math.max(0,G.age-30)*0.012));
    const out=[
      {t:`Passer par la clinique`,s:`${money(cl)} · +${heal} Santé`,req:()=>G.ed>=cl?``:`${money(cl)} requis`,fx:{ed:-cl,hp:heal,msg:`Du fil, des pansements, une piqûre. Tu respires de nouveau.`}},
      {t:`Une séance de thérapie`,s:`${money(th)} · +15 Humanité`,req:()=>G.ed>=th?``:`${money(th)} requis`,fx:{ed:-th,hum:15,msg:`Des mots simples, un regard humain. Une partie de toi se recolle.`}},
      {t:`Dormir quelques heures`,s:`Gratuit · +15 Santé · +5 Humanité`,fx:{hp:15,hum:5,msg:`Tu dors d'un sommeil lourd. Les rêves sont étranges, mais tu t'en souviens à peine.`}},
      {t:`Faire la fête jusqu'à l'aube`,s:`−80 €$ · risqué`,chk:{a:`cool`,dc:6,ok:{ed:-80,hum:12,msg:`Les basses, les corps, les rires. Tu oublies tout ce que tu as fait.`},ko:{ed:-150,hp:-14,hum:-3,msg:`Ça dégénère. Tu rentres plus sale que tu n'es parti(e).`}}}
    ];
    if(!G.flags.trauma) out.splice(2,0,{t:`Souscrire à la Trauma Team`,s:`${money(tt)} · seconde vie (pas contre MaxTac)`,req:()=>G.ed>=tt?``:`${money(tt)} requis`,fx:{ed:-tt,flag:[`trauma`],msg:`Un badge, une puce de géolocalisation. Une équipe blindée viendra te chercher si tu tombes.`}});
    out.push(NOPE(`Repartir sans te reposer`,`Tu repars tel(le) que tu es arrivé(e).`)); return out;
  },ch:[]});

/* ---------- Le prix d'un mauvais timing ---------- */
card({id:`big_chance`,who:`@fixer`,tag:`⚠ Le coup de ta vie`,w:8,cd:10,cond:()=>G.hp<55&&G.cred>=8&&!G.flags.q_active,
  tx:()=>`Un fixer te tire de ton lit : « Un gros coup, ce soir. <strong>6 000 €$</strong> pour dix minutes de boulot. Mais je dois savoir tout de suite. » Tu regardes ton corps : <em>${G.hp} Santé</em>, des bandages qui suintent. Tu risques ta vie si tu y vas.`,
  ch:[
    {t:`Y aller malgré tout`,s:`RÉFLEXES · combat · blessé : tout est plus dur`,chk:{a:`ref`,k:`cmb`,dc:9,ok:{ed:6000,cred:9,loot:3,msg:`Tu serres les dents, tu tiens debout. Le coup réussit. Tu t'écroules en sortant.`},ko:{hp:-60,ed:-500,hum:-4,msg:`Ton corps te lâche en plein coup. Tu rampes dehors, à bout.`}}},
    {t:`Te reposer et laisser passer`,s:`+Santé · tu rates l'occasion`,fx:{hp:30,hum:3,cred:-1,msg:`Tu fermes la porte. Quelqu'un d'autre empoche le gros lot. Mais tu respires encore.`}},
    {t:`Te faire soigner d'abord`,s:`−400 €$ · tu n'auras qu'une part`,req:R.ed(400),fx:{ed:800,hp:30,msg:`Quand tu reviens, il ne reste que des miettes. Mais tu repars sur tes deux jambes.`}}
  ]});
