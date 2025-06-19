describe('Tutorial system', () => {
  it('highlights menu and scanner', () => {
    cy.visit('/');
    cy.get('[data-tutorial="menu-toggle"]').should('exist');
    cy.get('[data-tutorial="menu-toggle"]').click();
    cy.get('[data-tutorial="app-icon-scanner"]').should('exist');
  });

  it('shows skip when element missing', () => {
    cy.visit('/');
    cy.get('[data-tutorial="menu-toggle"]').invoke('remove');
    cy.contains('Skip Step');
  });
});
