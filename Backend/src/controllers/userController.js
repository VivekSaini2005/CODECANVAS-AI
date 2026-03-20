const cloudinary = require("../config/cloudinary");
const pool = require("../config/db"); // pg pool

exports.updateProfileImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // buffer → base64
    const base64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "profile_images",
    });

    // 🔥 UPDATE USER IMAGE IN POSTGRESQL
    const updatedUser = await pool.query(
      `UPDATE "users"
       SET profileimage = $1
       WHERE id = $2
       RETURNING *`,
      [result.secure_url, req.userId]
    );

    res.status(200).json({
      message: "Profile image updated",
      user: updatedUser.rows[0],
      image: result.secure_url,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};