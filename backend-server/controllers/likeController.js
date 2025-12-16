import { pool } from "../db/index.js";

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
