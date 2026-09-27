# Spec Delta

## Purpose

Standardizes section vertical rhythm across the home page with generous spacing above the previous average.

## ADDED Requirements

### Requirement: Standard section padding

The system SHALL render every home section with 80px vertical padding on mobile and 96px on desktop.

#### Scenario: Measured section padding

- **WHEN** user views any home section at 390px or 1280px
- **THEN** computed `padding-top` and `padding-bottom` equal 80px or 96px respectively

### Requirement: Standard title-to-content gap

The system SHALL separate section headings from their content by 48px.

#### Scenario: Measured heading gap

- **WHEN** user views any home section
- **THEN** the content wrapper starts 48px below the heading block

### Requirement: Uniform optical title-to-text gap

The system SHALL keep the ink-to-ink gap (title text bottom to first body text top, measured via `Range`) uniform across all home sections, since equal margins render differently per first-text metrics. Projects carries a localized subtitle line so its first body text aligns with the other sections before the menu box.

#### Scenario: Optical uniformity

- **WHEN** user views the four sections at 390px or 1280px in pt or es
- **THEN** the spread between the largest and smallest optical gap is at most 25px

#### Scenario: Localized projects subtitle

- **WHEN** user views Projetos in pt, es or en
- **THEN** a non-empty subtitle line renders between the heading and the menu
