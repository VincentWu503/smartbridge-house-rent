### Project Setup

1. Install all dependencies on both frontend and backend with `npm install`

#### Backend Setup

2. Setup all required env on the backend. List of backend environment variables:
   - `MONGO_DB=<your_atlas_connection_string>`
   - `JWT_SECRET=random_key`
   - `FRONTEND_ORIGIN=<frontend_base_url_without_trailing_slash>`
3. Configuring port is optional via `PORT` environment variable. Default port = 8001
4. Run the backend at root directory by typing `node index.js`

#### Frontend Setup

5. Setup all required env on the frontend. List of frontend environment variables:
   - `VITE_API_URL=<backend_base_url_without_trailing_slash>`
6. Build the vite app by typing `npm run build`
7. Run the frontend at root directory by typing `npm run dev`
