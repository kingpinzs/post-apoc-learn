describe('Game Reset', () => {
  it('clears save data from settings screen', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-save', 'foo');
        win.localStorage.setItem('survivos-game-state', JSON.stringify('READY'));
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.contains('INITIATE HACK');
    cy.get('[data-testid="tab-menu"]').click();
    cy.contains('Reset Data').click();
    cy.get('[data-testid="reset-confirm"]').within(() => {
      cy.contains('Reset Game').click();
    });
    cy.window().then((win) => {
      expect(win.localStorage.getItem('survivos-save')).to.be.null;
    });
  });
});
