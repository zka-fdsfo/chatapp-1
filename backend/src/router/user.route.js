import express from 'express'

const Router =express.Router()
import { getAllUsers } from '../controller/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
Router.get('/allusers', authMiddleware, getAllUsers)
export default Router