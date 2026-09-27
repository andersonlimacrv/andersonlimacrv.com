# Spec Delta

## Purpose

Brings the reference FlowingMenu marquee interaction into the Astro stack as a theme-aware, keyboard-accessible component whose animation cost is contained to the lab route.

## ADDED Requirements

### Requirement: FlowingMenu reveal and marquee

The system SHALL render FlowingMenu items as real links with an infinite marquee overlay that reveals from the entry edge (`top`/`bottom`) on hover, focus or tap (touch), and hides toward the exit edge on leave, blur or second tap.

#### Scenario: Hover reveals marquee from entry edge

- **WHEN** pointer enters a menu link from the top edge
- **THEN** the marquee overlay slides in from the top within 700 ms and keeps scrolling horizontally during the reveal

#### Scenario: Keyboard and touch parity

- **WHEN** user tabs into a menu link, or taps it on a `hover: none` device
- **THEN** the marquee opens (focus) or toggles open/closed (tap) without navigating away on the toggle tap

### Requirement: FlowingMenu performance and motion safety

The system SHALL pause all marquee `requestAnimationFrame` loops when the menu is outside the viewport or the document is hidden, and SHALL show links statically with no marquee when `prefers-reduced-motion: reduce` is set.

#### Scenario: Loops pause offscreen

- **WHEN** the FlowingMenu scrolls out of the viewport or the tab is hidden
- **THEN** no marquee frame updates run until it becomes visible again

#### Scenario: Reduced motion shows static links

- **WHEN** user has `prefers-reduced-motion: reduce` enabled
- **THEN** menu links render with full contrast and no sliding or scrolling animation

### Requirement: FlowingMenu theming and media

The system SHALL style the menu from site design tokens (light/dark aware, no hardcoded `#120F17` outside the lab scope) and SHALL load marquee media from local optimized assets (never remote Unsplash URLs in production).

#### Scenario: Theme-aware rendering

- **WHEN** user toggles light/dark theme on `/lab`
- **THEN** menu background, text and marquee colors follow the active theme with AA contrast
