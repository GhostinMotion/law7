/* The "Go on, draw something" pad. It runs Law7's real shape recogniser (js/ink.js, the same file the board uses):
   draw a line, circle, box or triangle, hold still, and it snaps clean. Keep the pen down to resize. The highlighter only snaps to lines. */
(function(){
  var cv=document.getElementById("pad");if(!cv||!window.IB||!IB.Ink)return;
  var ctx=cv.getContext("2d"),box=cv.parentNode,badge=document.getElementById("padBadge"),ghost=document.getElementById("padGhost"),swEl=document.getElementById("padSw");
  var W=800,H=520,HOLD=650,reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PEN=["#0F1B3D","#2A44F5","#E8456B","#12A184"],MARK=["#FFD93D","#6FE08E","#FF8FB8","#6FBFFF"];
  var tool="pen",col=1,strokes=[],cur=null,timer=0,demoOn=false,demoDone=false,touched=false;
  var NAME={line:"line",circle:"circle",ellipse:"ellipse",square:"square",rect:"rectangle",triangle:"triangle",quad:"shape"};

  function sync(){
    var r=cv.getBoundingClientRect(),dpr=Math.min(2.5,window.devicePixelRatio||1),cw=Math.round(r.width*dpr);
    if(cw&&cv.width!==cw){cv.width=cw;cv.height=Math.round(cw*H/W)}
    return r;
  }
  function k(){return cv.width/W}
  function draw(){
    sync();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);
    var all=strokes.concat(cur?[cur]:[]);
    [1,0].forEach(function(pass){all.forEach(function(s){if(!!s.hl===!!pass)paint(s)})});
  }
  function paint(s){
    var p=s.pts;if(p.length<2)return;
    ctx.save();ctx.setTransform(k(),0,0,k(),0,0);ctx.beginPath();
    if(s.hl){ctx.globalAlpha=.45;ctx.globalCompositeOperation="multiply";ctx.strokeStyle=MARK[s.c];ctx.lineWidth=24;ctx.lineCap="square";ctx.lineJoin="round"}
    else{ctx.strokeStyle=PEN[s.c];ctx.lineWidth=3.8;ctx.lineCap="round";ctx.lineJoin="round"}
    ctx.moveTo(p[0][0],p[0][1]);
    if(s.g||p.length<3){for(var i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1])}
    else{for(var j=1;j<p.length-1;j++){var mx=(p[j][0]+p[j+1][0])/2,my=(p[j][1]+p[j+1][1])/2;ctx.quadraticCurveTo(p[j][0],p[j][1],mx,my)}ctx.lineTo(p[p.length-1][0],p[p.length-1][1])}
    ctx.stroke();ctx.restore();
  }
  function say(t,ok){
    badge.textContent=t;badge.classList.toggle("ok",!!ok);
    badge.classList.remove("pop");void badge.offsetWidth;if(ok)badge.classList.add("pop");
  }
  function pt(e){var r=cv.getBoundingClientRect();return [(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]}
  function zoom(){return cv.getBoundingClientRect().width/W}

  /* ---- snapping ---- */
  function snap(s,last){
    if(!s||s.snapped||s.pts.length<8)return false;
    var sh=IB.Ink.shapeOf(s.pts.map(function(q){return [q[0],q[1],1]}),zoom());
    if(!sh||(s.hl&&sh.type!=="line"))return false;
    s.snapped=true;s.g=true;s.type=sh.type;
    if(sh.type==="line"){s.p0=sh.pts[0].slice();s.pts=[sh.pts[0],sh.pts[1]]}
    else{
      var Q=sh.pts,x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
      Q.forEach(function(q){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])});
      var hx=Math.abs(last[0]-x0)<Math.abs(last[0]-x1)?x0:x1,hy=Math.abs(last[1]-y0)<Math.abs(last[1]-y1)?y0:y1;
      s.sh={lock:sh.lock,fixed:!sh.axis,base:Q,bb:[x0,y0,x1,y1],ax:hx===x0?x1:x0,ay:hy===y0?y1:y0};s.pts=Q.map(function(q){return q.slice()});
    }
    say("Snapped: a clean "+(NAME[sh.type]||"shape")+(sh.type==="line"?". Move to adjust it.":". Keep the pen down to resize."),true);
    box.classList.remove("flash");void box.offsetWidth;box.classList.add("flash");
    try{if(navigator.vibrate)navigator.vibrate(8)}catch(e){}
    draw();return true;
  }
  function follow(s,x,y){
    if(s.type==="line"){
      var p0=s.p0,dx=x-p0[0],dy=y-p0[1],len=Math.hypot(dx,dy),ex=x,ey=y;
      if(len*zoom()>20){var a=Math.atan2(dy,dx),q=Math.PI/4,n=Math.round(a/q);if(Math.abs(a-n*q)<.1){ex=p0[0]+Math.cos(n*q)*len;ey=p0[1]+Math.sin(n*q)*len}}
      s.pts=[p0,[ex,ey]];
    }else if(!s.sh.fixed){
      var S=s.sh,b=S.bb,w0=b[2]-b[0]||1,h0=b[3]-b[1]||1,mn=16/zoom();
      var nx0=Math.min(S.ax,x),nx1=Math.max(S.ax,x),ny0=Math.min(S.ay,y),ny1=Math.max(S.ay,y);
      if(S.lock){var d=Math.max(Math.abs(x-S.ax),Math.abs(y-S.ay),mn);nx0=x>=S.ax?S.ax:S.ax-d;nx1=x>=S.ax?S.ax+d:S.ax;ny0=y>=S.ay?S.ay:S.ay-d;ny1=y>=S.ay?S.ay+d:S.ay}
      if(nx1-nx0<mn)nx1=nx0+mn;if(ny1-ny0<mn)ny1=ny0+mn;
      s.pts=S.base.map(function(q){return [nx0+(q[0]-b[0])/w0*(nx1-nx0),ny0+(q[1]-b[1])/h0*(ny1-ny0)]});
    }
    draw();
  }
  function arm(){clearTimeout(timer);timer=setTimeout(function(){if(cur&&!cur.snapped){var l=cur.pts[cur.pts.length-1];snap(cur,l)}},HOLD)}

  /* ---- pointer ---- */
  cv.addEventListener("pointerdown",function(e){
    if(e.button!==undefined&&e.button>0)return;
    e.preventDefault();endDemo();touched=true;
    try{cv.setPointerCapture(e.pointerId)}catch(x){}
    cur={hl:tool==="hl",c:col,pts:[pt(e)]};say(tool==="hl"?"Highlighting. Hold a straight stroke still to make it a line.":"Hold still when you finish and it snaps clean.");arm();draw();
  });
  cv.addEventListener("pointermove",function(e){
    if(!cur)return;e.preventDefault();var p=pt(e),l=cur.pts[cur.pts.length-1];
    if(cur.snapped){follow(cur,p[0],p[1]);return}
    if(Math.hypot(p[0]-l[0],p[1]-l[1])<1.2)return;
    cur.pts.push(p);arm();draw();
  },{passive:false});
  function up(){
    if(!cur)return;clearTimeout(timer);
    if(!cur.snapped&&cur.pts.length>=8)snap(cur,cur.pts[cur.pts.length-1]);   // lifting the pen on a clean shape is also fine, but only if it was held: so undo the snap below when it was not
    if(cur.pts.length>1)strokes.push(cur);
    var wasSnap=cur.snapped;cur=null;draw();
    if(!wasSnap&&strokes.length)say("Nice. Draw a circle or a box and hold still to see it snap.");
  }
  /* a stroke released while still moving must NOT snap: only a held pen snaps */
  cv.addEventListener("pointerup",function(){if(cur&&!cur.snapped){clearTimeout(timer);if(cur.pts.length>1)strokes.push(cur);cur=null;draw();say("Not snapped, because you kept moving. Draw it again and hold still at the end.")}else up()});
  cv.addEventListener("pointercancel",function(){clearTimeout(timer);cur=null;draw()});
  cv.addEventListener("contextmenu",function(e){e.preventDefault()});

  /* ---- toolbar ---- */
  function swatches(){
    swEl.innerHTML="";(tool==="hl"?MARK:PEN).forEach(function(c,i){
      var b=document.createElement("button");b.type="button";b.style.setProperty("--c",c);b.className=i===col?"on":"";b.setAttribute("aria-label","Colour "+(i+1));
      b.addEventListener("click",function(){col=i;swatches()});swEl.appendChild(b);
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll(".padbar [data-tool]"),function(b){
    b.addEventListener("click",function(){
      endDemo();tool=b.getAttribute("data-tool");
      Array.prototype.forEach.call(document.querySelectorAll(".padbar [data-tool]"),function(x){x.classList.toggle("on",x===b)});
      swatches();say(tool==="hl"?"Highlighter on. Drag across your shape, or hold a straight stroke still.":"Pen on. Draw a shape and hold still.");
    });
  });
  document.getElementById("padClear").addEventListener("click",function(){endDemo();strokes=[];cur=null;draw();say("Draw a shape, then hold still")});
  window.addEventListener("resize",draw);swatches();draw();

  /* ---- the scripted first look: a circle draws itself, holds, and snaps ---- */
  function showGhost(x,y){var r=cv.getBoundingClientRect(),br=box.getBoundingClientRect();ghost.style.transform="translate("+((x*r.width/W)+(r.left-br.left)).toFixed(1)+"px,"+((y*r.height/H)+(r.top-br.top)).toFixed(1)+"px)";ghost.classList.add("on")}
  function endDemo(){if(!demoOn)return;demoOn=false;demoDone=true;clearTimeout(timer);ghost.classList.remove("on");if(cur&&!touched){cur=null}draw()}
  function runDemo(){
    if(demoDone||touched||reduce)return;demoOn=true;demoDone=true;
    var cx=300,cy=270,r=112,N=84,pts=[];
    for(var i=0;i<=N;i++){var a=-1.9+i/N*6.55,w=1+Math.sin(i*.37)*.035+Math.sin(i*.91)*.015;pts.push([cx+Math.cos(a)*r*w+Math.sin(i*1.7)*1.6,cy+Math.sin(a)*r*w*.97+Math.cos(i*1.3)*1.6])}
    cur={hl:false,c:1,pts:[pts[0]]};say("Watch: a hand-drawn circle…");var i2=0,last=performance.now();
    (function step(t){
      if(!demoOn)return;
      while(i2<N&&t-last>16){i2++;last+=16;cur.pts.push(pts[i2])}
      showGhost(cur.pts[cur.pts.length-1][0],cur.pts[cur.pts.length-1][1]);draw();
      if(i2<N){requestAnimationFrame(step);return}
      say("…and hold still.");
      setTimeout(function(){
        if(!demoOn)return;
        if(snap(cur,cur.pts[cur.pts.length-1])){strokes.push(cur);cur=null;draw()}
        setTimeout(function(){if(!demoOn)return;ghost.classList.remove("on");demoOn=false;say("Your turn. Draw something and hold still.")},1400);
      },900);
    })(performance.now());
  }
  if("IntersectionObserver" in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting&&en.intersectionRatio>=.6){io.disconnect();setTimeout(runDemo,350)}})},{threshold:[.6]});
    io.observe(box);
  }
})();
