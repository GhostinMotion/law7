/* The tools grid and its popups. Each tool is one object below: change the words here, not in the HTML.
   "video" tools play a short recording of the real board. "scene" tools play one of the hand-drawn pages from js/showcase.js. */
(function(){
  var g=document.getElementById("tiles"),dlg=document.getElementById("toolDlg");if(!g||!dlg)return;
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var T=[
    {id:"periodic",t:"Periodic table",s:"All 118 elements. Search, tap, colour by type or state.",tint:"#E7E0FF",video:"assets/shots/periodic",
     lead:"Every element one tap away. Search by name, symbol or number and the rest of the table fades out.",
     can:["Find an element by name, symbol or atomic number","See its mass, electron configuration, electronegativity, oxidation states, melting and boiling point","Colour the table by type, or by state at room temperature","Put the table on your page with your picked elements highlighted"],
     atlas:"Atlas looks element numbers up here too, so it never has to remember an atomic mass."},
    {id:"calc",t:"Scientific calculator",s:"Brackets, powers, sin, log. It never leaves the board.",tint:"#DCE5FF",video:"assets/shots/calculator",
     lead:"A proper scientific calculator, one tap from your page. The answer updates as you type.",
     can:["Brackets, powers, roots, factorial and percent","sin, cos, tan and their inverses, plus ln and log","Degrees or radians, and Ans to reuse your last answer","Write the result straight onto your page"],
     atlas:"Atlas checks its own arithmetic with a calculator too, instead of doing sums in its head."},
    {id:"lookup",t:"Chemistry lookups",s:"Molar mass and percent composition, calculated, not guessed.",tint:"#D4F4EC",scene:"lookup",
     lead:"Ask Atlas for a molar mass or a percent composition and it works it out from verified element data.",
     can:["Molar mass of any formula, brackets included","What each element contributes","Percent composition","Atomic mass, configuration, electronegativity and states"],
     atlas:"It never guesses an atomic mass. Every mole, mass and percentage question uses these numbers."},
    {id:"draw",t:"Graphs and diagrams",s:"Atlas draws them on your page, then checks them.",tint:"#FFF3A8",scene:"draw",
     lead:"Ask for a picture and Atlas draws it by hand next to your notes.",
     can:["Flowcharts, force diagrams, cells and labelled pictures","Graphs of functions, plotted on your page","A worked solution, written step by step","A method animated step by step, so you can follow it"],
     atlas:"After it draws, Atlas looks at the board and fixes anything that overlaps. You can move, erase or write over everything it draws."},
    {id:"pages",t:"Worksheets and study packs",s:"Write on your real PDFs and photos. Export to PDF.",tint:"#FFD9E2",scene:"pages",
     lead:"Bring your real homework in and write on it.",
     can:["Open a PDF or a past paper: every page is a page you can write on","Paste a screenshot or add a photo of a worksheet","Drop in a study pack and each question becomes its own page","Folders keep each subject apart","Export the pages you pick as one PDF with bookmarks"],
     atlas:"Atlas sees the page and your writing together, so it can answer about the exact question you're on."},
    {id:"together",t:"Study together",s:"Two people, one page, Atlas helping both.",tint:"#FFE9C7",scene:"together",
     lead:"Study with a friend on the same page, with Atlas helping both of you.",
     can:["Write on the same page together","See each other's writing appear","Ask Atlas on the shared page","I link the two of you up myself"],
     atlas:"It already works, but I switch it on by hand. Ask me and tell me who you want to study with."}
  ];
  var cur=0,raf=0,tl=0;
  var ICON={periodic:"▦",calc:"＝",lookup:"⚗",draw:"✎",pages:"▤",together:"⇄"};

  /* ---------- the grid ---------- */
  T.forEach(function(t,i){
    var b=document.createElement("button");b.type="button";b.className="tile";b.setAttribute("aria-haspopup","dialog");
    b.innerHTML='<span class="tmedia" style="background:'+t.tint+'"></span><span class="tbody"><strong>'+t.t+'</strong><span>'+t.s+'</span></span><span class="tgo" aria-hidden="true">See it</span>';
    var m=b.firstChild;
    if(t.video){var im=new Image();im.src=t.video+".jpg";im.alt="";im.loading="lazy";im.decoding="async";m.appendChild(im);m.classList.add("shot")}
    else if(window.Law7Scene&&Law7Scene.has(t.scene)){var h=document.createElement("span");h.className="tsc";m.appendChild(h);t._thumb=Law7Scene.make(t.scene,h,"");m.classList.add("scn")}
    b.addEventListener("click",function(){open(i,b)});
    g.appendChild(b);
  });
  function thumbs(){T.forEach(function(t){if(t._thumb){t._thumb.parts=null;Law7Scene.paint(t._thumb,1)}})}
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(thumbs);
  thumbs();

  /* ---------- the popup ---------- */
  var M=document.getElementById("tdM"),opener=null;
  function stop(){cancelAnimationFrame(raf);raf=0}
  function show(i){
    cur=i;var t=T[i];stop();M.innerHTML="";M.style.background=t.tint;
    document.getElementById("tdT").textContent=t.t;document.getElementById("tdL").textContent=t.lead;
    document.getElementById("tdU").innerHTML=t.can.map(function(x){return "<li>"+x+"</li>"}).join("");
    document.getElementById("tdA").innerHTML="<b>How Atlas uses it.</b> "+t.atlas;
    document.getElementById("tdN").textContent="Next: "+T[(i+1)%T.length].t;
    if(t.video){
      var v=document.createElement("video");v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute("playsinline","");v.setAttribute("aria-label",t.t+" in use");v.poster=t.video+".jpg";v.src=t.video+".mp4";v.preload="auto";
      if(reduce){v.controls=true}else{v.autoplay=true}
      M.appendChild(v);if(!reduce){var pr=v.play();if(pr&&pr.catch)pr.catch(function(){v.controls=true})}
    }else if(window.Law7Scene){
      var c=Law7Scene.make(t.scene,M,t.t+", animated");M.classList.add("sc-m");
      var start=performance.now(),LEN=6200,HOLD=1800;
      (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){c.parts=null});
      var tick=function(now){var e=(now-start)%(LEN+HOLD),p=Math.min(1,e/LEN);Law7Scene.paint(c,reduce?1:p);if(!reduce)raf=requestAnimationFrame(tick)};
      raf=requestAnimationFrame(tick);
    }
    M.classList.toggle("sc-m",!t.video);
  }
  function open(i,btn){opener=btn||opener;show(i);if(dlg.showModal){if(!dlg.open)dlg.showModal()}else dlg.setAttribute("open","");document.documentElement.classList.add("lock")}
  function close(){stop();var v=M.querySelector("video");if(v)v.pause();if(dlg.close)dlg.close();else dlg.removeAttribute("open");document.documentElement.classList.remove("lock");if(opener)try{opener.focus({preventScroll:true})}catch(e){}}
  document.getElementById("tdX").addEventListener("click",close);
  document.getElementById("tdN").addEventListener("click",function(){show((cur+1)%T.length)});
  dlg.addEventListener("click",function(e){if(e.target===dlg)close()});
  dlg.addEventListener("close",function(){stop();document.documentElement.classList.remove("lock")});
  dlg.addEventListener("keydown",function(e){if(e.key==="ArrowRight")show((cur+1)%T.length);else if(e.key==="ArrowLeft")show((cur+T.length-1)%T.length)});
})();
