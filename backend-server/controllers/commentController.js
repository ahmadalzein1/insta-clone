import { pool } from "../db/index.js";

/**
 * GET COMMENTS FOR POST
 * GET /api/comments/:postId
 */
export const getComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const result = await pool.query(
      `
      SELECT
        comments.id,
        comments.text,
        comments.created_at,
        users.id AS user_id,
        users.username
      FROM comments
      JOIN users ON users.id = comments.user_id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at ASC
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
 * CREATE COMMENT
 * POST /api/comments/:postId
 */
export const addComment = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  try {
    
const result = await pool.query(
  `
  WITH inserted_comment AS (
    INSERT INTO comments (post_id, user_id, text)
    VALUES ($1, $2, $3)
    RETURNING *
  )
  SELECT 
    inserted_comment.*,
    users.username,
    users.avatar
  FROM inserted_comment
  JOIN users ON users.id = inserted_comment.user_id;
  `,
  [postId, userId, text]
);


    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
