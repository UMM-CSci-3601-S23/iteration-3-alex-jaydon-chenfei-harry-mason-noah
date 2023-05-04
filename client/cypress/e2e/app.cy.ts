import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {
  beforeEach(() => {
    cy.setCookie('auth_token', 'TOKEN');
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getAppTitle().should('contain', 'PocketShelf 3.0');
  });

  it('The header navigation should navigate to the right page respectively', () => {

    page.backtoDonorpageButton().click();
    cy.url().should('match', /^https?:\/\/(?:localhost:\d+|[^/]+)\/(?:[\w-]+\/?)*$/);

    page.backtoClientpageButton().click();
    cy.url().should('match', /^https?:\/\/(?:localhost:\d+|[^/]+)\/(?:[\w-]+\/?)*$/);

    page.backtoVolunteerpageButton().click();
    cy.url().should('match', /^https?:\/\/(?:localhost:\d+|[^/]+)\/(?:[\w-]+\/?)*$/);

    page.backtoHomepageButton().click();
    cy.url().should('match', /^https?:\/\/(?:localhost:\d+|[^/]+)\/(?:[\w-]+\/?)*$/);
  });

});
