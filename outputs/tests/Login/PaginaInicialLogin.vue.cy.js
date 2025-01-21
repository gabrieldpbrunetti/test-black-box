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
  });

  it('Unsuccessful login with invalid credentials', () => {
    cy.get('[data-testid="username"]').type('invalid_username');
    cy.get('[data-testid="password"]').type('invalid_password');
    cy.get('[data-testid="login-button"]').click();
    cy.contains('Error message').should('be.visible');
  });

  it('Redirects to AuthAcessoCidadao on "Entrar com acesso cidadão" click', () => {
    cy.get('[data-testid="acesso-cidadao-button"]').click();
    cy.url().should('include', Cypress.env('VITE_BASE_URL_AUTH'));
  });

  it('Handles errors gracefully during AuthAcessoCidadao redirection', () => {
    cy.intercept({
      method: 'GET',
      url: Cypress.env('VITE_BASE_URL_AUTH'),
    }, {
      statusCode: 500,
      body: { error: 'Network error' }
    }).as('authRedirect');

    cy.get('[data-testid="acesso-cidadao-button"]').click();
    cy.wait('@authRedirect');
    cy.contains('Erro ao redirecionar').should('be.visible');
  });

  it('Sets token and refresh token from URL parameters', () => {
    const authToken = 'test_auth_token';
    const refreshToken = 'test_refresh_token';
    cy.visit(`/?token=${authToken}&refresh_token=${refreshToken}`);
    cy.wrap(AuthStore.getToken()).should('eq', authToken);
    cy.wrap(AuthStore.getRefreshToken()).should('eq', refreshToken.replaceAll(" ", '+'));
  });

  it('Handles missing URL parameters gracefully', () => {
    cy.visit('/');
    cy.contains('Acessar o ConectaFapes').should('be.visible');
  });

  it('Handles spaces in refresh token from URL parameters', () => {
    const refreshTokenWithSpaces = 'test refresh token';
    cy.visit(`/?refresh_token=${refreshTokenWithSpaces}`);
    cy.wrap(AuthStore.getRefreshToken()).should('eq', refreshTokenWithSpaces.replaceAll(" ", '+'));
  });

  it('Handles token and refresh token from URL parameters using window object', () => {
    cy.visit('/?token=valid_token&refresh_token=valid_refresh_token');
    cy.window().then((win) => {
      expect(AuthStore.getToken()).to.eq('valid_token');
      expect(AuthStore.getRefreshToken()).to.eq('valid_refresh_token'.replaceAll(" ", '+'));
    });
  });

  it('Handles refresh token with spaces using window object', () => {
    cy.visit('/?refresh_token=refresh token with spaces');
    cy.window().then((win) => {
      expect(AuthStore.getRefreshToken()).to.eq('refresh+token+with+spaces');
    });
  });

  it('Handles missing token and refresh token parameters', () => {
    cy.visit('/');
    cy.window().then((win) => {
      expect(AuthStore.getToken()).to.be.null;
      expect(AuthStore.getRefreshToken()).to.be.null;
    });
  });

  it('Handles errors during redirection to Acesso Cidadão using stub', () => {
    cy.stub(window, 'location', { href: null }).as('windowLocation');
    cy.get('[data-testid="acesso-cidadao-button"]').click();
    cy.get('@windowLocation').should('have.been.calledWith', Cypress.env('VITE_BASE_URL_AUTH'));
    cy.contains('Erro ao redirecionar').should('be.visible');
  });
});