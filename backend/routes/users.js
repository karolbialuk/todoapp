import express from 'express'
import { getUser, getUserById } from '../controllers/users.js'

const router = express.Router()

router.get('', getUser)
router.get('/byid', getUserById)

export default router
