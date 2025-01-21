/// <reference types="cypress" />

describe('Edital Importation System', () => {
  beforeEach(() => {
    // Assuming a login function exists. Replace with your actual login implementation.
    cy.login(); 
  });

  it('Displays unsynchronized editais', () => {
    cy.visit('/definir-editais'); 
    cy.contains('Editais não sincronizados').should('be.visible');
    cy.get('v-data-table').should('be.visible'); 
    cy.get('v-data-table tbody tr').should('have.length.greaterThan', 0); 
  });

  it('Searches unsynchronized editais', () => {
    cy.visit('/definir-editais');
    cy.get('v-text-field[label="Pesquisar Edital"]').type('Pesquisa'); 
    cy.get('v-btn').contains('Buscar').click();
    cy.get('v-data-table tbody tr').each(($el) => {
      cy.wrap($el).contains('Pesquisa'); 
    });
  });


  it('Selects and deselects unsynchronized editais', () => {
    cy.visit('/definir-editais');
    cy.get('v-data-table tbody tr').first().find('v-checkbox input').check();
    cy.get('v-data-table tbody tr').first().find('v-checkbox input').uncheck();
  });

  it('Syncs a single edital', () => {
    cy.visit('/definir-editais');
    cy.get('v-data-table tbody tr').first().find('v-icon.mdi-swap-horizontal').click();
    cy.get('v-dialog').contains('Sincronizar edital?').should('be.visible');
    cy.get('v-select').select('Desenvolvimento de Software'); 
    cy.get('v-btn').contains('Definir para sincronização').click();
    cy.contains('Sincronização bem-sucedida!').should('be.visible'); 
  });

  it('Syncs multiple editais', () => {
    cy.visit('/definir-editais');
    cy.get('v-data-table tbody tr').each(($el) => {
      cy.wrap($el).find('v-checkbox input').check();
    });
    cy.get('v-btn').contains('Definir editais').click();
    cy.get('v-dialog').contains('Aplicar Área Técnica e importar editais em massa').should('be.visible');
    cy.get('v-select').select('Infraestrutura de TI'); 
    cy.get('v-btn').contains('Definir para sincronização').click();
    cy.contains('Sincronizado com sucesso!').should('be.visible');
  });

  it('Displays synchronized editais', () => {
    cy.visit('/definir-editais');
    cy.contains('Editais a sincronizar').should('be.visible');
    cy.get('v-data-table').should('be.visible');
  });

  it('Searches synchronized editais', () => {
    cy.visit('/definir-editais');
    cy.get('v-text-field[label="Pesquisar Edital"]').type('Pesquisa'); 
    cy.get('v-btn').contains('Buscar').click();
    cy.get('v-data-table tbody tr').each(($el) => {
      cy.wrap($el).contains('Pesquisa'); 
    });
  });

  it('Views details of a synchronized edital', () => {
    cy.visit('/definir-editais');
    cy.get('v-data-table tbody tr').first().find('v-icon.mdi-eye').click();
    cy.url().should('include', '/DetalhesEdital/'); 
  });

  it('Handles no data scenarios', () => {
    cy.visit('/definir-editais');
    cy.get('v-text-field[label="Pesquisar Edital"]').type('NonExistentEdital');
    cy.get('v-btn').contains('Buscar').click();
    cy.contains('Sem dados!').should('be.visible');
  });

  it('Handles error scenarios gracefully', () => {
    cy.intercept({
      method: 'GET',
      url: '/api/editais' 
    }, {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('getEditaisError');

    cy.visit('/definir-editais');
    cy.wait('@getEditaisError');
    cy.contains('Erro ao buscar editais').should('be.visible'); 
  });
});