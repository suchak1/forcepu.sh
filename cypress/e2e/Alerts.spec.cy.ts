describe('Alerts', () => {
    beforeEach(() => {
      cy.visit('/alerts')
    })
    it('Update preferences', () => {
      const toggle = '.ant-switch';
      cy.get(toggle).first().should('be.disabled');
      cy.login();
      cy.intercept('GET', 'https://api.dev.forcepu.sh/account').as('getAccount');
      cy.wait('@getAccount').then(({ request, response }) => {
        cy.wrap(response?.body.in_beta).should('eq', 0);
        const auth = request.headers['authorization'];
        cy.request({method: 'POST', url: 'https://api.dev.forcepu.sh/account', headers: {Authorization: auth}, body: {in_beta: 1}});
      });
      cy.reload();
      cy.get(toggle).first().should('not.be.disabled').click();
      cy.wait('@getAccount').then(({ request, response }) => {
        cy.wrap(response?.body.in_beta).should('eq', 1);
        const auth = request.headers['authorization'];
        cy.request({method: 'POST', url: 'https://api.dev.forcepu.sh/account', headers: {Authorization: auth}, body: {in_beta: 1}});
      });
    })
  })