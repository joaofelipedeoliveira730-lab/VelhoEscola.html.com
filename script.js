(() => {
"use strict";

const SAVE_KEY = "velhoescola_save_final_v1";
const TOTAL = 150;
const PER_PRESTIGE = 30;
const COLORS = ["#06b6d4","#22c55e","#c026d3","#f43f5e","#fbbf24"];

const bank = [
 {n: 101, title:"HTML: Pattern", learn:"Patterns (padrões) ajudam a construir interfaces de forma robusta e previsível, mantendo a semântica em dia.", metaphor:"Pense num molde de gesso para as paredes: o formato sempre sai padronizado e perfeito.", img: "https://placehold.co/600x300/c026d3/white?text=HTML+Pattern", q:"Qual a vantagem principal de utilizar Patterns no seu código?", o:["Garante uma interface previsível e robusta.","Remove a necessidade de aplicar os estilos.","Aumenta muito o tempo para o carregamento.","Deixa o código sem semântica e inacessível."], a:0, tip:"Patterns servem justamente para organizar e deixar previsível!"},
 {n: 102, title:"HTML: Button", learn:"Button é a tag usada para interações diretas (enviar formulários, abrir modais), não para links.", metaphor:"O botão é como o interruptor de luz: você aperta e uma ação específica acontece na mesma hora.", q:"Qual é a principal função de um elemento <button>?", o:["Executar uma ação direta na própria página.","Navegar o usuário para outra URL ou site.","Alterar a cor de fundo apenas com o clique.","Guardar os dados permanentemente no banco."], a:0, tip:"Para navegar use <a>, para ações use <button>."},
 {n: 103, title:"HTML: Tabelas", learn:"Tabelas (<table/>) devem ser usadas APENAS para dados tabulares (linhas e colunas), não para layout estrutural.", metaphor:"É como uma planilha do Excel ou um calendário colado na parede.", img: "https://placehold.co/600x300/22c55e/white?text=Tabelas", q:"Em qual cenário o uso da tag <table> é considerado adequado?", o:["Exibir um conjunto de dados em colunas.","Organizar o cabeçalho e rodapé do site.","Criar espaçamentos entre imagens na tela.","Posicionar os botões de navegação lateral."], a:0, tip:"Tabela é para dados, nunca para construir o layout da página."},
 {n: 104, title:"HTML: Caption", learn:"A tag <caption> fornece um título ou descrição diretamente associado a uma <table>.", metaphor:"É como a etiqueta que você cola na gaveta para dizer o que tem ali dentro.", q:"Qual a verdadeira função da tag <caption> dentro do HTML?", o:["Fornecer um título ou legenda para a tabela.","Criar uma nova coluna de dados para a tabela.","Mudar a cor das bordas das linhas na tabela.","Excluir linhas vazias automaticamente na tela."], a:0, tip:"O caption funciona como o título oficial da sua tabela."},
 {n: 105, title:"HTML: Thead, Tbody, Tfoot", learn:"Agrupam as linhas da tabela em Cabeçalho, Corpo e Rodapé, melhorando a semântica e a acessibilidade.", metaphor:"O sanduíche perfeito: pão em cima (thead), recheio (tbody) e pão embaixo (tfoot).", q:"Para que servem estruturalmente as tags thead, tbody e tfoot?", o:["Agrupar cabeçalho, corpo e rodapé na tabela.","Colorir as linhas ímpares e pares facilmente.","Somar os valores matemáticos automaticamente.","Limitar o número de linhas exibidas na página."], a:0, tip:"Elas dividem semanticamente as seções da tabela."},
 {n: 106, title:"HTML: Scope em Tabelas", learn:"O atributo 'scope' nas tags <th> diz ao leitor de tela se aquele cabeçalho é de uma 'col' ou 'row'.", metaphor:"É como um fiscal de trânsito apontando quem pertence a qual rua.", q:"Por que usamos o atributo scope nas células de cabeçalho <th>?", o:["Identificar se o título rege linha ou coluna.","Aumentar a largura daquela célula específica.","Mudar a fonte do texto para negrito na tela.","Ocultar a coluna em dispositivos portáteis."], a:0, tip:"Scope orienta leitores de tela: col (coluna) ou row (linha)."},
 {n: 107, title:"HTML: Audio", learn:"A tag <audio> incorpora sons na página sem precisar de plugins externos, com controles nativos.", metaphor:"É a caixinha de som Bluetooth que você liga na parede da sua casa.", q:"Sobre a tag <audio>, o que é estritamente correto afirmar?", o:["Permite inserir arquivos de som nativamente.","Exige instalação de plugins como Flash Player.","Só aceita arquivos de áudio no formato MP4.","Precisa de JavaScript para conseguir tocar."], a:0, tip:"O HTML5 trouxe o <audio> rodando nativamente no navegador."},
 {n: 108, title:"HTML: Video", learn:"A tag <video> exibe vídeos, suportando atributos como autoplay, loop e controls.", metaphor:"É a televisão embutida na parede da sala da sua casa virtual.", img:"https://placehold.co/600x300/06b6d4/white?text=Video+Element", q:"Qual atributo adiciona os botões de play e pause na tag <video>?", o:["O atributo controls é responsável por isso.","O atributo autoplay faz isso automaticamente.","O atributo play-btn precisa ser adicionado.","O atributo ui-show deve ser setado em true."], a:0, tip:"Sem 'controls', o vídeo fica sem botões para o usuário."},
 {n: 109, title:"HTML: Details e Summary", learn:"Criam um widget de acordeão (expandir/recolher) de forma nativa, sem precisar de JavaScript.", metaphor:"É a gaveta mágica: você lê a etiqueta (summary) e puxa para ver o conteúdo (details).", q:"Como funciona o conjunto das tags <details> e <summary>?", o:["Criam um conteúdo retrátil nativo e simples.","Constroem um formulário complexo para envio.","Servem para agrupar links do menu principal.","Aumentam o zoom de uma imagem ao clicar."], a:0, tip:"Eles formam aquele clássico 'sanfona' ou 'acordeão'."},
 {n: 110, title:"HTML: Dialog", learn:"A tag <dialog> é usada para criar janelas modais nativas acessíveis.", metaphor:"É como o porteiro da casa que entra na sua frente para dar um aviso urgente.", q:"Qual é o propósito correto para utilizarmos a tag <dialog>?", o:["Criar janelas modais nativas de forma fácil.","Fazer o texto piscar rapidamente na sua tela.","Interligar duas páginas em um mesmo arquivo.","Armazenar conversas do banco de informações."], a:0, tip:"Use <dialog> para caixas de diálogo ou modais sobre a tela."},
 {n: 111, title:"HTML: Data attributes", learn:"Atributos 'data-*' permitem guardar informações invisíveis em um elemento para usar no CSS ou JS.", metaphor:"É um bolso escondido no seu casaco: ninguém vê, mas você sabe o que está guardado lá.", q:"Para que utilizamos atributos começando com 'data-' no HTML?", o:["Guardar dados customizados de forma invisível.","Deixar o texto destacado com a cor em amarelo.","Conectar diretamente com o banco de dados SQL.","Reduzir o peso da página para celulares antigos."], a:0, tip:"data-id, data-role... eles guardam dados na própria tag."},
 {n: 112, title:"CSS Variables", learn:"Variáveis nativas do CSS (--nome) guardam valores reutilizáveis, facilitando reformas globais (como um modo escuro).", metaphor:"É uma lata de tinta mágica: se você mudar a cor nela, a casa inteira muda de cor ao mesmo tempo.", q:"Como declaramos corretamente uma variável global dentro do CSS?", o:["Declarando dentro do seletor :root com dois traços.","Usando o símbolo do cifrão no começo da palavra.","Escrevendo a palavra var antes do nome da cor.","Criando uma tag específica chamada <variable>."], a:0, tip:"A declaração fica no :root, exemplo: --cor-principal: red;"},
 {n: 113, title:"CSS: Cascade", learn:"Cascata (Cascade) é a regra de desempate: quem está mais em baixo no arquivo ou tem maior especificidade vence.", metaphor:"É a lei do mestre de obras: a última ordem recebida sempre substitui a ordem anterior.", q:"O que significa o conceito de Cascata na linguagem do CSS?", o:["Regras posteriores podem sobrescrever anteriores.","Os estilos escorrem pela tela de cima para baixo.","As cores devem ser combinadas usando gradientes.","Um elemento não pode receber mais de um estilo."], a:0, tip:"Cascata (Cascade) lida com a ordem e prioridade dos estilos."}
];

let state = load();
let current = null;
let audioCtx = null;
let musicTimer = null;
let currentMusicType = "1";
let staffClicks = 0;

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

function initAudio(){
 try{
  if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==="suspended") audioCtx.resume();
  playMusic();
 }catch(e){}
}

function playMusic() {
  if(musicTimer) clearInterval(musicTimer);
  if(currentMusicType === "0") return;
  
  let notes = [];
  let speed = 400;
  let type = "square";
  
  if(currentMusicType === "1") { notes = [196,247,294,247,220,277,330,277]; speed = 250; type = "square"; }
  if(currentMusicType === "2") { notes = [110,110,146,110, 164,164,146,110]; speed = 400; type = "sawtooth"; }
  if(currentMusicType === "3") { notes = [329, 261, 392, 261, 329, 261, 440, 392]; speed = 300; type = "triangle"; }
  
  let i = 0;
  musicTimer = setInterval(() => {
    tone(notes[i % notes.length], speed/1000 - 0.05, type, 0.03);
    i++;
  }, speed);
}

$("music-select").addEventListener("change", (e) => {
  currentMusicType = e.target.value;
  initAudio();
});

function tone(freq,d=.1,type="sine",vol=.04){
 if(!audioCtx)return;
 const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=audioCtx.currentTime;
 o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);
 g.gain.exponentialRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(g).connect(audioCtx.destination);o.start(t);o.stop(t+d+.03);
}
function clickSound(){tone(600,.05,"sine",.03)}
function rightSound(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.14,"square",.05),i*80))}
function wrongSound(){tone(170,.2,"sawtooth",.04);setTimeout(()=>tone(115,.3,"sawtooth",.04),100)}
function breakSound(){tone(100, .5, "sawtooth", .1); setTimeout(()=>tone(50, .6, "square", .1), 200);}

