# lint-fix

Run ESLint across the project, auto-fix all fixable issues, and report any violations that require manual attention.

## Steps

1. Run `npm run lint 2>&1` and capture the output.
2. If there are no errors, report "No lint issues found." and stop.
3. Run `npm run lint:fix 2>&1` to auto-fix all fixable violations.
4. Run `npm run lint 2>&1` again to capture remaining issues.
5. If there are still errors, display each remaining violation with its file path, line number, and rule name so the user can fix them manually.
6. Summarise: how many issues were fixed automatically, how many remain.
7. Run `npm test` to confirm all tests still pass after auto-fixing.
