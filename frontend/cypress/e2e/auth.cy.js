describe("Authtification", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
    it("Créer un utilisateur", () => {

    cy.visit("/sign-up");

    cy.get("#name").type("Dupont");
    cy.get("#firstname").type("Michel");
    cy.get("#email").type("michel@gmail.fr");
    cy.get("#password").type("Azerty123");
    cy.get("#cgu").check();
    cy.on("window:alert", (text) => { //récupère le texte
        expect(text).to.equal("Inscription réussie");
    });
    cy.get(".signupButton").should("not.be.disabled").click();
    cy.url() //vérifie l'adresse actuel
        .should("eq", "http://localhost:4200/");
    });

    it("Connecte un utilisateur", () => {

        // Création du compte nécessaire pour le test
        cy.visit("/sign-up");

        cy.createUser("michel@gmail.fr");

        cy.clearCookies();

        cy.visit("/sign-in");

        cy.get("#email").type("michel@gmail.fr");
        cy.get("#password").type("Azerty123");
        cy.on("window:alert", (text) => { //récupère le texte
            expect(text).to.equal("Connexion réussie");
        });
        cy.get("button[type='submit']").should("not.be.disabled").click();
        cy.url().should("eq", "http://localhost:4200/");
    });

    it("Refuser un mauvais mot de passe", () => {
        // Création du compte nécessaire pour le test
        cy.visit("/sign-up");

        cy.get("#name").type("Dupont");
        cy.get("#firstname").type("Michel");
        cy.get("#email").type("michel2@gmail.fr");
        cy.get("#password").type("Azerty123");
        cy.get("#cgu").check();
        cy.get(".signupButton").click();
        cy.clearCookies();

        cy.visit("/sign-in");

        cy.get("#email").type("michel2@gmail.fr");
        cy.get("#password").type("WrongPassword123");
        cy.on("window:alert", (text) => { //récupère le texte
            expect(text).to.equal("Email ou mot de passe incorrect");
        });
        cy.get("button[type='submit']").should("not.be.disabled").click();
    });

    it("Empêche l'accès au dashboard sans connexion", () => {
        cy.visit("/dashboard");
        cy.url().should("include", "/sign-in");
    });

    it("Permet l'accès au dashboard après connexion", () => {

        cy.createUser("dashboard@gmail.fr");

        cy.visit("/sign-in");
        cy.get("#email").type("dashboard@gmail.fr");
        cy.get("#password").type("Azerty123");
        cy.get("button[type='submit']").click();

        cy.visit("/dashboard");
        cy.url().should("include", "/dashboard");
    });

    it("Déconnexion", () => {
        cy.createUser("logout@gmail.fr");

        cy.visit("/sign-in");
        cy.get("#email").type("logout@gmail.fr");
        cy.get("#password").type("Azerty123");
        cy.get("button[type='submit']").click();

        cy.get(".logout").click();
        cy.url().should("include", "/sign-in");
    });
});
