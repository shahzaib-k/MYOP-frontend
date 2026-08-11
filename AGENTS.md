# AGENTS.md

Guidance for AI agents working on the "Make Your Own Platter" customer mobile app.

## Project Overview

- React Native app built with **Expo (SDK 57)**, written in JavaScript with functional components only.
- It is the customer-facing client for the Express + Firebase Realtime Database backend in `../app-backend`.
- Core idea: the customer sets a **budget** first, then builds a custom platter that fits inside it — instead of buying predefined meals.
- Entry point is `App.js`, which mounts `AppProviders` and `RootNavigator` and nothing else.
- **Expo has changed.** Read the exact versioned docs at <https://docs.expo.dev/versions/v57.0.0/> before using an Expo API.

## Backend Contract (do not guess — check `../app-backend/docs/API.md`)

- Every response is `{ success, message, data }` on success and `{ success, message, errors }` on failure. `unwrap()` in `src/api/client.js` pulls out `data`.
- **`/api/orders` requires a bearer token.** `userId` and `status` are set by the server from the JWT — sending either is a 400.
- `POST /api/orders` accepts **only** `items: [{ foodId, quantity }]`, `totalPrice?` and `budget?`. Any other key is rejected.
- The server re-reads prices from the `foods` node. A `totalPrice` that disagrees with its own calculation, or a total above `budget`, is rejected.
- `GET /api/foods/category/:category` is keyed by category **name**, not id.
- `/api/categories` and `/api/recommendations/*` are public; recommendations need a positive `budget`, and `/review` also needs a non-empty `items` array.

## Architecture Rules

- Keep the folder structure under `src/`:
  - `api/` — the axios instance, interceptors, endpoint paths
  - `assets/` — images and static files
  - `components/` — reusable UI (`common/`, `food/`, `platter/`)
  - `constants/` — theme, config, storage keys, copy
  - `context/` — global state providers and their reducers
  - `hooks/` — reusable logic
  - `navigation/` — navigators, route names, navigation theme
  - `screens/` — one folder per screen
  - `services/` — one module per backend resource
  - `utils/` — pure helpers
  - `validations/` — form validation rules
- Screens compose components and hooks. They must not contain business logic, maths or API calls.
- **Never import axios or call an endpoint from a screen.** Screens → hooks/services → `api/client.js`.
- Pure calculations live in `utils/` (see `platterCalculations.js`), never inside components.
- Sub-components used by exactly one screen may sit next to that screen (e.g. `screens/summary/OrderSummaryFooter.js`). Anything used twice moves to `components/`.
- No file may exceed **500 lines**. Split a screen into sub-components before it gets there.

## JavaScript & React Standards

- Functional components and hooks only — no class components, no Redux.
- ES modules everywhere: `import` / `export`. No `require`, no `module.exports`.
- `async/await` for asynchronous code; never mix in raw `.then()` chains.
- Wrap list-item callbacks in `useCallback` and derived values in `useMemo`; export list items and cards through `memo`.
- Never pass an inline arrow function as `ListHeaderComponent` / `ListFooterComponent` — pass the element, or the list remounts on every render.
- Use descriptive names. No abbreviations like `d`, `res`, `tmp` in application code.
- Guard against state updates after unmount in any hook that awaits (the `isMounted` ref pattern, as in `useFetch`).

## State Management

- Global state is React Context + `useReducer`. Two providers only:
  - `AuthContext` — user, token, sign in/up/out, session restore
  - `PlatterContext` — budget, selected items, derived totals
- Derived values (`summary`, `quantityByFoodId`) are computed in the provider with `useMemo` — never recomputed inside a screen.
- Read state through `useAuth()` / `usePlatter()`. Do not import the contexts directly, and do not prop-drill state a hook can supply.
- `AsyncStorage` holds only the auth token, the cached user and the budget. Keys live in `constants/storageKeys.js`.

## API Layer

- One axios instance in `src/api/client.js` owns the base URL, timeout, the `Authorization` header and 401 handling.
- The base URL comes from `EXPO_PUBLIC_API_URL`, falling back to a per-platform default. `localhost` does not reach the host machine from a device or an Android emulator.
- Add new paths to `src/api/endpoints.js`, then add a function to the matching `src/services/*.js`.
- All error handling goes through `utils/errorHandler.js`, so no-internet, timeout, 4xx and 5xx all produce one normalized message.

## UI & Styling Standards

- Import colour, spacing, radii, shadows and typography from `src/constants/theme.js`. **Never hardcode a hex value or a raw pixel gap in a component.**
- Design language: rounded cards (`radii.xl`), soft shadows, generous spacing, minimal chrome.
- Every interactive element needs `accessibilityRole` and, where the label is not obvious, `accessibilityLabel`.
- Never signal state with colour alone — the over-budget case shows an explicit "Budget Exceeded" message as well as red.
- Use `StyleSheet.create` at the bottom of each file. No inline style objects except for genuinely dynamic values.
- Use `react-native-safe-area-context`, not the deprecated `SafeAreaView` from `react-native`.

## Required UX States

Every screen that talks to the network must handle all four:

1. **Loading** — `LoadingSpinner` for the first load, `RefreshControl` for pull-to-refresh.
2. **Error** — `ErrorMessage` with a retry action; `variant="block"` when there is no data, inline when there is.
3. **Empty** — `EmptyState` with an explanation and, where possible, a next action.
4. **Success** — the data itself.

Forms validate locally before any request, using the rules in `src/validations/`, which mirror the backend's own middleware.

## Before Finishing Work

- Run `npx expo export --platform android` (or `npm start`) and confirm the bundle builds.
- Check that no file exceeds 500 lines.
- Check that no screen imports axios or performs an HTTP call directly.
- Check that no new hex colours or magic spacing numbers were introduced.
- Mention any command that could not be run and why.
