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
        // cy.origin('https://checkout.stripe.com', () => {
        //   cy.on('uncaught:exception', (e) => {
        //     if (e.message.includes('Things went bad')) {
        //       // we expected this error, so let's ignore it
        //       // and let the test continue
        //       return false
        //     }
        //     return false;
        //   })

        //   cy.get('input[name="cardNumber"]').type('4242424242424242');
        //   cy.get('.Header-businessLink').click();
        // })
        
        // Try contact us link
        cy.get('a').contains('Contact us!').click();
        cy.url().should('eq', 'https://dev.forcepu.sh/contact');
    })
  })