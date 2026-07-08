# AGENTS.md — UI Apollo Blueprint

## Project Overview

This is a **React 19 + Apollo Client 4 + GraphQL** frontend boilerplate using **Test-Driven Development**. It serves as a starting point for AI coding agents to build frontend applications that consume a GraphQL backend.

**Core stack:**

- **React 19** with functional components and hooks
- **Apollo Client 4.2** — declarative data fetching, `HttpLink`, `InMemoryCache`
- **rxjs 7.8** — peer dependency of Apollo Client 4
- **GraphQL 16** — queries and mutations via codegen-generated `TypedDocumentNode`
- **@graphql-codegen** — generates TypeScript types, operation types, and `TypedDocumentNode` from schema + `.graphql` operation files
- **react-router-dom 7** — client-side routing with `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Outlet>`, `<Link>`, `useNavigate`
- **react-hook-form 7** — performant form state management with uncontrolled inputs
- **zod 4** — schema-based form validation with TypeScript type inference
- **@hookform/resolvers** — bridges zod schemas to react-hook-form
- **zustand 5** — lightweight client-side state management with hooks
- **i18next 26 + react-i18next 17** — internationalization with `useTranslation()` hook
- **i18next-browser-languagedetector** — auto-detects user language from browser/navigator
- **Vite 6** — dev server and production bundler
- **TypeScript 6** — strict mode, `moduleResolution: "bundler"`
- **Vitest 4** — unit/integration tests with jsdom
- **Playwright 1.60** — E2E tests across Chromium, Firefox, WebKit
- **pnpm 11.5.2** — package manager

## Build Commands

```bash
pnpm dev             # Start dev server on port 5173, binds 0.0.0.0
pnpm build           # tsc type-check + vite build (output to dist/)
pnpm preview         # Preview production build locally
pnpm codegen         # Generate TypeScript types from GraphQL schema + operations
pnpm test            # Run Vitest unit tests once
pnpm test:watch      # Run Vitest in watch mode
pnpm e2e             # Run Playwright E2E tests
pnpm lint            # ESLint check
pnpm format:check    # Prettier format check
pnpm format          # Prettier format write
pnpm commitlint      # Validate commit messages (COMMITLINT_FROM/TO env vars)
```

## Blueprint Initialization

When instructed to create a new project from this blueprint, accept a **project name** and **package name** (e.g. `my-dashboard`), then execute the following checklist mechanically.

### Phase 1: Rename identity

| #   | File                            | Action                                                                                                                                                        |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `package.json`                  | Replace `"name": "ui-apollo-blueprint"` with the new project name; reset `"version"` to `"0.0.0-development"`                                                 |
| 2   | `index.html`                    | Replace `<title>Bookstore</title>` with the new project title                                                                                                 |
| 3   | `src/App.tsx`                   | Replace the heading `<h1>Bookstore</h1>` with the new project name (this will be fully replaced in Phase 2 anyway)                                            |
| 4   | `.releaserc.yml`                | Replace the Docker image path `ghcr.io/reytech-dev/ui-apollo-blueprint` with the new registry path (two occurrences: in `prepareCmd` build and push commands) |
| 5   | `codegen.ts`                    | Update the `generates` output path if you want to place generated code elsewhere                                                                              |
| 6   | `.github/workflows/ci.yml`      | Update job names if referencing the old project name. Add a `pnpm codegen` step before `pnpm test` if you want CI to catch schema mismatches.                 |
| 7   | `.github/workflows/release.yml` | Update any project-specific references                                                                                                                        |
| 8   | `AGENTS.md`                     | Replace all occurrences of `ui-apollo-blueprint` and `Bookstore` with the new project name                                                                    |
| 9   | `CHANGELOG.md`                  | Delete (or replace with empty changelog for v0.0.0)                                                                                                           |

### Phase 2: Strip boilerplate example

Delete the entire `Book` example feature:

| #   | File                                     | Action                                                                                                  |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 10  | `src/components/BookList.tsx`            | Delete                                                                                                  |
| 11  | `src/components/CreateBook.tsx`          | Delete                                                                                                  |
| 12  | `src/components/LanguageSwitcher.tsx`     | Delete                                                                                                  |
| 13  | `src/__tests__/BookList.test.tsx`        | Delete                                                                                                  |
| 14  | `src/__tests__/CreateBook.test.tsx`      | Delete                                                                                                  |
| 15  | `src/graphql/operations/books.graphql`   | Delete (the Book-specific operations)                                                                   |
| 16  | `src/graphql/schema.graphqls`            | Replace with the new backend schema. Keep at minimum an empty `type Query { _empty: String }` scaffold. |
| 17  | `src/graphql/generated.ts`               | Delete (stale generated code). Regenerate with `pnpm codegen` after updating the schema.                |
| 18  | `src/schemas/book.schema.ts`             | Delete                                                                                                  |
| 19  | `src/graphql.ts`                         | Strip to minimal Apollo Client setup only (no React imports):                                           |
| 20  | `src/App.tsx`                            | Strip to a minimal scaffold (a single `<main>` with the project heading). No components imported.       |
| 21  | `e2e/books.spec.ts`                      | Delete                                                                                                  |
| 22  | `e2e/auth.setup.ts`                      | Keep as-is (placeholder auth setup, useful for any application)                                         |

