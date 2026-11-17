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

  /* "My other projects" on the page. Add, remove or reorder freely.
     icon: accountable | ghost | server | remote | screen | usb | spike | plant | video
     tint: yellow | blue | mint | pink | lilac        status: Running | Working | Building | Prototype | Planned
     url: optional. Leave it out and the card is not a link. */
  projects: [
    { name: "Accountable", icon: "accountable", tint: "mint", status: "Working",
      blurb: "Two people, one deal. Gym and daily habits, with proof taken on the camera only and checked by the other person. Miss a deadline and you get a random real task, never a payment.",
      tags: ["iPhone app", "Built with a friend"] },
    { name: "GhostlyMatters", icon: "ghost", tint: "lilac", status: "Running",
      blurb: "My unofficial cooperation: a small group and brand with a ghost mascot. It runs from my own server at home.",
      tags: ["Brand", "Community"] },
    { name: "Ghost server", icon: "server", tint: "blue", status: "Running",
      blurb: "An old laptop turned into a home server. It hosts GhostlySystem, GhostlyMatters, GhostlyDesk and GhostlyApps behind Caddy, with DuckDNS keeping them reachable.",
      tags: ["Ubuntu", "Caddy", "DuckDNS"] },
    { name: "PC remote panel", icon: "remote", tint: "yellow", status: "Working",
      blurb: "A web panel to shut down, restart, take a screenshot and watch the stats of my PC from my phone, from anywhere.",
      tags: ["Node", "React"] },
    { name: "GhostlyScreen", icon: "screen", tint: "lilac", status: "Working",
      blurb: "A custom Windows screensaver that is also a soft lock. It starts when I am idle, asks for a password, and locks the PC after three wrong tries. GhostlyToolbox controls it.",
      tags: ["Windows", "Security"] },
    { name: "USB toolbox", icon: "usb", tint: "blue", status: "Working",
      blurb: "A Ventoy USB with ISOs and my own tools, including a Spicetify installer that picks the right Spotify version, blocks updates and keeps Spicetify working.",
      tags: ["Ventoy", "Spicetify"] },
    { name: "Plant irrigation", icon: "plant", tint: "mint", status: "Prototype",
      blurb: "An Arduino system that waters each plant by its own needs instead of all the same, for farming in the UAE. One node per plant, with sensors for soil and air.",
      tags: ["Arduino", "School project"] },
    { name: "YouTube channel", icon: "video", tint: "pink", status: "Planned",
      blurb: "A long-form channel. The first video is a talking-head about Accountable.",
      tags: ["Video"] }
  ]
};
