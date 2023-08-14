describe('Contact', () => {
    beforeEach(() => {
      cy.visit('/contact')
    })
    it('Send message', () => {
        const subject = 'input[type="search"]';
        // Verify that all inputs and buttons are disabled
        cy.get(subject).should('be.disabled');
        cy.get('textarea').should('be.disabled');
        cy.contains('button', 'Submit').should('be.disabled');

        // Login and send message
        cy.login();
        cy.get(subject).should('not.be.disabled');
        cy.get('textarea').should('not.be.disabled');
        cy.get('textarea').invoke('html').should('eq', '')
        cy.contains('button', 'Submit').should('be.disabled');
        cy.get(subject).click();
        cy.get('.ant-select-item').first().click();
        cy.contains('button', 'Submit').should('be.disabled');
        cy.get('textarea').type('test');
        cy.contains('button', 'Submit').should('not.be.disabled');
        cy.contains('button', 'Submit').click()

        // Verify success screen
        const success = '.ant-result-success';
        cy.get(success).find('.anticon-check-circle').should('be.visible');
        cy.get(success).find('.ant-result-title').contains('Success!')

        // Return to contact form and assert 
        cy.contains('button', 'Return to contact form').click();
        cy.get('textarea').invoke('html').should('eq', '')
        cy.contains('button', 'Submit').should('be.disabled');
    })
  })