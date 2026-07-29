describe("Authentification", () => {
beforeEach(() => {
    cy.request("DELETE", "/api/test/reset");
    cy.clearCookies();
    cy.clearLocalStorage();
});

    it("Créer un utilisateur", () => {
        cy.createUser("michel@gmail.fr");
        cy.url().should("include", "/"); //vérifie l'adresse actuelle => l'accueil
    });

    it("Refuse une inscription si champ manquant", () => {

        cy.visit("/sign-up");

        cy.get("#firstname").type("Michel");
        cy.get("#email").type("noname@gmail.fr");
        cy.get("#password").type("Azerty123");
        cy.get("#cgu").check();

        cy.get("button[type='submit']").should("be.disabled");
    });

    it("Active le bouton de validation si formulaire inscription valide", () => {

        cy.visit("/sign-up");

        cy.get("#name").type("Dupont");
        cy.get("#firstname").type("Michel");
        cy.get("#email").type("michelvalide@test.fr");
        cy.get("#password").type("Azerty123");
        cy.get("#cgu").check();

        cy.get("button[type='submit']").should("not.be.disabled");
    });

    it("Refuse un email déjà utilisé", () => {
        cy.createUser("duplicated@gmail.fr");

        cy.visit("/sign-up");

        cy.get("#name").type("Dupont");
        cy.get("#firstname").type("Michel");
        cy.get("#email").type("duplicated@gmail.fr");
        cy.get("#password").type("Azerty123");
        cy.get("#cgu").check();

        cy.on("window:alert", (text) => {
            expect(text).to.equal("Email déjà utilisé");
    });

        cy.get("button[type='submit']").click();
    });

    it("Refuse un email invalide", () => {

        cy.visit("/sign-up");

        cy.get("#email").type("michel@gmail");

        cy.get("button[type='submit']").should("be.disabled");
    });

    it("Refuse un mot de passe trop court", () => {

        cy.visit("/sign-up");

        cy.get("#name").type("Dupont");
        cy.get("#firstname").type("Michel");
        cy.get("#email").type("pass@gmail.fr");
        cy.get("#password").type("12io");
        cy.get("#cgu").check();
        
        cy.get("button[type='submit']").should("be.disabled");
    });

    it("Affiche les erreurs des champs obligatoires", () => {

        cy.visit("/sign-up");

        cy.get("#name").focus().blur(); //simule un clique + supprime le focus du champ
        cy.get("#firstname").focus().blur();
        cy.get("#email").focus().blur();
        cy.get("#password").focus().blur();
        cy.get("#cgu").check().uncheck();

        cy.get("#name-error").should("contain", "Ce champ est obligatoire");

        cy.get("#firstname-error").should("contain", "Ce champ est obligatoire");

        cy.get("#email-error").should("contain", "Ce champ est obligatoire");

        cy.get("#password-error").should("contain", "Ce champ est obligatoire");

        cy.get("#cgu-error").should("contain", "Veuillez accepter les conditions");
    });

    it("Crée un cookie JWT après inscription", () => {

        cy.visit("/sign-up");

        cy.get("#name").type("Dupont");
        cy.get("#firstname").type("Michel");
        cy.get("#email").type("cookiesignup@gmail.fr");
        cy.get("#password").type("Azerty123");
        cy.get("#cgu").check();

        cy.intercept("POST", "/api/users/signup").as("signup");

        cy.get("button[type='submit']").click();

        cy.wait("@signup")
            .its("response.statusCode")
            .should("eq", 201);

        cy.getCookie("token")
            .should("exist");

    });

    it("Connecte un utilisateur", () => {
        cy.createUser("connectedUser@gmail.fr");

        cy.login("connectedUser@gmail.fr");

        cy.on("window:alert", (text) => { //récupère le texte
            expect(text).to.equal("Connexion réussie");
        });
        cy.url().should("include", "/");
    });

    it("Refuser un mauvais mot de passe", () => {

        cy.createUser("michel2@gmail.fr");

        cy.on("window:alert", (text) => { //récupère le texte
            expect(text).to.equal("Email ou mot de passe incorrect");
        });
        cy.login("michel2@gmail.fr", "WrongPassword123");
    });

    it("Refuser un mauvais email", () => {

        cy.on("window:alert", (text) => {
            expect(text).to.equal("Email ou mot de passe incorrect");
        });
        cy.login("WrongEmail@gmail.fr");
    });

    it("Crée un cookie JWT après connexion", () => {

        cy.createUser("cookie@gmail.fr");

        cy.login("cookie@gmail.fr");

        cy.getCookie("token").should("exist"); //vérifie que le cookie existe
    });

    it("Empêche l'accès au dashboard sans connexion", () => {

        cy.visit("/dashboard");

        cy.url().should("include", "/sign-in");
    });

    it("Permet l'accès au dashboard après connexion", () => {

        cy.createUser("dashboard213@gmail.fr");

        cy.login("dashboard213@gmail.fr");

        cy.visit("/dashboard");
        cy.url().should("include", "/dashboard");
    });

    it("Déconnexion", () => {
        cy.createUser("logout@gmail.fr");

        cy.login("logout@gmail.fr");

        cy.get(".logout").click();
        cy.url().should("include", "/sign-in");
    });

    it("Supprime le cookie après déconnexion", () => {
        cy.createUser("logout2@gmail.fr");
        cy.clearCookies();

        cy.intercept("POST", "/api/users/signin").as("signin"); //intercept une req réseau et renomme
        cy.login("logout2@gmail.fr");

        cy.wait("@signin"); //attend que la req se termine
        cy.getCookie("token").should("exist");

        cy.intercept("POST", "/api/users/logout").as("logout");
        cy.get(".logout").click();
        cy.wait("@logout");

        cy.getCookie("token").should("not.exist");
    });

    it("Me : Retourne l'utilisateur après connexion", () => {
        cy.createUser("me@gmail.fr");

        cy.login("me@gmail.fr");

        //vérifie que l'utilisateur est bien reconnu comme connecté par le serveur
        cy.request("/api/users/me").its("body.authenticated").should("equal", true);
    });
});
