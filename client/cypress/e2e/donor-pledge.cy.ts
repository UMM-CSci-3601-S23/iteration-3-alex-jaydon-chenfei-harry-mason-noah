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
    page.getFormField('amount').clear().type('800');
    page.confirmPledgeButton().should('be.disabled');
    page.setMatSelect('timeSlot','Monday');
    page.confirmPledgeButton().should('be.enabled');
    page.getFormField('comment').type('For the purpose of testing');
    page.confirmPledgeButton().click();
    // eslint-disable-next-line max-len
    // page.getSnackBar().should('contain', `Dear Alex, thank you so much for your generous pledge! We truly appreciate your support and can't
    // wait to welcome you on Monday.`,
    // { timeout: 10000});
    page.getBadgeAmount();
  });


  it('should navigate back to the donor page', () => {
   page.backtoDonorPageButton().click();
   cy.url().should('match', /^https?:\/\/(?:localhost:\d+|[^/]+)\/requests\/donor$/);
  });
});
