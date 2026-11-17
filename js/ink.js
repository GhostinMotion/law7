/* Shared ink code for the board (same smoothing as the practice pads). World units = CSS px at zoom 1. */
(function(){
"use strict";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/* ---------- geometry ---------- */
function rdp(pts,eps){
  if(pts.length<3)return pts;
  const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;
  const st=[[0,pts.length-1]];
  while(st.length){
    const [a,b]=st.pop();let md=0,mi=-1;
    const ax=pts[a][0],ay=pts[a][1],dx=pts[b][0]-ax,dy=pts[b][1]-ay,L=dx*dx+dy*dy;
    for(let i=a+1;i<b;i++){
      let d;
      if(L===0)d=Math.hypot(pts[i][0]-ax,pts[i][1]-ay);
      else{const t=clamp(((pts[i][0]-ax)*dx+(pts[i][1]-ay)*dy)/L,0,1);d=Math.hypot(pts[i][0]-(ax+t*dx),pts[i][1]-(ay+t*dy))}
      if(d>md){md=d;mi=i}
    }
    if(md>eps&&mi>0){keep[mi]=1;st.push([a,mi],[mi,b])}
  }
  return pts.filter((_,i)=>keep[i]);
}
function wOf(size,pen,p){return pen?size*(0.55+0.9*Math.pow(clamp(p,0.02,1),0.9)):size}
function compact(strokes,eps){
  return strokes.map(s=>{
    const ap=s.pts.reduce((t,q)=>t+q[2],0)/Math.max(1,s.pts.length);
    return [s.c,+wOf(s.size,s.pen,ap).toFixed(1),rdp(s.pts,eps).map(q=>Math.round(q[0])+","+Math.round(q[1])).join(" ")];
  });
}
function segDist(px,py,ax,ay,bx,by){
  const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy;
  if(L===0)return Math.hypot(px-ax,py-ay);
  const t=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1);
  return Math.hypot(px-(ax+t*dx),py-(ay+t*dy));
}
function hitsStroke(s,x,y,rad){
  const p=s.pts,r=rad+s.size/2;
  if(p.length===1)return Math.hypot(p[0][0]-x,p[0][1]-y)<=r;
  for(let i=1;i<p.length;i++)if(segDist(x,y,p[i-1][0],p[i-1][1],p[i][0],p[i][1])<=r)return true;
  return false;
}
function resample(pts,step){
  const out=[[pts[0][0],pts[0][1]]];let acc=0;
  for(let i=1;i<pts.length;i++){
    let x0=pts[i-1][0],y0=pts[i-1][1];const x1=pts[i][0],y1=pts[i][1];
    let d=Math.hypot(x1-x0,y1-y0);
    while(acc+d>=step){
      const t=(step-acc)/d;x0+=(x1-x0)*t;y0+=(y1-y0)*t;out.push([x0,y0]);d=Math.hypot(x1-x0,y1-y0);acc=0;
    }
    acc+=d;
  }
  return out;
}
/* Is this stroke already a straight line (so holding the pen still may turn it into a perfect one)? Same rule the board uses, kept here so it can be tested.
   pts are world points; z is the zoom, so the rule is the same on screen at any zoom. */
function straightOf(pts,z){
  z=z||1;const p=pts.map(q=>[q[0]*z,q[1]*z]);
  if(p.length<8)return null;
  const A0=p[0],B0=p[p.length-1],L=Math.hypot(B0[0]-A0[0],B0[1]-A0[1]);
  if(L<90)return null;
  let path=0,dev=0;const ux=(B0[0]-A0[0])/L,uy=(B0[1]-A0[1])/L;
  for(let i=0;i<p.length;i++){
    if(i)path+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);
    dev=Math.max(dev,Math.abs((p[i][0]-A0[0])*uy-(p[i][1]-A0[1])*ux));
  }
  if(path>L*1.18||dev>Math.max(3,L*0.028))return null;
  return true;
}

/* ---------- shape recognition: what a stroke was meant to be, for "hold the pen still and it snaps" ----------
   pts are world points; z is the zoom, so every size rule is the same on screen at any zoom.
   Returns null (leave the stroke alone) or {type, pts, closed, lock} with the ideal shape in world points:
   line | circle | ellipse | square | rect | triangle | quad. Handwriting must NOT be turned into a shape: strokes that are small, or
   that do not match one shape closely, are left alone. */
