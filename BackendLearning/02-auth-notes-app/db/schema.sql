-- ============================================================
-- 📘 LESSON: RELATIONAL DATABASE DESIGN
--
-- In Project 1, we had ONE table (expenses).
-- Now we need TWO tables that are CONNECTED:
--   users  → who is using the app
--   notes  → what they wrote (each note belongs to a user)
--
-- This "belonging" is called a RELATIONSHIP, and we create it
-- using a FOREIGN KEY.
-- ============================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS auth_notes_app;

-- Step 2: Switch to it
USE auth_notes_app;

-- ============================================================
-- Step 3: Create the USERS table
-- ============================================================
-- 📘 LESSON: Storing Passwords
--   NEVER store passwords as plain text! ("password123")
--   We store HASHED passwords using bcrypt.
--   A hash is a one-way transformation:
--     "password123" → "$2a$10$X7K8j..." (60 chars)
--   You CAN'T reverse a hash back to the original password.
--   To check login: hash the attempt and COMPARE hashes.
--
-- 📘 NOTE: Why VARCHAR(255) for password?
--   bcrypt hashes are always 60 characters long.
--   VARCHAR(255) gives room for future hashing algorithms
--   that might produce longer hashes.
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)     NOT NULL UNIQUE,       -- Display name, must be unique
    email       VARCHAR(100)    NOT NULL UNIQUE,       -- Login identifier, must be unique
    password    VARCHAR(255)    NOT NULL,               -- bcrypt hashed password (NEVER plain text!)
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Step 4: Create the NOTES table
-- ============================================================
-- 📘 LESSON: FOREIGN KEY
--   A foreign key creates a LINK between two tables.
--   Here, `user_id` in notes points to `id` in users.
--
--   This means:
--     1. Every note MUST belong to a valid user
--     2. You can't insert a note with a user_id that doesn't exist
--     3. MySQL enforces this rule automatically
--
-- 📘 LESSON: ON DELETE CASCADE
--   What happens if a user is deleted?
--   CASCADE = automatically delete all their notes too
--   Other options:
--     SET NULL  → set user_id to NULL (orphan notes)
--     RESTRICT  → prevent deleting the user until notes are gone
--
-- 📘 LESSON: DEFAULT 'General' for category
--   Same concept from Project 1 — if no category is given,
--   MySQL fills in "General" automatically.
-- ============================================================

CREATE TABLE IF NOT EXISTS notes (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    user_id     INT             NOT NULL,                       -- Who owns this note?
    title       VARCHAR(255)    NOT NULL,                       -- Note title
    content     TEXT,                                           -- Note body (can be long)
    category    VARCHAR(100)    DEFAULT 'General',              -- Organize notes by type
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- 🔗 THE FOREIGN KEY: links user_id → users.id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- AFTER RUNNING THIS:
--   You should see two tables: users and notes.
--   Verify with:
--     SHOW TABLES;
--     DESCRIBE users;
--     DESCRIBE notes;
-- ============================================================
