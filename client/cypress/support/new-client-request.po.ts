import {Request} from 'src/app/requests/request';

export class NewRequestPage {

  private readonly url = '/requests/client';
  private readonly title = 'mat-card-title';
  private readonly button = '[data-cy="confirmAddRequestButton"]';
  private readonly snackBar = '.mat-mdc-simple-snack-bar';
  private readonly nameField = 'clientName';
  private readonly descFieldName = 'misc';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly dropDownSelector = `mat-option`;

  navigateTo() {
    return cy.visit(this.url);
  }

  getTitle() {
    return cy.get(this.title);
  }

  newRequestButton() {
    cy.get(`[data-cy=finalStep]`).click({force: true});
    return cy.get(this.button).click({force: true});
  }

  getMisc(){
    cy.get(`[data-cy=miscStep]`).click({force: true});
    return cy.get(`[data-cy=misc]`).click({force: true});
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

  getMatStep(className: string){
    return cy.get(`mat-step[class=${className}]`).click();
  }

  makeFirstSelection(stepClassName: string, checkBoxIndex: number){
    cy.get(`mat-step[class=${stepClassName}]`).click();
    cy.get(`section mat-checkbox:first`).click();
  }

  getFormField(fieldName: string) {
    return cy.get(`[data-cy=${fieldName}]`).click();
  }

  getSnackBar() {
    return cy.get(this.snackBar);
  }

  newRequest(newRequest: Request) {
    this.getFormField(this.nameField).type(newRequest.name);
    this.getMisc().type(newRequest.description, {force: true});
    if (newRequest.diaperSize){
      this.setMatSelect('diaperSize', newRequest.diaperSize);
    }
    return this.newRequestButton().click({force: true});
  }

}
