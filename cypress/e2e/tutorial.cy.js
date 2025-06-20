describe('Tutorial system', () => {
  beforeEach(() => {
    // Ensure no previous progress interferes with the tests
    cy.clearLocalStorage();
  });

  it('highlights menu and scanner', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    // Wait for the tutorial overlay to attach to the Tools tab
    cy.contains('Open the Tools tab', { timeout: 8000 }).should('be.visible');
    // Force the click in case an overlay temporarily covers the button
    cy.get('[data-tutorial="tools-tab"]').click({ force: true });
    cy.contains('Launch the Scanner', { timeout: 8000 }).should('be.visible');
    cy.get('[data-tutorial="app-icon-scanner"]').should('exist');
  });

  it('advances to next step after clicking tools tab', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.contains('Open the Tools tab', { timeout: 8000 });
    cy.get('[data-tutorial="tools-tab"]').click({ force: true });
    cy.contains('Launch the Scanner', { timeout: 8000 });
  });

  it('shows skip when element missing', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.get('[data-tutorial="tools-tab"]').invoke('remove');
    // Wait a little longer for the Skip Step button to appear
    cy.contains('Skip Step', { timeout: 6000 });
  });
});