function shoutPrestige(num) {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(`Prestígioooooooo ${num}!!!!!`);
    msg.lang = 'pt-BR';
    msg.pitch = 1.4;
    msg.rate = 0.9;
    msg.volume = 1;
    window.speechSynthesis.speak(msg);
  }
}

$("staff-trigger").addEventListener("click", () => {
  staffClicks++;
  if(staffClicks >= 5) {
    staffClicks = 0;
    const pwd = prompt("🕵️ STAFF LOGIN. Senha:");
    
    if(pwd && btoa(pwd) === "NjcrNjcpODlub2Vsc2VhbmRlcnI=") {
      const lvl = prompt("Senha correta, Mestre! Qual nível você quer pular? (Digite 30, 60, 90 para testar prestígio):", "30");
      if(lvl) {
        state.done = Array.from({length: Number(lvl)}, (_, i) => i + 1);
        state.prestige = Math.min(5, Math.floor(Number(lvl)/30) + 1);
        save(); update(); renderMap();
        alert(`Conta buffada para nível ${lvl}! Vá completar a última fase para ver a animação.`);
      }
    } else if (pwd !== null) {
      alert("Acesso Negado! Você não é a Staff. 🚫");
    }
  }
});

function show(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 const target=$(id); if(target) target.classList.add("active");
 document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));
 update();
}

