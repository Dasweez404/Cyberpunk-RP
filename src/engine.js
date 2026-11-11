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
const CY = id => CYMAP[id];
const DMAP = {}; DIST.forEach(d=>DMAP[d.id]=d);

/* intros liées à l'origine */
byId.st_intro.cond = ()=>G.origin===`street`;
byId.co_intro.cond = ()=>G.origin===`corpo`;
byId.no_intro.cond = ()=>G.origin===`nomad`;
const CD = {hum_warn:3,maxtac:2,loan_shark:3,fac_promo:1,mine_raid:5,legend:99};

/* ---------- état ---------- */
function newState(o){
  const at = {body:3,ref:3,tech:3,int:3,cool:3};
  Object.entries(o.at||{}).forEach(([k,v])=>at[k]+=v);
  Object.entries(o.alloc||{}).forEach(([k,v])=>at[k]+=v);
  const s = {
    v:1, name:o.name, origin:o.origin, sub:o.sub, t:0, age:START_AGE,
    hp:100, hum:100, cred:o.cred, ed:o.ed, at,
    cyber:[], hacks:[], gear:[], flags:{}, fac:{}, member:null, rank:0, jobs:0,
    mine:null, rel:{}, dist:{}, role:{solo:0,net:0,fixer:0,tech:0,med:0,rocker:0,corpo:0,nomad:0,cop:0,boss:0},
    done:{}, hist:[], queue:[], log:[], tmp:{}, joinedOnce:{}, cur:null,
    stats:{cards:0,fights:0,jobs:0,peak:0,gigs:0}, over:null, fameBonus:0
  };
  DIST.forEach(d=>s.dist[d.id]=d.o);
  Object.entries(o.fac||{}).forEach(([k,v])=>s.fac[k]=v);
  (o.flags||[]).forEach(f=>s.flags[f]=true);
  return s;
}
const yr = () => START_YEAR + Math.floor(G.t/12);
const mo = () => G.t % 12;
const MONTHS = [`Janv.`,`Févr.`,`Mars`,`Avr.`,`Mai`,`Juin`,`Juil.`,`Août`,`Sept.`,`Oct.`,`Nov.`,`Déc.`];
const dateStr = () => `${MONTHS[mo()]} ${yr()}`;
const hasCy = id => G.cyber.includes(id);
const hasDeck = () => G.cyber.some(i=>CY(i).deck) && hasCy(`plug`);
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
  if(k===`hck`) v+=Math.floor(G.hacks.length/2);
  if(G.mine){ if(G.mine.type===`runners`&&k===`hck`)v++; if(G.mine.type===`nomads`&&k===`drv`)v++; if(G.mine.type===`gang`&&k===`cmb`)v++; }
  if(G.member===`wraiths`&&k===`drv`)v++;
  return v;
}
function mitigation(){
  let m=0;
  G.cyber.forEach(i=>m+=CY(i).mit||0);
  G.gear.forEach(i=>m+=GEARMAP[i].mit||0);
  return Math.min(.5,m);
}
const ownedList = () => DIST.filter(d=>G.dist[d.id]===`player`);
function pickFoe(d){
  const home = FAC[d.o]?d.o:null;
  const pool = Object.keys(FAC).filter(f=>f!==G.member&&f!==home);
  return pool[rnd(0,pool.length-1)];
}
function roleTitle(){
  if(G.mine&&G.role.boss>=3) return ROLES.boss;
  let best=null,bv=2;
  Object.entries(G.role).forEach(([k,v])=>{if(k!==`boss`&&v>bv){bv=v;best=k}});
  if(best) return ROLES[best];
  return {street:`Street Kid`,corpo:`Corpo`,nomad:`Nomade`}[G.origin];
}
function rankTitle(){ return G.member?RANKS[FAC[G.member].k][G.rank]:null; }

/* ---------- jets ---------- */
function rollInfo(c){
  const tot = A(c.a) + (c.k?skill(c.k):0);
  const dc = typeof c.dc===`function`?c.dc():c.dc;
  const need = dc + 3 - tot;
  let n=0; for(let r=1;r<=10;r++){ if(r===10||(r!==1&&r>=need)) n++; }
  return {tot,dc,need,chance:n/10};
}

