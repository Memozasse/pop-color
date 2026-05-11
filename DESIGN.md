---
version: alpha
name: Pop Color — Raspberry Bento
description: >
  Premium, friendly visual identity for a relaxing coloring & painting app
  for kids, teens, and adults. Built around a raspberry pink hero, cream
  page surfaces, and a periwinkle accent.
colors:
  # Surfaces
  background: "#FCEFEF"
  surface: "#FFFAF2"
  surface-muted: "#F7E3E7"
  # Text
  text: "#1F1B30"
  text-muted: "#6B6485"
  text-on-brand: "#FFFFFF"
  # Brand — raspberry
  primary: "#C14A68"
  primary-deep: "#A53450"
  primary-soft: "#F7D9E1"
  # Accent — periwinkle (reserved for the single featured / spotlight card)
  accent: "#8999D5"
  accent-deep: "#6F7FC2"
  accent-soft: "#E2E6F4"
  # Semantic
  border: "#F0D7DD"
  overlay: "rgba(31, 27, 48, 0.45)"
  shadow: "rgba(31, 27, 48, 0.10)"
typography:
  display:
    fontFamily: Quicksand
    fontSize: 36px
    fontWeight: "700"
    letterSpacing: "-0.5px"
  title:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: "700"
  heading:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: "700"
  body:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: "500"
  caption:
    fontFamily: Quicksand
    fontSize: 13px
    fontWeight: "500"
  button:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: "700"
rounded:
  sm: 8px
  md: 12px
  lg: 20px
  xl: 28px
  pill: 999px
spacing:
  xs: 4
  sm: 8
  md: 12
  lg: 16
  xl: 24
  xxl: 32
  xxxl: 48
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-on-brand}"
    rounded: "{rounded.pill}"
    padding: 16px
    typography: "{typography.button}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.text-on-brand}"
    rounded: "{rounded.pill}"
    padding: 16px
    typography: "{typography.button}"
  card-bento:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-on-brand}"
    rounded: "{rounded.xl}"
    padding: 16px
  card-bento-alt:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.text-on-brand}"
    rounded: "{rounded.xl}"
    padding: 16px
  card-featured:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.text-on-brand}"
    rounded: "{rounded.xl}"
    padding: 16px
  surface-tile:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 12px
---

## Overview

Pop Color's identity is **playful but premium**. Pages feel like a soft
matte raspberry cream paper. Every screen is a small bento grid of
rounded, slightly-shadowed cards. One periwinkle "featured" card per
screen gives the eye somewhere to land first.

Three implicit audiences (kids, teens, adults) all use the same visuals
— we don't darken the palette for adults or saturate it for kids. The
warmth of Quicksand and the soft raspberry / cream combination is meant
to feel welcoming across ages.

## Colors

- **Background `#FCEFEF`** — warm cream-pink page. Never use pure white.
- **Surface `#FFFAF2`** — slightly warmer "card" surface for content
  blocks (Setting rows, brush picker tiles, modal sheets).
- **Surface muted `#F7E3E7`** — secondary, slightly pink surface for
  inactive chips, dividers-as-blocks, and tertiary cards.
- **Primary (raspberry) `#C14A68`** — the dominant brand color. Used
  for: the active category chip, primary CTAs, half of the bento tiles,
  the progress bar fill on Welcome.
- **Primary deep `#A53450`** — used sparingly for the alternating
  "darker" bento tile and pressed states.
- **Primary soft `#F7D9E1`** — backgrounds of small ornamental elements
  (avatar bubble on Home, switch track).
- **Accent (periwinkle) `#8999D5`** — reserved for **one** featured
  card per screen. Do **not** scatter periwinkle across multiple
  elements on the same screen — its job is to be the single eye-catcher.
- **Accent deep `#6F7FC2`** — periwinkle pressed / hover state.
- **Accent soft `#E2E6F4`** — periwinkle ornaments and decorative
  swirls.
- **Text `#1F1B30`** — primary copy on cream surfaces.
- **Text muted `#6B6485`** — captions, hints, time stamps.
- **Text on brand `#FFFFFF`** — copy that sits on raspberry or
  periwinkle backgrounds.

## Typography

Pop Color uses **Quicksand** across all weights. Quicksand is a rounded,
geometric sans that reads as friendly for kids without ever looking
juvenile to adults. We use weights 500 (regular body), 600 (semibold
buttons), and 700 (bold headings).

- **Display 36/700** — Welcome screen brand wordmark only.
- **Title 24/700** — Screen titles ("Welcome Back, Painter!",
  "Brushes").
- **Heading 20/700** — Section labels ("Themes", "Continue").
- **Body 16/500** — Default copy, button labels, brush names.
- **Caption 13/500** — Hints, page counts, brush descriptions.

Letter spacing is slightly negative (`-0.5px`) on display / title text
to keep Quicksand's rounded forms from feeling airy at large sizes.

## Layout & Spacing

The 4-point spacing scale (4 / 8 / 12 / 16 / 24 / 32 / 48) drives every
padding and gap. Sixteen (`lg`) is the screen edge padding everywhere.

The **bento grid** is the dominant layout primitive. On Home, the
themes appear as a 2-column flex-wrap of `flexBasis: 48%` tiles with
`gap: 12px`. The featured card is full-width above the grid.

## Elevation & Depth

Two shadow tokens only:
- **card** — `offsetY: 4`, `blurRadius: 12`, `opacity: 0.12`. Used on
  bento tiles, the featured card, modal sheets, and Settings rows.
- **button** — `offsetY: 2`, `blurRadius: 6`, `opacity: 0.18`. Used on
  the small circular icon buttons in the top app bar.

We never use a flat-no-shadow style on a card — the soft elevation is
what differentiates Pop Color from a flat material design.

## Shapes

Rounded everywhere. The default tile radius is `xl: 28px`. Brush picker
tiles are `lg + 4 = 24px`. Pills (CTAs, the audience-picker buttons)
use `pill: 999px`.

## Components

- **button-primary** — raspberry pill, white Quicksand 700 label.
  Used: "Kids" button on Audience picker, "Resume" CTA on Home.
- **button-accent** — periwinkle pill, white Quicksand 700 label.
  Used: "Adults" button on Audience picker.
- **card-bento / card-bento-alt** — alternating raspberry / raspberry-
  deep theme tiles on Home. Two columns, fixed aspect, 28px radius.
- **card-featured** — periwinkle, full-width, top of Home. Houses the
  "Resume your painting" or "Start your first painting" prompt + the
  painter-kid illustration.
- **surface-tile** — pink-cream brush picker tile background.

## Do's and Don'ts

- **Do** keep one — and only one — periwinkle element per screen.
- **Do** use Quicksand 700 for any headline; never substitute with
  system-bold.
- **Do** keep the cream `#FCEFEF` background on every screen.
- **Don't** introduce greens, blues, or grays into the chrome — the
  user's painting palettes still ship every color, but the app shell
  is strictly raspberry + cream + periwinkle.
- **Don't** stack two periwinkle cards adjacent to each other.
- **Don't** use pure white `#FFF` as a screen or card background — it
  reads cold against the cream surfaces.
