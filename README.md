# VaultLog Fake Door Landing Page

> Task: VL-P0-003  
> Output: `~/.claude/team-flora/deliveries/vaultlog-landing-page/`

A static, 0-cost fake-door landing page for VaultLog — a local-first privacy vault for iOS.

---

## 🚀 Quick Start (GitHub Pages)

1. Create a new public GitHub repository, e.g. `vaultlog-landing`.
2. Upload these files to the repository root:
   - `index.html`
   - `privacy.html`
   - `styles.css`
   - `config.js`
   - `tracker.js`
   - `main.js`
3. Go to **Settings → Pages** in the repository.
4. Select **Deploy from a branch**, choose `main`, folder `/ (root)`.
5. Wait ~1 minute. Your page will be live at:
   ```
   https://YOUR_USERNAME.github.io/vaultlog-landing/
   ```

---

## ⚙️ Configuration

Edit `config.js` before going live.

### 1. Google Analytics 4 (0-cost tracking)

- Go to [https://analytics.google.com](https://analytics.google.com) and create a property.
- Copy the Measurement ID (looks like `G-XXXXXXXXXX`).
- Replace `G-PLACEHOLDER` in `config.js`.

Tracked events automatically:
- `page_view`
- `cta_click` (with location)
- `form_start`, `form_submit`, `form_success`, `form_error`
- `scroll_depth` (25/50/75/90)
- `feature_seen`, `step_seen`, `usecase_seen`, `pricing_card_seen`
- `pricing_toggle`
- `faq_expand`
- `headline_variant` (A/B test)

### 2. Email collection (0-cost)

#### Option A — Google Apps Script (recommended)

1. Go to [https://script.google.com](https://script.google.com) and create a new project.
2. Paste the code from `google-apps-script.gs`.
3. Save and deploy as a **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the Web App URL.
5. Replace `FORM_ENDPOINT` in `config.js`.
6. Submissions will be appended to the Google Sheet the script creates.

#### Option B — Formspree

1. Create a form at [https://formspree.io](https://formspree.io).
2. Copy the endpoint URL (looks like `https://formspree.io/f/XXXXXXXX`).
3. Replace `FORM_ENDPOINT` in `config.js`.

---

## 🧪 A/B Test Headlines

`config.js` contains 3 headline variants. The page randomly assigns one per session and tracks which variant each conversion comes from.

To analyze:
- In GA4, filter events by `headline_variant` and `form_success`.

---

## 📝 Copy Status

- **v1 copy**: Based on war-room core positioning (zero cloud, zero account, Face ID, export).
- **Pending**: Final copy pending outputs from `flora-analyst` and `flora-uxr` (due 2026-06-21).
- **Action**: Replace headline, subtitle, and feature bullets with Phase 0 research findings once available.

---

## 🐛 Known Blockers

| Blocker | Owner | Status |
|---------|-------|--------|
| GitHub Pages deployment requires GitHub auth / manual push | flora-pm / user | 🔴 pending |
| Final copy pending flora-analyst + flora-uxr Phase 0 report | flora-analyst, flora-uxr | 🟡 pending (due 2026-06-21) |
| GA4 ID and form endpoint need real IDs | flora-growth / user | 🔴 pending |

---

## 📂 Files

```
vaultlog-landing-page/
├── index.html          # Main landing page
├── privacy.html        # Privacy policy
├── styles.css          # All styles
├── config.js           # Configurable IDs and variants
├── tracker.js          # GA4 event tracking
├── main.js             # Interactions, form, A/B test
├── README.md           # This file
└── google-apps-script.gs  # 0-cost email collection backend
```
