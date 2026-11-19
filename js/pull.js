/* The resistant "pull" between Law7 and the other-projects room.
   Landing: keep scrolling down at the very bottom -> the night room rises, drags, then POPs in.
   Projects: keep scrolling up at the very top -> same pull back to Law7.
   The normal links still work; this is only an extra. */
(function(){
  var onProj=document.body.classList.contains("pj");
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  var T=onProj?"index.html":"projects.html",FLAG="law7pull";

  /* ---- arriving: pop into the new page ---- */
  var arrived=null;try{arrived=sessionStorage.getItem(FLAG);sessionStorage.removeItem(FLAG)}catch(e){}
  if(arrived&&!reduce){
    var c=document.createElement("div");c.className="pullcurtain "+(onProj?"night":"paper");document.body.appendChild(c);
    document.documentElement.classList.add("popin");
    if(!onProj&&arrived==="back"){
      var jump=function(){var d=document.querySelector(".door");if(d)d.scrollIntoView({block:"end",behavior:"instant"})};
      jump();addEventListener("load",jump);setTimeout(jump,300);
    }
    requestAnimationFrame(function(){requestAnimationFrame(function(){c.classList.add("go")})});
    setTimeout(function(){c.remove();document.documentElement.classList.remove("popin")},900);
  }
  var lock=!!arrived&&!reduce;if(lock)setTimeout(function(){lock=false},800);   /* swallow leftover trackpad momentum */
  if(reduce)return;

  /* ---- the pull panel ---- */
  var p=document.createElement("div");
  p.className="pullpanel "+(onProj?"top paper":"bottom night");p.setAttribute("aria-hidden","true");
  p.innerHTML='<div class="pp-in"><span class="pp-arr">'+(onProj?"↑":"↓")+'</span><b>'+(onProj?"Scroll up to go back to Law7":"Scroll to see my other projects")+'</b></div>';
  document.body.appendChild(p);

  var NEED=380,DRAG=0.42,pull=0,idle=0,busy=false,since=0;
  function atEdge(){
    var y=window.pageYOffset,h=document.documentElement.scrollHeight-innerHeight;
    return onProj?y<=0:y>=h-2;
  }
  setInterval(function(){ /* only count as "at the edge" once the page has rested there a moment */
    if(atEdge()){if(!since)since=Date.now()}else since=0;
  },60);
  function ready(){return !busy&&since&&Date.now()-since>350}
  function draw(){
    var f=Math.min(1,pull/NEED),shown=f*f*(3-2*f)*innerHeight*DRAG;   /* eases in: stiff at first, then it gives */
    p.style.setProperty("--h",shown+"px");p.classList.toggle("on",f>0.02);p.classList.toggle("near",f>0.8);
  }
  function release(){pull=0;p.classList.add("back");draw();setTimeout(function(){p.classList.remove("back")},380)}
  function pop(){
    busy=true;p.classList.add("pop");
    try{sessionStorage.setItem(FLAG,onProj?"back":"in")}catch(e){}
    setTimeout(function(){location.href=T},onProj?260:260);
  }
  function add(d){
    if(busy)return;
    pull=Math.max(0,pull+d*0.55);draw();
    clearTimeout(idle);idle=setTimeout(release,240);
    if(pull>=NEED){clearTimeout(idle);pop()}
  }
  addEventListener("wheel",function(e){
    if(lock){if(onProj)e.preventDefault();return}
    if(e.ctrlKey||busy)return;
    var toward=onProj?e.deltaY<0:e.deltaY>0;
    if(pull>0&&!toward){add(-Math.abs(e.deltaY)*1.5);return}
    if(toward&&ready()){add(Math.abs(e.deltaY));e.preventDefault()}
  },{passive:false});

  /* touch: drag the page past its end */
  var y0=null;
  addEventListener("touchstart",function(e){y0=e.touches[0].clientY},{passive:true});
  addEventListener("touchmove",function(e){
    if(lock){e.preventDefault();return}
    if(y0===null||busy)return;
    var y=e.touches[0].clientY,d=y0-y;y0=y;
    var toward=onProj?d<0:d>0;
    if(pull>0&&!toward){add(-Math.abs(d)*2);e.preventDefault();return}
    if(toward&&ready()){add(Math.abs(d)*2.2);e.preventDefault()}
  },{passive:false});
  addEventListener("touchend",function(){y0=null;if(!busy&&pull>0){clearTimeout(idle);release()}},{passive:true});
})();
