/// <reference types="cypress"/>

describe('Login Flow Tests', () => {

  it('Successful login with token and refresh token', () => {
    const authToken = 'test_auth_token';
    const refreshToken = 'test_refresh_token';
    cy.visit(`/?token=${authToken}&refresh_token=${refreshToken.replaceAll('+', ' ')}`);

    cy.window().then((win) => {
      expect(AuthStore.getToken()).to.eq(authToken);
      expect(AuthStore.getRefreshToken()).to.eq(refreshToken);
    });
    cy.url().should('include', '/modalidade/IndexModalidade'); 
  });


  it('Login with Accesso Cidadão button redirects correctly', () => {
    cy.intercept('GET', import.meta.env.VITE_BASE_URL_AUTH, {statusCode: 200}).as('acessoCidadao');
    cy.visit('/');
    cy.get('[data-testid="acesso-cidadao-button"]').click(); 
    cy.wait('@acessoCidadao');
    cy.url().should('include', import.meta.env.VITE_BASE_URL_AUTH); 
  });

  it('Handles errors gracefully during Accesso Cidadão redirection', () => {
    cy.intercept('GET', import.meta.env.VITE_BASE_URL_AUTH, {statusCode: 500}).as('acessoCidadaoError');
    cy.visit('/');
    cy.get('[data-testid="acesso-cidadao-button"]').click();
    cy.wait('@acessoCidadaoError');
    cy.contains('Erro ao redirecionar para o Acesso Cidadão:').should('be.visible'); 
  });

  it('Navigates to the initial page after successful login', () => {
    cy.visit('/?token=validToken&refresh_token=validRefreshToken'); 
    cy.contains('Acessar o ConectaFapes').should('not.exist'); 
    cy.url().should('include', '/modalidade/IndexModalidade'); 
  });

  it('Handles missing token and refresh token parameters', () => {
    cy.visit('/');
    cy.contains('Acessar o ConectaFapes').should('be.visible'); 
  });

  it('Handles invalid token and refresh token parameters', () => {
    cy.visit('/?token=invalid_token&refresh_token=invalid_refresh_token');
    cy.contains('Acessar o ConectaFapes').should('be.visible'); 
  });

  it('Successful login with token and spaces in refresh token', () => {
    cy.visit('/?token=valid-token&refresh_token=valid refresh token');
    cy.window().then((win) => {
      expect(AuthStore.getToken()).to.eq('valid-token');
      expect(AuthStore.getRefreshToken()).to.eq('valid+refresh+token');
    });
    cy.url().should('include', '/modalidade/IndexModalidade');
  });

  it('Handles refresh token with spaces', () => {
    cy.visit('/?token=validToken&refresh_token=valid Refresh Token');
    cy.contains('Acessar o ConectaFapes').should('be.visible');
  });

  it('Handles refresh token with special characters', () => {
    cy.visit('/?token=validToken&refresh_token=valid!@#$%^&*()_+=-`~[]\{}|;\':",./<>?RefreshToken');
    cy.contains('Acessar o ConectaFapes').should('be.visible');
  });

  it('Handles long refresh token', () => {
    const longRefreshToken = 'a'.repeat(1000);
    cy.visit('/?token=validToken&refresh_token=' + longRefreshToken);
    cy.contains('Acessar o ConectaFapes').should('be.visible');
  });

  it('Handles empty refresh token', () => {
    cy.visit('/?token=validToken&refresh_token=');
    cy.contains('Acessar o ConectaFapes').should('be.visible');
  });

  it('Handles empty token', () => {
    cy.visit('/?token=&refresh_token=validRefreshToken');
    cy.contains('Acessar o ConectaFapes').should('be.visible');
  });

  it('Successful login with valid token', () => {
    cy.visit('/?token=valid-token&refresh_token=valid-refresh-token'); 
    cy.window().then((win) => {
      expect(AuthStore.getToken()).to.eq('valid-token');
      expect(AuthStore.getRefreshToken()).to.eq('valid-refresh-token');
    });
    cy.url().should('include', '/modalidade/IndexModalidade');
  });

  it('Navigates to initial page', () => {
    cy.get('[data-testid="pagina-inicial-button"]').click();
    cy.url().should('include', '/modalidade/IndexModalidade');
  });


});