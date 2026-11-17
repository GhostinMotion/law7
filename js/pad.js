/* "Pick up the pen": a small drawing pad. Smooth ink, a few colours, undo and clear. Nothing is saved or sent anywhere. */
(function(){
  var cv=document.getElementById("pad");if(!cv)return;
  var ctx=cv.getContext("2d"),box=cv.parentNode,hint=document.getElementById("padHint"),swEl=document.getElementById("padSw");
  var W=800,H=520,COLS=["#0F1B3D","#2A44F5","#E8456B","#12A184"],col=1,strokes=[],cur=null;
  function sync(){var r=cv.getBoundingClientRect(),dpr=Math.min(2.5,window.devicePixelRatio||1),cw=Math.round(r.width*dpr);if(cw&&cv.width!==cw){cv.width=cw;cv.height=Math.round(cw*H/W)}return r}
  function paint(s){
    var p=s.pts;if(!p.length)return;var k=cv.width/W;
    ctx.save();ctx.setTransform(k,0,0,k,0,0);ctx.strokeStyle=s.c;ctx.fillStyle=s.c;ctx.lineCap="round";ctx.lineJoin="round";
    if(p.length===1){ctx.beginPath();ctx.arc(p[0][0],p[0][1],s.w*(p[0][2]||.5)*1.1,0,6.3);ctx.fill();ctx.restore();return}
    for(var i=1;i<p.length;i++){
      var a=p[i-1],b=p[i],m0=i>1?[(p[i-2][0]+a[0])/2,(p[i-2][1]+a[1])/2]:a,m1=[(a[0]+b[0])/2,(a[1]+b[1])/2];
      ctx.lineWidth=s.w*(.55+.9*((a[2]+b[2])/2));ctx.beginPath();ctx.moveTo(m0[0],m0[1]);ctx.quadraticCurveTo(a[0],a[1],m1[0],m1[1]);ctx.stroke();
    }
    ctx.restore();
  }
  function draw(){sync();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);strokes.forEach(paint);if(cur)paint(cur)}
  function pt(e){var r=cv.getBoundingClientRect(),pr=e.pointerType==="pen"&&e.pressure>0?e.pressure:.5;return [(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height,pr]}
  cv.addEventListener("pointerdown",function(e){
    if(e.button>0)return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(x){}
    cur={c:COLS[col],w:4.2,pts:[pt(e)]};if(hint)hint.classList.add("gone");draw();
  });
  cv.addEventListener("pointermove",function(e){
    if(!cur)return;e.preventDefault();
    var list=e.getCoalescedEvents?e.getCoalescedEvents():[e];if(!list.length)list=[e];
    list.forEach(function(ev){var p=pt(ev),l=cur.pts[cur.pts.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])>=1.1)cur.pts.push(p)});
    draw();
  },{passive:false});
  function end(){if(!cur)return;strokes.push(cur);cur=null;draw();if(strokes.length>400)strokes.shift()}
  cv.addEventListener("pointerup",end);cv.addEventListener("pointercancel",end);cv.addEventListener("contextmenu",function(e){e.preventDefault()});
  function swatches(){swEl.innerHTML="";COLS.forEach(function(c,i){var b=document.createElement("button");b.type="button";b.style.setProperty("--c",c);b.className=i===col?"on":"";b.setAttribute("aria-label","Colour "+(i+1));b.setAttribute("aria-pressed",i===col?"true":"false");b.addEventListener("click",function(){col=i;swatches()});swEl.appendChild(b)})}
  document.getElementById("padClear").addEventListener("click",function(){strokes=[];cur=null;if(hint)hint.classList.remove("gone");draw()});
  document.getElementById("padUndo").addEventListener("click",function(){strokes.pop();if(!strokes.length&&hint)hint.classList.remove("gone");draw()});
  window.addEventListener("resize",draw);swatches();draw();
})();
