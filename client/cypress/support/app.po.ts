export class AppPage {

  private readonly baseUrl = '/';
  private readonly titleSelector = '.app-title';
  private readonly sideNavButton = '.sidenav-button';
  private readonly sideNav = '.sidenav';
  private readonly sideNavOption = '[routerlink] > .mdc-list-item__content';
  private readonly button1 = '[data-test=backtoDonorpageButton]';
  private readonly button2 = '[data-test=backtoClientpageButton]';
  private readonly button3 = '[data-test=backtoVolunteerpageButton]';
  private readonly button4 = '[data-test=backtoHomepageButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getAppTitle() {
    return cy.get(this.titleSelector);
  }

  getSidenavButton() {
    return cy.get(this.sideNavButton);
  }

  getSidenav() {
    return cy.get(this.sideNav);
  }

  getNavLink(navOption: 'Home' | 'Users') {
    return cy.contains(this.sideNavOption, `${navOption}`);
  }

  backtoDonorpageButton(){
    return cy.get(this.button1);
  }

  backtoClientpageButton(){
    return cy.get(this.button2);
  }

  backtoVolunteerpageButton(){
    return cy.get(this.button3);
  }

  backtoHomepageButton(){
    return cy.get(this.button4);
  }
}