/* ---------- effets ---------- */
let CHIPS = [];
const chip = (cls,txt)=>CHIPS.push({cls,txt});
const sgn = v => (v>0?`+`:``)+v;
function applyFx(fx){
  if(!fx) return;
  if(fx.hp){ let v=fx.hp; if(v<0) v=-Math.max(1,Math.round(-v*1.15*(1-mitigation()))); const b=G.hp; G.hp=clamp(G.hp+v,0,100); if(G.hp!==b) chip(v>0?`p`:`n`,`${sgn(G.hp-b)} Santé`); if(v<0){SFX.hit();shake();flash(`#ff2a6d`)} }
  if(fx.hum){ const b=G.hum; G.hum=clamp(G.hum+fx.hum,0,100); if(G.hum!==b) chip(G.hum>b?`p`:`n`,`${sgn(G.hum-b)} Humanité`); if(fx.hum<0)SFX.glitch(); }
  if(fx.cred){ const b=G.cred; G.cred=clamp(G.cred+fx.cred,0,100); if(G.cred!==b) chip(G.cred>b?`y`:`n`,`${sgn(G.cred-b)} Street Cred`); G.stats.peak=Math.max(G.stats.peak,G.cred); }
  if(fx.ed){ G.ed+=fx.ed; chip(fx.ed>0?`i`:`n`,`${sgn(fx.ed)} €$`); }
  if(fx.at) Object.entries(fx.at).forEach(([k,v])=>{ const b=G.at[k]; G.at[k]=clamp(G.at[k]+v,1,10); if(G.at[k]!==b) chip(`p`,`${sgn(G.at[k]-b)} ${ATTRS[k].n}`); });
  if(fx.fac) Object.entries(fx.fac).forEach(([k,v])=>{ G.fac[k]=clamp((G.fac[k]||0)+v,-100,100); chip(v>0?`i`:`n`,`${sgn(v)} ${FAC[k].n}`); });
  if(fx.rel){ G.rel=G.rel||{}; Object.entries(fx.rel).forEach(([k,v])=>{ G.rel[k]=clamp((G.rel[k]||0)+v,-50,100); chip(v>0?`p`:`n`,`${sgn(v)} lien · ${WHO[k].n.split(` `)[0]}`); }); }
  if(fx.role) Object.entries(fx.role).forEach(([k,v])=>G.role[k]=(G.role[k]||0)+v);
  if(fx.flag) fx.flag.forEach(f=>G.flags[f]=true);
  if(fx.unflag) fx.unflag.forEach(f=>delete G.flags[f]);
  if(fx.flagMark) G.joinedOnce[fx.flagMark]=true;
  if(fx.unonce) delete G.done[fx.unonce];
  if(fx.cy) installCy(fx.cy,true);
  if(fx.join) joinFac(fx.join);
  if(fx.fn && FN[fx.fn]) FN[fx.fn]();
  if(fx.found) G.pendingFound = fx.found;
  if(fx.next) (Array.isArray(fx.next)?fx.next:[fx.next]).forEach(n=>G.queue.push(n));
}
function joinFac(id){
  if(G.member&&G.member!==id) G.fac[G.member]=(G.fac[G.member]||0)-10;
  G.member=id; G.rank=0; G.jobs=0; G.fac[id]=Math.max(20,(G.fac[id]||0)+20);
  FAC[id].foes.forEach(f=>G.fac[f]=clamp((G.fac[f]||0)-15,-100,100));
  chip(`y`,`Membre : ${FAC[id].n}`); toast(`Tu rejoins ${FAC[id].n}`); SFX.ok();
}
function removeCy(id){ G.cyber=G.cyber.filter(x=>x!==id); }
function installCy(id,free){
  const c=CY(id);
  G.cyber=G.cyber.filter(x=>CY(x).slot!==c.slot);
  if(c.slot===`neural`&&!hasCy(`plug`)) {}
  G.cyber.push(id);
  if(c.slot===`neural`&&c.id!==`plug`){}
}
const FN = {
  sellOne(){ if(!G.cyber.length)return; const id=G.cyber[rnd(0,G.cyber.length-1)]; removeCy(id); const v=Math.round(CY(id).p*.5); G.ed+=v; chip(`i`,`+${v} €$`); chip(`n`,`− ${CY(id).n}`); },
  defendWin(){ if(G.mine) G.mine.power++; chip(`y`,`Territoire défendu`); },
  defendLose(){ const d=G.tmp&&G.tmp.d; if(d&&G.dist[d]===`player`){ G.dist[d]=G.tmp.rival||`neutral`; chip(`n`,`Perdu : ${DMAP[d].n}`); } },
  mineGrow(){ if(G.mine){G.mine.power++;chip(`y`,`Puissance de ${G.mine.name} +1`);} },
  facJobWin(){ const f=FAC[G.member]; const pay=(G.rank+1)*450+rnd(0,350); G.ed+=pay; G.cred=clamp(G.cred+3+G.rank,0,100); G.fac[G.member]=clamp((G.fac[G.member]||0)+6,-100,100); G.jobs++; G.stats.jobs++; chip(`i`,`+${pay} €$`); chip(`y`,`+${3+G.rank} Street Cred`); chip(`i`,`+6 ${f.n}`); },
  facJobFail(){ G.jobs=Math.max(0,G.jobs); },
  promote(){ G.rank++; const f=FAC[G.member]; const pay=500*G.rank; G.ed+=pay; G.fac[G.member]=clamp((G.fac[G.member]||0)+8,-100,100); chip(`y`,`Rang : ${RANKS[f.k][G.rank]}`); chip(`i`,`+${pay} €$`);
    if(f.k===`mox`){G.hum=clamp(G.hum+8,0,100);chip(`p`,`+8 Humanité`)}
    if(G.member===`maelstrom`){G.hum=clamp(G.hum-6,0,100);chip(`n`,`−6 Humanité`)}
    if(f.k===`trauma`){G.hp=100;chip(`p`,`Soins gratuits`)}
    SFX.ok(); },
  betray(){ const old=G.member; const nw=FAC[old].foes[0]; G.fac[old]=-70; joinFac(nw); },
  seizeFaction(){ const id=G.member; G.flags[`leader_`+id]=true; const hd=FAC[id].home; if(DMAP[hd]) G.dist[hd]=`player`; G.role.boss+=2; chip(`y`,`Tu diriges ${FAC[id].n}`); toast(`Tu prends la tête de ${FAC[id].n}`); SFX.ok(); flash(`#fcee0a`); },
  facLoyal(){ G.fac[G.member]=clamp((G.fac[G.member]||0)+12,-100,100); }
};

