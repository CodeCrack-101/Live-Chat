import express from 'express';
import { login, signup, authenticate, updateProfile } from '../Controller/Usercontroller.js';
import protectroute from '../Middleware/auth.js'; // ✅ correct import

const userrouter = express.Router();

// Public Routes
userrouter.post('/signup', signup);
userrouter.post('/login', login);

// Protected Routes
userrouter.put('/updateprofile', protectroute, updateProfile);
userrouter.get('/check', protectroute, authenticate);

export default userrouter;
