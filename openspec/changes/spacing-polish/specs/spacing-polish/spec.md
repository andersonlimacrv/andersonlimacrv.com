# Spec Delta

## Purpose

Guarantees minimum horizontal breathing room on EdgeReveal rows and all buttons, following the page-standard `px-4`.

## ADDED Requirements

### Requirement: Padded reveal rows

The system SHALL render profile and trajectory rows with 16px horizontal padding so hover overlay edges never touch text.

#### Scenario: Text inset on desktop and mobile

- **WHEN** user views profile or trajectory rows at 1280px or 390px
- **THEN** computed `padding-left` and `padding-right` equal 16px and text starts inset from the row box

### Requirement: Minimum button padding

The system SHALL render copy buttons and subject pills with 16px horizontal padding.

#### Scenario: Padded controls

- **WHEN** user inspects copy buttons and subject pills at 1280px or 390px
- **THEN** computed `padding-left` equals 16px
