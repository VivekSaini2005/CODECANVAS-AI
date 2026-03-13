-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ENUMS

CREATE TYPE difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE progress_status AS ENUM ('PENDING', 'ATTEMPTED', 'SOLVED');


-- USERS

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- PROBLEMS

CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty difficulty NOT NULL,
    tags TEXT[],
    starter_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- SUBMISSIONS

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    problem_id UUID NOT NULL,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT NOT NULL,
    runtime DOUBLE PRECISION,
    memory DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- SHEETS

CREATE TABLE sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- SHEET PROBLEMS

CREATE TABLE sheet_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet_id UUID NOT NULL,
    problem_id UUID NOT NULL,
    order_index INTEGER NOT NULL,

    FOREIGN KEY (sheet_id) REFERENCES sheets(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- USER PROGRESS

CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    problem_id UUID NOT NULL,
    status progress_status NOT NULL,
    attempts INTEGER DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- POSTS (DISCUSSIONS)

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    problem_id UUID,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- COMMENTS

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE RESTRICT ON UPDATE CASCADE
);