function polyLen(p){let L=0;for(let i=1;i<p.length;i++)L+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return L}
function distToPoly(px,py,V,closed){
  let m=1e9;const n=V.length;
  for(let i=0;i<(closed?n:n-1);i++){const a=V[i],b=V[(i+1)%n];const d=segDist(px,py,a[0],a[1],b[0],b[1]);if(d<m)m=d}
  return m;
}
function meanDist(p,V,closed){let t=0;for(const q of p)t+=distToPoly(q[0],q[1],V,closed);return t/p.length}
function angleAt(V,i){
  const n=V.length,a=V[(i+n-1)%n],b=V[i],c=V[(i+1)%n];
  const v1x=a[0]-b[0],v1y=a[1]-b[1],v2x=c[0]-b[0],v2y=c[1]-b[1],m=Math.hypot(v1x,v1y)*Math.hypot(v2x,v2y);
  if(!m)return Math.PI;
  return Math.acos(clamp((v1x*v2x+v1y*v2y)/m,-1,1));
}
/* a rounded corner is drawn as a few short edges: replace each such run with the single corner where the long edges on either side would meet */
function mergeShort(V,D){
  for(let guard=0;guard<30&&V.length>3;guard++){
    let bi=-1,bl=1e9;const n=V.length;
    for(let i=0;i<n;i++){const a=V[i],b=V[(i+1)%n],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(l<bl){bl=l;bi=i}}
    if(bl>=D*0.13)break;
    const a=V[bi],b=V[(bi+1)%n],p0=V[(bi+n-1)%n],p3=V[(bi+2)%n];
    const d1x=a[0]-p0[0],d1y=a[1]-p0[1],d2x=p3[0]-b[0],d2y=p3[1]-b[1],den=d1x*d2y-d1y*d2x;
    let X=null;
    if(Math.abs(den)>1e-6){const t=((b[0]-p0[0])*d2y-(b[1]-p0[1])*d2x)/den;X=[p0[0]+d1x*t,p0[1]+d1y*t];if(Math.hypot(X[0]-a[0],X[1]-a[1])>D*0.35)X=null}
    if(!X)X=[(a[0]+b[0])/2,(a[1]+b[1])/2];
    V[bi]=X;V.splice((bi+1)%n,1);
  }
  return V;
}
/* nearly flat or upright edges become exactly flat or upright */
function levelEdges(V){
  const n=V.length,T=5*Math.PI/180;
  for(let i=0;i<n;i++){
    const a=V[i],b=V[(i+1)%n],ang=Math.atan2(b[1]-a[1],b[0]-a[0]),r=Math.abs(((ang%Math.PI)+Math.PI)%Math.PI);
    if(r<T||r>Math.PI-T){const y=(a[1]+b[1])/2;a[1]=y;b[1]=y}
    else if(Math.abs(r-Math.PI/2)<T){const x=(a[0]+b[0])/2;a[0]=x;b[0]=x}
  }
  return V;
}
function shapeOf(pts,z){
  z=z||1;
  if(!pts||pts.length<8)return null;
  const raw=pts.map(q=>[q[0]*z,q[1]*z]);
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const q of raw){if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1]}
  const D=Math.hypot(x1-x0,y1-y0),P=polyLen(raw);
  if(D<56||P<70)return null;                       // too small to be a deliberate shape: ordinary handwriting
  const p=resample(raw,Math.max(3,P/120));
  {const e=raw[raw.length-1],l=p[p.length-1];if(Math.hypot(e[0]-l[0],e[1]-l[1])>2)p.push([e[0],e[1]])}
  if(p.length<8)return null;
  const A=p[0],B=p[p.length-1],gap=Math.hypot(B[0]-A[0],B[1]-A[1]);
  const out=(type,V,closed,lock,axis)=>({type,closed:!!closed,lock:!!lock,axis:axis!==false,pts:V.map(q=>[q[0]/z,q[1]/z])});
  /* a straight line: allowed to be a little bowed (a hand is not a ruler) */
  if(gap>=48&&P<=gap*1.3){
    const ux=(B[0]-A[0])/gap,uy=(B[1]-A[1])/gap;let dev=0;
    for(const q of p)dev=Math.max(dev,Math.abs((q[0]-A[0])*uy-(q[1]-A[1])*ux));
    if(dev<=Math.max(5,gap*0.07)){
      let ex=B[0],ey=B[1];
      const ang=Math.atan2(ey-A[1],ex-A[0]),q4=Math.PI/4,n=Math.round(ang/q4);
      if(Math.abs(ang-n*q4)<0.1){ex=A[0]+Math.cos(n*q4)*gap;ey=A[1]+Math.sin(n*q4)*gap}   // within 6 degrees of flat, upright or 45: exact
      return out("line",[A,[ex,ey]],false,false);
    }
    return null;
  }
  /* everything else must be a closed shape: the end comes back near the start */
  if(gap>Math.max(18,P*0.22))return null;
  /* ellipse / circle: fitted in the stroke's own axes */
  let best=null;
  {
    let mx=0,my=0;for(const q of p){mx+=q[0];my+=q[1]}mx/=p.length;my/=p.length;
    let cxx=0,cyy=0,cxy=0;for(const q of p){const dx=q[0]-mx,dy=q[1]-my;cxx+=dx*dx;cyy+=dy*dy;cxy+=dx*dy}
    let th=0.5*Math.atan2(2*cxy,cxx-cyy);
    const near=(t,k)=>Math.abs(Math.atan2(Math.sin(t-k),Math.cos(t-k)))<0.14;   // within 8 degrees
    if(near(th,0)||near(th,Math.PI)||near(th,-Math.PI))th=0;else if(near(th,Math.PI/2)||near(th,-Math.PI/2))th=Math.PI/2;
    const c=Math.cos(th),s=Math.sin(th);
    let mnU=1e9,mxU=-1e9,mnV=1e9,mxV=-1e9;
    for(const q of p){const u=(q[0]-mx)*c+(q[1]-my)*s,v=-(q[0]-mx)*s+(q[1]-my)*c;if(u<mnU)mnU=u;if(u>mxU)mxU=u;if(v<mnV)mnV=v;if(v>mxV)mxV=v}
    let a=(mxU-mnU)/2,b=(mxV-mnV)/2;const cu=(mxU+mnU)/2,cv=(mxV+mnV)/2;
    if(a>=14&&b>=14){
      let err=0;for(const q of p){const u=(q[0]-mx)*c+(q[1]-my)*s-cu,v=-(q[0]-mx)*s+(q[1]-my)*c-cv;err+=Math.abs(Math.hypot(u/a,v/b)-1)}
      err=err/p.length*(a+b)/2;
      const ccx=mx+cu*c-cv*s,ccy=my+cu*s+cv*c;
      let circle=Math.abs(a-b)/Math.max(a,b)<0.13;
      if(circle){const r=(a+b)/2;a=r;b=r}
      const V=[];for(let i=0;i<=72;i++){const f=i/72*Math.PI*2,u=Math.cos(f)*a,v=Math.sin(f)*b;V.push([ccx+u*c-v*s,ccy+u*s+v*c])}
      best={kind:"ell",err:err/D,res:out(circle?"circle":"ellipse",V,true,circle,circle||th===0||th===Math.PI/2)};
    }
  }
  /* polygon: the corners of the stroke (a stroke that starts mid-side has a false corner at its start, which is removed) */
  let poly=null;
  {
    let V=rdp(p,Math.max(4,D*0.06)).map(q=>q.slice(0,2));
    if(V.length>2&&Math.hypot(V[V.length-1][0]-V[0][0],V[V.length-1][1]-V[0][1])<Math.max(12,D*0.12))V.pop();
    V=mergeShort(V,D);
    let changed=true;
    while(changed&&V.length>3){changed=false;for(let i=0;i<V.length;i++){if(angleAt(V,i)>155*Math.PI/180){V.splice(i,1);changed=true;break}}}
    if(V.length===3||V.length===4){
      const err=meanDist(p,V,true)/D;
      let minAng=9;for(let i=0;i<V.length;i++)minAng=Math.min(minAng,angleAt(V,i));
      if(minAng>=20*Math.PI/180){
        if(V.length===4){
          let right=true;for(let i=0;i<4;i++)if(Math.abs(angleAt(V,i)-Math.PI/2)>25*Math.PI/180)right=false;
          if(right){
            /* a rectangle: turned to the stroke's own direction, or exactly upright when it is nearly upright */
            let sx=0,sy=0;for(let i=0;i<4;i++){const a=V[i],b=V[(i+1)%4],ang=Math.atan2(b[1]-a[1],b[0]-a[0]),l=Math.hypot(b[0]-a[0],b[1]-a[1]);sx+=Math.cos(4*ang)*l;sy+=Math.sin(4*ang)*l}
            let th=Math.atan2(sy,sx)/4;
            if(Math.abs(th)<8*Math.PI/180)th=0;
            const c=Math.cos(th),s=Math.sin(th);
            let mnU=1e9,mxU=-1e9,mnV=1e9,mxV=-1e9;
            for(const q of V){const u=q[0]*c+q[1]*s,v=-q[0]*s+q[1]*c;if(u<mnU)mnU=u;if(u>mxU)mxU=u;if(v<mnV)mnV=v;if(v>mxV)mxV=v}
            let w=mxU-mnU,h=mxV-mnV;const cu=(mxU+mnU)/2,cv=(mxV+mnV)/2;
            const square=Math.abs(w-h)/Math.max(w,h)<0.12;if(square){w=h=(w+h)/2}
            const R=[[-1,-1],[1,-1],[1,1],[-1,1],[-1,-1]].map(([i,j])=>{const u=cu+i*w/2,v=cv+j*h/2;return [u*c-v*s,u*s+v*c]});
            const e2=meanDist(p,R,true)/D;
            if(e2<0.06)poly={err:e2,res:out(square?"square":"rect",R,true,square,th===0)};
          }
        }
        if(!poly){
          const W=levelEdges(V.map(q=>q.slice()));
          poly={err:err,res:out(V.length===3?"triangle":"quad",W.concat([W[0]]),true,false)};
        }
      }
    }
  }
  if(poly&&poly.err<0.04&&(!best||poly.err<=best.err||best.err>0.03))return poly.res;
  if(best&&best.err<0.032)return best.res;
  return null;
}
/* A scribble must be a VERY deliberate scrub: at least 12 alternating U-turns (zig-zag / hatching, not loops),
   long, dense. Plain handwriting (loops, humps, cursive) never qualifies. */
