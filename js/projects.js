/* "My other projects": cards are drawn from window.LAW7.projects (js/config.js).
   layout: base | wide | half | third | old.  media = picture/video file, art = drawn stand-in. */
(function(){
  var cfg=window.LAW7||{},list=cfg.projects||[],grid=document.getElementById("pgrid");
  if(!grid||!list.length){var s=document.getElementById("projects");if(s)s.hidden=true;return}
  var I="#0F1B3D",C="#2A44F5",Y="#FFD93D",R="#E8456B",M="#12A184",L="#E9EEFB",W="#fff";
  var TINT={yellow:"#FFF3A8",blue:"#DCE5FF",mint:"#D4F4EC",pink:"#FFD9E2",lilac:"#E7E0FF"};
  var STATUS={"Running":"ok","Working":"ok","In testing":"build","Early development":"plan","Old":"old"};
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  /* drawn stand-ins for projects that are not public yet (no screenshots exist for them) */
  var ART={
    screen:'<svg viewBox="0 0 320 200" role="img" aria-label="Drawing of the GhostlyScreen lock screen with a small ghost countdown"><rect width="320" height="200" rx="14" fill="'+I+'"/><circle cx="60" cy="40" r="90" fill="#2A44F5" opacity=".18"/><circle cx="270" cy="170" r="80" fill="#E8456B" opacity=".14"/>'
      +'<rect x="104" y="64" width="112" height="72" rx="14" fill="#16265A" stroke="#fff" stroke-opacity=".25" stroke-width="2"/><rect x="146" y="94" width="28" height="22" rx="6" fill="'+Y+'"/><path d="M152 94v-6a8 8 0 0 1 16 0v6" fill="none" stroke="'+Y+'" stroke-width="4" stroke-linecap="round"/><circle cx="160" cy="105" r="3" fill="'+I+'"/>'
      +'<text x="160" y="156" text-anchor="middle" style="font-family:var(--body)" font-size="11" fill="#fff" opacity=".7">type your password</text>'
      +'<g transform="translate(262 34)"><circle r="19" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="4"/><circle r="19" fill="none" stroke="'+Y+'" stroke-width="4" stroke-linecap="round" stroke-dasharray="86 120" transform="rotate(-90)"/><path d="M-8 9V-2a8 8 0 0 1 16 0V9l-3-2.4-2.6 2.4-2.4-2.4-2.6 2.4z" fill="#fff"/><circle cx="-3" cy="-1.5" r="1.4" fill="'+I+'"/><circle cx="3" cy="-1.5" r="1.4" fill="'+I+'"/></g>'
      +'<text x="262" y="68" text-anchor="middle" style="font-family:var(--body)" font-weight="700" font-size="11" fill="'+Y+'">0:15</text></svg>',
    tools:'<svg viewBox="0 0 320 200" role="img" aria-label="Drawing of the GhostlyTools settings panel"><rect width="320" height="200" rx="14" fill="'+L+'"/><rect x="20" y="20" width="280" height="160" rx="12" fill="#fff" stroke="'+I+'" stroke-width="2.5"/>'
      +'<g style="font-family:var(--body)" font-size="12" font-weight="700" fill="'+I+'"><text x="38" y="52">Cooldown</text><text x="38" y="92">Auto-lock</text><text x="38" y="132">Hotkey</text></g>'
      +'<rect x="150" y="38" width="130" height="8" rx="4" fill="'+L+'"/><rect x="150" y="38" width="48" height="8" rx="4" fill="'+C+'"/><circle cx="198" cy="42" r="8" fill="#fff" stroke="'+C+'" stroke-width="3"/><text x="266" y="64" style="font-family:var(--body)" font-size="10" fill="#5B6786">15 s</text>'
      +'<rect x="150" y="78" width="130" height="8" rx="4" fill="'+L+'"/><rect x="150" y="78" width="74" height="8" rx="4" fill="'+C+'"/><circle cx="224" cy="82" r="8" fill="#fff" stroke="'+C+'" stroke-width="3"/><text x="262" y="104" style="font-family:var(--body)" font-size="10" fill="#5B6786">5 min</text>'
      +'<rect x="150" y="116" width="130" height="24" rx="7" fill="'+L+'"/><text x="215" y="132" text-anchor="middle" style="font-family:var(--body)" font-size="10.5" font-weight="700" fill="'+I+'">Ctrl+Shift+Alt+L</text>'
      +'<rect x="38" y="150" width="34" height="16" rx="8" fill="'+M+'"/><circle cx="64" cy="158" r="6" fill="#fff"/><text x="80" y="162" style="font-family:var(--body)" font-size="10" fill="#5B6786">screensaver on</text></svg>',
    matter:'<svg viewBox="0 0 320 200" role="img" aria-label="Drawing of a chat with Matter, the planned assistant"><rect width="320" height="200" rx="14" fill="#FFF5F8"/><rect x="2" y="2" width="316" height="196" rx="13" fill="none" stroke="'+R+'" stroke-width="2.5" stroke-dasharray="7 7"/>'
      +'<circle cx="64" cy="60" r="26" fill="'+I+'"/><text x="64" y="70" text-anchor="middle" style="font-family:var(--head)" font-weight="800" font-size="30" fill="'+Y+'">M</text>'
      +'<rect x="104" y="40" width="170" height="40" rx="14" fill="#fff" stroke="'+I+'" stroke-width="2.5"/><g fill="'+I+'"><circle cx="164" cy="60" r="4"/><circle cx="189" cy="60" r="4"/><circle cx="214" cy="60" r="4"/></g>'
      +'<rect x="150" y="104" width="144" height="34" rx="14" fill="'+C+'"/><rect x="168" y="118" width="108" height="6" rx="3" fill="#fff" opacity=".85"/>'
      +'<text x="160" y="176" text-anchor="middle" style="font-family:var(--hand)" font-size="20" fill="'+R+'">still just an idea</text></svg>',
    gate:'<svg viewBox="0 0 320 200" role="img" aria-label="Drawing of the Study Hub password screen"><rect width="320" height="200" rx="14" fill="#101224"/><rect x="108" y="30" width="104" height="104" rx="22" fill="#232A66" opacity=".6"/>'
      +'<rect x="140" y="42" width="40" height="40" rx="11" fill="#3B3FD1"/><path d="M150 54h9a3 3 0 0 1 3 3v12h-9a3 3 0 0 0-3 3zM170 54h-9a3 3 0 0 0-3 3v12h9a3 3 0 0 1 3 3z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" opacity=".9"/>'
      +'<text x="160" y="104" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="15" fill="#fff">Study Hub</text><text x="160" y="118" text-anchor="middle" style="font-family:var(--body)" font-size="8" letter-spacing="1.4" fill="#fff" opacity=".55">AAPS · IGCSE RESOURCES</text>'
      +'<rect x="76" y="144" width="168" height="22" rx="7" fill="#1A1E3F" stroke="#fff" stroke-opacity=".15"/><g fill="#fff" opacity=".6"><circle cx="92" cy="155" r="3"/><circle cx="104" cy="155" r="3"/><circle cx="116" cy="155" r="3"/><circle cx="128" cy="155" r="3"/></g>'
      +'<rect x="76" y="172" width="168" height="18" rx="7" fill="#3B3FD1"/></svg>'
  };
  function media(p){
    if(p.media){
      if(/\.(mp4|webm)$/i.test(p.media))return '<video src="'+esc(p.media)+'" autoplay muted loop playsinline aria-label="'+esc(p.alt||p.name)+'"></video>';
      return '<img src="'+esc(p.media)+'" alt="'+esc(p.alt||p.name)+'" loading="lazy" decoding="async">';
    }
    return p.art&&ART[p.art]?ART[p.art]:"";
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
      el.innerHTML='<div class="pmedia">'+media(p)+'</div><div class="pbody">'+head+'<p>'+esc(p.blurb)+'</p>'+tags+go+'</div>';
    }
    grid.appendChild(el);
  });
})();
