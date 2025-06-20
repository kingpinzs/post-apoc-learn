describe('Full tutorial progression', () => {
  const visitWith = (progress, gameState) => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
        if (progress) {
          win.localStorage.setItem('survivos-tutorial', JSON.stringify(progress));
        }
        if (gameState) {
          win.localStorage.setItem('survivos-game-state', JSON.stringify(gameState));
        }
      },
    });
  };

  it('completes first mission', () => {
    visitWith();
    cy.contains('Open your phone', { timeout: 15000 }).should('exist');
    cy.get('[data-tutorial="phone-toggle"]', { timeout: 15000 }).should('exist');
    cy.wait(100);
    cy.get('[data-tutorial="phone-toggle"]').click({ force: true });
    cy.contains('Launch the Scanner', { timeout: 15000 }).should('exist');
    cy.get('[data-tutorial="app-icon-scanner"]', { timeout: 15000 }).click({ force: true });
    cy.contains('Watch for incoming attacks here.', { timeout: 15000 }).should('exist');
    cy.window().then((win) => {
      const data = JSON.parse(win.localStorage.getItem('survivos-tutorial'));
      expect(data.completed).to.include('firstBoot');
    });
  });

  it('completes threat defense mission', () => {
    visitWith({ completed: ['firstBoot'], activeMission: null });
    cy.contains('Watch for incoming attacks here.', { timeout: 15000 }).should('exist');
    cy.get('[data-tutorial="threat-indicator"]', { timeout: 15000 }).click({ force: true });
    cy.contains('Launch the Firewall', { timeout: 15000 }).should('exist');
    cy.get('[data-tutorial="phone-toggle"]').click({ force: true });
    cy.get('[data-tutorial="app-icon-firewall"]', { timeout: 15000 }).click({ force: true });
    cy.window().then((win) => {
      const data = JSON.parse(win.localStorage.getItem('survivos-tutorial'));
      expect(data.completed).to.include('threatDefense');
    });
  });

  it('completes app mastery mission', () => {
    visitWith({ completed: ['firstBoot', 'threatDefense'], activeMission: null });
    cy.contains('Drag blocks to build scripts.', { timeout: 15000 }).should('exist');
    cy.get('[data-tutorial="phone-toggle"]').click({ force: true });
    cy.get('[data-tutorial="app-icon-scriptBuilder"]', { timeout: 15000 }).click({ force: true });
    cy.window().then((win) => {
      const data = JSON.parse(win.localStorage.getItem('survivos-tutorial'));
      expect(data.completed).to.include('appMastery');
    });
  });

  it('completes resource management mission', () => {
    visitWith({ completed: ['firstBoot', 'threatDefense', 'appMastery'], activeMission: null });
    cy.contains('Monitor CPU, RAM and bandwidth here.', { timeout: 15000 }).should('exist');
    cy.contains('Skip Step', { timeout: 15000 }).click();
    cy.window().then((win) => {
      const data = JSON.parse(win.localStorage.getItem('survivos-tutorial'));
      expect(data.completed).to.include('resourceMgmt');
    });
  });

  it('shows start button after tutorial and can begin game', () => {
    visitWith(
      {
        completed: ['firstBoot', 'threatDefense', 'appMastery', 'resourceMgmt'],
        activeMission: null,
      },
      'READY'
    );
    cy.contains('INITIATE HACK', { timeout: 15000 })
      .should('exist')
      .click();
    cy.contains('INITIATE HACK').should('not.exist');
  });
});
