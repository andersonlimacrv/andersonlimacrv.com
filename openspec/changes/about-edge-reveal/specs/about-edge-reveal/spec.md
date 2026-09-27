# Spec Delta

## Purpose

Brings the validated EdgeReveal hover interaction to the About section's trajectory rows, keeping every static state untouched. Social links were evaluated and reverted to the original TargetHover (visual preference).

## ADDED Requirements

### Requirement: Trajectory rows reveal decoratively

The system SHALL slide the background layer on pointer hover of each trajectory row (Work and Education lists) with the row texts turning to `primary-foreground`, without making rows focusable and without changing row layout or content.

#### Scenario: Row hover sweeps background

- **WHEN** pointer enters a trajectory row
- **THEN** the row gains `is-open` and the background covers it while all texts stay fixed and readable

### Requirement: Motion safety and locales

The system SHALL swap the overlay instantly (no slide) under `prefers-reduced-motion: reduce`, and SHALL render trajectory rows in pt/es/en unchanged, with the 5 social links carrying no reveal markup.

#### Scenario: Reduced motion swaps instantly

- **WHEN** user has `prefers-reduced-motion: reduce` and hovers a trajectory row
- **THEN** the background appears in its end state with no slide animation

#### Scenario: Socials carry no reveal

- **WHEN** user inspects the 5 social links in any locale
- **THEN** none has `data-edge-reveal` or a reveal layer, and all keep `cursor-target`

## REMOVED Requirements

### Requirement: Social links reveal
**Reason**: Reverted after visual validation — the sweep clashed with the social buttons; the original TargetHover reads better there.
**Migration**: Markup restored byte-for-byte to the pre-change state; no data or style migration needed. The `<a>` click-toggle guard stays in `lib/edge-reveal.ts` as defense for future anchor usage.
