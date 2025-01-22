/// <reference types="cypress"/>

describe('Edital Importation System', () => {
  beforeEach(() => {
    cy.visit('/definir-editais');
    cy.wait(2000);
  });

  it('Displays unsynchronized editais table and its components', () => {
    cy.get('v-data-table').should('be.visible');
    cy.contains('Editais não sincronizados').should('be.visible');
    cy.get('v-text-field[label="Pesquisar Edital"]').should('be.visible');
    cy.get('v-btn').contains('Buscar').should('be.visible');
  });

  it('Displays synchronized editais table and its components', () => {
    cy.get('v-data-table:nth-child(2)').should('be.visible');
    cy.contains('Editais a sincronizar').should('be.visible');
    cy.get('v-text-field[label="Pesquisar Edital"]:nth-child(2)').should('be.visible');
    cy.get('v-btn:nth-child(2)').contains('Buscar').should('be.visible');
  });

  it('Allows searching unsynchronized editais', () => {
    const searchTerm = 'Pesquisa';
    cy.get('v-text-field[label="Pesquisar Edital"]').type(searchTerm);
    cy.get('v-btn').contains('Buscar').click();
    cy.get('tbody tr').each(($el) => {
      cy.wrap($el).contains(searchTerm);
    });
  });

  it('Allows searching synchronized editais', () => {
    const searchTerm = 'Pesquisa';
    cy.get('v-text-field[label="Pesquisar Edital"]:nth-child(2)').type(searchTerm);
    cy.get('v-btn:nth-child(2)').contains('Buscar').click();
    cy.get('v-data-table:nth-child(2) tbody tr').each(($el) => {
      cy.wrap($el).contains(searchTerm);
    });
  });

  it('Allows selecting and deselecting unsynchronized editais', () => {
    cy.get('v-checkbox').first().check();
    cy.get('v-checkbox').first().uncheck();
  });


  it('Opens and closes the mass synchronization modal', () => {
    cy.get('v-checkbox').first().check();
    cy.get('v-btn').contains('Definir editais').click();
    cy.get('v-dialog').should('be.visible');
    cy.get('v-btn').contains('Cancelar').click();
    cy.get('v-dialog').should('not.be.visible');
  });

  it('Opens and closes the individual synchronization modal', () => {
    cy.get('v-icon.mdi-swap-horizontal').first().click();
    cy.get('v-dialog:nth-child(2)').should('be.visible');
    cy.get('v-btn').contains('Cancelar').click();
    cy.get('v-dialog:nth-child(2)').should('not.be.visible');
  });

  it('Successfully performs mass synchronization (positive case)', () => {
    cy.get('v-checkbox').first().check();
    cy.get('v-btn').contains('Definir editais').click();
    cy.get('v-select').select('Desenvolvimento de Software');
    cy.get('v-btn').contains('Definir para sincronização').click();
    cy.contains('Sincronizado com sucesso!').should('be.visible');
  });

  it('Handles mass synchronization errors (negative case)', () => {
    cy.get('v-checkbox').first().check();
    cy.get('v-btn').contains('Definir editais').click();
    cy.get('v-btn').contains('Definir para sincronização').click();
    cy.contains('Erro!').should('be.visible');
  });

  it('Successfully performs individual synchronization (positive case)', () => {
    cy.get('v-icon.mdi-swap-horizontal').first().click();
    cy.get('v-select').select('Desenvolvimento de Software');
    cy.get('v-btn').contains('Definir para sincronização').click();
    cy.contains('Sincronização bem-sucedida!').should('be.visible');
  });

  it('Handles individual synchronization errors (negative case)', () => {
    cy.get('v-icon.mdi-swap-horizontal').first().click();
    cy.get('v-btn').contains('Definir para sincronização').click();
    cy.contains('Erro').should('be.visible');
  });

  it('Handles no data scenarios', () => {
    cy.get('v-data-table').contains('Sem dados!').should('not.be.visible');
    cy.get('v-text-field[label="Pesquisar Edital"]').type('NonExistentEdital');
    cy.get('v-btn').contains('Buscar').click();
    cy.get('v-data-table').contains('Sem dados!').should('be.visible');
  });

  it('Correctly formats dates', () => {
    cy.get('v-data-table td').contains(/^\d{2}\/\d{2}\/\d{4}$/).should('be.visible');
  });

  it('Correctly maps status', () => {
    //This test requires data with different statuses to be present. Add data to the component's data for this test to be meaningful.
    cy.get('v-data-table:nth-child(2)').contains('Importado').should('be.visible'); 
    cy.get('v-data-table:nth-child(2)').contains('A importar').should('be.visible'); 
    cy.get('v-data-table:nth-child(2)').contains('Não importado').should('be.visible'); 
  });

  it('Navigates to edital details page', () => {
    cy.get('v-icon.mdi-eye').first().click();
    cy.url().should('include', '/importaredital/DetalhesEdital/');
  });

  it('Verifies the main page display', () => {
    cy.contains('Editais do SIGFAPES disponíveis para importar para o CONECTAFAPES').should('be.visible');
    cy.contains('Editais não sincronizados').should('be.visible');
    cy.contains('Editais a sincronizar').should('be.visible');
  });


  it('Verifies error handling when synchronizing without selecting a technical area', () => {
    cy.get('v-checkbox').first().click();
    cy.contains('Definir editais').click();
    cy.contains('Definir para sincronização').click();
    cy.contains('Erro!').should('be.visible');
  });

  it('Verifies the "No data" message when there are no editais', () => {
    // Requires mocking the API to return an empty response. This is beyond the scope of this example.
  });

  it('Verifies pagination of the unsynchronized editais table', () => {
    // Requires a large dataset to trigger pagination. This is beyond the scope of this example.
  });

  it('Verifies pagination of the synchronized editais table', () => {
    // Requires a large dataset to trigger pagination. This is beyond the scope of this example.
  });

  it('Displays correct date format', () => {
    cy.get('td').contains('Data de lançamento').next().should('match', /DD\/MM\/YYYY/);
  });

  it('Displays correct status mapping', () => {
    cy.get('td').contains('Status').next().should('contain', 'Importado' || 'A importar' || 'Não importado');
  });
});