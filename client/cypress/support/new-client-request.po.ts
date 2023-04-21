import {Request} from 'src/app/requests/request';

export class NewRequestPage {

  private readonly url = '/requests/client';
  private readonly title = '.new-request-title';
  private readonly button = '[data-test=confirmNewRequestButton]';
  private readonly snackBar = '.mat-mdc-simple-snack-bar';
  // private readonly itemTypeFieldName = 'itemType';
  // private readonly foodTypeFieldName = 'foodType';
  private readonly descFieldName = 'description';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly dropDownSelector = `mat-option`;

  navigateTo() {
    return cy.visit(this.url);
  }

  getTitle() {
    return cy.get(this.title);
  }

  capitalize(str: string){
    return str[0].toUpperCase() + str.substr(1);
  }

  newRequestButton() {
    return cy.get(this.button);
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

  newRequest(newRequest: Request) {
    this.getFormField(this.descFieldName).type(newRequest.description);
    // this.setMatSelect('itemType', this.capitalize(newRequest.itemType));
    // if (newRequest.itemType === 'food'){
    //   this.setMatSelect('foodType', this.capitalize(newRequest.foodType));
    // }
    return this.newRequestButton().click();
  }

}
