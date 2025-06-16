# Household Manager

Household Manager is a full stack web application for tracking household services, car maintenance and a personal budget. It consists of a Node.js/Express backend with a SQLite database and a React frontend created with Create React App.

## Project structure

```
backend/   # Express API and Sequelize models
frontend/  # React application
```

The backend exposes REST endpoints for managing contracts, cars, backlog items and budget data. The frontend consumes these APIs and provides a simple user interface.

## Prerequisites

- **Backend Node.js version:** Node 18 LTS is supported and tested. Other Node.js
  versions may fail to load the `sqlite3` module used by the backend. A `.nvmrc` file is provided so running `nvm use` selects the correct version automatically.
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

The API base URL used by the frontend is defined in `frontend/src/api/index.js`:

```
const API_URL = 'http://localhost:4000/api';
```

Uploaded files are served from the `/uploads` path:

```
const UPLOADS_URL = 'http://localhost:4000/uploads';
```

## Testing

To run the automated tests first install dependencies for both the backend and
the frontend if you have not already done so:

```bash
(cd backend && npm install)
(cd frontend && npm install)
```

The backend tests require `jest` and `supertest` to be installed in addition to
the regular dependencies. After everything is installed you can execute all
tests from the project root:

```bash
npm test
```

You can also run the backend or frontend tests individually:

```bash
npm run test:backend   # runs Jest tests in backend/
npm run test:frontend  # runs React tests in frontend/
```

The repository includes a very small Jest test under `backend/tests/basic.test.js`
that simply verifies a sample function works correctly.

When running tests inside the Codex environment keep in mind that network
access is restricted, so you should make sure the dependencies are installed
before invoking the test command.

## Configuration

The backend stores data in `backend/database.sqlite` using SQLite. You may set the `JWT_SECRET` environment variable for authentication, and `PORT` to change the API port (default `4000`).

## Features

- Service management (vendors, categories, frequencies and contracts)
- Car management with MOT, insurance, tax and mileage records
- Backlog/notes with file attachments
- Basic budgeting module for monthly expenses and savings
- User management with login and registration

## License

This project is provided as-is for demonstration purposes.
