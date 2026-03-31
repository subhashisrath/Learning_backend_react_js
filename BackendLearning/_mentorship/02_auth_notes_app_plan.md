# Project 2: Secure Notes API (Authentication & Authorization)

This project teaches the most critical backend skill — keeping users and their data safe. We build a notes API where users register, login with JWT tokens, and manage their own private notes.

## What's New (vs Project 1)

- `bcryptjs` — password hashing (never store plaintext)
- `jsonwebtoken` — stateless token-based authentication
- Auth middleware — protecting routes
- Foreign keys — linking tables (notes belong to users)
- Authorization — users can only access THEIR data

## Project Structure

```
02-auth-notes-app/
├── .env
├── .gitignore
├── package.json
├── index.js
├── db/
│   ├── db.js
│   └── schema.sql
├── middleware/
│   └── auth.js
└── routes/
    ├── auth.js
    └── notes.js
```

## Dependencies

```bash
npm install express mysql2 dotenv cors bcryptjs jsonwebtoken nodemon
```

## API Endpoints

### Auth Routes (`/api/auth`) — Public

| Method | Endpoint             | Body                            | Response          |
| ------ | -------------------- | ------------------------------- | ----------------- |
| POST   | `/api/auth/register` | `{ username, email, password }` | `{ token, user }` |
| POST   | `/api/auth/login`    | `{ email, password }`           | `{ token, user }` |

### Notes Routes (`/api/notes`) — Protected (JWT Required)

| Method | Endpoint         | Body                           | Response      |
| ------ | ---------------- | ------------------------------ | ------------- |
| GET    | `/api/notes`     | —                              | `{ notes[] }` |
| POST   | `/api/notes`     | `{ title, content, category }` | `{ note }`    |
| PUT    | `/api/notes/:id` | `{ title, content, category }` | `{ note }`    |
| DELETE | `/api/notes/:id` | —                              | `{ message }` |

## Build Order

1. Setup project (user does this)
2. `db/schema.sql` — users + notes tables with foreign key
3. `db/db.js` — MySQL connection pool
4. `index.js` — Express server + middleware stack
5. `routes/auth.js` — Register (bcrypt hash) + Login (bcrypt compare + JWT sign)
6. `middleware/auth.js` — JWT verify + attach `req.user`
7. `routes/notes.js` — CRUD with ownership checks (`WHERE user_id = req.user.id`)
8. Test all endpoints with curl

## Verification

```bash
# Register → Login → Create Note → Read Notes → Update → Delete
# Also test: no token (401), wrong user's note (403), bad password (401)
```
