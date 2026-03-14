# CodeCanvas AI

CodeCanvas AI is a **DSA learning roadmap platform** that aggregates popular coding sheets (Blind 75, Striver SDE Sheet, etc.) into a unified system where users can track progress, discover problems, and receive guided learning support.

Unlike traditional coding platforms, **CodeCanvas AI is not a coding judge or LeetCode clone**. Instead, it acts as a **learning aggregator and progress tracker**, redirecting users to original platforms such as **LeetCode, Codeforces, and GeeksForGeeks** to solve problems.

The platform solves the common issue of **fragmented learning resources**, where students jump between multiple sheets and tutorials without a structured progress tracking system.

---

# Problem Statement

Many computer science students struggle with **DSA preparation due to scattered resources**.

Students typically use:

* Striver SDE Sheet
* Blind 75
* Neetcode 150
* Love Babbar 450

These resources often contain **duplicate problems across sheets**, and students lack a unified way to track progress.

CodeCanvas AI solves this by providing:

* A **centralized sheet aggregator**
* **Duplicate problem mapping**
* **Progress tracking**
* **AI-guided hints**
* **Discussion system**

---

# Key Features

## Sheet Aggregator (SheetScope)

Combines multiple popular problem sheets into one platform.

Examples:

* Blind 75
* Striver SDE Sheet
* Babbar 450
* Custom user sheets

Each sheet can contain ordered problems while still referencing a **single canonical problem entry**.

---

## Problem Redirection

Instead of hosting the problem itself, CodeCanvas redirects users to the original platform:

* LeetCode
* Codeforces
* GeeksForGeeks

This keeps the system lightweight while maintaining the learning flow.

---

## Progress Tracking

Users can track their progress across sheets.

Progress states:

* Pending
* Attempted
* Solved

The system maintains a unique progress entry per user and problem.

---

## AI Learning Assistant (Planned)

An AI tutor will guide users through hints using progressive levels:

1. Observation Hint
2. Strategy Hint
3. Pseudocode Hint

The AI intentionally avoids revealing full solutions.

---

## Discussion System (Future)

Each problem will support community discussions where users can:

* Ask questions
* Share approaches
* Discuss optimizations

---

# Tech Stack

## Frontend

* React (Vite)
* React Router
* Axios
* TailwindCSS

## Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication

## Database

* PostgreSQL
* Prisma ORM (Schema Management)

---

# System Architecture

Frontend (React + Vite)
│
│ REST API
▼
Backend (Node.js + Express)
│
│ SQL Queries
▼
PostgreSQL Database

External Platforms

LeetCode
Codeforces
GeeksForGeeks

Users solve problems on external platforms while CodeCanvas tracks their progress.

---

# Database Schema Overview

The database is designed around **canonical problem mapping**.

Main entities:

* Users
* Problems
* Sheets
* SheetProblems
* Progress
* Submissions
* Tags
* Companies

---

## Users

Stores registered users.

Fields:

* id
* email
* name
* password
* createdAt

---

## Problems

Stores canonical problems across all sheets.

Fields:

* id
* title
* slug
* difficulty
* problemLink
* platform
* editorialLink
* youtubeLink

---

## Sheets

Represents curated DSA roadmaps.

Examples:

* Blind 75
* Striver SDE Sheet

---

## SheetProblems

Join table linking problems to sheets.

Supports ordered problems inside sheets.

---

## Progress

Tracks user progress for each problem.

Unique constraint:

userId + problemId

---

## Submissions

Stores user code submissions.

Although CodeCanvas does not execute code, submissions can store:

* solution drafts
* notes
* attempts

---

## Tags

Problem topic classification.

Examples:

* Array
* Graph
* Dynamic Programming
* Greedy

---

## Companies

Tracks which companies commonly ask each problem.

Examples:

* Google
* Amazon
* Microsoft

---

# Backend API

## Authentication

Register

POST /api/auth/register

Login

POST /api/auth/login

Returns JWT token.

---

## Problems

Get all problems

GET /api/problems

Get problem by slug

GET /api/problems/:slug

Create problem

POST /api/problems

---

## Sheets

Get all sheets

GET /api/sheets

Get problems inside sheet

GET /api/sheets/:id

Create sheet

POST /api/sheets

---

## Progress

Update progress

POST /api/progress

Get user progress

GET /api/progress

---

## Submissions

Create submission

POST /api/submissions

Get user submissions

GET /api/submissions

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

# Installation

Clone the repository

```
git clone https://github.com/yourusername/codecanvas-ai
```

Install backend dependencies

```
npm install
```

Install frontend dependencies

```
cd frontend
npm install
```

---

# Environment Variables

Create a .env file.

Example:

```
DATABASE_URL=postgresql://user:password@localhost:5432/codecanvas_ai
JWT_SECRET=your_secret_key
DB_PASSWORD=your_database_password
```

---

# Run Backend

```
node server.js
```

---

# Run Frontend

```
npm run dev
```

---

# Import Problems

You can populate the database using the import script.

```
node scripts/importProblems.js
```

This inserts sample problems into the database.

---

# Future Improvements

Planned upgrades include:

* AI hint system
* Automatic sheet import
* Duplicate problem detection
* Problem discussion forum
* Leaderboard system
* Career readiness score
* Mock interview system

---

# Long-Term Vision

CodeCanvas AI aims to become the **operating system for technical growth**, providing a structured environment where students can build algorithmic thinking and prepare for software engineering interviews.

---

# Author

Vivek Saini

Full Stack Developer

GitHub: https://github.com/VivekSaini2005

