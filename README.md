### Project Setup

1. Install all dependencies on both frontend and backend with `npm install`

#### Backend Setup

1. Setup all required env on the backend. List of backend environment variables:
   - `MONGO_DB=<your_atlas_connection_string>`
   - `JWT_KEY=random_key`
   - `FRONTEND_ORIGIN=<frontend_base_url_without_trailing_slash>`
2. Configuring port is optional via `PORT` environment variable. Default port = 8001
3. Run the backend at root directory by typing `node index.js`

#### Frontend Setup

1. Setup all required env on the frontend. List of frontend environment variables:
   - `VITE_API_URL=<backend_base_url_without_trailing_slash>`
2. Build the vite app by typing `npm run build`
3. Run the frontend at root directory by typing `npm run dev`

#### Cypress E2E Testing

1. Create cypress.env.json at frontend root directory, fill the following environment variables below (match with your own credentials).
   {
      "renterEmail": "email of renter account",
      "renterPassword": "password of renter account"
   }
2. Open Cypress app by typing `npm run cy:open`
3. Choose the E2E test case you want to run.
