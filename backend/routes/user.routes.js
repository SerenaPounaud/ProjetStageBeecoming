import express from 'express';
import {signin, signup} from "../controllers/user.controller.js";
import { validateUser } from '../middlewares/user.validation.js';
import {transformUser} from '../middlewares/transformUser.middleware.js';

const router = express.Router(); //envoi vers le bon controllers

router.post("/users/signup", validateUser, transformUser , signup);
router.post("/users/signin", signin);

export default router;