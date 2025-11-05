import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER USER
export async function registerUser(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, email, password, role) are required.",
    });
  }

  try {
    //Check if email already exists
    const [existingUser] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please log in instead.",
      });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 8);

    //Insert new user record
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name.trim(), email.toLowerCase(), hashedPassword, role.toLowerCase()]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful! You can now log in.",
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while registering user.",
    });
  }
}

/**
 * LOGIN USEr
 */
export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    //Find user by email
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email.",
      });
    }

    const user = rows[0];

    //Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    //Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while logging in.",
    });
  }
}
