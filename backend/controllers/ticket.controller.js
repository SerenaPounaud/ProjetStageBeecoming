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

//tickets + pagination + filtrage + gestion des droits
export const getAllTickets = async (req,res,next) => {
    try {
        const page = parseInt(req.query?.page) || 1; //récupère param page convertit en entier
        const limit = parseInt(req.query?.limit) || 10;
        const skip = (page - 1) * limit; //calcul le nombre de document à ignorer
        const status = req.query.status; //récupère le statut
        let filter = {}; //condition de filtrage

        if (req.userRole !== "admin"){
            filter.userId = req.userId; 
        } 
        if (status && status !== "tous"){
            filter.status = status;
        }
        const total = await Ticket.countDocuments(filter); //compte le nb de documents correspondant au filtre
        const tickets = await Ticket.find(filter)
            .populate("userId", "name firstname")
            .skip(skip) //ignore les précédents documents
            .limit(limit); //limite le nb de résultats retournés

        res.json({data: tickets, page, totalPages: Math.ceil(total/limit), totalItems: total});
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