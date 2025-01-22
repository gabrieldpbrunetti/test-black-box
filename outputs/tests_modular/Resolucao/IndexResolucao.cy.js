/// <reference types="cypress" />

describe('Resoluções', () => {
  beforeEach(() => {
    // Assuming you have a login mechanism, adapt as needed.
    // cy.login(); 
  });

  it('Deve exibir a lista de resoluções ao carregar a página', () => {
    cy.visit('/resolucao/IndexResolucao'); 
    cy.contains('Resoluções').should('be.visible'); 
    cy.get('v-data-table').should('be.visible'); 
    cy.get('tbody tr').should('have.length.greaterThan', 0); 
  });


  it('Deve exibir um esqueleto de carregamento enquanto os dados são carregados', () => {
    cy.intercept('/api/resolucoes', { fixture: 'emptyResolucoes.json' }).as('getResolucoes'); 
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.get('v-skeleton-loader').should('be.visible'); 
  });

  it('Deve permitir adicionar uma nova resolução', () => {
    cy.visit('/resolucao/IndexResolucao');
    cy.contains('Incluir Resolução').click();
    cy.url().should('include', '/resolucao/formResolucao'); 
  });

  it('Deve permitir filtrar resoluções por número', () => {
    cy.visit('/resolucao/IndexResolucao');
    cy.get('#filterType').select('Número da Resolução'); //Using more specific selector if available
    cy.get('v-text-field').type('123'); 
    cy.contains('Buscar').click();
    cy.get('tbody tr').each(($el) => { 
      cy.wrap($el).contains('123'); 
    });
  });

  it('Deve permitir filtrar resoluções por ementa', () => {
    cy.visit('/resolucao/IndexResolucao');
    cy.get('#filterType').select('Ementa'); //Using more specific selector if available
    cy.get('v-text-field').type('sample ementa text'); 
    cy.contains('Buscar').click();
    cy.get('tbody tr').each(($el) => { 
      cy.wrap($el).contains('sample ementa text'); 
    });
  });

  it('Deve permitir editar uma resolução existente', () => {
    cy.visit('/resolucao/IndexResolucao');
    cy.get('tbody tr').first().find('i.mdi-pencil').click(); 
    cy.url().should('include', '/resolucao/formResolucao/'); 
  });

  it('Deve permitir visualizar detalhes de uma resolução', () => {
    cy.visit('/resolucao/IndexResolucao');
    cy.get('tbody tr').first().find('a').click(); 
    cy.url().should('include', '/resolucao/DetailsResolucao/'); 
  });

  it('Deve permitir excluir uma resolução', () => {
    cy.visit('/resolucao/IndexResolucao');
    const initialRowCount = cy.get('tbody tr').length;
    cy.get('tbody tr').first().find('i.mdi-delete').click(); 
    cy.contains('Tem certeza que deseja deletar esse item?').should('be.visible');
    cy.contains('OK').click();
    cy.get('tbody tr').should('have.length', initialRowCount -1);
  });

  it('Deve exibir mensagem de erro ao tentar excluir uma resolução vinculada', () => {
    cy.intercept('/api/resolucoes/*', { statusCode: 400, body: { message: 'Resolução vinculada a um projeto' } }).as('deleteResolucao');
    cy.visit('/resolucao/IndexResolucao');
    cy.get('tbody tr').first().find('i.mdi-delete').click();
    cy.wait('@deleteResolucao');
    cy.contains('Não foi possível apagar').should('be.visible');
  });

  it('Deve abrir o link externo corretamente', () => {
    cy.visit('/resolucao/IndexResolucao');
    cy.get('tbody tr').first().find('i.mdi-link').click(); 
    // Assertion to check if the link opened in a new tab or window.  This is tricky in Cypress and might require a different approach.
    // One option is to check if the URL changes, but this depends on your link target.  Consider using cy.window().location to check the URL.
  });

  it('Deve exibir mensagem de erro para link inválido', () => {
    cy.visit('/resolucao/IndexResolucao');
    cy.stub(window, 'open').as('windowOpen');
    cy.get('tbody tr').first().find('i.mdi-link').click();
    cy.get('@windowOpen').should('not.have.been.called');
    cy.contains('Link inválido').should('be.visible');
  });

  it('Deve exibir mensagem "Não há dados disponíveis" quando não houver resoluções', () => {
    cy.intercept('/api/resolucoes', { fixture: 'emptyResolucoes.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.contains('Não há dados disponíveis').should('be.visible');
  });

  it('Deve paginar os resultados corretamente', () => {
    cy.visit('/resolucao/IndexResolucao');
    // This test requires a large dataset to effectively test pagination.
    // You'll need to add assertions to check the number of items per page, the total number of pages, and the ability to navigate between pages.  Look for pagination elements in your v-data-table.
  });

  it('Deve lidar com erros na API', () => {
    cy.intercept('/api/resolucoes', { statusCode: 500 }); 
    cy.visit('/resolucao/IndexResolucao');
    // Add assertions to check for error handling, e.g., an error message or a loading indicator that persists
    // ... (You'll need to add assertions based on your expected error handling)
  });
});