function scribbleOf(pts){
  if(pts.length<40)return null;
  const rs=resample(pts,8);
  const n=rs.length;if(n<44)return null;
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9,len=0;
  for(let i=0;i<n;i++){minx=Math.min(minx,rs[i][0]);maxx=Math.max(maxx,rs[i][0]);miny=Math.min(miny,rs[i][1]);maxy=Math.max(maxy,rs[i][1]);if(i)len+=Math.hypot(rs[i][0]-rs[i-1][0],rs[i][1]-rs[i-1][1])}
  const diag=Math.hypot(maxx-minx,maxy-miny);
  if(len<600||len<diag*3.2||diag>1100)return null;
  /* Count back-and-forth sweeps along the stroke's main direction. A real scrub goes to and fro across about the same distance again and again;
     handwriting (loops, humps, cursive, a circle or two) moves forward while it wiggles, so it never makes enough full sweeps. */
  let mx=0,my=0;for(const q of rs){mx+=q[0];my+=q[1]}mx/=n;my/=n;
  let sxx=0,syy=0,sxy=0;for(const q of rs){const dx=q[0]-mx,dy=q[1]-my;sxx+=dx*dx;syy+=dy*dy;sxy+=dx*dy}
  const th=0.5*Math.atan2(2*sxy,sxx-syy),ux=Math.cos(th),uy=Math.sin(th);
  const tp=rs.map(q=>(q[0]-mx)*ux+(q[1]-my)*uy);
  let tmin=1e9,tmax=-1e9;for(const v of tp){tmin=Math.min(tmin,v);tmax=Math.max(tmax,v)}
  const thr=Math.max(14,0.55*(tmax-tmin));
  let rev=0,dir=0,ext=tp[0];
  for(let i=1;i<n;i++){
    const v=tp[i];
    if(dir>=0&&v>ext){ext=v;if(dir===0&&v-tp[0]>=thr)dir=1}
    else if(dir<=0&&v<ext){ext=v;if(dir===0&&tp[0]-v>=thr)dir=-1}
    if(dir===1){if(v>ext)ext=v;else if(ext-v>=thr){rev++;dir=-1;ext=v}}
    else if(dir===-1){if(v<ext)ext=v;else if(v-ext>=thr){rev++;dir=1;ext=v}}
  }
  if(rev<12)return null;
  const pad=8,area=(maxx-minx+2*pad)*(maxy-miny+2*pad);
  const r=clamp(0.55*area/len+1.5,9,17);   // how far from the scribble line still counts as "under" it
  return {rs,box:[minx,miny,maxx,maxy],r};
}
/* Build a mask of everything the scribble covers, then find strokes that are mostly inside it. */
function coveredStrokes(strokes,sc){
  const cell=5,gx0=sc.box[0]-sc.r-4,gy0=sc.box[1]-sc.r-4;
  const gw=Math.ceil((sc.box[2]-sc.box[0]+2*sc.r+8)/cell)+1,gh=Math.ceil((sc.box[3]-sc.box[1]+2*sc.r+8)/cell)+1;
  const mask=new Uint8Array(gw*gh),rc=Math.ceil(sc.r/cell);
  const stamp=(x,y)=>{
    const cx=Math.round((x-gx0)/cell),cy=Math.round((y-gy0)/cell);
    for(let j=-rc;j<=rc;j++)for(let i=-rc;i<=rc;i++){
      if(Math.hypot(i*cell,j*cell)>sc.r)continue;
      const X=cx+i,Y=cy+j;if(X>=0&&Y>=0&&X<gw&&Y<gh)mask[Y*gw+X]=1;
    }
  };
  const fine=resample(sc.rs,cell);
  for(const q of fine)stamp(q[0],q[1]);
  const inMask=(x,y)=>{const X=Math.round((x-gx0)/cell),Y=Math.round((y-gy0)/cell);return X>=0&&Y>=0&&X<gw&&Y<gh&&mask[Y*gw+X]===1};
  return strokes.filter(s=>{
    const sp=s.pts.length>1?resample(s.pts,5):[[s.pts[0][0],s.pts[0][1]]];
    let inn=0,inb=0;const bx0=sc.box[0]-6,by0=sc.box[1]-6,bx1=sc.box[2]+6,by1=sc.box[3]+6;
    for(const q of sp){if(inMask(q[0],q[1]))inn++;if(q[0]>=bx0&&q[0]<=bx1&&q[1]>=by0&&q[1]<=by1)inb++}
    return inn/sp.length>=0.6&&inb/sp.length>=0.85;   // mostly under the scribble AND mostly inside its box (never neighbours outside)
  });
}
/* ---------- smooth ink ----------
   Raw pen samples are noisy and uneven. For every redraw we rebuild the stroke from them:
   1) resample to an even 2.4-unit spacing (so smoothing does not depend on how fast you write),
   2) Gaussian-blur the path with its ends anchored (kills jitter, keeps handwriting shapes),
   4) smooth the pressure width and taper the ends, 5) fill ONE outline polygon (no seams, crisp anti-aliased edge).
   Live drawing and the saved/redrawn ink use this exact same code, so nothing "pops" when you lift the pen. */
