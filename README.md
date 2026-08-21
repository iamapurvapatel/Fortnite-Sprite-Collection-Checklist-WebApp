# ✨ MySprites ✨

> A highly polished, interactive, and responsive **Fortnite Sprite Collection Checklist** companion app! Powered by a versatile dual-mode layout (Grid & Matrix), complete Chapter 7 Season 4 sprite coverage, dynamic procedurally-rendered vector graphics, and real-time mastery tracking.

---

## 🚀 Key Features

*   **⚡ Chapter 7 Season 4 Ready** — Full support for all C7S4 sprite families (Basic, Gold, CheatMaster variants) plus legacy season compatibility.
*   **📐 Dual Layout Views**:
    *   **Grid View**: High-detail collectible cards with category filtering, rarity badges, and quick-toggle action controls.
    *   **Matrix View**: Compact, tabular family-by-variant grid with elongated slots and streamlined visual status scanning.
*   **🌟 Interactive Mastery Tracking** — Dedicated **"Mastered"** status checkboxes on every card and matrix slot with glowing gold accents and completion badges.
*   **☀️ Default Warm Light Mode & Dark Mode** — Clean, high-contrast light theme enabled by default, with instant dark mode toggling and local persistence.
*   **🎮 Procedural Vector & High-Res Sprite Engines** — Dynamic vector SVG sprite generator with aura glows, animated particles, and full fallback coverage.
*   **📊 Live Stats & Progress Dashboard** — Track obtained and mastered percentages, family completion statuses, and collection milestones in real time.
*   **💾 Instant Auto-Save** — Fast client-side persistence for your obtained, mastered, favorite, and custom note records.
*   **🔍 Search, Multi-Filter & Custom Notes** — Filter by family, rarity, season, obtained/missing status, or search by name. Add personal notes and timestamps to any sprite.
*   **🖼️ Poster Exporter & Floating Quick Action** — Export your custom collection showcase into a clean, shareable 1080x1080 image anytime via the header or the new floating action button (FAB).
*   **🔑 Secret Cheat Codes & Rewards Vault** — Built-in interactive vault for all 19 in-game redeem codes (Sprite unlocks, 40k XP, 2,000 Sprite Dust, Llama supply drops, Tetris block transforms) with 1-click clipboard copying and redemption tracking!

---

## 🛠️ Built With

*   ⚡ **Vite** — High-performance development server & bundling
*   ⚛️ **React 18** — Modern functional components & state hooks
*   🦕 **TypeScript** — Strictly typed interfaces, enums, and sprite schemas
*   🎨 **Tailwind CSS** — Utility-first styling with responsive design and theme support
*   🌀 **Motion (Framer)** — Smooth layout transitions, animations, and modals
*   📊 **Recharts & Lucide Icons** — Dynamic collection progress analytics and crisp UI icons

---

## 📂 Project Structure

```bash
├── 📁 src
│   ├── 📁 components
│   │   ├── 🧩 FloatingActions.tsx     # Floating action buttons (Export Poster & Codes Vault)
│   │   ├── 🧩 CodesModal.tsx          # Secret in-game redeem codes & rewards vault
│   │   ├── 🧩 SpriteMatrix.tsx        # Matrix/tabular family-variant view
│   │   ├── 🧩 SpriteCard.tsx          # Grid collectible card component
│   │   ├── 🧩 ProceduralSprite.tsx    # SVG generator & vector sprite engine
│   │   ├── 🧩 SpriteDetailModal.tsx   # In-depth detail modal with notes & actions
│   │   ├── 🧩 StatsDashboard.tsx      # Analytics & collection progress charts
│   │   ├── 🧩 SettingsPanel.tsx       # Backup, restore, and reset management
│   │   └── 🧩 BackgroundParticles.tsx # Immersive ambient background effects
│   ├── 📁 data
│   │   ├── 📄 sprites.ts              # Complete sprite registry & metadata
│   │   └── 📄 codes.ts                # In-game cheat codes & reward registry
│   ├── 📄 types.ts                    # Core TypeScript definitions & schemas
│   ├── 📄 index.css                   # Global Tailwind styling & theme tokens
│   └── 📄 App.tsx                     # Main application layout, state, & filters
```

---

*Made with 💖 for Fortnite collectors everywhere. Happy hunting! 🏹*
