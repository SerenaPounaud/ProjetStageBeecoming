import Ticket from "../models/ticket.model.js";

export const addTicket = async (req,res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.json({message: "Ticket envoyé", ticket});
    } catch (error) {
        res.json({message: "Erreur ajout ticket", error})
    }
};

export const getAllTickets = async (req,res) => {
    try {
        const tickets = await Ticket.find(); 
        res.json(tickets);
    } catch (error) {
        res.json({message: "Erreur récupèration tickets", error})
    }
};

export const getTicketById = async (req,res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.json({message: "Ticket introuvable"})
        }
        res.json(ticket);
    } catch (error) {
        res.json({message: "Erreur récupèration tickets par id", error})
    }
};

export const updateTicket = async (req,res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!ticket) {
            return res.json({message: "Ticket introuvable"})
        }
        res.json({message: "Ticket modifié", ticket});
    } catch (error) {
        res.json({message: "Erreur modification", error})
    }
};