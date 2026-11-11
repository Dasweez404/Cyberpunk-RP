/* =====================================================================
   INTERFACE — écrans, cartes, swipe, modales, animations
   ===================================================================== */
let AC=null, muted=!!store.get(`ncl_mute`);
function beep(f,d=.08,type=`square`,v=.035,slide=0){
  if(muted)return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;
    o.type=type;o.frequency.setValueAtTime(f,t);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t+d);
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d);
  }catch(e){}
}
const SFX = {
  tap:()=>beep(520,.06,`square`,.03),
  ok:()=>{beep(660,.1,`triangle`,.05);setTimeout(()=>beep(990,.16,`triangle`,.05),90)},
  ko:()=>beep(180,.3,`sawtooth`,.05,.4),
  hit:()=>beep(110,.18,`square`,.06,.4),
  glitch:()=>{beep(900,.05,`sawtooth`,.03,.2);setTimeout(()=>beep(300,.08,`square`,.03,.5),60)},
  buy:()=>{beep(880,.05,`triangle`,.05);setTimeout(()=>beep(1320,.1,`triangle`,.05),60)},
  roll:()=>beep(300+Math.random()*400,.03,`square`,.02),
  swoosh:()=>beep(400,.12,`sine`,.03,2.2),
};
function vib(n){try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}}
function shake(){ vib(40); const e=$(`.screen`); if(!e)return; e.classList.remove(`shake`); void e.offsetWidth; e.classList.add(`shake`); }
function flash(c){ const f=$(`#flash`); f.style.background=c; f.style.transition=`none`; f.style.opacity=.35; requestAnimationFrame(()=>{f.style.transition=`opacity .5s`; f.style.opacity=0}); }
function toast(t){ const e=document.createElement(`div`); e.className=`toast`; e.textContent=t; document.body.appendChild(e); setTimeout(()=>e.remove(),2700); }
function floatAt(el,txt,color){
  if(!el)return; const r=el.getBoundingClientRect();
  const f=document.createElement(`div`); f.className=`float`; f.textContent=txt; f.style.color=color;
  f.style.left=(r.left+r.width/2-20)+`px`; f.style.top=(r.top+r.height)+`px`;
  document.body.appendChild(f); setTimeout(()=>f.remove(),1300);
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':`&amp;`,'<':`&lt;`,'>':`&gt;`,'"':`&quot;`}[c]))}
const ICON = {
  user:`<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`,
  city:`<svg viewBox="0 0 24 24"><path d="M3 21V9l5-3v15M8 21V4l7 3v14M15 21V10l6 2v9M2 21h20"/></svg>`,
  map:`<svg viewBox="0 0 24 24"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/></svg>`,
  fac:`<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>`,
  log:`<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5zM8 9h8M8 13h8M8 17h5"/></svg>`,
  out:`<svg viewBox="0 0 24 24"><path d="M9 4H5v16h4M15 8l5 4-5 4M20 12H9"/></svg>`,
};

/* ---------- portraits procéduraux ---------- */
function portrait(id){
  const w=WHO[id]||WHO.narr, c=w.c, bot=w.sk<8;
  const skin=bot?`#5a5f6e`:`hsl(${22+(w.sk%7)*2},${28+w.sk}%,${22+w.sk}%)`;
  const dark=`#0b0b16`;
  let hair=``,face=``;
  const eyes = bot ? `<rect x="36" y="42" width="28" height="6" rx="2" fill="${c}"/>` :
    `<circle cx="41" cy="45" r="2.6" fill="${c}"/><circle cx="59" cy="45" r="2.6" fill="${c}"/>`;
  switch(w.st){
    case `mohawk`: hair=`<path d="M44 14l3 12 3-14 3 14 3-12 0 18H44z" fill="${c}"/>`;break;
    case `short`: hair=`<path d="M30 40c0-18 8-24 20-24s20 6 20 24c-4-8-10-12-20-12s-16 4-20 12z" fill="${dark}"/>`;break;
    case `long`: hair=`<path d="M28 44c-2-22 8-30 22-30s24 8 22 30l2 30H26z" fill="${dark}"/><path d="M28 44c-2-22 8-30 22-30s24 8 22 30" fill="none" stroke="${c}" stroke-width="1.5"/>`;break;
    case `hood`: hair=`<path d="M22 80c-2-34 6-62 28-62s30 28 28 62z" fill="#141428" stroke="${c}" stroke-width="1.5"/>`;break;
    case `helmet`: hair=`<path d="M28 44c0-20 8-28 22-28s22 8 22 28z" fill="#2a2f45" stroke="${c}" stroke-width="1.5"/><rect x="28" y="42" width="44" height="4" fill="#1a1a2e"/>`;break;
    case `cap`: hair=`<path d="M30 40c0-14 8-20 20-20s20 6 20 20z" fill="#222238"/><rect x="26" y="38" width="52" height="4" rx="2" fill="${c}"/>`;break;
    default: break;
  }
  if(w.st===`shades`) face=`<rect x="31" y="41" width="38" height="8" rx="2" fill="#000"/><rect x="33" y="43" width="14" height="2" fill="${c}"/><rect x="53" y="43" width="14" height="2" fill="${c}"/>`;
  else if(w.st===`visor`) face=`<rect x="32" y="39" width="36" height="11" rx="3" fill="#000"/><rect x="34" y="43" width="32" height="3" fill="${c}"><animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/></rect>`;
  else face=eyes;
  if(w.st===`mask`) face+=`<path d="M32 54h36v14c0 6-8 10-18 10s-18-4-18-10z" fill="#101020" stroke="${c}"/><path d="M40 62h20M40 67h20" stroke="${c}" opacity=".6"/>`;
  const mouth = (w.st===`mask`)?``:`<path d="M42 60q8 5 16 0" stroke="${dark}" stroke-width="1.6" fill="none" opacity=".7"/>`;
  const scar = (w.sk%3===0&&!bot)?`<path d="M62 36l-5 12" stroke="${c}" stroke-width="1.2" opacity=".6"/>`:``;
  return `<svg viewBox="0 0 100 100" class="portrait" aria-hidden="true">
  <defs><linearGradient id="pg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".35"/><stop offset="1" stop-color="#0b0b16"/></linearGradient></defs>
  <rect width="100" height="100" fill="url(#pg${id})"/>
  <path d="M10 100c2-22 18-28 40-28s38 6 40 28z" fill="#12122a" stroke="${c}" stroke-width="1" opacity=".9"/>
  <rect x="43" y="64" width="14" height="12" fill="${skin}"/>
  ${w.st===`hood`?``:hair.includes(`long`)?``:``}
  ${w.st===`long`?hair:``}
  <ellipse cx="50" cy="46" rx="21" ry="25" fill="${skin}"/>
  ${w.st!==`long`?hair:``}
  ${face}${mouth}${scar}
  <path d="M10 8h14M10 8v14M90 92H76M90 92V78" stroke="${c}" stroke-width="1.5" opacity=".7" fill="none"/>
  </svg>`;
}

/* ---------- skyline ---------- */
function skyline(){
  let s=`<svg class="skyline" viewBox="0 0 400 160" preserveAspectRatio="none">`;
  let x=0; const cols=[`#ff2a6d`,`#00f0ff`,`#fcee0a`,`#c77dff`];
  while(x<400){
    const w=14+Math.random()*28, h=40+Math.random()*110, c=cols[Math.floor(Math.random()*4)];
    s+=`<rect x="${x}" y="${160-h}" width="${w}" height="${h}" fill="#0c0c1a" stroke="${c}" stroke-opacity=".35"/>`;
    for(let i=0;i<Math.floor(h/14);i++) if(Math.random()>.55) s+=`<rect x="${x+3+Math.random()*(w-8)}" y="${160-h+6+i*13}" width="3" height="4" fill="${c}" opacity=".8"/>`;
    x+=w+2;
  }
  return s+`</svg>`;
}

/* ---------- navigation d'écrans ---------- */
const root = () => $(`#root`);
function ripple(e){ const b=e.currentTarget; const r=document.createElement(`span`); r.className=`rip`; const d=Math.max(b.clientWidth,b.clientHeight); const bb=b.getBoundingClientRect(); r.style.width=r.style.height=d+`px`; r.style.left=(e.clientX-bb.left-d/2)+`px`; r.style.top=(e.clientY-bb.top-d/2)+`px`; b.appendChild(r); setTimeout(()=>r.remove(),500); }
document.addEventListener(`pointerdown`,e=>{ const b=e.target.closest&&e.target.closest(`.btn`); if(b&&!b.disabled&&!b.classList.contains(`lock`)) ripple({currentTarget:b,clientX:e.clientX,clientY:e.clientY}); });

function showTitle(){
  const save=store.get(`ncl_save`), best=store.get(`ncl_best`)||[];
  root().innerHTML=`<div class="screen title">${skyline()}
   <div class="mono" style="color:var(--m);letter-spacing:.3em;font-size:12px">NIGHT CITY · 2070 — 2092</div>
   <h1 class="hd"><small>Cyberpunk · Roguelike narratif</small><span class="glitch" data-t="NIGHT CITY">NIGHT CITY</span><br><span class="glitch" data-t="LEGEND" style="color:var(--m);text-shadow:0 0 18px #ff2a6d88">LEGEND</span></h1>
   <p>Naître dans la rue, la corpo ou les Badlands. Bâtir ta légende. Survivre à Night City. Ou brûler vite et brûler fort.</p>
   <div class="stack">
     ${save?`<button class="btn pri" id="bcont">Continuer · ${esc(save.name)} · ${save.age} ans</button>`:``}
     <button class="btn pri" id="bnew">Nouvelle vie</button>
     <button class="btn" id="bhow">Comment jouer</button>
     <button class="btn" id="bmute">Son : ${muted?`OFF`:`ON`}</button>
   </div>
   ${best.length?`<div class="brk" style="max-width:420px;margin-top:6px"><div class="sec" style="border:0">Hall of Fame</div>${best.slice(0,4).map(b=>`<div><span>${esc(b.name)} · ${esc(b.end)}</span><b>${b.score.toLocaleString(`fr`)}</b></div>`).join(``)}</div>`:``}
   </div>`;
  $(`#bnew`).onclick=()=>{SFX.tap();showCreate()};
  if(save) $(`#bcont`).onclick=()=>{SFX.tap();G=save;G.rel=G.rel||{};G.bloc=G.bloc||{rue:50,corpo:50,loi:50,nomad:50};renderGame();nextOrResume(true)};
  $(`#bhow`).onclick=()=>{SFX.tap();showHow()};
  $(`#bmute`).onclick=()=>{muted=!muted;store.set(`ncl_mute`,muted);showTitle()};
}
function showHow(){
  modal(`Comment jouer`,`<div class="log"><b>1.</b> Chaque carte est un événement. Choisis une réponse (touche simplement un choix, ou les touches 1-2-3).</div>
  <div class="log"><b>2.</b> Surveille ta <b style="color:var(--hp)">Santé</b>, ton <b style="color:var(--hum)">Humanité</b> (trop de chrome = cyberpsychose), ta <b style="color:var(--cred)">Street Cred</b> et tes <b style="color:var(--ed)">€$</b>.</div>
  <div class="log"><b>⚖</b> <b>Équilibre :</b> les 4 barres RUE · CORPOS · LOI · BADLANDS (sous les jauges) doivent rester <b>au milieu</b>. Trop bas, ils te traquent ; trop haut, ils te possèdent — dans les deux cas, ça peut te coûter la vie. Les points sur les barres montrent ce qu'un choix va changer.</div>
  <div class="log"><b>3.</b> Les actions à jets de dés affichent la chance de réussite. Tes attributs, implants et équipements l'améliorent.</div>
  <div class="log"><b>4.</b> Dans <b>VILLE</b> : ripperdoc, marché noir, gigs, soins, entraînement. Dans <b>CARTE</b> : conquiers des quartiers.</div>
  <div class="log"><b>5.</b> Rejoins, trahis ou fonde une faction. Débloque des voies : Edgerunner, Netrunner, Fixer, Techie, Medtech, Rockerboy, Flic…</div>
  <div class="log"><b>6.</b> Survis jusqu'à la retraite (${RETIRE_AGE} ans) pour le meilleur score, ou choisis ton <b>Dernier Run</b> : sortir en flammes avec une Street Cred élevée rapporte un bonus.</div>`);
}

/* ---------- création ---------- */
const ORIGINS = {
  street:{n:`Street Kid`,d:`Grandi dans la rue, tu connais les combines. Réflexes et sang-froid. Peu d'eddies, beaucoup de contacts.`,ed:350,cred:6,at:{ref:1,cool:1},
    subs:{heywood:{n:`Heywood — Wellsprings`,d:`Le barrio des Valentinos. Famille, foi, honneur.`,fac:{valentinos:15,maelstrom:-6}},
          watson:{n:`Watson — Kabuki`,d:`Néons et marché noir. Là où l'on apprend à survivre.`,fac:{mox:10,tygers:-4}},
          santo:{n:`Santo Domingo — Arroyo`,d:`Béton, patrouilles et violence quotidienne.`,fac:{sixth:12,animals:5}}}},
  corpo:{n:`Corpo`,d:`Tour de verre, costume, ambition. Beaucoup d'eddies, peu de street cred. Le piège doré.`,ed:2200,cred:2,at:{int:1,cool:1},flags:[`corpjob`],
    subs:{arasaka:{n:`Arasaka`,d:`La loyauté absolue. Elle ne pardonne rien.`,fac:{arasaka:15,militech:-10}},
          militech:{n:`Militech`,d:`L'industrie militaire. Guerre, profits, drapeaux.`,fac:{militech:15,arasaka:-10}},
          kangtao:{n:`Kang Tao`,d:`Smart weapons et élégance froide.`,fac:{kangtao:15,militech:-4}},
          biotechnica:{n:`Biotechnica`,d:`Nourriture, génétique, agriculture synthétique.`,fac:{biotechnica:15}}}},
  nomad:{n:`Nomade`,d:`Les Badlands t'ont élevé. Moteurs, solidarité, horizons. Corps et technique.`,ed:600,cred:4,at:{body:1,tech:1},gear:[`archer`],
    subs:{aldecaldos:{n:`Aldecaldos`,d:`La famille de Saul Bright. Loyauté et sable.`,fac:{aldecaldos:20,wraiths:-8}},
          wraiths:{n:`Wraiths`,d:`Pillards de la route. Vitesse et violence.`,fac:{wraiths:20,aldecaldos:-8}},
          solo:{n:`Nomade sans clan`,d:`Seul(e) sur la route. Personne pour te protéger.`,fac:{}}}},
};
let CR = {step:0,origin:null,sub:null,name:``,alloc:{body:0,ref:0,tech:0,int:0,cool:0},pts:5};
function showCreate(){ CR={step:0,origin:null,sub:null,name:``,alloc:{body:0,ref:0,tech:0,int:0,cool:0},pts:5}; renderCreate(); }
function renderCreate(){
  let h=``;
  if(CR.step===0){
    h=`<h2 class="hd">Qui es-tu ?</h2><div class="sub">Choisis ton origine — elle change tout.</div>`+
      Object.entries(ORIGINS).map(([k,o])=>`<button class="btn opt ${CR.origin===k?`sel`:``}" data-o="${k}"><div class="t">${o.n}</div><div class="d">${o.d}</div></button>`).join(``);
  } else if(CR.step===1){
    const o=ORIGINS[CR.origin];
    h=`<h2 class="hd">${o.n} — D'où viens-tu ?</h2><div class="sub">Ton passé donne tes premiers alliés (et ennemis).</div>`+
      Object.entries(o.subs).map(([k,s])=>`<button class="btn opt ${CR.sub===k?`sel`:``}" data-s="${k}"><div class="t">${s.n}</div><div class="d">${s.d}</div></button>`).join(``);
  } else {
    const o=ORIGINS[CR.origin];
    h=`<h2 class="hd">Ton nom de rue</h2><input class="txt" id="nm" maxlength="18" placeholder="Ex : Kira, Jax, Vesper…" value="${esc(CR.name)}">
    <div class="sec" style="margin-top:10px">Attributs · ${CR.pts} point(s) à répartir</div>
    ${Object.keys(ATTRS).map(k=>{
      const base=3+((o.at||{})[k]||0)+CR.alloc[k];
      return `<div class="attrrow"><div class="nm"><b>${ATTRS[k].n}</b><i>${ATTRS[k].d}</i></div>
        <button class="pm" data-m="${k}">−</button><div class="pips">${Array.from({length:10},(_,i)=>`<div class="pip ${i<base?`on`:``}"></div>`).join(``)}</div><button class="pm" data-p="${k}">+</button></div>`;}).join(``)}`;
  }
  h+=`<div class="row" style="max-width:none;margin-top:8px">${CR.step>0?`<button class="btn" id="bk" style="text-align:center">‹ Retour</button>`:`<button class="btn" id="bk" style="text-align:center">‹ Titre</button>`}<button class="btn pri" id="nx" ${(CR.step===0&&!CR.origin)||(CR.step===1&&!CR.sub)?`disabled`:``}>${CR.step===2?`Commencer`:`Suivant`}</button></div>`;
  root().innerHTML=`<div class="screen create">${h}</div>`;
  document.querySelectorAll(`[data-o]`).forEach(b=>b.onclick=()=>{CR.origin=b.dataset.o;CR.sub=null;SFX.tap();renderCreate()});
  document.querySelectorAll(`[data-s]`).forEach(b=>b.onclick=()=>{CR.sub=b.dataset.s;SFX.tap();renderCreate()});
  document.querySelectorAll(`[data-p]`).forEach(b=>b.onclick=()=>{const k=b.dataset.p;const base=3+((ORIGINS[CR.origin].at||{})[k]||0)+CR.alloc[k];if(CR.pts>0&&base<8){CR.alloc[k]++;CR.pts--;SFX.tap();keepName();renderCreate()}});
  document.querySelectorAll(`[data-m]`).forEach(b=>b.onclick=()=>{const k=b.dataset.m;if(CR.alloc[k]>0){CR.alloc[k]--;CR.pts++;SFX.tap();keepName();renderCreate()}});
  function keepName(){const n=$(`#nm`);if(n)CR.name=n.value}
  $(`#bk`).onclick=()=>{SFX.tap();if(CR.step===0)showTitle();else{keepName();CR.step--;renderCreate()}};
  $(`#nx`).onclick=()=>{
    SFX.tap();
    if(CR.step<2){CR.step++;renderCreate();return}
    keepName(); const nm=(CR.name.trim()||`V.`);
    if(CR.pts>0 && !confirm(`Il te reste ${CR.pts} point(s) à répartir. Commencer quand même ?`)) return;
    const o=ORIGINS[CR.origin], s=o.subs[CR.sub];
    G=newState({name:nm,origin:CR.origin,sub:CR.sub,cred:o.cred,ed:o.ed,at:o.at,alloc:CR.alloc,fac:s.fac,flags:o.flags});
    (o.gear||[]).forEach(g=>G.gear.push(g));
    if(CR.origin===`corpo`){G.bloc.corpo=62;G.bloc.rue=40}
    if(CR.origin===`nomad`){G.bloc.nomad=62;G.bloc.corpo=40}
    if(CR.origin===`street`){G.bloc.rue=60;G.bloc.loi=40}
    if(CR.origin===`corpo`){ G.role.corpo=2; }
    if(CR.origin===`nomad`){ G.role.nomad=2; }
    if(CR.origin===`street`){ G.role.fixer=1; }
    G.log.unshift({d:dateStr(),m:`${nm} débute sa vie à Night City (${o.n}).`});
    renderGame(); nextCard();
  };
  if(CR.step===2) setTimeout(()=>{const n=$(`#nm`);if(n&&!n.value)n.focus()},100);
}

/* ---------- écran de jeu ---------- */
function renderGame(){
  root().innerHTML=`<div class="screen" id="gs">
    <div class="hud">
      <div class="meters">
        <div class="meter m-hp" id="m-hp"><div class="lb">Santé<b id="v-hp"></b></div><div class="bar"><i id="b-hp"></i></div><span class="dot"></span></div>
        <div class="meter m-hum" id="m-hum"><div class="lb">Humanité<b id="v-hum"></b></div><div class="bar"><i id="b-hum"></i></div><span class="dot"></span></div>
        <div class="meter m-cred" id="m-cred"><div class="lb">Cred<b id="v-cred"></b></div><div class="bar"><i id="b-cred"></i></div><span class="dot"></span></div>
        <div class="meter m-ed" id="m-ed"><div class="lb">€$<b id="v-ed"></b></div><div class="bar"><i id="b-ed"></i></div><span class="dot"></span></div>
      </div>
      <div class="blocs" id="blocs"></div>
      <div class="sub-hud"><span id="hdate"></span><span class="role" id="hrole"></span></div>
    </div>
    <div class="stage" id="stage"></div>
    <div class="choices" id="choices"></div>
    <nav class="dock">
      <button data-d="prof">${ICON.user}Profil</button>
      <button data-d="city">${ICON.city}Ville</button>
      <button data-d="map">${ICON.map}Carte</button>
      <button data-d="fac">${ICON.fac}Faction</button>
      <button data-d="log">${ICON.log}Journal</button>
      <button data-d="out">${ICON.out}Sortir</button>
    </nav></div>`;
  document.querySelectorAll(`.dock button`).forEach(b=>b.onclick=()=>{SFX.tap();({prof:openProfile,city:openCity,map:openMap,fac:openFactions,log:openLog,out:openExit})[b.dataset.d]()});
  updateHud(true);
}
let lastVals=null;
function updateHud(init){
  const v={hp:G.hp,hum:G.hum,cred:G.cred,ed:G.ed};
  [`hp`,`hum`,`cred`].forEach(k=>{ $(`#b-${k}`).style.width=v[k]+`%`; $(`#v-${k}`).textContent=Math.round(v[k]); });
  $(`#v-ed`).textContent=v.ed.toLocaleString(`fr`); $(`#b-ed`).style.width=clamp(Math.log10(Math.max(1,v.ed))/5*100,2,100)+`%`;
  if(v.ed<0){$(`#v-ed`).style.color=`var(--m)`}else $(`#v-ed`).style.color=``;
  $(`#hdate`).textContent=`${dateStr()} · ${G.name}, ${G.age} ans`;
  $(`#hrole`).textContent=roleTitle()+(rankTitle()?` · ${rankTitle()}`:``);
  const cb=document.querySelector(`.dock [data-d=city]`); if(cb)cb.classList.toggle(`alert`,G.hp<45||G.hum<45);
  $(`#m-hp`).classList.toggle(`warn`,G.hp<=25);
  $(`#m-hum`).classList.toggle(`warn`,G.hum<=30);
  document.body.classList.toggle(`lowhum`,G.hum<=35);
  if(lastVals&&!init){
    [[`hp`,`#ff2a6d`],[`hum`,`#05ffa1`],[`cred`,`#fcee0a`],[`ed`,`#00f0ff`]].forEach(([k,c])=>{
      const d=v[k]-lastVals[k]; if(d){ const m=$(`#m-${k}`); m.classList.remove(`bump`);void m.offsetWidth;m.classList.add(`bump`); floatAt(m,(d>0?`+`:``)+d,c); }
    });
  }
  renderBlocs();
  lastVals=v;
}
function renderBlocs(){
  const b=G.bloc||{rue:50,corpo:50,loi:50,nomad:50};
  $(`#blocs`).innerHTML=Object.keys(BLOCS).map(k=>{
    const v=Math.round(b[k]), danger=v<=20||v>=80;
    return `<button class="bloc ${danger?`dg`:``}" id="bl-${k}" data-b="${k}"><span>${BLOCS[k].n}</span><div class="bb"><i style="left:${v}%;background:${danger?`var(--m)`:BLOCS[k].c}"></i></div></button>`;
  }).join(``);
  document.querySelectorAll(`.bloc`).forEach(e=>e.onclick=()=>{const k=e.dataset.b;SFX.tap();toast(`${BLOCS[k].n} ${Math.round(b[k])}/100 — ${BLOCS[k].d}. Trop bas : ils te traquent. Trop haut : ils te possèdent.`)});
}
function previewDots(ch){
  const keys=new Set(); const add=f=>{if(!f)return;[`hp`,`hum`,`cred`,`ed`].forEach(k=>{if(f[k])keys.add(k)});};
  if(ch){ add(ch.fx); if(ch.chk){add(ch.chk.ok);add(ch.chk.ko);} }
  [`hp`,`hum`,`cred`,`ed`].forEach(k=>$(`#m-${k}`).classList.toggle(`pv`,keys.has(k)));
  const bl=new Set(); if(ch){ [ch.fx,ch.chk&&ch.chk.ok,ch.chk&&ch.chk.ko].forEach(f=>Object.keys(blocFromFx(f)).forEach(k=>bl.add(k))); }
  Object.keys(BLOCS).forEach(k=>{const e=$(`#bl-${k}`); if(e)e.classList.toggle(`pv`,bl.has(k))});
}

/* ---------- boucle ---------- */
function nextOrResume(resume){
  if(resume&&G.cur&&byId[G.cur.id]) { showCardView(); return; }
  nextCard();
}
function save(){ store.set(`ncl_save`,G); }
function nextCard(){
  if(checkEnd()){ return showEnd(); }
  const c=drawCard(); prepCard(c); save(); updateHud(); showCardView();
}
function showCardView(){
  const c=byId[G.cur.id], w=WHO[c.who]||WHO.narr;
  const stage=$(`#stage`), chs=$(`#choices`);
  stage.innerHTML=`<div class="speaker">${portrait(c.who)}<div><div class="nm" style="color:${w.c}">${esc(w.n)}</div><div class="rl">${esc(w.r)}</div></div></div>
    <div class="cardwrap" id="cw"><div class="card" id="card" style="--ac:${w.c}">
      <div class="tag">${esc(c.tag||``)}</div><div class="tx">${G.cur.text}</div></div></div>`;
  chs.innerHTML=c.ch.map((h,i)=>{
    const lock=h.req?h.req():``; let badge=``;
    if(h.chk){ const r=rollInfo(h.chk); const p=Math.round(r.chance*100); badge=`<span class="bd ${p>=70?`hi`:p<=35?`lo`:``}">${p}%</span>`; }
    return `<button class="btn choice ${lock?`lock`:``}" data-i="${i}"><span class="k">${i+1}</span><span class="tt"><b>${h.t}</b>${(h.s||lock)?`<small>${lock?`🔒 ${lock}`:h.s}</small>`:``}</span>${badge}</button>`;
  }).join(``);
  chs.querySelectorAll(`.choice`).forEach(b=>{
    const i=+b.dataset.i;
    b.onclick=()=>pick(i);
    b.onmouseenter=b.onfocus=()=>previewDots(c.ch[i]);
    b.onmouseleave=b.onblur=()=>previewDots(null);
    b.addEventListener(`touchstart`,()=>previewDots(c.ch[i]),{passive:true});
  });
  SFX.swoosh();
}
let picking=false;
function pick(i,dir){
  if(picking||G.over)return;
  const c=byId[G.cur.id], ch=c.ch[i];
  if(ch.req&&ch.req()) { SFX.ko(); shake(); return; }
  picking=true; SFX.tap(); previewDots(null);
  const card=$(`#card`);
  if(card){ const d=dir||(i===0?-1:1); card.style.setProperty(`--ox`,(d*120)+`px`); card.style.setProperty(`--or`,(d*10)+`deg`); card.classList.add(`out`); }
  $(`#choices`).innerHTML=``;
  setTimeout(()=>resolveChoice(ch),260);
}
function resolveChoice(ch){
  CHIPS=[]; let fx, info=null;
  if(ch.chk){
    const c=ch.chk, r=rollInfo(c), roll=rnd(1,10);
    const ok = roll===10 || (roll!==1 && roll>=r.need);
    fx = ok?c.ok:c.ko; info={roll,ok,a:c.a,...r};
    if(ok)G.stats.fights+=0;
  } else fx=ch.fx;
  const before={hp:G.hp,hum:G.hum,cred:G.cred,ed:G.ed};
  applyFx(fx||{});
  const msg = fx&&fx.msg ? fx.msg : ``;
  G.log.unshift({d:dateStr(),m:msg||ch.t}); if(G.log.length>120)G.log.pop();
  const chips=CHIPS.slice();
  const dead = fx&&fx.die;
  const wasHP=G.hp;
  showResult({msg,chips,info,die:dead,retire:fx&&fx.retire,quit:fx&&fx.quit,title:ch.t});
}
function showResult(r){
  const cw=$(`#cw`);
  const diceHtml = r.info ? `<div class="dice"><div class="die roll" id="die"><span>?</span></div><div class="info" id="dinfo">${ATTRS[r.info.a].n} <b>jet en cours…</b><span>Difficulté ${r.info.need} sur d10</span></div></div>` : ``;
  cw.innerHTML=`<div class="result" id="res">${diceHtml}<div class="rt" id="rt" style="${r.info?`visibility:hidden`:``}">${r.msg||`<em>${esc(r.title)}</em>`}</div><div class="chips" id="chips"></div><button class="btn pri" id="cont" style="visibility:hidden">Continuer ›</button></div>`;
  let done=false;
  const reveal=()=>{
    $(`#rt`).style.visibility=`visible`;
    $(`#chips`).innerHTML=r.chips.map((c,i)=>`<span class="chip ${c.cls}" style="animation-delay:${i*.07}s">${esc(c.txt)}</span>`).join(``);
    $(`#cont`).style.visibility=`visible`; done=true;
    updateHud(); autoCheck();
  };
  function autoCheck(){ if(G.hum<=30) SFX.glitch(); }
  const go=()=>{ if(!done)return; document.removeEventListener(`keydown`,key); $(`#res`).onclick=null; finishCard(r); };
  const key=e=>{ if(e.key===`Enter`||e.key===` `){ e.preventDefault(); go(); } };
  if(r.info){
    const die=$(`#die`); let n=0;
    const iv=setInterval(()=>{ die.firstChild.textContent=rnd(1,10); SFX.roll(); if(++n>9){ clearInterval(iv);
      die.classList.remove(`roll`); die.classList.add(r.info.ok?`ok`:`ko`); die.firstChild.textContent=r.info.roll;
      $(`#dinfo`).innerHTML=`${ATTRS[r.info.a].n} ${r.info.tot} + d10<b style="color:${r.info.ok?`var(--g)`:`var(--m)`}">${r.info.ok?`RÉUSSITE`:`ÉCHEC`}</b><span>Il fallait ${Math.max(2,r.info.need)}+ · tu as fait ${r.info.roll}</span>`;
      r.info.ok?(SFX.ok(),flash(`#05ffa1`),vib(30)):(SFX.ko(),shake());
      reveal();
    } },60);
  } else { setTimeout(reveal,150); }
  $(`#res`).onclick=go; document.addEventListener(`keydown`,key);
}
function finishCard(r){
  picking=false;
  if(G.pendingFound){ const kind=G.pendingFound; G.pendingFound=null; return askFactionName(kind,()=>afterCard(r)); }
  afterCard(r);
}
function afterCard(r){
  if(r.die){ endGame(r.die); return showEnd(); }
  if(r.retire){ endGame(`retire`); return showEnd(); }
  if(r.quit){ endGame(`quit`); return showEnd(); }
  if(checkEnd()) return showEnd();
  const net=tick(STEP); G.stats.cards++;
  if(net>=600) toast(`Revenus passifs : +${net} €$`);
  else if(net<=-250) toast(`Loyer & dettes : ${net} €$`);
  nextCard();
}
function askFactionName(kind,done){
  const T={gang:`Gang de rue`,fixers:`Réseau de fixers`,nomads:`Clan nomade`,runners:`Collectif de netrunners`};
  const sug={gang:[`Les Chromeurs`,`Neon Vipers`,`Kabuki Saints`],fixers:[`Le Syndicat`,`Dead Drop`,`Les Intermédiaires`],nomads:[`Dust Devils`,`Les Errants`,`Black Mesa`],runners:[`Ghost Protocol`,`Cold Boot`,`Null Choir`]}[kind];
  modal(`Nomme ta faction`,`<div class="log">${T[kind]} — le nom que Night City murmurera.</div><input class="txt" id="fn" maxlength="22" value="${sug[0]}"><div class="chips">${sug.map(s=>`<button class="chip i" data-s="${s}">${s}</button>`).join(``)}</div><button class="btn pri" id="fok">Fonder</button>`,{lock:true});
  document.querySelectorAll(`[data-s]`).forEach(b=>b.onclick=()=>{$(`#fn`).value=b.dataset.s;SFX.tap()});
  $(`#fok`).onclick=()=>{
    const name=($(`#fn`).value.trim()||sug[0]); G.mine={name,type:kind,power:1};
    G.log.unshift({d:dateStr(),m:`Tu fondes ${name} (${T[kind]}).`}); closeModal(); toast(`${name} est née !`); SFX.ok(); flash(`#fcee0a`); done();
  };
}

/* ---------- modales ---------- */
let modalLock=false;
function modal(title,body,o){
  o=o||{}; const old=$(`#modal`); const keep=old&&old.dataset.t===title;
  closeModal(true); modalLock=!!o.lock;
  const m=document.createElement(`div`); m.className=`modal`; m.id=`modal`; m.dataset.t=title; if(keep)m.style.animation=`none`;
  m.innerHTML=`<div class="sheet ${o.full?`full`:``}" ${keep?`style="animation:none"`:``}><header>${o.back?`<button class="x bk" id="mbk">‹</button>`:``}<h3 class="hd">${title}</h3>${modalLock?``:`<button class="x" id="mx">✕</button>`}</header><div class="body" id="mb">${body}</div></div>`;
  document.body.appendChild(m);
  if(!modalLock){ m.addEventListener(`pointerdown`,e=>{if(e.target===m)closeModal()}); $(`#mx`).onclick=()=>{SFX.tap();closeModal()}; }
  if(o.back) $(`#mbk`).onclick=()=>{SFX.tap();o.back()};
}
function closeModal(){ const m=$(`#modal`); if(m)m.remove(); modalLock=false; }
document.addEventListener(`keydown`,e=>{
  if(e.key===`Escape`&&!modalLock) closeModal();
  if(!G||G.over||$(`#modal`)||picking) return;
  if(/^[1-4]$/.test(e.key)&&$(`#choices`)){ const b=document.querySelector(`.choice[data-i="${+e.key-1}"]`); if(b)b.click(); }
});
const money = v => v.toLocaleString(`fr`)+` €$`;

function openProfile(){
  const titleRole=roleTitle();
  const rows=Object.keys(ATTRS).map(k=>{
    const base=G.at[k], tot=A(k);
    return `<div class="attrrow"><div class="nm"><b>${ATTRS[k].n}</b><i>${ATTRS[k].d}</i></div><div class="pips">${Array.from({length:13},(_,i)=>`<div class="pip ${i<base?`on`:i<tot?`bonus`:``}"></div>`).join(``)}</div><b>${tot}</b></div>`;}).join(``);
  const cy=G.cyber.map(id=>CY(id)).map(c=>`<div class="item own"><div class="in"><b>${c.n}</b><small>${SLOTS[c.slot]} · ${c.d}</small></div></div>`).join(``)||`<div class="log">Aucun implant. Chair pure.</div>`;
  const gear=G.gear.map(id=>GEARMAP[id]).map(c=>`<div class="item own"><div class="in"><b>${c.n}</b><small>${c.t} · ${c.d}</small></div></div>`).join(``)||`<div class="log">Aucun équipement notable.</div>`;
  const hk=G.hacks.map(id=>HACKS.find(h=>h.id===id).n).join(` · `);
  modal(esc(G.name),`<div class="item"><div class="in"><b>${titleRole}${rankTitle()?` · ${G.member?FAC[G.member].n:``} (${rankTitle()})`:``}</b><small>${ORIGINS[G.origin].n} · ${G.age} ans · ${dateStr()}${G.mine?` · Fondateur de ${esc(G.mine.name)}`:``}</small></div></div>
  <div class="sec">Attributs (vert = bonus)</div>${rows}
  <div class="sec">Chrome · réduction dégâts ${Math.round(mitigation()*100)}%</div>${cy}
  ${hk?`<div class="sec">Quickhacks</div><div class="log">${hk}</div>`:``}
  <div class="sec">Équipement</div>${gear}
  ${relBlock()}
  <div class="sec">Statistiques</div><div class="log">Cartes jouées : ${G.stats.cards} · Gigs : ${G.stats.gigs} · Missions de faction : ${G.stats.jobs}</div>`);
}

function relBlock(){
  const rs=Object.entries(G.rel||{}).filter(([k,v])=>v!==0).sort((a,b)=>b[1]-a[1]);
  if(!rs.length) return ``;
  return `<div class="sec">Relations</div>`+rs.map(([k,v])=>{const w=WHO[k];return `<div class="item"><div class="in"><b style="color:${w.c}">${esc(w.n)}${G.flags[`lover_`+k]?` ♥`:``}</b><small>${esc(w.r)}</small><div class="bigbar"><i style="background:${v>=0?`var(--g)`:`var(--m)`};left:${v>=0?0:0}%;width:${Math.abs(v)}%"></i></div></div><b style="color:${v>=0?`var(--g)`:`var(--m)`}">${v}</b></div>`}).join(``);
}
/* ----- VILLE (tuiles) ----- */
const CITYSTATE = {shop:{cy:`all`,gear:`all`}};
function statBar(){
  return `<div class="vstat"><span style="color:var(--hp)">♥ ${G.hp}</span><span style="color:var(--hum)">◐ ${G.hum}</span><span style="color:var(--y)">★ ${G.cred}</span><b style="color:var(--ed)">${money(G.ed)}</b></div>`;
}
function openCity(){
  const tile=(k,ic,t,d,o={})=>`<button class="tile ${o.rec?`rec`:``}" data-c="${k}" ${o.dis?`disabled`:``}><span class="ti">${ic}</span><b>${t}</b><small>${d}</small>${o.rec?`<em>Conseillé</em>`:``}</button>`;
  modal(`Ville · ${dateStr()}`,`${statBar()}
   <div class="sec">Boutiques</div>
   <div class="tiles">
    ${tile(`rip`,`🦾`,`Ripperdoc`,`Chrome & implants`)}
    ${tile(`gear`,`🔫`,`Marché noir`,`Armes, armures, véhicules`)}
    ${tile(`hack`,`💾`,`Quickhacks`,hasDeck()?`${G.hacks.length}/${deckSlots()} slots`:`Deck requis`,{dis:!hasDeck()})}
    ${tile(`train`,`🏋`,`S'entraîner`,`+1 attribut · 2 mois`)}
   </div>
   <div class="sec">Boulots</div>
   <div class="tiles one">${tile(`gigs`,`📋`,`Tableau des gigs`,`${G.board&&G.board.p===G.stats.cards?G.board.left:GIG_PER_PERIOD} gig(s) dispo cette période · mieux payés`)}</div>
   <div class="sec">Récupérer</div>
   <div class="tiles three">
    ${tile(`heal`,`➕`,`Clinique`,`+40 Santé · 150 €$`,{dis:G.hp>=100||G.ed<150,rec:G.hp<50})}
    ${tile(`therapy`,`🧠`,`Thérapie`,`+18 Humanité · 400 €$`,{dis:G.hum>=100||G.ed<400,rec:G.hum<50})}
    ${tile(`rest`,`🛏`,`Repos`,`+15 Santé · +5 Hum.`)}
   </div>
   <div class="log" style="color:var(--dim)">Chaque action fait passer 1 à 2 mois. Revenus et loyer sont décomptés.</div>`);
  document.querySelectorAll(`[data-c]`).forEach(b=>b.onclick=()=>{SFX.tap();({rip:()=>openShop(`cy`),gear:()=>openShop(`gear`),hack:()=>openShop(`hack`),gigs:openGigs,train:openTrain,heal:()=>doDown(`heal`),therapy:()=>doDown(`therapy`),rest:()=>doDown(`rest`)})[b.dataset.c]()});
}
function doDown(k){
  CHIPS=[];
  if(k===`heal`){ if(G.ed<150){toast(`Pas assez d'eddies`);return} applyFx({ed:-150,hp:40}); }
  if(k===`therapy`){ if(G.ed<400){toast(`Pas assez d'eddies`);return} applyFx({ed:-400,hum:18}); }
  if(k===`rest`){ applyFx({hp:15,hum:5}); }
  SFX.ok(); tick(1); G.log.unshift({d:dateStr(),m:{heal:`Tu passes à la clinique.`,therapy:`Une séance de thérapie, un peu d'humanité récupéré.`,rest:`Un mois de repos.`}[k]});
  updateHud(); toast(CHIPS.map(c=>c.txt).join(` · `)||`Fait`);
  if(checkEnd()){ closeModal(); return showEnd(); }
  openCity();
}
function shopHeader(){ return `${statBar()}`; }
function openShop(kind){
  const disc = (G.flags.vik?.85:1);
  const f = CITYSTATE.shop[kind]||`all`;
  let chips=``, rows=[];
  const chipBar=(list,cur)=>`<div class="fchips">${list.map(([k,l])=>`<button class="fc ${cur===k?`on`:``}" data-f="${k}">${l}</button>`).join(``)}</div>`;
  const tagsOf=o=>[
    ...Object.entries(o.at||{}).map(([k,v])=>`<span class="tagx g">+${v} ${ATTRS[k].n}</span>`),
    ...(o.k?Object.entries(o.k).map(([k,v])=>`<span class="tagx g">+${v} ${{cmb:`combat`,drv:`conduite`,hck:`hack`,stl:`furtivité`}[k]}</span>`):[]),
    o.mit?`<span class="tagx g">−${Math.round(o.mit*100)}% dégâts</span>`:``, o.regen?`<span class="tagx g">soin auto</span>`:``, o.deck?`<span class="tagx c">${o.deck} slots</span>`:``].join(``);
  if(kind===`cy`){
    chips=chipBar([[`all`,`Tout`],...Object.entries(SLOTS)],f);
    CYBER.filter(c=>f===`all`||c.slot===f).forEach(c=>{
      const price=Math.round(c.p*disc*(G.member===`maelstrom`?.9:1)), own=hasCy(c.id);
      const lock = c.cred&&G.cred<c.cred?`Cred ${c.cred}`: c.needs&&!hasCy(c.needs)?`Interface requise`:``;
      const cur=G.cyber.find(i=>CY(i).slot===c.slot&&i!==c.id);
      const afford=G.ed>=price;
      rows.push(`<div class="item ${own?`own`:``}"><div class="in"><b>${c.n}</b><small>${SLOTS[c.slot]} · ${c.d}</small><small>${tagsOf(c)}<span class="tagx">−${c.h} Humanité</span>${cur?`<span class="tagx y">remplace ${CY(cur).n}</span>`:``}</small></div>
      ${own?`<b class="own-t">INSTALLÉ</b>`:`<button class="buy ${afford&&!lock?``:`no`}" data-b="${c.id}" ${lock?`disabled`:``}>${lock?`🔒 ${lock}`:money(price)}</button>`}</div>`);
    });
  } else if(kind===`gear`){
    chips=chipBar([[`all`,`Tout`],[`arme`,`Armes`],[`armure`,`Armures`],[`véhicule`,`Véhicules`],[`style`,`Style`]],f);
    GEAR.filter(g=>f===`all`||g.t===f).forEach(g=>{
      const own=G.gear.includes(g.id), lock=g.cred&&G.cred<g.cred?`Cred ${g.cred}`:``;
      const price=Math.round(g.p*(G.member===`militech`||G.member===`sixth`?.9:1)), afford=G.ed>=price;
      rows.push(`<div class="item ${own?`own`:``}"><div class="in"><b>${g.n}</b><small>${g.t} · ${g.d}</small><small>${tagsOf(g)}</small></div>
      ${own?`<b class="own-t">POSSÉDÉ</b>`:`<button class="buy ${afford&&!lock?``:`no`}" data-g="${g.id}" ${lock?`disabled`:``}>${lock?`🔒 ${lock}`:money(price)}</button>`}</div>`);
    });
  } else {
    if(!hasDeck()) rows.push(`<div class="log">Il te faut une <b>Interface neurale</b> et un <b>Cyberdeck</b> (chez le ripperdoc).</div>`);
    else { rows.push(`<div class="log">Slots : <b>${G.hacks.length} / ${deckSlots()}</b> · INT ${A(`int`)}</div>`);
      HACKS.forEach(h=>{ const own=G.hacks.includes(h.id); const lock=A(`int`)<h.int?`INT ${h.int}`:G.hacks.length>=deckSlots()?`Deck plein`:``;
        rows.push(`<div class="item ${own?`own`:``}"><div class="in"><b>${h.n}</b><small>${h.d}</small></div>${own?`<b class="own-t">CHARGÉ</b>`:`<button class="buy ${G.ed>=h.p&&!lock?``:`no`}" data-h="${h.id}" ${lock?`disabled`:``}>${lock?`🔒 ${lock}`:money(h.p)}</button>`}</div>`); }); }
  }
  const sc=$(`#mb`)?$(`#mb`).scrollTop:0;
  modal({cy:`Ripperdoc`,gear:`Marché noir`,hack:`Quickhacks`}[kind],`<div class="sticky">${statBar()}${chips}${G.flags.vik&&kind===`cy`?`<div class="log" style="color:var(--g)">Remise Vik −15 %</div>`:``}</div>`+rows.join(``),{back:openCity});
  if($(`#mb`)) $(`#mb`).scrollTop=sc;
  document.querySelectorAll(`[data-f]`).forEach(b=>b.onclick=()=>{CITYSTATE.shop[kind]=b.dataset.f;SFX.tap();$(`#mb`).scrollTop=0;openShop(kind)});
  document.querySelectorAll(`[data-b]`).forEach(b=>b.onclick=()=>buyCy(b.dataset.b));
  document.querySelectorAll(`[data-g]`).forEach(b=>b.onclick=()=>buyGear(b.dataset.g));
  document.querySelectorAll(`[data-h]`).forEach(b=>b.onclick=()=>buyHack(b.dataset.h));
}
function buyCy(id){
  const c=CY(id), price=Math.round(c.p*(G.flags.vik?.85:1)*(G.member===`maelstrom`?.9:1));
  if(G.ed<price){ SFX.ko(); toast(`Pas assez d'eddies`); return; }
  if(G.hum-c.h<=8 && !confirm(`Ça te laisse à ${G.hum-c.h} Humanité. Risque de cyberpsychose. Continuer ?`)) return;
  CHIPS=[]; applyFx({ed:-price,hum:-c.h}); installCy(id); SFX.buy(); flash(`#05ffa1`); vib(60);
  G.log.unshift({d:dateStr(),m:`Installation : ${c.n}.`}); tick(1); updateHud(); toast(`${c.n} installé`);
  if(checkEnd()){ closeModal(); return showEnd(); }
  openShop(`cy`);
}
function buyGear(id){
  const g=GEARMAP[id], price=Math.round(g.p*(G.member===`militech`||G.member===`sixth`?.9:1));
  if(G.ed<price){ SFX.ko(); toast(`Pas assez d'eddies`); return; }
  G.ed-=price; G.gear=G.gear.filter(x=>GEARMAP[x].t!==g.t); G.gear.push(id);
  SFX.buy(); updateHud(); toast(`${g.n} acquis`); G.log.unshift({d:dateStr(),m:`Achat : ${g.n}.`}); openShop(`gear`);
}
function buyHack(id){
  const h=HACKS.find(x=>x.id===id); if(G.ed<h.p){SFX.ko();toast(`Pas assez d'eddies`);return}
  G.ed-=h.p; G.hacks.push(id); G.role.net+=1; SFX.buy(); updateHud(); toast(`${h.n} chargé`); openShop(`hack`);
}
function openTrain(){
  modal(`S'entraîner`,`${statBar()}`+Object.keys(ATTRS).map(k=>{
    const lv=G.at[k], price=lv*260, max=lv>=9;
    return `<div class="item"><div class="in"><b>${ATTRS[k].n} ${lv}</b><small>${ATTRS[k].d}</small><div class="pips" style="margin-top:4px">${Array.from({length:10},(_,i)=>`<div class="pip ${i<lv?`on`:``}"></div>`).join(``)}</div></div><button class="buy ${max||G.ed<price?`no`:``}" data-t="${k}" ${max||G.ed<price?`disabled`:``}>${max?`MAX`:money(price)}</button></div>`;
  }).join(``)+`<div class="log" style="color:var(--dim)">2 mois par session. Maximum de base : 9.</div>`,{back:openCity});
  document.querySelectorAll(`[data-t]`).forEach(b=>b.onclick=()=>{
    const k=b.dataset.t, price=G.at[k]*260; if(G.ed<price)return;
    CHIPS=[]; applyFx({ed:-price,at:{[k]:1}}); tick(2); SFX.ok(); updateHud(); G.log.unshift({d:dateStr(),m:`Entraînement : ${ATTRS[k].n}.`}); toast(`${ATTRS[k].n} +1`);
    if(checkEnd()){closeModal();return showEnd()} openTrain();
  });
}
const GIG_PER_PERIOD=2;
const gigPay=g=>Math.round(g.pay*1.7/50)*50, gigCr=g=>Math.ceil(g.cr*1.5);
function gigBoard(){
  if(!G.board||G.board.p!==G.stats.cards){
    const cs=[],used=new Set();
    while(cs.length<4){ const g=GIGS[rnd(0,Math.min(GIGS.length-1,Math.floor(2+G.cred/12)+2))]; if(!used.has(g.n)){used.add(g.n);cs.push({n:g.n,done:false})} }
    G.board={p:G.stats.cards,left:GIG_PER_PERIOD,gigs:cs};
  }
  return G.board;
}
function openGigs(){
  const bd=gigBoard();
  modal(`Tableau des gigs`,`<div class="vstat"><span>Gigs restants cette période</span><b style="color:${bd.left?`var(--g)`:`var(--m)`}">${bd.left} / ${GIG_PER_PERIOD}</b></div>
   <div class="log" style="color:var(--dim)">Le tableau se renouvelle à la prochaine carte (~5 mois). Choisis bien : les gigs sont mieux payés mais limités.</div>`+
   bd.gigs.map((x,i)=>{
    const g=GIGS.find(y=>y.n===x.n); const r=rollInfo({a:g.a,k:g.k,dc:g.dc}); const p=Math.round(r.chance*100); const off=x.done||!bd.left;
    return `<button class="btn choice ${off?`lock`:``}" data-gi="${i}" style="display:flex"><span class="tt"><b>${g.n}${x.done?` ✓`:``}</b><small>${g.d} · ${ATTRS[g.a].n}</small><small style="color:var(--ed)">${money(gigPay(g))} · +${gigCr(g)} Cred · échec : −${g.dm} Santé</small></span><span class="bd ${p>=70?`hi`:p<=35?`lo`:``}">${p}%</span></button>`;
  }).join(``),{back:openCity});
  document.querySelectorAll(`[data-gi]`).forEach(b=>b.onclick=()=>{
    const x=bd.gigs[+b.dataset.gi]; if(x.done||!bd.left){SFX.ko();return}
    const g=GIGS.find(y=>y.n===x.n), r=rollInfo({a:g.a,k:g.k,dc:g.dc}), roll=rnd(1,10);
    const ok=roll===10||(roll!==1&&roll>=r.need); CHIPS=[]; x.done=true; bd.left--;
    if(ok){ applyFx({ed:gigPay(g),cred:gigCr(g)}); G.stats.gigs++; SFX.ok(); flash(`#05ffa1`); G.log.unshift({d:dateStr(),m:`Gig réussi : ${g.n} (+${gigPay(g)} €$).`}); }
    else { applyFx({hp:-g.dm,ed:Math.round(gigPay(g)*.1)}); SFX.ko(); G.log.unshift({d:dateStr(),m:`Gig raté : ${g.n}.`}); }
    tick(1); updateHud();
    modal(ok?`Gig réussi`:`Gig raté`,`<div class="dice"><div class="die ${ok?`ok`:`ko`}"><span>${roll}</span></div><div class="info">${ATTRS[g.a].n} ${r.tot} + d10<b style="color:${ok?`var(--g)`:`var(--m)`}">${ok?`RÉUSSITE`:`ÉCHEC`}</b></div></div><div class="chips">${CHIPS.map(c=>`<span class="chip ${c.cls}">${esc(c.txt)}</span>`).join(``)}</div><button class="btn pri" id="gok">${bd.left?`Retour au tableau`:`Retour à la ville`}</button>`);
    $(`#gok`).onclick=()=>{ if(checkEnd()){closeModal();showEnd()} else (bd.left?openGigs:openCity)(); };
  });
}

/* ----- CARTE ----- */
function ownerColor(o){ return o===`player`?`#fcee0a`:o===`neutral`?`#3a3a55`:(FAC[o]?FAC[o].c:`#555`); }
function ownerName(o){ return o===`player`?(G.mine?G.mine.name:`Toi`):o===`neutral`?`Neutre / corporatif`:(FAC[o]?FAC[o].n:o); }
let MAPSEL=null, MAPHL=null;
function openMap(keep){
  const hl=MAPHL;
  const rects=DIST.map(d=>{
    const o=G.dist[d.id], locked=d.lock&&!G.flags.dogtown, sel=MAPSEL===d.id;
    const dim=hl&&hl!==o?.25:1;
    const pips=Array.from({length:d.def},(_,i)=>`<circle cx="${d.x+8+i*7}" cy="${d.y+d.h-8}" r="2.2" fill="#fff" opacity=".85"/>`).join(``);
    return `<g data-d="${d.id}" style="cursor:pointer;opacity:${dim}"><rect x="${d.x}" y="${d.y}" width="${d.wd}" height="${d.h}" rx="4" fill="${locked?`#15152a`:ownerColor(o)}" fill-opacity="${o===`player`?.95:locked?.6:.6}" ${sel?`stroke="#fff" stroke-width="3"`:o===`player`?`stroke="#fcee0a" stroke-width="2"`:``}/>
      <text x="${d.x+6}" y="${d.y+16}" style="font-size:10px">${d.n}${locked?` 🔒`:``}</text>
      <text x="${d.x+6}" y="${d.y+27}" style="font-size:6.5px;fill:#ffffffaa;font-weight:500;letter-spacing:.1em">${d.w.toUpperCase()}</text>${pips}
      ${o===`player`?`<text x="${d.x+d.wd-14}" y="${d.y+16}" style="font-size:11px">★</text>`:``}</g>`;
  }).join(``);
  const cnt={}; DIST.forEach(d=>{cnt[G.dist[d.id]]=(cnt[G.dist[d.id]]||0)+1});
  const leg=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).map(o=>`<button class="fc ${hl===o?`on`:``}" data-l="${o}" style="border-color:${ownerColor(o)}"><i style="background:${ownerColor(o)}"></i>${ownerName(o)} ${cnt[o]}</button>`).join(``);
  const sc=$(`#mb`)?$(`#mb`).scrollTop:0;
  modal(`Carte de Night City`,`<div class="sticky" style="padding-bottom:0">${statBar()}</div>
   <svg class="map" viewBox="0 0 400 395">${rects}</svg>
   <div class="sec">Filtrer par propriétaire</div><div class="fchips wrap">${leg}</div>
   <div class="log" style="color:var(--dim)">Tes quartiers : ${ownedList().length} · ● = niveau de défense. Touche un quartier.</div>
   <div class="mappanel" id="mpanel"></div>`,{full:true});
  if($(`#mb`)) $(`#mb`).scrollTop=sc;
  document.querySelectorAll(`.map g`).forEach(g=>g.onclick=()=>{SFX.tap();MAPSEL=g.dataset.d;openMap(true)});
  document.querySelectorAll(`[data-l]`).forEach(b=>b.onclick=()=>{MAPHL=MAPHL===b.dataset.l?null:b.dataset.l;SFX.tap();openMap(true)});
  if(MAPSEL) renderDistrictPanel(MAPSEL);
  else $(`#mpanel`).innerHTML=`<div class="log" style="text-align:center;color:var(--dim)">Choisis un quartier sur la carte ↑</div>`;
}
function renderDistrictPanel(id){
  const d=DMAP[id], o=G.dist[id], why=canConquer(d);
  $(`#mpanel`).innerHTML=`<div class="item" style="border-color:${ownerColor(o)}"><div class="in"><b>${d.n} <small style="display:inline;color:var(--dim)">· ${d.w}</small></b><small>${d.d}</small>
    <small>Contrôle : <b style="color:${ownerColor(o)}">${ownerName(o)}</b> · Défense ${`●`.repeat(d.def)}${`○`.repeat(5-d.def)} · ${d.inc*3} €$/période</small></div></div>
    ${why?`<div class="why">${why==="Déjà à toi"?`★ Ce quartier est à toi.`:`🔒 ${why}`}</div>`:`<button class="btn pri" id="goq">Conquérir ${d.n}</button>`}`;
  const g=$(`#goq`); if(g) g.onclick=()=>{SFX.tap();openConquest(d)};
  const mp=$(`#mpanel`); setTimeout(()=>mp.scrollIntoView({behavior:`smooth`,block:`nearest`}),50);
}
function openConquest(d){
  const prev=G.dist[d.id];
  modal(`Conquérir ${d.n}`,`<div class="log">Actuellement : <b style="color:${ownerColor(prev)}">${ownerName(prev)}</b> · Défense ${d.def}/5.<br>Un échec coûte de la Santé et de la réputation auprès du propriétaire.</div>`+
   conquestChoices(d).map((c,i)=>`<button class="btn choice ${c.req?`lock`:``}" data-q="${i}"><span class="tt"><b>${c.t}</b><small>${c.req?`🔒 ${c.req}`:c.s}</small></span>${c.a?`<span class="bd ${rollInfo({a:c.a,k:c.sk,dc:c.dc}).chance>=.7?`hi`:rollInfo({a:c.a,k:c.sk,dc:c.dc}).chance<=.35?`lo`:``}">${Math.round(rollInfo({a:c.a,k:c.sk,dc:c.dc}).chance*100)}%</span>`:``}</button>`).join(``),{back:()=>openMap(true)});
  document.querySelectorAll(`[data-q]`).forEach(b=>b.onclick=()=>{
    const opt=conquestChoices(d)[+b.dataset.q]; if(opt.req){SFX.ko();return}
    const r=doConquer(d,opt); updateHud();
    modal(r.ok?`${d.n} est à toi !`:`Échec à ${d.n}`,`${r.info?`<div class="dice"><div class="die ${r.ok?`ok`:`ko`}"><span>${r.info.roll}</span></div><div class="info">${r.ok?`<b style="color:var(--g)">RÉUSSITE</b>`:`<b style="color:var(--m)">ÉCHEC</b>`}</div></div>`:``}
      <div class="rt">${r.ok?`Les rues changent de couleur. ${d.n} porte désormais ton nom.`:`L'assaut tourne mal. Les défenseurs te repoussent.`}</div><div class="chips">${r.chips.map(c=>`<span class="chip ${c.cls}">${esc(c.txt)}</span>`).join(``)}</div><button class="btn pri" id="qok">Retour à la carte</button>`);
    r.ok?(SFX.ok(),flash(`#fcee0a`),vib(80)):(SFX.ko(),shake());
    $(`#qok`).onclick=()=>{ if(checkEnd()){closeModal();showEnd()} else {MAPSEL=d.id;openMap(true)} };
  });
}

/* ----- FACTIONS ----- */
function openFactions(){
  let h=``;
  if(G.mine) h+=`<div class="item own"><div class="in"><b style="color:var(--y)">${esc(G.mine.name)}</b><small>Ta faction · ${{gang:`Gang de rue`,fixers:`Réseau de fixers`,nomads:`Clan nomade`,runners:`Collectif de netrunners`}[G.mine.type]} · Puissance ${G.mine.power} · ${ownedList().length} quartier(s)</small></div></div>`;
  if(G.member) h+=`<div class="item own" style="border-color:${FAC[G.member].c}"><div class="in"><b style="color:${FAC[G.member].c}">${FAC[G.member].n} — ${rankTitle()}</b><small>Missions accomplies : ${G.jobs} · ${FAC[G.member].perk}</small></div><button class="btn" style="width:auto;padding:8px 12px" id="lfac">Quitter</button></div>`;
  h+=`<div class="sec">Réputation</div>`+Object.keys(FAC).map(id=>{
    const f=FAC[id], r=G.fac[id]||0;
    return `<div class="item" style="border-color:${f.c}55"><div class="in"><b style="color:${f.c}">${f.n}${G.member===id?` <span class="tagx y">MEMBRE</span>`:``}</b><small>${f.d}</small><div class="bigbar"><i style="background:${r>=0?`var(--g)`:`var(--m)`};left:${r>=0?50:50+r/2}%;width:${Math.abs(r)/2}%"></i></div></div><b style="color:${r>=0?`var(--g)`:`var(--m)`}">${r}</b></div>`;
  }).join(``);
  modal(`Factions`,h);
  const lf=$(`#lfac`); if(lf) lf.onclick=()=>{
    if(!confirm(`Quitter ${FAC[G.member].n} ? Ils ne l'oublieront pas.`))return;
    G.fac[G.member]=(G.fac[G.member]||0)-35; G.joinedOnce[G.member]=true; G.log.unshift({d:dateStr(),m:`Tu quittes ${FAC[G.member].n}.`}); G.member=null; G.rank=0; G.jobs=0; updateHud(); SFX.ko(); openFactions();
  };
}
function openLog(){ modal(`Journal`,G.log.slice(0,40).map(l=>`<div class="log"><b>${l.d}</b>${esc(l.m)}</div>`).join(``)||`<div class="log">Rien à signaler.</div>`); }
function openExit(){
  modal(`Sortir`,`<div class="log">La rue ne rend rien. Choisis comment tu veux partir.</div>
   <button class="btn" data-x="retire"><div style="color:var(--g);font-weight:700">Prendre ta retraite maintenant</div><div style="color:var(--dim)">Fin paisible · bonus de retraite ×1,3 (mais moins d'années au compteur)</div></button>
   <button class="btn" data-x="blaze"><div style="color:var(--m);font-weight:700">Dernier Run — sortir en flammes</div><div style="color:var(--dim)">Bonus si Street Cred ≥ 30. Sinon, personne ne s'en souviendra.</div></button>
   <button class="btn" data-x="menu"><div style="font-weight:700">Sauvegarder & revenir au titre</div></button>`);
  document.querySelectorAll(`[data-x]`).forEach(b=>b.onclick=()=>{
    const x=b.dataset.x; SFX.tap();
    if(x===`menu`){ save(); closeModal(); showTitle(); return; }
    if(!confirm(x===`retire`?`Prendre ta retraite maintenant ?`:`Faire ton Dernier Run ?`)) return;
    closeModal(); endGame(x); showEnd();
  });
}

/* ---------- écran final ---------- */
function showEnd(){
  closeModal(); document.body.classList.remove(`lowhum`);
  const k=G.over, e=ENDS[k], s=G.final;
  const title = legendTitle(k);
  root().innerHTML=`<div class="screen end">
    <div class="mono" style="color:var(--dim);letter-spacing:.3em">${esc(G.name)} · ${G.age} ans · ${yr()}</div>
    <h1 class="hd glitch" data-t="${e.t}" style="color:${k===`retire`||k===`blaze`||k===`quit`||e.good?`var(--y)`:`var(--m)`}">${e.t}</h1>
    <div class="ep">« ${e.e} »</div>
    <div class="hd" style="color:var(--c);letter-spacing:.25em">${title}</div>
    ${G.newBest?`<div class="newbest hd">★ NOUVEAU RECORD ★</div>`:``}
    <div class="score" id="sc">0</div>
    <div class="brk">${s.lines.map(l=>`<div><span>${esc(l[0])}</span><b>${l[1].toLocaleString(`fr`)}</b></div>`).join(``)}<div><span>Sous-total</span><b>${Math.round(s.base).toLocaleString(`fr`)}</b></div><div><span>Multiplicateur de fin</span><b style="color:var(--y)">×${s.mult}</b></div></div>
    <div class="stack"><button class="btn pri" id="again">Nouvelle vie</button><button class="btn" id="home">Titre</button><button class="btn" id="share">Copier mon score</button></div></div>`;
  let n=0; const tgt=s.total, step=Math.max(1,Math.round(tgt/60)); const iv=setInterval(()=>{ n=Math.min(tgt,n+step); $(`#sc`).textContent=n.toLocaleString(`fr`); if(n>=tgt)clearInterval(iv); },20);
  if(k===`retire`||k===`blaze`||k===`quit`||e.good) SFX.ok(); else { SFX.ko(); flash(`#ff2a6d`); }
  $(`#again`).onclick=()=>{SFX.tap();showCreate()}; $(`#home`).onclick=()=>{SFX.tap();showTitle()};
  $(`#share`).onclick=()=>{ const t=`NIGHT CITY LEGEND — ${G.name} (${roleTitle()}) : ${tgt.toLocaleString(`fr`)} pts · ${e.t} à ${G.age} ans`; try{navigator.clipboard.writeText(t);toast(`Copié !`)}catch(_){toast(t)} };
}
function legendTitle(k){
  const r=roleTitle();
  if(G.cred>=90) return `Légende de Night City · ${r}`;
  if(G.cred>=60) return `${r} respecté(e) · Afterlife te connaît`;
  if(G.cred>=30) return `${r} de renom`;
  if(G.cred>=12) return `${r} local(e)`;
  return `Un nom oublié dans la foule`;
}

/* ---------- init ---------- */
window.addEventListener(`DOMContentLoaded`,()=>{
  document.body.insertAdjacentHTML(`beforeend`,`<div id="fx"></div><div id="vig"></div><div id="flash"></div>`);
  showTitle();
});
