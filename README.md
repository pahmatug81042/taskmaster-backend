# TaskMaster Backend (MERN Stack)

This is the **backend service** for the **TaskMaster** application, developed during **Temple University OwlHacks 2025**.  
It provides a **secure REST API** for managing users, projects, and tasks, built with **Node.js, Express, and MongoDB**.

The backend strictly adheres to **OWASP Top 10 security principles**, ensuring protection against common vulnerabilities like XSS, injection, broken authentication, and insecure deserialization.

---

## Features

### Authentication & Security
- User registration and login with **bcrypt password hashing** and **JWT-based authentication**.
- Tokens are issued **only on login** for better session management.
- Middleware for route protection (`authMiddleware.js`) ensures only authenticated users can access protected resources.
- **Helmet** used for setting secure HTTP headers.
- **CORS policy** applied to allow only trusted frontend origins.
- Input sanitization and validation with **express-validator** and `validationMiddleware.js`.
- Global error handling and 404 response handling (`errorMiddleware.js`).
- Protection against **script injection (XSS)** and **NoSQL injection**.

### User Management
- Register a new user with validation for username, email, and strong password.
- Login with email and password to receive a JWT for session handling.
- User password is stored securely with **bcrypt salted hashing**.

### Project Management
- CRUD operations for projects (`projectController.js`).
- Ownership checks to ensure users can only access and modify their own projects.
- Projects can be linked to multiple tasks.

### Task Management
- CRUD operations for tasks (`taskController.js`).
- Each task is tied to a project and a user.
- Middleware `authorizeProject.js` ensures that only project owners can manage their associated tasks.
- Task schema supports **status management** (e.g., `pending`, `in-progress`, `completed`).

### API Highlights
- **RESTful endpoints** for users, projects, and tasks.
- Consistent **error handling** with detailed error responses.
- Clean separation of concerns (controllers, routes, middleware, models).

---

## Tech Stack

- **Node.js** – Backend runtime environment  
- **Express.js** – Web application framework  
- **MongoDB + Mongoose** – Database and ODM  
- **bcryptjs** – Secure password hashing  
- **jsonwebtoken (JWT)** – Authentication & authorization  
- **express-validator** – Input validation & sanitization  
- **Helmet** – Secure HTTP headers  
- **CORS** – Cross-origin resource sharing  
- **Nodemon** – Developer hot reloading  

---

## API Endpoints

### Authentication
- `POST /api/users/register` → Register a new user (no token generated on register).
- `POST /api/users/login` → Authenticate user and return JWT token.

### Projects
- `GET /api/projects` → Get all projects of the logged-in user.  
- `POST /api/projects` → Create a new project.  
- `GET /api/projects/:id` → Get a specific project by ID.  
- `PUT /api/projects/:id` → Update a project.  
- `DELETE /api/projects/:id` → Delete a project.

### Tasks
- `GET /api/projects/:projectId/tasks` → Get all tasks for a project.  
- `POST /api/projects/:projectId/tasks` → Create a task under a project.  
- `GET /api/projects/:projectId/tasks/:taskId` → Get a specific task.  
- `PUT /api/projects/:projectId/tasks/:taskId` → Update a task.  
- `DELETE /api/projects/:projectId/tasks/:taskId` → Delete a task.

---

## Skills Gained
* Backend development with Node.js & Express
* MongoDB & Mongoose for schema design and queries
* Secure authentication with JWT and password hashing
* Implementing role-based ownership checks with middleware
* Handling errors and validations in a clean, scalable way
* Applying OWASP Top 10 security practices in backend design
* Building and testing RESTful APIs

---

## Notes
* This backend is designed to integrate seamlessly with the TaskMaster Frontend (React + Vite).
* Future improvements: role-based access control (admin, user), project collaborators, and real-time updates with WebSockets.

---

## Environment Variables

The backend requires a `.env` file with the following keys:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Installation
```bash
# Clone repository
git clone https://github.com/your-username/taskmaster-backend.git

# Navigate into backend folder
cd taskmaster-backend

# Install dependencies
npm install
```

Run the backend server
```bash
# Development mode (with nodemon)
npm run server

# Production mode
npm start
```

Server will run on http://localhost:5000.