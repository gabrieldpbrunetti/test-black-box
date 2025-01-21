/// <reference types="cypress"/>

describe('Authentication via URL Parameters', () => {
  it('Successfully authenticates with valid token and refresh token', () => {
    cy.visit('http://localhost:3000/?token=valid_auth_token&refresh_token=valid_refresh_token');

    cy.window().then((win) => {
      const authStore = win.AuthStore; 
      cy.wrap(authStore.getToken()).should('eq', 'valid_auth_token');
      cy.wrap(authStore.getRefreshToken()).should('eq', 'valid_refresh_token');
    });
  });

  it('Handles missing token gracefully', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Aguarde os dados sendo carregados').should('be.visible'); 
  });

  it('Handles missing refresh token gracefully', () => {
    cy.visit('http://localhost:3000/?token=valid_auth_token'); 

    cy.window().then((win) => {
      const authStore = win.AuthStore;
      cy.wrap(authStore.getToken()).should('eq', 'valid_auth_token');
      cy.wrap(authStore.getRefreshToken()).should('be.null'); 
    });
  });

  it('Handles missing auth token gracefully', () => {
    cy.visit('http://localhost:3000/?refresh_token=valid_refresh_token'); 

    cy.window().then((win) => {
      const authStore = win.AuthStore;
      cy.wrap(authStore.getToken()).should('be.null'); 
      cy.wrap(authStore.getRefreshToken()).should('eq', 'valid_refresh_token');
    });
  });

  it('Handles invalid token gracefully', () => {
    cy.visit('http://localhost:3000/?token=invalid_token&refresh_token=invalid_refresh_token');

    cy.window().then((win) => {
      cy.spy(win.console, 'error');
      cy.contains('Aguarde os dados sendo carregados').should('be.visible'); 
      cy.wrap(win.console.error).should('have.been.called'); 
    });
  });

  it('Correctly handles refresh token with spaces', () => {
    cy.visit('http://localhost:3000/?refresh_token=refresh token with spaces');

    cy.window().then((win) => {
      const authStore = win.AuthStore;
      cy.wrap(authStore.getRefreshToken()).should('eq', 'refresh+token+with+spaces');
    });
  });

  it('Ignores extra parameters', () => {
    cy.visit('http://localhost:3000/?token=valid-token&refresh_token=valid-refresh-token&extra=param');
    cy.window().then((win) => {
      const authStore = win.AuthStore;
      cy.wrap(authStore.getToken()).should('eq', 'valid-token');
      cy.wrap(authStore.getRefreshToken()).should('eq', 'valid-refresh-token');
    });
  });

  it('Handles empty token parameters', () => {
    cy.visit('http://localhost:3000/?token=&refresh_token=');
    cy.window().then((win) => {
      const authStore = win.AuthStore;
      cy.wrap(authStore.getToken()).should('be.null');
      cy.wrap(authStore.getRefreshToken()).should('be.null');
    });
  });
});