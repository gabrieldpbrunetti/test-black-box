/// <reference types="cypress"/>

describe('Authentication via URL Parameters', () => {
  beforeEach(() => {
    cy.stub(console, 'info').as('logInfoCalls'); 
    cy.stub(window, 'location', { search: '' }).as('windowLocation'); 
    cy.stub(AuthStore, 'setToken').as('setToken');
    cy.stub(AuthStore, 'setRefreshToken').as('setRefreshToken');
    cy.stub(AuthStore, 'getToken').as('getToken');
    cy.stub(AuthStore, 'getRefreshToken').as('getRefreshToken');
  });

  it('Successfully authenticates with valid token and refresh token', () => {
    const authToken = 'valid-auth-token';
    const refreshToken = 'valid-refresh-token';
    cy.get('@windowLocation').its('search').set(`?token=${authToken}&refresh_token=${refreshToken}`);
    cy.visit('/');

    cy.get('@setToken').should('have.been.calledOnceWith', authToken);
    cy.get('@setRefreshToken').should('have.been.calledOnceWith', refreshToken);
    cy.get('@getToken').should('have.been.calledOnce').and('return', authToken);
    cy.get('@getRefreshToken').should('have.been.calledOnce').and('return', refreshToken);
    cy.get('@logInfoCalls').should('have.been.calledWith', authToken);
    cy.get('@logInfoCalls').should('have.been.calledWith', refreshToken);
  });

  it('Handles missing token gracefully', () => {
    cy.visit('/');

    cy.get('@getToken').should('have.been.calledOnce').and('return', null);
    cy.get('@getRefreshToken').should('have.been.calledOnce').and('return', null);
  });

  it('Handles invalid token gracefully', () => {
    cy.get('@windowLocation').its('search').set('?token=invalid-token&refresh_token=invalid-refresh-token');
    cy.visit('/');

    cy.get('@getToken').should('have.been.calledOnce').and('return', null);
    cy.get('@getRefreshToken').should('have.been.calledOnce').and('return', null);
  });

  it('Correctly handles refresh token with spaces', () => {
    const refreshTokenWithSpaces = 'refresh token with spaces';
    cy.get('@windowLocation').its('search').set(`?refresh_token=${refreshTokenWithSpaces}`);
    cy.visit('/');

    cy.get('@setRefreshToken').should('have.been.calledOnceWith', refreshTokenWithSpaces.replaceAll(' ', '+'));
    cy.get('@getRefreshToken').should('have.been.calledOnce').and('return', refreshTokenWithSpaces.replaceAll(' ', '+'));
  });

  it('Logs token and refresh token information', () => {
    const authToken = 'logged-token';
    const refreshToken = 'logged-refresh-token';
    cy.get('@windowLocation').its('search').set(`?token=${authToken}&refresh_token=${refreshToken}`);
    cy.visit('/');

    cy.get('@logInfoCalls').should('have.been.calledWith', authToken);
    cy.get('@logInfoCalls').should('have.been.calledWith', refreshToken);
    cy.get('@logInfoCalls').its('callCount').should('be.gte', 4);
  });
});