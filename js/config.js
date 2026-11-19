/* The only file you need to edit. Change the values, save, upload again. */
window.LAW7 = {
  /* where the "Open the board" buttons go */
  boardUrl: "https://claude.ai/artifact/4MKXkLsQcVqZDZgBd9gdY9",

  /* the tester programme */
  slotsTotal: 10,
  slotsTaken: 1,          // raise this as people join; the dots and the text update by themselves

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
     layout: base (big dark block on top, no picture) | wide | half | five | four | three | old
     media: optional REAL screenshot or video in assets/projects/ (drop a file in, put its name here; it is used as is)
     Real pictures or videos only. No media means a text-only card, never a drawing.
     status: Running | Working | In testing | Early development | Old (any other word is shown as is)
     url: optional. Leave it out and the card is not a link. */
  projects: [
    { name: "GhostedServer", layout: "base", status: "Running",
      blurb: "My home server: an old laptop on Ubuntu, with Caddy in front and DuckDNS keeping the addresses alive. The rest of what's below runs on it or gets looked after from it, so it sits on top.",
      tags: ["Ubuntu", "Caddy", "DuckDNS", "Always on"],
      serves: ["Accountable", "GhostlyMatters", "GhostlyDesk", "GhostlySystem"] },
    { name: "Accountable", layout: "wide", status: "Working", tint: "mint",
      blurb: "Two people keep each other honest on prayer, the gym and habits they pick. You check in with a live photo, the other person approves it, and a miss gets you a random task you can't re-roll. Made with a friend.",
      tags: ["Web app", "Made with a friend"], media: "assets/projects/accountable-1.jpg", alt: "The Accountable welcome page: two phone screens showing today's prayers and a review queue",
      url: "https://ghostlyapps.duckdns.org/welcome", go: "See the app" },
    { name: "GhostlyMatters", layout: "half", status: "Running", tint: "lilac",
      blurb: "My little community: a Discord server for Valorant and Overwatch with a bot and a website. Game nights, a squad finder, voice rooms that tidy up after themselves, your own Valorant shop and a rewards system.",
      tags: ["Discord bot", "Website", "Valorant", "Overwatch"], media: "assets/projects/ghostlymatters-1.jpg", alt: "The top of the GhostlyMatters site: Come haunt the lobby with us, next to a card of the voice channels",
      url: "https://ghostlymatters.duckdns.org/building-a-community", go: "Visit the site" },
    { name: "GhostlyScreen", layout: "five", status: "In testing", tint: "yellow",
      blurb: "A screensaver that doubles as a lock, only on my PC for now. Ctrl+Shift+Alt+L starts it, a small ghost shows a 15 second cooldown before a password is needed, and it locks by itself after 5 minutes. Pulls videos or backgrounds from Wallpaper Engine.",
      tags: ["Windows", "Not public yet"] },
    { name: "GhostlyTools", layout: "four", status: "In testing", tint: "blue",
      blurb: "The control panel behind GhostlyScreen and my other little apps: every cooldown, timer and hotkey is a setting here. Also holds my Spicetify installer and the USB toolbox.",
      tags: ["Windows", "Not public yet"] },
    { name: "Matter", layout: "three", status: "Early development", tint: "pink",
      blurb: "The big one I want to build: my own full-power assistant, named from GhostlyMatters. Smart, personal, and mine. It's at the very start, so this is a promise, not a product.",
      tags: ["Assistant", "Just started"] },
    { name: "AAPS Study Hub", layout: "old", status: "Old", tint: "blue",
      blurb: "My old school project: a password-protected hub of IGCSE and O-Level notes, materials and flashcards for students at my old school. It's out of date now that I'm on the American curriculum, but it's where I learned to build things people actually use.",
      tags: ["IGCSE", "School project", "Students only"], media: "assets/projects/aaps-home.jpg", alt: "The AAPS Study Hub home page: Study smarter, together, with Browse Resources and Check Updates buttons" }
  ]
};
