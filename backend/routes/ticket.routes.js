import express from 'express';
import { addTicket, getAllTickets, getTicketById, updateTicket } from '../controllers/ticket.controller.js';
import { validateTicket } from '../middlewares/ticket.validation.js';
import { transformTicket } from '../middlewares/transform.middleware.js';
import {verifyToken} from '../middlewares/auth.middleware.js';

const router = express.Router(); //envoi vers le bon controllers

router.post("/tickets", verifyToken, validateTicket, transformTicket, addTicket);
router.post("/tickets", verifyToken, validateTicket, transformTicket, addTicket);
router.get("/tickets", verifyToken, getAllTickets);
router.get("/tickets/:id", verifyToken, getTicketById);
router.put("/tickets/:id", verifyToken, validateTicket, transformTicket, updateTicket);

export default router;