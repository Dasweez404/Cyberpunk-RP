/* =====================================================================
   MOTEUR — état, règles, effets
   ===================================================================== */
let G = null;
const $ = s => document.querySelector(s);
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const byId = {}; CARDS.forEach(c => byId[c.id] = c);
const store = {
  get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  del(k){try{localStorage.removeItem(k)}catch(e){}}
};
const CYMAP = {}; CYBER.forEach(c=>CYMAP[c.id]=c);
const GEARMAP = {}; GEAR.forEach(c=>GEARMAP[c.id]=c);
CYBER.forEach(c=>{c.h=Math.round(c.h*1.7)});
const CY = id => CYMAP[id];
const DMAP = {}; DIST.forEach(d=>DMAP[d.id]=d);

/* intros liées à l'origine */
byId.st_intro.cond = ()=>G.origin===`street`;
byId.co_intro.cond = ()=>G.origin===`corpo`;
byId.no_intro.cond = ()=>G.origin===`nomad`;
CARDS.filter(c=>/^b[cp]_/.test(c.id)).forEach(c=>{ c.cond=()=>false; });
const CD = {fenc:2,psy:4,crew_scene:4,debt_collect:3,sm:2,ht_loi:4,ht_corpo:4,ht_rue:4,ht_nomad:4,fac_revenge:5,fac_clash:5,ally_call:8,ally_gift:12,big_chance:10,lg_hit:10,lg_rival:10,lg_coalition:10,hunt_1:1,fix_board:10,duty_tribute:8,leader_dispute:99,q2_1:99,q3_1:99,q5_1:99,q6_1:99,friend_danger:12,bp_rue_hi:8,bp_rue_lo:8,bp_corpo_hi:8,bp_corpo_lo:8,bp_loi_hi:8,bp_loi_lo:8,bp_nomad_hi:8,bp_nomad_lo:8,hum_warn:3,maxtac:2,loan_shark:3,fac_promo:1,mine_raid:5,legend:99};

/* ---------- état ---------- */
function newState(o){
  const at = {body:1,ref:1,tech:1,int:1,cool:1};
  Object.entries(o.at||{}).forEach(([k,v])=>at[k]+=v);
  Object.entries(o.alloc||{}).forEach(([k,v])=>at[k]+=v);
  const s = {
    v:1, name:o.name, origin:o.origin, sub:o.sub, t:0, age:START_AGE,
    hp:100, hum:100, cred:o.cred, ed:o.ed, at,
    cyber:[], hacks:[], gear:[], flags:{}, fac:{}, member:null, rank:0, jobs:0,
    mine:null, loc:`kabuki`, heat:{rue:0,corpo:0,loi:0,nomad:0}, act:0, amb:null, era:null, traits:[], ambDone:0, skip:{}, credTier:0, allies:{}, ctl:{}, hold:{}, ops:{left:2}, relT:{}, dead:{}, pendingLoot:0, trainLast:0, echo:[], lastA:null, xp:{body:0,ref:0,tech:0,int:0,cool:0}, rel:{}, bloc:{rue:50,corpo:50,loi:50,nomad:50}, dist:{}, role:{solo:0,net:0,fixer:0,tech:0,med:0,rocker:0,corpo:0,nomad:0,cop:0,boss:0},
    done:{}, hist:[], queue:[], log:[], tmp:{}, joinedOnce:{}, cur:null,
    stats:{cards:0,fights:0,jobs:0,peak:0,gigs:0}, over:null, fameBonus:0
  };
  DIST.forEach(d=>s.dist[d.id]=d.o);
  Object.entries(o.fac||{}).forEach(([k,v])=>s.fac[k]=v);
  (o.flags||[]).forEach(f=>s.flags[f]=true); s.flags.basichack=true;
  // chaque vie est différente : une partie des événements n'aura pas lieu
  CARDS.forEach(c=>{ if(/intro|retire_offer|legend|found_faction|fac_coup|fac_promo/.test(c.id)) return; if(c.story?Math.random()<.35:(c.once&&Math.random()<.22)) s.skip[c.id]=1; });
  return s;
}
const yr = () => START_YEAR + Math.floor(G.t/12);
const mo = () => G.t % 12;
const MONTHS = [`Janv.`,`Févr.`,`Mars`,`Avr.`,`Mai`,`Juin`,`Juil.`,`Août`,`Sept.`,`Oct.`,`Nov.`,`Déc.`];
const dateStr = () => `${MONTHS[mo()]} ${yr()}`;
const hasCy = id => G.cyber.includes(id);
const hasDeck = () => G.cyber.some(i=>CY(i).deck);
const deckSlots = () => G.cyber.reduce((a,i)=>a+(CY(i).deck||0),0);
function bonusAt(a){
  let v=0;
  G.cyber.forEach(i=>{v+=(CY(i).at||{})[a]||0});
  G.gear.forEach(i=>{v+=(GEARMAP[i].at||{})[a]||0});
  if(G.member) v+=(FAC[G.member].at||{})[a]||0;
  return v;
}
const A = a => clamp(G.at[a]+bonusAt(a),1,13);
function skill(k){
  let v=0;
  G.cyber.forEach(i=>{v+=(CY(i).k||{})[k]||0});
  if(k===`cmb`||k===`drv`){ let best=0; G.gear.forEach(i=>{best=Math.max(best,(GEARMAP[i].k||{})[k]||0)}); v+=best; }
  if(k===`hck`){ v+=Math.floor(G.hacks.length/2); if(G.flags.hackmentor) v+=1; }
  if(G.mine){ if(G.mine.type===`runners`&&k===`hck`)v++; if(G.mine.type===`nomads`&&k===`drv`)v++; if(G.mine.type===`gang`&&k===`cmb`)v++; }
  if(G.member===`wraiths`&&k===`drv`)v++;
  if(G.origin===`street`&&k===`stl`) v++;
  if(G.origin===`nomad`&&k===`drv`) v++;
  if(G.origin===`corpo`&&k===`soc`) v++;
  if(k===`soc`) G.gear.forEach(i=>{v+=(GEARMAP[i].k||{}).soc||0});
  if(k===`stl`) G.gear.forEach(i=>{v+=(GEARMAP[i].k||{}).stl||0});
  v+=({cmb:tr(`tueur`),hck:tr(`code`),drv:tr(`pilote`),soc:tr(`froid`),stl:tr(`ombre`)}[k])?1:0;
  return v;
}
const tr = id => !!(G.traits&&G.traits.includes(id));
const eraNow = () => ERAS[G.era]||{};
const heatState = b => { const v=(G.heat||{})[b]||0; return v>=70?`hunt`:v>=40?`want`:null; };
function bm(){ // multiplicateurs : origine, traits, époque
  const er=eraNow(), rich=tr(`riche`);
  return {
    gear:(rich?.9:1)*(er.gear||1), cyber:(G.origin===`corpo`?.9:1)*(rich?.9:1)*(er.cyber||1),
    gig:(er.gig||1), income:(rich?1.2:1)*(er.income||1), hurt:(er.hurt||1),
    rent:(G.origin===`street`?.8:G.origin===`nomad`?.6:1)*(er.rent||1)
  };
}
const cyPrice = c => Math.round(c.p*(G.flags.vik?.85:1)*(G.member===`maelstrom`?.9:1)*bm().cyber*infl());
const gearPrice = g => Math.round(g.p*(G.member===`militech`||G.member===`sixth`?.9:1)*bm().gear*infl());
function mitigation(){
  let m=0;
  G.cyber.forEach(i=>m+=CY(i).mit||0);
  G.gear.forEach(i=>m+=GEARMAP[i].mit||0);
  if(tr(`dur`)) m+=.15;
  return Math.min(.55,m);
}
const ownedList = () => DIST.filter(d=>G.dist[d.id]===`player`);
function pickFoe(d){
  const home = FAC[d.o]?d.o:null;
  const pool = Object.keys(FAC).filter(f=>f!==G.member&&f!==home);
  return pool[rnd(0,pool.length-1)];
}
const isLeader = () => G.member&&G.flags[`leader_`+G.member];
function roleTitle(){
  if(isLeader()) return `${LEADER[FAC[G.member].k]} · ${FAC[G.member].n}`;
  if(G.member) return `${RANKS[FAC[G.member].k][G.rank]} · ${FAC[G.member].n}`;
  if(G.mine) return `Fondateur · ${G.mine.name}`;
  let best=null,bv=2;
  Object.entries(G.role).forEach(([k,v])=>{if(k!==`boss`&&v>bv){bv=v;best=k}});
  if(best) return ROLES[best];
  return {street:`Street Kid`,corpo:`Corpo`,nomad:`Nomade`}[G.origin];
}
function rankTitle(){ return G.member?(isLeader()?LEADER[FAC[G.member].k]:RANKS[FAC[G.member].k][G.rank]):null; }
let CERE=[]; const cere=o=>CERE.push(o);
function promoInfo(){
  if(!G.member) return null;
  const f=FAC[G.member], k=RANKS[f.k];
  if(isLeader()) return {leader:true,title:LEADER[f.k]};
  const rep=G.fac[G.member]||0;
  if(G.rank>=3){ const ok=G.jobs>=LEAD_NEED.jobs&&rep>=LEAD_NEED.rep&&G.cred>=LEAD_NEED.cred; return {lead:true,next:`${LEADER[f.k]} (prendre la tête)`,jobs:[G.jobs,LEAD_NEED.jobs],rep:[rep,LEAD_NEED.rep],cred:[G.cred,LEAD_NEED.cred],ready:ok}; }
  const jn=JOB_NEED[G.rank], rn=REP_NEED[G.rank], cn=RANK_CRED[G.rank];
  return {next:k[G.rank+1],jobs:[G.jobs,jn],rep:[rep,rn],cred:[G.cred,cn],ready:G.jobs>=jn&&rep>=rn&&G.cred>=cn};
}
const facPowers = () => { if(!G.member) return []; const f=FAC[G.member], k=f.k, r=isLeader()?4:G.rank;
  const sp={corp:`Couverture légale : la police te repère 40 % moins vite`,ncpd:`Plaque : la police te repère deux fois moins vite`,trauma:`Clinique gratuite aux haltes`,mox:`Thérapie à moitié prix aux haltes`,clan:`Les Badlands te couvrent`,gang:`La rue te couvre : les gangs te repèrent moins vite`}[k];
  return [[0,`🎽 Couleurs : ${f.perk} · ${sp}`],[1,`🛡 Renfort : +3 à un jet de CORPS ou de RÉFLEXES, une fois par période`],[2,`🕶 Planque : ta poursuite retombe plus vite · salaire accru · opérations sur les quartiers`],[3,`📯 Ordres : +1 action d'empire · phase d'Empire`],[4,`👑 Tribut de la faction : +300 €$ par période`]].map(([n,t])=>({t,ok:r>=n,n})); };
