# Spec Delta

## Purpose

Fixes three alignment defects in the Contact section's interactive elements while keeping every text, color and behavior unchanged.

## ADDED Requirements

### Requirement: Corners hug channel links

The system SHALL shrink each channel link to its content so TargetHover corners bracket only the link text at the standard offset.

#### Scenario: Tight corners on desktop

- **WHEN** user views a channel row at 1280px
- **THEN** the link box is narrower than the row and each corner stays within link bounds ± offset (±1px tolerance)

### Requirement: Fixed copy buttons

The system SHALL render all copy buttons with identical fixed widths in every state (copy/copied) and locale.

#### Scenario: Equal copy buttons

- **WHEN** user views the 3 copy buttons in pt, es or en, before or after copying
- **THEN** all three have equal widths (±1px)

### Requirement: Subject pills fill rows

The system SHALL render subject option rows always filling the container width, with per-row items sized by content (unequal widths allowed) and no text touching or overflowing pill borders, in any locale and viewport.

#### Scenario: Full-width rows without touching borders

- **WHEN** user views the subject options at 1280px or 390px in any locale
- **THEN** every row spans the container width (±3px) and every pill text is single-line with its width plus padding fitting inside the pill (±1px)
