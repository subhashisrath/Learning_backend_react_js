-- ============================================================
-- 📘 FILE LOCKER DATABASE SCHEMA
--
-- Two tables:
--   1. users  → stores user accounts (same as Project 2)
--   2. files  → stores FILE METADATA (not the file itself!)
--
-- 📘 WHY STORE METADATA IN THE DATABASE?
--   The actual file lives on disk (in src/uploads/).
--   The database stores INFO ABOUT the file:
--     - Who uploaded it (user_id)
--     - Original filename (what the user named it)
--     - Stored filename (what WE renamed it to — prevents conflicts)
--     - File size, MIME type, upload date
--
--   This separation is important:
--     - DB = fast searches, queries, access control
--     - Disk = actual file storage (databases are bad at storing large blobs)
--
-- 📘 WHAT IS MIME TYPE?
--   MIME = Multipurpose Internet Mail Extensions
--   It tells the browser WHAT KIND of file it is:
--     - "image/png"           → PNG image
--     - "application/pdf"     → PDF document
--     - "text/plain"          → Plain text file
--     - "application/zip"     → ZIP archive
--   We store this so when someone downloads, the browser knows
--   how to handle the file (display image vs download PDF).
-- ============================================================

CREATE DATABASE IF NOT EXISTS file_locker;
USE file_locker;

-- Users table (same concept as Project 2)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Files table (NEW! — stores metadata about uploaded files)
CREATE TABLE IF NOT EXISTS files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  original_name VARCHAR(255) NOT NULL,     -- what the user named the file ("my_photo.jpg")
  stored_name VARCHAR(255) NOT NULL,       -- what we saved it as ("1709012345678-abc123.jpg")
  mime_type VARCHAR(100) NOT NULL,         -- file type ("image/jpeg", "application/pdf")
  size INT NOT NULL,                        -- file size in bytes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- 📘 FOREIGN KEY — links each file to a user
  -- ON DELETE CASCADE: if a user is deleted, all their files are deleted too
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
