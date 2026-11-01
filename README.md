# Syllabus Sprint

A 20-day syllabus tracker for DAA, DBMS, Data Warehouse & Data Mining, Cloud Computing and AI.

- Tick lecture, notes and learned for every unit
- Flag units as focus more or revise more; they collect in a revision queue
- Set a start date to see which day of the 20 you are on
- Progress saves automatically in your browser (localStorage)
- Export and import a JSON backup to move between devices

No build step, no dependencies. Plain HTML, CSS and JavaScript.

## Deploy on GitHub Pages

1. Create a new repository on GitHub, for example `syllabus-sprint`.
2. Upload all the files in this folder (`index.html`, `style.css`, `script.js`, `.nojekyll`, `README.md`) to the repository root.
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, set Source to **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then Save.
5. After a minute your site is live at `https://<your-username>.github.io/syllabus-sprint/`.

## Editing the syllabus

Unit names live in the `S` array at the top of `script.js`. Change the text there to match your syllabus, commit, and the live site updates.
