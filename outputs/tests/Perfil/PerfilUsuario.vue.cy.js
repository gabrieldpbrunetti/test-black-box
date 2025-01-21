/// <reference types="cypress"/>

describe('User Profile Page', () => {
  beforeEach(() => {
    cy.visit('/user-profile'); 
  });

  it('Displays the correct page title', () => {
    cy.contains('Perfil do usuário').should('be.visible');
  });

  it('Displays breadcrumbs correctly', () => {
    cy.get('BaseBreadcrumb').within(() => {
      cy.contains('Perfil').should('be.visible').and('have.attr', 'href', '/');
      cy.contains('Usuário').should('be.visible').and('have.attr', 'href', '#').and('be.disabled');
    });
  });

  it('Displays the IntroCard component', () => {
    cy.get('IntroCard').should('be.visible');
    cy.get('IntroCard').contains('Username').should('be.visible'); // Added assertion for IntroCard content
  });


  it('Handles empty user profile gracefully', () => {
    cy.contains('No posts yet.').should('be.visible'); 
  });

  it('Layout is responsive', () => {
    cy.viewport('macbook-15');
    cy.get('v-col').should('have.length', 2); 
    cy.viewport('iphone-6+');
    cy.get('v-col').should('have.length', 2); 
  });

  it('Handles error gracefully', () => {
    // Add assertions to check for appropriate messaging or UI behavior in case of error.
    // Example: cy.contains('Error loading profile').should('be.visible');
  });

  it('Tests user interactions', () => {
    // Add tests for user interactions with elements on the page.
    // Example: cy.get('button').click();
  });
});