function update(){
 $("header-streak").textContent=state.streak;
 $("header-prestige").textContent="Prestígio "+state.prestige;
 $("header-prestige").style.color=COLORS[state.prestige-1];
 const pct=Math.round(state.done.length/TOTAL*100);
 $("progress-percent").textContent=pct+"%";$("dashboard-bar").style.width=pct+"%";
 const grid=$("levels-status-grid");grid.innerHTML="";
 for(let i=1;i<=TOTAL;i++){const d=document.createElement("div");d.textContent=i;if(state.done.includes(i))d.className="done";grid.appendChild(d)}
 renderPrestiges();
}

function maxUnlockedVisible(){ return Math.min(TOTAL,state.prestige*PER_PRESTIGE); }
function unlocked(n){ if(n===1)return true; return state.done.includes(n-1); }

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
  lock.innerHTML="<b>🔒 Próximo prestígio bloqueado</b><p>Conclua o nível "+max+" para destruir a barreira.</p>";
  path.appendChild(lock);
 }
}

function renderPrestiges(){
 const box=$("prestiges-list");box.innerHTML="";
 for(let p=1;p<=5;p++){
  const item=document.createElement("div");item.className="prestige-item";
  const unlockedP=state.prestige>=p;
  item.style.borderColor=unlockedP?COLORS[p-1]:"#ffffff12";
  if(unlockedP) item.style.boxShadow = `0 0 10px ${COLORS[p-1]}33`;
  item.innerHTML=`<h3>${unlockedP?"👑":"🔒"} Prestígio ${p} — ${["Novato","Construtor","Codificador","Mestre CSS","Engenheiro Web"][p-1]}</h3><p>${unlockedP?"Desbloqueado! Você dominou essa área.":"Conclua os níveis "+((p-1)*30+1)+"–"+(p*30)+"."}</p>`;
  box.appendChild(item);
 }
}

