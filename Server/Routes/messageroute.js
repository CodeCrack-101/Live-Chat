import express from 'express'
import { protectroute } from '../Middleware/auth.js'
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../Controller/messagecontroller.js'

const messagerouter = express.Router()

messagerouter.get('/users', protectroute, getUsersForSidebar)
messagerouter.get('/:id', protectroute, getMessages)

messagerouter.get('/mark/:id', protectroute, markMessageAsSeen)
messagerouter.post('/send/:id',protectroute,sendMessage)

export default messagerouter