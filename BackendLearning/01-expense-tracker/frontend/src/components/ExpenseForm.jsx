// ============================================================
// 📘 LESSON: WHAT IS A REACT COMPONENT?
//
// A React component is a FUNCTION that returns JSX (HTML-like syntax).
// Components are the building blocks of a React app.
// Think of them like LEGO pieces — each one does one thing,
// and you combine them to build the full UI.
//
// This component handles the FORM for adding/editing expenses.
// It's used for BOTH creating new expenses AND editing existing ones.
// ============================================================

// ============================================================
// 📘 LESSON: IMPORTS IN REACT
//
// useState — A React "Hook" that lets components have their own data.
// useEffect — A React "Hook" that runs code when something changes.
//
// WHAT IS A HOOK?
// Hooks are special functions (always start with "use") that let
// you "hook into" React's features. Before hooks, you needed
// complex "class components." Hooks made React MUCH simpler.
// ============================================================
import { useState, useEffect } from 'react';

// ============================================================
// 📘 LESSON: COMPONENT PROPS
//
// Props (properties) are how PARENT components pass data to CHILDREN.
// Think of props like function arguments:
//
//   <ExpenseForm onSubmit={handleAdd} />
//         ↑ parent passes       ↑ as a prop called "onSubmit"
//
//   function ExpenseForm({ onSubmit }) { ... }
//         ↑ child receives it via destructuring
//
// This component receives:
//   onSubmit       → function to call when form is submitted
//   editingExpense → if set, we're EDITING (not creating) an expense
//   onCancelEdit   → function to call when user cancels editing
// ============================================================
function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {

  // ============================================================
  // 📘 LESSON: useState — MANAGING FORM DATA
  //
  // useState lets a component "remember" values between renders.
  //
  // const [value, setValue] = useState(initialValue);
  //         ↑        ↑                    ↑
  //    current   function to        starting
  //    value     update it          value
  //
  // When you call setValue(newValue), React:
  //   1. Updates the value
  //   2. RE-RENDERS the component (redraws the UI)
  //
  // WHY NOT USE REGULAR VARIABLES?
  //   let title = '';  ← This would RESET to '' on every render!
  //   useState keeps the value BETWEEN renders.
  //
  // We have one useState for each form field:
  // ============================================================
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  // ============================================================
  // 📘 LESSON: useEffect — RUNNING CODE WHEN DATA CHANGES
  //
  // useEffect runs a function WHEN something changes.
  //
  // useEffect(callbackFunction, [dependencyArray]);
  //
  // The dependency array tells React WHEN to run the callback:
  //   useEffect(() => {...}, [])           → Run ONCE when component first appears
  //   useEffect(() => {...}, [something])  → Run when "something" changes
  //   useEffect(() => {...})               → Run EVERY render (rarely wanted)
  //
  // HERE: We watch [editingExpense]. When the parent sets an expense
  // to edit, this fills the form with that expense's data.
  //
  // WITHOUT useEffect: The form would stay empty even when editing.
  // WITH useEffect: The form auto-populates with the expense data.
  // ============================================================
  useEffect(() => {
    if (editingExpense) {
      // Fill the form with the expense data being edited
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category || '');
      setDate(editingExpense.date.split('T')[0]); // Convert "2024-01-15T00:00:00.000Z" → "2024-01-15"
      setNotes(editingExpense.notes || '');
    }
  }, [editingExpense]); // ← Dependency: re-run when editingExpense changes

  // ============================================================
  // 📘 LESSON: FORM SUBMISSION HANDLER
  //
  // This function runs when the user clicks "Add Expense" or "Update".
  //
  // e.preventDefault() is CRUCIAL:
  //   By default, HTML forms RELOAD THE PAGE when submitted.
  //   (This is old-school behavior from the 1990s.)
  //   In React, we DON'T want page reloads — we handle everything
  //   with JavaScript. preventDefault() stops the reload.
  //
  // After building the expense object, we call onSubmit(expense)
  // which is the function the PARENT passed to us as a prop.
  // The parent decides what to do with it (create or update).
  // ============================================================
  const handleSubmit = (e) => {
    e.preventDefault(); // ← CRITICAL: Stop the page from reloading!

    // Build the expense object from our form state
    const expense = {
      title,
      amount: parseFloat(amount), // Convert string "250.50" → number 250.50
      category: category || 'General', // Default category if empty
      date,
      notes: notes || null, // Send null if no notes (matches backend expectation)
    };

    // Call the parent's function with our expense data
    onSubmit(expense);

    // Clear the form after submission (only if not editing)
    if (!editingExpense) {
      setTitle('');
      setAmount('');
      setCategory('');
      setDate('');
      setNotes('');
    }
  };

  // ============================================================
  // 📘 LESSON: TAILWIND CSS CLASSES (instead of custom CSS)
  //
  // Instead of writing CSS in a separate file:
  //   .expense-form { background: #1e1e44; border-radius: 16px; }
  //
  // We apply Tailwind utility classes DIRECTLY in JSX:
  //   className="bg-[var(--bg-card)] rounded-2xl p-6"
  //
  // READING TAILWIND CLASSES:
  //   bg-[...]      → background color (custom value in brackets)
  //   rounded-2xl   → border-radius: 16px
  //   p-6           → padding: 1.5rem (24px)
  //   mb-6          → margin-bottom: 1.5rem
  //   text-sm       → font-size: 0.875rem
  //   font-semibold → font-weight: 600
  //   w-full        → width: 100%
  //   grid          → display: grid
  //   grid-cols-2   → grid-template-columns: repeat(2, 1fr)
  //   gap-4         → gap: 1rem
  //
  // ARBITRARY VALUES [...]:
  //   Tailwind has built-in colors like bg-blue-500.
  //   But our custom theme uses CSS variables, so we use:
  //     bg-[var(--bg-card)]  → "use this CSS variable as background"
  //   The [...] syntax lets you use ANY CSS value.
  //
  // HOVER STATES:
  //   hover:shadow-lg → apply shadow-lg ONLY on hover
  //   This is like writing  .element:hover { box-shadow: ... }
  //
  // RESPONSIVE:
  //   sm:grid-cols-1 → on small screens, use 1 column
  //   md:grid-cols-2 → on medium screens, use 2 columns
  // ============================================================

  // ============================================================
  // 📘 LESSON: CONTROLLED INPUTS
  //
  // In React, form inputs can be "controlled" or "uncontrolled":
  //
  // CONTROLLED (what we use):
  //   <input value={title} onChange={(e) => setTitle(e.target.value)} />
  //   React CONTROLS the input's value. The input always shows
  //   what's in our state. When the user types, onChange fires,
  //   which updates state, which re-renders the input.
  //
  //   Flow: User types → onChange fires → setState → re-render → input updates
  //
  // UNCONTROLLED (simpler but less powerful):
  //   <input ref={inputRef} />
  //   The DOM controls the input. You read the value when needed.
  //
  // WHY CONTROLLED?
  //   - You can validate on every keystroke
  //   - You can transform input (e.g., uppercase)
  //   - You always know the current value
  //   - You can pre-fill the form (for editing)
  //
  // e.target.value:
  //   "e" is the event object. "target" is the input element.
  //   "value" is what the user typed. So e.target.value = "Lunch"
  // ============================================================
  return (
    <form
      onSubmit={handleSubmit}
      /* 📘 TAILWIND BREAKDOWN:
         bg-[var(--bg-card)]  → dark card background from CSS variable
         border               → add a border
         border-[...]         → border color from CSS variable
         rounded-2xl          → large border radius (16px)
         p-6                  → padding all around (1.5rem)
         mb-6                 → margin-bottom (1.5rem)
         shadow-lg            → large box-shadow for depth
         hover:shadow-[...]   → custom shadow on hover (purple glow)
         transition-shadow    → smooth shadow animation
         duration-300         → animation takes 300ms */
      className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-6 shadow-lg hover:shadow-[0_8px_30px_rgba(108,92,231,0.2)] transition-shadow duration-300"
    >
      <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
        {editingExpense ? '✏️ Edit Expense' : '➕ Add New Expense'}
      </h2>

      {/* 📘 TAILWIND GRID:
          grid        → display: grid
          grid-cols-2 → 2 columns on desktop
          sm:grid-cols-1 → 1 column on small screens (responsive!)
          gap-4       → 1rem gap between grid items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
            Title *
          </label>
          <input
            type="text"
            id="title"
            placeholder="e.g., Lunch at cafe"
            value={title}                              // ← Controlled: shows state value
            onChange={(e) => setTitle(e.target.value)}  // ← Updates state on every keystroke
            required                                   // ← HTML5 validation: can't be empty
            /* 📘 INPUT TAILWIND CLASSES:
               w-full           → width: 100%
               px-4 py-3        → padding x=1rem, y=0.75rem
               bg-[...]         → dark input background
               border           → show border
               border-[...]     → border color from variable
               rounded-lg       → border-radius: 8px
               text-[...]       → text color from variable
               focus:border-[.] → change border on focus
               focus:ring-2     → add ring effect on focus
               focus:ring-[..]  → ring color (purple glow)
               outline-none     → remove default browser outline
               transition       → smooth animation for all changes
               placeholder:text-[...] → placeholder text color */
            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[rgba(108,92,231,0.2)] outline-none transition placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
            Amount (₹) *
          </label>
          <input
            type="number"
            id="amount"
            placeholder="e.g., 250.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"    // ← Allows decimal values like 250.50
            min="0.01"     // ← Must be at least 0.01
            required
            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[rgba(108,92,231,0.2)] outline-none transition placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[rgba(108,92,231,0.2)] outline-none transition"
          >
            <option value="">General</option>
            <option value="Food">🍔 Food</option>
            <option value="Travel">🚗 Travel</option>
            <option value="Shopping">🛒 Shopping</option>
            <option value="Bills">💡 Bills</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Health">🏥 Health</option>
            <option value="Education">📚 Education</option>
            <option value="Other">📦 Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[rgba(108,92,231,0.2)] outline-none transition"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
          Notes
        </label>
        <textarea
          id="notes"
          placeholder="Any extra details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="2"
          className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[rgba(108,92,231,0.2)] outline-none transition resize-y min-h-15 placeholder:text-[var(--text-muted)]"
        />
      </div>

      {/* 📘 TAILWIND FLEX LAYOUT:
          flex     → display: flex
          gap-4    → 1rem gap between children
          mt-2     → margin-top: 0.5rem */}
      <div className="flex gap-4 mt-2">
        {/* 📘 BUTTON TAILWIND CLASSES:
            flex-1             → take up remaining space
            px-6 py-3          → padding
            bg-gradient-to-br  → gradient direction: bottom-right
            from-[...] to-[..] → gradient colors
            text-white         → white text
            font-semibold      → bold text
            rounded-lg         → rounded corners
            cursor-pointer     → pointer cursor on hover
            hover:from-[..]    → change gradient on hover
            hover:shadow-[..]  → add glow on hover
            hover:-translate-y-px → move up 1px on hover
            active:scale-[0.97]   → shrink slightly when clicked
            transition-all     → animate all changes */}
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-br from-[var(--accent-primary)] to-[#7c3aed] text-white font-semibold rounded-lg cursor-pointer hover:from-[#7c3aed] hover:to-[var(--accent-primary)] hover:shadow-[0_4px_15px_rgba(108,92,231,0.4)] hover:-translate-y-px active:scale-[0.97] transition-all duration-200 inline-flex items-center justify-center gap-1"
        >
          {editingExpense ? '💾 Update Expense' : '➕ Add Expense'}
        </button>

        {/* 📘 LESSON: CONDITIONAL RENDERING
              {condition && <JSX />}
              This only renders the JSX if condition is TRUE.
              If editingExpense is null/undefined, the Cancel button won't appear.
              This is called "short-circuit evaluation" — 
              false && anything = false (skipped) */}
        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-6 py-3 bg-[var(--bg-input)] text-[var(--text-secondary)] border border-[var(--border-color)] font-semibold rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] active:scale-[0.97] transition-all duration-200 inline-flex items-center gap-1"
          >
            ❌ Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ============================================================
// 📘 LESSON: EXPORT
//
// "export default" makes this component available to other files.
// In App.jsx, we can do: import ExpenseForm from './components/ExpenseForm'
//
// There are two types of exports:
//   export default → ONE per file, imported without curly braces
//   export { name } → MULTIPLE per file, imported WITH curly braces
//     Example: import { useState, useEffect } from 'react'
// ============================================================
export default ExpenseForm;
