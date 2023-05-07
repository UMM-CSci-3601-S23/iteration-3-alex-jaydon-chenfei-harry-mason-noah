import { Request } from 'src/app/requests/request';

export class EditRequestPage {
  private readonly editRequestUrl = '/requests/volunteer/588935f5597715f06f3e8f6c';
  private readonly donorUrl = '/requests/donor';
  private readonly title = '.new-request-title';
  private readonly button1 = '[data-test=confirmNewRequestButton]';
  private readonly button2 = '[data-test=postRequestButton]';
  private readonly button3 = '[data-test=submitRevisionButton]';
  private readonly button4 = '[data-test=postRequestButton]';
  private readonly snackBar = '.mat-mdc-simple-snack-bar';
  private readonly descFieldName = 'description';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly dropDownSelector = `mat-option`;
  private readonly requestDescription = '[data-test=requestDescriptionInput]';
  private readonly requestListItemSelector = '.donor-nav-list .donor-list-item';

  navigateToEditRequest() {
    return cy.visit(this.editRequestUrl);
  }

  navigateToDonor() {
    return cy.visit(this.donorUrl);
  }

  capitalize(str: string){
    return str[0].toUpperCase() + str.substr(1);
  }

  newRequestButton() {
    return cy.get(this.button1);
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click()
      // Select and click the desired value from the resulting menu
      .get(`${this.dropDownSelector}[value="${value}"]`).click();
  }

  setMatSelect(formControlName: string, value: string){
    cy.get(`mat-select[formControlName=${formControlName}]`).click();
    cy.get('mat-option').contains(`${value}`).click();
  }

  getMatSelect(formControlName: string){
    return cy.get(`mat-select[formControlName=${formControlName}]`).click();
  }

  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
  }

  getSnackBar() {
    return cy.get(this.snackBar);
  }

  editRequest(newRequest: Request) {
    this.getFormField(this.descFieldName).click().clear().type(newRequest.description);
    return this.newRequestButton().click();
  }

  filterDescription(value: string) {
    cy.get(this.requestDescription).click().type(value);
  }


  submitRevision(){
    cy.get(this.button3).click();
  }
  post(){
    cy.get(this.button4).first().click();
  }

  getRequestListItems() {
    return cy.get(this.requestListItemSelector);
  }
}
