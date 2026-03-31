// ============================================================
// 📘 LESSON: LIST RENDERING IN REACT
//
// This component displays ALL expenses as a list.
// It receives the expenses array from the parent (App.jsx)
// and renders each one as a card.
//
// KEY CONCEPT: .map()
// React doesn't have a "for loop" for rendering.
// Instead, we use JavaScript's .map() to transform an array
// of DATA into an array of JSX ELEMENTS.
//
//   [expense1, expense2, expense3]
//       ↓ .map() ↓
//   [<Card1 />, <Card2 />, <Card3 />]
// ============================================================

// ============================================================
// 📘 LESSON: PROPS FOR THIS COMPONENT
//
// expenses     → The array of expense objects from the database
// onEdit       → Function to call when "Edit" is clicked
// onDelete     → Function to call when "Delete" is clicked
//
// These are passed from App.jsx:
//   <ExpenseList
//     expenses={expenses}        ← the data
//     onEdit={handleEdit}        ← what to do on edit
//     onDelete={handleDelete}    ← what to do on delete
//   />
// ============================================================
function ExpenseList({ expenses, onEdit, onDelete }) {

  // ============================================================
  // 📘 LESSON: EMPTY STATE
  //
  // What if there are NO expenses? We should show a friendly
  // message instead of an empty blank space.
  //
  // expenses.length === 0 checks if the array is empty.
  // This is called "early return" — return early to handle
  // the special case, then handle the normal case below.
  // ============================================================
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <span className="text-5xl block mb-4">📭</span>
        <h3 className="text-lg mb-2 text-[var(--text-primary)]">No expenses yet</h3>
        <p>Add your first expense using the form above!</p>
      </div>
    );
  }

  // ============================================================
  // 📘 LESSON: FORMATTING HELPERS
  //
  // These small functions make our data look nice in the UI.
  //
  // formatDate: Converts "2024-01-15" → "Jan 15, 2024"
  //   new Date() creates a Date object from the string.
  //   .toLocaleDateString() formats it based on locale.
  //
  // formatAmount: Converts 250.5 → "₹250.50"
  //   .toFixed(2) ensures exactly 2 decimal places.
  //
  // getCategoryEmoji: Maps category names to emojis for visual flair.
  // ============================================================
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount).toFixed(2)}`;
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      Food: '🍔',
      Travel: '🚗',
      Shopping: '🛒',
      Bills: '💡',
      Entertainment: '🎬',
      Health: '🏥',
      Education: '📚',
      General: '📦',
      Other: '📦',
    };
    return emojis[category] || '📦';
  };

  // Calculate total of all expenses
  // 📘 .reduce() iterates over the array and accumulates a single value
  //   acc = accumulator (running total), exp = current expense
  //   0 = initial value of acc
  const total = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

  return (
    <div className="animate-fade-in">
      {/* ============================================================
          📘 LESSON: SUMMARY SECTION
          Shows total count and sum of all expenses.
          This uses the .length property and our calculated total.
          
          TAILWIND FLEX CLASSES:
            flex             → display: flex
            justify-between  → space-between (push items to edges)
            items-center     → align-items: center (vertical centering)
            flex-wrap        → allow items to wrap on small screens
          ============================================================ */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">💰 Your Expenses</h2>
        <div className="flex gap-6 items-center">
          <span className="text-[var(--text-secondary)] text-sm">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </span>
          {/* 📘 TAILWIND GRADIENT BADGE:
              bg-gradient-to-br → gradient direction
              from-[...] to-[...] → gradient color stops
              px-4 py-1.5 → padding
              rounded-full → pill shape (fully rounded) */}
          <span className="bg-gradient-to-br from-[var(--accent-primary)] to-[#7c3aed] px-4 py-1.5 rounded-full font-semibold text-sm text-white">
            Total: {formatAmount(total)}
          </span>
        </div>
      </div>

      {/* ============================================================
          📘 LESSON: THE .map() FUNCTION — Rendering Lists
          
          .map() takes each item in the array and transforms it.
          For each expense object, we return a JSX card element.
          
          CRITICAL: The "key" Prop
          Every item in a list MUST have a unique "key" prop.
          React uses keys to efficiently update the list when items
          are added, removed, or reordered.
          
          WRONG: key={index}  ← index changes when items are reordered!
          RIGHT: key={expense.id}  ← ID is unique and stable
          
          Without keys, React re-renders the ENTIRE list every time.
          With keys, React only updates the items that changed.
          ============================================================ */}
      <div className="flex flex-col gap-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            /* 📘 TAILWIND CARD CLASSES:
               bg-[var(--bg-card)]    → dark card background
               border                 → show border
               border-[...]           → border color  
               rounded-xl             → rounded corners (12px)
               p-6                    → padding all sides (1.5rem)
               hover:border-[...]     → purple border on hover
               hover:shadow-[...]     → purple glow on hover
               hover:-translate-y-0.5 → lift card up 2px on hover
               transition-all         → animate ALL changes smoothly
               duration-300           → animation takes 300ms
               animate-slide-in       → custom slide-in animation */
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 hover:border-[var(--accent-primary)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.2)] hover:-translate-y-0.5 transition-all duration-300 animate-slide-in"
          >
            {/* Card Header: Title + Amount */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl leading-none">{getCategoryEmoji(expense.category)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-0.5">
                    {expense.title}
                  </h3>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                    {expense.category || 'General'}
                  </span>
                </div>
              </div>
              <span className="text-xl font-bold text-[var(--accent-warning)] whitespace-nowrap">
                {formatAmount(expense.amount)}
              </span>
            </div>

            {/* Card Body: Date + Notes */}
            <div className="mb-4 py-2">
              <span className="text-sm text-[var(--text-secondary)]">
                📅 {formatDate(expense.date)}
              </span>
              {expense.notes && (
                <p className="text-sm text-[var(--text-muted)] mt-1 italic">
                  📝 {expense.notes}
                </p>
              )}
            </div>

            {/* ============================================================
                📘 LESSON: EVENT HANDLERS & PASSING DATA
                
                onClick={() => onEdit(expense)}
                
                WHY the arrow function?
                If we wrote: onClick={onEdit(expense)}
                  → This CALLS onEdit IMMEDIATELY during render! Bad!
                
                With the arrow: onClick={() => onEdit(expense)}
                  → This creates a new function that calls onEdit ONLY when clicked.
                
                We pass the entire expense object to onEdit so the parent
                knows WHICH expense to edit.
                ============================================================ */}
            <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={() => onEdit(expense)}
                className="px-4 py-2 bg-[rgba(162,155,254,0.1)] text-[var(--accent-secondary)] border border-[rgba(162,155,254,0.2)] text-sm font-semibold rounded-lg cursor-pointer hover:bg-[rgba(162,155,254,0.2)] hover:border-[var(--accent-secondary)] active:scale-[0.97] transition-all duration-200 inline-flex items-center gap-1"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(expense.id)}
                className="px-4 py-2 bg-[rgba(255,107,107,0.1)] text-[var(--accent-danger)] border border-[rgba(255,107,107,0.2)] text-sm font-semibold rounded-lg cursor-pointer hover:bg-[rgba(255,107,107,0.2)] hover:border-[var(--accent-danger)] active:scale-[0.97] transition-all duration-200 inline-flex items-center gap-1"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;
