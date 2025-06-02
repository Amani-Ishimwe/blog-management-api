# Blog Management API

A robust backend API for managing blogs, users, and roles. Users can create and manage their own blogs, while admins can assign roles and oversee the application. This project is a backend-only solution (no view rendering) built with Node.js, Express, and MongoDB.

## Features
- User registration, login, and profile management
- Role-based access control (admin, user, moderator)
- Blog CRUD operations
- Real-time updates via WebSocket
- API documentation with Swagger

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- WebSocket (ws)
- Swagger for API docs

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd blog-management-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   - Edit `config/default.json` for local development:
     ```json
     {
       "port": 3000,
       "MongoURI": "mongodb://localhost:27017/BlogManagement",
       "jwtsecret": "your_jwt_secret"
     }
     ```
   - For production, update `config/production.json` accordingly.

### Running the Server
- Development mode (with nodemon):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

The server will start on the port specified in your config (default: 3000).

## API Documentation
Interactive API docs are available via Swagger:
- Visit: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Main Endpoints
- `POST /api/user/register` — Register a new user
- `POST /api/user/login` — User login
- `GET /api/user/profile` — Get user profile (auth required)
- `POST /api/user/assign-role` — Assign role (admin only)
- `GET /api/blog` — List all blogs
- `POST /api/blog` — Create a blog (auth required)
- ...and more (see Swagger docs)

## WebSocket Support
- Real-time updates are available via WebSocket on the same server port.

## Project Structure
- `server.js` — Main entry point
- `routes/` — Express route definitions
- `controllers/` — Business logic
- `models/` — Mongoose models
- `middleware/` — Custom middleware
- `config/` — Configuration files
- `swagger/` — Swagger API documentation

## License
ISC

---
For more details, see the source code and Swagger documentation. 
