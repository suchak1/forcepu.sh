// Code coverage
// https://docs.cypress.io/guides/tooling/code-coverage#E2E-and-unit-code-coverage

describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000')
  })
  it('Header', () => {
    cy.get('.ant-layout-header').should(el => {
      const element = el[0];
      expect(element.innerText).to.include('FORCEPU.SH');
      expect(element.innerText).to.include('Docs');
      expect(element.innerText).to.include('Algorithm');
      expect(element.innerText).to.include('Subscription');
      expect(element.innerText).to.include('Alerts');
      expect(element.innerText).to.include('Contact');
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