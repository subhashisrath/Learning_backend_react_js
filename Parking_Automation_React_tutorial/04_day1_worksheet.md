# Day 1 Worksheet (Foundation + Auth)

Date target: Wednesday, February 11, 2026

Goal today: Build app foundation + auth flow and understand why each part exists.

## Task 1: Setup and run

1. In learning project root run:
   - `npm install`
   - `npm run dev`
2. Verify app opens in browser.

Checkpoint:
- What does Vite do?
- What does `npm run dev` start?

## Task 2: Config files

Build these files manually:
1. `vite.config.js`
2. `tailwind.config.js`
3. `postcss.config.js`
4. `src/index.css`

Checkpoint:
- Why alias `@` is useful?
- Difference between Tailwind config and index.css?
- What happens if `@tailwind utilities;` is removed?

## Task 3: Entry point

Build:
1. `src/main.jsx`

Checkpoint:
- Why `ReactDOM.createRoot`?
- Why wrap app in `BrowserRouter`?
- What does `React.StrictMode` do?

## Task 4: Auth module

Build in this exact order:
1. `src/auth/roles.js`
2. `src/auth/permissions.js`
3. `src/auth/AuthContext.jsx`
4. `src/auth/index.js`

Checkpoint:
- Why context is needed?
- What is `useMemo` doing here?
- Why session is stored in localStorage?
- Role vs permission: what is the difference?

## Task 5: Route guards + app routes

Build:
1. `src/components/guards.jsx`
2. `src/App.jsx` (placeholder pages allowed today)

Checkpoint:
- Difference between `AuthGuard` and `RoleGuard`?
- Why redirect to `/not-authorized`?

## End of Day 1 Completion Criteria

1. Can login with both demo roles.
2. Protected routes redirect correctly.
3. Role-restricted routes block unauthorized role.
4. You can explain `AuthContext.jsx` flow in your own words.

## Day 1 Reflection (write before stopping)

1. 3 things I understood today:
2. 2 things still confusing:
3. 1 thing I will practice tomorrow first:
