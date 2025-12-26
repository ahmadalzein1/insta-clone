import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/index.js";
import crypto from "crypto";
import { sendEmail } from "../utils/SendEmail.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
        avatar: user.avatar,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Email or username already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, role, created_at`,
      [username, email, hashed]
    );

    const user = result.rows[0];





// 1️⃣ Generate token
const rawToken = crypto.randomBytes(32).toString("hex");//unique
const tokenHash = crypto
  .createHash("sha256")
  .update(rawToken)
  .digest("hex");

// 2️⃣ Save token
await pool.query(
  `
  INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
  VALUES ($1, $2, NOW() + INTERVAL '24 hours')
  `,
  [user.id, tokenHash]
);

// 3️⃣ Send email
const verifyUrl = `${process.env.FRONTEND_URL}verify-email?token=${rawToken}`;

await sendEmail({
  to: user.email,
  subject: "Verify your email",
  html: `
    <h2>Verify your email</h2>
    <p>Click the link below to verify your account:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
  `,
});

    //const token = generateToken(user);

    res.status(201).json({ message:'verify your account via a link sent to your email' });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1 OR username = $1`,
      [emailOrUsername]
    );
    const user = result.rows[0];


if (!user.is_verified) {
  return res
    .status(403)
    .json({ message: "Please verify your email first" });
}










    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // don't send password back
    delete user.password;

    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Invalid token" });
  }

  // hash incoming token
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  try {
    const result = await pool.query(
      `
      SELECT user_id
      FROM email_verification_tokens
      WHERE token_hash = $1
        AND expires_at > NOW()
      `,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    const userId = result.rows[0].user_id;

    // ✅ verify user
    await pool.query(
      `UPDATE users SET is_verified = true WHERE id = $1`,
      [userId]
    );

    // 🔥 delete token (ONE TIME USE)
    await pool.query(
      `DELETE FROM email_verification_tokens WHERE user_id = $1`,
      [userId]
    );

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    const userRes = await pool.query(
      `SELECT id, is_verified FROM users WHERE email = $1`,
      [email]
    );

    if (userRes.rows.length === 0) {
      // ❗ Do NOT reveal if email exists
      return res.json({ message: "If the email exists, a link was sent" });
    }

    const user = userRes.rows[0];

    if (user.is_verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // 🔥 delete any old tokens (important)
    await pool.query(
      `DELETE FROM email_verification_tokens WHERE user_id = $1`,
      [user.id]
    );

    // 🔐 generate new token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await pool.query(
      `
      INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '24 hours')
      `,
      [user.id, tokenHash]
    );

    const verifyUrl = `${process.env.FRONTEND_URL}verify-email?token=${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Verify your email</h2>
        <p>Click the link below:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
    });

    res.json({ message: "Verification email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
