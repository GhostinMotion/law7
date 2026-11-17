(function(){
  var cfg=window.INKBOARD||{},reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* tester spots */
  var total=cfg.slotsTotal||10,taken=Math.max(0,Math.min(total,cfg.slotsTaken||0)),open=total-taken;
  $$("[data-dots]").forEach(function(d){for(var i=0;i<total;i++){var s=document.createElement("i");if(i<taken)s.className="on";d.appendChild(s)}});
  var st=$("[data-slots-text]");if(st)st.textContent=open>0?("Only "+total+" testers. "+open+" "+(open===1?"spot":"spots")+" open."):"All "+total+" spots are taken. Apply to join the waiting list.";
  var ot=$("[data-open-text]");if(ot)ot.textContent=open>0?(open+" of "+total+" spots open"):"All "+total+" spots are taken";
  $$("[data-board]").forEach(function(a){a.href=cfg.boardUrl||"#";a.target="_blank";a.rel="noopener"});

  /* top bar */
  var bar=$("#bar");
  /* drifting paper + parallax objects */
  var grid=$("#paperGrid"),floats=$$("[data-depth]"),hero=$(".hero"),ticking=false;
  function parallax(){
    ticking=false;var y=window.scrollY||0,vh=window.innerHeight;
    bar.classList.toggle("solid",y>12);
    if(reduce)return;
    grid.style.transform="translate3d(0,"+(-(y*.22)%40).toFixed(1)+"px,0)";
    floats.forEach(function(el){
      var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;
      var d=parseFloat(el.getAttribute("data-depth"))||0,mid=r.top+r.height/2-vh/2;
      var rot=el.style.transform.match(/rotate\([^)]*\)/);var rt=el.dataset.rot||(rot?rot[0]:"");el.dataset.rot=rt;
      var dy=el.classList.contains("float")?-y*d:-mid*d;   /* hero objects start exactly where they were drawn, the rest are level when centred on screen */
      el.style.transform="translate3d(0,"+dy.toFixed(1)+"px,0) "+rt;
    });
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(parallax)}}
  window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);parallax();

  /* the pinned walkthrough */
  var pin=$("#watch"),demo=window.InkDemo,P=0,playing=false,raf=0,last=0,drive=false;
  if(reduce)document.documentElement.classList.add("no-pin");
  var scrub=$("#scrub"),bPlay=$("#bPlay"),icoPlay=$("#icoPlay"),icoPause=$("#icoPause");
  function range(){var top=pin.getBoundingClientRect().top+(window.scrollY||0);return {top:top,len:pin.offsetHeight-window.innerHeight}}
  function show(p){P=Math.max(0,Math.min(5,p));demo.render(P);scrub.value=P}
  function pinned(){return !reduce&&getComputedStyle($(".pin-stick",pin)).position==="sticky"}
  function fromScroll(){if(!pinned()||drive)return;var r=range(),p=((window.scrollY||0)-r.top)/r.len*5;show(p)}
  window.addEventListener("scroll",fromScroll,{passive:true});window.addEventListener("resize",fromScroll);
  var gl=0;
  function syncScroll(p){if(pinned()){var r=range();window.scrollTo({top:r.top+r.len*p/5,behavior:"auto"})}}
  function endGlide(){cancelAnimationFrame(gl);gl=0}
  /* glide: our own easing from the current spot to p, then the page scroll is set once at the end */
  function goto(p,smooth){
    p=Math.max(0,Math.min(5,p));endGlide();
    if(!smooth||reduce){show(p);syncScroll(p);return}
    var from=P,t0=performance.now(),dur=Math.max(350,Math.min(900,Math.abs(p-from)*520));drive=true;
    (function step(t){var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);show(from+(p-from)*e);
      if(k<1){gl=requestAnimationFrame(step)}else{gl=0;syncScroll(p);setTimeout(function(){if(!playing&&!gl)drive=false},120)}})(t0);
  }
  function setPlaying(v){
    playing=v;icoPlay.hidden=v;icoPause.hidden=!v;bPlay.setAttribute("aria-label",v?"Pause":(P>=5?"Replay":"Play"));
    cancelAnimationFrame(raf);if(v){endGlide();drive=true}else{syncScroll(P);setTimeout(function(){if(!playing&&!gl)drive=false},120)}
    if(v){last=performance.now();raf=requestAnimationFrame(tick)}
  }
  /* playing never touches the page scroll, so nothing else is competing for the frame */
  function tick(t){
    var dt=Math.min(.05,(t-last)/1000);last=t;
    var np=P+dt/2.4;
    if(np>=5){show(5);setPlaying(false);return}
    show(np);raf=requestAnimationFrame(tick);
  }
  function stop(){if(playing)setPlaying(false)}
  ["wheel","touchstart","keydown"].forEach(function(ev){window.addEventListener(ev,function(){endGlide();stop()},{passive:true})});
  bPlay.addEventListener("click",function(){
    if(playing){setPlaying(false);return}
    if(P>=4.99){show(0)}
    setPlaying(true);
  });
  $("#bReset").addEventListener("click",function(){setPlaying(false);goto(0,true)});
  $("#bBack").addEventListener("click",function(){setPlaying(false);goto(Math.max(0,Math.ceil(P-.001)-1),true)});
  $("#bFwd").addEventListener("click",function(){setPlaying(false);goto(Math.min(5,Math.floor(P+.001)+1),true)});
  scrub.addEventListener("input",function(){setPlaying(false);goto(parseFloat(scrub.value),false)});
  fromScroll();

  /* apply form */
  var form=$("#applyForm"),msg=$("#formMsg"),btn=$("#sendBtn");
  function esc(s){return String(s).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}
  form.addEventListener("submit",function(e){
    e.preventDefault();var f=new FormData(form),name=(f.get("name")||"").trim(),contact=(f.get("contact")||"").trim();
    if(!name||!contact){msg.innerHTML='<div class="msg warn">Add your first name and how we can reach you.</div>';return}
    var lines=["Ink Board tester application","Name: "+name,"Reach me at: "+contact,"I study: "+(f.get("study")||"").trim(),"Device: "+f.get("device"),"I'd use it for: "+(f.get("why")||"").trim()],text=lines.join("\n");
    var ap=cfg.apply||{};
    if(ap.formEndpoint){
      btn.disabled=true;
      fetch(ap.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({name:name,contact:contact,study:f.get("study"),device:f.get("device"),why:f.get("why"),message:text})})
        .then(function(r){if(!r.ok)throw 0;msg.innerHTML='<div class="msg ok">Thanks, '+esc(name)+'. We read every application and will reply if there is a spot.</div>';form.reset()})
        .catch(function(){msg.innerHTML='<div class="msg warn">That did not send. Check your connection and try again.</div>'})
        .then(function(){btn.disabled=false});
    }else if(ap.email){
      location.href="mailto:"+ap.email+"?subject="+encodeURIComponent("Ink Board tester application")+"&body="+encodeURIComponent(text);
      msg.innerHTML='<div class="msg ok">Your mail app should open with your answers filled in. Press send there to finish.</div>';
    }else{
      var done=function(ok){msg.innerHTML='<div class="msg ok">'+(ok?"Copied. ":"")+'Send this message to the person who shared this page:<pre>'+esc(text)+'</pre></div>'};
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(function(){done(true)},function(){done(false)});else done(false);
    }
  });
})();
