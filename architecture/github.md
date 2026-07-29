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
npm audit --audit-level=moderate
```

The same check is automated by `.github/workflows/security-audit.yml`:

- Pull requests that change `package.json`, `package-lock.json` or the workflow itself
- Pushes to `main` that change one of those files
- Every Monday at `09:00` Asia/Kolkata (`03:30` UTC)
- Manual runs through `workflow_dispatch`

The workflow installs the locked dependency tree with Node 24 and runs the local audit script.
It has read-only repository permissions and a ten-minute timeout.

## Dependabot

Dependabot version updates are configured in `.github/dependabot.yml`.

Current policy:

- Ecosystem: `npm`
- Target branch: `main`
- Schedule: weekly, Monday at `09:00` Asia/Kolkata
- Open PR limit: `1`
- Labels: `dependencies`
- Commit prefix: `chore`
- Grouping: all minor and patch npm updates are grouped into one version-update PR
- Major version updates are ignored
- GitHub Actions updates are not configured

This keeps routine update PRs quiet. Major upgrades, such as ESLint 10 or Node type major
bumps, should be reviewed manually because they can break framework/tooling compatibility.

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

This repo keeps `Repository admin` on the bypass list. That is a deliberate tradeoff for a
solo-maintained portfolio: admins keep an escape hatch and can push directly to `main` or
recover quickly, while non-admins still go through pull requests. The cost is that the
`accidental direct pushes` protection no longer applies to admins, so an accidental
`git push origin main` from an admin succeeds instead of being rejected. The normal workflow
below is therefore self-enforced for admins. To make the protection apply to everyone, empty
the bypass list.

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
  the same command in GitHub Actions.
- Add broader CI checks separately so audit failures remain easy to distinguish from lint,
  type-check or build failures.
