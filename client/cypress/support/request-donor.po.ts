export class RequestDonorPage {
  private readonly baseUrl = '/requests/donor';
  private readonly pageTitle = '.donor-view-title';
  private readonly dropdownOptionSelector = `mat-option`;
  private readonly requestListItemSelector = '.donor-nav-list .donor-list-item';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly descFieldName = 'description';
  private readonly deleteButton = '[data-test=deleteRequestButton]';
  private readonly pledgeButton = '[data-test=pledgeRequestButton]';
  private readonly nameFilter = '[data-test=requestItemInput]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getDonorViewTitle() {
    return cy.get(this.pageTitle);
  }

  getRequestListItems() {
    return cy.get(this.requestListItemSelector);
  }


  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
  }

  deleteRequest() {
    cy.get(this.deleteButton).first().click({ multiple: false });
  }

  enterItemName() {
    return cy.get(this.nameFilter);
  }

  pledgeRequest() {
    cy.get(this.pledgeButton).first().click();
  }
};
