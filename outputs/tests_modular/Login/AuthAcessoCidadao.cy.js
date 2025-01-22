/// <reference types="cypress"/>

describe('Authentication via URL Parameters', () => {
  it('Successfully authenticates with valid token and refresh token', () => {
    const authToken = 'valid-auth-token';
    const refreshToken = 'valid-refresh-token';
    cy.visit(`/?token=${authToken}&refresh_token=${refreshToken}`);

    // Verify successful authentication by checking for redirect to a protected route.  Replace '/dashboard' with your actual protected route.
    cy.url().should('include', '/dashboard'); 

    //Optional:  Add assertions to check if tokens are stored correctly in local storage or session storage (if applicable).  Uncomment as needed.
    //cy.window().then((win) => {
    //  expect(win.localStorage.getItem('authToken')).to.eq(authToken);
    //  expect(win.localStorage.getItem('refreshToken')).to.eq(refreshToken.replaceAll(" ", '+'));
    //});
  });

  it('Handles missing token gracefully', () => {
    cy.visit('?refresh_token=valid-refresh-token'); 
    // Assertion: Check for expected behavior in case of missing token (e.g., error message, redirect, loading indicator).  Adjust the assertion below as needed.
    cy.contains('Aguarde os dados sendo carregados').should('be.visible'); 
  });

  it('Handles missing refresh token gracefully', () => {
    cy.visit('?token=valid-auth-token'); 
    cy.contains('Aguarde os dados sendo carregados').should('be.visible'); 
  });

  it('Handles invalid token and refresh token gracefully', () => {
    cy.visit('?token=invalid-token&refresh_token=invalid-refresh-token');
    // Assertion: Check for expected behavior with invalid tokens. Adjust the assertion below as needed.
    cy.contains('Aguarde os dados sendo carregados').should('be.visible'); 
  });

  it('Correctly handles refresh token with spaces', () => {
    const refreshTokenWithSpaces = 'refresh token with spaces';
    cy.visit(`/?token=valid-token&refresh_token=${refreshTokenWithSpaces}`);
    //Assert: Check if spaces are correctly handled (e.g., replaced with '+', or other expected behavior).  Adjust the assertion below as needed.
    cy.url().should('include', '/dashboard'); 
  });
});