export class DonorPledgePage {
  private readonly pledgeUrl = '/requests/donor/558935f5de613130e931ffd5';
  private readonly button1 = '[data-test=confirmNewPledgeButton]';
  private readonly button2 = '[data-test=backtoDonorPageButton]';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly dropDownSelector = `mat-option`;
  private readonly badge = '[data-test=itemAmountBadge]';
  private readonly snackBar = '.mat-mdc-simple-snack-bar';

  navigateTo() {
    return cy.visit(this.pledgeUrl);
  }

  confirmPledgeButton() {
    return cy.get(this.button1);
  }

  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
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

  backtoDonorPageButton() {
    return cy.get(this.button2);
  }

  getBadgeAmount() {
    return cy.get(this.badge).first();
  }

  getSnackBar() {
    return cy.get(this.snackBar);
  }
};
