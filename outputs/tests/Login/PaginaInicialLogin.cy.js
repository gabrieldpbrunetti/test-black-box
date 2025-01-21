/// <reference types="cypress" />

describe('Login Flow Tests', () => {
  beforeEach(() => {
    cy.visit('/'); 
  });

  it('Successful login with valid credentials', () => {
    cy.get('[data-testid="username"]').type('valid_username');
    cy.get('[data-testid="password"]').type('valid_password');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/modalidade/IndexModalidade');
    cy.contains('Welcome Message').should('be.visible');
  });

  it('Unsuccessful login with invalid credentials', () => {
    cy.get('[data-testid="username"]').type('invalid_username');
    cy.get('[data-testid="password"]').type('invalid_password');
    cy.get('[data-testid="login-button"]').click();
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('Redirects to AuthAcessoCidadao on "Entrar com acesso cidadão" click', () => {
    cy.get('[data-testid="acesso-cidadao-button"]').click();
    cy.url().should('include', Cypress.env('VITE_BASE_URL_AUTH'));
  });

  it('Handles errors gracefully during AuthAcessoCidadao redirection', () => {
    cy.intercept('GET', Cypress.env('VITE_BASE_URL_AUTH'), { forceNetworkError: true }).as('authRedirect');
    cy.get('[data-testid="acesso-cidadao-button"]').click();
    cy.wait('@authRedirect');
    cy.log('Checking for console errors related to AuthAcessoCidadao redirection');
  });

  it('Sets token and refresh token from URL parameters', () => {
    const authToken = 'test_auth_token';
    const refreshToken = 'test_refresh_token';
    cy.visit(`/?token=${authToken}&refresh_token=${refreshToken}`);
    cy.window().then((win) => {
      expect(AuthStore.getToken()).to.eq(authToken);
      expect(AuthStore.getRefreshToken()).to.eq(refreshToken.replaceAll(" ", '+'));
    });
  });

  it('Handles missing URL parameters gracefully', () => {
    cy.visit('/');
    cy.window().then((win) => {
      expect(AuthStore.getToken()).to.be.null;
      expect(AuthStore.getRefreshToken()).to.be.null;
    });
  });

  it('Handles refresh token with spaces', () => {
    cy.visit('/?refresh_token=refresh token with spaces');
    cy.window().then((win) => {
      expect(AuthStore.getRefreshToken()).to.eq('refresh+token+with+spaces');
    });
  });

  it('Navigates to initial page after successful login', () => {
    cy.get('[data-testid="username"]').type('valid_username');
    cy.get('[data-testid="password"]').type('valid_password');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/modalidade/IndexModalidade');
  });

  it('Error handling for redirect to Acesso Cidadão', () => {
    cy.stub(window, 'location', { href: null }).as('windowLocation');
    cy.get('[data-testid="acesso-cidadao-button"]').click();
    cy.get('@windowLocation').should('have.been.calledWith', Cypress.env('VITE_BASE_URL_AUTH'));
    cy.contains('Erro ao redirecionar').should('be.visible');
  });

  it('Navigates to initial page', () => {
    cy.get('[data-testid="initial-page-button"]').click();
    cy.url().should('include', '/modalidade/IndexModalidade');
  });
});