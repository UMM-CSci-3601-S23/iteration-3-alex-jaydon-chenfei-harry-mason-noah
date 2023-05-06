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
    page.getDonorViewTitle().should('have.text', 'Items requested by the food shelf');
  });

  it('Should display 4 items', () => {
    page.getRequestListItems().should('have.length', 4);
  });


  //Tests with name filter
  it('Should return the correct elements with different inputs', () => {

    page.enterItemName().type('o');
    page.getRequestListItems().should('have.length', 2);
    page.getRequestListItems().each(($el) => {
      const itemNameElement = $el.find('.itemName');
      const itemName = itemNameElement.text().trim().toLowerCase();
      expect(itemName).to.contain('o');
    });

    page.enterItemName().clear();
    page.enterItemName().type('ou');
    page.getRequestListItems().should('have.length', 1);
    page.getRequestListItems().each(($el) => {
      const itemNameElement = $el.find('.itemName');
      const itemName = itemNameElement.text().trim().toLowerCase();
      expect(itemName).to.contain('ou');
    });

    });


  it('Should delete a request', () => {

    page.deleteRequest();

    page.getRequestListItems().should('have.length', 3);
  });

});
