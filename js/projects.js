/* "My other projects": cards are drawn from window.LAW7.projects (js/config.js).
   layout: base | wide | half | six | strip | old.  media = real picture/video file; no media = text-only card. */
(function(){
  var cfg=window.LAW7||{},list=cfg.projects||[],grid=document.getElementById("pgrid");
  if(!grid||!list.length)return;
    var TINT={yellow:"#FFF3A8",blue:"#DCE5FF",mint:"#D4F4EC",pink:"#FFD9E2",lilac:"#E7E0FF"};
  var STATUS={"Running":"ok","Working":"ok","In testing":"build","Early development":"plan","Old":"old"};
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function media(p){
    if(p.media){
      if(/\.(mp4|webm)$/i.test(p.media))return '<video src="'+esc(p.media)+'" autoplay muted loop playsinline aria-label="'+esc(p.alt||p.name)+'"></video>';
      return '<img src="'+esc(p.media)+'"'+(p.hover?' data-poster="'+esc(p.media)+'" data-hover="'+esc(p.hover)+'"':'')+' alt="'+esc(p.alt||p.name)+'" decoding="async">';
    }
    return "";
  }
  list.forEach(function(p,i){
    var lay=p.layout||"third",tag=p.url?"a":"article",el=document.createElement(tag),st=STATUS[p.status]||"build";
    el.className="pcard "+lay+(p.url?" link":"");
    el.style.setProperty("--tint",TINT[p.tint]||TINT.blue);el.style.setProperty("--tilt",(i%2?1:-1)*0.6+"deg");
    if(p.url){el.href=p.url;el.target="_blank";el.rel="noopener"}
    var head='<div class="ptop"><h3>'+esc(p.name)+'</h3><span class="pst '+st+'">'+esc(p.status||"Building")+'</span></div>';
    var tags="";
    var go=p.url?'<span class="pgo">'+esc(p.go||"Open")+' <span class="arr">↗</span></span>':"";
    if(lay==="base"){
      var serves=(p.serves||[]).map(function(n){return '<li>'+esc(n)+'</li>'}).join("");
      el.innerHTML='<div class="pbody">'+head+'<p>'+esc(p.blurb)+'</p>'+tags+'</div>'
        +'<div class="bbus" aria-hidden="true"><span class="core">Server</span><ul>'+serves+'<li class="more">+ the rest</li></ul></div>';
    }else{
      var m=media(p);if(!m)el.className+=" nopic";el.innerHTML=(m?'<div class="pmedia"'+(p.bg?' style="background:'+esc(p.bg)+'"':"")+'>'+m+'</div>':"")+'<div class="pbody">'+head+'<p>'+esc(p.blurb)+'</p>'+tags+go+'</div>';
    }
    if(p.hover)el.className+=" hasgif";
    grid.appendChild(el);
  });

  /* hover pictures: the still shows first; the moving one plays while you hover (or, on touch, while the card is on screen) */
  var cards=[].slice.call(grid.querySelectorAll(".hasgif"));
  function play(card,on){var im=card.querySelector("img[data-hover]");if(!im)return;
    var want=on?im.getAttribute("data-hover"):im.getAttribute("data-poster");
    if(im.getAttribute("src")!==want)im.src=want;card.classList.toggle("playing",!!on)}
  function warm(){cards.forEach(function(c){var im=c.querySelector("img[data-hover]");if(im){var x=new Image();x.src=im.getAttribute("data-hover")}})}
  if("requestIdleCallback" in window)requestIdleCallback(warm,{timeout:3000});else setTimeout(warm,1500);
  var touch=window.matchMedia&&matchMedia("(hover:none)").matches;
  if(!touch){cards.forEach(function(c){
    c.addEventListener("mouseenter",function(){play(c,true)});c.addEventListener("mouseleave",function(){play(c,false)});
    c.addEventListener("focus",function(){play(c,true)});c.addEventListener("blur",function(){play(c,false)});
  })}else if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){play(e.target,e.isIntersecting&&e.intersectionRatio>=0.6)})},{threshold:[0,0.6,1]});
    cards.forEach(function(c){io.observe(c)});
  }
})();
