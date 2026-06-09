import express from 'express'

const Router =express.Router()
import { getAllUsers , changeCurrentUserinfo } from '../controller/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import upload from '../middleware/multer.js'
Router.get('/allusers', authMiddleware, getAllUsers)
Router.put('/changecurrentuserinfo', authMiddleware, upload.single('avatar'), changeCurrentUserinfo)
export default Router