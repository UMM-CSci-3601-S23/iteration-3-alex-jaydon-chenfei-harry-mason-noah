export class RequestVolunteerPage {
  private readonly baseUrl = '/requests/volunteer';
  private readonly pageTitle = '[data-test=subheader]';
  private readonly requestListItemSelector = '.volunteer-nav-list .volunteer-list-item';
  private readonly requestDescriptionSelection = '.request-card-description';
  private readonly button1 = '[data-test=backtoHomepageButton]';
  private readonly button2 = '[data-test=expandViewButton]';
  private readonly button3 = '[data-test=sortbyPriorityButton]';
  private readonly button4 = '[data-test=backToVolunteerPageButton]';
  private readonly button5 = '[data-test=confirmNewRequestButton]';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly snackBar = '.mat-mdc-simple-snack-bar';
  private readonly deleteButton = '[data-test=deleteRequestButton]';
  private readonly editButton = '[data-test=editRequestButton]';
  private readonly archiveButton = '[data-test=archiveRequestButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getVolunteerViewTitle() {
    return cy.get(this.pageTitle);
  }

  getRequestListItems() {
    return cy.get(this.requestListItemSelector);
  }
  backtoHomepageButton(){
    return cy.get(this.button1);
  }

  expandViewButton(){
    return cy.get(this.button2) ;
  }

  sortbyPriorityButton(){
    return cy.get(this.button3) ;
  }

  backToVolunteerPageButton(){
    return cy.get(this.button4) ;
  }

  newRequestButton() {
    return cy.get(this.button5);
  }

  getRequestDescriptions(){
    return cy.get(this.requestDescriptionSelection);
  }

  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
  }

  setMatSelect(formControlName: string, value: string){
    cy.get(`mat-select[formControlName=${formControlName}]`).click();
    cy.get('mat-option').contains(`${value}`).click();
  }

  getSnackBar() {
    return cy.get(this.snackBar);
  }

  deleteRequest() {
    cy.get(this.deleteButton).first().click({ multiple: false });
  }

  editRequest() {
    cy.get(this.editButton).first().click();
  }

  archiveRequest() {
    cy.get(this.archiveButton).first().click();
  }
}