**Minimal `src/graphql.ts` after stripping:**

```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(),
});
```

**Minimal `src/App.tsx` after stripping:**

```tsx
export function App() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h1>My App</h1>
    </main>
  );
}
```

### Phase 3: Cleanup residue

| #   | File               | Action                                                                                                                                                              |
| --- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 21  | `dist/`            | Delete the entire directory (stale build output)                                                                                                                    |
| 22  | `vite.config.ts`   | **Keep as-is.** The `/graphql` proxy to `java-runner:8080` and `node-runner` allowed host work generically. Adjust `VITE_GRAPHQL_URL` env var at runtime if needed. |
| 23  | `codegen.ts`       | **Keep as-is.** The config points to `src/graphql/schema.graphqls` and `src/graphql/operations/*.graphql` generically.                                              |
| 24  | `eslint.config.js` | **Keep as-is.** The JS + TS + React rule set applies universally.                                                                                                   |

### Verify

```bash
pnpm install && pnpm codegen && pnpm lint && pnpm test && pnpm build
```

All commands should pass, confirming the scaffold compiles cleanly and codegen produces valid types. The project is now ready for new feature code.

### Post-initialization skeleton

```
src/
├── main.tsx                      # Entry point: ApolloProvider + App, imports ./i18n
├── App.tsx                       # Root component (minimal scaffold)
├── graphql.ts                    # Apollo Client configuration only
├── test-setup.ts                 # jest-dom custom matchers + i18next init for Vitest
├── i18n/
│   ├── index.ts                  # i18next configuration (LanguageDetector + initReactI18next)
│   └── locales/                  # JSON translation files per language
│       ├── en.json
│       └── de.json
├── schemas/                      # Zod validation schemas, one per form
│   └── (new schemas)
├── stores/                        # Zustand stores for client-side state
│   └── (new stores)
├── graphql/
│   ├── schema.graphqls           # Backend schema (source of truth)
│   ├── generated.ts              # Auto-generated types + hooks + document nodes
│   └── operations/               # .graphql operation files (queries, mutations)
├── components/                   # Empty (new components go here)
└── __tests__/                    # Empty (new tests go here)

e2e/
├── auth.setup.ts                 # Auth bootstrap (placeholder, extend as needed)
└── (new E2E specs)
```

## GraphQL Schema Synchronization

The backend's `schema.graphqls` is the **source of truth** for all frontend GraphQL operations. The schema **must** be available before developing the frontend — obtain it from the backend team or repository.

### Field passing conventions

Apollo Client sends mutation/query arguments to the backend in one of two patterns. The frontend must match what the backend expects:

**Individual scalar arguments (each field sent separately):**

```graphql
mutation CreateBook($title: String!, $author: String!, $publishedYear: Int) {
  createBook(title: $title, author: $author, publishedYear: $publishedYear) {
    id
    title
  }
}
```

Backend resolver receives individual `@Argument` annotations:

```java
@MutationMapping
public Mono<Book> createBook(@Argument String title, @Argument String author, @Argument Integer publishedYear)
```

**Input object argument (fields wrapped in an input type variable):**

```graphql
mutation CreateBook($input: CreateBookInput!) {
  createBook(input: $input) {
    id
    title
  }
}
```

Backend resolver receives a single `@Argument` with the input type:

```java
@MutationMapping
public Mono<Book> createBook(@Argument CreateBookInput input)
```

### Staying in sync

- All `.graphql` operation files in `src/graphql/operations/` **must** match the backend schema types, field names, and argument patterns exactly.
- When the backend schema changes (new fields, renamed types, changed arguments):
  1. Update `src/graphql/schema.graphqls` with the new schema
  2. Update affected `.graphql` operation files to match
  3. Run `pnpm codegen` to regenerate types, hooks, and document nodes
- Running `pnpm codegen` automatically validates operations against the schema and surfaces mismatches at build time rather than runtime.

## GraphQL Code Generation

This blueprint includes `@graphql-codegen` for automatic TypeScript type generation from the GraphQL schema.

### Setup

The following dev dependencies provide code generation:

