describe('Auth', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('Sign in', () => {
        let selector = '.ant-layout-header';
        cy.get(selector).find('button').contains('Get started').first().click();
        selector = '.ant-modal-body';
        cy.get(selector).find('input[name="username"]').last().type(`${Cypress.env('SIGNAL_EMAIL')}@dev.forcepu.sh`);
        cy.get(selector).find('input[name="password"]').last().type(Cypress.env('EMAIL_PASS'));
        cy.get(selector).find('button[type="submit"]').contains('Sign in').click();
        cy.intercept('GET', 'https://api.dev.forcepu.sh/account').as('getAccount');
        cy.wait('@getAccount').then(({ request }) => {
            const auth = request.headers['authorization'];
            cy.request({method: 'DELETE', url: 'https://api.dev.forcepu.sh/account', headers: {Authorization: auth}});
        });        
    })
  })