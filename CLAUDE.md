# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Git workflow

- **Never create Git commits automatically.** Do not run `git commit` unless
  I have explicitly asked for a commit in that message.
- **Never push automatically.** Only run `git push` after I explicitly ask,
  and only once the relevant commits exist and have been reviewed.
- When I ask for a commit:
  - Stage only the files relevant to the change. Keep each commit a clean,
    atomic unit — one logical change per commit. Split unrelated changes
    into separate commits.
  - Write commit messages that follow the
    [Conventional Commits](https://www.conventionalcommits.org/) spec:
    `type(optional-scope): description`
    - Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
      `test`, `build`, `ci`, `chore`, `revert`.
    - Subject line in the imperative mood, lowercase, no trailing period,
      ideally <= 72 characters.
    - Add a body when the change needs context (what and why); wrap at
      ~72 columns.
    - Use `BREAKING CHANGE:` in the footer (or `!` after the type) for
      breaking changes.
  - Show me the proposed commit message(s) before running `git commit`.
- Do not amend, rebase, force-push, or reset without an explicit instruction.