const STEP=2.4;
function kern(sg){const R=Math.ceil(sg*3),k=[];let t=0;for(let i=-R;i<=R;i++){const v=Math.exp(-(i*i)/(2*sg*sg));k.push(v);t+=v}return {R,k:k.map(v=>v/t)}}
const KS=kern(2.0),KL=kern(5.5);
function gauss(a,K){ // Gaussian blur along the path; ends stay anchored (point-reflected padding)
  const m=a.length,o=new Float64Array(m),R=K.R;
  for(let i=0;i<m;i++){
    let t=0;
    for(let j=-R;j<=R;j++){
      let q=i+j,v;
      if(q<0)v=2*a[0]-a[Math.min(m-1,-q)];else if(q>=m)v=2*a[m-1]-a[Math.max(0,2*(m-1)-q)];else v=a[q];
      t+=v*K.k[j+R];
    }
    o[i]=t;
  }
  o[0]=a[0];o[m-1]=a[m-1];return o;
}
/* Gentle blur everywhere (keeps letter shapes), much stronger blur where the path is nearly straight or lazily curved
   (underlines, fraction bars, minus signs, long arcs), so those come out clean however shaky the input was. */
function smoothPath(rx,ry){
  const m=rx.length,sx=gauss(rx,KS),sy=gauss(ry,KS);
  if(m<24)return [sx,sy];
  const lx=gauss(rx,KL),ly=gauss(ry,KL),t=new Float64Array(m),H=6;
  for(let i=0;i<m;i++){
    const a=Math.max(0,i-H),b=Math.min(m-1,i+H);
    const ux=sx[i]-sx[a],uy=sy[i]-sy[a],vx=sx[b]-sx[i],vy=sy[b]-sy[i];
    const mu=Math.hypot(ux,uy),mv=Math.hypot(vx,vy);
    const ang=(mu>1e-6&&mv>1e-6)?Math.acos(clamp((ux*vx+uy*vy)/(mu*mv),-1,1)):0;
    t[i]=clamp(1-ang/0.75,0,1);
  }
  const ts=new Float64Array(m);
  for(let i=0;i<m;i++){let q=0,c=0;for(let j=Math.max(0,i-5);j<=Math.min(m-1,i+5);j++){q+=t[j];c++}ts[i]=q/c}
  const ox=new Float64Array(m),oy=new Float64Array(m);
  for(let i=0;i<m;i++){ox[i]=sx[i]*(1-ts[i])+lx[i]*ts[i];oy[i]=sy[i]*(1-ts[i])+ly[i]*ts[i]}
  ox[0]=rx[0];oy[0]=ry[0];ox[m-1]=rx[m-1];oy[m-1]=ry[m-1];
  return [ox,oy];
}
function smoothStroke(raw,size,pen){
  const n=raw.length;
  if(n<2)return {dot:true,x:raw[0][0],y:raw[0][1],w:wOf(size,pen,raw[0][2])};
  // resample the raw samples to an even spacing (carrying pressure)
  let rx=[raw[0][0]],ry=[raw[0][1]],rp=[raw[0][2]],rsp=[0],acc=0;
  for(let i=1;i<n;i++){
    let x0=raw[i-1][0],y0=raw[i-1][1];const x1=raw[i][0],y1=raw[i][1];
    let d=Math.hypot(x1-x0,y1-y0);const seg=d;
    while(d>0&&acc+d>=STEP){
      const t=(STEP-acc)/d;x0+=(x1-x0)*t;y0+=(y1-y0)*t;
      rx.push(x0);ry.push(y0);rp.push(raw[i-1][2]+(raw[i][2]-raw[i-1][2])*t);rsp.push(seg);
      d=Math.hypot(x1-x0,y1-y0);acc=0;
    }
    acc+=d;
  }
  if(Math.hypot(rx[rx.length-1]-raw[n-1][0],ry[ry.length-1]-raw[n-1][1])>0.4){rx.push(raw[n-1][0]);ry.push(raw[n-1][1]);rp.push(raw[n-1][2]);rsp.push(rsp[rsp.length-1])}
  const m=rx.length;
  if(m<3)return {dot:true,x:(rx[0]+rx[m-1])/2,y:(ry[0]+ry[m-1])/2,w:wOf(size,pen,rp[0])};
  const ox=rx,oy=ry;
  [rx,ry]=smoothPath(rx,ry);
  // writing fast (big gaps between samples): jitter is tiny next to the motion, so keep more of the real curve
  if(m>8){
    const f=new Float64Array(m);
    for(let i=0;i<m;i++)f[i]=clamp((rsp[i]-10)/32,0,0.5);
    for(let i=0;i<m;i++){let q=0,c=0;for(let j=Math.max(0,i-4);j<=Math.min(m-1,i+4);j++){q+=f[j];c++}const g=q/c;rx[i]=rx[i]*(1-g)+ox[i]*g;ry[i]=ry[i]*(1-g)+oy[i]*g}
  }
  let w=rp.map(p=>wOf(size,pen,p));
  for(let pass=0;pass<2;pass++){
    const o=new Array(m),R=Math.min(8,m>>1);
    for(let i=0;i<m;i++){let t=0,c=0;for(let j=Math.max(0,i-R);j<=Math.min(m-1,i+R);j++){t+=w[j];c++}o[i]=t/c}
    w=o;
  }
  if(m>10)for(let i=0;i<6;i++){const f=0.55+0.45*(i/6);w[i]*=f;w[m-1-i]*=f}
  return {x:Array.from(rx),y:Array.from(ry),w:w};
}
function fillStroke(c,sm,col,k){
  c.fillStyle=col;
  if(sm.dot){c.beginPath();c.arc(sm.x*k,sm.y*k,Math.max(0.7,sm.w*k/2),0,6.2832);c.fill();return}
  const n=sm.x.length,L=new Array(n),Rr=new Array(n),H=new Array(n),T=new Array(n);
  for(let i=0;i<n;i++){
    const a=Math.max(0,i-1),b=Math.min(n-1,i+1);
    let tx=sm.x[b]-sm.x[a],ty=sm.y[b]-sm.y[a];const mm=Math.hypot(tx,ty)||1;tx/=mm;ty/=mm;
    const h=Math.max(0.45,sm.w[i]*k/2),x=sm.x[i]*k,y=sm.y[i]*k;
    L[i]=[x-ty*h,y+tx*h];Rr[i]=[x+ty*h,y-tx*h];H[i]=h;T[i]=Math.atan2(ty,tx);
  }
  c.beginPath();c.moveTo(L[0][0],L[0][1]);
  for(let i=1;i<n;i++)c.lineTo(L[i][0],L[i][1]);
  const e=n-1;
  c.arc(sm.x[e]*k,sm.y[e]*k,H[e],T[e]+1.5708,T[e]-1.5708,true);
  for(let i=n-1;i>=0;i--)c.lineTo(Rr[i][0],Rr[i][1]);
  c.arc(sm.x[0]*k,sm.y[0]*k,H[0],T[0]-1.5708,T[0]+1.5708,true);
  c.closePath();c.fill();
}
/* Geometry for the board: a cached Path2D per stroke, in world units. Handwriting is smoothed and filled as one outline;
   geometric strokes (Claude's diagrams) keep their corners and are stroked. */
