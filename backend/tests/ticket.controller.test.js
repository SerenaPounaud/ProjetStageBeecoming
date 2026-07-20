import { expect, jest } from '@jest/globals';

const Ticket = jest.fn();
Ticket.findById = jest.fn(); //fonction fictive
Ticket.countDocuments = jest.fn(); //compte les tickets
Ticket.find = jest.fn(); 
Ticket.populate = jest.fn();
Ticket.skip = jest.fn(); //pagination
Ticket.limit = jest.fn();
Ticket.findByIdAndUpdate = jest.fn();


//remplace un vrai module
jest.unstable_mockModule('../models/ticket.model.js', () => ({
    default: Ticket
}));

const {addTicket, getAllTickets, getTicketById, updateTicket} = await import('../controllers/ticket.controller.js');


describe("Test du controller Ticket", () => { //regroupe les tests
    //supprime l'historique des appels
    beforeEach(() => {
        jest.clearAllMocks();
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

    //vérifie l'ensemble des arguments
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
        ticket: expect.objectContaining({
            title: 'Demande de remboursement',
            description: 'Description du problème',
            userId: "userId",
            _id: "12345"
        })
    });
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

    //chainage 
    Ticket.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(ticketsMock)
    });

    await getAllTickets(req, res, next);

    //vérifie le filtre utilisateur
    expect(Ticket.countDocuments).toHaveBeenCalledWith({userId: "user123"});

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
            query: {},
            userId: "user123",
            userRole: "admin"
        };
        const res = {
            json: jest.fn()
        };

        const next = jest.fn();

        Ticket.countDocuments.mockResolvedValue(5);

        Ticket.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([])
        });

        await getAllTickets(req, res, next);

        expect(Ticket.countDocuments).toHaveBeenCalledWith({});

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

        Ticket.countDocuments.mockResolvedValue(1);

        Ticket.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([{title: "Ticket ouvert"}])
        });

        const next = jest.fn();

        await getAllTickets(req, res, next);

        expect(Ticket.find).toHaveBeenCalledWith({
            userId: "user123",
            status: "ouvert"
        });
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
                toString: () => "user123"
            }
        };

        Ticket.findById.mockReturnValue(ticket);

        await getTicketById(req, res, next);

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

        const ticket = {
            _id: "ticket123",
            userId: {
                toString: () => "user123"
            }
        };

        const updatedTicket = {
            _id: "ticket123",
            title: "Nouveau titre",
            description: "Nouvelle description"
        };

        Ticket.findById.mockResolvedValue(ticket);

        Ticket.findByIdAndUpdate.mockResolvedValue(updatedTicket);

        await updateTicket(req, res, next);

        expect(Ticket.findById).toHaveBeenCalledWith("ticket123");

        expect(Ticket.findByIdAndUpdate).toHaveBeenCalledWith("ticket123", req.body, {
            runValidators: true, returnDocument: "after"
        });

        expect(res.json).toHaveBeenCalledWith({
            message: "Ticket modifié",
            ticket: updatedTicket
        });
    });
        test("updateTicket: admin peut modifier un ticket", async() => {
            const req = {
                params: {
                    id: "ticket123"
                },
                userId: "admin123",
                userRole: "admin",
                body: {
                    status: "fermé"
                }
            };

            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            const next = jest.fn();

            const ticket = {
                _id: "ticket123",
                userId: {
                    toString: () => "autreUser"
                }
            };

            Ticket.findById.mockResolvedValue(ticket);

            Ticket.findByIdAndUpdate.mockResolvedValue({status: "fermé"});

            await updateTicket(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                message: "Ticket modifié",
                ticket: {
                    status: "fermé"
                }
            });
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

            Ticket.findById.mockResolvedValue(null);

            await updateTicket(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);

            expect(res.json).toHaveBeenCalledWith({
                message: "Ticket introuvable"
            });
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

            Ticket.findById.mockResolvedValue({
                userId: {
                    toString: () => "autreUser"
                }
            });

            await updateTicket(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);

            expect(res.json).toHaveBeenCalledWith({message: "Accès refusé"});

            expect(Ticket.findByIdAndUpdate).not.toHaveBeenCalled();
        });
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

            Ticket.findById.mockRejectedValue(new Error("Erreur MongoDB"));

            await updateTicket(req, res, next);

            expect(next).toHaveBeenCalledWith(new Error("Erreur MongoDB"));
        });
});