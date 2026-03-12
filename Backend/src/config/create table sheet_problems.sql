CREATE TABLE sheet_problems (
 id SERIAL PRIMARY KEY,
 sheet_id INT REFERENCES sheets(id),
 problem_id INT REFERENCES problems(id),
 problem_order INT
);