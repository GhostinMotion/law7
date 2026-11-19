/* The stretchy pull between Law7 and the other-projects room.
   Landing: at the very bottom, keep scrolling down: the page stretches up, the night room bulges in, then POPs.
   Projects: at the very top, keep scrolling up: same thing back to Law7.
   A small pill tells you it's there, and it is also a normal link. */
(function(){
  var onProj=document.body.classList.contains("pj");
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  var T=onProj?"index.html":"projects.html",FLAG="law7pull",root=document.documentElement;

  /* ---- arriving: pop into the new page ---- */
  var arrived=null;try{arrived=sessionStorage.getItem(FLAG);sessionStorage.removeItem(FLAG)}catch(e){}
  if(arrived&&!reduce){
    var c=document.createElement("div");c.className="pullcurtain "+(onProj?"night":"paper");document.body.appendChild(c);
    root.classList.add("popin");
    if(!onProj&&arrived==="back"){
      var jump=function(){var d=document.querySelector(".door");if(d)d.scrollIntoView({block:"end",behavior:"instant"})};
      jump();addEventListener("load",jump);setTimeout(jump,300);
    }
    requestAnimationFrame(function(){requestAnimationFrame(function(){c.classList.add("go")})});
    setTimeout(function(){c.remove();root.classList.remove("popin")},900);
  }

  /* ---- the pill that says "keep scrolling" (always there, also a link) ---- */
  var cue=document.createElement("a");
  cue.className="pullcue "+(onProj?"up":"down");cue.href=T;
  cue.innerHTML=onProj?'<span class="pc-a">↑</span>Scroll up to go back to Law7':'Scroll to see my other projects<span class="pc-a">↓</span>';
  document.body.appendChild(cue);
  function nearEdge(){
    var y=window.pageYOffset,h=root.scrollHeight-innerHeight;
    return onProj?y<90:y>h-260;
  }
  function showCue(){cue.classList.toggle("show",nearEdge()&&!busy&&pull===0)}
  addEventListener("scroll",showCue,{passive:true});addEventListener("resize",showCue);

  if(reduce){showCue();return}

  /* ---- the stretch ---- */
  var p=document.createElement("div");
  p.className="pullpanel "+(onProj?"top paper":"bottom night");p.setAttribute("aria-hidden","true");
  p.innerHTML='<div class="pp-in"><span class="pp-arr">'+(onProj?"↑":"↓")+'</span><b>'+(onProj?"Keep going to head back to Law7":"Keep going to see my other projects")+'</b></div>';
  document.body.appendChild(p);

  var NEED=240,pull=0,idle=0,busy=false,since=0,lock=!!arrived;
  if(lock)setTimeout(function(){lock=false},800);
  function atEdge(){
    var y=window.pageYOffset,h=root.scrollHeight-innerHeight;
    return onProj?y<=0:y>=h-2;
  }
  setInterval(function(){if(atEdge()){if(!since)since=Date.now()}else since=0},50);
  function ready(){return !busy&&since&&Date.now()-since>150}
  function draw(){
    var f=Math.min(1,pull/NEED);
    var shown=(1-Math.pow(1-f,1.6))*innerHeight*0.46;          /* rubber band: gives a lot at first, then tightens */
    root.style.setProperty("--pull",shown+"px");root.style.setProperty("--ps",(shown/innerHeight).toFixed(4));
    root.classList.toggle("pulling",f>0.01);
    p.classList.toggle("on",f>0.01);p.classList.toggle("near",f>0.75);
    showCue();
  }
  function release(){pull=0;root.classList.add("snap");p.classList.add("back");draw();setTimeout(function(){p.classList.remove("back");root.classList.remove("snap")},520)}
  function pop(){
    busy=true;p.classList.add("pop");root.classList.add("popping");
    try{sessionStorage.setItem(FLAG,onProj?"back":"in")}catch(e){}
    setTimeout(function(){location.href=T},280);
  }
  function add(d){
    if(busy)return;
    pull=Math.max(0,pull+d);draw();
    clearTimeout(idle);idle=setTimeout(release,260);
    if(pull>=NEED){clearTimeout(idle);pop()}
  }
  addEventListener("wheel",function(e){
    if(e.ctrlKey)return;
    if(lock||busy){if(onProj&&lock)e.preventDefault();return}
    var toward=onProj?e.deltaY<0:e.deltaY>0;
    if(pull>0&&!toward){add(-Math.abs(e.deltaY)*1.5);e.preventDefault();return}
    if(toward&&ready()){add(Math.abs(e.deltaY));e.preventDefault()}
  },{passive:false});

  var y0=null;
  addEventListener("touchstart",function(e){y0=e.touches[0].clientY},{passive:true});
  addEventListener("touchmove",function(e){
    if(lock){e.preventDefault();return}
    if(y0===null||busy)return;
    var y=e.touches[0].clientY,d=y0-y;y0=y;
    var toward=onProj?d<0:d>0;
    if(pull>0&&!toward){add(-Math.abs(d)*2);e.preventDefault();return}
    if(toward&&ready()){add(Math.abs(d)*1.6);e.preventDefault()}
  },{passive:false});
  addEventListener("touchend",function(){y0=null;if(!busy&&pull>0){clearTimeout(idle);release()}},{passive:true});
  showCue();
})();
