/* The only file you need to edit. Change the values, save, upload again. */
window.INKBOARD = {
  /* where the "Open the board" buttons go */
  boardUrl: "https://claude.ai/artifact/4MKXkLsQcVqZDZgBd9gdY9",

  /* the tester programme */
  slotsTotal: 10,
  slotsTaken: 0,          // raise this as people join; the dots and the text update by themselves

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
  }
};
