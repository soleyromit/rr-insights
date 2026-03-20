# x-rr-insights — Insight Hub

> Cross-product research intelligence platform for Exxat design strategy.
> Built by Romit Soley, Product Designer II.

**Live:** https://YOUR_USERNAME.github.io/x-rr-insights/
**Magic Patterns:** https://www.magicpatterns.com/c/vgjt3gddfgxyknd4wfnfhd

---

## One-time setup

```bash
git clone https://github.com/YOUR_USERNAME/x-rr-insights.git
cd x-rr-insights
npm install
git config user.email "romit@exxat.com"
git config user.name "Romit Soley"
```

Copy source files from Magic Patterns export into this folder, then:

```bash
git add .
git commit -m "feat: initial Insight Hub platform"
git push origin main
```

Enable GitHub Pages: **Settings → Pages → Source → GitHub Actions → Save**

---

## How Claude updates the repo

Every time you share Granola notes or a document in the Insight Hub Claude project:

1. Claude updates `data/insights.ts` (and other data files as needed)
2. Claude runs `node scripts/claude-push.mjs --message="..." --product=... --source=granola`
3. Push triggers the GitHub Action
4. Vite builds + GitHub Pages deploys (~60 seconds)
5. Live URL is current ✅

---

## Adding a new product

1. Add `ProductId` to `types/index.ts`
2. Add entry to `data/products.ts`
3. Add insights to `data/insights.ts`
4. Sidebar, topbar, overview — all auto-update. No routing changes needed.
5. (Optional) Copy `ExamManagementView.tsx` for a full deep-dive

---

## File structure

```
data/           ← Claude edits these (insights, products, personas)
components/     ← Reusable UI (Badge, Card, InsightRow, Sidebar, Topbar)
views/          ← One view per page
  products/     ← One file per product deep-dive
types/          ← Shared TypeScript interfaces
scripts/        ← sync.mjs, claude-push.mjs
.github/        ← deploy.yml (auto-deploy on push)
```
