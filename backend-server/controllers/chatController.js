import { pool } from "../db/index.js";
import { getIO } from "../socket.js";

/**
 * GET MY CONVERSATIONS
 * GET /api/chat/conversations
 */
export const getConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
SELECT
  c.id,
  c.is_group,
  c.title,
  c.created_at,

  u.id       AS other_user_id,
  u.username AS other_username,
  u.avatar   AS other_avatar

FROM conversations c

JOIN conversation_members cm
  ON cm.conversation_id = c.id
 AND cm.user_id = $1

LEFT JOIN conversation_members cm_other
  ON cm_other.conversation_id = c.id
 AND cm_other.user_id <> $1
 AND c.is_group = false

LEFT JOIN users u
  ON u.id = cm_other.user_id

ORDER BY c.created_at DESC;

      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET MESSAGES
 * GET /api/chat/messages/:conversationId
 */
export const getMessages = async (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.conversationId;

  try {
    // 🔐 membership check
    const member = await pool.query(
      `
      SELECT 1
      FROM conversation_members
      WHERE conversation_id = $1 AND user_id = $2
      `,
      [conversationId, userId]
    );

    if (member.rows.length === 0) {
      return res.status(403).json({ message: "Not a member" });
    }

    const result = await pool.query(
      `
      SELECT
        m.id,
        m.text,
        m.created_at,
        u.id AS sender_id,
        u.username
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC
      
      `,
      [conversationId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * SEND MESSAGE
 * POST /api/chat/messages/:conversationId
 */
export const sendMessage = async (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.conversationId;
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ message: "Message empty" });
  }

  try {
    // 🔐 membership check
    const member = await pool.query(
      `
      SELECT 1
      FROM conversation_members
      WHERE conversation_id = $1 AND user_id = $2
      `,
      [conversationId, userId]
    );

    if (member.rows.length === 0) {
      return res.status(403).json({ message: "Not a member" });
    }

    const result = await pool.query(
      `
WITH inserted_message AS (
  INSERT INTO messages (conversation_id, sender_id, text)
  VALUES ($1, $2, $3)
  RETURNING *
)
SELECT 
  im.id,
  im.conversation_id,
  im.text,
  im.created_at,

  u.id        AS sender_id,
  u.username  AS username,
  u.avatar    AS sender_avatar
FROM inserted_message im
JOIN users u ON u.id = im.sender_id;

      `,
      [conversationId, userId, text]
    );



const message = result.rows[0];

// 🔥 emit to room
const io = getIO();
io.to(`conversation:${conversationId}`).emit("message:new", {
  id: message.id,
  conversation_id: conversationId,
  sender_id: userId,
  text: message.text,
  created_at: message.created_at,
  username: req.user.username,
});

res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * CREATE 1-1 CONVERSATION
 * POST /api/chat/conversations/one
 */
export const createOneToOne = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.body;

  try {
    // prevent duplicates
    const existing = await pool.query(
      `
      SELECT c.id
      FROM conversations c
      JOIN conversation_members cm1 ON cm1.conversation_id = c.id
      JOIN conversation_members cm2 ON cm2.conversation_id = c.id
      WHERE c.is_group = false
        AND cm1.user_id = $1
        AND cm2.user_id = $2
      `,
      [userId, otherUserId]
    );

    if (existing.rows.length > 0) {
      return res.json({ conversationId: existing.rows[0].id });
    }

    const conv = await pool.query(
      `
      INSERT INTO conversations (is_group)
      VALUES (false)
      RETURNING id
      `
    );

    const conversationId = conv.rows[0].id;

    await pool.query(
      `
      INSERT INTO conversation_members (conversation_id, user_id)
      VALUES ($1, $2), ($1, $3)
      `,
      [conversationId, userId, otherUserId]
    );

    res.status(201).json({ conversationId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * CREATE GROUP
 * POST /api/chat/conversations/group
 */
export const createGroup = async (req, res) => {
  const userId = req.user.id;
  const { title, members } = req.body;

  if (!title || !Array.isArray(members) || members.length < 2) {
    return res.status(400).json({ message: "Invalid group" });
  }

  try {
    const conv = await pool.query(
      `
      INSERT INTO conversations (is_group, title)
      VALUES (true, $1)
      RETURNING id
      `,
      [title]
    );

    const conversationId = conv.rows[0].id;

    const values = [userId, ...members]
      .map((uid) => `(${conversationId}, ${uid})`)
      .join(",");

    await pool.query(
      `
      INSERT INTO conversation_members (conversation_id, user_id)
      VALUES ${values}
      `
    );

    res.status(201).json({ conversationId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
