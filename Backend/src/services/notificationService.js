// notification.service.js
const pool = require('../config/db'); // ensure you import the db correctly if it was missing

exports.createNotification = async ({
    sender_id,
    receiver_id,
    type,
    post_id,
    comment_id,
    message
}) => {
    const typeResult = await pool.query(
        `SELECT id FROM notification_types WHERE type = $1`,
        [type]
    );

    const type_id = typeResult.rows[0].id;

    const result = await pool.query(`
        INSERT INTO notifications
        (sender_id, receiver_id, type_id, post_id, comment_id, message)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `, [sender_id, receiver_id, type_id, post_id, comment_id, message]);

    await pool.query(`
        INSERT INTO user_notifications (notification_id, user_id)
        VALUES ($1, $2)
    `, [result.rows[0].id, receiver_id]);

    const newNotification = result.rows[0];
    newNotification.is_read = false;
    newNotification.notification_id = newNotification.id;

    return newNotification;
};