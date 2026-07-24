import request from "supertest"; //envoi req sans serveur
import mongoose from "mongoose"; //communique avec mongodb
import { MongoMemoryServer } from "mongodb-memory-server"; 
import app from "../../app.js";
import User from "../../models/user.model.js";
import { afterAll, beforeAll, beforeEach, describe, expect } from "@jest/globals";

let mongo; //serveur temporaire

beforeAll(async () => {
    process.env.JWT_SECRET = "secret_test";
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri()); //connexion au serveur
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

beforeEach(async () => {
    await User.deleteMany({}); //supprime tous les utilisateurs
});

describe("Tests d'intégration User", () => {
    test("Signup : créer un utilisateur", async() => {
        const response = await request(app).post("/api/users/signup").send({ //envoie au serveur
            name: "Dupont",
            firstname: "Michel",
            email: "jean@test.fr",
            password: "Azerty123",
            cgu: true
        });

        expect(response.status).toBe(200);

        expect(response.body.message).toBe("Utilisateur créé");

        //vérifie qu'il existe peu importe sa valeur
        expect(response.body.expiresAt).toBeDefined();

        expect(response.headers["set-cookie"]).toBeDefined();

        //vérification base mongodb
        const user = await User.findOne({email: "jean@test.fr"});

        //vérifie qu'il existe
        expect(user).not.toBeNull();
        expect(user.name).toBe("Dupont");

        //vérifie que le mdp n'est pas stocké en clair
        expect(user.password).not.toBe("Azerty123");
    });
    test("Signup : refuser un email déjà utilisé", async() => {
        await request(app).post("/api/users/signup").send({ //créer un utilisateur
            name: "Dupont",
            firstname: "Michel",
            email: "jean@test.fr",
            password: "Azerty123",
            cgu: true
        });
        const response = await request(app).post("/api/users/signup").send({ //envoie au serveur
            name: "Dupont",
            firstname: "Michel",
            email: "jean@test.fr",
            password: "Azerty123",
            cgu: true
        });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe("Email déjà utilisé");

        //cherche tous les utilisateurs
        const users = await User.find();

        //vérifie que le tableau ne contient qu'un utilisateur avec cet email
        expect(users).toHaveLength(1);
    });
    test("Signin : mauvais mot de passe", async() => {
        await request(app).post("/api/users/signup").send({ //créer un utilisateur
            name: "Dupont",
            firstname: "Michel",
            email: "jean@test.fr",
            password: "Azerty123",
            cgu: true
        });
        const response = await request(app).post("/api/users/signin").send({ //envoie au serveur
            email: "jean@test.fr",
            password: "mauvais"
        });

        expect(response.status).toBe(401);

        expect(response.body.message).toBe("Email ou mot de passe incorrect");
    });
    test("Signin : connexion réussie", async() => {
        await request(app).post("/api/users/signup").send({ //créer un utilisateur
            name: "Dupont",
            firstname: "Michel",
            email: "jean@test.fr",
            password: "Azerty123",
            cgu: true
        });
        const response = await request(app).post("/api/users/signin").send({ //envoie au serveur
            email: "jean@test.fr",
            password: "Azerty123"
        });

        expect(response.status).toBe(200);

        expect(response.body.message).toBe("Connexion réussie");

        expect(response.headers["set-cookie"]).toBeDefined();
    });
    test("Me : utilisateur connecté", async() => {
        await request(app).post("/api/users/signup").send({ //créer un utilisateur
            name: "Dupont",
            firstname: "Michel",
            email: "jean@test.fr",
            password: "Azerty123",
            cgu: true
        });
        const login = await request(app).post("/api/users/signin").send({ //simule une connexion
            email: "jean@test.fr",
            password: "Azerty123"
        });

        //récupère le cookie
        const cookie = login.headers["set-cookie"][0];

        //vérification user connecté + ajout cookie dans req
        const response = await request(app).get("/api/users/me").set("Cookie", cookie);

        expect(response.status).toBe(200);

        expect(response.body.authenticated).toBe(true);

        expect(response.body.userId).toBeDefined();

        expect(response.body.role).toBe("user");
    });
    test("Me : sans cookie", async() => {
        const response = await request(app).get("/api/users/me");

        expect(response.status).toBe(401);

        expect(response.body).toEqual({authenticated: false});
    });
    test("Me : token invalide", async() => {
        const response = await request(app).get("/api/users/me").set("Cookie", "token=faketoken");

        expect(response.status).toBe(401);

        expect(response.body).toEqual({authenticated: false});
    });
    test("Logout", async() => {
        const response = await request(app).post("/api/users/logout");

        //vérifie la suppression du cookie
        expect(response.headers["set-cookie"]).toBeDefined();

        //vérifie qu'il est vidé
        expect(response.headers["set-cookie"][0]).toContain("token=;");

        expect(response.status).toBe(200);

        expect(response.body.message).toBe("Déconnecté");
    });
});