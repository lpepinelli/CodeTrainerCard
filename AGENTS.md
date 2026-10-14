# AGENTS.md - Developer Trainer Card MVP

## Project Overview

Monorepo with two sub-projects that generates SVG "trainer cards" for GitHub developers:

- **`api/`** — Express.js + TypeScript backend. Generates SVG cards via REST endpoints. Deployed to AWS Lambda using `serverless-http`.
- **`app/`** — React 19 + Vite 8 + TypeScript frontend. Card builder: fills in the API options, previews the card and copies its URL/Markdown.

Infrastructure is managed with Terraform (`api/infra/terraform/`). CI/CD deploys the API to AWS Lambda via GitHub Actions on pushes to `main` that touch `api/`.

---

## Build / Dev / Test Commands

There is **no root-level package.json**. All commands must be run from within the respective sub-project directory.

The root `justfile` has one shortcut: `just dev` runs both dev servers in watch mode in parallel (`just dev-api` / `just dev-app` run one).

### API (`api/`)

| Command           | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `npm install`     | Install dependencies                                             |
| `npm run dev`     | Start dev server with hot-reload (tsx watch + livereload on 35729) |
| `npm run build`   | Compile TypeScript (`tsc`) to `dist/`                            |
| `npm start`       | Run compiled output (`node ./dist/index.js`)                     |

Dev server listens on `http://localhost:3333` (or `PORT` env var).  
SVG preview page: `http://localhost:3333/preview`

### Frontend (`app/`)

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm install`     | Install dependencies                |
| `npm run dev`     | Start Vite dev server               |
| `npm run build`   | Type-check with `tsc -b` then `vite build` |
| `npm run preview` | Preview production build            |
| `npm test`        | Run tests (`node --test`, no extra packages) |

The API base URL defaults to the deployed Lambda. In dev mode `app/.env.development` sets `VITE_API_URL=http://localhost:3333`, so `npm run dev` calls the local API; production builds use the Lambda.

### Tests

- **App**: Node's built-in test runner runs `app/test/**/*.test.ts` directly (native type stripping). Tests live in `test/`, mirroring `src/`, never next to app code.
- **API**: `npm test` runs `api/test/**/*.test.ts` with `tsx --test` (tsx is already a dev dependency). `tsconfig.json` only includes `src`, so tests stay out of the build.

### Linting / Formatting

There is **no ESLint or Prettier configuration**. No `.editorconfig` exists. If adding linting:

- Use ESLint with `@typescript-eslint/parser` for both sub-projects.
- Use Prettier for consistent formatting.

---

## Code Style Guidelines

These conventions are inferred from the existing codebase. Follow them for consistency.

### TypeScript Configuration

- **API**: `strict: true`, target `es2016`, module `commonjs`, JSX `react-jsx`. Output to `dist/`.
- **App**: `strict: true`, target `ES2022`, `moduleResolution: bundler`, JSX `react-jsx`, `noEmit: true` (Vite handles bundling). Split into `tsconfig.app.json` (src) and `tsconfig.node.json` (vite config).
- Both projects enable `forceConsistentCasingInFileNames` and `skipLibCheck`.

### Imports

- Use ES module `import` syntax everywhere (even in the CommonJS-targeted API).
- Prefer `import type { ... }` for type-only imports (see `api/src/controller/cardController.ts:1`):
  ```typescript
  import type { Request, Response } from "express"
  ```
- Use single quotes for import paths in general code.
- Use double quotes for type-only imports (existing convention, though not strictly enforced).
- Group imports: external packages first, then relative imports separated by a blank line.

### Naming Conventions

- **Files**: `camelCase.ts` / `camelCase.tsx` (e.g., `cardController.ts`).
- **Directories**: `camelCase` (e.g., `controller/`, `routes/`).
- **Functions**: `camelCase` (e.g., `getCard`).
- **Variables**: `camelCase` (e.g., `backGround`, `username`).
- **React Components**: `PascalCase` function names (e.g., `App`), default-exported.
- **Constants**: `camelCase` (no UPPER_SNAKE_CASE convention observed).

