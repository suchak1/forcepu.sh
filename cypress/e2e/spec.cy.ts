describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:8000')
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
})