# Task Manager App Backend

This is the backend for the **Task Manager App**, built using **Node.js**, **ExpressJS**, and **TypeScript**, with **PostgreSQL** as the database. This backend handles user authentication, task management, board creation, and task assignments.

## Features
- User authentication and authorization.
- Create and manage boards (Kanban-style).
- Add, update, and delete tasks.
- Assign tasks to collaborators.
- Real-time updates for task changes (planned).

## Tech Stack
- **Node.js**: Server runtime.
- **ExpressJS**: Framework for building the REST API.
- **TypeScript**: Strongly typed language for scalability.
- **PostgreSQL**: Relational database for storing app data.
- **dotenv**: To manage environment variables.

---

## Setup Instructions

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/tuyizereerneste/task-manager-backend.git
cd task-manager-backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Create a `.env` file in the root directory and add the following:

```
PORT=5000
DB_USER=<your_postgres_user>
DB_HOST=localhost
DB_NAME=task_manager_db
DB_PASSWORD=<your_postgres_password>
DB_PORT=5434
```

### 5. Initialize the Database
- Start your PostgreSQL server.
- Create the database manually or use a database migration tool.
- Example SQL command to create the database:

```sql
CREATE DATABASE task_manager_db;
```

### 6. Start the Development Server
To start the server in development mode:
```bash
npm run dev
```

The server should now be running on `http://localhost:5000/`.

### 7. Test the Connection
Check the logs for a successful database connection message:
```
Database connected successfully
Server is running on port 5000
```

---

## Available Scripts

### `npm run dev`
Start the development server with **nodemon** for auto-reloading.

### `npm run build`
Compile the TypeScript code into JavaScript in the `dist/` folder.

### `npm start`
Start the production server using compiled JavaScript files.

---

## API Endpoints (Planned)

### Users
- `POST /users/register`: Register a new user.
- `POST /users/login`: Log in a user.

### Boards
- `GET /boards`: Fetch all boards for a user.
- `POST /boards`: Create a new board.

### Tasks
- `GET /boards/:boardId/tasks`: Fetch tasks for a specific board.
- `POST /boards/:boardId/tasks`: Create a new task in a board.
- `PATCH /tasks/:taskId`: Update a task.
- `DELETE /tasks/:taskId`: Delete a task.

---

## Contributions
Feel free to fork this repository and create a pull request with your changes. Suggestions and feedback are welcome!

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Author
Tuyizere Erneste (https://github.com/tuyizereerneste)