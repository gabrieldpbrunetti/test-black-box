/// <reference types="cypress"/>

describe('User Profile Page', () => {
  beforeEach(() => {
    cy.visit('/user-profile'); 
  });

  it('Displays the correct page title', () => {
    cy.contains('Perfil do usuário').should('be.visible');
  });

  it('Displays the breadcrumbs correctly', () => {
    cy.get('BaseBreadcrumb').within(() => {
      cy.contains('Perfil').should('be.visible').and('have.attr', 'href', '/');
      cy.contains('Usuário').should('be.visible').and('have.attr', 'href', '#').and('be.disabled');
    });
  });

  it('Displays the IntroCard component', () => {
    cy.get('[data-testid="intro-card"]').should('be.visible'); 
  });

  it('Layout is correct', () => {
    cy.get('v-row').should('exist');
    cy.get('v-col').should('have.length', 2); 
    cy.get('v-col:first').should('have.class', 'col-12').and('have.class', 'lg-4').and('have.class', 'md-4'); 
    cy.get('v-col:last').should('have.class', 'col-12').and('have.class', 'lg-8').and('have.class', 'md-8'); 
  });

  it('Handles potential errors gracefully (e.g., missing data)', () => {
    cy.intercept('GET', '/api/user-data', { statusCode: 404, body: { error: 'User data not found' } }).as('userData');
    cy.visit('/user-profile');
    cy.wait('@userData');
    cy.contains('Error loading user data').should('be.visible');  
  });

  it('Allows users to update their profile information', () => {
    //Implementation for updating profile information
  });

  it('Displays user posts correctly', () => {
    //Implementation for verifying user posts
  });

  it('Handles empty user profiles', () => {
    //Implementation for handling empty profiles
  });

  it('Handles large amounts of user data', () => {
    //Implementation for handling large datasets
  });

  it('Tests responsiveness across different screen sizes', () => {
    //Implementation for responsive testing
  });
});