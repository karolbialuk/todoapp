import express from 'express'
import {
  addPost,
  getTasks,
  deleteTask,
  updateTask,
  getSingleTask,
  editTask,
  getTodayTasks,
  getAllUserTasks,
  updateUsersTask,
  getSingleNewTask,
} from '../controllers/tasks.js'

const router = express.Router()

router.post('/add', addPost)
router.put('/edit', editTask)
router.put('/update', updateTask)
router.get('/singletask', getSingleTask)
router.get('/singlenewtask', getSingleNewTask)
router.put('/singletask', updateUsersTask)
router.get('/todaytasks', getTodayTasks)
router.get('/alltasks', getAllUserTasks)
router.get('', getTasks)
router.delete('', deleteTask)

export default router
