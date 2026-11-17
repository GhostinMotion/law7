(function(){
  var cfg=window.LAW7||{},reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* tester spots */
  var total=cfg.slotsTotal||10,taken=Math.max(0,Math.min(total,cfg.slotsTaken||0)),open=total-taken;
  $$("[data-dots]").forEach(function(d){for(var i=0;i<total;i++){var s=document.createElement("i");if(i<taken)s.className="on";d.appendChild(s)}});
  var st=$("[data-slots-text]");if(st)st.textContent=open>0?("Only "+total+" testers. "+open+" "+(open===1?"spot":"spots")+" open."):"All "+total+" spots are taken. Apply to join the waiting list.";
  var ot=$("[data-open-text]");if(ot)ot.textContent=open>0?(open+" of "+total+" spots open"):"All "+total+" spots are taken";
  $$("[data-board]").forEach(function(a){a.href=cfg.boardUrl||"#";a.target="_blank";a.rel="noopener"});

  /* top bar */
  var bar=$("#bar"),cue=$(".cue");
  /* phone / tablet menu */
  var mb=$("#menuB"),mp=$("#menuP");
  if(mb&&mp){
    var shut=function(){mp.hidden=true;mb.setAttribute("aria-expanded","false")};
    mb.addEventListener("click",function(){var o=mp.hidden;mp.hidden=!o;mb.setAttribute("aria-expanded",o?"true":"false")});
    mp.addEventListener("click",function(e){if(e.target.closest("a"))shut()});
    document.addEventListener("keydown",function(e){if(e.key==="Escape")shut()});
    document.addEventListener("pointerdown",function(e){if(!mp.hidden&&!e.target.closest("#menuP,#menuB"))shut()});
    window.addEventListener("resize",function(){if(window.innerWidth>1020)shut()});
  }
  /* drifting paper + parallax objects */
  var grid=$("#paperGrid"),floats=$$("[data-depth]"),hero=$(".hero"),ticking=false;
  function parallax(){
    ticking=false;var y=window.scrollY||0,vh=window.innerHeight;
    bar.classList.toggle("solid",y>12);
    if(cue)cue.classList.toggle("gone",y>60);
    if(reduce)return;
    grid.style.transform="translate3d(0,"+(-(y*.22)%40).toFixed(1)+"px,0)";
    floats.forEach(function(el){
      var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;
      var d=parseFloat(el.getAttribute("data-depth"))||0,mid=r.top+r.height/2-vh/2;
      var rot=el.style.transform.match(/rotate\([^)]*\)/);var rt=el.dataset.rot||(rot?rot[0]:"");el.dataset.rot=rt;
      var dy;
      if(el.classList.contains("float")){
        /* hero objects start exactly where they were drawn and drift a little as you scroll away. On phones and tablets (any size, either way up) they stay glued to the page, so nothing slides off it */
        dy=(window.innerWidth<=1100||(window.matchMedia&&matchMedia("(hover:none)").matches))?0:-y*d;
      }else dy=-mid*d;
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
  /* the big SCROLL word covers the picture until the first scroll, click or Play */
  var stage=$(".stage",pin),touched=false;
  function paintGuide(){if(P>.03&&!touched){touched=true;stage.classList.add("go")}}
  function show(p){P=Math.max(0,Math.min(5,p));demo.render(P);scrub.value=P;paintGuide()}
  function pinned(){return !reduce&&getComputedStyle($(".pin-stick",pin)).position==="sticky"}
  /* the page scroll sets a target, and the picture eases towards it: a wheel click or a flick never makes the scene jump */
  var target=0,ez=0,ezLast=0;
  function ease(t){
    ez=0;var dt=Math.min(.05,(t-ezLast)/1000);ezLast=t;if(drive)return;
    var d=target-P;if(Math.abs(d)<.0015){show(target);return}
    show(P+d*(1-Math.exp(-dt*11)));ez=requestAnimationFrame(ease);
  }
  function fromScroll(now){
    if(!pinned()||drive)return;var r=range();target=Math.max(0,Math.min(5,((window.scrollY||0)-r.top)/r.len*5));
    if(now===true){show(target);return}
    if(!ez){ezLast=performance.now();ez=requestAnimationFrame(ease)}
  }
  window.addEventListener("scroll",function(){fromScroll()},{passive:true});window.addEventListener("resize",function(){fromScroll(true)});
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
  ["wheel","touchstart","keydown"].forEach(function(ev){window.addEventListener(ev,function(){endGlide();stop();drive=false},{passive:true})});
  bPlay.addEventListener("click",function(){
    if(playing){setPlaying(false);return}
    if(P>=4.99){show(0)}
    touched=true;stage.classList.add("go");setPlaying(true);
  });
  scrub.addEventListener("input",function(){setPlaying(false);touched=true;stage.classList.add("go");goto(parseFloat(scrub.value),false)});
  fromScroll(true);

  /* apply form */
  var form=$("#applyForm"),msg=$("#formMsg"),btn=$("#sendBtn");
  function esc(s){return String(s).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}
  var cIn=$("#contactIn"),spam=$("#spamNote"),nc=$("#noContact"),wr=$("#whereRow"),wi=$("#whereIn");
  var isMail=function(v){return /^\S+@\S+\.\S+$/.test(String(v||"").trim())};
  function syncContact(){
    var none=nc.checked;cIn.required=!none;cIn.disabled=none;wr.hidden=!none;
    spam.hidden=none||!isMail(cIn.value);
  }
  cIn.addEventListener("input",syncContact);nc.addEventListener("change",syncContact);syncContact();
  var SPAM='<div class="spamnote"><strong>Check your spam or junk folder.</strong> My reply can land there. If you see it, press “Not spam”.</div>';
  form.addEventListener("submit",function(e){
    e.preventDefault();var f=new FormData(form),name=(f.get("name")||"").trim(),contact=(f.get("contact")||"").trim();
    if(nc.checked)contact="None: you already have my contact"+((wi.value||"").trim()?" ("+wi.value.trim()+")":"");
    if(!name||!contact){msg.innerHTML='<div class="msg warn">Add your first name and how we can reach you.</div>';return}
    var lines=["Law7 tester application","Name: "+name,"Reach me at: "+contact,"I study: "+(f.get("study")||"").trim(),"Device: "+f.get("device"),"I'd use it for: "+(f.get("why")||"").trim()],text=lines.join("\n");
    var ap=cfg.apply||{};
    if(ap.emailjs&&ap.emailjs.key&&ap.emailjs.service&&ap.emailjs.notify){
      btn.disabled=true;var ej=ap.emailjs;
      var send=function(tpl,extra){var pr={name:name,contact:contact,study:f.get("study")||"",device:f.get("device")||"",why:f.get("why")||"",message:text};for(var k in extra)pr[k]=extra[k];
        return fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:ej.service,template_id:tpl,user_id:ej.key,template_params:pr})}).then(function(r){if(!r.ok)throw 0})};
      var jobs=[send(ej.notify,{})];
      if(ej.reply&&/^\S+@\S+\.\S+$/.test(contact))jobs.push(send(ej.reply,{to_email:contact}).catch(function(){}));
      Promise.all(jobs).then(function(){msg.innerHTML='<div class="msg ok">Thanks, '+esc(name)+'. '+(jobs.length>1?"A confirmation is on its way to your email. ":"")+'I read every application and will reply if there is a spot.'+(jobs.length>1?SPAM:"")+'</div>';form.reset();syncContact()})
        .catch(function(){msg.innerHTML='<div class="msg warn">That did not send. Check your connection and try again.</div>'})
        .then(function(){btn.disabled=false});
    }else if(ap.formEndpoint){
      btn.disabled=true;
      fetch(ap.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({name:name,contact:contact,study:f.get("study"),device:f.get("device"),why:f.get("why"),message:text})})
        .then(function(r){if(!r.ok)throw 0;msg.innerHTML='<div class="msg ok">Thanks, '+esc(name)+'. I read every application and will reply if there is a spot.</div>';form.reset()})
        .catch(function(){msg.innerHTML='<div class="msg warn">That did not send. Check your connection and try again.</div>'})
        .then(function(){btn.disabled=false});
    }else if(ap.email){
      location.href="mailto:"+ap.email+"?subject="+encodeURIComponent("Law7 tester application")+"&body="+encodeURIComponent(text);
      msg.innerHTML='<div class="msg ok">Your mail app should open with your answers filled in. Press send there to finish.</div>';
    }else{
      var done=function(ok){msg.innerHTML='<div class="msg ok">'+(ok?"Copied. ":"")+'Send this message to the person who shared this page:<pre>'+esc(text)+'</pre></div>'};
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(function(){done(true)},function(){done(false)});else done(false);
    }
  });
})();
