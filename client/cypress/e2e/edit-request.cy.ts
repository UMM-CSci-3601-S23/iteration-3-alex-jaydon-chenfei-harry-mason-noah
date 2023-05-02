import { Request } from 'src/app/requests/request';
import { EditRequestPage } from 'cypress/support/edit-request.po';

describe('Edit a request', ()=> {
  const page = new EditRequestPage();

  beforeEach(()=> {
    cy.setCookie('auth_token', 'TOKEN');
    cy.task('seed:database');
    page.navigateToRequest();
  });

  it('Should edit the request', ()=> {
    const request: Request = {
      _id: '588935f57546a2daea44de7c',
      itemType: 'food',
      foodType: 'meat',
      description: 'This is a test edit',
      priority: 0
    };

    page.navigateToDonor();

    page.selectItemType('food');
    page.selectFoodType('meat');
    page.filterDescription('This is a test edit');

    cy.get('.donor-list-description').should('contain.text', 'Ground beef');
    cy.get('.donor-list-itemType').should('contain.text', request.itemType);
    cy.get('.donor-list-foodType').should('contain.text', request.foodType);
  });

});
