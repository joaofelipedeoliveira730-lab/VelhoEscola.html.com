(() => {
"use strict";

const SAVE_KEY = "velhoescola_save_final_v1";
const TOTAL = 150;
const PER_PRESTIGE = 30;
const COLORS = ["#94a3b8","#22c55e","#3b82f6","#a855f7","#f59e0b"];

const bank = [
 {title:"HTML é a estrutura",learn:"HTML organiza o conteúdo de uma página.",metaphor:"Imagine uma casa: o HTML é a planta e os cômodos. Ele define onde cada coisa fica.",q:"Qual tecnologia define a estrutura e o conteúdo de uma página web?",o:["CSS","HTML","SQL","Python"],a:1,tip:"HTML cria a estrutura. CSS cuida da aparência."},
 {title:"CSS é a aparência",learn:"CSS controla cores, tamanhos, espaçamentos e muito mais.",metaphor:"Se HTML é a casa, CSS é a pintura, a decoração e a iluminação.",q:"Qual tecnologia é usada principalmente para estilizar HTML?",o:["HTML","CSS","SQL","JSON"],a:1,tip:"CSS significa Cascading Style Sheets."},
 {title:"Classes",learn:"Classes permitem reutilizar estilos em vários elementos.",metaphor:"É como uma etiqueta que você coloca em várias pessoas que pertencem ao mesmo grupo.",q:"Qual símbolo inicia um seletor de classe no CSS?",o:["#",".","@","&"],a:1,tip:"Classe usa ponto: .botao. ID usa #."},
 {title:"IDs",learn:"Um id identifica um elemento específico.",metaphor:"É como o número único de uma casa em uma rua.",q:"Qual símbolo inicia um seletor de ID no CSS?",o:[".", "#", "*", ":"],a:1,tip:"ID usa #, por exemplo #menu."},
 {title:"Box Model",learn:"Elementos HTML podem ser entendidos como caixas.",metaphor:"Uma caixa tem conteúdo, espaço interno, borda e espaço externo.",q:"Qual propriedade cria espaço entre o conteúdo e a borda?",o:["margin","border","padding","width"],a:2,tip:"padding é o espaço interno; margin é o espaço externo."}
];

let state = load();
let current = null;
let audio = null;
let musicTimer = null;

function $(id){return document.getElementById(id)}
function load(){
 try{
   const s=JSON.parse(localStorage.getItem(SAVE_KEY));
   if(s && Array.isArray(s.done)) return {
     done:s.done, streak:Number(s.streak)||0, xp:Number(s.xp)||0,
     prestige:Number(s.prestige)||1
   };
 }catch(e){}
 return {done:[],streak:0,xp:0,prestige:1};
}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state))}catch(e){}}

function audioStart(){
 try{
  if(!audio) audio=new (window.AudioContext||window.webkitAudioContext)();
  if(audio.state==="suspended") audio.resume();
  if(!musicTimer){
   const notes=[196,247,294,247,220,277,330,277];let i=0;
   musicTimer=setInterval(()=>tone(notes[i++%notes.length],.45,"triangle",.008),800);
  }
 }catch(e){}
}
function tone(freq,d=.1,type="sine",vol=.04){
 if(!audio)return;
 const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;
 o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);
 g.gain.exponentialRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(g).connect(audio.destination);o.start(t);o.stop(t+d+.03);
}
function clickSound(){tone(500,.05,"sine",.025)}
function rightSound(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.14,"sine",.05),i*70))}
function wrongSound(){tone(170,.18,"sawtooth",.035);setTimeout(()=>tone(115,.25,"triangle",.025),90)}
function winSound(){[392,523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.25,"sine",.07),i*100))}

function show(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 const target=$(id); if(target) target.classList.add("active");
 document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));
 update();
}
function update(){
 $("header-streak").textContent=state.streak;
 $("header-prestige").textContent="Prestígio "+state.prestige;
 const pct=Math.round(state.done.length/TOTAL*100);
 $("progress-percent").textContent=pct+"%";$("dashboard-bar").style.width=pct+"%";
 const grid=$("levels-status-grid");grid.innerHTML="";
 for(let i=1;i<=TOTAL;i++){const d=document.createElement("div");d.textContent=i;if(state.done.includes(i))d.className="done";grid.appendChild(d)}
 renderPrestiges();
}

function maxUnlockedVisible(){
 return Math.min(TOTAL,state.prestige*PER_PRESTIGE);
}
function unlocked(n){
 if(n===1)return true;
 return state.done.includes(n-1);
}
function renderMap(){
 const path=$("path-container");path.innerHTML="";
 const max=maxUnlockedVisible();
 for(let n=1;n<=max;n++){
  const wrap=document.createElement("div");wrap.className="level-wrap";
  const b=document.createElement("button");b.className="level-node";
  const p=Math.floor((n-1)/PER_PRESTIGE);b.style.background=state.done.includes(n)?COLORS[p]:COLORS[p];
  if(!unlocked(n)){b.classList.add("locked");b.textContent="🔒"}
  else if(state.done.includes(n)){b.textContent="✓";b.title="Refazer nível "+n}
  else b.textContent=n;
  b.addEventListener("click",()=>{if(unlocked(n))openLesson(n)});
  const lab=document.createElement("div");lab.className="level-label";lab.textContent=state.done.includes(n)?"CONCLUÍDO • NÍVEL "+n:"NÍVEL "+n;
  wrap.append(b,lab);path.appendChild(wrap);
 }
 if(max<TOTAL){
  const lock=document.createElement("div");lock.className="card";lock.style.textAlign="center";
  lock.innerHTML="<b>🔒 Próximo prestígio bloqueado</b><p>Conclua o nível "+max+" para abrir o próximo grupo.</p>";
  path.appendChild(lock);
 }
}