function facBackup(a){ return (G.member&&(G.rank>=1||isLeader())&&(a===`body`||a===`ref`)&&G.facHelpP!==G.stats.cards)?`@fac`:null; }
const actOf = age => { let i=0; ACTS.forEach((a,k)=>{ if(age>=a.from) i=k; }); return i; };
const pl = (n,w)=>`${n} ${w}${n>1?`s`:``}`;
const AMBS = [
  {id:`cred`,t:a=>`Atteindre ${[20,40,60,80][a]} de Street Cred`,ok:a=>G.cred>=[20,40,60,80][a]},
  {id:`rich`,t:a=>`Posséder ${[3000,10000,25000,50000][a].toLocaleString(`fr`)} €$`,ok:a=>G.ed>=[3000,10000,25000,50000][a]},
  {id:`rank`,t:a=>`Atteindre le rang ${Math.min(3,a+1)} dans une faction`,ok:a=>!!(G.member&&(isLeader()||G.rank>=Math.min(3,a+1)))},
  {id:`own`,t:a=>`Tenir ${pl([1,2,3,4][a],`quartier`)}`,ok:a=>ownedList().length>=[1,2,3,4][a],min:1},
  {id:`crew`,t:a=>`Compter ${pl([1,2,4,5][a],`membre`)} dans ta famille`,ok:a=>crewN()>=[1,2,4,5][a],min:1},
  {id:`ally`,t:a=>`Avoir ${pl([1,2,3,4][a],`lien`)} à 40 ou plus`,ok:a=>Object.values(G.rel||{}).filter(v=>v>=40).length>=[1,2,3,4][a]},
  {id:`hum`,t:a=>`Finir l'acte avec 70 d'Humanité ou plus`,ok:a=>G.hum>=70},
  {id:`chrome`,t:a=>`Porter ${[2,3,5,6][a]} implants`,ok:a=>G.cyber.length>=[2,3,5,6][a]},
  {id:`quest`,t:a=>`Réussir ${pl([1,3,6,9][a],`mission`)} secondaire${[1,3,6,9][a]>1?`s`:``}`,ok:a=>Object.keys(G.flags).filter(f=>f.startsWith(`qdone_`)).length+(G.stats.side||0)>=[1,3,6,9][a]},
  {id:`clean`,t:a=>`Finir l'acte sans être recherché(e) (toutes les poursuites sous 40)`,ok:a=>Object.values(G.heat).every(v=>v<40)},
  {id:`attr`,t:a=>`Monter un attribut à ${[6,7,8,9][a]}`,ok:a=>Object.values(G.at).some(v=>v>=[6,7,8,9][a])},
  {id:`found`,t:a=>`Fonder ou diriger une faction`,ok:a=>!!(G.mine||isLeader()),min:1},
  {id:`pact`,t:a=>`Sceller ${pl([1,1,2,2][a],`pacte`)}`,ok:a=>Object.keys(G.allies||{}).length>=[1,1,2,2][a],min:1}
];
const ambNow = () => AMBS.find(x=>x.id===G.amb);
function pickAmbs(a){ const pool=AMBS.filter(x=>(x.min||0)<=a&&!x.ok(a)); const out=[]; while(out.length<3&&pool.length){ out.push(pool.splice(rnd(0,pool.length-1),1)[0]); } return out; }
function pickTraits(){ const pool=Object.keys(TRAITS).filter(t=>!tr(t)); const out=[]; while(out.length<3&&pool.length){ out.push(pool.splice(rnd(0,pool.length-1),1)[0]); } return out; }
function rollEra(){ const ks=Object.keys(ERAS).filter(k=>k!==G.era); G.era=ks[rnd(0,ks.length-1)]; return ERAS[G.era]; }
function credTierCheck(){ let t=0; CRED_TIERS.forEach(([v],i)=>{ if(G.cred>=v) t=i+1; }); if(t>(G.credTier||0)){ G.credTier=t; return CRED_TIERS[t-1]; } return null; }
function empireEligible(){ return !!(G.mine||isLeader()||(G.member&&G.rank>=2)); }
function empireTick(){
  if(!empireEligible()||G.inHub||G.flags.q_active) return;
  G.sinceEmp=(G.sinceEmp||0)+1; if(G.sinceEmp<4||G.queue.length) return;
  const ids=[`emp_collect`,`emp_recruit`,`emp_siege_1`,`emp_siege_1`,`emp_summit`,`emp_party`,`mine_raid`,`mine_recruit`,`p_boss`,`duty_tribute`,`lg_coalition`,`mine_traitor`,`fac_clash`,`ally_call`,`crew_favor`,`emp_offer`].filter(id=>byId[id]&&safe(byId[id].cond,false));
  if(isLeader()) ids.push(`leader_dispute`);
  if(!ids.length) return; G.sinceEmp=0; G.queue.push(ids[rnd(0,ids.length-1)]); G.empNext=true;
}
function promoAuto(){
  if(!G.member||isLeader()||G.inHub||G.flags.q_active) return;
  const p=promoInfo(); if(!p) return;
  if(p.ready){ const id=G.rank>=3?`fac_coup`:`fac_promo`; if(!G.queue.includes(id)){ if(id===`fac_coup`) delete G.done.fac_coup; G.queue.unshift(id); } return; }
  if(p.cred&&p.cred[0]>=p.cred[1]&&G.stats.cards-(G.autoM===undefined?-9:G.autoM)>=2&&!G.queue.includes(`fjob_`+G.member)){ G.autoM=G.stats.cards; G.queue.unshift(`fjob_`+G.member); }
}
function captureD(id){
  const d=DMAP[id]; if(!d) return; const prev=G.dist[id]; G.hold=G.hold||{}; G.ctl=G.ctl||{}; delete G.ctl[id];
  G.dist[id]=`player`; G.hold[id]=65; G.cred=clamp(G.cred+d.def*2,0,100); chip(`y`,`${d.n} conquis`);
  if(FAC[prev]){ G.fac[prev]=clamp((G.fac[prev]||0)-12,-100,100); FAC[prev].foes.forEach(f=>G.fac[f]=clamp((G.fac[f]||0)+5,-100,100)); }
  if(G.mine) G.mine.power++; G.log.unshift({d:dateStr(),m:`Tu prends le contrôle de ${d.n}.`});
}
function ageTick(){
  if(G.age<AGING_AGE) return;
  if(Math.random()<(hasCy(`biomon`)?.12:.24)){ const a=Math.random()<.5?`body`:`ref`; if(G.at[a]>3){ G.at[a]--; toast(`Ton corps vieillit : ${ATTRS[a].n} −1`); G.log.unshift({d:dateStr(),m:`Le temps passe : ${ATTRS[a].n} −1.`}); } }
}
/* ---------- famille : alliés recrutés dans ta faction ---------- */
const crewOf = () => (G.mine&&G.mine.crew)||[];
const crewN = () => crewOf().length+((G.mine&&G.mine.extra)||0);
function canRecruit(id){ return !!G.mine && !crewOf().includes(id) && !(G.dead||{})[id] && relv(id)>=10; }
function recruitAlly(id){
  if(!canRecruit(id)) return null;
  const r=rollInfo({a:`cool`,dc:5}), auto=relv(id)>=20;
  const roll=rnd(1,10), ok=auto||roll===10||(roll!==1&&roll>=r.need);
  CHIPS=[];
  if(ok){ G.mine.crew=G.mine.crew||[]; G.mine.crew.push(id); G.mine.power++; applyFx({rel:{[id]:6},cred:2}); chip(`y`,`${WHO[id].n.split(` `)[0]} rejoint ${G.mine.name}`); G.log.unshift({d:dateStr(),m:`${WHO[id].n} rejoint ${G.mine.name}.`}); }
  else { applyFx({rel:{[id]:-4}}); }
  return {ok,auto,roll,need:r.need,chips:CHIPS.slice()};
}
function debtTick(){
  if(G.ed>=0) return;
  const it=Math.max(60,Math.round(-G.ed*.12)); G.ed-=it; CHIPS=[]; addHeat(`rue`,7); G.hum=clamp(G.hum-2,0,100);
  toast(`Dette : −${it} €$ d'intérêts · les créanciers s'impatientent`);
}
function hubTick(){
  if(G.inHub) return;
  G.sinceHub=(G.sinceHub||0)+1; const need=(G.hp<35||G.ed<0)?4:7;
  if(G.sinceHub>=need&&!G.flags.q_active&&!G.queue.length){ G.queue.push(`afterlife_hub`); G.sinceHub=0; }
}
function addEcho(id,delay){ G.echo=G.echo||[]; G.echo.push({id,at:G.stats.cards+delay}); }
function echoTick(){ G.echo=(G.echo||[]).filter(x=>{ if(G.stats.cards>=x.at){ if(!G.queue.includes(x.id)) G.queue.push(x.id); return false; } return true; }); }

