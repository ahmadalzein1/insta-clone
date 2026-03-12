import { pool } from "../db/index.js";

/**
 * GET LIKERS FOR POST
 * GET /api/likes/:postId
 */
export const getLikers = async (req, res) => {
  const postId = req.params.postId;

  try {
    const result = await pool.query(
      `
      SELECT users.id, users.username, users.avatar, users.role
      FROM likes
      JOIN users ON users.id = likes.user_id
      WHERE likes.post_id = $1
      ORDER BY likes.created_at DESC
      `,
      [postId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * LIKE POST
 * POST /api/likes/:postId
 */
export const likePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    await pool.query(
      `
      INSERT INTO likes (post_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [postId, userId]
    );

    res.json({ message: "Post liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UNLIKE POST
 * DELETE /api/likes/:postId
 */
export const unlikePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    await pool.query(
      `
      DELETE FROM likes
      WHERE post_id = $1 AND user_id = $2
      `,
      [postId, userId]
    );

    res.json({ message: "Post unliked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
