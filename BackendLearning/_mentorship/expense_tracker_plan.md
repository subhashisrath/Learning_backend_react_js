# Project: Expense Tracker (Applied Backend Learning)

This project is designed to bridge the gap between "knowing the theory" and "building a project." We will build the backend first using Node.js, Express, and SQL.

## Proposed Strategy: "Learn as we Build"

We won't spend weeks studying. We will start the project **today**. For every piece of code we write, I will explain the "Phase 1 Revision" concept associated with it (e.g., explaining `async/await` when we hit the database).

## Proposed Changes

### [Backend] Node.js & Express API

We will create a RESTful API to handle our expenses.

#### [NEW] `server/` directory

- `index.js`: The entry point. We'll learn how Node starts a process here.
- `package.json`: Dependency management (`express`, `mysql2`, `dotenv`).
- `.env`: Where we store your SQL credentials.

#### [NEW] `server/db/` directory

- `schema.sql`: Your SQL table definitions.
- `db.js`: The connection logic. We'll learn about **Connection Pooling**.

## Phase-by-Phase Execution

### Phase A: The Skeleton (Revision: Node.js & NPM)

- Initializing the project.
- Installing Express.
- Creating a "Hello World" route.
- **Revision Point**: How to use `npm`, common module systems (`import` vs `require`).

### Phase B: The Database (Revision: SQL & Environment Variables)

- Setting up the table for expenses.
- Connecting Node to your local MySQL instance.
- **Revision Point**: Security (not hardcoding passwords) and async database connections.

### Phase C: The CRUD (Revision: REST & Async/Await)

- `POST /expenses`: Create an expense.
- `GET /expenses`: List all expenses.
- **Revision Point**: Understanding HTTP Methods and modern JS flow control.

## Verification Plan

### Automated Tests

- We will use `curl` or a browser to verify our API endpoints as we build them.

### Manual Verification

- We will check your MySQL database directly to ensure data is persisting correctly.
