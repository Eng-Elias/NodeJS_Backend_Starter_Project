# Git Hooks for Code Quality and Team Collaboration

This project uses Git hooks to maintain code quality and facilitate team collaboration. Below is a quick guide on how to use them.

## Quick Start

1. **Installation**

   The hooks are automatically installed when you run:

   ```bash
   npm install
   ```

2. **Making Commits**

   Use the following command to create commits with proper formatting:

   ```bash
   npm run commit
   ```

3. **Available Scripts**
   - `npm run lint:fix` - Run ESLint with auto-fix
   - `npm run format` - Run Prettier formatting
   - `npm run type-check` - Run TypeScript type checking
   - `npm run release` - Generate changelog and create a new version

## Features

- **Pre-commit Hook**: Automatically runs ESLint, Prettier, and TypeScript checks on staged files
- **Pre-push Hook**: Verifies build and runs security audit before pushing
- **Commit Message Format**: Enforces conventional commit format
- **Automatic Changelog**: Generates changelog based on commit messages

## Bypassing Hooks (Emergency Only)

In emergency situations:

- `git commit --no-verify` - Bypass pre-commit hook
- `git push --no-verify` - Bypass pre-push hook

## Detailed Documentation

For more detailed information about the Git hooks setup, please refer to the [Git Hooks Documentation](./docs/git-hooks.md).
