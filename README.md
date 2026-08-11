# Make Your Own Platter — Customer App

React Native (Expo SDK 57) client for the "Make Your Own Platter" FYP. The
customer sets a **budget** first, then builds a custom platter that fits inside
it, instead of buying predefined meals.

Backend: `../app-backend` (Express + Firebase Realtime Database).

## Getting started

```bash
npm install
cp .env.example .env       # point EXPO_PUBLIC_API_URL at your backend
npm start                  # then press "a" for Android, or scan the QR in Expo Go
```

Start the backend first:

```bash
cd ../app-backend && npm run dev
```

### Pointing the app at the backend

`localhost` from a phone or emulator means *the device itself*, not your
computer — so the URL differs per target:

| Running on | `EXPO_PUBLIC_API_URL` |
| --- | --- |
| Android emulator | `http://10.0.2.2:5000` |
| iOS simulator / web | `http://localhost:5000` |
| Physical device (Expo Go) | `http://<your-LAN-IP>:5000` |

Metro reads `.env` at startup — restart `npm start` after changing it. With no
`.env`, `src/constants/config.js` falls back to a sensible per-platform default.

## App flow

```
Splash → Login / Register → Budget → Categories → Food list → Order summary → Success
```

**Login and Register exist because `POST /api/orders` is a protected endpoint.**
The backend takes `userId` from the JWT and rejects any client-sent `userId`, so
an order cannot be placed without a signed-in customer.

## Architecture

```
src/
├── api/            axios instance, interceptors, endpoint paths
├── components/     reusable UI — common/, food/, platter/
├── constants/      theme (colours, spacing, typography), config, storage keys, copy
├── context/        AuthContext + PlatterContext (Context + useReducer)
├── hooks/          useFetch, useSubmit, useForm, useCategories, useFoods, useSuggestions…
├── navigation/     RootNavigator, AuthNavigator, MainNavigator, route names
├── screens/        one folder per screen
├── services/       one module per backend resource
├── utils/          pure helpers — platter maths, currency, error normalization
└── validations/    form rules mirroring the backend middleware
```

Data flows one way: **screens → hooks → services → `api/client.js`**. No screen
imports axios or does arithmetic; all platter maths lives in
`utils/platterCalculations.js` and is exposed through `usePlatter()`.

### State

| Provider | Holds | Persisted |
| --- | --- | --- |
| `AuthContext` | user, token, sign in/up/out, session restore | token + user |
| `PlatterContext` | budget, selected items, derived totals | budget only |

`summary` (`subtotal`, `total`, `remaining`, `isOverBudget`, `usageRatio`) and
`quantityByFoodId` are computed once in the provider with `useMemo`, so the
budget bar, the food cards and the floating cart never disagree.

### Budget handling

Every screen after Budget shows budget, current total and remaining. Passing the
limit turns the bar red **and** shows an explicit "Budget Exceeded" message —
state is never signalled by colour alone. Placing an order is blocked while over
budget, which matches the server, since it rejects those orders too.

### Smart Suggestions

Primary source is `POST /api/recommendations/review`, which reprices the platter
from live data and returns `addOns` that fit the leftover budget, plus cheaper
same-category `alternatives` when over budget. If that call fails, `useSuggestions`
falls back to filtering the already-loaded food list, so the feature degrades
instead of disappearing.

## Backend contract notes

- Responses are `{ success, message, data }`; `unwrap()` extracts `data`.
- `POST /api/orders` accepts **only** `items: [{ foodId, quantity }]`, `totalPrice?`
  and `budget?`. Any other key is a 400. Prices are re-read server-side.
- `GET /api/foods/category/:category` is keyed by category **name**, not id.
- A 401 on any request clears the stored session and returns to Login.

## Verification

```bash
npx expo export --platform android   # confirms the bundle builds
```

See `AGENTS.md` for the full coding standards this project follows.