- `@graphql-codegen/cli` — CLI runner (`pnpm codegen`)
- `@graphql-codegen/typescript` — generates TypeScript types from the schema
- `@graphql-codegen/typescript-operations` — generates typed document nodes and data types from `.graphql` operations
- `@graphql-codegen/typed-document-node` — generates `TypedDocumentNode<Query, Variables>` exports for type-safe `useQuery` / `useMutation` calls
- `@graphql-typed-document-node/core` — runtime type dependency for `TypedDocumentNode`

### Configuration (`codegen.ts`)

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/graphql/schema.graphqls',
  documents: 'src/graphql/operations/*.graphql',
  generates: {
    'src/graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    },
  },
};

export default config;
```

### Workflow

1. **Schema** — Place the backend's `schema.graphqls` at `src/graphql/schema.graphqls`. This is the source of truth.
2. **Operations** — Write `.graphql` operation files in `src/graphql/operations/`. Each file contains one or more query/mutation/fragment definitions in standard GraphQL syntax (no `gql` tag needed).
3. **Codegen** — Run `pnpm codegen` to produce `src/graphql/generated.ts`. This file contains:
   - **TypeScript types** for every schema type (e.g., `Book`, `Query`, `Mutation`)
   - **Typed document nodes** (e.g., `BooksDocument` typed as `DocumentNode<BooksQuery, BooksQueryVariables>`) — pass these directly to `useQuery()` and `useMutation()` from `@apollo/client/react`

### What you get (example: Books query)

Given this operation in `src/graphql/operations/books.graphql`:

```graphql
query Books {
  books {
    id
    title
    author
    publishedYear
  }
}
```

Codegen produces (in `generated.ts`):

- `BooksQuery` — TypeScript type for the query result
- `BooksQueryVariables` — TypeScript type for query variables (empty for this query)
- `BooksDocument` — `TypedDocumentNode<BooksQuery, BooksQueryVariables>` — pass to `useQuery()` for full type inference

### Component usage

**Before (manual types):**

```tsx
interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear?: number | null;
}
export const BOOKS_QUERY = gql`
  query Books {
    books {
      id
      title
      author
      publishedYear
    }
  }
`;
const { loading, error, data } = useQuery<{ books: Book[] }>(BOOKS_QUERY);
```

**After (codegen):**

```tsx
import { useQuery } from '@apollo/client/react';
import { BooksDocument } from '../graphql/generated';
const { loading, error, data } = useQuery(BooksDocument);
// data.books is fully typed — no generics needed
```

> **TypedDocumentNode type inference:** When you pass a `TypedDocumentNode<Query, Variables>` to Apollo Client's hooks, TypeScript automatically infers the correct `data` and `variables` types. No manual type parameters needed.

### Test mock usage

Use the generated `*Document` nodes in `MockedProvider` mocks:

```tsx
import { BooksDocument } from '../graphql/generated';

const mock = {
  request: { query: BooksDocument },
  result: { data: { books: [...], __typename: 'Query' } },
};
```

### Keeping generated code in sync

Always run `pnpm codegen` after:

- Updating the schema (`schema.graphqls`)
- Adding or modifying `.graphql` operation files
- Pulling from a branch where the schema changed

Add `src/graphql/generated.ts` to `.gitignore` if you prefer to regenerate in CI rather than commit generated code. Otherwise commit it so the project compiles without running codegen first.

## Project Structure

```
src/
├── main.tsx                      # Application entry point
│                                   wraps <App> in <ApolloProvider>, <BrowserRouter>, and <StrictMode>, imports ./i18n
├── App.tsx                       # Root component — Layout with <Outlet>, <Routes>, <Route>, navigation, and redirects
├── graphql.ts                    # Apollo Client configuration only
├── test-setup.ts                 # Vitest setup (imports jest-dom matchers, inits i18next)
├── i18n/
│   ├── index.ts                  # i18next configuration (LanguageDetector + initReactI18next)
│   └── locales/                  # JSON translation files per language
│       ├── en.json
│       └── de.json
├── schemas/                      # Zod validation schemas, one per form
│   └── book.schema.ts
├── stores/                        # Zustand stores for client-side state
│   └── notification.store.ts
├── graphql/
│   ├── schema.graphqls           # Backend GraphQL schema (source of truth)
│   ├── generated.ts              # Auto-generated: types, TypedDocumentNode exports
│   └── operations/               # .graphql files — queries, mutations, fragments
│       ├── books.graphql
│       └── foo.graphql
├── components/                   # React components, one file per component
│   ├── BookList.tsx
│   ├── CreateBook.tsx
│   └── LanguageSwitcher.tsx
└── __tests__/                    # Vitest tests, mirrors component paths
    ├── BookList.test.tsx
    └── CreateBook.test.tsx

e2e/
├── auth.setup.ts                 # Auth bootstrap (placeholder, extend as needed)
└── books.spec.ts                 # Playwright E2E specs

