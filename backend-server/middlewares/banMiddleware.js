import { pool } from "../db/index.js";

export const checkNotBanned = async (req, res, next) => {
  try {
    const result = await pool.query(
      `
      SELECT banned
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    if (result.rows[0].banned) {
      return res.status(403).json({ message: "User is banned" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
