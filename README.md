A simple full-stack web app to register, log in, view, edit, and delete users. Built with:

- **Frontend**: React + React Router + Playwright
- **Backend**: Node.js + Express + SQLite + Jest/Supertest

## Getting started

npm must be installed before running the application 

Clone the repository https://github.com/catsbumatt/UserManager.git


## Install dependencies
(all commands assume user is on the root directory in the terminal)
### Backend
        
    cd backend
    npm install
        

### Frontend
        
    cd client
    npm install  


### Playwright
        
    cd playwright
    npx playwright install
        

## Run the Application
### Backend
    cd backend
    npm start

### Frontend
    cd frontend
    npm start

## Run the tests
### API tests
    cd backend
    npm test

### Playwright
    cd playwright
    npx playwright test
    npm playwright show-report
