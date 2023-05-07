import { RequestVolunteerPage } from '../support/request-volunteer.po';

const page = new RequestVolunteerPage();

describe('Volunteer View', () => {
  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    cy.setCookie('auth_token', 'TOKEN');
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getVolunteerViewTitle().should('have.text', 'Current Requests');
  });


  it('Should display 6 requests when viewing current requests', () => {
    page.getRequestListItems().should('have.length', 6);
  });

  it('Should display 5 requests when viewing archived requests', () => {

  });

  it('Should sort requests by priority', () => {

  });

  it('Should be able to click Archive button', () => {
    page.archiveRequest();

    page.getRequestListItems().should('have.length', 5);
  });

  it('Should be able to click EditRequest button', () => {
    page.editRequest();

    cy.url().should('match', /^https?:\/\/(?:localhost:\d+|[^/]+)\/requests\/volunteer\/[a-f0-9]{24}$/);
  });

  it('Should be able to click Delete button', () => {
    page.deleteRequest();

    page.getRequestListItems().should('have.length', 4);
  });
});