/* ---------- expérience : on progresse en pratiquant ---------- */
const xpNeed = lv => 6+3*Math.max(0,lv-3);
const MENTOR = {body:`jackie`,ref:`claire`,tech:`vik`,int:`dex`,cool:`rogue`};
function gainXp(a,amt){
  G.xp=G.xp||{body:0,ref:0,tech:0,int:0,cool:0};
  if(G.at[a]>=9) return;
  if(tr(`mentor`)) amt+=1;
  G.xp[a]+=amt; chip(`i`,`+${amt} XP ${ATTRS[a].n}`);
  while(G.at[a]<9 && G.xp[a]>=xpNeed(G.at[a])){
    G.xp[a]-=xpNeed(G.at[a]); G.at[a]++;
    chip(`p`,`★ ${ATTRS[a].n} ${G.at[a]} !`); G.log.unshift({d:dateStr(),m:`Tu progresses : ${ATTRS[a].n} ${G.at[a]}.`});
    toast(`${ATTRS[a].n} ${G.at[a]} !`); SFX.ok(); flash(`#fcee0a`); vib([30,40,30]); if(typeof levelFx===`function`) levelFx(a);
  }
}
/* ---------- blocs d'influence (équilibre) ---------- */
function heatMult(b){
  let m=(eraNow().heat||{})[b]||1;
  if(tr(`ombre`)) m*=.75;
  if(G.member){ const k=FAC[G.member].k;
    if(b===`loi`&&(k===`corp`||k===`trauma`)) m*=.6; if(b===`loi`&&k===`ncpd`) m*=.5;
    if(b===`rue`&&(k===`gang`||k===`mox`)) m*=.7; if(b===`nomad`&&k===`clan`) m*=.6; if(b===`corpo`&&k===`corp`) m*=.7; }
  return m;
}
function addHeat(b,v){
  if(!b||!v||!BLOCS[b]) return; G.heat=G.heat||{rue:0,corpo:0,loi:0,nomad:0};
  if(v>0) v*=heatMult(b);
  const o=G.heat[b]; G.heat[b]=clamp(o+v,0,100); const rd=Math.round(G.heat[b])-Math.round(o);
  if(rd) chip(rd>0?`n`:`p`,`${sgn(rd)} ${BLOCS[b].ic} ${BLOCS[b].n}`);
}
// une bonne relation fait retomber la poursuite, une mauvaise la fait monter
function moveBloc(b,d){ addHeat(b,d<0?-d*1.6:-d*.8); }
function locOwner(){ return (G.dist||{})[G.loc]; }
function locName(){ return DMAP[G.loc]?DMAP[G.loc].n:`Night City`; }
function heatFromCheck(c,ok,fx){
  if(!c) return; const k=c.k; { const ob=BLOC[locOwner()]; if(ob&&!ok) addHeat(ob,3); }
  if(k===`cmb`){ addHeat(`loi`,ok?12:16); addHeat(`rue`,ok?6:3); } else if(k===`hck`) addHeat(`corpo`,ok?10:15); else if(k===`stl`) addHeat(`loi`,ok?3:9); else if(k===`drv`) addHeat(`nomad`,ok?3:7);
  else if(ok&&fx&&fx.ed>=400) addHeat(c.a===`cool`?`corpo`:`rue`,5);
}
/* ---------- puissance d'un objet : on ne propose jamais plus faible que ce que tu as ---------- */
const KW = {cmb:2,drv:2,hck:2,soc:1.2,stl:1.2};
const itemScore = o => Object.entries(o.k||{}).reduce((a,[k,v])=>a+v*(KW[k]||1),0)+(o.mit||0)*20+Object.values(o.at||{}).reduce((a,v)=>a+v,0)*2+(o.regen||0)*.5+(o.deck||0)*1.5+(o.fame?1:0);
function upGear(g){
  const cur=G.gear.map(i=>GEARMAP[i]).find(x=>x.t===g.t); if(!cur) return true;
  const a=itemScore(g), b=itemScore(cur); if(a>b) return true;
  const ownK=new Set(Object.keys(cur.k||{}).concat(cur.mit?[`mit`]:[])), newK=Object.keys(g.k||{}).concat(g.mit?[`mit`]:[]);
  return newK.some(k=>!ownK.has(k)) && a>=b*.8;   // une autre logique, à peine plus faible
}
function upCy(c){
  const cur=G.cyber.map(i=>CY(i)).find(x=>x.slot===c.slot&&x.id!==c.id); if(!cur) return true;
  const a=itemScore(c), b=itemScore(cur); if(a>b) return true;
  const ownK=new Set(Object.keys(cur.k||{}).concat(Object.keys(cur.at||{}))), newK=Object.keys(c.k||{}).concat(Object.keys(c.at||{}));
  return newK.some(k=>!ownK.has(k)) && a>=b*.8;
}
function heatTick(){
  const base=(G.cred<20?2:G.cred<50?1:(G.stats.cards%2?1:0))+(tr(`fantome`)?2:0);
  Object.keys(BLOCS).forEach(b=>{ let dcy=base+(G.heat[b]||0)*.07; if(G.member&&G.rank>=2&&BLOC[G.member]===b) dcy+=2; G.heat[b]=clamp((G.heat[b]||0)-dcy,0,100); });
  // ta présence, ta fortune et ta notoriété attirent l'attention de chacun
  { const own=locOwner(), ob=BLOC[own], k=1+Math.floor(G.stats.cards/90)*.5;
    const add={rue:G.cred/60+(G.ed>3000?.5:0), corpo:G.ed/9000+(hasDeck()?.5:0), loi:G.cyber.length*.25+(G.cred>=30?.5:0), nomad:(G.gear.some(i=>GEARMAP[i].t===`véhicule`)?.5:0)};
    if(ob&&!((G.member&&BLOC[G.member]===ob)||(G.allies&&G.allies[own]))) add[ob]=(add[ob]||0)+1.3;
    if(own===`neutral`) add.loi+=.8;
    Object.keys(FAC).forEach(f=>{ const r=G.fac[f]||0; if(r<=-20&&BLOC[f]) add[BLOC[f]]=(add[BLOC[f]]||0)+Math.min(1.5,-r/50); });
    Object.keys(add).forEach(b=>{ const v=add[b]*k; if(v>=.3) addHeat(b,v); }); }
  // recherché(e) : ils finissent par te tomber dessus
  const hb=hottestHeat(), hv=G.heat[hb]||0;
  if(hv>=40&&!G.inHub&&!G.flags.q_active&&G.stats.cards-(G.lastHt||-9)>=4&&Math.random()<(hv-18)/85){ G.lastHt=G.stats.cards; if(!G.queue.includes(`ht_`+hb)) G.queue.push(`ht_`+hb); }
}
function hottestHeat(){ return Object.keys(BLOCS).sort((a,b)=>(G.heat[b]||0)-(G.heat[a]||0))[0]; }
function blocFromFx(fx){
  const m={}; if(!fx) return m;
  if(fx.fac) Object.entries(fx.fac).forEach(([k,v])=>{const b=BLOC[k];if(b)m[b]=(m[b]||0)+v*.5});
  if(fx.join&&BLOC[fx.join]) m[BLOC[fx.join]]=(m[BLOC[fx.join]]||0)+10;
  if(fx.bloc) Object.entries(fx.bloc).forEach(([k,v])=>m[k]=(m[k]||0)+v);
  return m;
}
/* ---------- butin : récompenses au choix ---------- */
const lootTierEd = ed => ed>=4000?3:ed>=2500?2:ed>=1200?1:0;
function makeLoot(t){
  const pool=[];
  const ed=Math.round((350*t+rnd(0,250))/50)*50;
  pool.push({k:`cash`,ic:`💰`,t:`Prime`,d:`+${money(ed)}`,ap:()=>applyFx({ed})});
  pool.push({k:`cred`,ic:`★`,t:`Réputation`,d:`+${1+t} Street Cred`,ap:()=>applyFx({cred:1+t})});
  const ats=Object.keys(ATTRS).filter(k=>G.at[k]<9);
  if(ats.length){ const a=(G.lastA&&G.at[G.lastA]<9)?G.lastA:ats[rnd(0,ats.length-1)];
    pool.push({k:`xp`,ic:`📈`,t:`Expérience`,d:`+${3+t} XP · ${ATTRS[a].n}`,ap:()=>gainXp(a,3+t)}); }
  pool.push({k:`heal`,ic:`💊`,t:`Repos mérité`,d:`+${25+10*t} Santé · +${4+2*t} Humanité`,ap:()=>applyFx({hp:25+10*t,hum:4+2*t})});
  const cands=Object.keys(WHO).filter(k=>REL_NAMES.includes(k));
  if(cands.length){ const c=cands[rnd(0,cands.length-1)];
    pool.push({k:`rel`,ic:`🤝`,t:`Faveur`,d:`+${8+3*t} lien · ${WHO[c].n}`,ap:()=>applyFx({rel:{[c]:8+3*t}})}); }
  { const hb=hottestHeat(), hv=Math.round(G.heat[hb]||0); if(hv>=25) pool.push({k:`bal`,ic:`🕶`,t:`Profil bas`,d:`${BLOCS[hb].ic} ${BLOCS[hb].n} −${12+5*t} (poursuite)`,w:3,ap:()=>addHeat(hb,-(12+5*t))}); }
  if(t>=2){ const g=GEAR.filter(x=>!G.gear.includes(x.id)&&upGear(x)&&(x.loot?(t>=3&&Math.random()<.25):x.p<=2000+2200*t)&&(!x.cred||G.cred>=x.cred)); if(g.length){ const x=g[rnd(0,g.length-1)];
    pool.push({k:`gear`,ic:`🎁`,t:`Butin`,d:`${x.n} (${x.t})`,w:2,ap:()=>{G.gear=G.gear.filter(i=>GEARMAP[i].t!==x.t);G.gear.push(x.id);chip(`y`,`Obtenu : ${x.n}`)}}); } }
  if(t>=2&&hasDeck()){ const h=HACKS.filter(x=>!G.hacks.includes(x.id)&&A(`int`)>=x.int); if(h.length&&G.hacks.length<deckSlots()){ const x=h[rnd(0,h.length-1)];
    pool.push({k:`hack`,ic:`💾`,t:`Quickhack`,d:`${x.n} (gratuit)`,w:2,ap:()=>{G.hacks.push(x.id);chip(`y`,`Chargé : ${x.n}`)}}); } }
  const out=[];
  while(out.length<3&&pool.length){
    const tw=pool.reduce((a,o)=>a+(o.w||2),0); let r=Math.random()*tw, i=0;
    for(;i<pool.length;i++){ r-=(pool[i].w||2); if(r<=0)break; }
    out.push(pool.splice(Math.min(i,pool.length-1),1)[0]);
  }
  return out;
}
/* ---------- jets ---------- */
const woundPen = () => G.hp<20?3:G.hp<40?2:G.hp<60?1:0;
const dcBonus = () => Math.min(5,Math.floor((G.age-18)/8)) + (G.cred>=70?1:0);
const infl = () => 1+0.01*(yr()-START_YEAR);
function rollInfo(c,bonus){
  const kk = c.k||(c.a===`cool`?`soc`:null);
  const tot = A(c.a) + (kk?skill(kk):0) + (bonus||0);
  const dc = typeof c.dc===`function`?c.dc():c.dc;
  const need = dc + 4 + dcBonus() + ((c.a===`body`||c.a===`ref`)?woundPen():0) - tot;
  let n=0; for(let r=1;r<=10;r++){ if(r===10||(r!==1&&r>=need)) n++; }
  return {tot,dc,need,chance:n/10};
}

