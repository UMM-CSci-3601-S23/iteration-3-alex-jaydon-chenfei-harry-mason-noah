describe('Volunteer Page', () => {
  beforeEach(() => {
    // Log in as an admin or regular user before visiting the volunteer page
    cy.login('admin'); // or cy.login('user') for a regular user
    cy.visit('/volunteer');
  });


describe('Volunteer Page', () => {
  beforeEach(() => {
    // Add logic for logging in as an admin or regular user
    // You can use the client secret, refresh token, and client ID here to authenticate the user
    cy.visit('/volunteer');
  });

  it('displays the correct title', () => {
    cy.get('.volunteer-view-title').should('contain', 'Needs requested');
  });

  it('filters requests based on item type', () => {
    cy.get('[data-test="requestItemTypeSelect"]').select('Food');
    // Add assertions to check if the requests are filtered correctly
  });

  it('filters requests based on food type', () => {
    cy.get('[data-test="requestFoodTypeSelect"]').select('Dairy');
    // Add assertions to check if the requests are filtered correctly
  });

  it('edits a request', () => {
    cy.get('[data-test="editRequestButton"]').first().click();
    // Add assertions to check if the request edit page is displayed correctly
  });

  it('posts a request', () => {
    cy.get('[data-test="postRequestButton"]').first().click();
    // Add assertions to check if the request is posted correctly
  });

  it('deletes a request', () => {
    cy.get('[data-test="deleteRequestButton"]').first().click();
    // Add assertions to check if the request is deleted correctly
  });

  it('changes request priority', () => {
    cy.get('.input-field').within(() => {
      cy.get('mat-select').click();
      cy.get('mat-option[value="3"]').click();
    });
    // Add assertions to check if the request priority is updated correctly
  });
});
}
)
;
