describe('Subscription', () => {
    beforeEach(() => {
      cy.visit('/subscription')
    })
    it('Send message', () => {
        // Login and subscribe
        const card = '.ant-card';
        cy.login();
        cy.get(card).contains('/ month').parent().invoke('text').should('match', /^\$\d+\.?\d+ \/ month$/);
        // cy.contains('button', 'Subscribe').click();
        // cy.wait(10000);
        // Try contact us link
        cy.get('a').contains('Contact us!').click();
        cy.url().should('eq', 'https://dev.forcepu.sh/contact');
    })
  })