function renderPrestiges(){
 const box=$("prestiges-list");box.innerHTML="";
 for(let p=1;p<=5;p++){
  const item=document.createElement("div");item.className="prestige-item";
  const unlockedP=state.prestige>=p;
  item.style.borderColor=unlockedP?COLORS[p-1]:"#ffffff12";
  item.innerHTML=`<h3>${unlockedP?"👑":"🔒"} Prestígio ${p} — ${["Novato","Construtor","Codificador","Mestre CSS","Engenheiro Web"][p-1]}</h3><p>${unlockedP?"Desbloqueado!":"Conclua os níveis "+((p-1)*30+1)+"–"+(p*30)+"."}</p>`;
  box.appendChild(item);
 }
}

function openLesson(n){
 audioStart();clickSound();
 current={n,q:bank[(n-1)%bank.length]};
 $("lesson-badge").textContent="NÍVEL "+n;
 $("lesson-badge").style.background=COLORS[Math.floor((n-1)/30)];
 $("lesson-title").textContent=current.q.title;
 $("lesson-learn").textContent=current.q.learn;
 $("lesson-metaphor").textContent=current.q.metaphor;
 show("screen-lesson-intro");
}

function startQuiz(){
 if(!current)return;
 audioStart();clickSound();
 const q=current.q;
 $("question-text").textContent=q.q;
 const box=$("options-container");box.innerHTML="";
 q.o.map((text,i)=>({text,i})).sort(()=>Math.random()-.5).forEach(x=>{
   const b=document.createElement("button");b.className="option";b.textContent=x.text;b.dataset.index=x.i;
   b.addEventListener("click",()=>{
     document.querySelectorAll(".option").forEach(o=>o.classList.remove("selected"));
     b.classList.add("selected");current.selected=Number(b.dataset.index);$("check-btn").disabled=false;clickSound();
   });box.appendChild(b);
 });
 $("check-btn").disabled=true;$("quiz-progress").style.width="100%";show("screen-quiz");
}

function check(){
 if(!current || current.selected==null)return;
 const correct=current.selected===current.q.a;
 correct?rightSound():wrongSound();
 const f=$("feedback");f.classList.remove("hidden","wrong");if(!correct)f.classList.add("wrong");
 $("feedback-icon").textContent=correct?"🎉":"💡";
 $("feedback-title").textContent=correct?"ACERTOU!":"AINDA NÃO!";
 $("feedback-tip").textContent=correct?"Mandou bem! "+current.q.tip:current.q.tip;
 $("next-btn").textContent=correct?"CONTINUAR →":"TENTAR DE NOVO ↻";
 if(correct){
   if(!state.done.includes(current.n)){state.done.push(current.n);state.done.sort((a,b)=>a-b);state.xp+=10;state.streak++}
   save();update();
 }else{state.streak=0;save();update()}
 $("check-btn").disabled=true;
}

function next(){
 $("feedback").classList.add("hidden");
 if(!current)return;
 if(!state.done.includes(current.n)){startQuiz();return}
 if(current.n%30===0 && current.n/30>=state.prestige){
   state.prestige=Math.min(5,Math.floor(current.n/30)+1);
   if(state.prestige>5)state.prestige=5;
   save();winSound();
   $("prestige-desc").textContent="Você conquistou o Prestígio "+state.prestige+"! O próximo trecho da jornada está aberto.";
   $("prestige-overlay").classList.remove("hidden");return;
 }
 renderMap();show("screen-map");
}

function reset(){
 if(confirm("Apagar todo o progresso?")){
  localStorage.removeItem(SAVE_KEY);state={done:[],streak:0,xp:0,prestige:1};renderMap();update();show("screen-map");
 }
}

document.addEventListener("DOMContentLoaded",()=>{
 $("enter-btn").addEventListener("click",()=>{audioStart();clickSound();$("welcome-screen").classList.add("hidden");$("app").classList.remove("hidden");renderMap();update()});
 $("start-quiz-btn").addEventListener("click",startQuiz);
 $("check-btn").addEventListener("click",check);
 $("next-btn").addEventListener("click",next);
 $("abort-btn").addEventListener("click",()=>show("screen-map"));
 $("reset-btn").addEventListener("click",reset);
 $("close-prestige").addEventListener("click",()=>{$("prestige-overlay").classList.add("hidden");renderMap();update();show("screen-map")});
 document.querySelectorAll(".bottom-nav button").forEach(b=>b.addEventListener("click",()=>show(b.dataset.screen)));
 document.querySelectorAll('[data-action="home"]').forEach(b=>b.addEventListener("click",()=>show("screen-map")));
 renderMap();update();
});
})();