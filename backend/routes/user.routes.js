import express from 'express';
import { signup, login } from "../controllers/user.controller.js";

const router = express.Router();


// Signup
router.post('/signup', signup);

// login
router.post('/login', login);



export default router;
