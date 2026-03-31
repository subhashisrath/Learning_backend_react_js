// ============================================================
// 📘 LESSON: THE ROOT COMPONENT (App.jsx)
//
// This is the MAIN component of your React app. Think of it as
// the "conductor" of an orchestra — it doesn't play instruments
// itself, but coordinates everything.
//
// App.jsx is responsible for:
//   1. HOLDING the application state (the expenses array)
//   2. FETCHING data from the backend when the app loads
//   3. PASSING data and functions to child components
//   4. COORDINATING create, update, and delete operations
//
// DATA FLOW IN THIS APP:
//   App.jsx (state lives here)
//     ├── ExpenseForm (receives onSubmit function as prop)
//     └── ExpenseList (receives expenses data + handlers as props)
//
// 📘 LESSON: "Lifting State Up"
// We keep the expenses array in App.jsx (not in ExpenseList)
// because BOTH ExpenseForm and ExpenseList need access to it.
// The rule: put state in the CLOSEST COMMON ANCESTOR of the
// components that need it.
// ============================================================

import { useState, useEffect } from 'react';

// ============================================================
// 📘 LESSON: IMPORTING YOUR OWN FILES
//
// We import our components and API functions from their files.
// Notice the paths start with './' — this means "current directory."
//
// './api'                    → src/api.js
// './components/ExpenseForm' → src/components/ExpenseForm.jsx
//
// You DON'T need to add .jsx — Vite figures it out automatically.
// ============================================================
import { getExpenses, createExpense, updateExpense, deleteExpense } from './api';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  // ============================================================
  // 📘 LESSON: APPLICATION STATE
  //
  // These are the "variables" that React tracks and re-renders
  // the UI when they change.
  //
  // expenses        → Array of all expenses from the database
  // editingExpense   → The expense currently being edited (null if none)
  // loading          → Whether we're waiting for data from the server
  // error            → Any error message to display
  //
  // GOLDEN RULE: When state changes → React re-renders → UI updates
  // ============================================================
  const [expenses, setExpenses] = useState([]);             // Start with empty array
  const [editingExpense, setEditingExpense] = useState(null); // Not editing anything yet
  const [loading, setLoading] = useState(true);              // Loading on first render
  const [error, setError] = useState(null);                  // No errors yet

  // ============================================================
  // 📘 LESSON: useEffect — FETCHING DATA ON PAGE LOAD
  //
  // This useEffect runs ONCE when the component first appears
  // (because the dependency array [] is empty).
  //
  // THE FULL FLOW:
  // 1. App.jsx renders for the first time
  // 2. useEffect fires → calls fetchExpenses()
  // 3. fetchExpenses() calls getExpenses() (our api.js function)
  // 4. getExpenses() does fetch('http://localhost:3000/api/expenses')
  // 5. Express receives the request → queries MySQL → sends JSON back
  // 6. getExpenses() returns the data array
  // 7. setExpenses(data) updates state → React re-renders
  // 8. ExpenseList now shows the expenses!
  //
  // THE COMPLETE DATA JOURNEY:
  //   MySQL Database
  //     ↓ SQL query
  //   Express Backend (routes/expenses.js)
  //     ↓ JSON response
  //   fetch() in api.js
  //     ↓ parsed data
  //   useState in App.jsx
  //     ↓ props
  //   ExpenseList component
  //     ↓ renders
  //   Your browser screen! 🎉
  //
  // WHY async function INSIDE useEffect?
  // useEffect callbacks can't be async directly.
  // So we define an async function inside and call it immediately.
  // This is the standard pattern everyone uses.
  // ============================================================
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await getExpenses(); // ← This calls our API!
        setExpenses(data);                 // ← Store the data in state
      } catch (err) {
        setError('Failed to load expenses. Is the backend running?');
        console.error(err);
      } finally {
        // 📘 "finally" runs whether try succeeded OR catch caught an error.
        // We always want to stop the loading spinner.
        setLoading(false);
      }
    };

    fetchExpenses(); // Call the function immediately
  }, []); // ← Empty array = run ONCE on mount

  // ============================================================
  // 📘 LESSON: HANDLER FUNCTIONS
  //
  // These functions handle user actions (create, update, delete).
  // They are passed as PROPS to child components.
  //
  // PATTERN:
  //   1. Call the API function (from api.js)
  //   2. If successful, UPDATE the state
  //   3. React re-renders with the new data
  //
  // WHY UPDATE STATE instead of re-fetching from the database?
  // Both approaches work, but updating state is FASTER because:
  //   - No extra network request
  //   - No extra database query
  //   - Instant UI update
  //
  // The trade-off: if another user changed the data simultaneously,
  // your UI might be stale. For a personal app, this is fine.
  // For a multi-user app, you'd re-fetch or use WebSockets.
  // ============================================================

  // HANDLER: Add a new expense
  const handleAddExpense = async (expense) => {
    try {
      setError(null);
      const newExpense = await createExpense(expense); // ← POST to backend

      // 📘 LESSON: UPDATING ARRAYS IN REACT STATE
      //
      // WRONG: expenses.push(newExpense)
      //   → .push() MUTATES the original array.
      //   → React won't detect the change (same reference).
      //   → UI won't update!
      //
      // RIGHT: setExpenses([newExpense, ...expenses])
      //   → Creates a BRAND NEW array with the new item first.
      //   → React sees a new reference → re-renders!
      //   → This is called "immutable update" — never modify, always replace.
      //
      // The "..." is the SPREAD OPERATOR:
      //   [newExpense, ...expenses]
      //   = [newExpense, expense1, expense2, expense3, ...]
      //   It "spreads" the old array items into the new array.
      setExpenses([newExpense, ...expenses]);
    } catch (err) {
      setError('Failed to add expense. Please check all fields.');
    }
  };

  // HANDLER: Update an existing expense
  const handleUpdateExpense = async (expense) => {
    try {
      setError(null);
      const updatedExpense = await updateExpense(editingExpense.id, expense);

      // 📘 LESSON: .map() FOR UPDATING ONE ITEM IN AN ARRAY
      //
      // We use .map() to create a new array where ONE item is replaced:
      //   [exp1, exp2, exp3].map(exp =>
      //     exp.id === 2 ? updatedData : exp
      //   )
      //   Result: [exp1, updatedData, exp3]
      //
      // This is the immutable way to "update" an item in an array.
      // We're not modifying the old array — we're creating a new one.
      setExpenses(
        expenses.map((exp) =>
          exp.id === editingExpense.id ? updatedExpense : exp
        )
      );

      setEditingExpense(null); // Exit edit mode
    } catch (err) {
      setError('Failed to update expense.');
    }
  };

  // HANDLER: Delete an expense
  const handleDeleteExpense = async (id) => {
    // 📘 LESSON: CONFIRMATION DIALOG
    // window.confirm() shows a browser popup asking "Are you sure?"
    // It returns true if user clicks OK, false if Cancel.
    // This prevents accidental deletions.
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return; // User clicked Cancel — do nothing
    }

    try {
      setError(null);
      await deleteExpense(id); // ← DELETE request to backend

      // 📘 LESSON: .filter() FOR REMOVING ONE ITEM
      //
      // .filter() creates a new array containing only items that
      // pass the test:
      //   expenses.filter(exp => exp.id !== id)
      //   = "Keep all expenses EXCEPT the one with this id"
      //
      // Example: if id = 3
      //   [{ id: 1 }, { id: 2 }, { id: 3 }].filter(exp => exp.id !== 3)
      //   Result: [{ id: 1 }, { id: 2 }]
      setExpenses(expenses.filter((exp) => exp.id !== id));

      // If we were editing this expense, cancel the edit
      if (editingExpense?.id === id) {
        setEditingExpense(null);
      }
    } catch (err) {
      setError('Failed to delete expense.');
    }
  };

  // HANDLER: Start editing an expense
  const handleEdit = (expense) => {
    setEditingExpense(expense); // Set the expense to edit
    // 📘 The ExpenseForm has a useEffect watching editingExpense.
    // When this changes, the form auto-fills with the expense data.
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // HANDLER: Cancel editing
  const handleCancelEdit = () => {
    setEditingExpense(null); // Clear the editing state
  };

  // ============================================================
  // 📘 LESSON: JSX WITH TAILWIND CSS
  //
  // Instead of separate CSS files, Tailwind puts styles INLINE
  // using utility classes. This means:
  //   - No more switching between .js and .css files
  //   - No more inventing class names
  //   - You can SEE all styles right where they're used
  //
  // READING TAILWIND SHORTHAND:
  //   min-h-screen    → min-height: 100vh
  //   flex flex-col   → display: flex; flex-direction: column
  //   max-w-3xl       → max-width: 48rem (768px)
  //   mx-auto         → margin-left: auto; margin-right: auto (center)
  //   px-6            → padding-left: 1.5rem; padding-right: 1.5rem
  //   py-8            → padding-top: 2rem; padding-bottom: 2rem
  // ============================================================
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER
          📘 TAILWIND GRADIENT:
          bg-gradient-to-br → gradient from top-left to bottom-right
          from-[color]      → starting color
          via-[color]       → middle color
          to-[color]        → ending color
          relative          → position: relative (for ::before)
          overflow-hidden   → hide overflowing content */}
      <header className="bg-gradient-to-br from-[var(--accent-primary)] via-[#7c3aed] to-[#4f46e5] py-12 px-6 text-center relative overflow-hidden">
        {/* Decorative shimmer background */}
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_50%)] animate-shimmer" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-1 drop-shadow-lg">
            💸 Expense Tracker
          </h1>
          <p className="text-white/80 text-base font-light">
            Track your spending, understand your habits
          </p>
        </div>
      </header>

      {/* MAIN CONTENT
          📘 TAILWIND CENTERING:
          max-w-3xl → constrain width to 768px
          w-full    → fill available width
          mx-auto   → center horizontally
          flex-1    → grow to fill remaining vertical space */}
      <main className="max-w-3xl w-full mx-auto px-6 py-8 flex-1">
        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-[rgba(255,107,107,0.1)] border border-[rgba(255,107,107,0.3)] rounded-lg px-4 py-3 mb-6 flex justify-between items-center text-[var(--accent-danger)] animate-fade-in">
            <span>⚠️ {error}</span>
            <button
              onClick={() => setError(null)}
              className="bg-transparent border-none text-[var(--accent-danger)] cursor-pointer text-lg p-0.5 opacity-70 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        )}

        {/* EXPENSE FORM
            📘 LESSON: CONDITIONAL PROPS
            We pass different onSubmit handlers based on whether
            we're editing or creating:
              editing  → handleUpdateExpense
              creating → handleAddExpense
            
            The ternary operator (? :) is an inline if/else:
              condition ? valueIfTrue : valueIfFalse
        */}
        <ExpenseForm
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          editingExpense={editingExpense}
          onCancelEdit={handleCancelEdit}
        />

        {/* EXPENSE LIST
            📘 LESSON: CONDITIONAL RENDERING
            We show different things based on the "loading" state:
              loading = true  → Show "Loading..." message
              loading = false → Show the expense list
        */}
        {loading ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            {/* Spinning loader using custom animation */}
            <div className="w-10 h-10 border-3 border-[var(--border-color)] border-t-[var(--accent-primary)] rounded-full animate-spin-custom mx-auto mb-4" />
            <p>Loading expenses...</p>
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDeleteExpense}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="text-center px-6 py-6 text-[var(--text-muted)] text-sm border-t border-[var(--border-color)] mt-auto">
        <p>
          Built with ❤️ to learn React + Express Integration
          <br />
          <small className="text-xs opacity-70">
            Frontend (React on :5173) ↔ Backend (Express on :3000) ↔ MySQL Database
          </small>
        </p>
      </footer>
    </div>
  );
}

export default App;
