# Spec Delta

## Purpose

Validates the multi-photo marquee layout (several side-by-side thumbnails per scrolling part) in isolation on the lab route before final photo assets exist.

## ADDED Requirements

### Requirement: Multi-image marquee demo

The system SHALL render a third lab demo (variant C) whose marquee parts each show the label followed by 3 local thumbnails side by side on the same baseline, all `loading="lazy"`, with alternating display widths for visual rhythm.

#### Scenario: Three photos per part

- **WHEN** user visits `/lab` and inspects the variant C demo
- **THEN** every marquee part contains exactly 3 images on the same horizontal line, each lazy-loaded from local optimized assets

#### Scenario: Other demos unchanged

- **WHEN** user views variant A, variant B and the home Projects section
- **THEN** each marquee part still shows exactly 1 image