### Formatting

- **Indentation**: 4 spaces in the API, 2 spaces in the frontend app.
- **Semicolons**: Inconsistent — API code uses semicolons at end of statements; app code omits them. Follow the existing pattern per sub-project.
- **Trailing commas**: Not consistently used.
- **Quotes**: Single quotes predominant; double quotes for type imports.
- **Line length**: No enforced limit.

### Functions & Exports

- API controllers export named arrow functions:
  ```typescript
  export const getCard = (req: Request, res: Response) => { ... }
  ```
- Express routers use `export default router`.
- React components use `export default ComponentName` at end of file.
- Prefer `const` arrow functions for handlers and controllers.

### Error Handling

- Minimal error handling exists. Express route handlers accept `(req, res, next)` but do not call `next()` with errors.
- No global error middleware is configured.
- When adding new endpoints, add try/catch blocks and call `next(error)` for centralized error handling.

### SVG Generation

- SVG strings are built using template literals with embedded expressions.
- Color defaults use `||` operator: `` `#${color || 'BC93FF'}` ``
- Set `Content-Type` header explicitly: `res.setHeader('Content-Type', 'image/svg+xml')`
- Large SVG templates should be extracted to separate template files or functions rather than inline in route handlers.

---

## Project Structure

```
DeveloperTrainerCard-MVP/
├── .devcontainer/          # Dev container config (Neovim, Terraform, AWS CLI)
├── .github/
│   └── workflows/
│       └── deploy-lambda.yml   # CI/CD: deploy API to AWS Lambda
├── api/                    # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── controller/
│   │   │   └── cardController.ts   # SVG card generation logic
│   │   ├── routes/
│   │   │   └── index.ts            # API route definitions
│   │   ├── public/
│   │   │   └── index.html          # Local dev SVG preview page
│   │   └── index.ts                # Express app entry + serverless export
│   ├── infra/
│   │   └── terraform/              # AWS Lambda infrastructure
│   ├── package.json
│   └── tsconfig.json
├── app/                    # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── App.tsx                 # Options state, debounced preview URL, layout
│   │   ├── main.tsx
│   │   ├── cardUrl.ts              # Builds the card URL and Markdown from the options
│   │   ├── index.css               # Pixel style (Pokemon FireRed font, card palette)
│   │   ├── components/             # OptionsForm, SkillPicker, Toggle, CardPreview, ShareActions
│   │   ├── config/                 # API URL, skill keys (mirror api/src/config/skills.ts)
│   │   └── assets/fonts/
│   ├── test/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── AGENTS.md               # This file
└── README.md
```

---

## API Endpoints

| Method | Path                 | Description                                    |
| ------ | -------------------- | ---------------------------------------------- |
| GET    | `/`                  | Returns `{ Warning: 'API endpoint is /api' }`  |
| GET    | `/preview`           | Serves local HTML preview page                 |
| GET    | `/api/card/:username`| Returns dynamic SVG card. Query: `?color=HEX` (all themed shades derive from it, see `templates/palette.ts`) |
| GET    | `/api/fixedCard`     | Returns a hardcoded SVG card with embedded images |

---

## Deployment

- **API**: Deployed to AWS Lambda (`developer-trainer-card`) via GitHub Actions.
  - Trigger: push to `main` touching `api/**`.
  - Build: `npm install && npm run build && zip -r lambda.zip node_modules dist src`.
  - Lambda handler: `dist/index.handler` (via `serverless-http`).
  - Public Lambda URL (no auth).
- **App**: No deployment configured yet.

---

## Key Technical Notes

- The API entry point (`api/src/index.ts`) uses `require.main === module` to conditionally start the Express server for local dev, while exporting `module.exports.handler` for Lambda.
- The API uses `cors()` middleware with default (permissive) settings.
- No database — all card generation is stateless SVG rendering.
- No authentication on any endpoint.
- Node.js 18 runtime on Lambda.
- Dev container includes Neovim, Terraform CLI, and AWS CLI.
