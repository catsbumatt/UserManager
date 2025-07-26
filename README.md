A simple full-stack web app to register, log in, view, edit, and delete users. Built with:

- **Frontend**: React + React Router + Playwright
- **Backend**: Node.js + Express + SQLite + Jest/Supertest

Getting started

- Download the repository

(all commands assume user is on the root directory in the terminal)
Install dependencies
Backend
    cd backend
    npm install

Frontend
    cd client
    npm install

Playwright
    cd playwright
    npx playwright install

Run the Application
backend
    cd backend
    npm start

frontend
    cd frontend
    npm start

Run the tests
    API tests
        cd backend
        npm test

    Playwright
        cd playwright
        npx playwright test
        npm playwright show-report
