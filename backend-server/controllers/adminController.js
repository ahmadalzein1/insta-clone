import { pool } from "../db/index.js";

/**
 * BAN / UNBAN USER
 * PUT /api/admin/users/:id/ban
 */
export const toggleBanUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET banned = NOT banned
      WHERE id = $1
      RETURNING id, username, banned
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * DELETE ANY POST
 * DELETE /api/admin/posts/:id
 */
export const deletePostAdmin = async (req, res) => {
  const postId = req.params.id;

  try {
    await pool.query(
      `
      DELETE FROM posts
      WHERE id = $1
      `,
      [postId]
    );

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/admin/users
export const listUsersAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, email, role, banned, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 200
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/posts
export const listPostsAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT posts.*, users.username
      FROM posts
      JOIN users ON users.id = posts.user_id
      ORDER BY posts.created_at DESC
      LIMIT 200
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
