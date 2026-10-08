# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Browser E2E tests

The renter home-page flows are covered by Cypress: opening property info/booking,
favoriting a property, and filtering by price. The login request uses a real renter
account; property listings are intercepted with test data so these checks are
repeatable and do not modify live property records.

1. Install frontend dependencies with `npm install`.
2. Start the backend and the frontend (`npm run dev`); ensure `VITE_API_URL` in
   the frontend environment points to the backend.
3. In PowerShell, set `CYPRESS_RENTER_EMAIL` and `CYPRESS_RENTER_PASSWORD` to a
   renter test account. Cypress suppresses password input in its command log.
4. Run `npm run cy:run`, or use `npm run cy:open` for interactive mode.

The Cypress base URL defaults to `http://localhost:5173`; override it with
`CYPRESS_BASE_URL` if Vite uses another address.