/* ---------- effets ---------- */
let CHIPS = [];
const chip = (cls,txt)=>CHIPS.push({cls,txt});
const sgn = v => (v>0?`+`:``)+v;
function applyFx(fx){
  if(!fx) return;
  if(fx.hp){ let v=fx.hp; if(v>0&&tr(`survie`)) v=Math.round(v*1.5); if(v<0) v=-Math.max(1,Math.round(-v*1.35*bm().hurt*(1+Math.max(0,G.age-24)*0.015)*(G.hp<40?1.2:1)*(1-mitigation()))); const b=G.hp; G.hp=clamp(G.hp+v,0,100); if(G.hp!==b) chip(v>0?`p`:`n`,`${sgn(G.hp-b)} Santé`); if(v<0){SFX.hit();shake();flash(`#ff2a6d`)} }
  if(fx.humx){ const b=G.hum; G.hum=clamp(G.hum+fx.humx,0,100); if(G.hum!==b){ chip(G.hum>b?`p`:`n`,`${sgn(G.hum-b)} Humanité`); if(fx.humx<0)SFX.glitch(); } }
  if(fx.hum){ const hv=fx.hum<0?Math.round(fx.hum*1.5*(tr(`ame`)?.7:1)*(eraNow().hum||1)):fx.hum; const b=G.hum; G.hum=clamp(G.hum+hv,0,100); if(G.hum!==b) chip(G.hum>b?`p`:`n`,`${sgn(G.hum-b)} Humanité`); if(fx.hum<0)SFX.glitch(); }
  if(fx.cred){ const b=G.cred; const cv=fx.cred>0?Math.max(1,Math.round(fx.cred*(tr(`renom`)?1.25:1)*(1-G.cred/110))):fx.cred; G.cred=clamp(G.cred+cv,0,100); if(cv>=2) addHeat(hottestHeat(),cv*1.5); if(G.cred!==b) chip(G.cred>b?`y`:`n`,`${sgn(G.cred-b)} Street Cred`); G.stats.peak=Math.max(G.stats.peak,G.cred); }
  if(fx.ed){ const ev=fx.ed>0?Math.round(fx.ed*1.15/10)*10:fx.ed; G.ed+=ev; chip(ev>0?`i`:`n`,`${sgn(ev)} €$`); }
  if(fx.at) Object.entries(fx.at).forEach(([k,v])=>{ const b=G.at[k]; G.at[k]=clamp(G.at[k]+v,1,10); if(G.at[k]!==b) chip(`p`,`${sgn(G.at[k]-b)} ${ATTRS[k].n}`); });
  Object.entries(blocFromFx(fx)).forEach(([b,d])=>moveBloc(b,d));
  if(fx.fac) Object.entries(fx.fac).forEach(([k,v])=>{ G.fac[k]=clamp((G.fac[k]||0)+v,-100,100); });
  if(fx.rel){ G.rel=G.rel||{}; Object.entries(fx.rel).forEach(([k,v])=>{ G.rel[k]=clamp((G.rel[k]||0)+v,-50,100); G.relT=G.relT||{}; G.relT[k]=G.stats.cards; chip(v>0?`p`:`n`,`${sgn(v)} lien · ${WHO[k].n.split(` `)[0]}`); }); }
  if(fx.role) Object.entries(fx.role).forEach(([k,v])=>G.role[k]=(G.role[k]||0)+v);
  if(fx.flag) fx.flag.forEach(f=>G.flags[f]=true);
  if(fx.unflag) fx.unflag.forEach(f=>delete G.flags[f]);
  if(fx.flagMark) G.joinedOnce[fx.flagMark]=true;
  if(fx.unonce) delete G.done[fx.unonce];
  if(fx.loot) G.pendingLoot=Math.max(G.pendingLoot||0,fx.loot);
  if(fx.hack&&!G.hacks.includes(fx.hack)){ G.hacks.push(fx.hack); G.role.net+=1; chip(`y`,`Quickhack chargé`); }
  if(fx.cy){ const c=CY(fx.cy); if(upCy(c)||!G.cyber.some(i=>CY(i).slot===c.slot)){ installCy(fx.cy,true); chip(`y`,`Installé : ${c.n}`); } else { const v=Math.max(300,Math.round(c.p*.4/50)*50); G.ed+=v; chip(`i`,`Ton implant est meilleur : ${c.n} revendu +${v} €$`); } }
  if(fx.xp) Object.entries(fx.xp).forEach(([k,v])=>gainXp(k,v));
  if(fx.gear){ const g=GEARMAP[fx.gear]; if(upGear(g)){ G.gear=G.gear.filter(i=>GEARMAP[i].t!==g.t); G.gear.push(g.id); chip(`y`,`Obtenu : ${g.n}`); } else { const v=Math.max(250,Math.round((g.p||800)*.5/50)*50); G.ed+=v; chip(`i`,`Tu as mieux : ${g.n} revendu +${v} €$`); } }
  if(fx.join) joinFac(fx.join);
  if(fx.fn && FN[fx.fn]) FN[fx.fn]();
  if(fx.hub){ G.hubUsed=G.hubUsed||{}; G.hubUsed[fx.hub]=1; G.hubLeft=Math.max(0,(G.hubLeft||0)-1); }
  if(fx.hubEnd){ G.inHub=false; G.hubLeft=0; }
  if(fx.loc&&DMAP[fx.loc]){ G.loc=fx.loc; G.forceEnc=true; chip(`i`,`📍 ${DMAP[fx.loc].n}`); }
  if(fx.found) G.pendingFound = fx.found;
  if(fx.echo) Object.entries(fx.echo).forEach(([id,d])=>addEcho(id,d));
  if(fx.next) (Array.isArray(fx.next)?fx.next:[fx.next]).forEach(n=>G.queue.push(n));
}
function joinFac(id){
  if(G.member&&G.member!==id) G.fac[G.member]=(G.fac[G.member]||0)-10;
  G.member=id; G.rank=0; G.jobs=0; G.fac[id]=Math.max(20,(G.fac[id]||0)+20);
  FAC[id].foes.forEach(f=>G.fac[f]=clamp((G.fac[f]||0)-15,-100,100));
  chip(`y`,`Membre : ${FAC[id].n}`); SFX.ok();
  const f=FAC[id];
  cere({k:`join`,c:f.c,ic:`🛡`,kick:`SERMENT`,t:f.n,sub:`Bienvenue, ${RANKS[f.k][0]}`,lines:[`🎯 ${f.perk}`,f.foes.length?`⚔ Désormais tes ennemis : ${f.foes.map(x=>FAC[x]?FAC[x].n:x).join(`, `)}`:`⚔ Aucun ennemi déclaré`,`🔒 Tu ne peux plus fonder ta propre faction tant que tu portes leurs couleurs`]});
}
function leaveFac(id,why){
  const f=FAC[id], old=RANKS[f.k][G.rank], wasLeader=!!G.flags[`leader_`+id];
  const pen = why===`betray`?45:why===`found`?20:35;
  G.fac[id]=clamp((G.fac[id]||0)-pen,-100,100); G.joinedOnce[id]=true; G.flags[`exfac_`+id]=true; delete G.flags[`leader_`+id];
  moveBloc(BLOC[id], why===`betray`?-14:why===`found`?-4:-9);
  G.lastEx=id; G.member=null; G.rank=0; G.jobs=0;
  G.log.unshift({d:dateStr(),m:why===`betray`?`Tu trahis ${f.n}.`:`Tu quittes ${f.n}.`});
  if(why===`betray`){ G.flags.hunted=true; addEcho(`hunt_1`,2); addEcho(`hunt_2`,7); }
  else if(why===`quit`){ addEcho(`ex_grudge`,5); }
  return {old:wasLeader?LEADER[f.k]:old,f};
}
function removeCy(id){ G.cyber=G.cyber.filter(x=>x!==id); }
function installCy(id,free){
  const c=CY(id);
  G.cyber=G.cyber.filter(x=>CY(x).slot!==c.slot);
  if(c.slot===`neural`&&!hasCy(`plug`)) {}
  G.cyber.push(id);
  if(c.slot===`neural`&&c.id!==`plug`){}
}
const relv = id => (G.rel&&G.rel[id])||0;
let CUR_CH=null;
const chOf = c => (CUR_CH&&G.cur&&G.cur.id===c.id)?CUR_CH:c.ch;
const visChoices = c => chOf(c).map((h,i)=>({h,i})).filter(x=>!x.h.only||x.h.only===G.origin);
function bestAlly(a){
  if(G.helpP===G.stats.cards) return null;
  const l=(ALLY[a]||[]).filter(i=>relv(i)>=25&&!(G.dead||{})[i]); l.sort((x,y)=>relv(y)-relv(x)); return l[0]||null;
}
function relTier(v){ let t=REL_TIERS[0][1]; REL_TIERS.forEach(([n,l])=>{if(v>=n)t=l}); return t; }
function relDecay(){
  G.relT=G.relT||{};
  Object.keys(G.rel||{}).forEach(id=>{
    if(G.rel[id]>=10 && !(G.dead||{})[id] && G.stats.cards-(G.relT[id]||0)>=10){
      G.rel[id]-=3; G.relT[id]=G.stats.cards; toast(`${WHO[id].n.split(` `)[0]} s'éloigne… (${G.rel[id]})`);
    }
  });
}
function adviceNow(){
  if(G.hp<45) return {ic:`➕`,t:`Santé basse (${G.hp}) : blessé, tu es moins efficace. Repose-toi à la prochaine halte 🍸.`,go:`heal`};
  if(G.hum<45) return {ic:`🧠`,t:`Humanité basse (${G.hum}) : pense à la thérapie à la prochaine halte 🍸.`,go:`therapy`};
  { const hb=hottestHeat(), hv=G.heat[hb]||0; if(hv>=70) return {ic:BLOCS[hb].ic,t:`${BLOCS[hb].n} te traque (${Math.round(hv)}) : fais profil bas avant la capture.`,go:`heat`}; }
  return null;
}
const FN = {
  hackMentor(){ G.flags.hackmentor=true; [`ping`,`shortc`].forEach(h=>{ if(!G.hacks.includes(h)) G.hacks.push(h); }); G.at.int=clamp(G.at.int+1,1,10); chip(`y`,`Hack avancé appris`); chip(`p`,`+1 INTELLECT`); toast(`Tu maîtrises le hacking !`); },
  allySaved(){ const id=G.tmp&&G.tmp.ally; if(id) { chip(`y`,`${WHO[id].n.split(` `)[0]} est sauvé(e)`); } },
  allyLost(){ const id=G.tmp&&G.tmp.ally; if(!id) return; G.dead=G.dead||{}; G.dead[id]=true; G.rel[id]=0; chip(`n`,`† ${WHO[id].n.split(` `)[0]} est mort(e)`); G.log.unshift({d:dateStr(),m:`${WHO[id].n} est mort(e).`}); G.hum=clamp(G.hum-10,0,100); chip(`n`,`−10 Humanité`); },
  sellOne(){ if(!G.cyber.length)return; const id=G.cyber[rnd(0,G.cyber.length-1)]; removeCy(id); const v=Math.round(CY(id).p*.5); G.ed+=v; chip(`i`,`+${v} €$`); chip(`n`,`− ${CY(id).n}`); },
  defendWin(){ if(G.mine) G.mine.power++; if(G.tmp&&G.tmp.d){G.hold=G.hold||{};G.hold[G.tmp.d]=clamp(holdOf(G.tmp.d)+20,0,100);} chip(`y`,`Territoire défendu`); },
  defendLose(){ const d=G.tmp&&G.tmp.d; if(d&&G.dist[d]===`player`){ G.dist[d]=G.tmp.rival||`neutral`; chip(`n`,`Perdu : ${DMAP[d].n}`); } },
  mineGrow(){ if(G.mine){G.mine.power++;chip(`y`,`Puissance de ${G.mine.name} +1`);} },
  facJobWin(){ const f=FAC[G.member]; const pay=(G.rank+1)*450+rnd(0,350); G.ed+=pay; G.cred=clamp(G.cred+3+G.rank,0,100); G.fac[G.member]=clamp((G.fac[G.member]||0)+9,-100,100); G.jobs++; G.stats.jobs++; G.pendingLoot=Math.max(G.pendingLoot||0,G.rank>=2?2:1); chip(`i`,`+${pay} €$`); { const pi=promoInfo(); if(pi&&pi.jobs) chip(`y`,`Missions ${Math.min(pi.jobs[0],pi.jobs[1])}/${pi.jobs[1]}`); } chip(`y`,`+${3+G.rank} Street Cred`); chip(`i`,`+9 ${f.n}`); },
  facJobFail(){ G.jobs=Math.max(0,G.jobs); },
  promote(){ const f=FAC[G.member]; const oldT=RANKS[f.k][G.rank]; G.rank++; G.jobs=0; const pay=500*G.rank; G.ed+=pay; G.fac[G.member]=clamp((G.fac[G.member]||0)+8,-100,100); chip(`y`,`Rang : ${RANKS[f.k][G.rank]}`); chip(`i`,`+${pay} €$`);
    if(f.k===`mox`){G.hum=clamp(G.hum+8,0,100);chip(`p`,`+8 Humanité`)}
    if(G.member===`maelstrom`){G.hum=clamp(G.hum-6,0,100);chip(`n`,`−6 Humanité`)}
    if(f.k===`trauma`){G.hp=100;chip(`p`,`Soins gratuits`)}
    if(G.rank>=2) G.flags.duty=true;
    cere({k:`promo`,c:f.c,ic:`⬆`,kick:`PROMOTION`,t:RANKS[f.k][G.rank],sub:`${oldT} → ${RANKS[f.k][G.rank]} · ${f.n}`,lines:[`💰 +${pay} €$`,`✨ ${RANK_PERKS[G.rank-1]}`,(G.rank<3?`🎯 Prochain grade : ${RANKS[f.k][G.rank+1]} — Street Cred ${RANK_CRED[G.rank]} et une mission`:`🎯 Prochaine étape : prendre la tête (Street Cred ${LEAD_NEED.cred})`),`🔓 ${(facPowers().find(x=>x.n===G.rank)||{t:``}).t}`,G.rank>=2?`⚠ Plus de pouvoir, plus de devoirs : la famille attend sa part`:`⚔ Ceux d'en bas te regardent, ceux d'en haut aussi`]});
    SFX.ok(); },
  betray(){ const old=G.member; const nw=FAC[old].foes[0]; const r=leaveFac(old,`betray`); G.fac[old]=-70; cere({k:`betray`,c:`#ff2a6d`,ic:`🗡`,kick:`TRAHISON`,t:`Tu trahis ${FAC[old].n}`,sub:`Tu perds ton rang de ${r.old}`,lines:[`💀 Un contrat est mis sur ta tête`,`📉 Réputation chez ${FAC[old].n} : −70`,`⚖ ${BLOCS[BLOC[old]].n} te tourne le dos`,`👥 Tes anciens frères te chercheront`]}); joinFac(nw); },
  seizeFaction(){ const id=G.member; G.flags[`leader_`+id]=true; G.rank=3; cere({k:`leader`,c:FAC[id].c,ic:`👑`,kick:`COURONNE`,t:`Tu diriges ${FAC[id].n}`,sub:`${LEADER[FAC[id].k]} · ${FAC[id].n}`,lines:[`🏙 Ton quartier d'origine est à toi`,`⚠ Les ambitieux t'observent : attention aux complots`,`📜 Tu portes le poids de tous les tiens`]}); addEcho(`leader_dispute`,3); addEcho(`leader_coup`,12); const hd=FAC[id].home; if(DMAP[hd]) G.dist[hd]=`player`; G.role.boss+=2; chip(`y`,`Tu diriges ${FAC[id].n}`); toast(`Tu prends la tête de ${FAC[id].n}`); SFX.ok(); flash(`#fcee0a`); },
  holdAll(){ ownedList().forEach(d=>{G.hold[d.id]=clamp(holdOf(d.id)+25,0,100)}); chip(`y`,`Quartiers renforcés`); },
  holdLose(){ ownedList().forEach(d=>{G.hold[d.id]=clamp(holdOf(d.id)-25,0,100)}); chip(`n`,`Tes quartiers vacillent`); },
  revengeWin(){ const id=G.tmp&&G.tmp.fid; if(FAC[id]){ FAC[id].foes.forEach(x=>{G.fac[x]=clamp((G.fac[x]||0)+4,-100,100)}); chip(`y`,`${FAC[id].n} y réfléchira à deux fois`); } },
  revengePay(){ const id=G.tmp&&G.tmp.fid; if(FAC[id]){ G.fac[id]=clamp((G.fac[id]||0)+20,-100,100); chip(`i`,`+20 ${FAC[id].n}`); } },
  clashWin(){ const id=G.tmp&&G.tmp.fid; if(!G.member) return; G.jobs++; G.stats.jobs++; G.fac[G.member]=clamp((G.fac[G.member]||0)+6,-100,100); chip(`i`,`+6 ${FAC[G.member].n}`); if(FAC[id]){ G.fac[id]=clamp((G.fac[id]||0)-8,-100,100); chip(`n`,`−8 ${FAC[id].n}`); } const pi=promoInfo(); if(pi&&pi.jobs) chip(`y`,`Missions ${Math.min(pi.jobs[0],pi.jobs[1])}/${pi.jobs[1]}`); },
  clashLose(){ if(!G.member) return; G.fac[G.member]=clamp((G.fac[G.member]||0)-6,-100,100); chip(`n`,`−6 ${FAC[G.member].n}`); },
  allyHelp(){ const id=G.tmp&&G.tmp.fid; if(FAC[id]){ G.fac[id]=clamp((G.fac[id]||0)+10,-100,100); chip(`i`,`+10 ${FAC[id].n}`); } },
  allyBreak(){ const id=G.tmp&&G.tmp.fid; if(FAC[id]) facBreak(id); },
  payAll(){ const v=Math.max(0,G.ed); G.ed=0; chip(`n`,`−${v.toLocaleString(`fr`)} €$`); G.gear=G.gear.filter(i=>GEARMAP[i].t!==`véhicule`); },
  twAme(){ if(!tr(`ame`)){ G.traits.push(`ame`); chip(`y`,`Trait : Âme intacte`); } },
  twSurvie(){ if(!tr(`survie`)){ G.traits.push(`survie`); chip(`y`,`Trait : Instinct de survie`); } },
  sideDone(){ G.stats.side=(G.stats.side||0)+1; },
  empPush(){ const d=G.tmp&&G.tmp.d; if(!d) return; G.ctl=G.ctl||{}; G.ctl[d]=clamp((G.ctl[d]||0)+40,0,99); chip(`y`,`+40 influence · ${DMAP[d].n}`); },
  empBuy(){ const d=G.tmp&&G.tmp.d; if(!d) return; G.ctl=G.ctl||{}; G.ctl[d]=clamp((G.ctl[d]||0)+30,0,99); chip(`y`,`+30 influence · ${DMAP[d].n}`); },
  seizeGear(){ const n=G.gear.length; G.gear=[]; chip(`n`,`−${n} équipement(s)`); G.ed=Math.min(0,G.ed+n*700); chip(`i`,`Dette réduite`); },
  debtCut(){ if(G.ed<0){ const v=Math.round(-G.ed*.35); G.ed+=v; chip(`i`,`Dette −${v} €$`); } },
  treat(){ const ks=REL_NAMES.filter(i=>relv(i)>0&&relv(i)<80&&!(G.dead||{})[i]); if(ks.length){ const k=ks[rnd(0,ks.length-1)]; applyFx({rel:{[k]:8}}); } },
  recruit(){ if(G.mine){ G.mine.extra=(G.mine.extra||0)+1; G.mine.power++; chip(`y`,`Nouvelle recrue dans ${G.mine.name}`); } else { G.cred=clamp(G.cred+2,0,100); chip(`y`,`+2 Street Cred`); } },
  siegeSet(){ if(G.siege) G.siege.scout=1; },
  arcWin(){ G.arcW=(G.arcW||0)+1; },
  arcEnd(){ G.stats.side=(G.stats.side||0)+2; G.arcW=0; },
  summitPact(){ const id=G.tmp&&G.tmp.fid; if(FAC[id]){ G.allies=G.allies||{}; G.allies[id]=true; G.fac[id]=clamp((G.fac[id]||0)+15,-100,100); chip(`y`,`Pacte avec ${FAC[id].n}`); cere({k:`join`,c:FAC[id].c,ic:`📜`,kick:`PACTE`,t:`Alliance avec ${FAC[id].n}`,sub:`Scellée sans un eddie`,lines:[`💰 +100 €$ par période`,`⚔ Leurs ennemis deviennent méfiants`,`⚠ Ils t'appelleront à l'aide`]}); } },
  summitSour(){ const id=G.tmp&&G.tmp.fid; if(FAC[id]){ G.fac[id]=clamp((G.fac[id]||0)-6,-100,100); chip(`n`,`−6 ${FAC[id].n}`); } },
  summitFear(){ const id=G.tmp&&G.tmp.fid; if(FAC[id]){ G.fac[id]=clamp((G.fac[id]||0)+5,-100,100); chip(`i`,`+5 ${FAC[id].n}`); } },
  siegeWin(){ const s=G.siege; if(s&&s.d){ captureD(s.d); } G.siege=null; },
  siegeLose(){ const s=G.siege; if(s&&s.d){ G.ctl=G.ctl||{}; G.ctl[s.d]=Math.max(0,(G.ctl[s.d]||0)-10); if(G.mine&&G.mine.extra>0){ G.mine.extra--; chip(`n`,`Une recrue est tombée`);} } G.siege=null; },
  holdUp(){ const d=G.tmp&&G.tmp.d; if(d&&G.dist[d]===`player`){ G.hold[d]=clamp(holdOf(d)+15,0,100); chip(`y`,`${DMAP[d].n} tient mieux`); } },
  holdDown(){ const d=G.tmp&&G.tmp.d; if(d&&G.dist[d]===`player`){ G.hold[d]=clamp(holdOf(d)-8,0,100); chip(`n`,`${DMAP[d].n} vacille`); } },
  cancelHunt(){ G.echo=(G.echo||[]).filter(x=>x.id!==`hunt_2`); delete G.flags.hunted; chip(`y`,`Prime levée`); },
  loseLead(){ if(!isLeader()) return; const id=G.member; delete G.flags[`leader_`+id]; G.rank=2; chip(`n`,`Tu perds la couronne`); cere({k:`betray`,c:`#ff2a6d`,ic:`💀`,kick:`DESTITUTION`,t:`Tu n'es plus à la tête`,sub:`${FAC[id].n} t'a renversé(e)`,lines:[`⬇ Rang : ${RANKS[FAC[id].k][2]}`,`📉 Ta réputation s'effondre`,`🗡 Tes rivaux se partagent ta place`]}); G.fac[id]=clamp((G.fac[id]||0)-25,-100,100); },
  facDefy(){ if(G.member){ G.fac[G.member]=clamp((G.fac[G.member]||0)-14,-100,100); chip(`n`,`−14 ${FAC[G.member].n}`); G.flags.duty=true; } },
  mineLose(){ if(G.mine&&G.mine.power>1){ G.mine.power--; chip(`n`,`Puissance −1`);} },
  facLoyal(){ G.fac[G.member]=clamp((G.fac[G.member]||0)+12,-100,100); }
};

