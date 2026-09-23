# TaskFlow

A Trello-style task management web app. Users sign up, create projects, and manage tasks on a drag-and-drop board across three stages: **To Do**, **In Progress**, and **Done**.

Built as a full-stack portfolio project to demonstrate authentication, REST API design, database modeling, and an interactive React UI.

**Live demo:** _add your Vercel URL here once deployed_
**Backend API:** _add your Railway URL here once deployed_

---

## Features

- User signup and login with JWT authentication, passwords hashed with bcrypt
- Create, edit, and delete projects
- Create, edit, and delete tasks within a project (title, description, priority, due date, status)
- Drag-and-drop task board, fully keyboard-accessible (Tab to a card, Space to pick up, arrow keys to move, Space to drop)
- Authorization enforced server-side: users can only ever view or edit their own projects and tasks
- Client- and server-side input validation
- Responsive UI built with React and Tailwind CSS

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router, @dnd-kit, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcrypt |
| Deployment | Vercel (frontend), Railway (backend), MongoDB Atlas (database) |

## Project structure

```
TaskFlow/
├── taskflow-backend/     REST API (Express + MongoDB)
│   └── src/
│       ├── config/       Database connection
│       ├── controllers/  Route handlers
│       ├── middleware/   Auth, validation, error handling
│       ├── models/       Mongoose schemas (User, Project, Task)
│       ├── routes/       Express routers
│       └── utils/        Shared helpers
│
└── taskflow-frontend/    React app (Vite + Tailwind)
    └── src/
        ├── api/          Axios client + API call wrappers
        ├── components/   Reusable UI pieces (board, cards, modals)
        ├── context/       Auth state (React Context)
        └── pages/        Login, Signup, Dashboard, Board
```

## Data model

```
User (1) ──→ (many) Project ──→ (many) Task
```

A Project belongs to one User (`owner`); a Task belongs to one Project (`project`). Every API route checks ownership through this chain before allowing access — see `taskflow-backend/src/controllers/`.

## Running locally

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Backend

```bash
cd taskflow-backend
npm install
cp .env.example .env
```

Fill in `.env`:
```
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd taskflow-frontend
npm install
cp .env.example .env.local
```

Fill in `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

App runs at `http://localhost:5173`.

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/auth/me` | Get the current user (protected) |
| GET/POST | `/api/projects` | List / create projects |
| GET/PATCH/DELETE | `/api/projects/:id` | Get / update / delete a project |
| GET/POST | `/api/projects/:projectId/tasks` | List / create tasks in a project |
| GET/PATCH/DELETE | `/api/projects/:projectId/tasks/:id` | Get / update / delete a task |

All routes except signup/login require a `Authorization: Bearer <token>` header.

## Author

Muhammad Waiz Umar — [LinkedIn](https://linkedin.com/in/muhammad-waiz-umar-525360399)