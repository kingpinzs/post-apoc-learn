describe('Bottom navigation', () => {
  it('switches to stats tab', () => {
    cy.visit('/');
    cy.get('[data-testid="tab-stats"]').click();
    cy.get('[data-testid="stats-screen"]').should('exist');
  });

  it('back closes active tool', () => {
    cy.visit('/');
    cy.get('[data-testid="tab-tools"]').click();
    cy.get('#app-icon-communicator').click();
    cy.get('[data-testid="active-app"]').should('exist');
    cy.go('back');
    cy.get('[data-testid="active-app"]').should('not.exist');
  });
});
