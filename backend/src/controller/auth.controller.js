import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookies from "cookie-parser";
import { UAParser } from "ua-parser-js";
import dotenv from "dotenv";
import Session from "../model/session.model.js";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let session;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // Generate JWT token
    const refreshToken = await jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
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
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
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
    // Set token in cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    const safeUser = {
      _id:newUser._id,
      name:newUser.name,
      email:newUser.email,
    };

    res
      .status(201)
      .json({ message: "User registered successfully", user: safeUser });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const loginUser = async (req, res) => {
   console.log(req.body);
  try {
    const { email, password } = req.body;
    let session;
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const refreshToken = await jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    let accessToken;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const existingSession = await Session.findOne({ userId: existingUser._id });
    if (!existingSession) {
      const userAgent = req.headers["user-agent"];
      const parser = new UAParser(userAgent);

      const newSession = await Session.create({
        refreshToken,
        userId: existingUser._id,
        ipAddress: ip,
        userAgent: parser.getUA(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
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
      existingSession.refreshToken = refreshToken;
      existingSession.ipAddress = req.ip;
      existingSession.userAgent = new UAParser(
        req.headers["user-agent"],
      ).getUA();
      existingSession.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
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
      //secure: process.env.NODE_ENV === "production",
        secure: false,
  sameSite: "lax",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
        secure: false,
  sameSite: "lax",
    });
    const safeUser = {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    };
    res.status(200).json({ message: "Login successful", user: safeUser });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyTokenMiddleware = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user }).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized function user" });
    }
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    res.status(200).json({ user: safeUser });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized function" });
  }
};