codegen.ts                        # GraphQL Codegen configuration
```

### Layer Responsibilities

| Layer                             | Purpose                                                                    | Rules                                                                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **`src/graphql/schema.graphqls`** | Backend schema — the source of truth                                       | Never hand-edit types here. Copy from the backend repo.                                                                                       |
| **`src/graphql/operations/`**     | GraphQL operations in `.graphql` files                                     | One file per feature or per operation. No `gql` tags needed — pure GraphQL syntax.                                                            |
| **`src/graphql/generated.ts`**    | Auto-generated: schema types, operation types, `TypedDocumentNode` exports | Never hand-edit. Run `pnpm codegen` to regenerate.                                                                                            |
| **`src/App.tsx`**                 | Route definitions, layout shell, navigation                           | Import `Routes`, `Route`, `Outlet`, `Link` from `react-router-dom`. Use `<Navigate>` for redirects.                                              |
| **`src/main.tsx`**               | Application entry point, provider wiring                              | Render providers in order: `StrictMode` > `ApolloProvider` > `BrowserRouter` > `App`.                                                            |
| **`src/schemas/`**                | Zod validation schemas, one per form                                    | Export schema and inferred type. Validation messages are i18next translation keys.                                                             |
| **`src/stores/`**                 | Zustand stores for client-side state                                     | One store per domain. Use selectors for performance. Reset stores in `beforeEach` for tests.                                                   |
| **`src/graphql.ts`**              | Apollo Client configuration only                                           | No operations or React imports here.                                                                                                          |
| **`src/components/`**             | React components, UI rendering, user interaction                           | Import hooks (`useQuery`, `useMutation`) from `@apollo/client/react`. Import `*Document` nodes from `generated.ts`. Handle all render states. |
| **`src/__tests__/`**              | Unit tests for components                                                  | Use `MockedProvider` from `@apollo/client/testing/react` with `*Document` nodes. Test all states.                                             |
| **`e2e/`**                        | End-to-end browser tests                                                   | Use Playwright. Tag smoke tests with `@smoke`. Depend on `auth.setup`.                                                                        |

## Adding a New Feature

### Step-by-step (TDD order):

1. **Confirm the backend GraphQL schema** is available. Place it at `src/graphql/schema.graphqls`.
2. **Define the GraphQL operation** in a new `.graphql` file under `src/graphql/operations/` (e.g., `foos.graphql`). Use standard GraphQL syntax — no `gql` tag needed.
3. **Run `pnpm codegen`** to generate typed document nodes and operation types in `generated.ts`.
4. **Write unit tests** for the component (TDD: failing first). Use `MockedProvider` from `@apollo/client/testing/react` with `*Document` nodes from `generated.ts`. Include `__typename` in mock data.
5. **Create the React component** in `src/components/`. Import `useQuery` / `useMutation` from `@apollo/client/react`, and `*Document` nodes from `generated.ts`. Handle all 4 states: loading, error, empty, and populated.
6. **Add E2E smoke test** in `e2e/` if the feature is a critical user flow. Tag with `@smoke`.
7. **Wire into `App.tsx`** — add a `<Route>` inside the layout route, e.g., `<Route path="foos" element={<FooList />} />`. Add a `<Link>` in the layout nav if needed.

### Component state handling

Every data-fetching component must handle all 4 states:

```tsx
import { useQuery } from '@apollo/client/react';
import { FoosDocument } from '../graphql/generated';

export function FooList() {
  const { loading, error, data } = useQuery(FoosDocument);

  if (loading) return <p>Loading foos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const foos = data?.foos ?? [];

  if (foos.length === 0) {
    return <p>No foos found.</p>;
  }

  return (
    <section>
      <h2>Foos</h2>
      <ul>
        {foos.map((foo) => (
          <li key={foo.id}>{foo.name}</li>
        ))}
      </ul>
    </section>
  );
}
```

### Mutation and cache invalidation

After a mutation, refetch affected queries to keep the UI in sync:

```tsx
import { useMutation } from '@apollo/client/react';
import { CreateFooDocument, FoosDocument } from '../graphql/generated';

const [createFoo, { loading, error }] = useMutation(CreateFooDocument, {
  refetchQueries: [{ query: FoosDocument }],
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await createFoo({ variables: { name: 'My Foo' } });
    // Clear form, show success, etc. — runs after mutation succeeds
  } catch {
    // error surfaced via the error property from useMutation
  }
};
```

> **`onCompleted` removed in Apollo 4:** The `onCompleted` and `onError` callbacks no longer exist on `useMutation`. Use `await` on the mutate function's returned Promise instead. For error handling, check the `error` property from `useMutation` (still available).

### Component setup pattern

Components should receive data through Apollo hooks, not props. Props are used only for non-data configuration needs (e.g., callbacks from parent layout, display flags).

## Form Validation with react-hook-form + zod

This blueprint uses **react-hook-form** for form state management and **zod** for schema-based validation, connected via `@hookform/resolvers`.

### Setup

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
```

