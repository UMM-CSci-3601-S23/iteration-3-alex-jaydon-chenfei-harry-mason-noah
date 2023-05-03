// Load the global Cypress types
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to log in a user.
     *
     * @param userType - The type of user to log in ('admin' or 'user')
     */
    login(userType: 'admin' | 'user'): Chainable<any>;
  }
}
