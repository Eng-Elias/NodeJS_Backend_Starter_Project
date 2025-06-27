# Git Hooks Setup

This document explains the Git hooks setup for code quality and team collaboration in this project.

## Overview

Git hooks are scripts that run automatically at certain points in the Git workflow. This project uses Husky to manage Git hooks, which helps maintain code quality and consistency across the team.

## Installed Hooks

### Pre-commit Hook

The pre-commit hook runs before committing changes and performs the following checks:

- ESLint with auto-fix for fixable issues
- Prettier code formatting
- TypeScript type checking
- Import order checking

This ensures that all committed code follows the project's coding standards.

### Pre-push Hook

The pre-push hook runs before pushing changes to the remote repository and performs:

- Build verification (ensures the code builds successfully)
- Security audit (runs npm audit to check for vulnerabilities)

This prevents pushing code that doesn't build or has security vulnerabilities.

### Commit Message Hook

The commit-msg hook validates commit messages to ensure they follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Where `type` can be:

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Code change that improves performance
- test: Adding missing tests or correcting existing tests
- build: Changes that affect the build system or external dependencies
- ci: Changes to CI configuration files and scripts
- chore: Other changes that don't modify src or test files
- revert: Reverts a previous commit

## Installation

The hooks are automatically installed when you run:

```bash
npm install
```

This is because the `prepare` script in package.json runs `husky install`.

## Usage

### Committing Code

When committing code, the pre-commit hook will automatically run. If there are any issues, the commit will be blocked until they are fixed.

For a better commit message experience, use:

```bash
npm run commit
```

This will launch the commitizen CLI that guides you through creating a properly formatted commit message.

### Pushing Code

When pushing code, the pre-push hook will verify that the code builds successfully and run a security audit.

### Automatic Changelog Generation

To generate a changelog based on your conventional commits:

```bash
npm run release
```

This will:

1. Analyze your commits since the last release
2. Update the version in package.json
3. Generate/update CHANGELOG.md
4. Create a version commit
5. Create a version tag

## Bypassing Hooks (Emergency Only)

In emergency situations, hooks can be bypassed:

- To bypass pre-commit: `git commit --no-verify`
- To bypass pre-push: `git push --no-verify`

**Note:** Bypassing hooks should be done only in exceptional circumstances, as it skips important quality checks.

## Development Workflow Best Practices

1. **Pull Latest Changes**: Always start by pulling the latest changes from the main branch.
2. **Create Feature Branch**: Create a new branch for your feature or fix.
3. **Make Small, Focused Commits**: Make small, focused commits that address a single concern.
4. **Use Conventional Commits**: Follow the conventional commits format for commit messages.
5. **Run Tests Locally**: Run tests locally before pushing to ensure your changes don't break existing functionality.
6. **Code Review**: Request code reviews from team members before merging.
7. **Merge Only When CI Passes**: Only merge code that passes all CI checks.

## Troubleshooting

If you encounter issues with the Git hooks:

1. Make sure Husky is properly installed: `npx husky install`
2. Check that the hook files have execute permissions: `chmod +x .husky/*`
3. Verify that the hooks are correctly configured in the `.husky` directory
