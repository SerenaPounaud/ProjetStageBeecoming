describe("Inscription utilisateur", () => {

    it("Créer un compte avec des informations valides", () => {

        cy.visit("http://localhost:4200/sign-up");
        cy.location("pathname").should("eq", "/sign-up");
        cy.get("#name")
            .type("Dupont");
        cy.get("#firstname")
            .type("Michel");
        cy.get("#email")
            .type("michel@gmail.fr");
        cy.get("#password")
            .type("Azerty123");
        cy.get("#cgu")
            .check();
        cy.get("button[type='submit']")
            .click();
        cy.contains("Utilisateur créé")
            .should("exist");
    });

});