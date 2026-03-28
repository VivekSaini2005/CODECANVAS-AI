CREATE TABLE discussion_posts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    problem_id INTEGER,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discussion_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES discussion_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES discussion_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discussion_votes (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES discussion_posts(id) ON DELETE CASCADE,
    comment_id INTEGER REFERENCES discussion_comments(id) ON DELETE CASCADE,
    vote_type SMALLINT NOT NULL CHECK (vote_type IN (1, -1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_vote UNIQUE (user_id, post_id, comment_id)
);

CREATE TABLE discussion_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
    post_id INTEGER REFERENCES discussion_posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES discussion_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES discussion_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, post_id)
);

CREATE TABLE notification_types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO notification_types (type) VALUES
('LIKE_POST'),
('COMMENT_POST'),
('REPLY_COMMENT'),
('MENTION'),
('SYSTEM');

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type_id INTEGER REFERENCES notification_types(id),

    post_id INTEGER,
    comment_id INTEGER,

    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_notifications (
    id SERIAL PRIMARY KEY,
    notification_id INTEGER REFERENCES notifications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP
);


CREATE INDEX idx_posts_user ON discussion_posts(user_id);
CREATE INDEX idx_comments_post ON discussion_comments(post_id);
CREATE INDEX idx_comments_parent ON discussion_comments(parent_comment_id);
CREATE INDEX idx_votes_post ON discussion_votes(post_id);
CREATE INDEX idx_votes_comment ON discussion_votes(comment_id);
CREATE INDEX idx_notifications_receiver ON notifications(receiver_id);
CREATE INDEX idx_user_notifications_user ON user_notifications(user_id);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_posts
BEFORE UPDATE ON discussion_posts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

