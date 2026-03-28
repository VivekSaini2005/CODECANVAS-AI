const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")
const { createNotification } = require("../services/notificationService")
const { getSocketId } = require("../socket")

exports.createPost = async (req, res) => {
    try {
        const { title, content, problem_id } = req.body;
        // console.log("Received createPost request:", { title, content, problem_id });
        const user_id = req.userId;

        const result = await pool.query(
            `INSERT INTO discussion_posts (user_id, title, content, problem_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, title, content, problem_id || null]
        );

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const user_id = req.user ? req.user.id : (req.userId || null); // Ensure user_id is extracted

        const result = await pool.query(`
            SELECT p.*, u.name,
            COALESCE(SUM(v.vote_type),0) as votes,
            EXISTS (
                SELECT 1 FROM bookmarks b 
                WHERE b.post_id = p.id AND b.user_id = $1
            ) as is_bookmarked
            FROM discussion_posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN discussion_votes v ON p.id = v.post_id
            GROUP BY p.id, u.name
            ORDER BY p.created_at DESC
        `, [user_id]);

        // console.log(result.rows);

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { content, parent_comment_id } = req.body;
        const { postId } = req.params;
        const user_id = req.userId;

        const result = await pool.query(
            `INSERT INTO discussion_comments 
            (post_id, user_id, content, parent_comment_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [postId, user_id, content, parent_comment_id || null]
        );

// Notify the appropriate user (either the post owner or the parent comment owner)
        // Check if it's a reply to another comment
        if (parent_comment_id) {
            const parentCommentResult = await pool.query(`SELECT user_id, content FROM discussion_comments WHERE id = $1`, [parent_comment_id]);
            if (parentCommentResult.rows.length > 0) {
                const commentOwnerId = parentCommentResult.rows[0].user_id;

                // Only notify if someone else replied to your comment
                if (commentOwnerId !== user_id) {
                    const notification = await createNotification({
                        sender_id: user_id,
                        receiver_id: commentOwnerId,
                        type: 'COMMENT_POST', 
                        post_id: postId,
                        comment_id: result.rows[0].id,
                        message: `Someone replied to your comment`
                    });

                    // Socket Emitting
                    const io = req.app.get("io");
                    const socketId = getSocketId(commentOwnerId);
                    if (socketId && io) {
                        io.to(socketId).emit("newNotification", notification);
                    }
                }
            }
        } else {
            // No parent_comment_id, so it's a direct comment to the post
            const postResult = await pool.query(`SELECT user_id, title FROM discussion_posts WHERE id = $1`, [postId]);
            if (postResult.rows.length > 0) {
                const postOwnerId = postResult.rows[0].user_id;

                // Only notify if someone else commented on your post
                if (postOwnerId !== user_id) {
                    const notification = await createNotification({
                        sender_id: user_id,
                        receiver_id: postOwnerId,
                        type: 'COMMENT_POST',
                        post_id: postId,
                        comment_id: result.rows[0].id,
                        message: `Someone commented on your post "${postResult.rows[0].title}"`
                    });

                    // Socket Emitting
                    const io = req.app.get("io");
                    const socketId = getSocketId(postOwnerId);
                    if (socketId && io) {
                        io.to(socketId).emit("newNotification", notification);
                    }
                }
            }
        }

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        
        const result = await pool.query(
            `SELECT c.*, u.name as username 
             FROM discussion_comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [postId]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.vote = async (req, res) => {
    try {
        const { post_id, comment_id, vote_type } = req.body;
        const user_id = req.userId;

        // Check if vote already exists
        const check = await pool.query(
            `SELECT vote_type FROM discussion_votes WHERE user_id = $1 AND post_id = $2 AND (comment_id = $3 OR ($3 IS NULL AND comment_id IS NULL))`,
            [user_id, post_id, comment_id || null]
        );

        if (check.rows.length > 0 && check.rows[0].vote_type === vote_type) {
            // Un-vote (normalize to 0) by deleting the record entirely
            await pool.query(
                `DELETE FROM discussion_votes WHERE user_id = $1 AND post_id = $2 AND (comment_id = $3 OR ($3 IS NULL AND comment_id IS NULL))`,
                [user_id, post_id, comment_id || null]
            );
            return res.json({ vote_type: 0 }); // Respond with 0 (neutralized)
        }

        const result = await pool.query(`
            INSERT INTO discussion_votes (user_id, post_id, comment_id, vote_type)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, post_id, comment_id)
            DO UPDATE SET vote_type = $4
            RETURNING *
        `, [user_id, post_id || null, comment_id || null, vote_type]);

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.bookmark = async (req, res) => {
    try {
        const user_id = req.userId;
        const { postId } = req.params;

        // Check if bookmark exists
        const check = await pool.query(
            `SELECT * FROM bookmarks WHERE user_id = $1 AND post_id = $2`,
            [user_id, postId]
        );

        if (check.rows.length > 0) {
            // Already bookmarked -> remove it (Toggle off)
            await pool.query(
                `DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2`,
                [user_id, postId]
            );
            return res.json({ message: "Bookmark removed", bookmarked: false });
        } else {
            // Not bookmarked -> add it (Toggle on)
            await pool.query(`
                INSERT INTO bookmarks (user_id, post_id)
                VALUES ($1, $2)
            `, [user_id, postId]);
            return res.json({ message: "Bookmarked", bookmarked: true });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const user_id = req.userId;
        const { postId } = req.params;

        const result = await pool.query(
            `DELETE FROM discussion_posts WHERE id = $1 AND user_id = $2 RETURNING *`,
            [postId, user_id]
        );

        if (result.rowCount === 0) {
            return res.status(403).json({ error: "Unauthorized to delete this post or post not found" });
        }

        res.json({ message: "Post deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const user_id = req.userId;
        const { commentId } = req.params;

        const result = await pool.query(
            `DELETE FROM discussion_comments WHERE id = $1 AND user_id = $2 RETURNING *`,
            [commentId, user_id]
        );

        if (result.rowCount === 0) {
            return res.status(403).json({ error: "Unauthorized to delete this comment or comment not found" });
        }

        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};