/* ---------- temps & économie ---------- */
function tick(months){
  const k = months/BASE;
  let inc = 0;
  ownedList().forEach(d=>inc+=d.inc*3*(.4+.6*holdOf(d.id)/100)*(G.mine&&G.mine.type===`gang`?1.2:1));
  if(G.mine&&G.mine.type===`fixers`) inc+=300;
  inc+=crewN()*120;
  inc+=Object.keys(G.allies||{}).length*100;
  if(isLeader()) inc+=300;
  if(G.flags.corpjob) inc+=140*BASE;
  if(G.member){ const kd=FAC[G.member].k; inc+= (kd===`corp`||kd===`ncpd`||kd===`trauma`?110:55)*(G.rank+1)*BASE*.6; }
  inc*=bm().income;
  inc-=crewN()*70+ownedList().length*45;
  const rent = clamp(20+Math.max(0,G.ed)*.003+G.cred*.8,20,150)*infl()*BASE*bm().rent;
  const net = Math.round((inc-rent)*k);
  G.ed += net;
  const reg = G.cyber.reduce((a,i)=>a+(CY(i).regen||0),0);
  if(reg) G.hp=clamp(G.hp+Math.round(reg*k),0,100);
  G.hp = clamp(G.hp+Math.round(5*k*Math.max(.4,1-Math.max(0,G.age-30)*0.02)),0,100);
  if(G.flags.aging){ G.hp=clamp(G.hp-Math.max(1,Math.round(3*k)),0,100); }
  G.t += months;
  G.age = START_AGE + Math.floor(G.t/12);
  if(ownedList().length){ G.cred=clamp(G.cred+ownedList().length*0.3*k|0,0,100); }
  return net;
}

