import { expect, jest } from '@jest/globals';

const Ticket = jest.fn();
Ticket.findById = jest.fn(); //fonction fictive
Ticket.countDocuments = jest.fn(); //compte les tickets
Ticket.find = jest.fn(); 
Ticket.findByIdAndUpdate = jest.fn();


//remplace un vrai module
jest.unstable_mockModule('../../models/ticket.model.js', () => ({
    default: Ticket
}));

const {addTicket, getAllTickets, getTicketById, updateTicket} = await import('../../controllers/ticket.controller.js');


describe("Test du controller Ticket", () => { //regroupe les tests
    //supprime l'historique des appels
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("addTicket : créer un ticket correctement", async() => {
        //simulation de la requête
        const req = {
            body: {
                title: 'Demande de remboursement',
                description: 'Description du problème'
            },
            userId: "userId"
        };
        //simulation de la réponse
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        //simulation de next
        const next = jest.fn();

        //simulation du constructeur Ticket
        const saveMock = jest.fn().mockResolvedValue({_id: "12345"}); //fausse méthode save qui retourne le document

        //faux constructeur ticket
        Ticket.mockImplementation((data) => ({ //retourne new ticket
            ...data,
            _id: "12345",
            userId: "userId",
            save: saveMock 
        }));

        //exécution du controleur
        await addTicket(req, res, next);

        //vérification du constructeur
        expect(Ticket).toHaveBeenCalledWith({
            title: 'Demande de remboursement',
            description: 'Description du problème',
            userId: "userId"
        });

        //vérification sauvegarde
        expect(saveMock).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(201);

        //vérification du contenu de la réponse
        expect(res.json).toHaveBeenCalledWith({
            message: "Ticket envoyé",
            ticket: expect.objectContaining({ //vérifie ces propriétés
                title: 'Demande de remboursement',
                description: 'Description du problème',
                userId: "userId",
                _id: "12345"
            })
        });
});
    test("addTicket: erreur serveur", async() => {
        const req = {
            body:{},
            id: "user123"
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const next = jest.fn();

        //simule une erreur mongodb
        Ticket.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error("Erreur MongoDB"))
        }));

        await addTicket(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({message: "Erreur MongoDB"}));
    });

    test("getAllTickets : récupèrer tous les tickets", async () => {
    const req = {
        query: { //param page
            page: "1",
            limit: "10"
        },
        userId: "user123",
        userRole: "user"
    };

    const res = {
        json: jest.fn()
    };

    const next = jest.fn();

    const ticketsMock = [{
        _id: "ticket1",
        title: "Problème de connexion",
        status: "ouvert",
        userId: "user123"
    },
    {
        _id: "ticket2",
        title: "Erreur de paiment",
        status: "fermé",
        userId: "user123"
    }];

    //nombre total de tickets
    Ticket.countDocuments.mockResolvedValue(2);

    //chaînage 
    Ticket.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(), //retourne le même objet
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(ticketsMock) //envoi la réponse final
    });

    await getAllTickets(req, res, next);

    //vérifie le nombre de tickets de l'utilisateur
    expect(Ticket.countDocuments).toHaveBeenCalledWith({userId: "user123"});

    //vérifie la récupèration des tickets de l'utilisateur
    expect(Ticket.find).toHaveBeenCalledWith({userId: "user123"});

    //vérifie pagination
    expect(res.json).toHaveBeenCalledWith({
        data: ticketsMock,
        page: 1,
        totalPages: 1,
        totalItems: 2
    });
});
    test("getAllTickets: admin récupère tous les tickets", async() => {
        const req = {
            query: {}, //sans param
            userId: "user123",
            userRole: "admin"
        };
        const res = {
            json: jest.fn()
        };

        const next = jest.fn();

        //contient de base 5 tickets
        Ticket.countDocuments.mockResolvedValue(5);

        //simulation de la recherche
        Ticket.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([])
        });

        await getAllTickets(req, res, next);

        //vérifie que l'admin compte tous les tickets
        expect(Ticket.countDocuments).toHaveBeenCalledWith({});

        //vérifie la récupèration des tickets de l'admin
        expect(Ticket.find).toHaveBeenCalledWith({});

        expect(res.json).toHaveBeenCalledWith({
            data: [],
            page: 1,
            totalPages: 1,
            totalItems: 5
        });
    });
    test("getAllTickets: filtre par status", async() => {
        const req = {
            query: {
                status: "ouvert"
            },
            userId: "user123",
            userRole: "user"
        };
        const res = {
            json: jest.fn()
        };

        //contient de base 1 ticket
        Ticket.countDocuments.mockResolvedValue(1);

        Ticket.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([
                {title: "Problème de connexion", status: "ouvert"}
            ])
        });

        const next = jest.fn();

        await getAllTickets(req, res, next);

        //vérification filtre combinés
        expect(Ticket.find).toHaveBeenCalledWith({
            userId: "user123",
            status: "ouvert"
        });
    });
    test("getAllTickets: erreur serveur", async() => {
        const req = {
            body:{},
            id: "user123"
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const next = jest.fn();

        //simule une erreur mongodb
        Ticket.countDocuments.mockRejectedValue(new Error("Erreur base"));

        await getAllTickets(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({message: "Erreur base"}));
    });

    test("getTicketById : récupèrer ticket par ID", async () => {
        const req = {
            params: {
                id: "ticket123"
            },
            userId: "user123",
            userRole: "user"
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const next = jest.fn();

        const ticket = {
            _id: "ticket123",
            title: "Problème",
            userId: {
                toString: () => "user123" //convertit pour comparer
            }
        };

        //simule l'appelle du ticket
        Ticket.findById.mockResolvedValue(ticket);

        await getTicketById(req, res, next);

        //vérification de la recherche
        expect(Ticket.findById).toHaveBeenCalledWith("ticket123");

        expect(res.json).toHaveBeenCalledWith(ticket);

        expect(next).not.toHaveBeenCalled();
    });
    test("getTicketById : ticket introuvable", async () => {
        const req = {
            params: {
                id: "ticket123"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const next = jest.fn();

        //simule aucun ticket
        Ticket.findById.mockResolvedValue(null);

        await getTicketById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            message: "Ticket introuvable"
        });
    });
    test("getTicketById : accès refusé", async () => {
        const req = {
            params: {
                id: "ticket123"
            },
            userId: "user123",
            userRole: "user"
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const next = jest.fn();

        //simule le ticket retourné
        Ticket.findById.mockResolvedValue({
            userId: {
                toString: () => "autreUser"
            }
        });

        await getTicketById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            message: "Accès refusé"
        });
    });
    test("getTicketById : condition admin", async () => {
        const req = {
            params: {
                id: "ticket123"
            },
            userId: "user123",
            userRole: "admin"
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const next = jest.fn();

        const ticket = {
            _id: "ticket123",
            title: "Problème",
            userId: {
                toString: () => "autreUser"
            }
        };

        //retourne ce ticket
        Ticket.findById.mockResolvedValue(ticket);

        await getTicketById(req, res, next);

        expect(res.status).not.toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith(ticket);
    });
    test("updateTicket : modifier correctement un ticket", async () => {
        const req = {
            params: {
                id: "ticket123"
            },
            userId: "user123",
            userRole: "user",
            body: {
                title: "Nouveau titre",
                description: "Nouvelle description"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const next = jest.fn();

        //simule un ticket déjà existant
        const ticket = {
            _id: "ticket123",
            userId: {
                toString: () => "user123"
            },
            status: "ouvert"
        };

        const updatedTicket = {
            _id: "ticket123",
            title: "Nouveau titre",
            description: "Nouvelle description"
        };

        //simule la recherche du ticket
        Ticket.findById.mockResolvedValue(ticket);

        //simule la modification
        Ticket.findByIdAndUpdate.mockResolvedValue(updatedTicket);

        await updateTicket(req, res, next);

        //vérification de la recherche
        expect(Ticket.findById).toHaveBeenCalledWith("ticket123");

        //vérification de la modification
        expect(Ticket.findByIdAndUpdate).toHaveBeenCalledWith("ticket123", req.body, {
            runValidators: true, returnDocument: "after"
            //vérifie les règles du model + retour après modif
        });

        expect(res.json).toHaveBeenCalledWith({
            message: "Ticket modifié",
            ticket: updatedTicket
        });
    });
    test("updateTicket: utilisateur non propriétaire refusé", async() => {
        const req = {
            params: {
                id: "ticket123"
            },
            userId: "admin123",
            userRole: "user",
            body: {
                status: "fermé"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const next = jest.fn();

        //simule la réponse
        Ticket.findById.mockResolvedValue({
            _id:"ticket123",
            userId:{
                toString:()=> "user123"
            },
            status:"ouvert"
        });

        await updateTicket(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({message:"Accès refusé"});

        //vérification qu'il n'y a eu aucune modif
        expect(Ticket.findByIdAndUpdate).not.toHaveBeenCalled();

        expect(next).not.toHaveBeenCalled();
    });
    test("updateTicket: impossible de modifier un ticket fermé", async() => {
        const req = {
            params: {
                id: "ticket123"
            },
            userId: "user123",
            userRole: "user",
            body: {
                title: "Modification"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        Ticket.findById.mockResolvedValue({
            userId: {
                toString: () => "user123"
            },
            status: "fermé"
        });

        await updateTicket(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            message: "Le ticket ne peut être modifié"
        });

        expect(Ticket.findByIdAndUpdate).not.toHaveBeenCalled();
    });
        test("updateTicket: impossible de modifier un ticket en cours", async() => {
        const req = {
            params: {
                id: "ticket123"
            },
            userId: "user123",
            userRole: "user",
            body: {
                title: "Modification"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        Ticket.findById.mockResolvedValue({
            userId: {
                toString: () => "user123"
            },
            status: "en cours"
        });

        await updateTicket(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            message: "Le ticket ne peut être modifié"
        });

        expect(Ticket.findByIdAndUpdate).not.toHaveBeenCalled();
    });
    test("updateTicket : ticket introuvable", async() => {
        const req = {
            params: {
                id: "ticket123"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const next = jest.fn();

        //aucun ticket
        Ticket.findById.mockResolvedValue(null);

        await updateTicket(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({message: "Ticket introuvable"});

        expect(Ticket.findByIdAndUpdate).not.toHaveBeenCalled();

        expect(next).not.toHaveBeenCalled();
    });
    test("updateTicket: accès refusé", async() => {
        const req = {
            params: {
                id: "ticket123"
            },
            userId: "user123",
            userRole: "user",
            body: {
                title: "Modification"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        //simule le ticket trouvé
        Ticket.findById.mockResolvedValue({
            userId: {
                toString: () => "autreUser"
            }
        });

        await updateTicket(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({message: "Accès refusé"});

        expect(Ticket.findByIdAndUpdate).not.toHaveBeenCalled();

        expect(next).not.toHaveBeenCalled();
    });
    //si erreur serveur -> controleur ne plante pas
    test("updateTicket: erreur serveur", async() => {
        const req = {
            params: {
                id: "ticket123"
            }
        };

        const res = {
            json: jest.fn()
        };

        const next = jest.fn();

        //simule une erreur mongodb
        Ticket.findById.mockRejectedValue(new Error("Erreur MongoDB"));

        await updateTicket(req, res, next);

        expect(next).toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(expect.objectContaining({message: "Erreur MongoDB"}));
    });
});