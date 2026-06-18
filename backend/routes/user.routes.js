import express from 'express';
import {getHello} from "../controllers/user.controller.js";

const router = express.Router(); //envoi vers le bon controllers

router.get("/hello", getHello);

export default router;