### Zod schema pattern

Define a Zod schema in `src/schemas/` that validates form input. Use the schema's TypeScript inference for the form data type:

```ts
// src/schemas/foo.schema.ts
import { z } from 'zod';

export const fooSchema = z.object({
  name: z.string().min(1, 'foo.validation.nameRequired'),
  count: z.string().refine((val) => val === '' || /^\d+$/.test(val), {
    message: 'foo.validation.countInvalid',
  }),
});

export type FooFormData = z.infer<typeof fooSchema>;
```

- **Validation messages are i18next translation keys** — the component passes them through `t()` to display localized error text.
- **react-hook-form sends string values** from all inputs (even `type="number"`). Use `.string()` for the schema and convert in the submit handler, or use `.preprocess()`/`.refine()` on strings to validate numeric ranges.
- **Export the inferred type** as `FooFormData` for use with `useForm<FooFormData>()`.

### Component usage

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { fooSchema, type FooFormData } from '../schemas/foo.schema';

export function CreateFoo() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FooFormData>({
    resolver: zodResolver(fooSchema),
    mode: 'onBlur',       // validate on blur AND submit
  });

  const onSubmit = async (data: FooFormData) => {
    await createFoo({ variables: { name: data.name } });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        {t('foo.name')}
        <input type="text" {...register('name')} />
      </label>
      {errors.name && <p style={{ color: 'red' }}>{t(errors.name.message!)}</p>}

      <button type="submit">{t('foo.submit')}</button>
    </form>
  );
}
```

### Key patterns

| Pattern | Detail |
|---------|--------|
| `mode: 'onBlur'` | Validates when user leaves a field (blur) AND on submit |
| `register('name')` | Uncontrolled input — spread into the `<input>` element |
| `errors.name.message` | Zod error message (a translation key), passed through `t()` |
| `reset()` | Clears all form fields after successful submit |
| `handleSubmit(onSubmit)` | Only calls `onSubmit` if validation passes |
| `noValidate` on `<form>` | Disables browser-native validation to avoid conflicts |

### Form input conventions

- **Uncontrolled inputs**: react-hook-form manages inputs via `ref`, not `useState`. Use `register()` to bind each input.
- **Number inputs**: HTML `<input type="number">` returns a string through `register()`. Do NOT use `valueAsNumber` — handle conversion in the submit handler or via zod `.refine()`.
- **Labels**: Wrap `<input>` in `<label>` for automatic association, or use `htmlFor` + `id`.

### Testing forms

Test validation errors by submitting the form with empty or invalid fields, then asserting the translated error messages appear:

```tsx
it('shows validation errors on submit with empty required fields', async () => {
  const user = userEvent.setup();
  render(
    <MockedProvider>
      <CreateFoo />
    </MockedProvider>,
  );

  await user.click(screen.getByRole('button', { name: 'Create Foo' }));

  expect(await screen.findByText('Name is required')).toBeInTheDocument();
});
```

Test blur validation by focusing and tabbing away from a required field:

```tsx
it('shows validation error on blur for empty field', async () => {
  const user = userEvent.setup();
  render(
    <MockedProvider>
      <CreateFoo />
    </MockedProvider>,
  );

  await user.click(screen.getByLabelText('Name'));
  await user.tab();

  expect(await screen.findByText('Name is required')).toBeInTheDocument();
});
```

## State Management with Zustand

This blueprint uses **zustand** for client-side state management — state that is not derived from the server (GraphQL) but is needed by the UI, such as notifications, auth state, or toggle states.

### Store pattern

Create one store file per domain in `src/stores/`. Export a hook that components subscribe to:

```ts
// src/stores/foo.store.ts
import { create } from 'zustand';

interface FooStore {
  items: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
}

export const useFooStore = create<FooStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (item) => set((state) => ({ items: state.items.filter((i) => i !== item) })),
}));
```

### Using stores in components

Use selectors to subscribe to only the slice of state the component needs. Without a selector, the component re-renders on every store change:

```tsx
import { useFooStore } from '../stores/foo.store';

// Select a single field — component only re-renders when `items` changes
const items = useFooStore((state) => state.items);

// Select an action — action references are stable and never cause re-renders
const addItem = useFooStore((state) => state.addItem);
```

### Testing stores

**Pure store tests** — Test the store in isolation with no React rendering. Reset state in `beforeEach`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useFooStore } from '../stores/foo.store';

describe('fooStore', () => {
  beforeEach(() => {
    useFooStore.setState({ items: [] });
  });

  it('adds an item', () => {
    useFooStore.getState().addItem('hello');
    expect(useFooStore.getState().items).toEqual(['hello']);
  });
});
```

