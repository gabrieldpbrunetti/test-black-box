/// <reference types="cypress" />

describe('Allocation Data Completion Tests', () => {
  beforeEach(() => {
    cy.login(); 
    cy.visit('/path/to/your/allocation/page'); 
  });

  it('Should display a loading indicator while data is loading', () => {
    cy.intercept('/api/your/endpoint', { fixture: 'initialData.json' }).as('getInitialData'); 
    cy.wait('@getInitialData');
    cy.get('.skeleton-loader').should('be.visible'); 
  });

  it('Should display the page title and project information', () => {
    cy.contains('h2', 'Completar dados do projeto:').should('be.visible'); 
    cy.contains('Atualize e complete os dados das alocações').should('be.visible'); 
  });

  it('Should allow searching for a fellow by name', () => {
    cy.get('v-text-field[label="Pesquisar o nome do bolsista"]').type('John Doe'); 
    cy.get('v-btn[color="primary"]').click(); 
    cy.get('v-data-table').contains('John Doe').should('be.visible');
  });

  it('Should allow filtering by allocation status', () => {
    cy.get('v-select[label="Filtrar por status da alocação"]').select('Ativa'); 
    cy.get('v-btn[color="primary"]').click(); 
    cy.get('v-data-table').contains('Ativa').should('be.visible');
  });

  it('Should allow updating the number of paid quotas', () => {
    cy.get('input[type="number"]').first().clear().type('5'); 
    cy.get('input[type="number"]').first().blur(); 
    // Assertions to check if the update was successful and reflected in the UI
  });

  it('Should display validation errors for invalid quota input', () => {
    cy.get('input[type="number"]').first().clear().type('100'); 
    cy.get('.input-error').should('be.visible'); 
    cy.get('v-tooltip[text="A quantidade de cotas pagas não pode exceder"]').should('be.visible');
  });

  it('Should display appropriate tooltips for quota input', () => {
    cy.get('input[type="number"]').first().clear(); 
    cy.contains('Este campo não pode ser salvo como vazio novamente.').should('be.visible'); 
  });

  it('Should allow canceling an active allocation', () => {
    cy.get('v-icon[color="error"]').first().click(); 
    cy.get('v-dialog').should('be.visible'); 
    cy.get('input[type="date"]').type('2024-03-15'); 
    cy.get('textarea[name="justificativa"]').type('Test cancellation reason'); 
    cy.contains('Cancelar alocação').click(); 
    // Assertions to check if the cancellation was successful
  });

  it('Should display details of a canceled allocation', () => {
    cy.get('v-icon[color="primary"]').first().click(); 
    cy.get('v-dialog').should('be.visible'); 
    cy.contains('Ver detalhes de cancelamento').should('be.visible');
    cy.contains('Data de fim das atividades').should('be.visible');
    cy.contains('Justificativa do cancelamento').should('be.visible');
  });

  it('Should handle the case where no data is found', () => {
    cy.get('v-text-field[label="Pesquisar o nome do bolsista"]').type('NonExistentFellow');
    cy.get('v-btn[color="primary"]').click();
    cy.contains('Sem dados!').should('be.visible'); 
  });

  it('Allows navigation back to the previous page', () => {
    cy.get('.navigate-back').click();
    cy.url().should('not.include', '/path/to/allocation/page'); 
  });

  it('Displays the search field and filter correctly', () => {
    cy.get('v-text-field[label="Pesquisar o nome do bolsista"]').should('be.visible');
    cy.get('v-select[label="Filtrar por status da alocação"]').should('be.visible');
    cy.get('.custom-width').contains('Buscar').should('be.visible');
  });

  it('Handles empty search results', () => {
    cy.get('v-text-field[label="Pesquisar o nome do bolsista"]').type('NonExistentName');
    cy.get('v-btn[color="primary"]').click();
    cy.contains('Sem dados!').should('be.visible');
  });

  it('Validates quota input (max value)', () => {
    cy.get('input[type="number"]').first().clear().type('1000'); 
    cy.get('input[type="number"]').first().blur();
    cy.get('.input-error').should('be.visible'); 
  });

  it('Validates quota input (empty value)', () => {
    cy.get('input[type="number"]').first().clear();
    cy.get('input[type="number"]').first().blur();
    cy.get('v-tooltip[text="Este campo não pode ser salvo como vazio novamente."]').should('be.visible');
  });

  it('Displays correct status labels', () => {
    cy.get('v-data-table').contains('Ativa').should('be.visible'); 
    cy.get('v-data-table').contains('Cancelada').should('be.visible'); 
  });

  it('Opens and closes the cancellation dialog', () => {
    cy.get('v-icon[color="error"]').first().click(); 
    cy.get('v-dialog').should('be.visible');
    cy.get('v-btn').contains('Fechar').click(); 
    cy.get('v-dialog').should('not.be.visible');
  });

  it('Handles edge cases: invalid date input for cancellation', () => {
    cy.get('v-icon[color="error"]').first().click();
    cy.get('v-text-field[type="date"]').type('invalid date'); 
    // Assertions to check for error handling (e.g., error message, prevents submission)
  });


  // Add more tests for other functionalities and edge cases as needed.  Remember to adjust selectors based on your actual component structure.  Consider adding tests for error handling and data persistence.
});