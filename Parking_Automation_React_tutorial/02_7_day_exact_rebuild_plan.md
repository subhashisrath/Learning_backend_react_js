# 7-Day Exact Rebuild Plan (ParkingAutomation)

Goal: Rebuild the same app by yourself in 7 days.
Start date assumed: **Wednesday, February 11, 2026**.
Target finish: **Tuesday, February 17, 2026**.

Important: To finish in 7 days, plan **4-6 focused hours/day**.

## Ground Rules

1. Type code manually (no large copy-paste).
2. Build in the exact order below.
3. After every module, run `npm run dev` and verify.
4. Keep current project as reference only.
5. If blocked >20 min, ask for help with file+line+error.

## Folder

Use your separate workspace:
- `d:\ParkingAutomation_Learning`

## Day 1 (Feb 11): Project Foundation + Auth Core

### Build
1. Vite + React app setup and dependencies
2. `vite.config.js` (alias `@`)
3. `tailwind.config.js`, `postcss.config.js`, `src/index.css`
4. `src/main.jsx`
5. `src/auth/roles.js`
6. `src/auth/permissions.js`
7. `src/auth/AuthContext.jsx`
8. `src/auth/index.js`
9. `src/components/guards.jsx`
10. `src/App.jsx` route skeleton (placeholder pages allowed)

### Done when
1. App boots without errors.
2. Login state stores in localStorage.
3. Protected routes redirect to `/login` when logged out.

## Day 2 (Feb 12): Core Data + Services + Shell Layout

### Build
1. `src/data/mockData.js`
2. `src/services/api.js`
3. `src/components/layout/index.js`
4. `src/components/layout/DashboardLayout.jsx`
5. `src/components/layout/Sidebar.jsx`
6. `src/components/layout/Navbar.jsx`
7. `src/components/ProfileDropdown.jsx`
8. `src/components/NotificationDropdown.jsx`
9. `src/components/Toast.jsx`
10. `src/pages/Login.jsx`
11. `src/pages/NotAuthorized.jsx`

### Done when
1. Login screen works for both demo roles.
2. Sidebar shows role-based menu.
3. Navbar dropdowns open/close correctly.

## Day 3 (Feb 13): Dashboard + Sessions

### Build
1. `src/pages/Overview.jsx`
2. `src/pages/Sessions.jsx`
3. `src/utils/exportUtils.js`

### Done when
1. KPI cards and charts render.
2. Sessions table loads from `api`.
3. CSV export works.
4. Supervisor view is filtered by assigned zones.

## Day 4 (Feb 14): Zones + Operators

### Build
1. `src/pages/Zones.jsx`
2. `src/pages/Operators.jsx`

### Done when
1. Lists load from API.
2. Create/edit/delete actions work as currently implemented.
3. Permission restrictions for admin/supervisor are respected.

## Day 5 (Feb 15): Supervisors + Disputes

### Build
1. `src/pages/Supervisors.jsx`
2. `src/pages/Disputes.jsx`

### Done when
1. Role-specific actions are enforced.
2. Status updates and modals behave correctly.
3. Toast feedback is shown for actions.

## Day 6 (Feb 16): Reports + Settings + Final Routing Match

### Build
1. `src/pages/Reports.jsx`
2. `src/pages/Settings.jsx`
3. Finalize any route/title/menu mismatches

### Done when
1. Reports charts render and export works.
2. Settings load/save mock flow works.
3. All routes in `src/App.jsx` match original behavior.

## Day 7 (Feb 17): Exact Match QA + Fixes

### QA checklist
1. Compare every route visually and functionally with original:
   - `/login`
   - `/dashboard`
   - `/sessions`
   - `/zones`
   - `/operators`
   - `/supervisors`
   - `/reports`
   - `/disputes`
   - `/settings`
   - `/not-authorized`
2. Test with both roles:
   - `admin@gov.in / admin123`
   - `supervisor@parking.in / super123`
3. Verify mobile sidebar behavior.
4. Verify dropdown close-on-outside-click behavior.
5. Fix all UI/logic mismatches.

### Done when
1. No console errors.
2. All routes and role guards behave same as original.
3. Core UI and interactions match original app.

## Daily Time Box (Use Every Day)

1. 30 min: read and outline target files.
2. 180-240 min: implement.
3. 30-45 min: manual QA and bug fixes.
4. 15 min: write what you learned + next-day blockers.

## If You Fall Behind

1. Keep behavior parity first, pixel-perfect styling second.
2. Skip minor polish until Day 7.
3. Never skip auth/permissions logic.
