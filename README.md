# Executive Presentation Design System & Slide Framework

A modular, reusable, production-grade HTML5/CSS3 presentation template and design system engineered for high-stakes executive briefings (UK Defence, Government, Critical National Infrastructure, AI & Cyber Security, CTO/CIO audiences).

The framework enforces a strict **16:9 presentation canvas (1920&times;1080 logical resolution)** with responsive proportional auto-scaling, comprehensive design tokens, engineering-grade SVG diagrams, and zero framework dependencies.

> [!NOTE]
> **Illustrative Template Content**
> The sample slides in `index.html` feature an illustrative fictional scenario (*"Next-Generation Sovereign AI & Critical Infrastructure Resilience"*) solely to demonstrate the design system's typography, layout density, information hierarchy, and technical SVG diagramming in a realistic executive context.
>
> This content is intended as a working reference and starting point. When building real presentations, you can adapt, modify, or replace these slides using the layout primitives, components, and prompt guidelines below.

---

## 1. Project Architecture

The codebase strictly decouples design tokens, base viewport scaling, typography, layout primitives, modular components, and presentation runtime logic:

```
html-presentation-template/
├── index.html              # Presentation runner & 8-slide reference deck
├── assets/                 # Brand assets (DAINTTA full logos & standalone marks)
│   ├── daintta-logo.png
│   ├── daintta-logo-white.png
│   ├── daintta-mark.png
│   └── daintta-mark-white.png
├── css/
│   ├── tokens.css          # Central design tokens (palette, spacing, typography, shadows)
│   ├── base.css            # Viewport engine, 16:9 proportional auto-scaler, HUD, print engine
│   ├── typography.css      # Presentation typography scale (Inter + JetBrains Mono)
│   ├── layouts.css         # 16:9 layout primitives (cover, statement, multi-column, comparison, etc.)
│   ├── components.css      # Modular UI components (cards, metrics, badges, callouts, lists, logos)
│   └── diagrams.css        # Technical SVG architecture diagram styling
├── js/
│   └── presentation.js     # Zero-dependency navigation, scaling, overview grid, URL hash sync
└── README.md               # Framework documentation & AI slide generation guide
```

---

## 2. Visual Style & Design Language

Designed specifically for technical consultancy and sovereign executive briefings:
* **Sophisticated & Restrained**: Deep navy canvas (`#06090f` / `#0b111c`), crisp off-white primary text (`#f8fafc`), slate secondary text (`#94a3b8`), and restrained sovereign blue (`#3b82f6`) and technical cyan (`#0ea5e9`) accents.
* **No Fluff or Cheesy AI Tropes**: Avoids neon gradients, stock photo clichés, floating orbs, and generic bullet points.
* **Generous Whitespace & Mathematical Alignment**: Generous slide margins (`100px` horizontal, `70px` top, `50px` bottom) with clear visual hierarchy.
* **Classification Markings**: Standardised UK Government / Defence security headers (`NOT OFFICIAL SENSITIVE`, `SOVEREIGN ASSURED`, `RESTRICTED`).

---

## 3. Dark & Light Theme Support

The design system supports both **Dark Mode** (deep navy sovereign aesthetic) and **Light Mode** (clean executive white aesthetic) out of the box within a single template.

### How to Choose the Theme Before Making Slides:

You can choose your deck's theme in two ways:

