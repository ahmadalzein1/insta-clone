import { pool } from "../db/index.js";

/**
 * SEARCH USERS
 * GET /api/users/search?q=
 */
export const searchUsers = async (req, res) => {
  const q = req.query.q || "";

  try {
    const result = await pool.query(
      `
      SELECT id, username, avatar
      FROM users
      WHERE username ILIKE $1
      LIMIT 10
      `,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * GET USER PROFILE
 * GET /api/users/:id
 */
export const getUserProfile = async (req, res) => {
  const profileId = req.params.id;
  const myId = req.user.id;

  try {
    const userRes = await pool.query(
      `
      SELECT id, username, avatar, created_at
      FROM users
      WHERE id = $1
      `,
      [profileId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const postsRes = await pool.query(
      `
      SELECT *
      FROM posts
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [profileId]
    );

    const followRes = await pool.query(
      `
      SELECT 1
      FROM follows
      WHERE follower_id = $1 AND following_id = $2
      `,
      [myId, profileId]
    );

    res.json({
      user: userRes.rows[0],
      posts: postsRes.rows,
      isFollowing: followRes.rows.length > 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
