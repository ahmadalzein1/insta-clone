import { pool } from "../db/index.js";

/**
 * CREATE POST
 * POST /api/posts
 */
export const createPost = async (req, res) => {
  const userId = req.user.id;
  const { caption } = req.body;
  const image = req.file?.filename;

  if (!image) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, image, caption)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId,"uploads/"+image, caption]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




/**
 * GET FEED
 * GET /api/posts/feed
 */
export const getFeed = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
SELECT posts.*, users.username, users.avatar
FROM posts
JOIN users ON users.id = posts.user_id
WHERE posts.user_id = $1
   OR posts.user_id IN (
     SELECT following_id
     FROM follows
     WHERE follower_id = $1
   )
ORDER BY posts.created_at DESC;

      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
