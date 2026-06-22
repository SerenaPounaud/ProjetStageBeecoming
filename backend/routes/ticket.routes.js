import express from 'express';
import { addTicket, getAllTickets, getTicketById, updateTicket } from '../controllers/ticket.controller.js';
import { validateTicket } from '../middlewares/ticket.validation.js';


const router = express.Router(); //envoi vers le bon controllers

router.post("/tickets", validateTicket, addTicket);
router.get("/tickets", getAllTickets);
router.get("/tickets/:id", getTicketById);
router.put("/tickets/:id", updateTicket);

export default router;