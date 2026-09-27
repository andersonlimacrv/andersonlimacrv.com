# Spec Delta

## Purpose

Aligns the FlowingMenu in Projects with the site's visual language (page background, TYPE registry, responsive tag placement, TargetHover link affordance) without changing its behavior or variants.

## ADDED Requirements

### Requirement: Page-matching background

The system SHALL render the FlowingMenu container and rows on the page background (`--background`), keeping the `--border` frame and separators and the approved `--primary` hover overlay.

#### Scenario: Menu blends with page

- **WHEN** user views Projetos in light or dark theme
- **THEN** the menu background is identical to the page background and only borders separate the rows

### Requirement: Registry typography

The system SHALL render all FlowingMenu, lab and edge-demo text exclusively through `TYPE` variants (new `flowingTitle` for menu/marquee titles, `body` for descriptions, `label` for tags and demo micro-labels), so `typography-audit` reports zero violations.

#### Scenario: Audit is clean

- **WHEN** `node scripts/typography-audit.mjs` runs
- **THEN** it reports 0 violations

### Requirement: Responsive tag placement

The system SHALL place technology tags on the right side of the row on desktop, and centered below the text on viewports ≤768px.

#### Scenario: Tags right on desktop

- **WHEN** user views Projetos at 1280px width
- **THEN** each row's tags sit on the right side, vertically centered with the title/description block

#### Scenario: Tags centered below on mobile

- **WHEN** user views Projetos at 390px width
- **THEN** each row stacks title, description and centered tags vertically with no horizontal overflow

### Requirement: TargetSimbol link affordance

The system SHALL render the site's `TargetSimbol` (reticle) on the right side of each project row, spinning on hover, tap and viewport entry, with no `cursor-target` corners on these links.

#### Scenario: Reticle spins on project hover

- **WHEN** user hovers a project row on desktop
- **THEN** the row's reticle starts a spin (`data-spins` increments)
