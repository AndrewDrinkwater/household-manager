# Household Manager

Household Manager is a full stack web application for tracking household services, car maintenance and a personal budget. It consists of a Node.js/Express backend with a SQLite database and a React frontend created with Create React App.

## Project structure

```
backend/   # Express API and Sequelize models
frontend/  # React application
```

The backend exposes REST endpoints for managing contracts, cars, backlog items and budget data. The frontend consumes these APIs and provides a simple user interface.

## Prerequisites

- Node.js (18 or later recommended)
- npm

## Installation

Install dependencies for both the backend and the frontend:

```bash
npm install            # installs root dev dependencies
(cd backend && npm install)
(cd frontend && npm install)
```

Optionally seed the database with some example data:

```bash
node backend/src/seed.js
```

## Running the application

During development you can start both servers at once from the project root:

```bash
npm run dev
```

This uses `concurrently` to run `nodemon` for the backend and `react-scripts start` for the frontend. By default the API listens on port `4000` and the React app on port `3000`.

The API base URL used by the frontend can be configured via environment
variables. `frontend/src/api/index.js` falls back to `http://localhost:4000`
during development:

```
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const UPLOADS_URL =
  process.env.REACT_APP_UPLOADS_URL || 'http://localhost:4000/uploads';
```

Uploaded files are served from the `/uploads` path of the same base URL.

## Configuration

The backend stores data in `backend/database.sqlite` using SQLite. A
`JWT_SECRET` environment variable **must** be provided for authentication.

## Features

- Service management (vendors, categories, frequencies and contracts)
- Car management with MOT, insurance, tax and mileage records
- Backlog/notes with file attachments
- Basic budgeting module for monthly expenses and savings
- User management with login and registration

## License

This project is provided as-is for demonstration purposes.
