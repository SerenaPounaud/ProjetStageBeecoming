/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            createUser(email: string): Chainable<void>;
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
    cy.get(".signupButton").click();
});

export {};