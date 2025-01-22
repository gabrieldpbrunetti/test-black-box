/// <reference types="cypress" />

describe('Modalidades Page', () => {
  beforeEach(() => {
    cy.visit('/modalidades'); 
  });

  it('should display the page title', () => {
    cy.contains('Modalidades').should('be.visible');
  });

  it('should display the breadcrumbs', () => {
    cy.get('[data-test="BaseBreadcrumb"]').should('be.visible'); 
  });

  it('should display the "Incluir Modalidade" button', () => {
    cy.get('[data-test="buttonIncluirModalidade"]').should('be.visible');
  });

  it('should allow searching by keyword', () => {
    const keyword = 'testKeyword';
    cy.get('[data-test="inputPesquisarPalavraChave"]').type(keyword);
    cy.get('[data-test="buttonBuscar"]').click();
    cy.wait(1000); //Added a small wait to ensure the search results are loaded.
    cy.get('[data-test="dataTableModalidades"]').find('tbody tr').each(($el) => {
      cy.wrap($el).find('td').first().invoke('text').should('include', keyword);
    });
  });

  it('should display a data table of modalidades', () => {
    cy.get('[data-test="dataTableModalidades"]').should('be.visible');
  });

  it('should handle pagination', () => {
    cy.get('.v-pagination').should('be.visible');
    if (cy.get('.v-pagination__item').its('length').then(length => length > 1)) { 
        cy.get('.v-pagination__item').eq(1).click();
        cy.wait(1000); //Added a small wait to ensure page change is reflected.
        cy.get('[data-test="dataTableModalidades"]').should('be.visible');
    }
  });

  it('should display "Não há dados para serem exibidos!" when no data is available', () => {
    cy.intercept('/api/modalidades', { fixture: 'emptyModalidades.json' }).as('emptyModalidades');
    cy.reload();
    cy.wait('@emptyModalidades');
    cy.get('[data-test="dataTableModalidades"]').contains('Não há dados para serem exibidos!').should('be.visible');
  });

  it('should allow editing a modalidade', () => {
    cy.get('[data-test="iconEdit"]').first().click(); 
    cy.url().should('include', '/modalidade/EditModalidade/');
  });

  it('should allow viewing a modalidade', () => {
    cy.get('[data-test="iconView"]').first().click(); 
    cy.url().should('include', '/modalidade/DetailsModalidade/');
  });

  it('should handle clicking on Sigla link', () => {
    cy.get('[data-test="linkSigla"]').first().click(); 
    cy.url().should('include', '/modalidade/EditModalidade/').or(cy.url().should('include', '/modalidade/DetailsModalidade/'));
  });

  it('should show a skeleton loader while loading', () => {
    cy.intercept('/api/modalidades', { delay: 500 }).as('getModalidades');
    cy.visit('/modalidades'); 
    cy.get('.v-skeleton-loader').should('be.visible');
    cy.wait('@getModalidades'); 
    cy.get('.v-skeleton-loader').should('not.exist');
  });

  it('should handle errors gracefully', () => {
    cy.intercept('/api/modalidades', { statusCode: 500, body: { message: 'Internal Server Error' } }).as('apiError');
    cy.visit('/modalidades');
    cy.wait('@apiError');
    cy.contains('Internal Server Error').should('be.visible'); 
  });

  it('should navigate to CreateModalidade page when clicking "Incluir Modalidade"', () => {
    cy.get('[data-test="buttonIncluirModalidade"]').click();
    cy.url().should('include', '/modalidade/CreateModalidade');
  });

  it('should display edit icon for items in edition', () => {
    cy.intercept('GET', '/api/modalidades', { fixture: 'modalidadesWithEdition.json' }).as('getModalidadesWithEdition');
    cy.reload();
    cy.wait('@getModalidadesWithEdition');
    cy.get('[data-test="iconEdit"]').should('be.visible');
  });

  it('should display view icon for active items', () => {
    cy.intercept('GET', '/api/modalidades', { fixture: 'modalidadesWithActive.json' }).as('getModalidadesWithActive');
    cy.reload();
    cy.wait('@getModalidadesWithActive');
    cy.get('[data-test="iconView"]').should('be.visible');
  });

  it('should handle sorting', () => {
    cy.get('[data-test="dataTableModalidades"] th').first().click();
    cy.wait(1000);
    cy.get('[data-test="dataTableModalidades"] th').first().click();
    cy.wait(1000);
  });

  it('should handle clearing the search input', () => {
    cy.get('[data-test="inputPesquisarPalavraChave"]').type('keyword').clear();
    cy.get('[data-test="buttonBuscar"]').click();
    cy.wait(1000);
  });

  it('should handle pagination with large dataset', () => {
    cy.intercept('GET', '/api/modalidades', { fixture: 'modalidadesLargeDataset.json' }).as('getModalidadesLarge');
    cy.reload();
    cy.wait('@getModalidadesLarge');
    cy.get('[data-test="dataTableModalidades"] .v-data-table__pagination').should('be.visible');
    cy.get('.v-pagination__item--active').next().click();
    cy.wait(1000);
  });
});