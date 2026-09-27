# Spec Delta

## Purpose

Isolated visual test route for interaction components, keeping experiment code and JS weight out of the home page bundle and search index.

## ADDED Requirements

### Requirement: Isolated lab route

The system SHALL expose the component lab at `/lab` only, outside the home one-page, main nav and sitemap priority, with `robots` set to `noindex, nofollow`.

#### Scenario: Lab is isolated from home

- **WHEN** user builds the site and visits `/` and `/lab`
- **THEN** `/` contains zero lab markup, lab CSS or lab JS, and `/lab` renders the lab with a `noindex, nofollow` robots meta

#### Scenario: Lab is not in primary navigation

- **WHEN** user inspects header nav and footer nav on any page
- **THEN** no link to `/lab` exists there (access is direct URL only)

### Requirement: Lab content is localized and semantic

The system SHALL render the lab heading, descriptions and control labels in the active locale (pt/es/en) inside semantic landmarks (`main`, `section` with headings, one `h1`).

#### Scenario: Localized lab heading

- **WHEN** user visits `/lab`, `/es/lab` and `/en/lab`
- **THEN** each page shows the lab `h1` and control labels in its own locale
