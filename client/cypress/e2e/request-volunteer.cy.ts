import { RequestVolunteerPage } from '../support/request-volunteer.po';

const page = new RequestVolunteerPage();

describe('Volunteer View', () => {
  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getVolunteerViewTitle().should('have.text', 'Needs requested');
  });

  it('should be able to navigate back to homepage', () => {
    // Ability to navigate to Home
    page.backtoHomepageButton().click();
    cy.url().should('match', /^https?:\/\/[^/]+\/?$/);
  });

  it('Should display 7 requests with telling names of the clients', () => {
    page.getRequestListItems().should('have.length', 7);

    page.getRequestListItems().each(el => {
      cy.get('.null-name').should('contain.text', 'No name');
    });
  });

  //Tests with item filters
  it('Should return the correct elements with item filter food', () => {
    page.selectItemType('food');

    page.getRequestListItems().should('have.length', 5);

    page.getRequestListItems().each(el => {
      cy.wrap(el).find('.request-card-title').should('contain.text', 'food');
    });
  });

  it('Should return the correct elements with item filter toiletries', () => {
    page.selectItemType('toiletries');

    page.getRequestListItems().should('have.length', 1);

    page.getRequestListItems().each($list => {
      cy.wrap($list).find('.request-card-title').should('contain.text', 'toiletries');
    });
  });

  it('Should return the correct elements with item filter other', () => {
    page.selectItemType('other');
    page.getRequestListItems().should('have.length', 1);
  });

  //Tests with food filters
  it('Should return the correct elements with item filter food and food filter dairy', () => {
    page.selectItemType('food');
    page.selectFoodType('dairy');

    page.getRequestListItems().should('have.length', 1);

    page.getRequestListItems().each(el => {
      cy.wrap(el).find('.request-card-title').should('contain.text', 'food');
    });
  });

  it('Should return the correct elements with item filter food and food filter meat', () => {
    page.selectItemType('food');
    page.selectFoodType('meat');

    page.getRequestListItems().should('have.length', 1);

    page.getRequestListItems().each(el => {
      cy.wrap(el).find('.request-card-title').should('contain.text', 'food');
    });
  });

  //Tests with the button *EXPAND*
  it('Should return the correct elements before and after clicking the button *EXPAND*', () => {

    page.selectItemType('food');
    page.selectFoodType('vegetable');

    page.getRequestListItems().should('have.length', 1);

    page.getRequestDescriptions().each(($el) => {
      const maxLength = 42;
      const description = $el.text().slice(0, maxLength);
      expect(description.length).to.be.at.least(5);
    });

    page.expandViewButton().click();

    page.getRequestDescriptions().each(($el) => {
      const maxLength = 42;
      const description = $el.text();
      expect(description.length).to.be.at.least(maxLength);
    });
  });

  //Tests with the functionality of priority
  it('should sort requests by priority', () => {
    // Set priority values for each request card
    cy.get('.priority-request-card').each(($card) => {
      const priorityValue = getRandomInteger(1, 5);
      cy.wrap($card).find('[data-test="requestPriorityInput"]').clear().type(priorityValue);
    });

    // Click on the sort button
    page.sortbyPriorityButton().click();

    // Test that the first request card has the highest priority value
    cy.get('.priority-request-card').first().find('[data-test="requestPriorityInput"]').then(($firstCardInput) => {
      const highestPriority = 5;

      cy.get('.priority-request-card').each(($card) => {
        cy.wrap($card).find('[data-test="requestPriorityInput"]').then(($input) => {
          const currentPriority = parseInt($input.val().toString(), 10);
          expect(currentPriority).to.be.at.most(highestPriority);
        });
      });
    });

    const initialCardDescriptions = [];

    // Save the texts of the initial request cards
    page.getRequestListItems().each(($card) => {
      const description = $card.find('p').text();
      initialCardDescriptions.push(description);
    });

    cy.get('.priority-request-card').each(($sortedCard, index) => {
      const sortedCardDescription = $sortedCard.find('p').text();
      expect(sortedCardDescription).to.equal(initialCardDescriptions[index]);
    });
  });

  //Tests with the functionality of editing request
  it('should edit requests', () => {
    page.getRequestListItems().then(($cards) => {
      const $card = $cards[getRandomInteger(0, 6)];
      cy.wrap($card).find('mat-icon:contains("more_vert")').click({ force: true });
      cy.wrap($card).get('[data-test="editRequestButton"]').click();

      page.newRequestButton().should('be.disabled');
      page.getFormField('name').type('KK');
      page.newRequestButton().should('be.disabled');
      page.setMatSelect('itemType','Food');
      page.newRequestButton().should('be.disabled');
      page.getFormField('description').type('KK TEST EDIT REQUEST KK');
      page.newRequestButton().should('be.enabled');

      page.newRequestButton().click();
      page.getSnackBar().should('contain', `Request successfully submitted`);
      //page.backToVolunteerPageButton().click();

      cy.get('.request-card-title').should('contain.text', 'food');
      cy.get('.request-card-description').should('contain.text', 'KK TEST EDIT REQUEST KK');
      cy.get('.volunteer-card-name').should('contain.text', 'Requested by ' + 'KK');

      cy.visit('/requests/donor');
      cy.get('.request-card-title').should('contain.text', 'food');
      cy.get('.request-card-description').should('contain.text', 'KK TEST EDIT REQUEST KK');
      cy.get('.donor-card-name').should('contain.text', 'Requested by Anonymous');
    });
  });
});

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
