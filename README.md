## Project Flow Diagram

```mermaid
flowchart TD
	A[Frontend (React)] -- REST API --> B[Backend (Express.js)]
	B -- SQL Queries --> C[(PostgreSQL DB)]
	A -- Redirects --> D[LeetCode/Codeforces/GFG]
	B -- Returns Data --> A
	C -- Data --> B
```


# CodeCanvas AI

> **A beginner-friendly DSA learning roadmap platform for tracking, aggregating, and guiding your coding journey.**

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack & Skills](#tech-stack--skills)
- [Folder Structure & Paths](#folder-structure--paths)
- [API Routes & Usage](#api-routes--usage)
- [Project Flow Diagram](#project-flow-diagram)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Common Tasks & Tips](#common-tasks--tips)
- [Future Improvements](#future-improvements)
- [Author & Links](#author--links)

---

## Project Overview

**CodeCanvas AI** solves the problem of scattered DSA resources by aggregating popular coding sheets (Blind 75, Striver SDE, etc.) into a single platform. It helps users:
- Track progress across multiple sheets
- Avoid duplicate problems
- Get AI-guided hints (planned)
- Discuss problems (planned)

**Note:** CodeCanvas AI is NOT a coding judge. It redirects users to original platforms (LeetCode, Codeforces, GeeksForGeeks) for solving problems, while tracking progress and learning.

---


## Tech Stack & Skills

**Frontend:**
- React (Vite)
- React Router
- Axios (API calls)
- TailwindCSS (UI styling)

**Backend:**
- Node.js
- Express.js
- JWT Authentication
- Prisma ORM (database management)

**Database:**
- PostgreSQL

**Other Skills:**
- REST API design
- Basic SQL
- Git & GitHub
- Debugging with console/logs

---


## Folder Structure & Paths

**Backend** (`/Backend`):
- `src/`
	- `controllers/` – Handles business logic for each feature (e.g., `problemController.js`, `userController.js`, `aiController.js`, `sheetController.js`, etc.)
	- `routes/` – Defines API endpoints and maps them to controllers (e.g., `problemRoutes.js`, `authRoutes.js`, `aiRoutes.js`, etc.)
	- `services/` – Contains reusable business logic (e.g., `aiService.js`, `leaderboardService.js`, `notificationService.js`, `heatmapService.js`)
	- `middleware/` – Express middleware for authentication (`authMiddleware.js`), file uploads, etc.
	- `utils/` – Utility functions (e.g., `generateToken.js`, `parseDrawing.js`, `streakCalculator.js`)
	- `config/` – Database config (`db.js`), cloudinary, scoring, SQL scripts, and insert data helpers
	- `script/` – Data import scripts (e.g., `importProblems.js`)
	- `server.js` – Main server entry point
	- `index.js` – App setup
	- `socket.js` – Socket.io logic (if real-time features are used)
- `prisma/` – Prisma schema and migrations
- `package.json` – Backend dependencies

**Frontend** (`/frontend`):
- `src/`
	- `components/` – UI components (e.g., `Sidebar.jsx`, `ProblemCard.jsx`, `Compiler.jsx`, `HeatMap.jsx`, `Whiteboard.jsx`, etc.)
		- `Whiteboard.jsx`: An interactive drawing area for users to sketch diagrams, visualize algorithms, or take notes while solving problems. Useful for planning solutions, drawing trees/graphs, or collaborating in interviews.
	**AI APIs**
	- `/api/ai` (via `aiRoutes.js` and `aiController.js`): Handles AI-powered features such as hint generation, code suggestions, or future planned features like stepwise guidance. These endpoints are designed to provide intelligent support to users without giving away full solutions.
	- `pages/` – Main pages (e.g., `Dashboard.jsx`, `ProblemsPage.jsx`, `ProblemWorkspace.jsx`, `SheetProblems.jsx`, `Leaderboard.jsx`, etc.)
	- `api/` – API call logic (`authApi.js`, `axiosInstance.js`, `discussApi.js`, etc.)
	- `context/` – React context providers (e.g., `ThemeContext.jsx`)
	- `hooks/` – Custom React hooks (e.g., `useSocket.js`)
	- `layout/` – Layout components (e.g., `MainLayout.jsx`)
	- `assets/` – Images, icons, and static assets
	- `utils/` – Frontend helpers (e.g., `streakCalculator.js`)
	- `main.jsx` – App entry point
	- `App.jsx` – Main app component
- `public/` – Static files
- `package.json` – Frontend dependencies

---

# API Routes & Usage

**Authentication**
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login, returns JWT token

**Problems**
- `GET /api/problems` – List all problems
- `GET /api/problems/:slug` – Get problem details
- `POST /api/problems` – Add new problem

**Sheets**
- `GET /api/sheets` – List all sheets
- `GET /api/sheets/:id` – Get problems in a sheet
- `POST /api/sheets` – Create a new sheet

**Progress**
- `GET /api/progress` – Get user progress
- `POST /api/progress` – Update progress (pending/attempted/solved)

**Submissions**
- `GET /api/submissions` – Get user submissions
- `POST /api/submissions` – Save a code draft/attempt

**Other planned/future routes:**
- `/api/discussion` – Problem discussions (future)
- `/api/leaderboard` – Leaderboard (future)

---

# Frontend Structure

src

components

* Sidebar
* ProblemCard
* ProblemTable
* StatCard
* ProgressBar

pages

* Dashboard
* Sheets
* SheetProblems
* Problem
* Login
* Register

services

* api.js

layout

* MainLayout.jsx

---


## Getting Started

**1. Clone the repository**
```sh
git clone https://github.com/VivekSaini2005/codecanvas-ai
```

**2. Install backend dependencies**
```sh
cd Backend
npm install
```

**3. Install frontend dependencies**
```sh
cd ../frontend
npm install
```

**4. Set up environment variables**
Create a `.env` file in `/Backend`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/codecanvas_ai
JWT_SECRET=your_secret_key
DB_PASSWORD=your_database_password
```

**5. Run the backend**
```sh
cd ../Backend
node src/server.js
```

**6. Run the frontend**
```sh
cd ../frontend
npm run dev
```

**7. (Optional) Import sample problems**
```sh
cd ../Backend/src/script
node importProblems.js
```

---


## Common Tasks & Tips

- **Debugging:** Use `console.log` in backend and browser dev tools in frontend.
- **API Testing:** Use Postman or Thunder Client to test backend routes.
- **Extending:** Add new routes in `src/routes/` and logic in `src/controllers/` (backend).
- **Frontend:** Add new pages in `src/pages/` and components in `src/components/`.
- **Database:** Edit `prisma/schema.prisma` and run `npx prisma migrate dev` to update DB schema.
- **Authentication:** All protected routes require a valid JWT token in the `Authorization` header.

---


## Future Improvements

- AI hint system (stepwise hints)
- Automatic sheet import
- Duplicate problem detection
- Problem discussion forum
- Leaderboard system
- Career readiness score
- Mock interview system

---

## Author & Links

**Author:** Vivek Saini  
Full Stack Developer

- GitHub: [VivekSaini2005](https://github.com/VivekSaini2005)
- Live: [https://codecanva-ai.vercel.app/](https://codecanvasai-dusky.vercel.app/)