/* ---------- temps & économie ---------- */
function tick(months){
  const k = months/STEP;
  let inc = 0;
  ownedList().forEach(d=>inc+=d.inc*3*(G.mine&&G.mine.type===`gang`?1.2:1));
  if(G.mine&&G.mine.type===`fixers`) inc+=300;
  if(G.flags.corpjob) inc+=140*STEP;
  if(G.member){ const kd=FAC[G.member].k; inc+= (kd===`corp`||kd===`ncpd`||kd===`trauma`?110:55)*(G.rank+1)*STEP*.6; }
  const rent = clamp(30+Math.max(0,G.ed)*.004,30,150)*STEP;
  const net = Math.round((inc-rent)*k);
  G.ed += net;
  const reg = G.cyber.reduce((a,i)=>a+(CY(i).regen||0),0);
  if(reg) G.hp=clamp(G.hp+Math.round(reg*k),0,100);
  G.hp = clamp(G.hp+Math.round(5*k),0,100);
  G.t += months;
  G.age = START_AGE + Math.floor(G.t/12);
  if(ownedList().length){ G.cred=clamp(G.cred+ownedList().length*0.3*k|0,0,100); }
  return net;
}

/* ---------- tirage ---------- */
function safe(fn,d){ try{return fn()}catch(e){return d} }
function drawCard(){
  while(G.queue.length){ const c=byId[G.queue.shift()]; if(c) return c; }
  const T=G.t;
  const st = CARDS.filter(c=>c.story && !G.done[c.id] && T>=(c.at[0]-START_YEAR)*12+c.at[1] && (!c.cond||safe(c.cond,false)));
  if(st.length){ st.sort((a,b)=>(a.at[0]*12+a.at[1])-(b.at[0]*12+b.at[1])); return st[0]; }
  const recent = id => { const cd=CD[id]||7; return G.hist.slice(-cd).includes(id); };
  let pool = CARDS.filter(c=>!c.story && (!c.once||!G.done[c.id]) && (!c.cond||safe(c.cond,false)) && !recent(c.id));
  if(!pool.length) pool = CARDS.filter(c=>c.id.startsWith(`fl`));
  const tw = pool.reduce((a,c)=>a+(c.w||5),0);
  let r = Math.random()*tw;
  for(const c of pool){ r-=(c.w||5); if(r<=0) return c; }
  return pool[0];
}
function prepCard(c){
  G.done[c.id]=true; G.hist.push(c.id); if(G.hist.length>40)G.hist.shift();
  G.tmp={};
  const raw = typeof c.tx===`function`?c.tx():c.tx;
  G.cur = {id:c.id, text:raw.replace(/\{n\}/g,G.name)};
}