/* ---------- tirage ---------- */
function safe(fn,d){ try{return fn()}catch(e){return d} }
function whoCur(c){ return (G.cur&&G.cur.id===c.id&&(G.cur.npc||(G.cur.who&&WHO[G.cur.who])))?(G.cur.npc||WHO[G.cur.who]):(WHO[c.who]||WHO.narr); }
function drawCard(){
  while(G.queue.length){ const c=byId[G.queue.shift()]; if(c) return c; }
  const T=G.t;
  const SK=G.skip||{}, wt=c=>typeof c.w===`function`?c.w():(c.w||5);
  const st = CARDS.filter(c=>c.story && !SK[c.id] && !G.done[c.id] && T>=(c.at[0]-START_YEAR)*12+c.at[1] && (!c.cond||safe(c.cond,false)));
  if(st.length){ st.sort((a,b)=>(a.at[0]*12+a.at[1])-(b.at[0]*12+b.at[1])); return st[0]; }
  const recent = id => { const cd=CD[id]||7; return G.hist.slice(-cd).includes(id); };
  let pool = CARDS.filter(c=>!c.story && !SK[c.id] && (!c.once||!G.done[c.id]) && (!c.cond||safe(c.cond,false)) && !recent(c.id));
  if(!pool.length) pool = CARDS.filter(c=>c.id.startsWith(`fl`));
  const tw = pool.reduce((a,c)=>a+wt(c),0);
  let r = Math.random()*tw;
  for(const c of pool){ r-=wt(c); if(r<=0) return c; }
  return pool[0];
}
function prepCard(c){
  G.done[c.id]=true; G.hist.push(c.id); if(G.hist.length>40)G.hist.shift();
  G.tmp={};
  const raw = typeof c.tx===`function`?c.tx():c.tx;
  G.cur = {id:c.id, text:raw.replace(/\{n\}/g,G.name)};
  let npc=null;
  if(c.who===`@fac`&&G.member){ const f=FAC[G.member]; npc=(Math.random()<.3&&WHO[f.leader])?null:genNpc(f.k,f.c,`${RANKS[f.k][Math.min(3,G.rank+1)]} · ${f.n}`); if(!npc) G.cur.who=f.leader; }
  else if(c.who===`@ex`){ const f=FAC[G.lastEx]; npc=f?genNpc(f.k,f.c,`Ex-frère · ${f.n}`):genNpc(`gang`); }
  else if(c.who===`@fixer`){ G.cur.who=FIXERS[rnd(0,FIXERS.length-1)]; }
  else if(c.who===`@psy`){ npc=genNpc(`gang`,`#ff2a6d`,`Cyberpsycho`); npc.st=`visor`; npc.sk=8; }
  else if(c.who===`@enemy`){ const f=FAC[G.tmp&&G.tmp.fid]; npc=f?genNpc(f.k,f.c,f.n):genNpc(`gang`); }
  else if(c.who===`@hub`){ G.cur.who=pickR([`rogue`,`dex`,`claire`,`hands`,`dino`,`faraday`]); }
  else if(GENERIC_WHO[c.who]) npc=genNpc(GENERIC_WHO[c.who]);
  else if(c.who===`narr`){ const ds=DIST.filter(d=>!d.lock||G.flags.dogtown), d=(DMAP[G.loc]&&Math.random()<.65)?DMAP[G.loc]:ds[rnd(0,ds.length-1)]; npc={n:/^fl/.test(c.id)?d.n:`Night City`,r:/^fl/.test(c.id)?`${d.w} · ${dateStr()}`:dateStr(),c:`#fcee0a`,scene:1,ic:pickR([`🌧`,`🌃`,`🏙`,`🌆`,`🚇`,`🛣`,`🌫`,`🔥`,`🚕`,`📡`]),st:`hood`,sk:30}; }
  if(npc) G.cur.npc=npc;
  CUR_CH=c.dyn?c.dyn():null;
}

