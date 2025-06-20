describe('Tutorial system', () => {
  beforeEach(() => {
    // Ensure no previous progress interferes with the tests
    cy.clearLocalStorage();
  });

  it('highlights menu and scanner', () => {
    cy.visit('/');
    cy.get('[data-tutorial="tools-tab"]').should('exist');
    // Force the click in case an overlay temporarily covers the button
    cy.get('[data-tutorial="tools-tab"]').click({ force: true });
    cy.get('[data-tutorial="app-icon-scanner"]').should('exist');
  });

  it('shows skip when element missing', () => {
    cy.visit('/');
    cy.get('[data-tutorial="tools-tab"]').invoke('remove');
    // Wait a little longer for the Skip Step button to appear
    cy.contains('Skip Step', { timeout: 6000 });
  });
});