**Component integration tests** — Components that use stores require no special mocking. Reset the store in `beforeEach` to ensure test isolation:

```tsx
describe('FooComponent', () => {
  beforeEach(() => {
    useFooStore.setState({ items: [] });
  });

  it('renders items from the store', () => {
    useFooStore.getState().addItem('test');
    render(<FooComponent />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

## Internationalization with i18next + react-i18next

This blueprint uses **i18next** for text internationalization and **react-i18next** for the React binding. The `i18next-browser-languagedetector` plugin auto-detects the user's language from `localStorage` (persisted choice) or `navigator.language` (browser default).

### File structure

```
src/i18n/
├── index.ts          # i18next configuration + LanguageDetector + initReactI18next
└── locales/
    ├── en.json       # English translations
    └── de.json       # German translations (example second language)
```

### Configuration (`src/i18n/index.ts`)

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import de from './locales/de.json';

const resources = {
  en: { translation: en },
  de: { translation: de },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,  // React already escapes output
    },
  });

export default i18n;
```

### Translation file structure (`en.json`)

Organize keys by feature/section. Nesting is encouraged:

```json
{
  "app": {
    "title": "My App"
  },
  "foo": {
    "heading": "Foos",
    "loading": "Loading foos...",
    "empty": "No foos found.",
    "detail": "{{name}} ({{count}})",
    "name": "Name",
    "submit": "Create Foo",
    "validation": {
      "nameRequired": "Name is required",
      "countInvalid": "Count must be a number"
    }
  },
  "language": {
    "switch": "Language"
  }
}
```

### Component usage

Import `useTranslation` and use the `t()` function for all user-visible text:

```tsx
import { useTranslation } from 'react-i18next';

export function FooList() {
  const { t } = useTranslation();
  const { loading, error, data } = useQuery(FoosDocument);

  if (loading) return <p>{t('foo.loading')}</p>;
  if (error) return <p>Error: {error.message}</p>;

  const foos = data?.foos ?? [];

  if (foos.length === 0) return <p>{t('foo.empty')}</p>;

  return (
    <section>
      <h2>{t('foo.heading')}</h2>
      <ul>
        {foos.map((foo) => (
          <li key={foo.id}>
            {t('foo.detail', { name: foo.name, count: foo.count })}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### Interpolation

Pass variables as the second argument to `t()`. Use `{{variableName}}` in the translation value:

```json
"detail": "{{title}} by {{author}} ({{year}})"
```

```tsx
t('detail', { title: book.title, author: book.author, year: book.publishedYear })
// -> "Clean Code by Robert C. Martin (2008)"
```

### Language switching

The `i18n` object from `useTranslation()` provides `changeLanguage()` and `language`:

```tsx
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      aria-label={t('language.switch')}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
```

The language detector caches the user's choice in `localStorage`, so the preference persists across page reloads.

### Test setup

i18next must be initialized in `test-setup.ts` **without** `LanguageDetector` (browser APIs are unavailable in jsdom):

```ts
// src/test-setup.ts
import '@testing-library/jest-dom/vitest';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './i18n/locales/en.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en } },
  interpolation: { escapeValue: false },
});
```

- i18next is a **singleton** — initializing it once in `test-setup.ts` makes it available to all components via `useTranslation()`.
- Tests use English translations by default. If you need to test multi-language behavior in unit tests, call `i18n.changeLanguage('de')` within the test.
- The browser `src/i18n/index.ts` file is **not imported** in tests — only in `main.tsx` for the browser app.
- Do **not** mock `useTranslation()` or `react-i18next`. Components use the real i18next singleton configured in `test-setup.ts`.

### E2E testing with multiple languages

Use Playwright's `page.getByLabel` and `page.getByRole` with translated text, or switch the language selector in the test:

```ts
test('switches language to German', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Language').selectOption('de');
  await expect(page.getByRole('heading', { name: 'Buchhandlung' })).toBeVisible();
});
```

### Adding a new language

1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json`) with all translation keys.
2. Import it in `src/i18n/index.ts` and add it to the `resources` object.
3. Add the `<option>` to the `LanguageSwitcher` component.



## Testing Patterns

### Unit tests (Vitest + Testing Library)

Uses Apollo `MockedProvider` to control GraphQL responses. Import mock matchers from `test-setup.ts` (jest-dom). Components that use router hooks (`useNavigate`, `useParams`, `useLocation`) or `<Link>` / `<NavLink>` must be wrapped in `<MemoryRouter>`.

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import { describe, it, expect } from 'vitest';
import { FooList } from '../components/FooList';
import { FoosDocument } from '../graphql/generated';

