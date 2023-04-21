import { Request } from 'src/app/requests/request';
import { NewRequestPage } from '../support/new-client-request.po';
import { NewVolunteerRequestPage } from '../support/new-volunteer-request.po';

describe('Add donor request', () => {
  const page = new NewRequestPage();

  beforeEach(() => {
    cy.setCookie('auth_token', 'TOKEN');
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    console.log(page.getTitle());
    page.getTitle().should('have.text',' PocketShelf: Request Form! ');
  });


  it('Should show error messages for invalid inputs', () => {
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=nameDescriptionError]').should('not.exist');
    // Just clicking the clientName field without entering anything should cause an error message
    page.getFormField('clientName').click().blur();
    cy.get('[data-test=nameDescriptionError]').should('exist').and('be.visible');
    // Some more tests for various invalid clientName inputs
    page.getFormField('clientName').type('M').blur();
    cy.get('[data-test=nameDescriptionError]').should('exist').and('be.visible');
    let veryLongString = 'This is a very long name that goes beyond the 50 character limit,This is a very long name that';
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    page.getFormField('clientName').clear().type(veryLongString).focus().blur();
    cy.get('[data-test=nameDescriptionError]').should('exist').and('be.visible');
    // Entering a valid clientName should remove the error.
    page.getFormField('clientName').clear().type('Old dutch chips').blur();
    cy.get('[data-test=nameDescriptionError]').should('not.exist');

  });

  describe('Adding a new request', () => {

    beforeEach(() => {
      cy.task('seed:database');
      cy.setCookie('auth_token', 'TOKEN');
    });

    it('Should go to the right page, and have the right info', () => {
      const request: Request = {
        _id: null,
        name: 'Testy McTesterton',
        selections:['hotSauce', 'shelfStableMilk', 'tomatoSoup'],
        description: 'Make sure all of the meat is organic',
      };
      page.newRequest(request);
      page.getSnackBar().should('contain', `Request successfully submitted`);
      // New URL should end in the 24 hex character Mongo ID of the newly added request
      cy.url()
        .should('match', /\/requests\/client$/)
        .should('not.match', /\/requests\/new$/);

      // The new request should have all the same attributes as we entered
      cy.visit('/requests/volunteer');
      cy.get('.volunteer-list-description').should('contain.text', request.description);
      // We should see the confirmation message at the bottom of the screen
    });
  });
});

describe('Add volunteer request', () => {
  const page = new NewVolunteerRequestPage();

  beforeEach(() => {
    cy.setCookie('auth_token', 'TOKEN');
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text',' PocketShelf: Request Form! ');
  });

  it('Should show error messages for invalid inputs', () => {
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=nameDescriptionError]').should('not.exist');
    // Just clicking the clientName field without entering anything should cause an error message
    page.getFormField('clientName').click().blur();
    cy.get('[data-test=nameDescriptionError]').should('exist').and('be.visible');
    // Some more tests for various invalid clientName inputs
    page.getFormField('clientName').type('M').blur();
    cy.get('[data-test=nameDescriptionError]').should('exist').and('be.visible');
    let veryLongString = 'This is a very long name that goes beyond the 50 character limit,This is a very long name that';
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    page.getFormField('clientName').clear().type(veryLongString).focus().blur();
    cy.get('[data-test=nameDescriptionError]').should('exist').and('be.visible');
    // Entering a valid clientName should remove the error.
    page.getFormField('clientName').clear().type('Old dutch chips').blur();
    cy.get('[data-test=nameDescriptionError]').should('not.exist');
  });

  describe('Adding a new request', () => {

   beforeEach(() => {
      cy.task('seed:database');
      cy.setCookie('auth_token', 'TOKEN');
    });

    it('Should go to the right page, and have the right info', () => {
      const request: Request = {
        _id: null,
        name: 'Testy McTesterton',
        selections:['hotSauce', 'shelfStableMilk', 'tomatoSoup'],
        description: 'Make sure all of the meat is organic',
      };
      page.newRequest(request);
      page.getSnackBar().should('contain', `Request successfully submitted`);
      // New URL should end in the 24 hex character Mongo ID of the newly added request
      cy.url()
        .should('match', /\/requests\/volunteer$/)
        .should('not.match', /\/requests\/new$/);

      // The new request should have all the same attributes as we entered
      cy.visit('/requests/volunteer');
      cy.get('.volunteer-list-description').should('not.contain.text', 'request.description');
      // We should see the confirmation message at the bottom of the screen
    });
  });
});
