# Spec Delta

## Purpose

Provides a lightweight edge-direction hover reveal (background-only motion, text stays fixed) reusable on cards, strips and buttons, validated in isolation on the lab route.

## ADDED Requirements

### Requirement: Four-edge background reveal

The system SHALL slide only the `[data-reveal-layer]` background in from the closest entry edge (`top`/`right`/`bottom`/`left`) and out toward the closest exit edge, while the `.hv-ink` text never moves and keeps contrast via `mix-blend-mode: difference`.

#### Scenario: Side-by-side cards reveal horizontally

- **WHEN** pointer enters a row card from the left or right edge
- **THEN** the background layer slides in from that edge within 700 ms with expo-out easing and the text stays fixed

#### Scenario: Background exits toward leave edge

- **WHEN** pointer leaves the element toward the bottom edge
- **THEN** the background layer slides out toward the bottom and commits its resting transform (no snap-back)

### Requirement: EdgeReveal accessibility and motion safety

The system SHALL open on `focus` and close on `blur`, keep a visible `:focus-visible` outline, expose decorative layers as `aria-hidden`, and SHALL swap instantly (no slide) when `prefers-reduced-motion: reduce` is set. Touch devices (`hover: none`) SHALL toggle on tap.

#### Scenario: Keyboard reveal with visible focus

- **WHEN** user tabs through `[data-edge-reveal]` elements
- **THEN** each focused element shows its background instantly-or-animated with a visible focus outline, and hides on blur

#### Scenario: Reduced motion swaps instantly

- **WHEN** user has `prefers-reduced-motion: reduce` enabled
- **THEN** reveal show/hide applies the end state with no WAAPI slide animation
