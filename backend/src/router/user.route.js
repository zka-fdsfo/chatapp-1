import express from 'express'

const Router =express.Router()
import { getAllUsers , changeCurrentUserinfo ,saveFcmToken , searchUsers } from '../controller/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import upload from '../middleware/multer.js'
Router.get('/allusers', authMiddleware, getAllUsers)
Router.put('/getFcmToken', authMiddleware, saveFcmToken)
Router.put('/changecurrentuserinfo', authMiddleware, upload.single('avatar'), changeCurrentUserinfo)
Router.get("/search", authMiddleware, searchUsers);
export default Router