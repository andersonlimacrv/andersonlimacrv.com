## Purpose

Multi-lingual support (pt/es/en) with clean locale-prefixed URLs, a language switcher in the header, per-language blog content, and international SEO metadata (hreflang, canonical, og:locale).

## ADDED Requirements

### Requirement: Locale routing
The site SHALL serve content in pt (default, unprefixed), es and en (prefixed). pt lives at `/` and `/blog`; es at `/es/` and `/es/blog`; en at `/en/` and `/en/blog`.

#### Scenario: Default locale unprefixed
- **WHEN** a user visits `/`
- **THEN** the page renders the pt (default) version

#### Scenario: Secondary locale prefixed
- **WHEN** a user visits `/es/` or `/en/`
- **THEN** the page renders the Spanish or English version respectively

### Requirement: Language switcher
The system SHALL provide a visible switcher in the header with links to the equivalent page in pt, es and en, highlighting the current locale.

#### Scenario: Switching language keeps the page
- **WHEN** a user is on `/blog` and selects Spanish
- **THEN** the user is taken to `/es/blog`

#### Scenario: Current locale marked
- **WHEN** the switcher is rendered on an `/en/` page
- **THEN** `en` is visually marked as the active language

### Requirement: Per-language blog content
Posts SHALL declare a `lang` and only posts matching the current locale appear in that locale's index, home section, RSS and detail pages.

#### Scenario: Filtered index
- **WHEN** `/es/blog` is rendered
- **THEN** only posts with `lang: es` are listed

#### Scenario: 404 on mismatched post
- **WHEN** a user visits an `/es/` post URL for a post without an es version
- **THEN** the server responds 404

### Requirement: Localized document language
Every rendered page SHALL declare its language in `html lang` and `Content-Language`.

#### Scenario: Language in head
- **WHEN** `/en/` is rendered
- **THEN** `<html lang="en">` is emitted