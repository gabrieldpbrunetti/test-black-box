/// <reference types="cypress" />

describe('Editais com erro na sincronização', () => {
  beforeEach(() => {
    cy.visit('/editais-erro-sincronizacao'); 
  });

  it('Deve exibir a lista de editais com erro', () => {
    cy.get('v-data-table').should('be.visible'); 
    cy.get('v-data-table tbody tr').should('have.length.greaterThan', 0); 
  });

  it('Deve exibir uma mensagem "Sem dados!" quando não houver editais com erro', () => {
    cy.intercept('GET', '/api/editais', { fixture: 'emptyEditais.json' }).as('getEditais'); 

    cy.visit('/editais-erro-sincronizacao'); 

    cy.wait('@getEditais');
    cy.contains('Sem dados!').should('be.visible');
  });

  it('Deve permitir pesquisar editais pelo nome', () => {
    cy.get('v-text-field[label="Pesquisar o nome do edital"]').type('Desenvolvimento Web');
    cy.get('v-btn').contains('Buscar').click();

    cy.contains('Edital 01/2024 - Desenvolvimento Web').should('be.visible');
    cy.contains('Edital 02/2024 - Análise de Dados').should('not.exist'); 
  });

  it('Deve exibir um loading indicator enquanto carrega os dados', () => {
    cy.get('v-skeleton-loader').should('be.visible'); 
    cy.wait(500); 
    cy.get('v-skeleton-loader').should('not.exist'); 
  });

  it('Deve exibir os detalhes corretos de cada edital', () => {
    cy.get('v-data-table tbody tr').each(($el) => {
      const editalName = $el.find('td').eq(0).text();
      const dataInicio = $el.find('td').eq(1).text();
      const dataFim = $el.find('td').eq(2).text();
      const status = $el.find('td').eq(3).text();
      const areaTecnica = $el.find('td').eq(4).text();

      expect(editalName).to.not.be.empty;
      expect(dataInicio).to.not.be.empty;
      expect(dataFim).to.not.be.empty;
      expect(status).to.not.be.empty;
      expect(areaTecnica).to.not.be.empty;
    });
  });

  it('Deve ordenar os editais corretamente (se a ordenação for implementada)', () => {
    cy.get('th').contains('Edital').click(); 
    // Add assertions to verify the sorting order.  This will depend on your implementation.
  });

  it('Deve exibir as colunas corretas na tabela', () => {
    cy.get('.v-data-table thead th').should('have.length', 5); 
    cy.get('.v-data-table thead th').eq(0).should('contain', 'Edital');
    cy.get('.v-data-table thead th').eq(1).should('contain', 'Data Início');
    cy.get('.v-data-table thead th').eq(2).should('contain', 'Data Fim');
    cy.get('.v-data-table thead th').eq(3).should('contain', 'Status');
    cy.get('.v-data-table thead th').eq(4).should('contain', 'Área Técnica');
  });

  it('Campo de pesquisa deve limpar o valor ao clicar no ícone de limpeza', () => {
    cy.get('v-text-field[label="Pesquisar o nome do edital"]').type('Teste');
    cy.get('v-text-field[label="Pesquisar o nome do edital"]').find('.v-input__clearable').click();
    cy.get('v-text-field[label="Pesquisar o nome do edital"]').should('have.value', '');
  });
});