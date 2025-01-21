/// <reference types="cypress" />

describe('Edital Importation System', () => {
  beforeEach(() => {
    cy.login(); 
  });

  it('Displays unsynchronized editais', () => {
    cy.visit('/definir-editais'); 
    cy.contains('Editais do SIGFAPES disponíveis para importar para o CONECTAFAPES').should('be.visible');
    cy.contains('Editais não sincronizados').should('be.visible');
    cy.get('v-data-table').should('be.visible'); 
    cy.contains('Edital de Pesquisa 2024').should('be.visible'); 
  });

  it('Allows searching unsynchronized editais', () => {
    cy.visit('/definir-editais');
    cy.get('v-text-field[label="Pesquisar Edital"]').type('Pesquisa');
    cy.get('v-data-table').should('contain', 'Edital de Pesquisa 2024'); 
    cy.get('v-text-field[label="Pesquisar Edital"]').clear().type('Inovação');
    cy.get('v-data-table').should('contain', 'Edital de Inovação Tecnológica');
  });

  it('Allows selecting and syncing multiple editais', () => {
    cy.visit('/definir-editais');
    cy.get('v-checkbox').check({multiple: true}); 
    cy.get('v-btn[color="primary"][@click="showEditaisModal"]').click();
    cy.get('v-select').select('Desenvolvimento de Software'); 
    cy.get('v-btn[color="primary"][@click="confirmSync"]').click();
    cy.contains('Sincronizado com sucesso!').should('be.visible'); 
  });

  it('Handles no unsynchronized editais', () => {
    cy.visit('/definir-editais');
    cy.contains('Sem dados!').should('be.visible'); 
  });

  it('Displays synchronized editais', () => {
    cy.visit('/definir-editais');
    cy.contains('Editais a sincronizar').should('be.visible');
    cy.get('v-data-table:nth-of-type(2)').should('be.visible'); 
  });

  it('Allows searching synchronized editais', () => {
    cy.visit('/definir-editais');
    cy.get('v-text-field[label="Pesquisar Edital"]:nth-of-type(2)').type('Edital'); 
    cy.get('v-data-table:nth-of-type(2) tbody tr').should('contain', 'Edital');
  });

  it('Allows viewing details of a synchronized edital', () => {
    cy.visit('/definir-editais');
    cy.get('v-icon.mdi-eye').first().click(); 
    cy.url().should('include', '/importaredital/DetalhesEdital/'); 
  });

  it('Handles errors gracefully', () => {
    cy.intercept({
      method: 'POST', 
      url: '/api/editais/sync' 
    }, {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('syncError');

    cy.visit('/definir-editais');
    cy.get('v-checkbox').check({ multiple: true });
    cy.get('v-btn[color="primary"][@click="showEditaisModal"]').click();
    cy.get('v-select').select('Desenvolvimento de Software');
    cy.get('v-btn[color="primary"][@click="confirmSync"]').click();
    cy.wait('@syncError');
    cy.contains('Erro!').should('be.visible'); 
  });


  it('Synchronizes a single edital', () => {
    cy.visit('/definir-editais');
    cy.get('v-icon.mdi-swap-horizontal').first().click(); 
    cy.get('v-select').select('Desenvolvimento de Software');
    cy.get('v-btn[color="primary"][@click="confirmSyncs"]').click();
    cy.contains('Sincronização bem-sucedida!').should('be.visible');
  });

  it('Tests pagination', () => {
    cy.visit('/definir-editais');
    cy.get('.v-pagination__item--active').should('be.visible');
    cy.get('.v-pagination__item--next').click();
    cy.get('.v-pagination__item--active').should('not.have.text', '1');
  });

  it('Tests sorting', () => {
    cy.visit('/definir-editais');
    cy.get('th').contains('Edital').click();
    cy.get('v-data-table tbody tr').first().should('contain', 'Edital');
  });

  it('Tests no area tecnica selected', () => {
    cy.visit('/definir-editais');
    cy.get('v-checkbox').check({ multiple: true });
    cy.get('v-btn[color="primary"][@click="showEditaisModal"]').click();
    cy.get('v-btn[color="primary"][@click="confirmSync"]').click();
    cy.contains('Selecione um edital e uma área técnica antes de sincronizar').should('be.visible');
  });

  it('Displays correct date formats', () => {
    cy.visit('/definir-editais');
    cy.get('v-data-table td').contains('Data de lançamento').parents('tr').within(() => {
      cy.get('td:nth-child(3)').invoke('text').then((text) => {
        expect(text.trim()).to.match(/\d{2}\/\d{2}\/\d{4}/); 
      });
    });
  });

  it('Correctly maps status values', () => {
    cy.visit('/definir-editais');
    cy.contains('Não importado').should('not.exist'); 
    cy.contains('A importar').should('not.exist'); 
    cy.contains('Importado').should('not.exist'); 
  });

  it('Shows a modal for single edital sync', () => {
    cy.visit('/definir-editais');
    cy.get('v-icon.mdi-swap-horizontal').first().click(); 
    cy.get('v-dialog').should('be.visible'); 
    cy.get('v-select').select('Desenvolvimento de Software');
    cy.get('v-btn[color="primary"][@click="confirmSyncs"]').click();
    cy.contains('Sincronização bem-sucedida!').should('be.visible'); 
  });
});