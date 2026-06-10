import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookies from "cookie-parser";
import { UAParser } from "ua-parser-js";
import dotenv from "dotenv";
import Session from "../model/session.model.js";
import imagekit from "../db/imagekit.js";

dotenv.config();

// registerUser handles new user creation. It validates the request payload,
// ensures the email is unique, hashes the password, creates a user and session,
// issues JWT access and refresh tokens, and stores them as secure cookies.
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let session;

    // Validate whether this email is already taken before creating a new user.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password using bcrypt and configured salt rounds for security.
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);
    // 🖼️ Avatar URL
    let avatarUrl = "";

    // ✅ Upload avatar if exists
    if (req.file) {
      const uploadedImage = await imagekit.files.upload({
        file: req.file.buffer.toString("base64"),
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/avatarsTelegramClone",
      });

      avatarUrl = uploadedImage.url;
    }

    // Save the new user with the hashed password, not the plaintext password.
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    //  Generate JWT token
    const refreshToken = await jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const newSession = await Session.create({
      refreshToken: refreshToken,
      userId: newUser._id,
      ipAddress: ip,
      userAgent: parser.getUA(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    if (!newSession) {
      return res.status(500).json({ message: "Failed to create session" });
    }

    const accessToken = await jwt.sign(
      { id: newUser._id, session: newSession._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    // Store the JWT access token and refresh token in HTTP-only cookies.
    // These cookies are used by the client for subsequent authenticated requests.
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
  secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
     httpOnly: true,
 secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const safeUser = {
      _id: newUser._id,
      name: newUser.name,
      avatar: newUser.avatar,
    };
    console.log("Registered user:", safeUser);
    res
      .status(201)
      .json({ message: "User registered successfully", user: safeUser });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// loginUser authenticates an existing user. It verifies credentials, refreshes or
// creates a session record, updates session metadata, and issues JWT cookies.
export const loginUser = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    let session;

    // Verify that the provided email belongs to a registered user.
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the entered password to the stored hashed password.
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const refreshToken = await jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    let accessToken;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const existingSession = await Session.findOne({ userId: existingUser._id });

    // If no session exists yet, create a new session record for this login.
    if (!existingSession) {
      const userAgent = req.headers["user-agent"];
      const parser = new UAParser(userAgent);

      const newSession = await Session.create({
        refreshToken,
        userId: existingUser._id,
        ipAddress: ip,
        userAgent: parser.getUA(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      if (!newSession) {
        return res.status(500).json({ message: "Failed to create session" });
      }

      accessToken = await jwt.sign(
        { id: existingUser._id, session: newSession._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        },
      );
    } else {
      // Update the existing session with the new refresh token and metadata.
      existingSession.refreshToken = refreshToken;
      existingSession.ipAddress = req.ip;
      existingSession.userAgent = new UAParser(
        req.headers["user-agent"],
      ).getUA();
      existingSession.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      existingSession.valid = true;
      await existingSession.save();
      accessToken = await jwt.sign(
        { id: existingUser._id, session: existingSession._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        },
      );
    }

    // Set token in cookie
    res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
     httpOnly: true,
  secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const safeUser = {
      _id: existingUser._id,
      name: existingUser.name,
      avatar: existingUser.avatar,
    
      bio:existingUser.bio,
    };
    res.status(200).json({ message: "Login successful", user: safeUser });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// verifyTokenMiddleware confirms that the authenticated user exists and returns
// a sanitized user object without the password field. It is used for protected
// routes that need user profile validation.
export const verifyTokenMiddleware = async (req, res) => {
  try {
    // Load the authenticated user from the database, excluding the password.
    const user = await User.findOne({ _id: req.user }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized function user" });
    }

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio:user.bio,
    };  
    res.status(200).json({ user: safeUser });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized function" });
  }
};
