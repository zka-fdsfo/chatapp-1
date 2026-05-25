import express from 'express'

const Router =express.Router()
import { registerUser, loginUser ,verifyTokenMiddleware} from '../controller/auth.controller.js'
import { authMiddleware,refreshTokenMiddleware} from '../middleware/auth.middleware.js'
Router.post('/register', registerUser)
Router.post('/login', loginUser)
Router.get(
  "/refresh-token",
  refreshTokenMiddleware
);

Router.get("/verify-token", authMiddleware, verifyTokenMiddleware);

export default Router