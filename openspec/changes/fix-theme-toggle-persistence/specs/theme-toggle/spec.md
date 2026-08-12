## Purpose

Controls light/dark theme on the site: a persistent, accessible toggle in the header that stays
in sync across view-transition navigations and animates the theme change via the View Transition API.

## ADDED Requirements

### Requirement: Theme toggle control
The system SHALL provide a visible control in the site header that switches between light and dark
theme, keeps working after any client-side navigation, and reflects the active theme in its icon.

#### Scenario: Toggle to dark theme
- **WHEN** the user activates the theme toggle while in light theme
- **THEN** the site switches to dark theme and the control updates its icon and state

#### Scenario: Toggle after navigating to a blog page
- **WHEN** the user navigates from the home page to a blog page via a view transition and activates the toggle
- **THEN** the theme switches exactly once per activation

#### Scenario: Reload keeps chosen theme
- **WHEN** the user selects dark theme and reloads the page
- **THEN** the site loads directly in dark theme with no flash of light theme

### Requirement: Theme persistence
The system SHALL persist the chosen theme in `localStorage` and restore it on subsequent visits.

#### Scenario: Stored theme restored on next visit
- **WHEN** a returning user has a stored theme
- **THEN** the site renders in that stored theme from the first paint

### Requirement: System preference default
The system SHALL follow the operating system preference (`prefers-color-scheme`) when no stored theme exists.

#### Scenario: First visit follows the system
- **WHEN** a user with no stored theme visits with the OS in light mode
- **THEN** the site renders in light theme

### Requirement: Animated theme transition
The system SHALL animate the theme change with the View Transition API when supported, falling back to
an instant switch otherwise.

#### Scenario: Animated circle reveal
- **WHEN** a user toggles the theme in a browser that supports `document.startViewTransition`
- **THEN** the new theme is revealed with a circular clip-path transition from the center of the screen

#### Scenario: Reduced motion falls back to instant switch
- **WHEN** a user toggles the theme with `prefers-reduced-motion: reduce`
- **THEN** the theme switches instantly without a view transition animation

#### Scenario: Unsupported browser falls back to instant switch
- **WHEN** a user toggles the theme in a browser without View Transition API support
- **THEN** the theme switches instantly and the icon still updates

### Requirement: Theme transition does not affect page navigation
The system SHALL remove the theme-transition styles after the animation finishes so page
view transitions keep their default behavior.

#### Scenario: Navigation after theme toggle keeps default transition
- **WHEN** the user toggles the theme and then navigates to another page
- **THEN** the page-to-page transition uses the site's default animation

### Requirement: Localized accessible labels
The theme toggle SHALL expose localized labels (`aria-label`, `title`) from the site's i18n strings
and be operable via keyboard.

#### Scenario: Labels match the active locale
- **WHEN** the page is served in Spanish
- **THEN** the toggle's `aria-label` reflects the Spanish labels for dark and light theme

#### Scenario: Keyboard focus
- **WHEN** the user tabs to the theme toggle and presses Enter
- **THEN** the theme toggles and the control displays a visible focus ring

### Requirement: Monochromatic icon using theme tokens
The theme toggle SHALL be rendered with the split sun/moon SVG icon using the site's design tokens,
without hardcoded black/white fills, so it adapts to both themes.

#### Scenario: Icon contrasts in both themes
- **WHEN** the theme is light
- **THEN** the toggle renders a dark control with a light icon
- **WHEN** the theme is dark
- **THEN** the toggle renders a light control with a dark icon
