import { RequestDonorPage } from '../support/request-donor.po';

const page = new RequestDonorPage();

describe('Donor View', () => {
  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    cy.setCookie('auth_token', 'TOKEN');
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getDonorViewTitle().should('have.text', 'Needs requested');
  });

  it('Should display 4 items', () => {
    page.getRequestListItems().should('have.length', 4);
  });


  //Tests with name filter
  it('Should return the correct elements with different inputs', () => {

    page.getRequestListItems().should('have.length', 1);

    page.getRequestListItems().each(el => {
      cy.wrap(el).find('.donor-list-itemType').should('contain.text', 'food');
    });

    page.getRequestListItems().each(el => {
    //   cy.wrap(el).find('.donor-list-foodType').should('contain.text', 'dairy');
    });
  });

  it('Should delete a request', () => {

    page.deleteRequest();
  });

});
