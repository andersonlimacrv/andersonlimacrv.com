# Spec Delta

## Purpose

Makes the home Projects section render as an information-dense FlowingMenu, showing more per project (title, description, tags, image) in the same vertical space while staying fully readable without JS or motion.

## ADDED Requirements

### Requirement: Projects render as FlowingMenu full variant

The system SHALL render every project from `getProjects(locale)` as a FlowingMenu row whose static link shows title, localized description and tags, and whose hover marquee shows the large label plus the local thumbnail. Links SHALL keep external behavior (`target="_blank"`, `rel="noopener noreferrer"`).

#### Scenario: Localized project rows

- **WHEN** user visits `/`, `/es/` and `/en/` and scrolls to Projetos
- **THEN** each of the 3 rows shows its title, the locale description and its tags, and hovering a row opens the image marquee

#### Scenario: External project links

- **WHEN** user inspects a project row link
- **THEN** it carries `target="_blank"` and `rel="noopener noreferrer"`

### Requirement: Full info without motion or JS

The system SHALL keep title, description and tags visible when `prefers-reduced-motion: reduce` is set (marquee hidden) and SHALL render the same static rows in SSR HTML with no marquee content required for comprehension.

#### Scenario: Reduced motion keeps all info

- **WHEN** user enables `prefers-reduced-motion: reduce` and visits `/`
- **THEN** all 3 project rows show title, description and tags with no sliding or scrolling animation

### Requirement: Lab compares both variants

The system SHALL render variant `full` and variant `minimal` FlowingMenu demos on `/lab` (and `/es/lab`, `/en/lab`) under distinct localized headings, so the visual comparison stays available after this change.

#### Scenario: Both variants visible in lab

- **WHEN** user visits `/lab`
- **THEN** two FlowingMenu demos render, one labelled variant A (full) and one variant B (minimal)