/* ---------- conquête ---------- */
function conquestChoices(d){
  const o=[];
  o.push({k:`assault`,t:`Assaut armé`,s:`${ATTRS.body.n} + combat`,a:`body`,sk:`cmb`,dc:5+d.def*1.5});
  o.push({k:`hack`,t:`Piratage des systèmes`,s:`${ATTRS.int.n} + hack · cyberdeck requis`,a:`int`,sk:`hck`,dc:5+d.def*1.5+1,req:hasDeck()?``:`Cyberdeck requis`});
  o.push({k:`talk`,t:`Diplomatie & pression`,s:`${ATTRS.cool.n}`,a:`cool`,sk:null,dc:6+d.def*1.5});
  const price=d.def*1800;
  o.push({k:`buy`,t:`Acheter le quartier`,s:`${price} €$ · réussite garantie`,price,req:G.ed>=price?``:`${price} €$ requis`});
  return o;
}
function canConquer(d){
  if(G.dist[d.id]===`player`) return `Déjà à toi`;
  if(d.lock&&!G.flags.dogtown) return `Verrouillé`;
  if(G.member&&G.dist[d.id]===G.member) return `Ta propre faction`;
  const need = d.def*7;
  if(G.cred<need) return `Street Cred ${need} requis`;
  return ``;
}
function doConquer(d,opt){
  CHIPS=[];
  const prev=G.dist[d.id];
  let ok=true, info=null;
  if(opt.k===`buy`){ G.ed-=opt.price; chip(`n`,`−${opt.price} €$`); }
  else {
    const c={a:opt.a,k:opt.sk,dc:opt.dc - (G.member&&FAC[G.member].foes.includes(prev)?2:0)};
    const ri=rollInfo(c); const roll=rnd(1,10);
    ok = roll===10||(roll!==1&&roll>=ri.need); info={roll,...ri,ok};
  }
  if(ok){
    G.dist[d.id]=`player`; G.cred=clamp(G.cred+d.def*2,0,100); chip(`y`,`+${d.def*2} Street Cred`);
    if(FAC[prev]){ G.fac[prev]=clamp((G.fac[prev]||0)-15,-100,100); chip(`n`,`−15 ${FAC[prev].n}`); FAC[prev].foes.forEach(f=>G.fac[f]=clamp((G.fac[f]||0)+5,-100,100)); }
    if(G.mine) G.mine.power++;
    G.log.unshift({d:dateStr(),m:`Tu prends le contrôle de ${d.n}.`}); chip(`y`,`${d.n} conquis`);
  } else {
    const hp=-(d.def*8); applyFx({hp}); if(FAC[prev]){G.fac[prev]=clamp((G.fac[prev]||0)-6,-100,100);chip(`n`,`−6 ${FAC[prev].n}`)}
    G.cred=clamp(G.cred-2,0,100); chip(`n`,`−2 Street Cred`);
  }
  tick(2);
  return {ok,info,chips:CHIPS.slice()};
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
    [`Faction « ${G.mine?G.mine.name:`—`} »`, G.mine?G.mine.power*260+400:0],
    [`Attributs (${attrSum})`, attrSum*25],
    [`Chrome installé (${G.cyber.length})`, G.cyber.length*80],
    [`Missions de faction (${G.stats.jobs})`, G.stats.jobs*60],
    [`Relations (${relSum()})`, relSum()*14],
    [`Légende & style`, legend+fame],
  ];
  let base = lines.reduce((a,l)=>a+l[1],0);
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
    if(G.flags.trauma){ delete G.flags.trauma; G.hp=35; toast(`Trauma Team Platinum t'a sauvé(e) !`); SFX.ok(); G.log.unshift({d:dateStr(),m:`Trauma Team t'a ramené(e) de justesse.`}); return false; }
    endGame(`flatline`); return true;
  }
  if(G.hum<=0){ endGame(`psycho`); return true; }
  if(G.ed<=-4000){ endGame(`debt`); return true; }
  if(G.age>=RETIRE_AGE){ endGame(`retire`); return true; }
  return false;
}