function buildPath(s){
  const pts=s.pts;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const q of pts){if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1]}
  const pad=s.size*1.6+2;s.bb=[x0-pad,y0-pad,x1+pad,y1+pad];
  const P=new Path2D();
  if(s.g||s.hl){
    P.moveTo(pts[0][0],pts[0][1]);
    if(pts.length===1)P.lineTo(pts[0][0]+0.01,pts[0][1]);
    for(let i=1;i<pts.length;i++)P.lineTo(pts[i][0],pts[i][1]);
    s._p={path:P,kind:"stroke",w:s.size};return s._p;
  }
  const sm=s.pre?(pts.length<2?{dot:true,x:pts[0][0],y:pts[0][1],w:pts[0][2]}:{x:pts.map(q=>q[0]),y:pts.map(q=>q[1]),w:pts.map(q=>q[2])}):smoothStroke(pts,s.size,s.pen);
  if(sm.dot){P.arc(sm.x,sm.y,Math.max(0.7,sm.w/2),0,6.2832);s._p={path:P,kind:"fill"};return s._p}
  const n=sm.x.length,L=new Array(n),Rr=new Array(n),H=new Array(n),T=new Array(n);
  for(let i=0;i<n;i++){
    const a=Math.max(0,i-1),b=Math.min(n-1,i+1);
    let tx=sm.x[b]-sm.x[a],ty=sm.y[b]-sm.y[a];const mm=Math.hypot(tx,ty)||1;tx/=mm;ty/=mm;
    const h=Math.max(0.45,sm.w[i]/2),x=sm.x[i],y=sm.y[i];
    L[i]=[x-ty*h,y+tx*h];Rr[i]=[x+ty*h,y-tx*h];H[i]=h;T[i]=Math.atan2(ty,tx);
  }
  P.moveTo(L[0][0],L[0][1]);
  for(let i=1;i<n;i++)P.lineTo(L[i][0],L[i][1]);
  const e=n-1;
  P.arc(sm.x[e],sm.y[e],H[e],T[e]+1.5708,T[e]-1.5708,true);
  for(let i=n-1;i>=0;i--)P.lineTo(Rr[i][0],Rr[i][1]);
  P.arc(sm.x[0],sm.y[0],H[0],T[0]-1.5708,T[0]+1.5708,true);
  P.closePath();
  s._p={path:P,kind:"fill"};return s._p;
}
function bbOf(s){if(!s.bb)buildPath(s);return s.bb}
window.IB=window.IB||{};
IB.Ink={shapeOf,straightOf,clamp,rdp,wOf,segDist,hitsStroke,resample,scribbleOf,coveredStrokes,smoothStroke,buildPath,bbOf};
})();
