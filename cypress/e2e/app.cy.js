describe('SURVIV-OS', () => {
  it('blocks start during tutorial', () => {
    cy.visit('/post-apoc-learn');
    cy.wait(2500);
    cy.contains('INITIATE HACK').should('not.exist');
  });

  it('shows start when ready', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-game-state', JSON.stringify('READY'));
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.contains('INITIATE HACK');
  });
});