function getQuestionObject(n) {
  const realQ = bank.find(x => x.n === n);
  return realQ ? realQ : bank[(n-1)%bank.length];
}

function openLesson(n){
 initAudio();clickSound();
 current={n, q:getQuestionObject(n)};
 $("lesson-badge").textContent="NÍVEL "+n;
 $("lesson-badge").style.background=COLORS[Math.floor((n-1)/30)];
 $("lesson-title").textContent=current.q.title;
 $("lesson-learn").textContent=current.q.learn;
 $("lesson-metaphor").textContent=current.q.metaphor;
 
 if(current.q.img) { $("lesson-img").src = current.q.img; $("lesson-img").classList.remove("hidden"); }
 else { $("lesson-img").classList.add("hidden"); }
 
 show("screen-lesson-intro");
}

function startQuiz(){
 if(!current)return;
 initAudio();clickSound();
 const q=current.q;
 $("question-text").textContent=q.q;
 
 if(q.img) { $("quiz-img").src = q.img; $("quiz-img").classList.remove("hidden"); } else { $("quiz-img").classList.add("hidden"); }
 if(q.video) { $("quiz-video").src = q.video; $("quiz-video").classList.remove("hidden"); $("quiz-video").play(); } else { $("quiz-video").classList.add("hidden"); }
 
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
 $("feedback-title").textContent=correct?"ACERTOU!":"ERRROU!";
 $("feedback-tip").textContent=correct?"Mandou bem! "+current.q.tip:current.q.tip;
 $("next-btn").textContent=correct?"CONTINUAR →":"TENTAR DE NOVO ↻";
 if(correct){
   if(!state.done.includes(current.n)){state.done.push(current.n);state.done.sort((a,b)=>a-b);state.xp+=10;state.streak++}
   save();update();
 }else{state.streak=0;save();update()}
 $("check-btn").disabled=true;
}

function triggerPrestigeAnimation() {
  $("prestige-overlay").classList.remove("hidden");
  $("prestige-icon").style.color = COLORS[state.prestige-1];
  $("prestige-title").textContent = `PRESTÍGIO ${state.prestige} DESBLOQUEADO!`;
  
  document.body.classList.add("shake-screen");
  $("shatter-glass").classList.remove("hidden");
  breakSound();
  setTimeout(()=>shoutPrestige(state.prestige), 300);

  setTimeout(() => {
    document.body.classList.remove("shake-screen");
    $("shatter-glass").classList.add("hidden");
  }, 1000);
}

function next(){
 $("feedback").classList.add("hidden");
 if(!current)return;
 if(!state.done.includes(current.n)){startQuiz();return}
 
 if(current.n%30===0 && current.n/30>=state.prestige){
   state.prestige=Math.min(5,Math.floor(current.n/30)+1);
   save();
   triggerPrestigeAnimation();
   return;
 }
 renderMap();show("screen-map");
}

function reset(){
 if(confirm("Apagar todo o progresso? Você perderá todos os prestígios!")){
  localStorage.removeItem(SAVE_KEY);state={done:[],streak:0,xp:0,prestige:1};renderMap();update();show("screen-map");
 }
}

document.addEventListener("DOMContentLoaded",()=>{
 $("enter-btn").addEventListener("click",()=>{initAudio();clickSound();$("welcome-screen").classList.add("hidden");$("app").classList.remove("hidden");renderMap();update()});
 $("start-quiz-btn").addEventListener("click",startQuiz);
 $("check-btn").addEventListener("click",check);
 $("next-btn").addEventListener("click",next);
 $("abort-btn").addEventListener("click",()=>show("screen-map"));
 $("reset-btn").addEventListener("click",reset);
 $("close-prestige").addEventListener("click",()=>{
   clickSound();
   $("prestige-overlay").classList.add("hidden");
   renderMap();update();show("screen-map");
 });
 document.querySelectorAll(".bottom-nav button").forEach(b=>b.addEventListener("click",()=>{initAudio();show(b.dataset.screen)}));
 document.querySelectorAll('[data-action="home"]').forEach(b=>b.addEventListener("click",()=>{initAudio();show("screen-map")}));
 renderMap();update();
});
})();
