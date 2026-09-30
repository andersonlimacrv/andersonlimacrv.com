# Spec Delta

## Purpose

Makes page entrances visible and rhythmic with per-element staggered reveals at the same performance cost as the current block reveal.

## ADDED Requirements

### Requirement: Signature translate and duration

The system SHALL render reveal entrances as opacity 0→1 with translateY 24px→0 over 0.7s expo-out, honoring `transition-delay: var(--reveal-delay, 0ms)`.

#### Scenario: Signature values

- **WHEN** user inspects any reveal element before it enters
- **THEN** computed transform is a 24px downward translation and transition duration is 0.7s

### Requirement: Staggered group entrances

The system SHALL reveal grouped items one by one with 60ms steps up to 480ms, driven only by CSS attribute selectors, with the shared IntersectionObserver unchanged.

#### Scenario: Socials stagger in order

- **WHEN** the About socials group enters the viewport
- **THEN** the 5 links show computed `transition-delay` values in ascending order 0ms, 60ms, 120ms, 180ms, 240ms

### Requirement: Hero animates with stagger

The system SHALL animate the hero entrance (eyebrow, title, subtitle, CTAs staggering in) with no CSS animations involved.

#### Scenario: Hero settles fully visible

- **WHEN** user loads any locale home page
- **THEN** within 2s all 4 hero items reach opacity 1

### Requirement: Below-fold starts hidden

The system SHALL start below-the-fold reveal elements at opacity 0 and reveal them on scroll; above-the-fold elements may already be animating on load.

#### Scenario: Scroll reveals the page

- **WHEN** user loads the home and scrolls top to bottom
- **THEN** every reveal element ends with opacity 1 and `is-visible`, and none stays stuck at opacity 0
