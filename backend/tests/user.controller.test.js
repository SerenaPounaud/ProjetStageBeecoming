import {signup} from '../controllers/user.controller.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//crée une fausse version
jest.mock('../models/user.model.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');


describe("Test du controller signup", () => { //regroupe les tests
    test("devrait créer un utilisateur correctement", async() => {
    //simulation de la requête
    const req = {
    body: {
        name: 'Dupont',
        firstname:'Michel',
        email: 'jean@test.fr',
        password: 'azerty',
        cgu: true
    }
    };
    //simulation de la réponse
    const res = {
        status: jest.fn().mockReturnThis(), //retourne l'objet courant
        json: jest.fn(),
        cookie: jest.fn()
    };
    //simulation de next
    const next = jest.fn();

    //aucun utilisateur trouvé 
    User.findOne.mockResolvedValue(null);

    //simulation du hash
    bcrypt.hash.mockResolvedValue("password_hashé");

    //simulation du constructeur User
    const saveMock = jest.fn().mockResolvedValue(); //fausse méthode save

        User.mockImplementation(() => ({
            _id: "12345",
            role: "user",
            save: saveMock 
        }));

        //simulation du token
        jwt.sign.mockReturnValue("fake_token");

        //exécution du controleur
        await signup(req, res, next);
        
        //vérification
        expect(User.findOne).toHaveBeenCalledWith({email: "jean@test.fr"});

        expect(bcrypt.hash).toHaveBeenCalledWith("azerty", 10);

        expect(saveMock).toHaveBeenCalledWith();

        expect(jwt.sign).toHaveBeenCalledWith();

        expect(res.cookie).toHaveBeenCalledWith("token", "fake_token", expect.any(Object));

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message: "Utilisateur créer",
            expiresAt: expect.any(Number)
        });
    });

    test("devrait refuser un email déjà utilisé", async () => {
        const req = {
            body: {
                email: "test@test.com"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        //simulation user existant
        User.findOne.mockResolvedValue({email: "test@test.com"});

        await signup(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({message: "Email déjà utilisé"});
    });
});


