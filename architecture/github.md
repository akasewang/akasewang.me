# GitHub Repository Governance

This document records the repository-level GitHub decisions for dependency updates,
security checks and protecting `main`.

## Goals

- Keep dependency updates visible without letting Dependabot create noisy major-version PRs.
- Run dependency vulnerability checks locally and automatically in GitHub Actions.
- Protect `main` from accidental direct pushes, force pushes and branch deletion.
- Keep the local workflow lightweight for a solo-maintained portfolio.

## Security Audit

Security auditing is available locally through:

```bash
npm run security:audit
```

That script runs:

```bash
npm audit --package-lock-only --audit-level=info
```

The equivalent check is automated by `.github/workflows/security-audit.yml`:

- Every pull request
- Every push to `main`
- Daily at `09:00` Asia/Kolkata (`03:30` UTC)
- Manual runs through `workflow_dispatch`

The workflow installs the locked dependency tree with Node 24 while disabling lifecycle scripts,
verifies npm registry signatures and audits the committed lockfile at the `info` threshold. It has
read-only repository permissions, does not persist checkout credentials and has a ten-minute
timeout.

## Dependabot

Dependabot version updates are configured in `.github/dependabot.yml`.

Current npm policy:

- Ecosystem: `npm`
- Target branch: `main`
- Schedule: weekly, Monday at `09:00` Asia/Kolkata
- Open PR limit: `1`
- Labels: `dependencies`
- Commit prefix: `chore`, with dependency scope included
- Grouping: all minor and patch npm updates are grouped into one version-update PR
- Major version updates are ignored

Current GitHub Actions policy:

- Ecosystem: `github-actions`
- Target branch: `main`
- Schedule: weekly, Monday at `09:15` Asia/Kolkata
- Open PR limit: `1`
- Labels: `dependencies`
- Commit prefix: `chore`, with dependency scope included
- Grouping: all GitHub Actions updates are grouped into one version-update PR

This keeps routine update PRs quiet while maintaining the workflow's immutable action references.
Major npm upgrades, such as ESLint 10 or Node type major bumps, should be reviewed manually because
they can break framework/tooling compatibility.

Security updates are separate from routine version updates. GitHub Dependabot security updates
are triggered by vulnerability alerts against the default branch, not by the weekly version
update schedule. Keep Dependabot alerts and security updates enabled in the repository settings.

Recommended GitHub security settings:

- Dependency graph: on
- Automatic dependency submission: on
- Dependabot alerts: on
- Dependabot malware alerts: on
- Dependabot security updates: on
- Grouped security updates: on
- Dependabot version updates: on
- Push protection: on

## Branch Protection

Use a branch ruleset named `Protect main`.

Recommended ruleset settings:

- Enforcement status: `Active`
- Target branches: default branch, or `main`
- Bypass list: `Repository admin`

Enable:

- Restrict deletions
- Require a pull request before merging
- Require conversation resolution before merging
- Block force pushes
- Require linear history, optional

Rulesets apply to everyone who is not on the bypass list. With an empty bypass list and
`Require a pull request before merging` enabled, nobody can push directly to `main`, including
the repository creator and org/repo admins. Each one must open a pull request and merge it
instead of pushing to `main`.

The intended solo-maintainer configuration keeps `Repository admin` on the bypass list. That gives
admins an escape hatch to push directly to `main` or recover quickly, while non-admins still go
through pull requests. The tradeoff is that accidental-direct-push protection no longer applies to
admins, so the normal workflow below is self-enforced for them. Empty the bypass list if the
protection should apply to everyone. Because rulesets live in GitHub rather than this repository,
verify the active bypass list in repository settings after changing it.

Enable `Require status checks to pass` only after the automated `npm audit` check has completed
successfully on a pull request. Requiring a check that has never run can block merges.

Do not enable yet:

- Require deployments to succeed
- Require code scanning results
- Require code quality results
- Require signed commits
- Require review from Code Owners
- Require review from specific teams
- Require approval of the most recent reviewable push
- Dismiss stale pull request approvals

Code scanning rules should wait until a code-scanning workflow is added and proven reliable.

For a solo-maintained repo, required approvals usually add friction without much safety. The
important protections are PR-only changes, no deletion of `main`, no force pushes and resolved
review conversations.

## Normal Workflow

After branch protection is active, do not work directly on `main`.

Use:

```bash
git checkout -b some-change
git push -u origin some-change
```

Then open a pull request into `main`.

Before merging a dependency or security PR, run:

```bash
npm run security:audit
npm run lint
npm run typecheck
npm run build
```

If the change touches formatting-sensitive files, also run:

```bash
npx biome check .
```

## Dependabot PR Triage

For routine minor or patch PRs:

1. Read the changed packages.
2. Run install if the lockfile changed.
3. Run audit, lint and build locally.
4. Merge only if the codebase still passes.

For major upgrades:

- Do not rely on Dependabot automation.
- Test them manually in a separate branch.
- Check framework compatibility first, especially for Next.js, React, TypeScript, ESLint and Node types.

## Notes

- Dependabot-created branches are normal; they are generated automatically for update PRs.
- Existing Dependabot branches can be deleted after closing their PRs.
- The repository intentionally keeps `npm run security:audit` for local verification and uses
  the equivalent audit command in GitHub Actions after registry-signature verification.
- Add broader CI checks separately so audit failures remain easy to distinguish from lint,
  type-check or build failures.
