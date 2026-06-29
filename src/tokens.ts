/**
 * @zeroroot/brand — canonical design token definitions.
 *
 * Single locked dark terminal-hacker aesthetic: violet-led, near-black,
 * cyan-blue links, CRT scanline overlay. There is NO light mode.
 *
 * Token layers (narrowing from raw to semantic):
 *   PALETTE   — raw color ramps, never reference from components directly
 *   SEMANTIC  — Shadcn/Tailwind-mapped semantic tokens
 *   SPECIALTY — terminal-hacker brand character tokens
 *   DRACULA   — scoped Dracula palette for terminal panels
 *   TYPOGRAPHY — font stacks + weights
 *   LEGACY_ALIASES — --color-zd-* backward-compat map (no new uses)
 */

// ---------------------------------------------------------------------------
// Palette ramps
// ---------------------------------------------------------------------------

export const PALETTE = {
  base: {
    "50":   "oklch(0.985 0.004 280)",
    "100":  "oklch(0.945 0.008 280)",
    "200":  "oklch(0.875 0.012 280)",
    "300":  "oklch(0.770 0.016 280)",
    "400":  "oklch(0.620 0.020 280)",
    "500":  "oklch(0.480 0.022 280)",
    "600":  "oklch(0.380 0.022 280)",
    "700":  "oklch(0.300 0.020 280)",
    "800":  "oklch(0.235 0.018 280)",
    "900":  "oklch(0.175 0.014 280)",
    "950":  "oklch(0.130 0.012 280)",
    "1000": "oklch(0.090 0.010 280)",
  },
  primary: {
    "50":   "oklch(0.970 0.020 295)",
    "100":  "oklch(0.935 0.045 295)",
    "200":  "oklch(0.880 0.090 295)",
    "300":  "oklch(0.800 0.150 295)",
    "400":  "oklch(0.700 0.205 295)",
    "500":  "oklch(0.620 0.230 295)",
    "600":  "oklch(0.560 0.220 295)",
    "700":  "oklch(0.480 0.185 295)",
    "800":  "oklch(0.410 0.150 295)",
    "900":  "oklch(0.355 0.120 295)",
    "950":  "oklch(0.260 0.085 295)",
    "1000": "oklch(0.185 0.060 295)",
  },
  secondary: {
    "50":   "oklch(0.980 0.014 235)",
    "100":  "oklch(0.950 0.034 235)",
    "200":  "oklch(0.905 0.064 235)",
    "300":  "oklch(0.845 0.104 235)",
    "400":  "oklch(0.780 0.140 235)",
    "500":  "oklch(0.710 0.150 235)",
    "600":  "oklch(0.610 0.130 235)",
    "700":  "oklch(0.515 0.105 235)",
    "800":  "oklch(0.440 0.085 235)",
    "900":  "oklch(0.390 0.070 235)",
    "950":  "oklch(0.295 0.055 235)",
    "1000": "oklch(0.210 0.040 235)",
  },
} as const;

export type PaletteRamp = keyof typeof PALETTE;

// ---------------------------------------------------------------------------
// Semantic tokens
// ---------------------------------------------------------------------------

export const SEMANTIC = {
  "background":               "oklch(0.17 0.012 280)",
  "foreground":               "oklch(0.96 0.008 280)",
  "card":                     "oklch(0.21 0.014 280)",
  "card-foreground":          "oklch(0.96 0.008 280)",
  "popover":                  "oklch(0.21 0.014 280)",
  "popover-foreground":       "oklch(0.96 0.008 280)",
  "primary":                  "oklch(0.58 0.225 295)",
  "primary-foreground":       "oklch(0.99 0.004 295)",
  "secondary":                "oklch(0.30 0.040 250)",
  "secondary-foreground":     "oklch(0.96 0.008 280)",
  "muted":                    "oklch(0.255 0.016 280)",
  "muted-foreground":         "oklch(0.76 0.020 280)",
  "accent":                   "oklch(0.275 0.022 288)",
  "accent-foreground":        "oklch(0.96 0.008 280)",
  "destructive":              "oklch(0.54 0.210 22)",
  "destructive-foreground":   "oklch(0.99 0.004 22)",
  "error-text":               "oklch(0.74 0.165 22)",
  "warning":                  "oklch(0.80 0.155 85)",
  "warning-foreground":       "oklch(0.20 0.030 85)",
  "success-foreground":       "oklch(0.18 0.030 162)",
  "overlay":                  "oklch(0.05 0.010 280 / 0.75)",
  "border":                   "oklch(0.34 0.020 280)",
  "input":                    "oklch(0.50 0.024 280)",
  "ring":                     "oklch(0.62 0.230 295)",
  "chart-1":                  "oklch(0.62 0.230 295)",
  "chart-2":                  "oklch(0.74 0.160 162)",
  "chart-3":                  "oklch(0.78 0.150 235)",
  "chart-4":                  "oklch(0.80 0.160 85)",
  "chart-5":                  "oklch(0.62 0.215 22)",
  "radius":                   "0.40rem",
  "sidebar":                  "oklch(0.19 0.013 280)",
  "sidebar-foreground":       "oklch(0.96 0.008 280)",
  "sidebar-primary":          "oklch(0.58 0.225 295)",
  "sidebar-primary-foreground": "oklch(0.99 0.004 295)",
  "sidebar-accent":           "oklch(0.275 0.022 288)",
  "sidebar-accent-foreground": "oklch(0.96 0.008 280)",
  "sidebar-border":           "oklch(0.32 0.020 280)",
  "sidebar-ring":             "oklch(0.62 0.230 295)",
} as const;

