# TalentDesk Platform Tech Test

## Setup

```bash
cp .env.example .env
npm i
npm run start-backend
npm run start-frontend
```

## Tests

```bash
npm test
```

## Libraries & Why

- **React Hook Form** — lightweight form state and validation without re-renders; pairs cleanly with Zod for schema-based rules
- **Zod** — schema validation that works on both frontend (form) and backend (request body), keeping rules in one place
- **react-dropzone** — handles drag-and-drop file input with minimal boilerplate; accessible and well-maintained
- **Multer** — standard Express middleware for multipart file uploads; stores files to disk and exposes the saved path

## AI Tooling

As the role requires comfort with AI tooling, I used Claude Code as part of my workflow for scaffolding, writing tests, and sense-checking decisions. Everything was reviewed, tested, and understood before it went in.

## Security

Ran `npm audit fix` on receipt of the repo to resolve any known dependency vulnerabilities before starting work.

## Bonus Skill — lint-fix

A custom Claude Code skill that runs ESLint across the project and automatically applies fixes. Invoke it inside Claude Code with:

```
/lint-fix
```
