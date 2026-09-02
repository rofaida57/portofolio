# Rofaida Bouchama — Portfolio

Personal portfolio website for **Rofaida Bouchama**, Computer Science graduate and Full-Stack Web Developer.

🔗 Live site: [rofaida57.github.io/portofolio](https://rofaida57.github.io/portofolio/)

## Features

- **Light / dark mode** — toggle in the header, choice saved between visits.
- **Multi-language** — English (default), Arabic, and French, switchable from the header (`EN` / `AR` / `FR`). Arabic automatically switches the page to right-to-left layout with an Arabic-friendly font.
- **Sections** — About, What I Build, Projects, Experience, Education, Skills, Certifications & Leadership, Contact.
- **Project filter** — filter projects by category (All / Web / Desktop).
- **Contact form** — sends messages via [FormSubmit](https://formsubmit.co), no backend required.
- Animated scroll reveals, a subtle particle background, and a smooth scrolling nav with active-section highlighting.

## Tech Stack

Plain **HTML5, CSS3, and vanilla JavaScript** — no build step, no dependencies to install.

- [Font Awesome](https://fontawesome.com/) (via CDN) for icons
- [Google Fonts](https://fonts.google.com/): Cormorant Garamond, Plus Jakarta Sans, Tajawal (Arabic)

## Project Structure

```
.
├── index.html         # Page structure and content (English is the default/source text)
├── style.css           # All styling, including dark mode and RTL overrides
├── script.js            # Theme toggle, language switch, animations, form handling
├── translations.js       # Arabic and French strings, keyed to match data-i18n attributes in index.html
└── README.md
```

## Running Locally

No build tools needed — just open the file or serve the folder:

```bash
# Option 1: open directly
open index.html          # macOS
start index.html         # Windows

# Option 2: serve locally (recommended, avoids browser file:// restrictions)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Push these files to the root of a repository (or a `docs/` folder / `gh-pages` branch).
2. In the repo, go to **Settings → Pages**, and set the source to the branch/folder containing `index.html`.
3. GitHub will publish the site at `https://<username>.github.io/<repo-name>/`.

## Editing Content

- **English text**: edit directly in `index.html`. Most editable text is inside an element with a `data-i18n="..."` attribute.
- **Arabic / French text**: edit the matching key in `translations.js`. Every `data-i18n` key in `index.html` should have a corresponding entry under `ar` and `fr` in `translations.js`.
- **Projects**: each project is a `.pub-card` inside `#projects-list` in `index.html`. Set `data-year="web"` or `data-year="desktop"` to control which filter tab shows it, and update the `href` on the "View Code" button to point to the real GitHub repository.
- **Colors / fonts**: controlled by CSS variables at the top of `style.css` (`:root` for light mode, `.dark-theme` for dark mode).

## Contact

- Email: bouchamarofaida1@gmail.com
- GitHub: [github.com/rofaida57](https://github.com/rofaida57)
