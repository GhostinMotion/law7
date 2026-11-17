/* "My other projects": the cards are drawn from the list in js/config.js (window.LAW7.projects).
   Add a project there and it shows up here. Give it a url and the whole card becomes a link. */
(function(){
  var cfg=window.LAW7||{},list=cfg.projects||[],grid=document.getElementById("pgrid");
  if(!grid||!list.length){var s=document.getElementById("projects");if(s)s.hidden=true;return}
  var I="#0F1B3D",C="#2A44F5",Y="#FFD93D",R="#E8456B",M="#12A184",L="#E9EEFB",W="#fff";
  var S='stroke="'+I+'" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"';
  var ICONS={
    accountable:'<circle cx="30" cy="38" r="19" fill="'+W+'" '+S+'/><rect x="25" y="9" width="10" height="7" rx="2" fill="'+I+'"/><path d="M30 38V26" fill="none" '+S+'/><path d="M30 38l8 5" fill="none" stroke="'+C+'" stroke-width="3.2" stroke-linecap="round"/><circle cx="48" cy="17" r="10" fill="'+M+'" '+S+'/><path d="M43.5 17.5l3.2 3.2 5.6-6.6" fill="none" stroke="'+W+'" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>',
    ghost:'<path d="M14 54V31a18 18 0 0 1 36 0v23l-6-5-6 5-6-5-6 5-6-5z" fill="'+W+'" '+S+'/><circle cx="25.5" cy="31" r="3.2" fill="'+I+'"/><circle cx="38.5" cy="31" r="3.2" fill="'+I+'"/><path d="M28 39q4 3.4 8 0" fill="none" '+S+'/><circle cx="21" cy="38" r="2.6" fill="'+R+'" opacity=".7"/><circle cx="43" cy="38" r="2.6" fill="'+R+'" opacity=".7"/>',
    server:'<rect x="9" y="10" width="46" height="18" rx="5" fill="'+W+'" '+S+'/><rect x="9" y="34" width="46" height="18" rx="5" fill="'+W+'" '+S+'/><circle cx="18" cy="19" r="3" fill="'+M+'"/><circle cx="18" cy="43" r="3" fill="'+Y+'" stroke="'+I+'" stroke-width="2"/><path d="M28 19h19M28 43h19" fill="none" '+S+'/><path d="M32 28v6" fill="none" '+S+'/>',
    remote:'<rect x="7" y="10" width="50" height="35" rx="6" fill="'+W+'" '+S+'/><path d="M24 55h16M32 45v10" fill="none" '+S+'/><path d="M32 18v10" fill="none" stroke="'+C+'" stroke-width="4" stroke-linecap="round"/><path d="M24 22.5a11 11 0 1 0 16 0" fill="none" stroke="'+C+'" stroke-width="4" stroke-linecap="round"/>',
    screen:'<rect x="7" y="10" width="50" height="35" rx="6" fill="'+I+'" '+S+'/><path d="M24 55h16M32 45v10" fill="none" '+S+'/><path d="M26.5 27v-4.5a5.5 5.5 0 0 1 11 0V27" fill="none" stroke="'+Y+'" stroke-width="3.4" stroke-linecap="round"/><rect x="23" y="26" width="18" height="13" rx="3.5" fill="'+Y+'" stroke="'+W+'" stroke-width="2"/><circle cx="32" cy="32.5" r="2" fill="'+I+'"/>',
    usb:'<rect x="18" y="24" width="28" height="33" rx="6" fill="'+C+'" '+S+'/><rect x="24" y="6" width="16" height="18" rx="2.5" fill="'+L+'" '+S+'/><rect x="28" y="11" width="3.2" height="5" fill="'+I+'"/><rect x="33.2" y="11" width="3.2" height="5" fill="'+I+'"/><rect x="25" y="36" width="14" height="10" rx="2.5" fill="'+Y+'" stroke="'+I+'" stroke-width="2.4"/><path d="M28 41h8" fill="none" stroke="'+I+'" stroke-width="2.4" stroke-linecap="round"/>',
    spike:'<rect x="8" y="24" width="48" height="30" rx="7" fill="'+L+'" '+S+'/><rect x="14" y="30" width="36" height="17" rx="3.5" fill="'+I+'"/><text x="32" y="43.5" text-anchor="middle" font-family="monospace" font-weight="700" font-size="13" fill="'+R+'">0:40</text><circle cx="32" cy="15" r="5.2" fill="'+R+'" '+S+'/><path d="M32 6V3M22 11l-2-2M42 11l2-2" fill="none" stroke="'+R+'" stroke-width="3" stroke-linecap="round"/>',
    plant:'<path d="M32 42V26" fill="none" '+S+'/><path d="M32 31c-11 0-15-7-15-13 9 0 15 4 15 13z" fill="'+M+'" '+S+'/><path d="M32 27c8 0 12-5 12-11-7 0-12 4-12 11z" fill="'+M+'" '+S+'/><path d="M18 42h28l-3.5 15h-21z" fill="'+Y+'" '+S+'/><path d="M52 24c4 5 6.5 8.5 6.5 11.5a6.5 6.5 0 0 1-13 0c0-3 2.5-6.5 6.5-11.5z" fill="'+C+'" '+S+'/>',
    video:'<rect x="5" y="13" width="54" height="38" rx="11" fill="'+R+'" '+S+'/><path d="M26 23l16 9-16 9z" fill="'+W+'" '+S+'/>'
  };
  var TINT={yellow:"#FFF3A8",blue:"#DCE5FF",mint:"#D4F4EC",pink:"#FFD9E2",lilac:"#E7E0FF"};
  var STATUS={Running:"ok",Working:"ok",Building:"build",Prototype:"proto",Planned:"plan"};
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  list.forEach(function(p,i){
    var tag=p.url?"a":"article",el=document.createElement(tag);
    el.className="pcard";el.style.setProperty("--tilt",(i%3===0?-1.6:i%3===1?1.2:-.7)+"deg");
    if(p.url){el.href=p.url;el.target="_blank";el.rel="noopener"}
    el.innerHTML='<div class="pic" style="background:'+(TINT[p.tint]||TINT.blue)+'"><svg viewBox="0 0 64 64" aria-hidden="true">'+(ICONS[p.icon]||ICONS.video)+'</svg></div>'
      +'<div class="pbody"><div class="ptop"><h3>'+esc(p.name)+'</h3><span class="pst '+(STATUS[p.status]||"build")+'">'+esc(p.status||"Building")+'</span></div>'
      +'<p>'+esc(p.blurb)+'</p>'
      +(p.tags&&p.tags.length?'<ul class="ptags">'+p.tags.map(function(t){return "<li>"+esc(t)+"</li>"}).join("")+'</ul>':"")
      +(p.url?'<span class="pgo">Open ↗</span>':"")+'</div>';
    grid.appendChild(el);
  });
})();
