# RedFlyHD • Site & Portfolio

Site personnel et portfolio de RedFly, propulsé par React, Vite, TypeScript et Tailwind CSS. Animations légères, design moderne, et contenu servi via GitHub Pages.

👉 En ligne: https://redflyhd.github.io


## Aperçu

- SPA React (Vite + TypeScript)
- UI avec Tailwind CSS + plugins (forms, typography, aspect-ratio, container-queries)
- Animations via Framer Motion
- Routage via React Router
- Assets dans `react/public` (images, vidéos, favicons…)


## Structure du dépôt

```
.
├─ favicon.ico
├─ react/                  # Application React (Vite + TS)
│  ├─ index.html
│  ├─ package.json         # scripts: dev, build, preview
│  ├─ public/              # assets servis tels quels
│  │  ├─ minia/ …          # miniatures de projets
│  │  ├─ rss/ …            # logos, bannières
│  │  ├─ projects/ …       # images projets
│  │  └─ videos/ …         # vidéos hero
│  └─ src/
│     ├─ pages/            # Home, Work, Renew, NotFound
│     ├─ components/       # Navbar, Modal, ProjectCard…
│     ├─ App.tsx           # routes de l’app
│     └─ main.tsx          # bootstrap React
└─ README.md               # vous êtes ici
```


## Stack

- React 18
- Vite 5
- TypeScript 5
- Tailwind CSS 3 (+ plugins officiels)
- Framer Motion 11
- React Router 6


## Démarrer en local

Prérequis: Node.js ≥ 18 et npm.

Dans le dossier `react/`:

```sh
cd react
npm install
npm run dev
```

Le serveur de dev Vite démarre et l’URL locale s’affiche (généralement http://localhost:5173).


## Build de production

Toujours depuis `react/`:

```sh
npm run build    # génère le dossier dist/
npm run preview  # prévisualise le build en local
```


## Scripts NPM

Depuis `react/package.json`:

- `npm run dev`     → lance Vite en mode développement
- `npm run build`   → compile TypeScript puis build Vite
- `npm run preview` → sert le build localement


## Assets

Tous les fichiers statiques sont servis depuis `react/public`. Les chemins utilisés dans le code sont relatifs à la racine (ex: `/minia/...`, `/videos/...`).

- `react/public/minia/` → miniatures des projets
- `react/public/rss/` → logos, icônes, bannières
- `react/public/projects/` → visuels spécifiques par projet
- `react/public/videos/` → vidéos hero (`hero.mp4`, `hero.webm`, `hero-poster.webp`)


## Déploiement sur GitHub Pages

Ce dépôt est un dépôt « user/organization page » (`redflyhd.github.io`). Recommandé:

1) Builder l’app: `cd react && npm run build`
2) Déployer le contenu de `react/dist` comme source de GitHub Pages (via GitHub Actions ou publication manuelle).

Notes:
- Pour un dépôt `username.github.io`, la base Vite par défaut (`/`) est correcte, aucune config spéciale n’est requise.
- Option action CI: mettre en place un workflow qui build `react/` et publie `react/dist` sur la branche `main` (dossier racine) ou sur `gh-pages` selon votre configuration Pages.


## Crédits

@RedFlyHD

