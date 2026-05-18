# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-05-18

### Added

- `env-file` input to the GitHub Actions inputs table in README.
- Documentation section on using `env-file` with Docker BuildKit secrets, including proper sourcing with `set -a; . /run/secrets/env; set +a` and an Infisical integration example.

## [1.3.0] - 2026-05-17

### Added

- `env-file` property to specify a custom environment file path.

## [1.2.0] - 2026-05-13

### Added

- `context` input to specify a custom Docker build context path.

### Changed

- Environment variables are now carried into `buildx` builds.
- Refactored deployment logic to eliminate duplicated code.
- Improved healthcheck handling.

### Fixed

- Docker `--secret` now uses a temp file instead of stdin, fixing compatibility with GitHub Actions.
- The built action now correctly bundles `@actions/core`, preventing runtime failures.
- Deploy API calls now include `force=true` to ensure Traefik labels are regenerated.

## [1.0.0] - 2025-01-01

- Initial release.
