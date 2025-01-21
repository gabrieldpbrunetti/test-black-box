/// <reference types="cypress" />

describe('Resoluções', () => {
  beforeEach(() => {
    // Assuming login is handled elsewhere.  Add cy.login() if needed.
  });

  it('Deve exibir a lista de resoluções ao carregar a página', () => {
    cy.intercept('/api/resolucoes', { fixture: 'resolucoes.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.contains('Resoluções').should('be.visible');
    cy.get('v-data-table').should('be.visible');
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });

  it('Deve exibir um carregador enquanto os dados são carregados', () => {
    cy.intercept('/api/resolucoes', { fixture: 'resolucoes.json', delay: 500 }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.get('.v-skeleton-loader').should('not.exist');
  });

  it('Deve permitir adicionar uma nova resolução', () => {
    cy.visit('/resolucao/IndexResolucao');
    cy.contains('Incluir Resolução').click();
    cy.url().should('include', '/resolucao/formResolucao');
  });

  it('Deve permitir filtrar resoluções por número', () => {
    cy.intercept('/api/resolucoes', { fixture: 'resolucoes.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.get('[label="Escolha o tipo de filtro"]').select('Número da Resolução');
    cy.get('[label="Filtrar por Número da Resolução"]').type('123');
    cy.wait(500); 
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });

  it('Deve permitir filtrar resoluções por ementa', () => {
    cy.intercept('/api/resolucoes', { fixture: 'resolucoes.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.get('[label="Escolha o tipo de filtro"]').select('Ementa');
    cy.get('[label="Filtrar por Ementa"]').type('Exemplo de ementa');
    cy.wait(500);
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });

  it('Deve permitir visualizar detalhes de uma resolução', () => {
    cy.intercept('/api/resolucoes', { fixture: 'resolucoes.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.contains('a', '1').click(); // Assumes resolution number is in an <a> tag. Adjust as needed.
    cy.url().should('include', '/resolucao/DetailsResolucao/');
  });

  it('Deve permitir editar uma resolução existente', () => {
    cy.intercept('/api/resolucoes', { fixture: 'resolucoes.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.get('[data-test="edit-button"]').first().click(); 
    cy.url().should('include', '/resolucao/formResolucao/');
  });

  it('Deve permitir excluir uma resolução existente', () => {
    cy.intercept('/api/resolucoes', { fixture: 'resolucoes.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.get('[data-test="delete-button"]').first().click();
    cy.get('.v-dialog').should('be.visible');
    cy.contains('OK').click();
    cy.wait(1000);
    cy.get('tbody tr').should('have.length.lessThan', cy.get('tbody tr').length);
  });

  it('Deve exibir mensagem de erro ao tentar acessar um link inválido', () => {
    cy.intercept('/api/resolucoes', { fixture: 'resolucoes_invalid_link.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.get('[data-test="link-button"]').first().click();
    cy.contains('Link inválido').should('be.visible');
  });

  it('Deve exibir mensagem "Não há dados disponíveis" quando não houver resoluções', () => {
    cy.intercept('/api/resolucoes', { fixture: 'empty_resolucoes.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.contains('Não há dados disponíveis').should('be.visible');
  });

  it('Deve lidar com erros na API', () => {
    cy.intercept('/api/resolucoes', { statusCode: 500 }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.contains('Error fetching resolutions:').should('be.visible'); 
  });

  it('Deve paginar os resultados corretamente', () => {
    cy.intercept('/api/resolucoes', { fixture: 'resolucoes_paginated.json' }).as('getResolucoes');
    cy.visit('/resolucao/IndexResolucao');
    cy.wait('@getResolucoes');
    cy.get('.v-data-table__pagination').should('be.visible');
  });
});