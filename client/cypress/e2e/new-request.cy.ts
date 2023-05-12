import { NewRequestPage } from '../support/new-request.po';

describe('Add request', () => {
  const page = new NewRequestPage();
  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text',' PocketShelf: Request Form! ');
  });

  it('Should enable the confirm addRequest button once all criteria are met', () => {
    page.newRequestButton().should('be.disabled');
    page.getFormField('clientName').type('Alex');
    page.newRequestButton().should('be.disabled');
    // page.getFormField('clientHouseholdSize').type('3',{force: true});
    // page.newRequestButton().should('be.disabled');
  });

});
