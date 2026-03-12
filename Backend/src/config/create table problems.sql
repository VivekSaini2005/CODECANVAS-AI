CREATE TABLE problems (
 id SERIAL PRIMARY KEY,
 title TEXT,
 difficulty VARCHAR(20),
 tags TEXT[],
 leetcode_link TEXT,
 codeforces_link TEXT,
 gfg_link TEXT
);