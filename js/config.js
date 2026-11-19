/* The only file you need to edit. Change the values, save, upload again. */
window.LAW7 = {
  /* where the "Open the board" buttons go */
  boardUrl: "https://claude.ai/artifact/TeYXMuGKbj52CMTpcpLGDZ",

  /* the tester programme */
  slotsTotal: 10,
  slotsTaken: 3,          // raise this as people join; the dots and the text update by themselves

  /* How applications reach you. Fill in ONE of these. The first one that is filled in is used.
     formEndpoint: a form service address, for example "https://formspree.io/f/xxxxxxx"
     email:        an email address; the form opens the visitor's mail app with the answers filled in
     If both are empty the form shows the answers as a message to copy and send you another way. */
  apply: {
    formEndpoint: "",
    email: "Ima.gghost7@gmail.com",
    /* Free automatic mail with EmailJS (emailjs.com). Fill all four and the form sends you the application
       and emails the applicant a confirmation, with no mail app opening. The key is a public key, safe here.
       service: your Email Service ID. notify: template that goes to you. reply: template that goes to the applicant. */
    emailjs: { key: "3v8tbkRQrHzUXsJg7", service: "service_ww57hl5", notify: "application-notify-law7", reply: "reply-to-applicant-law7" }
  },

  /* "My other projects" on the page. Order = order on the page.
     layout: base (big dark block on top, no picture) | wide | half | six | strip | old
     media: optional REAL screenshot or video in assets/projects/ (drop a file in, put its name here; it is used as is)
     Real pictures or videos only. No media means a text-only card, never a drawing.
     status: Running | Working | In testing | Early development | Old (any other word is shown as is)
     url: optional. Leave it out and the card is not a link. */
  projects: [
    { name: "GhostedServer", layout: "base", status: "Running",
      blurb: "My home server: an old laptop that runs most of the projects below.",
      serves: ["Accountable", "GhostlyMatters", "GhostlyDesk", "GhostlySystem"] },
    { name: "Accountable", layout: "six", status: "Working", tint: "mint",
      blurb: "An app where two friends keep each other honest on prayer, the gym and habits. Made with a friend.",
      media: "assets/projects/accountable-1.jpg", hover: "assets/projects/accountable-hover.webp", bg: "#cad7cf", alt: "The Accountable welcome page: two phone screens showing today's prayers and a review queue",
      url: "https://ghostlyapps.duckdns.org/welcome", go: "See the app" },
    { name: "GhostlyMatters", layout: "six", status: "Running", tint: "lilac",
      blurb: "My Discord community for Valorant and Overwatch, with a bot and a website.",
      media: "assets/projects/ghostlymatters-1.jpg", hover: "assets/projects/ghostlymatters-hover.webp", bg: "#1f102d", alt: "The top of the GhostlyMatters site: Come haunt the lobby with us, next to a card of the voice channels",
      url: "https://ghostlymatters.duckdns.org/building-a-community", go: "Visit the site" },
    { name: "GhostlyTools", layout: "six", status: "In testing", tint: "blue",
      blurb: "A toolbox of small Windows tools. Not public yet.",
      media: "assets/projects/ghostlytools-1.jpg", hover: "assets/projects/ghostlytools-hover.webp", bg: "#1a1a1a", alt: "The GhostlyToolBox menu in a terminal, listing 25 tools" },
    { name: "GhostlyScreen", layout: "six", status: "In testing", tint: "yellow",
      blurb: "A screensaver that locks my PC when I'm away. Ctrl+Shift+Alt+L locks it straight away, like Win+L. Only on my PC for now.",
      media: "assets/projects/ghostlyscreen-1.jpg", hover: "assets/projects/ghostlyscreen-hover.webp", bg: "#101014", alt: "GhostlyScreen running: a big clock and the date over a moving wallpaper, with the small ghost countdown ring in the corner" },
    { name: "Matter", layout: "strip", status: "Early development", tint: "pink",
      blurb: "An assistant I want to build. Very early, just an idea." },
    { name: "AAPS Study Hub", layout: "old", status: "Old", tint: "blue",
      url: "https://ghostinmotion.github.io/AAPS-Resources", go: "Open it (students only)",
      blurb: "My old school hub of IGCSE and O-Level notes. Out of date now.",
      media: "assets/projects/aaps-home.jpg", hover: "assets/projects/aaps-hover.webp", bg: "#0f0e1c", alt: "The AAPS Study Hub home page: Study smarter, together, with Browse Resources and Check Updates buttons" }
  ]
};
