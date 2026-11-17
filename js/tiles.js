/* "And all the small things that add up": the tiles are drawn from this list. Edit the words here. */
(function(){
  var g=document.getElementById("tiles");if(!g)return;
  var I="#0F1B3D",C="#2A44F5",Y="#FFD93D",R="#E8456B",M="#12A184",L="#E9EEFB",W="#fff";
  var S='stroke="'+I+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  var T=[
    ["Highlighter","Six marker colours. They always sit under your writing, so nothing gets hidden.","#FFF3A8",'<path d="M20 8l17 17-9 9-17-17z" fill="'+Y+'" '+S+'/><path d="M24 34l-5 5H8v-6l8-8" fill="none" '+S+'/><path d="M6 43h36" stroke="'+Y+'" stroke-width="5" stroke-linecap="round" opacity=".8"/>'],
    ["Shapes snap clean","Hold still and wobbly circles, boxes and lines tidy up. Handwriting never does.","#DCE5FF",'<circle cx="24" cy="24" r="15" fill="'+W+'" '+S+'/><path d="M9 9l4 4M39 9l-4 4M24 3v5" fill="none" stroke="'+C+'" stroke-width="3" stroke-linecap="round"/>'],
    ["Export to PDF","Pick pages, get one PDF with bookmarks. Read it with no internet.","#FFD9E2",'<path d="M12 5h17l9 9v27a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" fill="'+W+'" '+S+'/><path d="M29 5v9h9" fill="'+L+'" '+S+'/><rect x="13" y="26" width="22" height="11" rx="3" fill="'+R+'"/><path d="M17 31h14" stroke="'+W+'" stroke-width="3" stroke-linecap="round"/>'],
    ["Diagrams by Claude","Flowcharts, forces, cells. Drawn by hand next to your work.","#D4F4EC",'<rect x="4" y="6" width="14" height="10" rx="3" fill="'+L+'" '+S+'/><rect x="30" y="6" width="14" height="10" rx="3" fill="'+Y+'" '+S+'/><rect x="17" y="30" width="14" height="12" rx="3" fill="'+W+'" '+S+'/><path d="M18 11h12M11 17v6h13v7M37 17v6H24" fill="none" stroke="'+C+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'],
    ["Periodic table + calculator","Both built in. Tap an element for its numbers, or use the scientific calculator (brackets, powers, sin, log).","#E7E0FF",'<rect x="5" y="6" width="16" height="16" rx="3" fill="'+Y+'" '+S+'/><rect x="27" y="6" width="16" height="16" rx="3" fill="'+W+'" '+S+'/><rect x="5" y="27" width="16" height="16" rx="3" fill="'+W+'" '+S+'/><rect x="27" y="27" width="16" height="16" rx="3" fill="'+C+'" '+S+'/><path d="M31 35h8M35 31v8" stroke="'+W+'" stroke-width="3" stroke-linecap="round"/><path d="M10 14h6" stroke="'+I+'" stroke-width="3" stroke-linecap="round"/>'],
    ["Study packs","Drop in a practice pack and every question becomes its own page.","#FFF3A8",'<rect x="6" y="14" width="36" height="28" rx="5" fill="'+W+'" '+S+'/><path d="M6 22h36" '+S+'/><path d="M24 14v28" stroke="'+C+'" stroke-width="3" stroke-dasharray="3 4" stroke-linecap="round"/><path d="M14 8h20" '+S+'/>'],
    ["Folders per subject","Chemistry, physics, Arabic. Each folder counts its own pages.","#DCE5FF",'<path d="M5 12a3 3 0 0 1 3-3h10l4 5h18a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="'+Y+'" '+S+'/><path d="M5 20h38" '+S+'/>'],
    ["Pencil ready","Rest your hand on the screen and it ignores your palm. Pinch to zoom, scribble to erase.","#D4F4EC",'<path d="M8 40l2-9L33 8a4 4 0 0 1 6 6L16 37z" fill="'+W+'" '+S+'/><path d="M29 12l7 7" '+S+'/><path d="M8 40l9-2-7-7z" fill="'+C+'" '+S+'/>'],
    ["Private by default","Your boards are locked with your code, so other testers can't open them.","#FFD9E2",'<rect x="9" y="21" width="30" height="21" rx="5" fill="'+Y+'" '+S+'/><path d="M16 21v-5a8 8 0 0 1 16 0v5" fill="none" '+S+'/><circle cx="24" cy="31" r="3" fill="'+I+'"/>']
  ];
  T.forEach(function(t){
    var d=document.createElement("article");d.className="tile";
    d.innerHTML='<div class="ti" style="background:'+t[2]+'"><svg viewBox="0 0 48 48" aria-hidden="true">'+t[3]+'</svg></div><div><h3>'+t[0]+'</h3><p>'+t[1]+'</p></div>';
    g.appendChild(d);
  });
})();
