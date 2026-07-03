import express from 'express';
import {signin, signup} from "../controllers/user.controller.js";
import { validateUser } from '../middlewares/user.validation.js';
import {transformUser} from '../middlewares/transformUser.middleware.js';
import { loginLimiter } from '../middlewares/rateLimit.middleware.js';
import { sanitizeBody } from '../middlewares/sanitizeBody.middleware.js'; //évite injection nosql

const router = express.Router(); //envoi vers le bon controllers

router.post("/users/signup", sanitizeBody(["name", "firstname", "email", "password", "cgu"]), validateUser, transformUser , signup);
router.post("/users/signin", sanitizeBody(["email", "password"]), loginLimiter, signin);

export default router;