/* ---------- guerre de territoire ---------- */
const OPS_PER=3;
const opsLeft=()=>{ if(!G.ops) G.ops={left:OPS_PER}; return G.ops.left; };
const holdOf=id=>{ if(!G.hold) G.hold={}; return G.hold[id]===undefined?65:G.hold[id]; };
function warDc(d,base){ return base - 1.5 + ownedList().length*.7 + Math.floor((yr()-START_YEAR)/6) - Math.min(3,Math.floor(crewN()/2)); }
function conquestChoices(d){
  const o=[];
  o.push({k:`assault`,t:`Assaut armé`,s:`${ATTRS.body.n} + combat · +28 influence`,a:`body`,sk:`cmb`,dc:warDc(d,4+d.def*1.5)});
  o.push({k:`hack`,t:`Piratage des systèmes`,s:`${ATTRS.int.n} + hack · +24 influence`,a:`int`,sk:`hck`,dc:warDc(d,5+d.def*1.5),req:(hasDeck()||G.flags.hackmentor)?``:`Hack avancé requis (deck ou formation)`});
  o.push({k:`talk`,t:`Diplomatie & pression`,s:`${ATTRS.cool.n} · +20 influence · sans risque physique`,a:`cool`,sk:null,dc:warDc(d,5.5+d.def*1.5)});
  const price=d.def*1000;
  o.push({k:`buy`,t:`Corrompre & financer`,s:`${price} €$ · +35 influence, sans jet`,price,req:G.ed>=price?``:`${price} €$ requis`});
  return o;
}
function canConquer(d){
  if(G.dist[d.id]===`player`) return `Déjà à toi`;
  if(!empireEligible()) return `Réservé aux chefs de crew et aux hauts gradés (rang 2)`;
  if(d.lock&&!G.flags.dogtown) return `Verrouillé`;
  if(G.member&&G.dist[d.id]===G.member) return `Ta propre faction`;
  if((G.allies||{})[G.dist[d.id]]) return `Territoire d'un allié : romps le pacte d'abord`;
  const need = d.def*5+ownedList().length*2;
  if(G.cred<need) return `Street Cred ${need} requis`;
  return ``;
}
function doOperation(d,opt){
  CHIPS=[]; G.ctl=G.ctl||{}; G.hold=G.hold||{}; opsLeft(); G.ops.left--;
  const prev=G.dist[d.id]; let ok=true, info=null, gain=0;
  if(opt.k===`buy`){ G.ed-=opt.price; chip(`n`,`−${opt.price} €$`); gain=45; }
  else {
    const c={a:opt.a,k:opt.sk,dc:opt.dc - (G.member&&FAC[G.member].foes.includes(prev)?2:0) - (Object.keys(G.allies||{}).some(a=>FAC[a].foes.includes(prev))?2:0)};
    const ri=rollInfo(c); const roll=rnd(1,10);
    ok = roll===10||(roll!==1&&roll>=ri.need); info={roll,...ri,ok}; gainXp(opt.a,ok?3:1);
    gain = ok ? ({assault:36,hack:32,talk:28}[opt.k]+(roll===10?16:0)) : -6;
  }
  const before=G.ctl[d.id]||0; G.ctl[d.id]=clamp(before+gain,0,100);
  chip(gain>0?`y`:`n`,`${sgn(G.ctl[d.id]-before)} influence`);
  if(!ok){ if(opt.k!==`talk`) applyFx({hp:-(d.def*7)}); G.cred=clamp(G.cred-2,0,100); chip(`n`,`−2 Street Cred`); }
  if(FAC[prev]){ G.fac[prev]=clamp((G.fac[prev]||0)-3,-100,100); }
  let captured=false, riposte=null;
  if(G.ctl[d.id]>=100){
    captured=true; delete G.ctl[d.id]; G.dist[d.id]=`player`; G.hold[d.id]=65;
    G.cred=clamp(G.cred+d.def*2,0,100); chip(`y`,`+${d.def*2} Street Cred`);
    if(FAC[prev]){ G.fac[prev]=clamp((G.fac[prev]||0)-12,-100,100); moveBloc(BLOC[prev],-8); FAC[prev].foes.forEach(f=>G.fac[f]=clamp((G.fac[f]||0)+5,-100,100)); }
    if(G.mine) G.mine.power++;
    G.log.unshift({d:dateStr(),m:`Tu prends le contrôle de ${d.n}.`}); chip(`y`,`${d.n} conquis`);
  } else if(Math.random()<.45){
    const mine=ownedList();
    if(mine.length){ const t=mine[rnd(0,mine.length-1)]; G.hold[t.id]=clamp(holdOf(t.id)-15,0,100); riposte=`Riposte ennemie sur ${t.n} (−15 tenue)`; chip(`n`,`⚔ ${riposte}`); }
    else { applyFx({hp:-10}); riposte=`Riposte : embuscade sur toi`; }
  }
  tick(1);
  return {ok,info,gain,captured,riposte,chips:CHIPS.slice()};
}
const doConquer = doOperation;
function reinforce(d){
  const price=d.def*350; if(G.ed<price) return false;
  G.ed-=price; G.hold=G.hold||{}; G.hold[d.id]=clamp(holdOf(d.id)+35,0,100); return price;
}
function warTick(){
  G.ops={left:OPS_PER+(tr(`meneur`)?1:0)+((G.member&&G.rank>=3)?1:0)}; G.ctl=G.ctl||{}; G.hold=G.hold||{};
  Object.keys(FAC).forEach(k=>{ if((G.fac[k]||0)<=-60&&ownedList().length&&Math.random()<.35){ const t=ownedList()[rnd(0,ownedList().length-1)]; G.hold[t.id]=clamp(holdOf(t.id)-12,0,100); toast(`⚔ ${FAC[k].n} attaque ${t.n} (−12 tenue)`); } });
  Object.keys(G.ctl).forEach(id=>{ G.ctl[id]=Math.max(0,G.ctl[id]-6); if(!G.ctl[id]) delete G.ctl[id]; });
  ownedList().forEach(d=>{
    const dec=rnd(4,9)+(d.def>=4?2:0)-Math.floor((G.mine?G.mine.power:0)/2)-Math.floor(crewN()/2);
    G.hold[d.id]=clamp(holdOf(d.id)-Math.max(1,dec),0,100);
    if(G.hold[d.id]<=0){ const prev=FAC[d.o]?d.o:`neutral`; G.dist[d.id]=prev; delete G.hold[d.id]; toast(`${d.n} t'échappe !`); G.log.unshift({d:dateStr(),m:`Tu perds le contrôle de ${d.n} faute de tenue.`}); }
    else if(G.hold[d.id]<=25) toast(`⚠ ${d.n} : tenue ${G.hold[d.id]} — renforce !`);
  });
}

