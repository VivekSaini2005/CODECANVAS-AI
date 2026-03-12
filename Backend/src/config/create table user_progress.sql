CREATE TABLE user_progress (
 id SERIAL PRIMARY KEY,
 user_id INT REFERENCES users(id),
 problem_id INT REFERENCES problems(id),
 status VARCHAR(20),
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);