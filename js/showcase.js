/* Feature showcase: six "notebook pages" that write, circle and draw themselves as you scroll.
   Each chapter is a tall block with a sticky stage. Scroll progress p (0 to 1) drives every animated piece:
     data-in="a,b"    fades up      data-pop="a,b"  pops in       data-wipe="a,b"  writes itself left to right
     data-draw="a,b"  draws a line  data-out="a,b"  fades away    data-par="n"     drifts at its own speed (parallax)
   Edit the scenes below, the words are in index.html. With reduced motion every page just shows its finished state. */
(function(){
  var INK="#0F1B3D",COB="#2A44F5",PINK="#E8456B",MINT="#12A184",HI="#FFD93D",LINE="#E1E8F7",GREY="#C7D0E6";
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS="http://www.w3.org/2000/svg";

  /* ---------- tiny drawing helpers (return SVG strings) ---------- */
  function page(extra){return '<rect x="6" y="6" width="548" height="428" rx="24" fill="#fff" stroke="'+INK+'" stroke-width="4"/><g stroke="'+LINE+'" stroke-width="2"><path d="M26 84H534M26 150H534M26 216H534M26 282H534M26 348H534M26 414H534"/></g>'+(extra||"")}
  function hw(x,y,s,t,col,a,w){return '<text class="hw" x="'+x+'" y="'+y+'" font-size="'+s+'" font-weight="700" fill="'+(col||INK)+'"'+(w?' data-wipe="'+a+'"':' data-in="'+a+'"')+'>'+t+'</text>'}
  function wipe(x,y,s,t,col,a){return '<text class="hw" x="'+x+'" y="'+y+'" font-size="'+s+'" font-weight="700" fill="'+(col||INK)+'" data-wipe="'+a+'">'+t+'</text>'}
  function stroke(d,col,w,a){return '<path d="'+d+'" pathLength="1" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" data-draw="'+a+'"/>'}
  function chip(x,y,w,t,bg,fg,a){return '<g data-pop="'+a+'" transform="translate('+x+' '+y+')"><rect width="'+w+'" height="32" rx="16" fill="'+bg+'" stroke="'+INK+'" stroke-width="2.5"/><text class="ui" x="'+w/2+'" y="21" text-anchor="middle" font-size="14.5" font-weight="700" fill="'+fg+'">'+t+'</text></g>'}
  function note(x,y,w,h,lines,a,head){
    var s='<g data-pop="'+a+'" transform="translate('+x+' '+y+')"><rect width="'+w+'" height="'+h+'" rx="12" fill="#fff" stroke="'+INK+'" stroke-width="3.5"/><rect width="11" height="'+h+'" rx="5.5" fill="'+COB+'"/>'
      +'<rect x="26" y="14" width="'+(head&&head.length>6?118:64)+'" height="26" rx="13" fill="'+INK+'"/><text class="ui" x="'+(26+(head&&head.length>6?59:32))+'" y="32" text-anchor="middle" font-size="13.5" font-weight="700" fill="#fff">'+(head||"Atlas")+'</text>';
    lines.forEach(function(l,i){s+='<text class="hw" x="26" y="'+(72+i*30)+'" font-size="25" font-weight="500" fill="'+(l[1]||INK)+'">'+l[0]+'</text>'});
    return s+'</g>'
  }
  function pencil(x,y,r){return '<g data-par=".7" transform="translate('+x+' '+y+') rotate('+r+')"><g stroke="'+INK+'" stroke-width="3.5" stroke-linejoin="round"><path d="M0 0L22 -9V9Z" fill="#F7D9B5"/><path d="M0 0L9 -3.6V3.6Z" fill="'+INK+'"/><rect x="22" y="-9" width="86" height="18" fill="'+HI+'"/><rect x="108" y="-9" width="14" height="18" rx="3" fill="'+PINK+'"/></g></g>'}

  /* ---------- the six scenes ---------- */
  var SC={
    write:page(
      '<g data-par=".25"><rect x="440" y="-6" width="86" height="30" rx="4" fill="'+HI+'" opacity=".85" transform="rotate(6 483 9)"/></g>'+
      wipe(34,68,46,"Newton's 2nd law",INK,".03,.26")+stroke("M34 82C150 94 260 72 410 84",COB,6,".26,.36")+
      wipe(34,148,62,"F = m · a",INK,".34,.5")+
      wipe(34,214,44,"m = 3 kg",INK,".48,.6")+wipe(230,214,44,"a = 4 m/s²",MINT,".58,.7")+
      wipe(34,282,44,"12 N",PINK,".68,.76")+stroke("M130 268H236M220 254L238 268L220 282",PINK,6,".74,.84")+
      chip(34,364,150,"✋ palm ignored","#fff",INK,".82,.9")+chip(196,364,168,"pressure aware","#fff",INK,".87,.95")+chip(376,364,146,"pinch to zoom","#fff",INK,".92,1")+
      pencil(400,300,-32)),
    ask:page(
      wipe(34,68,46,"3x − 4 = 2x + 9",INK,".03,.18")+wipe(34,138,46,"3x − 2x = 9 − 4",INK,".14,.28")+
      '<g data-pop=".3,.42"><rect x="22" y="94" width="380" height="62" rx="8" fill="rgba(42,68,245,.07)" stroke="'+COB+'" stroke-width="3.5" stroke-dasharray="10 7"/><g fill="#fff" stroke="'+COB+'" stroke-width="3"><rect x="16" y="88" width="12" height="12"/><rect x="396" y="88" width="12" height="12"/><rect x="16" y="150" width="12" height="12"/><rect x="396" y="150" width="12" height="12"/></g></g>'+
      '<g data-in=".46,.58" transform="translate(40 232)"><rect width="480" height="64" rx="32" fill="#fff" stroke="'+INK+'" stroke-width="4"/><text class="ui" x="30" y="40" font-size="20" fill="#7A86A6" data-out=".56,.6">Ask about the box…</text></g>'+
      '<text class="ui" x="70" y="272" font-size="20" fill="'+INK+'" data-wipe=".58,.76">Why did the 4 change sign?</text>'+
      '<g data-pop=".76,.84" transform="translate(498 264)"><circle r="22" fill="'+COB+'"/><path d="M-7 3L0 -6L7 3M0 -6V9" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'+
      chip(40,326,236,"Atlas only sees the boxed part",HI,INK,".86,.96")+
      pencil(430,380,-28)),
    read:page(
      wipe(34,68,48,"2Na + Cl₂ → 2NaCl",INK,".03,.22")+
      wipe(34,142,46,"M(NaCl) =",INK,".2,.32")+
      '<path d="M258 124c14-14 26 6 40-6s22 12 38-2" fill="none" stroke="'+INK+'" stroke-width="4.5" stroke-linecap="round" data-draw=".3,.38"/>'+wipe(352,142,44,"g/mol",INK,".36,.44")+
      '<ellipse cx="297" cy="124" rx="56" ry="28" fill="none" stroke="'+PINK+'" stroke-width="3.5" stroke-dasharray="9 7" data-pop=".42,.5"/>'+
      note(30,186,328,190,[["I read: 2Na + Cl₂ → 2NaCl"],["M(NaCl) = ?  I can't read"],["that number. Is it 58.44?",PINK]],".48,.62","Atlas · what I read")+
      '<g data-pop=".7,.8" transform="translate(30 388)"><rect width="330" height="32" rx="16" fill="#D4F4EC" stroke="'+MINT+'" stroke-width="2.5"/><text class="ui" x="165" y="21" text-anchor="middle" font-size="14.5" font-weight="700" fill="#0A5F4D">58.44 g/mol, looked up, not guessed</text></g>'+
      '<g data-par=".5" data-in=".05,.2" transform="translate(402 222)"><rect width="128" height="126" rx="14" fill="'+HI+'" stroke="'+INK+'" stroke-width="3.5" transform="rotate(4)"/><text class="hw" x="16" y="48" font-size="26" font-weight="700" fill="'+INK+'" transform="rotate(4)">messy pen?</text><text class="hw" x="16" y="82" font-size="26" font-weight="700" fill="'+INK+'" transform="rotate(4)">it reads it</text></g>'),
    fix:page(
      wipe(34,66,46,"2x + 6 = 14",INK,".03,.14")+wipe(34,132,46,"2x = 14 + 6",INK,".12,.24")+wipe(34,198,46,"2x = 20",INK,".22,.32")+wipe(34,264,46,"x = 10",INK,".3,.4")+
      stroke("M18 112C80 96 240 98 290 118C300 136 270 148 150 148C60 148 14 140 18 112Z",PINK,4.5,".4,.5")+
      note(302,108,236,150,[["Line 2: moving +6"],["across the = makes"],["it −6. Try again?"]],".5,.62")+
      chip(302,274,56,"Hint",HI,INK,".6,.66")+chip(366,274,92,"Next step","#fff",INK,".64,.7")+chip(466,274,70,"Full","#fff","#7A86A6",".68,.74")+
      wipe(34,330,46,"2x = 14 − 6",MINT,".72,.84")+stroke("M290 320l14 14l30 -34",MINT,7,".84,.9")+wipe(34,396,46,"x = 4",MINT,".88,.97")),
    draw:page(
      '<g data-in=".04,.14"><rect x="34" y="34" width="124" height="56" rx="12" fill="#E9EEFB" stroke="'+INK+'" stroke-width="4"/><text class="hw" x="96" y="72" text-anchor="middle" font-size="30" font-weight="700" fill="'+INK+'">light</text></g>'+
      stroke("M160 62H208M196 50L210 62L196 74",COB,5,".14,.22")+
      '<g data-in=".2,.3"><rect x="212" y="34" width="124" height="56" rx="12" fill="#FFF3A8" stroke="'+INK+'" stroke-width="4"/><text class="hw" x="274" y="72" text-anchor="middle" font-size="30" font-weight="700" fill="'+INK+'">glucose</text></g>'+
      stroke("M338 62H386M374 50L388 62L374 74",COB,5,".28,.36")+
      '<g data-in=".34,.44"><rect x="390" y="34" width="124" height="56" rx="12" fill="#D4F4EC" stroke="'+INK+'" stroke-width="4"/><text class="hw" x="452" y="72" text-anchor="middle" font-size="30" font-weight="700" fill="'+INK+'">O₂</text></g>'+
      stroke("M274 92V132M262 120L274 134L286 120",PINK,5,".42,.5")+
      '<g data-in=".48,.58"><rect x="212" y="134" width="124" height="52" rx="12" fill="#fff" stroke="'+INK+'" stroke-width="4"/><text class="hw" x="274" y="170" text-anchor="middle" font-size="30" font-weight="700" fill="'+INK+'">energy</text></g>'+
      stroke("M40 316H524",INK,3.5,".54,.6")+stroke("M280 212V412",INK,3.5,".56,.62")+
      stroke("M100 236Q280 524 460 236",COB,6,".62,.82")+
      '<g data-pop=".8,.88" fill="'+PINK+'" stroke="'+INK+'" stroke-width="3"><circle cx="160" cy="316" r="7"/><circle cx="400" cy="316" r="7"/><circle cx="280" cy="380" r="7"/></g>'+
      '<text class="hw" x="280" y="272" text-anchor="middle" font-size="32" font-weight="700" fill="'+INK+'" data-wipe=".8,.9">y = x² − 4</text>'+
      '<g data-pop=".9,.98" transform="translate(358 132)"><rect width="168" height="34" rx="17" fill="'+COB+'"/><text class="ui" x="84" y="22" text-anchor="middle" font-size="14.5" font-weight="700" fill="#fff">✦ drawn by Atlas</text></g>'),
    pages:
      '<g data-par=".5"><rect x="26" y="40" width="300" height="372" rx="16" fill="#E9EEFB" stroke="'+INK+'" stroke-width="4" transform="rotate(-8 176 226)"/></g>'+
      '<g data-par=".25"><rect x="56" y="22" width="330" height="396" rx="16" fill="#fff" stroke="'+INK+'" stroke-width="4"/>'+
      '<rect x="80" y="46" width="64" height="28" rx="14" fill="'+PINK+'"/><text class="ui" x="112" y="66" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">PDF</text>'+
      '<g fill="'+GREY+'"><rect x="160" y="52" width="190" height="12" rx="6"/><rect x="80" y="100" width="270" height="9" rx="4.5"/><rect x="80" y="122" width="236" height="9" rx="4.5"/></g>'+
      '<text class="ui" x="80" y="170" font-size="17" font-weight="600" fill="'+INK+'">3. Balance the equation.</text>'+
      '<text class="ui" x="80" y="200" font-size="19" fill="#46526F">H₂ + O₂ → H₂O</text>'+
      '<g fill="'+GREY+'"><rect x="80" y="330" width="250" height="9" rx="4.5"/><rect x="80" y="352" width="200" height="9" rx="4.5"/></g>'+
      wipe(80,276,42,"2H₂ + O₂ → 2H₂O",COB,".08,.4")+stroke("M80 292C150 304 230 284 336 296",COB,4.5,".4,.5")+
      '<g data-pop=".5,.58" transform="translate(350 226) rotate(-8)"><circle r="22" fill="none" stroke="'+MINT+'" stroke-width="4"/><path d="M-9 1l7 8l13 -17" stroke="'+MINT+'" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>'+
      stroke("M392 226H442M428 212L444 226L428 240",COB,6,".58,.68")+
      '<g data-par=".4" data-pop=".66,.76"><path d="M458 86H508L534 112V330a10 10 0 0 1-10 10H458a10 10 0 0 1-10-10V96a10 10 0 0 1 10-10Z" fill="#fff" stroke="'+INK+'" stroke-width="4"/><rect x="460" y="212" width="62" height="34" rx="9" fill="'+PINK+'"/><text class="ui" x="491" y="235" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">PDF</text><g stroke="'+INK+'" stroke-width="3.5" stroke-linecap="round"><path d="M468 130H514M468 154H504M468 178H510"/></g></g>'+
      chip(384,360,150,"1 PDF, all pages","#fff",INK,".84,.94")
  };

  SC.lookup=page(
    '<g data-in=".02,.1"><rect x="34" y="30" width="206" height="32" rx="16" fill="#D4F4EC" stroke="'+MINT+'" stroke-width="2.5"/><text class="ui" x="137" y="51" text-anchor="middle" font-size="14.5" font-weight="700" fill="#0A5F4D">Atlas looked this up</text></g>'+
    wipe(34,128,70,"H₂SO₄",INK,".06,.22")+
    wipe(34,184,34,"H   2 × 1.008  =  2.016",INK,".2,.34")+wipe(34,226,34,"S   1 × 32.06  =  32.06",INK,".3,.44")+wipe(34,268,34,"O   4 × 15.999 =  63.996",INK,".4,.54")+
    stroke("M34 284H400",INK,3.5,".52,.58")+wipe(34,330,44,"98.07 g/mol",MINT,".56,.7")+
    '<g class="ui" font-size="14" font-weight="700" fill="#46526F"><text x="34" y="372" data-in=".68,.74">H</text><text x="34" y="396" data-in=".7,.76">S</text><text x="34" y="420" data-in=".72,.78">O</text></g>'+
    stroke("M58 368H70",PINK,9,".68,.74")+stroke("M58 392H186",COB,9,".72,.82")+stroke("M58 416H290",MINT,9,".76,.9")+
    '<g class="ui" font-size="13.5" font-weight="700" fill="#46526F"><text x="82" y="372" data-in=".74,.8">2.06%</text><text x="198" y="396" data-in=".8,.86">32.69%</text><text x="302" y="420" data-in=".86,.92">65.25%</text></g>');
  SC.together=page(
    wipe(34,66,46,"Chem revision",INK,".02,.2")+stroke("M34 80C120 90 220 70 330 82",COB,6,".2,.28")+
    wipe(34,148,40,"Ionic bond = e⁻ transfer",COB,".26,.5")+wipe(34,214,40,"Covalent = sharing",PINK,".34,.56")+
    wipe(34,282,40,"Metallic = sea of e⁻",COB,".52,.74")+wipe(34,350,40,"Test on Thursday!",PINK,".6,.84")+
    '<g data-par=".5" data-pop=".3,.4" transform="translate(500 120)"><path d="M0 0L14 36L22 22L36 18Z" fill="'+COB+'" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/><rect x="18" y="38" width="48" height="24" rx="12" fill="'+COB+'"/><text class="ui" x="42" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">you</text></g>'+
    '<g data-par=".6" data-pop=".4,.5" transform="translate(470 240)"><path d="M0 0L14 36L22 22L36 18Z" fill="'+PINK+'" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/><rect x="18" y="38" width="76" height="24" rx="12" fill="'+PINK+'"/><text class="ui" x="56" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">a friend</text></g>'+
    chip(34,380,236,"one page, two people, Atlas helps both","#fff",INK,".86,.96"));
  /* ---------- build ---------- */
  var chaps=[].slice.call(document.querySelectorAll(".chap[data-scene]")),cur=[];
  function make(key,host,alt){
    var svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 560 440");svg.setAttribute("role","img");svg.setAttribute("aria-label",alt||"");
    svg.innerHTML='<defs></defs><g class="sc-root">'+SC[key]+'</g>';
    host.appendChild(svg);return {svg:svg,host:host,parts:null,last:-1};
  }
  chaps.forEach(function(ch){
    var key=ch.getAttribute("data-scene"),host=ch.querySelector(".sc");if(!host||!SC[key])return;
    var c=make(key,host,host.getAttribute("data-alt"));c.el=ch;cur.push(c);
  });
  /* the tool popups reuse these pages and play them on a loop */
  window.Law7Scene={make:make,paint:function(c,p){paint(c,p)},has:function(k){return !!SC[k]},reduce:reduce};
  function range(s){var a=s.split(",");return [parseFloat(a[0]),parseFloat(a[1])]}
  function setup(c){
    var defs=c.svg.querySelector("defs"),n=0,parts=[];
    [].forEach.call(c.svg.querySelectorAll("[data-wipe],[data-draw],[data-in],[data-pop],[data-par],[data-out]"),function(e){
      var o={e:e};
      if(e.hasAttribute("data-wipe")){
        var b;try{b=e.getBBox()}catch(x){b=null}
        if(b&&b.width){var id="cp"+(c.id=(c.id||Math.floor(Math.random()*1e6)))+"_"+(n++),cp=document.createElementNS(NS,"clipPath"),r=document.createElementNS(NS,"rect");
          cp.id=id;r.setAttribute("x",b.x-6);r.setAttribute("y",b.y-8);r.setAttribute("height",b.height+16);r.setAttribute("width",0);cp.appendChild(r);defs.appendChild(cp);e.setAttribute("clip-path","url(#"+id+")");o.rect=r;o.x=b.x-6;o.w=b.width+12}
        o.wipe=range(e.getAttribute("data-wipe"));
      }
      if(e.hasAttribute("data-draw")){o.draw=range(e.getAttribute("data-draw"));e.style.strokeDasharray="1";}
      if(e.hasAttribute("data-in"))o.inn=range(e.getAttribute("data-in"));
      if(e.hasAttribute("data-pop"))o.pop=range(e.getAttribute("data-pop"));
      if(e.hasAttribute("data-out"))o.out=range(e.getAttribute("data-out"));
      if(e.hasAttribute("data-par"))o.par=parseFloat(e.getAttribute("data-par"));
      o.base=e.getAttribute("transform")||"";
      if(o.pop){var m=o.base.match(/translate\(([-\d.]+)[ ,]([-\d.]+)\)/);if(m){o.px=+m[1];o.py=+m[2]}else{try{var bb=e.getBBox();o.cx=bb.x+bb.width/2;o.cy=bb.y+bb.height/2}catch(x){}}}
      parts.push(o);
    });
    c.parts=parts;
  }
  var sm=function(f){f=f<0?0:f>1?1:f;return f*f*(3-2*f)};
  function frac(r,p){return r[1]<=r[0]?(p>=r[0]?1:0):sm((p-r[0])/(r[1]-r[0]))}
  function paint(c,p){
    if(!c.parts)setup(c);
    c.parts.forEach(function(o){
      var e=o.e,op=1,ty=0,tr=null;
      if(o.wipe){var f=frac(o.wipe,p);if(o.rect)o.rect.setAttribute("width",(o.w*f).toFixed(1));else op=f>0?1:0}
      if(o.inn){var f1=frac(o.inn,p);op*=f1;ty+=(1-f1)*14}
      if(o.pop){var f2=frac(o.pop,p),s=.7+.3*f2;op*=f2;
        if(o.px!==undefined)tr=o.base.replace(/translate\([^)]*\)/,"translate("+o.px+" "+(o.py+(1-f2)*10).toFixed(1)+")")+" scale("+s.toFixed(3)+")";
        else if(o.cx!==undefined)tr="translate("+(o.cx*(1-s)).toFixed(1)+" "+(o.cy*(1-s)).toFixed(1)+") scale("+s.toFixed(3)+")"}
      if(o.out)op*=1-frac(o.out,p);
      if(o.par!==undefined&&!reduce)ty+=(.5-p)*o.par*70;
      if(o.inn||o.par!==undefined||o.pop){e.setAttribute("transform",((tr!==null?tr:o.base)+(ty?" translate(0 "+ty.toFixed(1)+")":"")).trim())}
      if(o.draw){var fd=frac(o.draw,p);e.style.strokeDashoffset=(1-fd).toFixed(4);op*=fd>0?1:0}
      e.style.opacity=op.toFixed(3);
    });
  }
  /* ---------- scroll driver ---------- */
  var ticking=false,vh=window.innerHeight,still=reduce;
  var short=window.matchMedia("(max-height:520px)");
  function isStatic(){return still||short.matches}
  function drive(){
    ticking=false;
    cur.forEach(function(c){
      var r=c.el.getBoundingClientRect();
      if(r.bottom<-vh*.3||r.top>vh*1.3)return;
      var p=isStatic()?1:Math.max(0,Math.min(1,(vh*.62-r.top)/Math.max(1,r.height-vh*.38)));
      if(Math.abs(p-c.last)<.0015)return;c.last=p;paint(c,p);
      c.el.classList.toggle("on",p>.02&&p<.98);
    });
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(drive)}}
  window.addEventListener("scroll",onScroll,{passive:true});
  window.addEventListener("resize",function(){vh=window.innerHeight;cur.forEach(function(c){c.last=-1});onScroll()});
  short.addEventListener&&short.addEventListener("change",function(){cur.forEach(function(c){c.last=-1});onScroll()});
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){cur.forEach(function(c){c.parts=null;c.last=-1});drive()});
  if(isStatic())document.documentElement.classList.add("still");
  drive();
})();
