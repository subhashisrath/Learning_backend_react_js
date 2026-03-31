# Project 3: File Locker (File Uploads & Storage)

You've secured an app with JWT. Now you'll learn to handle **non-text data** — files. The app lets authenticated users upload, list, download, and delete their own files.

## What's New (vs Project 2)

- `multer` — middleware for handling file uploads (multipart/form-data)
- `fs` module — Node's built-in file system module (read, delete files from disk)
- `path` module — building safe, cross-platform file paths
- `express.static()` — serving static files (concept intro)
- **Split storage** — metadata in MySQL, actual files on disk
- **MVC pattern** — controllers, models, routes separated properly

## Project Structure

```
03-file-locker/src/
├── index.js          → server entry, starts Express
├── app.js            → Express app setup (middleware, routes, error handler)
├── constants.js      → allowed file types, size limits, etc.
├── config/
│   ├── db.js         → MySQL connection pool (done ✅)
│   └── schema.sql    → users + files tables (done ✅)
├── models/           → DB queries (e.g., FileModel.create, FileModel.findByUser)
├── controllers/      → business logic (e.g., uploadFile, downloadFile)
├── routes/           → route definitions (e.g., POST /api/files)
├── middleware/        → authMiddleware, uploadMiddleware (multer config)
├── uploads/          → where actual files are saved to disk
└── utils/            → helpers (e.g., deleteFileFromDisk)
```

## Dependencies

```bash
# Already installed ✅
express, mysql2, dotenv, cors, multer, bcryptjs, jsonwebtoken, nodemon
```

## API Endpoints

### Auth Routes (`/api/auth`) — Public

| Method | Endpoint             | Body                            | Response          |
| ------ | -------------------- | ------------------------------- | ----------------- |
| POST   | `/api/auth/register` | `{ username, email, password }` | `{ token, user }` |
| POST   | `/api/auth/login`    | `{ email, password }`           | `{ token, user }` |

### File Routes (`/api/files`) — Protected (JWT Required)

| Method | Endpoint                  | Body / Params           | Response        |
| ------ | ------------------------- | ----------------------- | --------------- |
| POST   | `/api/files`              | form-data: `file` field | `{ file info }` |
| GET    | `/api/files`              | —                       | `{ files[] }`   |
| GET    | `/api/files/:id`          | —                       | `{ file info }` |
| GET    | `/api/files/:id/download` | —                       | file download   |
| DELETE | `/api/files/:id`          | —                       | `{ message }`   |

## Build Order — Step by Step

### Phase 1: Foundation (stuff you already know)

1. **`src/app.js`** — Create the Express app, add `cors()` and `express.json()`
2. **`src/index.js`** — Import app, connect to DB, start listening
3. **Run `schema.sql`** in MySQL to create the `file_locker` database and tables
4. **Auth routes** — Copy-paste your Project 2 auth logic, adapt to MVC:
   - `models/userModel.js` → `findByEmail()`, `create()`
   - `controllers/authController.js` → `register()`, `login()`
   - `routes/authRoutes.js` → wire POST `/register` and `/login`
   - `middleware/authMiddleware.js` → same JWT verify from Project 2
5. **Test** — Register + Login should work. You've done this before. ✅

### Phase 2: The New Stuff — File Upload 🆕

6. **`constants.js`** — Define allowed MIME types and max file size
7. **`middleware/uploadMiddleware.js`** — Configure Multer:
   - Research: `multer.diskStorage()` — destination + filename
   - Research: `fileFilter` — reject unwanted file types
   - Research: `limits` — cap file size
   - This is the KEY file. Spend time understanding each option.
8. **`models/fileModel.js`** — SQL queries:
   - `create(userId, fileData)` → INSERT file metadata
   - `findAllByUser(userId)` → SELECT all user's files
   - `findById(id, userId)` → SELECT one file with ownership check
   - `deleteById(id, userId)` → DELETE from DB
9. **`controllers/fileController.js`** — Business logic:
   - `uploadFile` → Multer saves file, you save metadata to DB
   - `listFiles` → fetch all user's files from DB
   - `getFileInfo` → fetch one file's metadata
   - `downloadFile` → find file on disk + `res.download()` 🆕
   - `deleteFile` → delete from DB + delete from disk with `fs.unlinkSync()` 🆕
10. **`routes/fileRoutes.js`** — Wire routes to controllers

### Phase 3: Error Handling & Polish

11. **Multer error handler** — Handle `LIMIT_FILE_SIZE`, bad file type errors in `app.js`
12. **Test everything** with Postman/curl

## Key Concepts to Research Before Coding

| Concept                | Why                                      | Google This                     |
| ---------------------- | ---------------------------------------- | ------------------------------- |
| `multipart/form-data`  | How files are sent over HTTP (not JSON!) | "multipart form data explained" |
| `multer.diskStorage()` | Where & how files are saved              | "multer disk storage node.js"   |
| `req.file`             | What Multer gives you after upload       | "multer req.file properties"    |
| `fs.unlinkSync()`      | Deleting files from disk                 | "node.js fs unlink"             |
| `res.download()`       | Sending a file as a download response    | "express res.download"          |
| `path.extname()`       | Getting file extension safely            | "node.js path module"           |
| MIME types             | How computers identify file types        | "common MIME types list"        |

## Verification

```bash
# Full flow to test:
# 1. Register a user
# 2. Login → get token
# 3. Upload a file (use Postman form-data, field name: "file")
# 4. List files → should see your file
# 5. Get file info by ID
# 6. Download file by ID → should get the actual file back
# 7. Delete file → should remove from DB AND disk
# 8. Try uploading a .exe → should be rejected
# 9. Try uploading a 10MB file → should be rejected
# 10. Try accessing another user's file → should get 404
```