#### Option A: Set It Statically in HTML (Recommended for generating decks)
Set the `data-theme` attribute directly on the `<body>` tag in [`index.html`](file:///Users/philmclaughlin/git/html-presentation-template/index.html):

* **For Light Theme**:
  ```html
  <body data-theme="light">
  ```
* **For Dark Theme (Default)**:
  ```html
  <body data-theme="dark">
  ```

#### Option B: Switch Interactively at Runtime
* Click the **Sun / Moon icon** in the bottom-right HUD control bar.
* Or press the **`T`** key at any time to toggle themes live.
* The presentation engine automatically remembers your preference in `localStorage`.

### What Changes Automatically:
1. **Color Tokens**: Backgrounds, card surfaces, borders, and text contrast adjust via CSS variables in [`tokens.css`](file:///Users/philmclaughlin/git/html-presentation-template/css/tokens.css).
2. **Brand Logos**: In dark mode, the white-text logo (`assets/daintta-logo-white.png`) is shown; in light mode, the black-text logo (`assets/daintta-logo.png`) is shown.
3. **SVG Architecture Diagrams**: Zones, node surfaces, and connection lines re-tint to maintain high contrast and legibility.

---

## 4. Presentation Behaviour & Navigation

### Controls & Shortcuts

| Key / Action | Action |
| :--- | :--- |
| **&rarr; / Space / L / J** | Advance to next slide |
| **&larr; / Backspace / H / K** | Return to previous slide |
| **Home / End** | Jump to first / last slide |
| **1 &ndash; 8** | Direct slide numeric jump |
| **O / Esc** | Toggle **Overview Grid Mode** (interactive thumbnail view) |
| **T** | Toggle **Dark / Light Theme** |
| **F** | Toggle **Fullscreen Presentation Mode** |
| **?** | Toggle Keyboard Shortcuts cheat-sheet modal |
| **Cmd + P / Ctrl + P** | **Export to PDF**: clean vector print with 16:9 landscape page breaks |
| **Swipe Left / Right** | Touch navigation on iPads, tablets, and touchscreen monitors |

### Proportional 16:9 Scaling Engine
The stage operates at a logical resolution of `1920px` &times; `1080px`. The runtime calculates:
$$\text{scale} = \min\left(\frac{\text{viewportWidth}}{1920},\, \frac{\text{viewportHeight}}{1080}\right)$$
This ensures that the presentation renders **identically** on any display (1080p, 1440p, 4K, laptops, or meeting room projectors) with zero layout shifting or awkward text wrapping.

---

## 5. Reusable Layout Primitives

Every slide uses the standardized container:
```html
<section class="slide" id="slide-N">
  <div class="slide-inner">
    <!-- Header (Optional on Cover / Divider) -->
    <header class="slide-header">
      <div class="slide-header-content">
        <span class="eyebrow">TAXONOMY / CATEGORY</span>
        <h2 class="slide-title">Primary Slide Headline</h2>
        <p class="slide-subtitle">Supporting context or strategic thesis.</p>
      </div>
      <div class="slide-header-meta">
        <span class="badge badge--blue">STATUS BADGE</span>
      </div>
    </header>

    <!-- Slide Body using a Layout Primitive -->
    <div class="slide-body">
      <!-- Layout Primitive Here -->
    </div>

    <!-- Slide Footer -->
    <footer class="slide-footer">
      <div class="slide-footer-left">NOT OFFICIAL SENSITIVE</div>
      <div class="slide-footer-center">PROGRAMME CONTEXT</div>
      <div class="slide-footer-right">0N / 08</div>
    </footer>
  </div>
</section>
```

### Available Layout Classes:
1. `.layout-cover` &mdash; Cover / Title slide with metadata grid and classification banner.
2. `.layout-statement` &mdash; Large executive thesis with supporting callout boxes.
3. `.layout-two-column` &mdash; Equal 50/50 two-column split (`--40-60` and `--60-40` variants available).
4. `.layout-three-column` &mdash; 3-column equal grid for strategic pillars or capability domains.
5. `.layout-card-grid` &mdash; 2&times;2 or 4-column card grid for modular capabilities.
6. `.layout-comparison` &mdash; Baseline / Threat vs Target / Sovereign Capability split with central divider.
7. `.layout-process` &mdash; Horizontal sequential stage pipeline with gate reviews and milestones.
8. `.layout-architecture` &mdash; Dedicated technical canvas for SVG engineering diagrams and legends.
9. `.layout-metrics` &mdash; 4-column metric strip with large tabular numbers and lower analytical split.
10. `.layout-section` &mdash; Chapter break / transition slide with big numeric indicator and agenda tracker.

---

## 6. Component Catalog

* **Cards**: `.card`, `.card--elevated`, `.card--highlighted`, `.card--cyan`, `.card--muted`
* **Metrics**: `.metric-card`, `.metric-value-xl`, `.metric-label`, `.metric-delta--positive`, `.metric-delta--neutral`
* **Badges & Tags**: `.badge--blue`, `.badge--cyan`, `.badge--success`, `.badge--warning`, `.badge--muted`
* **Security Markings**: `.classification-badge`, `.classification-badge--sensitive`, `.classification-badge--sovereign`
* **Callouts & Quotes**: `.callout`, `.callout--cyan`, `.callout--warning`, `.quote-block`
* **Lists**: `.item-list`, `.numbered-item`, `.comparison-list`
* **Process Steps**: `.process-pipeline`, `.process-step`, `.process-step--active`, `.step-phase-badge`
* **Architecture SVG**: `.svg-zone`, `.svg-zone--enclave`, `.svg-node`, `.svg-node-box`, `.svg-connector`, `.svg-connector--flow`

---

## 7. Adding New Slides with AI

When asking the AI assistant to generate or add a new slide to the presentation, use the prompt template below:

### Quick Slide Request Template:

```markdown
Add a new slide to the presentation using the existing design system:

- Layout: [e.g. Two-Column / Card Grid / Process / Architecture / Metrics / Statement]
- Position: [e.g. After slide 4 / As slide 5]
- Eyebrow: [e.g. CYBER RESILIENCE]
- Slide Title: [e.g. Automated Threat Surface Remediation]
- Subtitle: [e.g. Real-time telemetry isolation during electronic warfare events]
- Classification: [e.g. NOT OFFICIAL SENSITIVE]
- Content Points:
  1. [Key point or domain 1]
  2. [Key point or domain 2]
  3. [Key point or domain 3]
- Components to use: [e.g. .card--elevated, .callout--cyan, .metric-card, etc.]
```

### Full AI System Prompt (for External Models / Prompts):

```markdown
You are an expert presentation designer. Create a new slide for our executive presentation using the existing HTML/CSS design system.

### Context & Rules:
1. Target Audience: CTO / CIO / UK Defence & National Infrastructure Executives.
2. Visual Style: Sophisticated, restrained, deep navy palette, crisp typography, generous whitespace.
3. Strict Constraints:
   - Output ONLY clean HTML within `<section class="slide" id="slide-X">...</section>`.
   - Do NOT write inline styles for colors or font-sizes; use existing CSS variables and classes from tokens.css, typography.css, layouts.css, and components.css.
   - Every slide must include `.slide-inner`, `.slide-header` (with `.eyebrow`, `.slide-title`, `.slide-subtitle`), `.slide-body`, and `.slide-footer`.
   - Ensure the slide fits within 1920x1080 without vertical overflow.

### Slide Specification:
- Slide Type: [e.g., Two-Column Comparison / Architecture Diagram / 3-Pillar Deep-Dive / Metrics Scorecard]
- Topic / Subject: [e.g., Zero-Trust Model Pipeline for Maritime Operations]
- Key Points to Include:
  1. [Point 1]
  2. [Point 2]
  3. [Point 3]
```

### Example Request:
> *"Create a new slide demonstrating a 3-pillar deep dive on 'Supply Chain Cyber Provenance' using `.layout-three-column` and `.card--elevated`. Include TRL readiness badges, numbered items for software bill of materials (SBOM), and hardware attestation."*

---

## 8. Running Locally

The template runs entirely in any modern browser without any build step, npm install, or backend server:

```bash
# Option 1: Open directly in your default browser
open index.html

# Option 2: Run via local HTTP server
python3 -m http.server 8080
# Then visit: http://localhost:8080
```
