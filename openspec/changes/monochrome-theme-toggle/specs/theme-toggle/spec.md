## Purpose

Provides an accessible light/dark theme toggle that persists the user's choice, respects system preference on first visit, and avoids color flash (FOUC) on load.

## ADDED Requirements

### Requirement: Theme toggle control
The system SHALL provide a visible control in the site header to switch between light and dark theme, styled as an outlined line icon accessible via keyboard.

#### Scenario: Toggle to dark theme
- **WHEN** the user activates the theme toggle while in light theme
- **THEN** the site switches to dark theme and the control updates its state

#### Scenario: Toggle to light theme
- **WHEN** the user activates the theme toggle while in dark theme
- **THEN** the site switches to light theme and the control updates its state

### Requirement: Theme persistence
The system SHALL persist the chosen theme in `localStorage` and restore it on subsequent visits.

#### Scenario: Reload keeps chosen theme
- **WHEN** the user selects dark theme, then reloads the page
- **THEN** the site loads directly in dark theme with no flash of light theme

### Requirement: System preference default
The system SHALL follow the operating system preference (`prefers-color-scheme`) when no stored theme exists.

#### Scenario: First visit follows the system
- **WHEN** a user with no stored theme visits with the OS in light mode
- **THEN** the site renders in light theme

### Requirement: No theme flash on load
The system SHALL apply the resolved theme before the first paint to prevent FOUC.

#### Scenario: Dark theme loads styled
- **WHEN** the page loads with a stored dark theme
- **THEN** the page is rendered with dark colors from the first paint

### Requirement: Keyboard accessibility
The theme toggle SHALL be operable via keyboard with `:focus-visible` styling.

#### Scenario: Keyboard focus
- **WHEN** the user tabs to the theme toggle and presses Enter
- **THEN** the theme toggles and the control displays a visible focus ring