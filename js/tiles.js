/* "And all the small things that add up": the tiles are drawn from this list. Edit the words here. */
(function(){
  var g=document.getElementById("tiles");if(!g)return;
  var I="#0F1B3D",C="#2A44F5",Y="#FFD93D",R="#E8456B",M="#12A184",L="#E9EEFB",W="#fff";
  var S='stroke="'+I+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  var T=[
    ["Periodic table","Tap any element for its mass, configuration, electronegativity and common oxidation states.","#E7E0FF",'<rect x="5" y="6" width="16" height="16" rx="3" fill="'+Y+'" '+S+'/><rect x="27" y="6" width="16" height="16" rx="3" fill="'+W+'" '+S+'/><rect x="5" y="27" width="16" height="16" rx="3" fill="'+W+'" '+S+'/><rect x="27" y="27" width="16" height="16" rx="3" fill="'+C+'" '+S+'/><path d="M10 14h6" stroke="'+I+'" stroke-width="3" stroke-linecap="round"/>'],
    ["Scientific calculator","Brackets, powers, sin, cos, log, degrees or radians. Nothing leaves the board.","#DCE5FF",'<rect x="8" y="5" width="32" height="38" rx="6" fill="'+W+'" '+S+'/><rect x="13" y="10" width="22" height="9" rx="2" fill="'+L+'" '+S+'/><path d="M15 27h4M29 27h4M15 35h4M29 35h4M22 25v12" stroke="'+C+'" stroke-width="3" stroke-linecap="round"/>'],
    ["Molar mass & moles","Type a formula and get the molar mass and percent composition. Claude uses the same numbers.","#D4F4EC",'<path d="M24 5l15 9v18l-15 9-15-9V14z" fill="'+W+'" '+S+'/><circle cx="24" cy="24" r="4" fill="'+M+'"/><path d="M24 12v8M24 28v8M13 18l7 4M28 26l7 4" stroke="'+I+'" stroke-width="3" stroke-linecap="round"/>'],
    ["Graphs & diagrams","Ask for a graph, a flowchart or a force diagram and Claude draws it next to your work.","#FFF3A8",'<path d="M7 6v34h35" fill="none" '+S+'/><path d="M12 33c6-2 8-14 14-14s7 10 14 4" fill="none" stroke="'+R+'" stroke-width="4" stroke-linecap="round"/><circle cx="26" cy="19" r="3" fill="'+C+'"/>'],
    ["PDFs & photos","Open a worksheet or past paper as a page and write straight on it. Export pages back to PDF.","#FFD9E2",'<path d="M12 5h17l9 9v27a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" fill="'+W+'" '+S+'/><path d="M29 5v9h9" fill="'+L+'" '+S+'/><rect x="13" y="26" width="22" height="11" rx="3" fill="'+R+'"/><path d="M17 31h14" stroke="'+W+'" stroke-width="3" stroke-linecap="round"/>'],
    ["Study packs","Drop in a practice pack and every question becomes its own page. Folders keep each subject apart.","#DCE5FF",'<path d="M5 12a3 3 0 0 1 3-3h10l4 5h18a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="'+Y+'" '+S+'/><path d="M5 20h38" '+S+'/>']
  ];
  T.forEach(function(t){
    var d=document.createElement("article");d.className="tile";
    d.innerHTML='<div class="ti" style="background:'+t[2]+'"><svg viewBox="0 0 48 48" aria-hidden="true">'+t[3]+'</svg></div><div><h3>'+t[0]+'</h3><p>'+t[1]+'</p></div>';
    g.appendChild(d);
  });
})();