describe('FooList', () => {
  it('shows loading state', () => {
    const mock = {
      request: { query: FoosDocument },
      result: { data: { foos: [] } },
      delay: Infinity, // Keeps loading state indefinitely
    };
    render(
      <MockedProvider mocks={[mock]}>
        <MemoryRouter>
          <FooList />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('Loading foos...')).toBeInTheDocument();
  });

  it('shows empty state', async () => {
    const mock = {
      request: { query: FoosDocument },
      result: { data: { foos: [], __typename: 'Query' } },
    };
    render(
      <MockedProvider mocks={[mock]}>
        <MemoryRouter>
          <FooList />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(await screen.findByText('No foos found.')).toBeInTheDocument();
  });

  it('renders a list', async () => {
    const mock = {
      request: { query: FoosDocument },
      result: {
        data: {
          foos: [
            { id: '1', name: 'First', __typename: 'Foo' },
            { id: '2', name: 'Second', __typename: 'Foo' },
          ],
          __typename: 'Query',
        },
      },
    };
    render(
      <MockedProvider mocks={[mock]}>
        <MemoryRouter>
          <FooList />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(await screen.findByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('shows error state', async () => {
    const mock = {
      request: { query: FoosDocument },
      error: new Error('Network error'),
    };
    render(
      <MockedProvider mocks={[mock]}>
        <MemoryRouter>
          <FooList />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(await screen.findByText('Error: Network error')).toBeInTheDocument();
  });
});
```

> **Important:** Apollo `MockedProvider` requires `__typename` fields on all mock response objects. Without them, Apollo Client may produce cache warnings or fail to match results. Always include `__typename: 'Query'` on query results and `__typename: 'TypeName'` on each entity.

### Mutation tests

Use `userEvent` from `@testing-library/user-event` for realistic interactions. Mock both the mutation and any refetched queries:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import { describe, it, expect } from 'vitest';
import { CreateFoo } from '../components/CreateFoo';
import { CreateFooDocument, FoosDocument } from '../graphql/generated';

describe('CreateFoo', () => {
  it('submits and clears the form on success', async () => {
    const user = userEvent.setup();
    const createMock = {
      request: {
        query: CreateFooDocument,
        variables: { name: 'My Foo' },
      },
      result: {
        data: { createFoo: { id: '1', name: 'My Foo', __typename: 'Foo' }, __typename: 'Mutation' },
      },
    };
    const refetchMock = {
      request: { query: FoosDocument },
      result: { data: { foos: [], __typename: 'Query' } },
    };
    render(
      <MockedProvider mocks={[createMock, refetchMock]}>
        <MemoryRouter>
          <CreateFoo />
        </MemoryRouter>
      </MockedProvider>,
    );
    await user.type(screen.getByLabelText('Name'), 'My Foo');
    await user.click(screen.getByRole('button', { name: 'Create Foo' }));
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('');
    });
  });
});
```

> **Async mutation handling in Apollo 4:** The mutate function returns a Promise. Use `await` to run code after mutation success. In tests, wrap post-submit assertions in `waitFor()` since React re-renders after the async handler completes.

### E2E tests (Playwright)

Tag smoke tests with `@smoke` so they run in the `smoke-chromium` project on every PR. Full-suite tests (untagged) run across Chromium, Firefox, and WebKit.

```tsx
import { test, expect } from '@playwright/test';

test('can create and view a foo', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/foos');

  await expect(page.getByRole('heading', { name: 'My App' })).toBeVisible();

  await page.getByRole('link', { name: 'Add Foo' }).click();
  await page.getByLabel('Name').fill('My Foo');
  await page.getByRole('button', { name: 'Create Foo' }).click();

  await expect(page).toHaveURL('/foos');
  await expect(page.getByText('My Foo')).toBeVisible();
});
```

Playwright is configured to auto-start `pnpm dev` on port 5173 locally. Set the `FRONTEND_URL` env var to run against an already-running server instead (used in CI/Docker environments).

### E2E testing with translations

All E2E tests should use Playwright's semantic locators (`getByRole`, `getByLabel`) with the **default English text**. To test other languages, switch the language selector in the test first:

```ts
test('displays in German', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/books');
  await page.getByLabel('Language').selectOption('de');
  await expect(page.getByRole('heading', { name: 'Buchhandlung' })).toBeVisible();
});
```

## Vite / Apollo Configuration

### Dev server (vite.config.ts)

| Setting            | Value                                     | Notes                                       |
| ------------------ | ----------------------------------------- | ------------------------------------------- |
| Port               | `5173`                                    | Vite default                                |
| Bind address       | `0.0.0.0` (via `pnpm dev --host 0.0.0.0`) | Accessible from other Docker containers     |
| GraphQL proxy      | `/graphql` → `java-runner:8080`           | Configurable via `VITE_GRAPHQL_URL` env var |
| Allowed hosts      | `node-runner`                             | Required for Docker networking              |
| Vitest environment | `jsdom`                                   | DOM API available in tests                  |
| Vitest globals     | `true`                                    | `describe`/`it`/`expect` auto-imported      |
| Vitest setup       | `./src/test-setup.ts`                     | jest-dom matchers                           |
| Vitest exclude     | `e2e/**`, `node_modules/**`               | Keeps E2E tests separate                    |

### Apollo Client (src/graphql.ts)

```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(),
});
```

- Request URL `/graphql` is relative — proxied by Vite in dev or nginx in production
- `InMemoryCache` with default configuration (sufficient for most use cases)
- No authentication headers configured (add via `HttpLink` headers option when needed)
- **React imports are separate:** `ApolloProvider`, `useQuery`, `useMutation` come from `@apollo/client/react`. Non-React exports (`ApolloClient`, `InMemoryCache`, `HttpLink`) come from `@apollo/client`.
- **`gql` tag is not used in source code** — codegen embeds operations as AST objects in `generated.ts`

### Production (nginx.conf)

In production, nginx serves the static `dist/` files and proxies `/graphql` to `backend:8080`:

```nginx
location / {
    try_files $uri $uri/ /index.html;   # SPA fallback
}
location /graphql {
    proxy_pass http://backend:8080/graphql;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## Docker

Build the image:

```bash
docker build -t my-project .
```

The multi-stage build:

1. **Builder** (`node:22-alpine`): `pnpm install --frozen-lockfile` → `pnpm build` (runs `tsc && vite build`)
2. **Runtime** (`nginx:1.27-alpine`): Copies `dist/` to nginx html root, copies `nginx.conf`

Exposes port 80. The `FRONTEND_URL` and `VITE_GRAPHQL_URL` env vars are not needed at build time — the production build uses relative paths that resolve through the nginx proxy.

## CI/CD

- **CI** (`.github/workflows/ci.yml`): Runs on PRs to `main` and pushes to `main`. Steps: checkout → pnpm install → lint → format check → unit tests → build. Does **not** run E2E tests.
- **Release** (`.github/workflows/release.yml`): Three jobs:
  - `commitlint` — validates all commits follow conventional commit format (uses `COMMITLINT_FROM`/`COMMITLINT_TO` env vars)
  - `semantic-release-dry-run` — previews version bump on non-main branches
  - `release` — on `main`: calculates next version via semantic-release, builds and pushes the Docker image to `ghcr.io/reytech-dev/ui-apollo-blueprint:v{version}`, commits `CHANGELOG.md` back. Uses `@semantic-release/exec` to run `docker build` and `docker push`. Requires `packages: write` repository permission and `docker/login-action` for ghcr.io authentication.

### Semantic-release rules

| Commit type               | Release result     |
| ------------------------- | ------------------ |
| `feat`                    | Minor version bump |
| `fix`, `perf`, `refactor` | Patch version bump |
| `docs`, `test`, `chore`   | No release         |

Tag format: `v${version}` (e.g., `v1.1.0`). Only releases from `main` branch.

## Code Style Conventions

- **No comments** in source code unless explicitly requested. Let the code speak through clear naming.
- **Functional components** with TypeScript. No class components.
- **TypeScript strict mode** (`"strict": true` in `tsconfig.json`). All types explicit.
- **Inline styles** via the `style` prop. No CSS files or CSS-in-JS libraries. The blueprint is intentionally CSS-free.
- **GraphQL operations** live in `src/graphql/operations/*.graphql` files using standard GraphQL syntax. No `gql` template literals in `.ts` files.
- **Apollo Client 4 import conventions:** React exports (`ApolloProvider`, `useQuery`, `useMutation`) from `@apollo/client/react`. Core exports (`ApolloClient`, `InMemoryCache`, `HttpLink`) from `@apollo/client`. Testing (`MockedProvider`) from `@apollo/client/testing/react`.
- **One component per file**, flat `src/components/` directory (no nested feature folders unless the project grows large enough to warrant them).
- **Tests mirror source paths** — `src/components/FooList.tsx` is tested by `src/__tests__/FooList.test.tsx`.
- **Prettier** configuration: single quotes, trailing commas everywhere, 100 character print width, semicolons.
- **ESLint** flat config combining: JS recommended + TypeScript recommended + React recommended + React Hooks recommended + React Refresh (warn on non-component exports).
- **Commit messages** must follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): description` where type is one of `feat`, `fix`, `test`, `refactor`, `docs`, `perf`, `chore`. The scope is **mandatory** (enforced by `commitlint.config.cjs` with `scope-empty: never`). Header max 100 characters.
- Do not introduce new libraries or frameworks without checking the existing dependency list first.
