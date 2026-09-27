# Spec Delta

## Purpose

Equalizes the hero CTA sizes and gives the profile data column trajectory-style dividers with decorative EdgeReveal, without changing content, links or typography.

## ADDED Requirements

### Requirement: Equal hero CTAs

The system SHALL render both hero CTAs with identical widths filling their row on `sm` screens and up, keeping stacked full-width buttons on mobile and preserving all labels, hrefs, colors and TargetHover.

#### Scenario: Equal widths on desktop

- **WHEN** user views the hero at 1280px width
- **THEN** both CTA boxes have equal widths (±1px) and together fill the button row

### Requirement: High-contrast secondary actions

The system SHALL render the hero "Fale comigo" CTA and the contact direct link in the `foreground` token (dark in light mode, light in dark mode) with a `foreground/30` border strengthening on hover.

#### Scenario: Foreground contrast in both themes

- **WHEN** user views the buttons in light or dark mode
- **THEN** their text color equals the reference `foreground` color of the same page

### Requirement: Profile values in foreground

The system SHALL render profile data values in `text-foreground` (same computed color as trajectory roles), keeping labels muted.

#### Scenario: Values match trajectory

- **WHEN** user views the profile in any locale
- **THEN** a profile value and a trajectory role have identical computed text colors

### Requirement: Profile dividers with reveal

The system SHALL separate every profile data row with a bottom border (except the last) and slide the EdgeReveal background on pointer hover of each row, keeping all labels, texts, order and type scale unchanged, with no focusable rows.

#### Scenario: Divided rows reveal on hover

- **WHEN** user hovers any profile data row on desktop
- **THEN** the row gains `is-open` with full-width background coverage while text stays fixed, and every row except the last shows a bottom border

### Requirement: Clean section structure

The system SHALL render the About profile block without structural dividers on desktop (no header bottom border, no vertical column divide, no trajectory top border), keeping the stacked-column divider on mobile.

#### Scenario: Borderless structure on desktop

- **WHEN** user views the About section at 1280px width
- **THEN** the "01" header has no bottom border, the data column has no left border and the trajectory section has no top border

#### Scenario: Stacked divider kept on mobile

- **WHEN** user views the About section at 390px width
- **THEN** the data column keeps its top divider separating the stacked columns
