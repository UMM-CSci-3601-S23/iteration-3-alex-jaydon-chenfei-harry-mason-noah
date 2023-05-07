import { Request } from 'src/app/requests/request';
import { EditRequestPage } from 'cypress/support/edit-request.po';

describe('Edit a request', ()=> {
  const page = new EditRequestPage();

  beforeEach(()=> {
    cy.setCookie('auth_token', 'TOKEN');
    cy.task('seed:database');
    page.navigateToEditRequest();
  });

  it('should save the changes after click the submitRevision', () => {
    page.getFormField('clientName').clear().type('Alex');
    page.getFormField('description').clear().type('For the purpose of testing');
    page.submitRevision();
    page.navigateToEditRequest();
    page.getFormField('clientName').should('have.value', 'Alex');
    page.getFormField('description').should('have.value', 'For the purpose of testing');
  });

  it('should change the word color to green when mat-checkbox is checked', () => {
    // Find the first mat-card-title and store its class
    cy.get('.itemName').first().as('firstItemName');
    // Check the color before checking the mat-checkbox (assuming it's red)
    cy.get('@firstItemName')
      .invoke('css', 'color')
      .should('eq', 'rgb(255, 0, 0)'); // Red in RGB
    // Find the first mat-checkbox and check it
    cy.get('mat-checkbox').first().click();
    // Check if the color of the mat-card-title changed to green
    cy.get('@firstItemName')
      .invoke('css', 'color')
      .should('eq', 'rgb(0, 128, 0)'); // Green in RGB
  });
});
