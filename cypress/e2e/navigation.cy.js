describe('Bottom navigation', () => {
  const visitWithoutStory = () =>
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });

  it('switches to stats tab', () => {
    visitWithoutStory();
    cy.get('[data-testid="tab-stats"]').click();
    cy.get('[data-testid="stats-screen"]').should('exist');
  });

  it('back closes active tool', () => {
    visitWithoutStory();
    cy.get('[data-testid="tab-tools"]').click();
    cy.get('#app-icon-communicator').click();
    cy.get('[data-testid="active-app"]').should('exist');
    cy.go('back');
    cy.get('[data-testid="active-app"]').should('not.exist');
  });
});