export type SemanticToken = keyof typeof SEMANTIC;

// ---------------------------------------------------------------------------
// Specialty tokens
// ---------------------------------------------------------------------------

export const SPECIALTY = {
  "highlight":        "oklch(0.68 0.255 295)",
  "alt":              "oklch(0.76 0.170 162)",
  "link":             "oklch(0.80 0.160 235)",
  "glow-strength":    "0.9",
  "scanline-opacity": "0.035",
  "scanline-color":   "oklch(0.62 0.230 295)",
  "terminal-bg":      "oklch(0.090 0.010 280)",
} as const;

export type SpecialtyToken = keyof typeof SPECIALTY;

// ---------------------------------------------------------------------------
// Dracula terminal palette
// ---------------------------------------------------------------------------

export const DRACULA = {
  "dracula-fg":      "#f8f8f2",
  "dracula-comment": "#6272a4",
  "dracula-cyan":    "#8be9fd",
  "dracula-green":   "#50fa7b",
  "dracula-orange":  "#ffb86c",
  "dracula-pink":    "#ff79c6",
  "dracula-purple":  "#bd93f9",
  "dracula-red":     "#ff5555",
  "dracula-yellow":  "#f1fa8c",
} as const;

export type DraculaToken = keyof typeof DRACULA;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const TYPOGRAPHY = {
  "display-family": '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
  "display-weight": "800",
  "text-family":    '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
} as const;

export type TypographyToken = keyof typeof TYPOGRAPHY;

// ---------------------------------------------------------------------------
// Legacy aliases (--color-zd-*). No new uses; map to semantic/specialty.
// ---------------------------------------------------------------------------

export const LEGACY_ALIASES = {
  "color-zd-bg":           "oklch(0.17 0.012 280)",   // => background
  "color-zd-bg-deep":      "oklch(0.21 0.014 280)",   // => card
  "color-zd-fg":           "oklch(0.96 0.008 280)",   // => foreground
  "color-zd-highlight":    "oklch(0.68 0.255 295)",   // => highlight
  "color-zd-alt":          "oklch(0.76 0.170 162)",   // => alt
  "color-zd-link":         "oklch(0.80 0.160 235)",   // => link
  "color-zd-border":       "oklch(0.34 0.020 280)",   // => border
  "color-zd-accent-purple": "oklch(0.58 0.225 295)",  // => primary
  "color-zd-accent-orange": "oklch(0.80 0.155 85)",   // => warning
} as const;

export type LegacyAliasToken = keyof typeof LEGACY_ALIASES;

// ---------------------------------------------------------------------------
// Palette flat entries (for ALL_TOKENS)
// ---------------------------------------------------------------------------

const PALETTE_FLAT: Record<string, string> = {};
for (const [ramp, stops] of Object.entries(PALETTE)) {
  for (const [stop, value] of Object.entries(stops)) {
    PALETTE_FLAT[`${ramp}-${stop}`] = value;
  }
}

// ---------------------------------------------------------------------------
// ALL_TOKENS — flat record of every CSS custom property name (no --) → value
// ---------------------------------------------------------------------------

export const ALL_TOKENS: Record<string, string> = {
  ...PALETTE_FLAT,
  ...SEMANTIC,
  ...SPECIALTY,
  ...DRACULA,
  ...TYPOGRAPHY,
  ...LEGACY_ALIASES,
};

// ---------------------------------------------------------------------------
// TOKEN_NAMES — typed array of all CSS custom property names (no --)
// ---------------------------------------------------------------------------

export const TOKEN_NAMES = Object.keys(ALL_TOKENS) as Array<keyof typeof ALL_TOKENS>;
