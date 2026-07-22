import { expect, jest } from '@jest/globals';

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
    default: bcryptMock
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
    default: jwtMock
}));

const {signup, signin, logout, me} = await import('../controllers/user.controller.js');
//import des mocks
const bcrypt = (await import('bcrypt')).default;
const jwt = (await import('jsonwebtoken')).default;


describe("Test du controller User", () => { //regroupe les tests
    //supprime l'historique des appels
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = "secret_test";
    });

    test("Signup : créer un utilisateur correctement", async() => {
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

    //simulation aucun utilisateur trouvé 
    User.findOne.mockResolvedValue(null);

    //simulation du hash
    bcrypt.hash.mockResolvedValue("password_hashé");

    //simulation du constructeur User
    const saveMock = jest.fn().mockResolvedValue(); //fausse méthode save qui réussit

    //faux constructeur user
    User.mockImplementation((data) => ({ //retourne new user
        ...data,
        _id: "12345",
        role: "user",
        save: saveMock 
    }));

    //simulation du token
    jwt.sign.mockReturnValue("fake_token");

    //exécution du controleur
    await signup(req, res, next);
        
    //vérification par email
    expect(User.findOne).toHaveBeenCalledWith({email: "jean@test.fr"});

    expect(bcrypt.hash).toHaveBeenCalledWith("azerty", 10);

    //vérifie l'ensemble des arguments dont le mot de passe stocké est bien le hash
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
            expiresIn: "3h"
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

    test("Signup : refuser un email déjà utilisé", async () => {
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

    test("Signin : refuser si email ou mot de passe incorrect", async () => {
    const req = {
        body: {
            email: "michel@test.com",
            password: 'qsdfghj'
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    const next = jest.fn();

    //simulation user existant
    User.findOne.mockResolvedValue({email: "michel@test.com", password: "hash_password"});

    //simulation d'un mauvais mot de passe
    bcrypt.compare.mockResolvedValue(false);

    await signin(req, res, next);

    //vérification email
    expect(User.findOne).toHaveBeenCalledWith({email: "michel@test.com"});

    //vérification mdp
    expect(bcrypt.compare).toHaveBeenCalledWith("qsdfghj", "hash_password");

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({message: "Email ou mot de passe incorrect"});

});

    test("Signin : connexion utilisateur", async() => {
    //simulation de la requête
    const req = {
    body: {
        email: 'jean@test.fr',
        password: 'azerty',
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

    //simulation utilisateur trouvé 
    User.findOne.mockResolvedValue({
        _id: "12345",
        email: "jean@test.fr",
        password: "hash_password",
        role: "user"
    });

    //simulation du compare
    bcrypt.compare.mockResolvedValue(true); //bcrypt = boolean

    //simulation du token
    jwt.sign.mockReturnValue("fake_token");

    //exécution du controleur
    await signin(req, res, next);
    
    //vérification
    expect(User.findOne).toHaveBeenCalledWith({email: "jean@test.fr"});

    //vérification token
    expect(jwt.sign).toHaveBeenCalledWith(
    {
        userId: "12345",
        role: "user"
    },
    "secret_test",
    {
        expiresIn: "3h"
    }
    );

    //vérification cookie
    expect(res.cookie).toHaveBeenCalledWith("token", "fake_token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 10800000
    });

    expect(res.status).toHaveBeenCalledWith(200);

    //vérification du contenu de la réponse
    expect(res.json).toHaveBeenCalledWith({
        message: "Connexion réussie",
        expiresAt: expect.any(Number)
    });
});

    test("Logout : deconnexion utilisateur", async() => {
    
    const req = {};
    //simulation de la réponse
    const res = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    //exécution du controleur
    await logout(req, res);

    //vérification suppression cookie
    expect(res.clearCookie).toHaveBeenCalledWith("token",  {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    expect(res.status).toHaveBeenCalledWith(200);

    //vérification du contenu de la réponse
    expect(res.json).toHaveBeenCalledWith({message: "Déconnecté"});
});

    test("Me : vérification utilisateur connecté", async() => {
    //simulation de la requête
    const req = {
        cookies: {token: "fake_token"}
    };
    //simulation de la réponse
    const res = {
        status: jest.fn().mockReturnThis(), //retourne l'objet courant
        json: jest.fn()
    };
    jwt.verify.mockReturnValue({
        userId: "12345",
        role: "user"
    });

    //exécution du controleur
    await me(req, res);
    
    //vérification token
    expect(jwt.verify).toHaveBeenCalledWith("fake_token", "secret_test");

    expect(res.status).toHaveBeenCalledWith(200);

    //vérification du contenu de la réponse
    expect(res.json).toHaveBeenCalledWith({authenticated: true, userId: "12345", role:"user"});
});

    test("Me : sans token", async() => {
    //simulation de la requête
    const req = {
        cookies: {}
    };
    //simulation de la réponse
    const res = {
        status: jest.fn().mockReturnThis(), //retourne l'objet courant
        json: jest.fn()
    };

    //exécution du controleur
    await me(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    //vérification du contenu de la réponse
    expect(res.json).toHaveBeenCalledWith({authenticated: false});
});

    test("Me : token invalide", async() => {
    //simulation de la requête
    const req = {
        cookies: {
            token: "bad_token"
        }
    };
    //simulation de la réponse
    const res = {
        status: jest.fn().mockReturnThis(), //retourne l'objet courant
        json: jest.fn()
    };
    //déclenche une erreur
    jwt.verify.mockImplementation(() => {
        throw new Error("Token invalide")
    });

    //exécution du controleur
    await me(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    //vérification du contenu de la réponse
    expect(res.json).toHaveBeenCalledWith({authenticated: false});
});
});