/* The way down to the projects room, at the end of the landing (same idea as the Accountable landing):
     dusk - after the questions the paper fades to night, with a sunset glow, a cheeky sticky note, chevrons that run
            downward and stars that start falling. You see the dark coming before you get there.
     door - a sticky night stage: real project screenshots (from window.LAW7.projects) rise in at different depths as you
            scroll, stars twinkle, drift down and now and then one shoots past, then the words and the one button settle.
     cue  - a "psst" pill that shows up from the apply form on, until the dusk is on screen. Tap = scroll down.
   Scrolling is never taken over and the page never changes by itself: the only ways in are the buttons.
   JS writes --p (0 to 1 through the door) and --copy; CSS does the motion. Defaults show the finished scene. */
(function(){
  "use strict";
  var door=document.getElementById("door"),dusk=document.getElementById("dusk");
  var holder=door&&door.querySelector(".door-cards");
  if(!door||!holder)return;
  var cfg=window.LAW7||{},list=(cfg.projects||[]).filter(function(p){return p.media&&!/\.(mp4|webm)$/i.test(p.media)});
  var phone=window.matchMedia("(max-width:820px)");
  var reduced=window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* where each picture settles (centre, % of the stage), its depth (bigger = travels further = feels closer) and tilt */
  var SPOTS=[{x:17,y:27,z:1.25,r:-6},{x:83,y:25,z:.8,r:5},{x:16,y:73,z:.65,r:4},{x:84,y:72,z:1.45,r:-4}];
  var SPOTS_PHONE=[{x:27,y:17,z:1.2,r:-5},{x:73,y:14,z:.75,r:5},{x:26,y:83,z:.6,r:4},{x:74,y:81,z:1.35,r:-4}];
  var SPARKLE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.9 6.3 5.7 11.1 12 12-6.3.9-11.1 5.7-12 12-.9-6.3-5.7-11.1-12-12C6.3 11.1 11.1 6.3 12 0z" fill="currentColor"/></svg>';
  var COLOURS=["#FFD93D","#FFFFFF","#C3CCEA","#9FB0EA","#FFD9A8"];

  /* ---- the pictures */
  list.slice(0,SPOTS.length).forEach(function(p){
    var fig=document.createElement("figure");fig.className="dc";
    var frame=document.createElement("span");frame.className="dc-frame";if(p.bg)frame.style.setProperty("--bg",p.bg);
    var img=document.createElement("img");img.src=p.media;img.alt="";img.loading="lazy";img.decoding="async";
    frame.appendChild(img);
    var cap=document.createElement("figcaption");cap.textContent=p.name;
    fig.appendChild(frame);fig.appendChild(cap);holder.appendChild(fig);
  });
  function place(){
    var spots=phone.matches?SPOTS_PHONE:SPOTS;
    [].forEach.call(holder.children,function(fig,i){var s=spots[i];
      fig.style.setProperty("--x",s.x+"%");fig.style.setProperty("--y",s.y+"%");fig.style.setProperty("--z",s.z);fig.style.setProperty("--r",s.r+"deg")});
  }
  place();
  if(phone.addEventListener)phone.addEventListener("change",place);

  /* ---- the stars: sparkles and dots; some twinkle in place, most also drift down and fade. A seeded random keeps
     them in the same places on every visit. */
  function seeded(seed){return function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}}
  function scatter(box,count,seed,top,fade){
    var r=seeded(seed);
    for(var i=0;i<count;i++){
      var sparkle=r()<.42,y=top+(fade?Math.sqrt(r()):r())*(100-top);
      var s=document.createElement("span");
      s.className="star"+(sparkle?" sp":"")+(r()<.7?" falls":"");
      s.style.cssText=["--x:"+(r()*100).toFixed(2)+"%","--y:"+y.toFixed(2)+"%","--s:"+(sparkle?10+r()*16:2+r()*3.5).toFixed(1)+"px",
        "--c:"+COLOURS[Math.floor(r()*COLOURS.length)],"--z:"+(.15+r()*.55).toFixed(2),"--t:"+(2.4+r()*3).toFixed(2)+"s",
        "--fall:"+(7+r()*9).toFixed(2)+"s","--d:"+(-r()*12).toFixed(2)+"s"].join(";");
      s.innerHTML=sparkle?"<i>"+SPARKLE+"</i>":"<i></i>";
      box.appendChild(s);
    }
  }
  var sky=door.querySelector(".door-stars");
  scatter(sky,phone.matches?26:46,7,0,false);
  if(!reduced)for(var k=0;k<3;k++){var sh=document.createElement("span");sh.className="shoot";
    sh.style.cssText="--x:"+[18,62,38][k]+"%;--y:"+[4,10,30][k]+"%;--d:"+(k*3.7+1.5)+"s";sky.appendChild(sh)}
  var ds=dusk&&dusk.querySelector(".dusk-stars");
  if(ds)scatter(ds,phone.matches?14:26,21,35,true);

  /* ---- the "psst" pill */
  var cue=document.createElement("button");cue.type="button";cue.className="door-cue";
  cue.innerHTML="psst… there's another room down here <span aria-hidden=\"true\">↓</span>";
  cue.addEventListener("click",function(){window.scrollTo({top:door.offsetTop+door.offsetHeight-innerHeight,behavior:reduced?"auto":"smooth"})});
  document.body.appendChild(cue);

  function clamp(v){return Math.min(1,Math.max(0,v))}
  function ease(t){return 1-Math.pow(1-t,3)}
  function paint(p){door.style.setProperty("--p",ease(p).toFixed(4));door.style.setProperty("--copy",ease(clamp((p-.5)/.3)).toFixed(4))}

  /* ?door=0.6 shows only the door, frozen at 60%, so a frame can be checked or screenshotted */
  var frozen=new URLSearchParams(location.search).get("door");
  if(frozen!==null){
    paint(clamp(Number(frozen)||0));document.body.insertBefore(door,document.body.firstChild);door.style.height="100vh";
    [].forEach.call(document.body.children,function(el){if(el!==door)el.style.display="none"});
    return;
  }

  var raf=0;
  function frame(){
    raf=0;
    var r=door.getBoundingClientRect();
    /* 0 when the door's top comes up from the bottom of the screen, 1 when its end reaches the bottom */
    if(!reduced)paint(clamp((innerHeight-r.top)/r.height));
    var apply=document.getElementById("apply");
    var near=apply?apply.getBoundingClientRect().top<innerHeight*.3:true;
    var duskTop=dusk?dusk.getBoundingClientRect().top:r.top;
    cue.classList.toggle("show",near&&duskTop>innerHeight*.6);
  }
  function ask(){if(!raf)raf=requestAnimationFrame(frame)}
  addEventListener("scroll",ask,{passive:true});addEventListener("resize",ask);
  frame();
})();
