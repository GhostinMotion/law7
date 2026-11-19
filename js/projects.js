/* "My other projects": cards are drawn from window.LAW7.projects (js/config.js).
   layout: base | wide | half | five | four | three | old.  media = real picture/video file; no media = text-only card. */
(function(){
  var cfg=window.LAW7||{},list=cfg.projects||[],grid=document.getElementById("pgrid");
  if(!grid||!list.length)return;
    var TINT={yellow:"#FFF3A8",blue:"#DCE5FF",mint:"#D4F4EC",pink:"#FFD9E2",lilac:"#E7E0FF"};
  var STATUS={"Running":"ok","Working":"ok","In testing":"build","Early development":"plan","Old":"old"};
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function media(p){
    if(p.media){
      if(/\.(mp4|webm)$/i.test(p.media))return '<video src="'+esc(p.media)+'" autoplay muted loop playsinline aria-label="'+esc(p.alt||p.name)+'"></video>';
      return '<img src="'+esc(p.media)+'" alt="'+esc(p.alt||p.name)+'" loading="lazy" decoding="async">';
    }
    return "";
  }
  list.forEach(function(p,i){
    var lay=p.layout||"third",tag=p.url?"a":"article",el=document.createElement(tag),st=STATUS[p.status]||"build";
    el.className="pcard "+lay+(p.url?" link":"");
    el.style.setProperty("--tint",TINT[p.tint]||TINT.blue);el.style.setProperty("--tilt",(i%2?1:-1)*0.6+"deg");
    if(p.url){el.href=p.url;el.target="_blank";el.rel="noopener"}
    var head='<div class="ptop"><h3>'+esc(p.name)+'</h3><span class="pst '+st+'">'+esc(p.status||"Building")+'</span></div>';
    var tags=p.tags&&p.tags.length?'<ul class="ptags">'+p.tags.map(function(t){return "<li>"+esc(t)+"</li>"}).join("")+'</ul>':"";
    var go=p.url?'<span class="pgo">'+esc(p.go||"Open")+' ↗</span>':"";
    if(lay==="base"){
      var serves=(p.serves||[]).map(function(n){return '<li>'+esc(n)+'</li>'}).join("");
      el.innerHTML='<div class="pbody">'+head+'<p>'+esc(p.blurb)+'</p>'+tags+'</div>'
        +'<div class="bbus" aria-hidden="true"><span class="core">Server</span><ul>'+serves+'<li class="more">+ the rest</li></ul></div>';
    }else{
      var m=media(p);if(!m)el.className+=" nopic";el.innerHTML=(m?'<div class="pmedia">'+m+'</div>':"")+'<div class="pbody">'+head+'<p>'+esc(p.blurb)+'</p>'+tags+go+'</div>';
    }
    grid.appendChild(el);
  });
})();
