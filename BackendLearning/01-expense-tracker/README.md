# Expense Tracker API

A simple REST API to track expenses, built with Node.js, Express, and MySQL.

---

## 🛠️ Project Setup (How to build this from scratch)

### Step 1: Create the project folder

```bash
mkdir expense-tracker
cd expense-tracker
```

### Step 2: Initialize Node.js

```bash
npm init -y
```

This creates `package.json` — the file that tracks your project info and dependencies.

### Step 3: Enable ES Modules

Open `package.json` and add this line:

```json
"type": "module"
```

This lets you use `import/export` instead of the older `require()` syntax.

### Step 4: Add the dev script

In `package.json`, update the `scripts` section:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

- `npm start` → runs your server once
- `npm run dev` → runs with **nodemon** (auto-restarts when you save changes)

### Step 5: Install dependencies

```bash
npm install express mysql2 dotenv nodemon
```

| Package   | Purpose                                         |
| --------- | ----------------------------------------------- |
| `express` | Web framework to handle HTTP requests           |
| `mysql2`  | Connects Node.js to MySQL database              |
| `dotenv`  | Reads `.env` file into `process.env`            |
| `nodemon` | Auto-restarts server on file changes (dev only) |

### Step 6: Create the folder structure

```
expense-tracker/
├── index.js          ← Server entry point
├── .env              ← DB credentials (never commit this!)
├── .gitignore        ← Tells git to ignore node_modules & .env
├── routes/
│   └── expenses.js   ← API route handlers
└── db/
    ├── db.js         ← MySQL connection pool
    └── schema.sql    ← SQL to create database & tables
```

### Step 7: Create `.env`

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker
```

### Step 8: Create `.gitignore`

```
node_modules/
.env
```

### Step 9: Run the SQL schema in MySQL

Open MySQL Workbench / phpMyAdmin / CLI and run `db/schema.sql` to create the database and table.

### Step 10: Start the server

```bash
npm run dev
```

Visit `http://localhost:3000` — you should see the API info JSON.

---

## 📡 API Endpoints

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/expenses`     | Get all expenses  |
| GET    | `/api/expenses/:id` | Get one expense   |
| POST   | `/api/expenses`     | Create an expense |
| PUT    | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

### Example: Create an expense

```bash
curl -X POST http://localhost:3000/api/expenses -H "Content-Type: application/json" -d "{\"title\": \"Lunch\", \"amount\": 250, \"category\": \"Food\", \"date\": \"2026-02-20\"}"
```

---

## 📚 Key Concepts Covered

- Express server, middleware, and routing
- ES Modules (`import/export`)
- MySQL connection pooling
- Environment variables (`.env`)
- Async/Await & error handling
- Parameterized queries (SQL injection prevention)
- HTTP status codes (200, 201, 400, 404, 500)
