# 🍦 Scoop — The Flavor Sommelier · Setup Guide

## Quickstart (3 steps)

### 1. Install
```bash
cd flavor-sommelier
npm install
```

### 2. Add Gemini API key
Create `.env.local` in the project root:
```
GEMINI_API_KEY=your_key_here
```
Get a free key at → https://aistudio.google.com/app/apikey

### 3. Run
```bash
npm run dev
```
Open http://localhost:3000

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── layout.tsx            ← Root layout + fonts
│   ├── globals.css           ← Design tokens (ivory, gold, rose)
│   ├── chat/
│   │   └── page.tsx          ← Chat dashboard
│   └── api/
│       └── chat/
│           └── route.ts      ← Gemini API (cached, minimal token usage)
├── components/
│   ├── FlavorCard.tsx        ← Rich card: emoji image, metrics, dietary, pairings
│   ├── MessageBubble.tsx     ← Chat message renderer + card grid
│   ├── ChatInput.tsx         ← Auto-resize textarea + send button
│   ├── SidePanel.tsx         ← Flavor detail panel + today's scoop
│   ├── CellarDrawer.tsx      ← Saved flavors slide-in drawer
│   ├── DietaryFilter.tsx     ← Vegan/GF/DF/NF filter pills
│   └── Tooltip.tsx           ← Hover tooltips + first-time onboarding hints
└── lib/
    └── flavors.ts            ← 22 flavors + RAG search + dietary/clash data
```

---

## Design Tokens (globals.css)
- `--ivory` / `--ivory-dim` — warm white backgrounds
- `--gold` / `--gold-hi` — primary accent
- `--rose` / `--rose-dim` — secondary soft accent
- `--parchment` — card backgrounds

---

## Key Design Decisions

### Minimal Token Usage
- System prompt cached as singleton on server
- Only top 4 relevant flavors sent per query via RAG search
- Full flavor JSON never sent repeatedly

### Dietary Safety
- User sets restrictions via filter pills in header
- Restrictions prepended to every API message automatically
- Flavor data includes `avoid_with` clash lists
- AI instructed to never suggest dangerous combos (citrus+dairy, etc.)

### Card Responses
- AI returns structured JSON only
- Cards render as rich UI — emoji image, 2x2 info grid, dietary badges
- 1 card for specific, 2-3 for open-ended, never more

### Response Length Rules
- Greetings → 1 sentence max
- Simple Q → 2-3 sentences
- Flavor recs → cards + optional follow-up chip

---

## Troubleshooting

**Error 500 / Model Not Found**
Model name is `gemini-1.5-flash` — already correct in `route.ts`.

**API key not working**
File must be `.env.local` (not `.env`). Restart dev server after creating.

**Port in use**
```bash
npm run dev -- -p 3001
```
