# ParkingAutomation Self-Build Walkthrough (Beginner)

This guide is for rebuilding your project by yourself, from zero, while understanding each line.

## 1) What to build first (order)

1. `src/data/mockData.js` (static data only)
2. `src/services/api.js` (fake API around data)
3. `src/components/layout/index.js` (exports)
4. `src/components/layout/DashboardLayout.jsx` (layout + sidebar toggle)
5. `src/components/NotificationDropdown.jsx` (state + events + rendering)

Do not jump ahead. Finish one file before moving to the next.

## 2) How to study each file line-by-line

For each line, write the answer in a notebook:

1. What does this line do?
2. Why is it needed?
3. What happens if I delete it?
4. Is this React, JavaScript, or library-specific?

Then run the app and test one tiny change.

## 3) Line-by-line walkthrough: `src/services/api.js`

Current file has 60 lines. Re-type this file manually in your learning project.

### Imports
- Line 1: Imports data arrays/objects from `mockData.js`.
- Line 2: Empty line for readability only.

### Delay helper
- Line 3: Comment (human explanation).
- Line 4: `delay(ms)` returns a Promise that resolves after `ms` milliseconds.
  - Why: simulates real network wait.
  - `ms = 800` means default delay is 0.8 seconds.

### Response wrapper
- Lines 6-8: Comment block describing purpose.
- Line 9: `wrap(data)` is async and accepts any data.
- Line 10: waits for delay to finish.
- Line 11: comment says real app would handle HTTP errors.
- Line 12: returns consistent response shape: `{ ok: true, data }`.
- Line 13: closes function.

### API object
- Line 15: starts `api` object export.

#### `dashboard`
- Line 16: starts `dashboard` group.
- Line 17: `getStats()` returns wrapped KPI object.
- Line 18: `getRevenueTrend()` returns wrapped revenue data.
- Line 19: `getHourlyDistribution()` returns wrapped hourly chart data.
- Line 20: `getSessionsTrend()` returns wrapped sessions trend data.
- Line 21: closes `dashboard` group.

#### `sessions`
- Line 23: starts `sessions` group.
- Line 24: `getAll()` returns wrapped `sessions` list.
- Line 25: `getById(id)` finds one session by ID and wraps it.
- Line 26: closes `sessions` group.

#### `zones`
- Line 28: starts `zones` group.
- Line 29: returns all zones.
- Line 30: `update(id, data)` merges existing zone + new fields.
- Line 31: `create(data)` creates a fake ID and merges with input.
- Line 32: `delete(id)` returns deleted ID (mock delete, no real storage).
- Line 33: closes `zones` group.

#### `operators`
- Line 35: starts `operators` group.
- Line 36: returns all operators.
- Line 37: updates one operator by merge.
- Line 38: creates new mock operator.
- Line 39: closes `operators` group.

#### `supervisors`
- Line 41: starts `supervisors` group.
- Line 42: returns all supervisors.
- Line 43: updates one supervisor.
- Line 44: creates one supervisor with mock ID.
- Line 45: closes `supervisors` group.

#### `disputes`
- Line 47: starts `disputes` group.
- Line 48: returns all disputes.
- Line 49: updates dispute status (mock response).
- Line 50: closes `disputes` group.

#### `settings`
- Line 52: starts `settings` group.
- Lines 53-57: returns settings object with policy sections.
- Line 58: `save(data)` returns what user passes (mock save).
- Line 59: closes `settings` group.

- Line 60: closes `api` object.

## 4) Build-it-yourself sequence (exact)

### Step A: Minimal `mockData.js`
Start with only one export:
- `zones` with 2 items.

Then add:
- `dashboardKPIs`
- `sessions`
- `operators`
- `disputes`
- `supervisors`
- chart arrays

After each add, check import errors.

### Step B: Minimal `api.js`
Start with only:
- `delay`
- `wrap`
- `api.dashboard.getStats`

Then add one group at a time:
1. `sessions`
2. `zones`
3. `operators`
4. `supervisors`
5. `disputes`
6. `settings`

Test each function from UI or console before adding next one.

### Step C: `DashboardLayout.jsx`
Build in this order:
1. static container markup only
2. add `useState(false)` for sidebar
3. pass props to `Sidebar` and `Navbar`
4. add `<Outlet />`

### Step D: `NotificationDropdown.jsx`
Build in this order:
1. static bell button
2. `open` state and toggle dropdown
3. hardcoded notifications list rendering
4. unread count logic
5. mark one read
6. mark all read
7. delete notification
8. click outside to close (`useEffect` + `useRef`)

## 5) Daily practice plan (60-90 minutes)

1. 10 min: read one small code block.
2. 25 min: re-type it from memory.
3. 15 min: break something intentionally and fix it.
4. 10 min: explain aloud what each line does.
5. 10-30 min: implement one tiny improvement.

## 6) Rules that will make you improve fast

1. No large copy-paste.
2. Type everything manually.
3. One file at a time.
4. One concept at a time.
5. If confused, reduce scope (smaller code).
6. Always run and test after small changes.

## 7) First mini tasks for tomorrow

1. Rebuild `api.dashboard.getStats` from scratch.
2. Add `api.sessions.getAll` and print result in one component.
3. Add `api.sessions.getById('TK-10001')` and show fallback when not found.

If you can do these three without copy-paste, your foundation is strong.
