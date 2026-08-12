## MODIFIED Requirements

### Requirement: Color tokens are monochromatic
The design system SHALL define colors exclusively as neutral tones (black, white, grays) with no hue. `--primary` SHALL equal the foreground color (near-black in light theme, near-white in dark theme); `--secondary` SHALL be a medium gray acting as muted/accent.

#### Scenario: Light theme hues
- **WHEN** the site renders in light theme
- **THEN** primary text resolves to a near-black neutral and no colored accent appears in any element, hover state, selection, or focus ring

#### Scenario: Dark theme hues
- **WHEN** the site renders in dark theme
- **THEN** primary text resolves to a near-white neutral and no colored accent appears in any element, hover state, selection, or focus ring

#### Scenario: Interactive states remain monochrome
- **WHEN** the user hovers, focuses, or selects interactive elements in any theme
- **THEN** the visual response uses only black/white/gray values derived from `--primary` and `--secondary`