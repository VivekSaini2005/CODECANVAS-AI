const pool = require("../config/db")
exports.getNotifications = async (req, res) => {
    try {
        const user_id = req.userId;

        const result = await pool.query(`
            SELECT n.*, un.is_read
            FROM notifications n
            JOIN user_notifications un ON n.id = un.notification_id
            WHERE un.user_id = $1
            ORDER BY n.created_at DESC
        `, [user_id]);

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.userId;

        await pool.query(`
            UPDATE user_notifications
            SET is_read = TRUE, read_at = NOW()
            WHERE notification_id = $1 AND user_id = $2
        `, [id, user_id]);

        res.json({ message: "Marked as read" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};