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
        let tickets;
        if (req.userRole === "admin"){
            tickets = await Ticket.find(); //récupère tous les tickets
        } else {
            tickets = await Ticket.find({userId :req.userId});
        }
        res.json(tickets);
    } catch (error) {
        next(error);
    }
};

export const getTicketById = async (req,res,next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket introuvable" });
        }
        //si pas admin + le ticket n'appartient pas à l'user connecté
        if (req.userRole !== "admin" && ticket.userId.toString() !== String(req.userId)) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        res.json(ticket);
    } catch (error) {
        next(error);
        
    }
};

export const updateTicket = async (req,res,next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket introuvable" });
        }

        if (req.userRole !== "admin" && ticket.userId.toString() !== String(req.userId)) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        const updated = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { runValidators: true, returnDocument: 'after' } //validation schéma
        );

        res.json({ message: "Ticket modifié", ticket: updated });

    } catch (error) {
        next(error);
    }
};