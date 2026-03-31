-- ============================================================
-- 📘 LESSON: SQL SCHEMA DESIGN
--
-- This file is NOT run automatically by Node.
-- YOU run this manually in MySQL Workbench, phpMyAdmin, or CLI.
-- It creates the database and table our app needs.
--
-- WHY keep this file? 
-- So anyone who clones your project knows exactly what
-- database structure they need. It's documentation + setup.
-- ============================================================

-- Step 1: Create the database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS expense_tracker;

-- Step 2: Switch to that database
USE expense_tracker;

-- Step 3: Create the expenses table
-- LESSON: Every table should have:
--   1. A PRIMARY KEY (unique ID for each row)
--   2. AUTO_INCREMENT (so you don't have to think about IDs)
--   3. Timestamps (to know when data was created)

-- 📘 NOTE: VARCHAR vs TEXT
--   VARCHAR(255) = Up to 255 characters. Use for short, predictable text (names, titles).
--   TEXT         = Up to 65,535 characters. Use for long, unpredictable text (notes, descriptions).
--
-- 📘 NOTE: Why DECIMAL(10, 2) for money?
--   FLOAT/DOUBLE can have rounding errors: 0.1 + 0.2 = 0.30000000004
--   DECIMAL is exact: 0.1 + 0.2 = 0.30 (perfect for money!)
--   (10, 2) means: up to 10 digits total, 2 after the decimal point.
--   Max value: 99999999.99
--
-- 📘 NOTE: DEFAULT values
--   DEFAULT 'General'          → If no category is given, MySQL auto-fills "General"
--   DEFAULT CURRENT_TIMESTAMP  → Auto-fills the current date/time when a row is inserted
--   These work at the DATABASE level, not in our JS code.

CREATE TABLE IF NOT EXISTS expenses (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255)    NOT NULL,           -- What was the expense? e.g., "Lunch"
    amount      DECIMAL(10, 2)  NOT NULL,           -- How much? e.g., 250.50
    category    VARCHAR(100)    DEFAULT 'General',  -- Type: Food, Travel, etc.
    date        DATE            NOT NULL,           -- When did it happen?
    notes       TEXT,                                -- Optional extra info
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- AFTER RUNNING THIS:
-- You should see an empty "expenses" table in your
-- "expense_tracker" database. Verify with:
--   SELECT * FROM expenses;
-- ============================================================
