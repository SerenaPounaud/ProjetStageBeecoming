import { jest } from '@jest/globals';

const User = jest.fn();
User.findOne = jest.fn(); //fonction fictive

const bcryptMock = {
    hash: jest.fn(),
    compare: jest.fn()
};

const jwtMock = {
    sign: jest.fn(),
    verify: jest.fn()
};

//remplace un vrai module
jest.unstable_mockModule('../models/user.model.js', () => ({
    default: User
}));
jest.unstable_mockModule('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
    default: bcryptMock
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
    default: jwtMock
}));

const {signup} = await import('../controllers/user.controller.js');
const bcrypt = (await import('bcrypt')).default;
const jwt = (await import('jsonwebtoken')).default;


describe("Test du controller signup", () => { //regroupe les tests
    //supprime l'historique des appels
    beforeEach(() => {
        jest.clearAllMocks();
    process.env.JWT_SECRET = "secret_test";
    });

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
    const saveMock = jest.fn().mockResolvedValue(); //fausse méthode save qui réussit

        User.mockImplementation((data) => ({
            ...data,
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

        //vérifie que le mot de passe stocké est bien le hash
        expect(User).toHaveBeenCalledWith({
            name: 'Dupont',
            firstname:'Michel',
            email: 'jean@test.fr',
            password: 'password_hashé',
            cgu: true
        });

        //vérification sauvegarde
        expect(saveMock).toHaveBeenCalled();

        //vérification token
        expect(jwt.sign).toHaveBeenCalledWith(
        {
            userId: "12345",
            role: "user"
        },
        "secret_test",
        {
            expiresIn: "1m"
        }
    );

        //vérification cookie
        expect(res.cookie).toHaveBeenCalledWith("token", "fake_token", expect.any(Object));

        expect(res.status).toHaveBeenCalledWith(200);

        //vérification du contenu de la réponse
        expect(res.json).toHaveBeenCalledWith({
            message: "Utilisateur créé",
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

        //vérifie qu'il n'a pas été créé
        expect(User).not.toHaveBeenCalled();

        //vérifie que le mot de passe n'a pas été hashé
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });
});