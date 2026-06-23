import Ticket from "../models/ticket.model.js";

export const addTicket = async (req,res,next) => {
    try {
        const ticket = new Ticket({
            title: req.body.title,
            description: req.body.description,
            userId: req.userId
        });
        await ticket.save();
        res.json({message: "Ticket envoyé", ticket});
    } catch (error) {
        next(error);
    }
};

export const getAllTickets = async (req,res,next) => {
    try {
        const tickets = await Ticket.find(); 
        res.json(tickets);
    } catch (error) {
        next(error);
    }
};

export const getTicketById = async (req,res,next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.json({message: "Ticket introuvable"})
        }
        res.json(ticket);
    } catch (error) {
        next(error);
    }
};

export const updateTicket = async (req,res,next) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});
        if (!ticket) {
            return res.json({message: "Ticket introuvable"})
        }
        res.json({message: "Ticket modifié", ticket});
    } catch (error) {
        next(error);
    }
};