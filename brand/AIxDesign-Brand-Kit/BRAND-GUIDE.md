# AIxDesign Brand Kit

## Core idea

**Signal into action.** AIxDesign turns a business constraint into context, a designed system, execution, and a measurable result.

The Voice Agent keeps its product-specific waveform. The wider AIxDesign brand uses a cleaner signal line and nodes to represent movement through:

`INPUT → CONTEXT → AGENT → ACTION → RESULT`

## Positioning lines

- Primary: **Stop learning about AI. Start running on it.**
- Corporate: **Turn AI into operating leverage.**
- System: **From AI ideas to operating systems.**
- Process: **Bottleneck → System → Result**
- Voice product: **Speak the task. Keep moving.**

## Color system

- Midnight Ink — `#09111F` — authority, dark fields, primary text
- Electric Blue — `#2878FF` — action, links, active signals
- Signal Cyan — `#73D7F3` — completion, motion, contrast on ink
- Paper — `#F7F9FC` — primary light background
- Architectural Silver — `#E3EAF3` — rules, panels, quiet structure
- Slate — `#526071` — secondary copy
- White — `#FFFFFF`

Use mostly Paper/White with Ink typography. Use full Ink sections for contrast and authority. Blue is the action color; Cyan is a signal highlight—not a body-copy color on light backgrounds.

## Typography

The kit uses Arial as a portable production fallback. For the website and premium campaign work, use the existing AIxDesign neo-grotesk stack when available.

- Headlines: bold, tight tracking, short line lengths
- Body: regular, generous line height
- Utility labels: bold uppercase with wide tracking
- Avoid dense copy, tiny cyan type, decorative gradients, and generic AI imagery

## Logo hierarchy

1. **Primary wordmark:** `source-svg/aixdesign-wordmark.svg`
2. **Compact mark:** `source-svg/aixdesign-mark.svg`
3. **Profile/app tile:** files in `exports/logos/`
4. **Watermark bug:** transparent PNGs in `exports/video/`

Clear space: keep at least one quarter of the mark’s width on every side. Do not recolor the waveform independently, distort the rounded tile, add drop shadows, or place the dark tile over a visually noisy area without separation.

## Social exports

### Profile images

Use `exports/logos/aixdesign-profile-1024.png` as the master upload. Smaller 512, 400, and 256 versions are included for systems that require them.

### Banners

- LinkedIn company: `1128×191`
- LinkedIn personal: `1584×396`
- X header: `1500×500`
- YouTube: `2560×1440`; keep essential content within the documented `1546×423` center safe area
- Facebook: `1640×624`

Do not move headlines or logos outside the established safe composition without rechecking desktop and mobile crops.

### Posts and thumbnails

- Instagram square: `1080×1080`, light and dark
- Instagram portrait: `1080×1350`
- Story/Reel cover: `1080×1920`
- YouTube thumbnail: `1280×720`

Replace placeholder headlines in the build script and regenerate. Keep one central idea per graphic.

## Video system

Each aspect ratio includes:

- Transparent frame and lower-third overlay
- Branded end card
- Transparent watermark bug

Formats:

- Horizontal: `1920×1080`
- Vertical: `1080×1920`
- Square: `1080×1080`

The transparent PNG overlays should be placed above footage. Replace `TITLE / SPEAKER NAME` and the supporting line in the source script before regenerating for a final production asset. Keep captions clear of the lower-third. The included lower-thirds sit inside action-safe margins.

## Editing and regeneration

The editable source is `scripts/build_brand_kit.py`. Update copy there, then run:

```bash
python3 scripts/build_brand_kit.py
```

The script rebuilds every PNG, SVG, preview, and manifest deterministically.

## Quality rules

- One dominant idea per frame
- Essential type must survive mobile display and platform compression
- Motion should be restrained, smooth, and purposeful
- Prefer real systems, workflows, and product demonstrations over abstract AI clichés
- Do not use robots, glowing brains, purple cyberpunk, or generic call-center imagery
- Keep Voice’s frequency-wave expression distinct from the AIxDesign master signal line
