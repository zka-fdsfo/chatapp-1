import jwt from "jsonwebtoken";
import Session from "../model/session.model.js";
import crypto from "crypto";
import dotenv from "dotenv";
import admin from "../db/firebase-admin.js";
import { getAuth } from "firebase-admin/auth";
dotenv.config();
export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
  //  console.log("COOKIE ACCESS TOKEN:", accessToken);
    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );


    // Check session
    const session = await Session.findById(
      decoded.session
    ).populate("userId");

    if (!session || !session.valid) {
      return res.status(401).json({
        message: "Session expired",
      });
    }

    req.user = session.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
   return res.status(401).json({
      message: "Access token expired",
      expired: true,
   });
}

    return res.status(401).json({
      message: "Invalid access token",
    });
  }
};

export const refreshTokenMiddleware = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
    
        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }   

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        // ✅ Match the actual token stored in DB
const session = await Session.findOne({ 
  userId: decoded.id, 
  refreshToken: refreshToken, // ADD THIS
  valid: true 
});

        if (!session || !session.valid) {
            return res.status(401).json({ message: "Session expired" });
        }

        const newRefreshToken = jwt.sign(
            { id: session.userId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        session.refreshToken = newRefreshToken;
        session.valid = true;
        session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await session.save();
        const newAccessToken = jwt.sign(
            { id: session.userId, session: session._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        res.cookie("refreshToken", newRefreshToken, {
               httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie("accessToken", newAccessToken, { 
            httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
        });
        req.user = session.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
}

export const verifyGoogleToken = async (req, res, next) => {
  try {
    const { idToken } = req.body;

//    console.log("TOKEN RECEIVED:", !!idToken);

    const decodedToken = await getAuth().verifyIdToken(idToken);

    req.googleUser = decodedToken;

    next();
  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);

    return res.status(401).json({
      message: error.message,
    });
  }
};