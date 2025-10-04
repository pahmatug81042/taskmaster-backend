# TaskMaster Backend (MERN Stack)

This is the **backend service** for the **TaskMaster** application, developed during **Temple University OwlHacks 2025**.  
It provides a **secure REST API** for managing users, projects, and tasks, built with **Node.js, Express, and MongoDB**.

The backend strictly adheres to **OWASP Top 10 (2024) security principles**, ensuring protection against common vulnerabilities like XSS, injection, broken authentication, sensitive data exposure, and insecure deserialization.

---

## Security Features

### Authentication & Session Security
- User registration and login with **bcrypt password hashing**.
- **JWT-based authentication** with short-lived access tokens (`1h`) and strong secrets.
- Tokens validated in `authMiddleware.js` before protected resources are accessed.
- Ownership enforced with `authorizeProject.js` and `authorizeTask.js`.

### Input Validation & Sanitization
- Global enforcement of `Content-Type: application/json`.
- `express-mongo-sanitize` prevents MongoDB operator injection (`$gt`, `$set`, etc.).
- `validator` ensures proper email format, username constraints, and ID validation.
- `sanitize-html` used for sanitizing free-text fields if/when enabled.
- Centralized request validation with `validationMiddleware.js`.

### Security Middleware
- **Helmet** with strict Content Security Policy (CSP) headers.
- **CORS policy** restricted to trusted frontend origin(s).
- **express-rate-limit** applied to authentication endpoints (`/api/users/login` and `/api/users/register`) to mitigate brute-force attacks.

### Error Handling
- Centralized `errorMiddleware.js`:
  - Sanitizes error messages in production (no stack leaks).
  - Normalizes common errors (invalid ObjectId, duplicate keys, validation errors).
  - Returns consistent JSON error format.
- `notFound` handler for unknown routes.

### ID Validation & Ownership
- `validateObjectId.js` utility ensures only valid MongoDB ObjectIds are processed.
- Validation enforced **both at the route level and middleware level** (inside `authorizeProject` and `authorizeTask`) for defense-in-depth.

---

## Features

### User Management
- Register new users with input validation.
- Login returns JWT token for authentication.
- Passwords stored securely with salted bcrypt hashing.

### Project Management
- CRUD operations for projects (`projectController.js`).
- Strict ownership checks ensure users can only access their own projects.
- ObjectId validation prevents malformed or malicious queries.

### Task Management
- CRUD operations for tasks (`taskController.js`).
- Each task is tied to a project and validated through ownership middleware.
- Supports status (`pending`, `in-progress`, `completed`) and priority management.

---

## Tech Stack

- **Node.js** – Backend runtime  
- **Express.js** – Web framework  
- **MongoDB + Mongoose** – Database + ODM  
- **bcryptjs** – Password hashing  
- **jsonwebtoken (JWT)** – Auth & authorization  
- **express-validator** – Input validation  
- **Helmet** – Secure HTTP headers + CSP  
- **CORS** – Trusted origin configuration  
- **express-rate-limit** – Brute-force prevention  
- **express-mongo-sanitize** – Prevent NoSQL injection  
- **validator** – Strong email/ID validation  
- **sanitize-html** – Optional free-text sanitization  
- **Nodemon** – Dev hot reload  

---

## API Endpoints

### Authentication
- `POST /api/users/register` → Register new user (no token on register).  
- `POST /api/users/login` → Authenticate user & return JWT.  

### Projects
- `GET /api/projects` → Get all projects for logged-in user.  
- `POST /api/projects` → Create a new project.  
- `GET /api/projects/:projectId` → Get a project by ID.  
- `PUT /api/projects/:projectId` → Update a project.  
- `DELETE /api/projects/:projectId` → Delete a project.  

### Tasks
- `GET /api/projects/:projectId/tasks` → Get all tasks for a project.  
- `POST /api/projects/:projectId/tasks` → Create a new task.  
- `GET /api/projects/:projectId/tasks/:taskId` → Get a task by ID.  
- `PUT /api/projects/:projectId/tasks/:taskId` → Update a task.  
- `DELETE /api/projects/:projectId/tasks/:taskId` → Delete a task.  

---

## Skills Gained
- Backend architecture with Express & MongoDB  
- Advanced authentication flows with JWT  
- Role & ownership enforcement with middleware  
- Clean error handling & validation patterns  
- Applying **OWASP Top 10** to a production-ready backend  
- Building secure REST APIs with best practices  

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
# Dev mode
npm run server

# Production
npm start
```

Server will be available at http://localhost:5000