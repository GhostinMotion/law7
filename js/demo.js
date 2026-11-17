/* The walkthrough: 2x + 6 = 14, solved by moving terms across the equals sign.
   One function, render(P), draws the whole scene for a position P from 0 to 5 (each whole number is a step).
   Scrolling, the slider, the buttons and play all just change P, so rewinding is free. */
(function(){
  var NS="http://www.w3.org/2000/svg",svg=document.getElementById("demo");if(!svg)return;
  var INK="#0F1B3D",BLUE="#2A44F5",RED="#E8456B",MINT="#12A184";
  var COMMENTS=[
    "Goal: get x alone. First, spot what's in the way: the +6.",
    "Move +6 across the = sign and it flips to −6.",
    "Tidy up the right side: 14 − 6 = 8.",
    "x is still multiplied by 2. Move the 2 across and it divides.",
    "8 ÷ 2 = 4. That's x.",
    "Check it: 2(4) + 6 = 14. It works."
  ];
  var root=document.createElementNS(NS,"g");root.setAttribute("transform","translate(150 0)");svg.appendChild(root);
  function mk(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);(p||root).appendChild(e);return e}
  function tx(t,x,y,size,fill){var e=mk("text",{x:x,y:y,"text-anchor":"middle","dominant-baseline":"central","font-family":"Hand, 'Segoe Print', cursive","font-weight":700,"font-size":size||92,fill:fill||INK});e.textContent=t;return e}
  var clamp=function(v,a,b){return Math.max(a==null?0:a,Math.min(b==null?1:b,v))},lerp=function(a,b,t){return a+(b-a)*t},sm=function(u){return u*u*(3-2*u)};
  var Y=190;

  /* back to front */
  var hiBar=mk("rect",{x:140,y:Y-62,width:300,height:124,rx:18,fill:"#FFD93D",opacity:0});
  var arc1=mk("path",{d:"M270 "+Y+" Q365 "+(Y-150)+" 462 "+Y,fill:"none",stroke:BLUE,"stroke-width":3,"stroke-dasharray":"8 8","stroke-linecap":"round",opacity:0});
  var arc2=mk("path",{d:"M120 "+Y+" Q250 "+(Y-170)+" 392 262",fill:"none",stroke:BLUE,"stroke-width":3,"stroke-dasharray":"8 8","stroke-linecap":"round",opacity:0});
  var ring=mk("ellipse",{cx:270,cy:Y,rx:66,ry:58,fill:"none",stroke:BLUE,"stroke-width":6,"stroke-linecap":"round",pathLength:1,"stroke-dasharray":1,"stroke-dashoffset":1,opacity:0});
  var two=tx("2",120,Y),ex=tx("x",178,Y),p6=tx("+6",270,Y),eq=tx("=",370,Y),n14=tx("14",470,Y),n8=tx("8",385,Y),n4=tx("4",385,Y,92,MINT);
  var bar=mk("line",{x1:340,x2:432,y1:Y+16,y2:Y+16,stroke:INK,"stroke-width":6,"stroke-linecap":"round",opacity:0});
  var chk=tx("check: 2(4) + 6 = 14  ✓",300,338,52,MINT);
  var cur=mk("g",{});mk("circle",{r:19,fill:"rgba(42,68,245,.18)"},cur);mk("circle",{r:8,fill:BLUE},cur);
  var tag=mk("g",{transform:"translate(14 12)"},cur);mk("rect",{width:72,height:26,rx:13,fill:INK},tag);var tl=mk("text",{x:36,y:14,"text-anchor":"middle","dominant-baseline":"central","font-family":"Instrument, sans-serif","font-size":13,"font-weight":700,fill:"#fff"},tag);tl.textContent="Claude";

  function set(e,x,y,o){e.setAttribute("x",x);e.setAttribute("y",y);e.setAttribute("opacity",o==null?1:o)}
  function seg(k,P){return sm(clamp((P-k-.12)/.76))}

  function pos(P){
    var e0=seg(0,P),e1=seg(1,P),e2=seg(2,P),e3=seg(3,P),e4=seg(4,P),o={};
    o.ring={d:1-e0,op:(1-e1)};
    o.p6={x:lerp(270,460,e1),y:Y-96*Math.sin(Math.PI*e1)};
    o.p6.t=e1>.5?"−6":"+6";o.p6.c=e1>.5?RED:INK;o.p6.op=1-clamp((e2-.1)/.4);
    o.p6.x=e2>0?lerp(460,412,e2):o.p6.x;
    o.eq={x:lerp(370,270,e1),y:Y,op:1};
    o.n14={x:lerp(lerp(470,370,e1),382,e2),y:Y,op:1-clamp((e2-.1)/.4)};
    o.two={x:lerp(120,385,e3),y:lerp(Y,262,e3)-130*Math.sin(Math.PI*e3),op:1-clamp((e4-.1)/.6)};
    if(e4>0)o.two.y=lerp(262,Y,e4);
    o.ex={x:178,y:Y,op:1};
    o.n8={x:385,y:lerp(lerp(Y,Y-34,e3),Y,e4),op:clamp((e2-.6)/.4)*(1-clamp(e4/.6))};
    o.n4={x:385,y:Y,op:clamp((e4-.5)/.5)};
    o.bar=e3*(1-e4);
    o.hi=clamp((e4-.6)/.4)*.85;
    o.chk=clamp((e4-.7)/.3);
    o.arc1=e1>0?(1-clamp((e1-.85)/.15)*.7)*clamp(e1*3):0;
    o.arc2=e3>0?(1-clamp((e3-.85)/.15)*.7)*clamp(e3*3):0;
    o.e1=e1;o.e3=e3;
    return o;
  }
  function target(k,P){
    var o=pos(P);
    if(k<=0)return [270,Y];
    if(k===1)return [o.p6.x,o.p6.y];
    if(k===2)return [400,Y];
    if(k===3)return [o.two.x,o.two.y];
    return [385,Y+30];
  }
  function cursorAt(P){
    var k=Math.min(4,Math.floor(P)),f=P-k,t=target(k,P);
    if(P<1&&f<.12){var a=[700,320];t=[lerp(a[0],t[0],sm(f/.12)),lerp(a[1],t[1],sm(f/.12))]}
    else if(k>0&&f<.12&&P<5){var q=target(k-1,k),u=sm(f/.12);t=[lerp(q[0],t[0],u),lerp(q[1],t[1],u)]}
    return t;
  }

  var lastIdx=-1,typed="";
  function render(P){
    P=clamp(P,0,5);var o=pos(P);
    ring.setAttribute("stroke-dashoffset",o.ring.d);ring.setAttribute("opacity",P<=0?0:o.ring.op);
    set(two,o.two.x,o.two.y,o.two.op);set(ex,o.ex.x,o.ex.y,1);set(eq,o.eq.x,o.eq.y,1);
    set(n14,o.n14.x,o.n14.y,o.n14.op);set(n8,o.n8.x,o.n8.y,o.n8.op);set(n4,o.n4.x,o.n4.y,o.n4.op);
    p6.textContent=o.p6.t;p6.setAttribute("fill",o.p6.c);set(p6,o.p6.x,o.p6.y,o.p6.op);
    bar.setAttribute("opacity",o.bar);hiBar.setAttribute("opacity",o.hi);chk.setAttribute("opacity",o.chk);
    arc1.setAttribute("opacity",o.arc1*.55);arc2.setAttribute("opacity",o.arc2*.55);
    var c=cursorAt(P);cur.setAttribute("transform","translate("+c[0].toFixed(1)+" "+c[1].toFixed(1)+")");
    cur.setAttribute("opacity",P>=4.98?0:1);
    /* the comment: shown for the step we are in, typed out as we move through it */
    var idx=P>=4.98?5:(P<=0?0:Math.min(4,Math.ceil(P)-1)),f=(idx===5||P<=0)?1:P-idx;
    var full=COMMENTS[idx],n=idx===5?full.length:Math.ceil(full.length*clamp(f/.45));
    var shown=full.slice(0,n);
    if(shown!==typed){typed=shown;var el=document.getElementById("noteText");if(el)el.textContent=shown}
    if(idx!==lastIdx){lastIdx=idx;var cnt=document.getElementById("count");if(cnt)cnt.textContent="Step "+(idx+1)+" of 6"}
  }
  var list=document.getElementById("stepsText");
  if(list)COMMENTS.forEach(function(t){var li=document.createElement("li");li.textContent=t;list.appendChild(li)});
  window.InkDemo={render:render,steps:5};
  render(0);
})();
