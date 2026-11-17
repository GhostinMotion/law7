# Law7 landing page

A plain static site: no build step, no server code. Open `index.html` to preview it.

## Change the details (one file)
Edit `js/config.js`:
- `projects`: the "My other projects" cards (name, short text, icon, colour, status, tags). Add or remove a line and the grid updates.
- `boardUrl`: where the "open the board" buttons go.
- `slotsTaken`: raise it as testers join. The dots and the wording update by themselves (out of `slotsTotal`, 10).
- `apply`: where applications go. Fill in ONE:
  - `formEndpoint`: a form service address (for example a free Formspree form: `https://formspree.io/f/xxxxxxx`). Applications arrive in your inbox.
  - `email`: the form opens the visitor's mail app with the answers filled in.
  - Leave both empty and the form shows the answers as a message to copy and send you another way.

Text lives in `index.html` (plain words, easy to edit). The small feature tiles are in `js/tiles.js`. `js/pad.js` is the draw-it-yourself pen demo, and it uses `js/ink.js`, a copy of the board's real shape recogniser. Colours are at the top of `css/site.css`.

## Put it online
**GitHub Pages (free)**
1. Create a repository (public), upload everything from this folder to its root.
2. Settings, then Pages, then "Deploy from a branch", branch `main`, folder `/ (root)`.
3. In a minute it is live at `https://<your-name>.github.io/<repository>/`.

**Your own server**
Copy this folder to the server and serve it as static files. With Caddy:
```
yourname.duckdns.org {
    root * /path/to/this/folder
    file_server
}
```
Both at once is fine: they are two copies of the same folder.

## Note
Visitors can only open the board if you have shared it with them. The landing page just links to `boardUrl`.
