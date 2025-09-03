# 📌 TaskMaster API  

TaskMaster is a **RESTful API** powering the productivity platform **TaskMaster**.  
It handles **user authentication**, **project management**, and **task tracking** with strict **ownership-based authorization** to ensure data privacy and security.  

---

## 🚀 Features  

- **User Authentication & Authorization**
  - Register and login with secure password hashing (`bcrypt`)
  - JWT-based authentication for session management  
- **Project Management**
  - CRUD operations on projects
  - Ownership rules: only project owners can access or modify their projects  
- **Task Management**
  - Nested CRUD operations under projects
  - Complex authorization: users can only manage tasks inside projects they own  
- **Security**
  - Protected routes with JWT middleware
  - Multi-layered authorization checks  

---

## 📂 API Endpoints  

### 🔑 Authentication  
- **POST** `/api/users/register` → Register a new user  
- **POST** `/api/users/login` → Authenticate user and return JWT  

### 📁 Projects  
- **POST** `/api/projects` → Create a new project  
- **GET** `/api/projects` → Get all projects for logged-in user  
- **GET** `/api/projects/:id` → Get single project by ID (ownership required)  
- **PUT** `/api/projects/:id` → Update project (ownership required)  
- **DELETE** `/api/projects/:id` → Delete project (ownership required)  

### ✅ Tasks (nested under projects)  
- **POST** `/api/projects/:projectId/tasks` → Create a task inside a project (ownership required)  
- **GET** `/api/projects/:projectId/tasks` → Get all tasks in a project (ownership required)  
- **PUT** `/api/tasks/:taskId` → Update a task (ownership required via parent project)  
- **DELETE** `/api/tasks/:taskId` → Delete a task (ownership required via parent project)  

---

## ⚡ Challenges & Solutions  

### 1. **Password Security**
- **Challenge:** Ensuring user passwords were never stored in plain text.  
- **Solution:** Used **bcrypt pre-save hooks** in the User schema to hash passwords automatically before saving.  

### 2. **JWT Authentication**
- **Challenge:** Managing secure user sessions without storing sensitive info.  
- **Solution:** Implemented **JWT tokens** signed with a secret key, stored securely in `.env`. Added authentication middleware to validate tokens.  

### 3. **Authorization Rules**
- **Challenge:** Preventing one user from accessing or modifying another user’s projects or tasks.  
- **Solution:** Enforced **ownership checks**:
  - For projects: Verified `req.user.id` matches the project’s `user` field.  
  - For tasks: Verified ownership via the **parent project** before allowing updates or deletions.  

### 4. **Nested Routes for Tasks**
- **Challenge:** Designing RESTful task routes that reflect project hierarchy.  
- **Solution:** Used nested routes (`/api/projects/:projectId/tasks`) to create and fetch tasks. For updates/deletes, linked each task back to its **parent project**.  

### 5. **Error Handling**
- **Challenge:** Providing consistent, secure error messages without exposing sensitive details.  
- **Solution:** Centralized error handling with proper **status codes** (`400`, `401`, `403`, `404`). Returned helpful but non-sensitive messages.  

---

## 🏆 Reflection  

Building TaskMaster required synthesizing multiple backend skills:
- **Express routing** with modular controllers for clean separation of concerns  
- **Mongoose relationships** (`User → Project → Task`) to model real-world hierarchies  
- **Authentication + Authorization** to enforce data security at multiple levels  

This project emphasized **clean architecture, DRY principles, and secure coding practices** — making it a solid foundation for scaling into a production-ready application.  

---

## ⚙️ High-Level Project Setup  

1. **Clone the repository**  
   ```bash
   git clone <repo-url>
   cd taskmaster-backend
   npm install

2. **Install dependencies**
   npm install

3. **Configure environment variables in a .env file**
   PORT=5000
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key

4. **Run the development server**
   npm run dev

5. **Test the API using Postman, Insomnia, or any API client**