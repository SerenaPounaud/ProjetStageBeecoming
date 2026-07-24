import request from "supertest"; //envoi req sans serveur
import mongoose from "mongoose"; //communique avec mongodb
import { MongoMemoryServer } from "mongodb-memory-server"; 
import app from "../../app.js";
import User from "../../models/user.model.js";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "@jest/globals";
import bcrypt from "bcrypt";

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

afterEach(async () => {
    await User.deleteMany({}); //supprime tous les utilisateurs
});

describe("Auth fonctionnel", () => {
    test("POST signup créer un utilisateur", async() => {
        const response = await request(app).post("/api/users/signup").send({
            name: "Dupont",
            firstname: "Michel",
            email: "michel@gmail.fr",
            password: "Azerty123",
            cgu: true
        });

        expect(response.status).toBe(200);

        expect(response.body.message).toBe("Utilisateur créé");

        const user = await User.findOne({email: "michel@gmail.fr"});

        //vérifie que le hash correspond
        const match = await bcrypt.compare("Azerty123", user.password);
        expect(match).toBe(true);

        //vérifie le cookie
        expect(response.headers["set-cookie"]).toBeDefined(); //vérifie que le headers existe
        expect(response.headers["set-cookie"][0]).toContain("token=");
        expect(response.headers["set-cookie"][0]).toContain("HttpOnly");

        //vérifie qu'il est bien enregistré
        expect(user).not.toBeNull();
        expect(user.name).toBe("Dupont");
        expect(user.firstname).toBe("Michel");
        expect(user.email).toBe("michel@gmail.fr");
        expect(user.cgu).toBe(true);
    });
});
