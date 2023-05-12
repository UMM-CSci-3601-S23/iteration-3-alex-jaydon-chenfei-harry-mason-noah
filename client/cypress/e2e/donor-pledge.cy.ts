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
    // page.getSnackBar().should('contain', `Dear Alex, thank you so much for your generous pledge! `,{ timeout: 20000});
    // page.getSnackBar().should('contain', `We truly appreciate your support and can\'t wait to welcome you on Monday.`,{ timeout: 20000});
    page.getBadgeAmount().should('contain','100');
  });

  it('Should be unable to see the requesteditem when we have enough pledges', () => {
    page.confirmPledgeButton().should('be.disabled');
    page.getFormField('name').type('Jay',{ force: true });
    page.confirmPledgeButton().should('be.disabled');
    page.getFormField('amount').clear().type('100');
    page.confirmPledgeButton().should('be.disabled');
    page.setMatSelect('timeSlot','Tuesday');
    page.confirmPledgeButton().should('be.enabled');
    page.getFormField('comment').type('For the purpose of testing2');
    page.confirmPledgeButton().click();
    page.getRequestListItems().each(($el) => {
      const itemNameElement = $el.find('.itemName');
      const itemName = itemNameElement.text().trim().toLowerCase();
      expect(itemName).to.not.contain('tomato soup');
    });
  });


  it('should navigate back to the donor page', () => {
   page.backtoDonorPageButton().click();
   cy.url().should('match', /^https?:\/\/(?:localhost:\d+|[^/]+)\/requests\/donor$/);
  });
});
