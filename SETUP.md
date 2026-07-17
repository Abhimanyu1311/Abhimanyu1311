# Setup Guide

This repo powers the profile README shown at `github.com/Abhimanyu1311`. GitHub
renders it automatically because the repo name matches the account username —
no deploy step needed for the README itself, only for the automation below.

## 0. Folder structure

```
Abhimanyu1311/
├── README.md                        # the profile page itself
├── SETUP.md                         # this file
├── .gitignore
├── assets/
│   ├── divider.svg                  # decorative gradient rule between sections
│   ├── quote.svg                    # random dev quote, regenerated daily
│   └── metrics.svg                  # GitHub metrics card, regenerated daily
├── scripts/
│   └── generate-quote-svg.mjs       # fetches a quote and renders assets/quote.svg
└── .github/
    └── workflows/
        ├── snake.yml                # contribution snake → pushes to `output` branch
        ├── metrics.yml              # lowlighter/metrics → writes assets/metrics.svg
        └── update.yml               # daily: regenerates assets/quote.svg
```

## 1. Usernames that must be replaced

The username `Abhimanyu1311` is already correct throughout `README.md` and the
workflows **if** this repo lives under that exact GitHub account. If you ever
fork or rename, replace every occurrence of `Abhimanyu1311` in:

- `README.md` (badge URLs, stats/langs/streak/trophy/snake image URLs)
- `.github/workflows/metrics.yml` (`user:` input)

## 2. URLs you need to update

These are intentionally left as placeholders in `README.md` — search for them:

| Placeholder | Where | Replace with |
|---|---|---|
| `your-linkedin` | Header badges + "Connect With Me" | Your LinkedIn handle |
| `your-portfolio.com` | Header badges + "Connect With Me" | Your live portfolio URL |
| `your-twitter-handle` | "Connect With Me" | Your X / Twitter handle |
| `your-email@domain.com` | Header + "Connect With Me" mailto badges | The email you want public |

Each spot has an inline `<!-- 🔧 REPLACE ... -->` HTML comment directly above
it in `README.md` (invisible when rendered on GitHub).

## 3. GitHub Secrets required

| Secret | Used by | How to create it |
|---|---|---|
| `METRICS_TOKEN` | `.github/workflows/metrics.yml` | Classic PAT with `repo` + `read:user` scopes. Create at **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**, then add it at **this repo → Settings → Secrets and variables → Actions → New repository secret**. |

`snake.yml` and `update.yml` only use the automatically-provided
`GITHUB_TOKEN`, so no extra secret is needed for them — just confirm write
permissions (step 4 below).

## 4. Enabling GitHub Actions

1. Push this repo to `github.com/Abhimanyu1311/Abhimanyu1311`.
2. Go to **Settings → Actions → General**.
3. Under **Workflow permissions**, select **"Read and write permissions"**
   (required so `snake.yml` can push to the `output` branch and `update.yml`
   can commit `assets/quote.svg`).
4. Go to the **Actions** tab and confirm the three workflows are listed:
   *Generate Contribution Snake*, *Generate Metrics*, *Daily Refresh*.
5. Manually trigger each once via **Run workflow** (`workflow_dispatch`) so
   the images exist before anyone views your profile.

## 5. Configuring the contribution snake

`snake.yml` uses [`Platane/snk`](https://github.com/Platane/snk) to render
your contribution graph as a snake game, then
[`crazy-max/ghaction-github-pages`](https://github.com/crazy-max/ghaction-github-pages)
pushes the SVGs to an `output` branch (created automatically on first run).
`README.md` reads directly from that branch via `raw.githubusercontent.com`,
switching light/dark palettes with a `<picture>` element. Nothing to
configure beyond running the workflow once — it re-runs every 6 hours and on
every push to `main`.

## 6. Configuring GitHub Metrics

`metrics.yml` uses [`lowlighter/metrics`](https://github.com/lowlighter/metrics)
to render an activity/languages/habits panel to `assets/metrics.svg`, which
`README.md` embeds directly. It needs the `METRICS_TOKEN` secret (step 3).
To change what's shown, edit the `with:` block in `metrics.yml` — see the
[full plugin list](https://github.com/lowlighter/metrics#-documentation) for
options like `plugin_stars`, `plugin_isocalendar`, or `plugin_traffic`
(traffic requires additional scopes).

## 7. Customizing the theme

The palette used throughout (header banner, dividers, badges, dark/light stat
cards) is a violet → blue → sky gradient: `#6D28D9 → #2563EB → #0EA5E9`. To
re-theme:

- **Header/footer banner**: edit the `color=` param in the `capsule-render`
  URLs in `README.md` (format: `0:HEX,50:HEX,100:HEX`).
- **Typing animation**: edit the `color=` param in the `readme-typing-svg`
  URLs (separate values are already set per light/dark `<picture>` source).
- **Stats/langs/streak/activity/trophy**: each has independent `theme=`
  params for dark vs. light `<source>` — swap for any theme name from
  [github-readme-stats themes](https://github.com/anuraghazra/github-readme-stats#themes).
- **Divider/quote/metrics SVGs**: edit the gradient `<stop>` colors directly
  in `assets/divider.svg`, `assets/quote.svg`, and
  `scripts/generate-quote-svg.mjs`.

## 8. Adding future projects

Open `README.md`, find the `## 🚀 Featured Projects` section, and duplicate
one `<td width="50%" valign="top">...</td>` block inside the `<table>`. Edit
the heading, the `shields.io` tech badges, and the bullet list. Keep entries
in pairs so the two-column card grid stays visually balanced — if you're
adding an odd project, add an empty `<td></td>` as a placeholder for the
final row.

## External services used

| Service | Purpose |
|---|---|
| [capsule-render](https://github.com/kyechan99/capsule-render) | Animated header/footer wave banner |
| [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg) | Typing animation (role rotation, currently-learning) |
| [skillicons.dev](https://skillicons.dev) | Tech stack icon grid |
| [shields.io](https://shields.io) | Badges (tools not covered by skillicons, contact links) |
| [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) | Stats card, top languages, streak stats |
| [github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph) | Contribution activity graph |
| [github-profile-summary-cards](https://github.com/vn7n24fzkq/github-profile-summary-cards) | Profile detail / most-commit-language cards |
| [github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy) | Trophy row |
| [komarev.com/ghpvc](https://github.com/antonkomarev/github-profile-views-counter) | Profile view counter |
| [Platane/snk](https://github.com/Platane/snk) | Contribution snake animation (GitHub Action) |
| [lowlighter/metrics](https://github.com/lowlighter/metrics) | GitHub metrics panel (GitHub Action) |
| [ZenQuotes API](https://zenquotes.io/) | Random developer quote (`scripts/generate-quote-svg.mjs`) |

All of these are free, external, third-party rendering services — they
receive only your public GitHub username, never any secret. `METRICS_TOKEN`
is consumed exclusively inside the `lowlighter/metrics` GitHub Action run and
is never sent to a third party.
