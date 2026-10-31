# Commit and PR rules

For anyone committing to this repo, including coding agents. The history is public and is read like a case study, so every commit should be clear to a reviewer who has never seen the code.

## Format

Conventional Commits, the same three types PostHog uses:

```
<type>(<scope>): <description>

<body>

Co-Authored-By: Claude <noreply@anthropic.com>
```

- `feat`: new behavior a user or agent can see
- `fix`: fixes broken behavior
- `chore`: everything else (tests, docs, config, CI, refactors, agent instructions)

**Subject:** lowercase after the colon, imperative ("add", not "added"), no period, under 72 characters, specific. Scope is the area of the repo (`tokens`, `theme`, `explorer`, `analytics`, `ci`, `readme`).

**Body:** why first, then what changed at a high level, then trade-offs or rejected alternatives. Wrap at 72. Leave it out only when the subject says everything.

**Voice:** plain and specific. No em dashes. No marketing words ("comprehensive", "robust", "seamless", "leverage", "enhance", "powerful").

## Scope of a commit

- One idea per commit. Tests go in the same commit as the code they test.
- Formatting-only and rename-only changes get their own commit.
- Keep commits readable in a couple of minutes: roughly under 300 changed lines, excluding lockfiles and generated files.
- Every commit leaves the repo building with tests passing.
- Never commit `.env` files, `dist/`, `src/styles/tokens.css`, or any employer's code or content.

## Process (agents: follow this exactly)

1. Work on a branch (`feat/...`, `fix/...`, `chore/...`), never directly on `main`.
2. Before committing, run `npm run format:check`, `npm run lint`, `npm run check`, and `npm test`.
3. Show Todd the files, a short summary of the diff, and the proposed message. Commit only after he approves or edits it.
4. Keep the `Co-Authored-By` trailer. Don't put "Generated with" lines in commit messages.
5. Fold follow-up fixes into the commit they belong to before pushing (`git commit --fixup <sha>`, then `GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash main`). Never rewrite history on `main`.
6. Open a PR with the template below. Merge with rebase or a merge commit, not squash, so the individual commits stay readable.

## PR template

```markdown
## Changes

- One line per meaningful change

## Decisions

- Choices made and why; alternatives considered

## Testing

- [ ] Tests added or updated
- [ ] Checked by hand (both themes and phone width for anything visual)

## Screenshots
```

## Examples

Good:

```
feat(tokens): fail the build when a contrast pair drops below its minimum

Accessibility checks that happen once in a design review drift as
colors change. Text and background pairs now live in tokens.json next
to the colors they constrain, and build-tokens stops with the failing
pair and its ratio.
```

```
chore(readme): explain why analytics runs without cookies
```

Bad: `update files`, `wip`, `fix stuff`, `address feedback`, `Added explorer and fixed header` (past tense, two changes), or one 2,000-line commit.
