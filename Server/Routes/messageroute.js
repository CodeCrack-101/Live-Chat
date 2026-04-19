import express from 'express'
import protectroute from '../Middleware/auth.js';
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage
} from '../Controller/messagecontroller.js'

const messagerouter = express.Router()

// ✅ Specific routes FIRST
messagerouter.get('/users', protectroute, getUsersForSidebar)
messagerouter.get('/mark/:id', protectroute, markMessageAsSeen)
messagerouter.post('/send/:id', protectroute, sendMessage)

// ✅ Dynamic route LAST
messagerouter.get('/:id', protectroute, getMessages)

export default messagerouter