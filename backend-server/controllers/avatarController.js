import { pool } from "../db/index.js";

/**
 * UPDATE AVATAR
 * PUT /api/users/avatar
 */
export const updateAvatar = async (req, res) => {
  const userId = req.user.id;
  const avatar = req.file?.filename;

  if (!avatar) {
    return res.status(400).json({ message: "Avatar file is required" });
  }

  try {
    await pool.query(
      `
      UPDATE users
      SET avatar = $1
      WHERE id = $2
      `,
      [avatar, userId]
    );

    res.json({ avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
