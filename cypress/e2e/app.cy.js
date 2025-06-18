describe('SURVIV-OS', () => {
  it('loads the home page', () => {
    cy.visit('/');
    cy.contains('INITIATE HACK');
  });
});
