describe('Tutorial system', () => {
  it('highlights menu and scanner', () => {
    cy.visit('/');
    cy.get('[data-tutorial="menu-toggle"]').should('exist');
    // Force the click in case an overlay temporarily covers the button
    cy.get('[data-tutorial="menu-toggle"]').click({ force: true });
    cy.get('[data-tutorial="app-icon-scanner"]').should('exist');
  });

  it('shows skip when element missing', () => {
    cy.visit('/');
    cy.get('[data-tutorial="menu-toggle"]').invoke('remove');
    // Wait a little longer for the Skip Step button to appear
    cy.contains('Skip Step', { timeout: 6000 });
  });
});
