import { DonorPledgePage } from '../support/donor-pledge.po';

const page = new DonorPledgePage();

describe('Pledge Form', () => {
  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    cy.setCookie('auth_token', 'TOKEN');
    page.navigateTo();
  });

  it('Has the correct title', () => {
    cy.get('.donor-pledge-title').contains('Pledge Form');
  });

  it('Should enable the confirm pledge button once all criteria are met', () => {
    page.confirmPledgeButton().should('be.disabled');
    page.getFormField('name').type('Alex',{ force: true });
    page.confirmPledgeButton().should('be.disabled');
    page.getFormField('amount').clear().type('3');
    page.confirmPledgeButton().should('be.disabled');
    page.setMatSelect('timeSlot','Monday');
    page.confirmPledgeButton().should('be.enabled');
    page.getFormField('comment').type('No comments');
  });


  it('Goes back to the donor page', () => {
    cy.get('[data-test="backtoDonorPageButton"]').click();
    // Replace with the expected URL after clicking the "BACK TO DONOR PAGE" button
    cy.url().should('include', '/expected-url-for-donor-page');
  });
});
