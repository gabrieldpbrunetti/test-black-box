/// <reference types="cypress"/>

describe('Editais com erro na sincronização', () => {
  beforeEach(() => {
    cy.visit('/editais-erro-sincronizacao'); 
  });

  it('Deve exibir a lista de editais com erro na sincronização', () => {
    cy.get('v-data-table').should('be.visible'); 
    cy.get('v-data-table tbody tr').should('have.length.greaterThan', 0); 
  });

  it('Deve exibir uma mensagem "Sem dados!" quando não houver editais com erro', () => {
    cy.intercept('/api/editais', { fixture: 'emptyEditais.json' }).as('getEditais'); 

    cy.visit('/editais-erro-sincronizacao'); 

    cy.wait('@getEditais');
    cy.contains('Sem dados!').should('be.visible');
  });

  it('Deve permitir pesquisar editais pelo nome', () => {
    const searchTerm = 'Análise de Dados';
    cy.get('v-text-field[label="Pesquisar o nome do edital"]').type(searchTerm);
    cy.get('v-btn').contains('Buscar').click(); 
    cy.get('tbody tr').each(($el) => {
      cy.wrap($el).contains(searchTerm); 
    });
    cy.get('v-text-field[label="Pesquisar o nome do edital"]').clear().type('{enter}');
    cy.get('tbody tr').should('have.length.greaterThan', 0);

  });

  it('Deve exibir um indicador de carregamento enquanto os dados são carregados', () => {
    cy.get('v-skeleton-loader').should('be.visible'); 
    cy.wait(1000); 
    cy.get('v-skeleton-loader').should('not.exist'); 
    cy.get('v-data-table').should('be.visible'); 
  });

  it('As colunas do Data Table devem conter os dados corretos', () => {
    cy.get('v-data-table tbody tr').each(($row) => {
      cy.wrap($row).find('td').each(($col, index) => {
        if (index === 0) { 
          cy.wrap($col).invoke('text').should('match', /^[a-zA-Z0-9\/\s-]+$/); 
        } else if (index === 1) { 
          cy.wrap($col).invoke('text').should('match', /^\d{2}\/\d{2}\/\d{4}$/); 
        } else if (index === 2) {
          cy.wrap($col).invoke('text').should('match', /^\d{2}\/\d{2}\/\d{4}$/);
        } else if (index === 3) {
          cy.wrap($col).invoke('text').should('match', /Não importado|Importado/);
        } else if (index === 4) {
          cy.wrap($col).invoke('text').should('match', /[A-Za-z ]+/);
        }
      });
    });
  });

  it('Teste de tratamento de erro de API', () => {
    cy.intercept('/api/editais', {
      statusCode: 500,
      body: { error: 'Erro na API' }
    }).as('getEditaisError');

    cy.visit('/editais-erro-sincronizacao');
    cy.wait('@getEditaisError');
    cy.contains('Erro na API').should('be.visible'); // Adicione uma asserção para verificar a mensagem de erro exibida
  });

  it('Deve exibir as colunas corretas na tabela', () => {
    cy.get('v-data-table thead th').should('have.length', 5); 
    cy.get('v-data-table thead th').eq(0).should('contain', 'Edital');
    cy.get('v-data-table thead th').eq(1).should('contain', 'Data Início');
    cy.get('v-data-table thead th').eq(2).should('contain', 'Data Fim');
    cy.get('v-data-table thead th').eq(3).should('contain', 'Status');
    cy.get('v-data-table thead th').eq(4).should('contain', 'Área Técnica');
  });
});