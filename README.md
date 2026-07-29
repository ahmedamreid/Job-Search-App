# Job Search App

A REST API for a job search platform, built with Express and Mongoose — covering users, companies, job postings, and applications.

## Features

- User signup/signin with hashed passwords (bcrypt) and JWT auth
- Company and job posting management
- Job applications
- Request validation with Joi
- Centralized error handling

## Tech Stack

- Node.js / Express
- MongoDB / Mongoose
- JSON Web Tokens

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and fill in your own values:
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm start
   ```

A Postman collection (`Job-Search-API.postman_collection.json`) is included with example requests for every endpoint.

## API Endpoints

### Users

| Method | Endpoint              | Description                  |
|--------|------------------------|--------------------------------|
| POST   | /users/signup          | Register a new user            |
| POST   | /users/signin          | Sign in and receive a JWT      |
| PUT    | /users                 | Update the signed-in user      |
| DELETE | /users                 | Delete the signed-in user      |
| GET    | /users                 | Get the signed-in user's data  |
| GET    | /users/:id             | Get a user by ID               |
| PATCH  | /users/password        | Change password                |
| GET    | /users/recovery        | Look up a user by recovery email|

### Companies & Jobs

See the Postman collection for the full set of company and job endpoints.
