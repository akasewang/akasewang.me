# GitHub Actions Security Audit

This future-scope note describes how to restore the automated GitHub Actions security audit
when GitHub Actions can run reliably for the repository.

The repository currently keeps security auditing as a local script:

```bash
npm run security:audit
```

That is enough while GitHub Actions cannot run because the account's current billing/payment
state blocks jobs from starting. If GitHub Actions becomes available later, re-add an automated
audit workflow so dependency vulnerabilities are checked on pull requests, pushes to `main` and
a weekly schedule.

### Why Add It Later

- It catches vulnerable dependencies before a PR is merged.
- It runs on GitHub, so the result is visible in the pull request UI.
- It can become a required branch protection check after it has proven stable.
- It complements Dependabot alerts by checking the installed dependency tree from
  `package-lock.json`.

### Prerequisites

- GitHub Actions must be able to start jobs for the repository.
- `package.json` must keep this script:

```json
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate"
  }
}
```

- `package-lock.json` should be committed and up to date.
- The workflow should use the same major Node version as local development and Vercel. This repo
  currently targets Node 24 for dependency tooling.
- Re-check the latest stable major versions of `actions/checkout` and `actions/setup-node` before
  restoring the workflow. As of this note, both have stable `v6` tags.

### Workflow File

Create `.github/workflows/security-audit.yml`:

```yaml
name: Security Audit

on:
  pull_request:
    paths:
      - package.json
      - package-lock.json
      - .github/workflows/security-audit.yml
  push:
    branches:
      - main
    paths:
      - package.json
      - package-lock.json
      - .github/workflows/security-audit.yml
  schedule:
    - cron: '0 9 * * 1'
      timezone: Asia/Kolkata
  workflow_dispatch:

permissions:
  contents: read

jobs:
  npm-audit:
    name: npm audit
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Audit dependencies
        run: npm run security:audit
```

The `workflow_dispatch` trigger is included so the audit can be run manually from the GitHub UI
after setup changes. The scheduled run uses an IANA timezone string, so `0 9 * * 1` means Monday
at 09:00 in Asia/Kolkata instead of UTC.

### Optional Full CI Workflow

If Actions becomes reliable and the repo needs stronger PR gates, add a separate CI workflow
instead of growing the security audit workflow too much:

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

jobs:
  verify:
    name: verify
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Biome
        run: npx biome check .

      - name: Lint
        run: npm run lint

      - name: TypeScript
        run: npx tsc --noEmit

      - name: Build
        run: npm run build
```

Keep this separate from the audit workflow so a dependency vulnerability failure is easier to
distinguish from a code/build failure.

### Branch Protection Integration

Do not add required status checks until the workflow has completed successfully at least once on
a pull request. After that:

1. Open `Settings -> Rules -> Rulesets`.
2. Edit the `Protect main` branch ruleset.
3. Enable `Require status checks to pass`.
4. Select the stable check name shown by GitHub, likely `npm audit` under `Security Audit`.
5. If a full CI workflow is added, also require `verify`.

Avoid requiring a check that has never run successfully on the branch. That can block merges until
the ruleset is edited again.

### Dependabot Interaction

Dependabot version updates are intentionally quiet:

- Minor and patch npm updates are grouped.
- Major npm version updates are ignored.
- GitHub Actions updates are not currently configured.

If GitHub Actions is restored, it may be useful to re-enable Dependabot updates for Actions, but
only after deciding whether action major bumps should be manual.

Possible future `.github/dependabot.yml` addition:

```yaml
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: monthly
    open-pull-requests-limit: 1
    ignore:
      - dependency-name: "*"
        update-types:
          - version-update:semver-major
```

This keeps GitHub Actions dependencies maintained without bringing back the branch noise that
created multiple major-update PRs.

### Re-Enable Checklist

1. Confirm GitHub Actions jobs can start.
2. Add `.github/workflows/security-audit.yml`.
3. Run the workflow manually with `workflow_dispatch`.
4. Confirm `npm audit` passes on GitHub.
5. Open a small test PR and confirm the workflow appears on the PR.
6. Only then make `npm audit` a required status check in the `Protect main` ruleset.
7. Keep `npm run security:audit` in `package.json` for local verification.

### Local Commands

Before committing the workflow:

```bash
npm ci
npm run security:audit
npm run lint
npm run build
```

Commit example:

```bash
git add .github/workflows/security-audit.yml architecture/future-scope/github-actions-security-audit.md
git commit -m "ci: restore security audit workflow"
git push
```

## Other Future Candidates

- Add required status checks once a reliable CI provider is available.
- Add CodeQL only if GitHub Actions can run consistently.
- Add a `CODEOWNERS` file if more maintainers join the project.
- Revisit signed commits if release/security requirements become stricter.
