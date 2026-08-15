/* VelhoEscola — motor do jogo
   Salva automaticamente no celular com localStorage.
   Áudio é gerado pelo Web Audio API após a primeira interação.
*/
(() => {
  "use strict";

  const TOTAL_LEVELS = 150;
  const PRESTIGE_SIZE = 30;
  const KEY = "velhoescola_save_v2";

  const prestigeColors = ["#94a3b8","#22c55e","#3b82f6","#a855f7","#f59e0b"];
  const prestigeNames = ["Novato","Construtor","Codificador","Mestre CSS","Engenheiro Web"];

  const questions = [
    {title:"HTML: a estrutura", learn:"HTML organiza o conteúdo de uma página.", metaphor:"Pense numa casa: HTML é a planta e os cômodos. Ele diz onde cada coisa fica.", q:"Qual linguagem define a estrutura e o conteúdo de uma página web?", o:["CSS","HTML","SQL","Python"], a:1, tip:"HTML cria a estrutura; CSS cuida da aparência."},
    {title:"CSS: a aparência", learn:"CSS estiliza elementos HTML.", metaphor:"Se HTML é a casa, CSS é a pintura, o piso, a iluminação e a decoração.", q:"Qual tecnologia é usada principalmente para estilizar uma página HTML?", o:["CSS","HTML","SQL","JSON"], a:0, tip:"CSS significa Cascading Style Sheets."},
    {title:"Seletores", learn:"Seletores dizem ao CSS quais elementos serão estilizados.", metaphor:"É como dizer ao pintor: 'pinte exatamente estas portas'.", q:"Qual seletor CSS seleciona um elemento pelo id?", o:[".menu","#menu","menu","*menu"], a:1, tip:"ID usa #. Classe usa ."},
    {title:"Classes", learn:"Classes permitem aplicar o mesmo estilo a vários elementos.", metaphor:"É como colocar uma etiqueta 'aluno' em várias pessoas da escola.", q:"Qual símbolo inicia um seletor de classe no CSS?", o:["#",".","@","&"], a:1, tip:"Exemplo: .botao seleciona elementos com class=\"botao\"."},
    {title:"Box Model", learn:"Todo elemento pode ser entendido como uma caixa.", metaphor:"Imagine uma caixa: conteúdo dentro, espaço interno, borda e espaço externo.", q:"Qual propriedade cria espaço interno no Box Model?", o:["margin","border","padding","gap"], a:2, tip:"padding é espaço entre o conteúdo e a borda."}
  ];

  let state = load();
  let current = null;
  let audioCtx = null;
  let musicTimer = null;
  let musicOn = false;

  function load(){
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if(saved && Array.isArray(saved.done)) return {
        done: saved.done, streak: saved.streak || 0, xp: saved.xp || 0,
        prestige: saved.prestige || 1, last: saved.last || 0
      };
    } catch(e){}
    return {done:[], streak:0, xp:0, prestige:1, last:0};
  }

  function save(){
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){}
  }

  const $ = id => document.getElementById(id);
  const screen = id => {
    document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));
    const el=$(id); if(el) el.classList.add("active");
  };

  function ensureAudio(){
    try {
      if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==="suspended") audioCtx.resume();
      if(!musicOn) startMusic();
    } catch(e){}
  }

  function tone(freq, duration=.12, type="sine", volume=.04, delay=0){
    if(!audioCtx) return;
    const t=audioCtx.currentTime+delay;
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(volume,t+.015);
    g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t+duration+.03);
  }

  function clickSound(){ tone(420,.06,"sine",.025); }
  function correctSound(){ [523,659,784,1047].forEach((f,i)=>tone(f,.16,"sine",.055,i*.07)); }
  function wrongSound(){ tone(180,.18,"sawtooth",.035); tone(120,.25,"triangle",.025,.08); }
  function prestigeSound(){ [392,523,659,784,1047,1319].forEach((f,i)=>tone(f,.28,"sine",.07,i*.11)); }

  function startMusic(){
    if(!audioCtx || musicOn) return;
    musicOn=true;
    const notes=[196,247,294,247,220,277,330,277];
    let i=0;
    musicTimer=setInterval(()=>{
      if(document.hidden) return;
      tone(notes[i++%notes.length],.55,"triangle",.008);
      if(i%4===0) tone(notes[(i+1)%notes.length]/2,.7,"sine",.006);
    },620);
  }

  window.startAppWithAudio = function(){
    ensureAudio(); clickSound();
    const w=$("welcome-screen"); if(w) w.style.display="none";
    renderMap(); updateHeader(); showMap();
  };

  function showMap(){ screen("screen-map"); }
  window.goHome=showMap;

  function updateHeader(){
    if($("header-streak")) $("header-streak").textContent=state.streak;
    if($("header-prestige-text")) $("header-prestige-text").textContent="Prestígio "+state.prestige;
    updateProgress();
  }

  function levelQuestion(n){
    return questions[(n-1)%questions.length];
  }

  function isUnlocked(n){
    if(n===1) return true;
    const previousDone = state.done.includes(n-1);
    const prestigeStart = Math.floor((n-1)/PRESTIGE_SIZE)*PRESTIGE_SIZE+1;
    if(n===prestigeStart && n>1) return state.done.includes(n-1);
    return previousDone;
  }

  function renderMap(){
    const c=$("path-container"); if(!c) return;
    c.innerHTML="";
    const maxVisible = Math.min(TOTAL_LEVELS, state.prestige*PRESTIGE_SIZE);
    for(let n=1;n<=maxVisible;n++){
      const row=document.createElement("div");
      row.style.width="100%";
      const unlocked=isUnlocked(n), done=state.done.includes(n);
      const btn=document.createElement("button");
      btn.className="level-node "+(!unlocked?"locked":"");
      btn.style.background=done?prestigeColors[Math.floor((n-1)/30)]:(unlocked?prestigeColors[Math.floor((n-1)/30)]:"#27272a");
      btn.style.boxShadow=unlocked?"0 6px 0 rgba(0,0,0,.55)":"0 6px 0 #18181b";
      btn.innerHTML=done?'<i class="fas fa-check"></i>':(!unlocked?'<i class="fas fa-lock"></i>':String(n));
      btn.title="Nível "+n;
      if(unlocked) btn.onclick=()=>openLesson(n);
      row.appendChild(btn);
      const label=document.createElement("div");
      label.className="text-center mt-2 text-xs font-black text-white/70";
      label.textContent=done?"CONCLUÍDO • NÍVEL "+n:"NÍVEL "+n;
      row.appendChild(label);
      c.appendChild(row);
    }
    if(maxVisible<TOTAL_LEVELS){
      const p=document.createElement("div");
      p.className="glass-card rounded-2xl p-5 text-center mt-4";
      p.innerHTML=`<b>🔒 Prestígio ${state.prestige+1}</b><br><span class="text-sm text-gray-400">Conclua os níveis ${state.prestige*30-29}–${state.prestige*30} para abrir a próxima área.</span>`;
      c.appendChild(p);
    }
  }

  function openLesson(n){
    ensureAudio(); clickSound(); current={n,q:levelQuestion(n)};
    $("lesson-badge").textContent="NÍVEL "+n;
    $("lesson-title").textContent=current.q.title;
    $("lesson-learn").textContent=current.q.learn;
    $("lesson-metaphor").textContent=current.q.metaphor;
    const badge=$("lesson-badge"); if(badge) badge.style.background=prestigeColors[Math.floor((n-1)/30)];
    screen("screen-lesson-intro");
  }

  window.startQuiz=function(){
    ensureAudio(); clickSound();
    if(!current) return;
    const q=current.q;
    $("question-text").textContent=q.q;
    const box=$("options-container"); box.innerHTML="";
    const order=q.o.map((text,i)=>({text,i})).sort(()=>Math.random()-.5);
    order.forEach(item=>{
      const b=document.createElement("button");
      b.className="btn-option";
      b.textContent=item.text;
      b.dataset.index=item.i;
      b.onclick=()=>selectOption(b);
      box.appendChild(b);
    });
    $("btn-check").disabled=true;
    screen("screen-quiz");
  };

  function selectOption(btn){
    ensureAudio(); clickSound();
    document.querySelectorAll(".btn-option").forEach(x=>x.classList.remove("selected"));
    btn.classList.add("selected");
    btn.style.borderColor=prestigeColors[Math.floor((current.n-1)/30)];
    $("btn-check").disabled=false;
    current.selected=Number(btn.dataset.index);
  }

  window.checkAnswer=function(){
    if(current?.selected==null) return;
    const correct=current.selected===current.q.a;
    correct?correctSound():wrongSound();
    const banner=$("feedback-banner");
    banner.className="feedback-banner show "+(correct?"correct":"wrong");
    $("feedback-title").textContent=correct?"ACERTOU! 🔥":"QUASE! 💪";
    $("feedback-icon").innerHTML=correct?'🎉':'💡';
    $("feedback-tip-text").textContent=current.q.tip;
    if(correct){
      if(!state.done.includes(current.n)){
        state.done.push(current.n); state.done.sort((a,b)=>a-b);
        state.xp+=10; state.streak++;
      }
      save(); updateHeader();
      $("btn-next").innerHTML="CONTINUAR <i class='fas fa-arrow-right'></i>";
    } else {
      state.streak=0; save(); updateHeader();
      $("btn-next").innerHTML="TENTAR NOVAMENTE <i class='fas fa-redo'></i>";
    }
    $("btn-check").disabled=true;
  };

  window.handleNextQuestion=function(){
    const banner=$("feedback-banner"); banner.className="feedback-banner";
    if(!current) return;
    if(!state.done.includes(current.n)){ startQuiz(); return; }
    if(current.n%30===0 && state.prestige<5){
      state.prestige=Math.min(5, state.prestige+1); save(); prestigeSound();
      if($("prestige-title")) $("prestige-title").textContent="NOVO PRESTÍGIO DESBLOQUEADO! 👑";
      if($("prestige-desc")) $("prestige-desc").textContent="Você conquistou uma nova parte da jornada!";
      if($("prestige-overlay")) $("prestige-overlay").style.display="flex";
      return;
    }
    renderMap(); updateHeader(); showMap();
  };

  window.closePrestige=function(){
    if($("prestige-overlay")) $("prestige-overlay").style.display="none";
    renderMap(); updateHeader(); showMap();
  };

  window.abortQuiz=function(){ clickSound(); showMap(); };

  function updateProgress(){
    const percent=Math.round(state.done.length/TOTAL_LEVELS*100);
    if($("progress-percent")) $("progress-percent").textContent=percent+"%";
    if($("dashboard-bar")) $("dashboard-bar").style.width=percent+"%";
    const grid=$("levels-status-grid"); if(grid){
      grid.innerHTML="";
      for(let n=1;n<=TOTAL_LEVELS;n++){
        const x=document.createElement("div");
        x.className="text-center text-[10px] font-black rounded p-1 "+(state.done.includes(n)?"bg-green-500 text-white":"bg-white/10 text-gray-500");
        x.textContent=n; grid.appendChild(x);
      }
    }
  }

  window.confirmReset=function(){
    if(confirm("Apagar TODO o progresso? Esta ação não pode ser desfeita.")){
      localStorage.removeItem(KEY);
      state={done:[],streak:0,xp:0,prestige:1,last:0};
      renderMap(); updateHeader(); showMap();
    }
  };

  window.showScreen=function(id){ clickSound(); screen(id); updateProgress(); };

  // Navegação inferior por onclick inline.
  document.addEventListener("DOMContentLoaded",()=>{
    updateHeader(); renderMap();
    document.querySelectorAll("[data-nav]").forEach(btn=>{
      btn.addEventListener("click",()=>showScreen(btn.dataset.nav));
    });
  });
})();