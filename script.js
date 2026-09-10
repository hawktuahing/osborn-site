const pg=document.getElementById("pg");
/* reveal on enter */
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in")}else if(e.intersectionRatio<0.05){e.target.classList.remove("in")}})},{threshold:[0,.05,.35]});
document.querySelectorAll(".sec,.footer").forEach(el=>io.observe(el));
/* parallax figures */
const pxEls=[...document.querySelectorAll('.sec.photo .bg')];
function parallax(){const vh=innerHeight;for(const el of pxEls){const r=el.parentElement.getBoundingClientRect();const rel=((r.top+r.height/2)-vh/2)/vh;const zoom=(1.14-Math.min(Math.abs(rel),1)*0.12).toFixed(3);el.style.transform='translateY('+(rel*-38).toFixed(1)+'px) scale('+zoom+')';}}
/* wave-bar bump + progress */
const N=64, wave=document.getElementById("wave"), bars=[];
for(let i=0;i<N;i++){const b=document.createElement("div");b.className="bar";b.style.height="10px";wave.appendChild(b);bars.push(b);}
let prog=0, cur=0;
function updateProgress(){const h=document.documentElement.scrollHeight-innerHeight;prog=h>0?scrollY/h:0;pg.style.width=(prog*100)+"%";}
const SIG=6;
const darkEls=()=>[...document.querySelectorAll(".sec.quote,.footer,.disc")];
let _dk=darkEls();
function updWaveTheme(){const y=innerHeight-60;let dark=false;for(const el of _dk){const r=el.getBoundingClientRect();if(r.top<=y&&r.bottom>=y){dark=true;break;}}wave.classList.toggle("dark",dark);}
addEventListener("resize",()=>{_dk=darkEls();});
function waveTick(){cur+=(prog-cur)*0.14;const p=cur*(N-1),filled=Math.round(p);for(let i=0;i<N;i++){const d=i-p;const bump=Math.exp(-(d*d)/(2*SIG*SIG));bars[i].style.height=(10+bump*46).toFixed(1)+"px";if(i<=filled)bars[i].classList.add("on");else bars[i].classList.remove("on");}updWaveTheme();requestAnimationFrame(waveTick);}
requestAnimationFrame(waveTick);
function onScrollFrame(){updateProgress();parallax();}
/* ---- inline smooth inertia scroll (self-contained) ---- */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const maxY=()=>document.documentElement.scrollHeight-innerHeight;
let target=scrollY,current=scrollY,running=false,self=false;
const LERP=0.09;
function loop(){
  current+=(target-current)*LERP;
  if(Math.abs(target-current)<0.4){current=target;running=false;}
  self=true;scrollTo({top:current,behavior:'instant'});self=false;
  onScrollFrame();
  if(running)requestAnimationFrame(loop);
}
function kick(){if(!running){running=true;requestAnimationFrame(loop);}}
if(!reduce){
  addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();target=Math.max(0,Math.min(target+e.deltaY,maxY()));kick();},{passive:false});
  addEventListener('keydown',e=>{const k=e.key,st=innerHeight;let d=0;
    if(k==='PageDown'||k===' ')d=st*0.9;else if(k==='PageUp')d=-st*0.9;else if(k==='ArrowDown')d=110;else if(k==='ArrowUp')d=-110;else if(k==='Home')d=-1e9;else if(k==='End')d=1e9;else return;
    e.preventDefault();target=Math.max(0,Math.min(target+d,maxY()));kick();});
  addEventListener('scroll',()=>{if(!self&&!running){target=current=scrollY;}onScrollFrame();},{passive:true});
}else{addEventListener('scroll',onScrollFrame,{passive:true});}
addEventListener('resize',()=>{target=Math.min(target,maxY());onScrollFrame();});
onScrollFrame();

/* ===== part ===== */

(function(){
  const disc=document.getElementById("disc"),bar=disc.querySelector(".disc-bar"),
        panel=document.getElementById("discPanel"),inner=panel.firstElementChild;
  let isOpen=false, openPoint=0;
  function setOpen(v){
    if(v===isOpen)return; isOpen=v; disc.classList.toggle("open",v);
    if(v){ panel.style.height=inner.offsetHeight+"px";
      const te=()=>{if(isOpen)panel.style.height="auto";panel.removeEventListener("transitionend",te);};
      panel.addEventListener("transitionend",te);
    } else { panel.style.height=inner.offsetHeight+"px";
      requestAnimationFrame(()=>requestAnimationFrame(()=>{panel.style.height="0px";})); }
  }
  function calc(){ // bar's document-top is stable (panel expands below it)
    openPoint = (bar.getBoundingClientRect().top + scrollY) - innerHeight*0.55;
  }
  function check(){ setOpen(scrollY > openPoint); }
  addEventListener("scroll",check,{passive:true});
  addEventListener("resize",()=>{calc();check();});
  addEventListener("load",()=>{calc();check();});
  calc(); check();
})();

/* ===== preloader / intro ===== */
(function(){
  var pre=document.getElementById("pre"),vid=pre?document.getElementById("introVid"):null,skip=document.getElementById("skip");
  if(!pre){return;}
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen=false; try{seen=sessionStorage.getItem("introSeen")==="1";}catch(e){}
  function revealNow(){document.body.classList.remove("preloading");document.body.classList.add("revealed");}
  if(reduce||seen){ pre.remove(); if(skip)skip.remove(); revealNow(); return; }
  var done=false;
  function finish(){ if(done)return; done=true;
    pre.classList.add("done"); revealNow();
    try{sessionStorage.setItem("introSeen","1");}catch(e){}
    if(skip)skip.remove();
    setTimeout(function(){ if(pre&&pre.parentNode){ if(vid){vid.pause();vid.removeAttribute("src");try{vid.load();}catch(e){}} pre.remove(); } },800);
  }
  if(vid){
    var started=false;
    vid.addEventListener("playing",function(){started=true;});
    vid.addEventListener("ended",finish);
    vid.addEventListener("error",finish);
    var src=vid.querySelector("source"); if(src)src.addEventListener("error",finish);
    var pr=vid.play(); if(pr&&pr.catch)pr.catch(function(){});
    setTimeout(function(){ if(!started) finish(); },4000); // no/slow/blocked video -> reveal
  } else { finish(); }
  if(skip)skip.addEventListener("click",finish);
  addEventListener("keydown",function(e){if(e.key==="Escape")finish();});
  setTimeout(finish,15000); // hard safety
})();
