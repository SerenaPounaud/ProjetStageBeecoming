/// <reference types="cypress" />
//permet d'utiliser les définitions de types de Cypress

declare global {
    namespace Cypress {
        interface Chainable {
            createUser(email: string): Chainable<void>; //commande qui retourne un objet de type chaînage
            login(email: string, password?: string): Chainable<void>;
        }
    }
}

Cypress.Commands.add("createUser", (email: string) => {
    cy.visit("/sign-up");

    cy.get("#name").type("Dupont");
    cy.get("#firstname").type("Michel");
    cy.get("#email").type(email);
    cy.get("#password").type("Azerty123");
    cy.get("#cgu").check();

    cy.get("button[type='submit']").should("not.be.disabled").click();
});

Cypress.Commands.add("login", (email: string, password = "Azerty123") => {
    cy.visit("/sign-in");

    cy.get("#email").type(email);
    cy.get("#password").type(password);

    cy.intercept("POST", "/api/users/signin").as("signin");
    
    cy.get("button[type='submit']").should("not.be.disabled").click();

    cy.wait("@signin");
});

export {};