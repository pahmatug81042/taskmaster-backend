# TaskMaster Backend (MERN Stack)

This is the **backend service** for the **TaskMaster** application.  
It provides a **secure REST API** for managing users, projects, and tasks, built with **Node.js, Express, and MongoDB**.

The backend strictly follows **OWASP Top 10 (2024) security principles**, ensuring protection against vulnerabilities like XSS, injection, broken authentication, sensitive data exposure, and insecure deserialization.

---

## Security Features

### Authentication & Session Security
- User registration and login with **bcrypt password hashing**.
- **JWT-based authentication** with short-lived access tokens (`1h`) and strong secrets.
- Tokens validated in `authMiddleware.js` before accessing protected routes.
- Ownership enforcement through `authorizeProject.js` and `authorizeTask.js`.

### Input Validation & Sanitization
- Global enforcement of `Content-Type: application/json`.
- `express-mongo-sanitize` prevents MongoDB operator injection (`$gt`, `$set`, etc.).
- `validator` ensures valid email formats, usernames, and ObjectId validation.
- `sanitize-html` used to sanitize free-text fields (if enabled).
- Centralized request validation handled via `validationMiddleware.js`.

### Security Middleware
- **Helmet** configured with a strict Content Security Policy (CSP).
- **CORS policy** limited to trusted frontend origin(s).
- **express-rate-limit** applied to `/api/users/login` and `/api/users/register` routes to mitigate brute-force attacks.

### Error Handling
- Centralized `errorMiddleware.js`:
  - Sanitizes error messages in production (no stack traces leaked).
  - Handles invalid ObjectIds, duplicate keys, and validation errors.
  - Returns consistent JSON error format.
- `notFound` middleware for unrecognized routes.

### ID Validation & Ownership
- `validateObjectId.js` utility ensures only valid MongoDB ObjectIds are processed.
- Validation enforced at both **route** and **middleware** levels for defense-in-depth.

---

## Core Features

### User Management
- Register and log in users with validation.
- Login returns JWT for authentication.
- Passwords stored securely using salted bcrypt hashing.

### Project Management
- CRUD operations for projects (`projectController.js`).
- Ownership checks ensure users access only their own data.
- ObjectId validation prevents malformed or malicious queries.

### Task Management
- CRUD operations for tasks (`taskController.js`).
- Tasks are linked to projects and validated for ownership.
- Support for task status (`pending`, `in-progress`, `completed`) and priorities.

---

## Tech Stack

- **Node.js** – Backend runtime  
- **Express.js** – Web framework  
- **MongoDB + Mongoose** – Database + ODM  
- **bcryptjs** – Password hashing  
- **jsonwebtoken (JWT)** – Authentication & authorization  
- **express-validator** – Input validation  
- **Helmet** – Secure HTTP headers + CSP  
- **CORS** – Trusted origin enforcement  
- **express-rate-limit** – Brute-force protection  
- **express-mongo-sanitize** – Prevent NoSQL injection  
- **validator** – Strong email and ID validation  
- **sanitize-html** – Optional HTML sanitization  
- **Nodemon** – Development hot reload  

---

## API Endpoints

### Authentication
- `POST /api/users/register` → Register new user.  
- `POST /api/users/login` → Authenticate user & return JWT.  

### Projects
- `GET /api/projects` → Retrieve all projects for the logged-in user.  
- `POST /api/projects` → Create a new project.  
- `GET /api/projects/:projectId` → Retrieve a single project.  
- `PUT /api/projects/:projectId` → Update an existing project.  
- `DELETE /api/projects/:projectId` → Delete a project.  

### Tasks
- `GET /api/projects/:projectId/tasks` → Retrieve all tasks for a project.  
- `POST /api/projects/:projectId/tasks` → Create a task under a project.  
- `GET /api/projects/:projectId/tasks/:taskId` → Retrieve a specific task.  
- `PUT /api/projects/:projectId/tasks/:taskId` → Update a task.  
- `DELETE /api/projects/:projectId/tasks/:taskId` → Delete a task.  

---

## Skills Demonstrated
- Scalable backend architecture with Express & MongoDB  
- JWT authentication & secure session management  
- Middleware-driven validation and ownership control  
- Comprehensive error handling with security hardening  
- Implementation of **OWASP Top 10** security practices  
- Building production-ready REST APIs  

---

## Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
NODE_ENV=development
```

Run backend server:
```bash
# Development
npm run server

# Production
npm start
```

Server will be available at: http://localhost:5000