/* ---------- diplomatie : rejoindre, aider, attaquer, pactiser ---------- */
function facNeeds(id){
  const c=v=>({t:`Street Cred ${v}`,ok:G.cred>=v}), at=(a,v)=>({t:`${ATTRS[a].n} ${v}`,ok:A(a)>=v}), or=(t,ok)=>({t,ok});
  const corp=v=>[or(`Origine Corpo ou Street Cred ${v}`,G.origin===`corpo`||G.cred>=v)];
  const M={
    valentinos:[c(5)], maelstrom:[c(6)], tygers:[c(6)], sixth:[c(6)],
    voodoo:[or(`INTELLECT 5 ou cyberdeck`,hasDeck()||A(`int`)>=5)], animals:[at(`body`,5)], mox:[at(`cool`,4)],
    aldecaldos:[or(`Origine Nomade ou TECHNIQUE 5`,G.origin===`nomad`||A(`tech`)>=5)], wraiths:[or(`Origine Nomade ou RÉFLEXES 5`,G.origin===`nomad`||A(`ref`)>=5)],
    barghest:[or(`À partir de 2077`,yr()>=2077),c(15)], ncpd:[c(6),at(`int`,4)],
    arasaka:corp(18), militech:corp(18), kangtao:corp(18), biotechnica:corp(15),
    trauma:[or(`TECHNIQUE 5 ou INTELLECT 5`,A(`tech`)>=5||A(`int`)>=5)]
  };
  const l=(M[id]||[]).slice(), r=G.fac[id]||0;
  l.push({t:`Réputation au-dessus de −25 (actuelle : ${r})`,ok:r>-25});
  if(G.flags[`exfac_`+id]) l.push({t:`Ancien membre : réputation 30 pour être pardonné`,ok:r>=30});
  return l;
}
Object.keys(FACREQ).forEach(k=>{ FACREQ[k]=()=>facNeeds(k).every(x=>x.ok); });
const canJoin = id => !G.member&&!G.mine&&facNeeds(id).every(x=>x.ok);
function facStatus(id){
  const r=G.fac[id]||0;
  if(G.member===id) return [isLeader()?`CHEF`:`MEMBRE`,`y`];
  if((G.allies||{})[id]) return [`ALLIÉ`,`g`];
  if(r<=-60) return [`EN GUERRE`,`m`]; if(r<=-30) return [`HOSTILE`,`m`]; if(r>=40) return [`AMI`,`g`];
  return [`NEUTRE`,`d`];
}
function hottest(){ let best=null,bv=-29; Object.keys(FAC).forEach(k=>{ const r=G.fac[k]||0; if(r<bv){bv=r;best=k} }); return best; }
const facAttr = f => ({gang:`body`,corp:`cool`,clan:`ref`,ncpd:`int`,mox:`cool`,trauma:`tech`}[f.k]||`cool`);
const facStr = id => DIST.filter(d=>G.dist[d.id]===id).length;
function facOdds(id,kind){ const f=FAC[id]; return kind===`favor`?rollInfo({a:facAttr(f),dc:6}):rollInfo({a:`body`,k:`cmb`,dc:7+Math.min(3,facStr(id))}); }
function facAct(id,kind){
  CHIPS=[]; const f=FAC[id]; opsLeft(); G.ops.left--;
  const ri=facOdds(id,kind), roll=rnd(1,10), ok=roll===10||(roll!==1&&roll>=ri.need);
  const rep=v=>{ G.fac[id]=clamp((G.fac[id]||0)+v,-100,100); chip(v>0?`i`:`n`,`${sgn(v)} ${f.n}`); moveBloc(BLOC[id],v*.4); };
  gainXp(kind===`favor`?facAttr(f):`body`,ok?3:1);
  let text=``;
  if(kind===`favor`){
    if(ok){ rep(10); applyFx({ed:400,cred:1}); text=`Tu rends un service à ${f.n}. Ils notent ton nom du bon côté du carnet.`; }
    else { rep(2); applyFx({hp:-10}); text=`Le service tourne mal, mais ils ont vu que tu avais essayé.`; }
  } else {
    if(ok){ const loot=1000+rnd(0,8)*100+facStr(id)*300; applyFx({ed:loot,cred:5}); rep(-22); f.foes.forEach(x=>{G.fac[x]=clamp((G.fac[x]||0)+8,-100,100)}); if(f.foes.length) chip(`i`,`Leurs ennemis t'apprécient`); text=`Tu frappes ${f.n} là où ça fait mal et repars avec un butin. Ils ne l'oublieront pas.`; }
    else { applyFx({hp:-22,cred:-2}); rep(-12); text=`${f.n} t'attendait. Tu repars en sang, et ils savent qui a essayé.`; }
    G.grudge=id; addEcho(`fac_revenge`,rnd(2,4)); chip(`n`,`⚠ Représailles à prévoir`);
    G.log.unshift({d:dateStr(),m:`Tu attaques ${f.n}.`});
  }
  tick(1);
  return {ok,info:{roll,...ri,ok},chips:CHIPS.slice(),text};
}
function facPact(id){
  const f=FAC[id]; G.allies=G.allies||{}; G.ed-=1500; G.allies[id]=true; G.fac[id]=clamp((G.fac[id]||0)+10,-100,100);
  f.foes.forEach(x=>{G.fac[x]=clamp((G.fac[x]||0)-12,-100,100)}); moveBloc(BLOC[id],6);
  G.log.unshift({d:dateStr(),m:`Pacte scellé avec ${f.n}.`});
  cere({k:`join`,c:f.c,ic:`📜`,kick:`PACTE`,t:`Alliance avec ${f.n}`,sub:`Un pacte, à Night City, ce n'est pas du papier`,lines:[`💰 Tribut : +100 €$ par période`,`⚔ +2 à tes opérations contre leurs ennemis`,f.foes.length?`📉 Leurs ennemis se méfient : ${f.foes.map(x=>FAC[x]?FAC[x].n:x).join(`, `)}`:`🕊 Ils n'ont pas d'ennemi déclaré`,`⚠ Ils t'appelleront à l'aide. Refuser rompt le pacte.`]});
}
function facBreak(id){
  const f=FAC[id]; if(G.allies) delete G.allies[id]; G.fac[id]=clamp((G.fac[id]||0)-35,-100,100); moveBloc(BLOC[id],-8);
  G.grudge=id; addEcho(`fac_revenge`,3); G.log.unshift({d:dateStr(),m:`Pacte rompu avec ${f.n}.`});
  cere({k:`betray`,c:`#ff2a6d`,ic:`💔`,kick:`PACTE ROMPU`,t:`Fin de l'alliance`,sub:f.n,lines:[`📉 Réputation : −35`,`💀 Ils viendront réclamer leur dû`]});
}
function claimPromo(){
  const p=promoInfo(); if(!p||!p.ready) return null;
  if(G.rank<3){ CHIPS=[]; FN.promote(); return `promo`; }
  if(!G.queue.includes(`fac_coup`)){ delete G.done.fac_coup; G.queue.unshift(`fac_coup`); } return `coup`;
}
/* ---------- fins & score ---------- */
const relSum = () => Object.values(G.rel||{}).reduce((a,v)=>a+Math.max(0,v),0);
function computeScore(kind){
  const years = yr()-START_YEAR;
  const attrSum = Object.keys(G.at).reduce((a,k)=>a+G.at[k],0);
  const dN = ownedList().length;
  const legend = G.flags.legend?1500:0;
  const fame = G.gear.reduce((a,i)=>a+(GEARMAP[i].fame||0)*300,0);
  const lines = [
    [`Années survécues (${years})`, years*90],
    [`Street Cred (${G.cred})`, G.cred*45],
    [`Pic de réputation (${G.stats.peak})`, G.stats.peak*15],
    [`Fortune`, Math.round(Math.max(0,G.ed)/12)],
    [`Humanité restante (${G.hum})`, G.hum*7],
    [`Quartiers contrôlés (${dN})`, dN*320],
    [`Faction « ${G.mine?G.mine.name:`—`} »`, G.mine?G.mine.power*260+400+crewN()*180:0],
    [`Attributs (${attrSum})`, attrSum*25],
    [`Chrome installé (${G.cyber.length})`, G.cyber.length*80],
    [`Missions de faction (${G.stats.jobs})`, G.stats.jobs*60],
    [`Relations (${relSum()})`, relSum()*14],
    [`Ambitions accomplies (${G.ambDone||0})`, (G.ambDone||0)*800],
    [`Traits (${(G.traits||[]).length})`, (G.traits||[]).length*200],
    [`Légende & style`, legend+fame],
  ];
  let base = lines.reduce((a,l)=>a+l[1],0);
  store.set(`ncl_legacy`,{name:G.name,title:roleTitle(),end:ENDS[kind].t,cred:G.cred,age:G.age});
  const mult = ENDS[kind].m || ({retire:1.3,quit:1.15,blaze:G.cred>=30?1.2:0.9,flatline:.6,mercy:.6,psycho:.5,debt:.5}[kind]||1);
  return {lines, base, mult, total:Math.round(base*mult)};
}
function endGame(kind){
  if(G.over) return;
  G.over=kind;
  const sc=computeScore(kind);
  G.final=sc;
  store.del(`ncl_save`);
  const best=store.get(`ncl_best`)||[];
  const entry={name:G.name,score:sc.total,end:ENDS[kind].t,role:roleTitle(),year:yr(),age:G.age,date:Date.now()};
  best.push(entry); best.sort((a,b)=>b.score-a.score);
  G.newBest = best[0]===entry;
  store.set(`ncl_best`,best.slice(0,8));
}
function checkEnd(){
  if(G.over) return true;
  if(G.hp<=0){
    const since=G.stats.cards-(G.lastRevive===undefined?-99:G.lastRevive);
    if(G.flags.trauma){ delete G.flags.trauma; G.hp=50; G.lastRevive=G.stats.cards; toast(`Trauma Team Platinum t'a sauvé(e) ! (abonnement utilisé)`); SFX.ok(); flash(`#05ffa1`); G.log.unshift({d:dateStr(),m:`Trauma Team Platinum t'a ramené(e) de justesse (abonnement utilisé).`}); return false; }
    if(G.ed>=3000&&since>=10){ G.ed-=3000; G.hp=35; G.lastRevive=G.stats.cards; toast(`Trauma Team t'a sauvé(e) : facture 3 000 €$`); SFX.ok(); flash(`#05ffa1`); G.log.unshift({d:dateStr(),m:`Trauma Team intervient en urgence : facture de 3 000 €$.`}); return false; }
    endGame(`flatline`); return true;
  }
  if(G.hum<=0){ endGame(`psycho`); return true; }
  if(G.ed<=-4000){ endGame(`debt`); return true; }
  for(const b of Object.keys(BLOCS)){ if((G.heat[b]||0)>=100&&!G.queue.includes(BLOCS[b].cap)){ G.heat[b]=92; G.queue.unshift(BLOCS[b].cap); } }
  if(G.age>=HARD_AGE){ endGame(`retire`); return true; }
  if(G.age>=RETIRE_AGE&&!G.flags.retireAsked){ G.flags.retireAsked=true; G.queue.unshift(`retire_offer`); }
  return false;
}
