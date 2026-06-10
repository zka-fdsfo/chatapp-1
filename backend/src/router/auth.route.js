import express from 'express'

const Router =express.Router()
import { registerUser, loginUser ,verifyTokenMiddleware} from '../controller/auth.controller.js'
import { authMiddleware,refreshTokenMiddleware} from '../middleware/auth.middleware.js'
import upload from '../middleware/multer.js'
Router.post('/register', upload.single('avatar'), registerUser)
Router.post('/login', loginUser)
Router.get("/refresh-token", refreshTokenMiddleware, (req, res) => {
  res.status(200).json({ message: "Token refreshed" });
});

Router.get("/verify-token", authMiddleware, verifyTokenMiddleware);

export default Router