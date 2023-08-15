describe('Gym', () => {
    beforeEach(() => {
      cy.visit('/gym')
    })
    it('List exercises', () => {
      cy.get('.ant-table-cell').contains('Bench');
    })
  })