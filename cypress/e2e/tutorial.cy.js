describe('Tutorial system', () => {
  beforeEach(() => {
    // Ensure no previous progress interferes with the tests
    cy.clearLocalStorage();
  });

  it('highlights phone toggle and scanner', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    // Wait for the tutorial overlay to attach to the phone button
    cy.contains('Open your phone', { timeout: 10000 }).should('exist');
    cy.get('[data-tutorial="phone-toggle"]', { timeout: 10000 }).should('exist');
    // Ensure the listener has time to attach
    cy.wait(100);
    cy.get('[data-tutorial="phone-toggle"]').click({ force: true });
    cy.contains('Launch the Scanner', { timeout: 10000 }).should('exist');
    cy.get('[data-tutorial="app-icon-scanner"]', { timeout: 10000 }).should(
      'exist'
    );
  });

  it('advances to next step after clicking phone toggle', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.contains('Open your phone', { timeout: 10000 }).should('exist');
    cy.get('[data-tutorial="phone-toggle"]', { timeout: 10000 }).should('exist');
    cy.wait(100);
    cy.get('[data-tutorial="phone-toggle"]').click({ force: true });
    cy.contains('Launch the Scanner', { timeout: 10000 }).should('exist');
  });

  it('shows skip when element missing', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.get('[data-tutorial="phone-toggle"]').invoke('remove');
    // Wait a little longer for the Skip Step button to appear
    cy.contains('Skip Step', { timeout: 6000 }).should('exist');
  });

  it('shows skip if target removed after highlight', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.contains('Open your phone', { timeout: 10000 }).should('exist');
    cy.get('[data-tutorial="phone-toggle"]').then(($btn) => {
      $btn.remove();
    });
    cy.contains('Skip Step', { timeout: 10000 }).should('exist');
  });

  it('completes mission after clicking scanner', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.contains('Open your phone', { timeout: 10000 }).should('exist');
    cy.get('[data-tutorial="phone-toggle"]', { timeout: 10000 }).should('exist');
    cy.wait(100);
    cy.get('[data-tutorial="phone-toggle"]').click({ force: true });
    cy.contains('Launch the Scanner', { timeout: 10000 }).should('exist');
    cy.get('[data-tutorial="app-icon-scanner"]', { timeout: 10000 }).click({
      force: true,
    });
    cy.contains('Launch the Scanner').should('not.exist');
  });

  it('persists current step after reload', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.contains('Open your phone', { timeout: 10000 }).should('exist');
    cy.reload();
    cy.contains('Open your phone', { timeout: 10000 }).should('exist');
  });

  it('skip button advances to next step', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.get('[data-tutorial="phone-toggle"]').invoke('remove');
    cy.contains('Skip Step', { timeout: 10000 }).click();
    cy.contains('Launch the Scanner', { timeout: 10000 }).should('exist');
  });

  it('does not show tutorial when all missions completed', () => {
    cy.visit('/post-apoc-learn', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'survivos-tutorial',
          JSON.stringify({
            completed: [
              'firstBoot',
              'threatDefense',
              'appMastery',
              'resourceMgmt',
            ],
            activeMission: null,
          })
        );
        win.localStorage.setItem('survivos-story-progress', '6');
      },
    });
    cy.contains('Open your phone').should('not.exist');
  });
});
