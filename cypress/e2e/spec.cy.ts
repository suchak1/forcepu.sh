// Code coverage
// https://docs.cypress.io/guides/tooling/code-coverage#E2E-and-unit-code-coverage

describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000')
  })
  it('Header', () => {
    const pages = ['Docs', 'Algorithm', 'Subscription', 'Alerts', 'Contact'];
    // Test that links exist
    cy.get('.ant-layout-header').should(el => {
      const element = el[0];
      expect(element.innerText).to.include('FORCEPU.SH');
      pages.forEach(page => expect(element.innerText).to.include(page));
    })
    // Navigate to each page
    pages.forEach(page => {
      cy.get('.ant-layout-header').find('a').contains(page).first().click();
      cy.location().should(location => expect(location.pathname).to.eq(`/${page.toLowerCase()}`))
    })
  })
  it('Footer', () => {
    cy.get('.ant-layout-footer').should(el => {
      const element = el[0];
      expect(element.innerText).to.include('Terms of Service');
      expect(element.innerText).to.include('Financial Disclaimer');
      expect(element.innerText).to.include('Privacy');
    })
  })
})