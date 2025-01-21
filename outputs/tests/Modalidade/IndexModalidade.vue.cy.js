/// <reference types="cypress" />

describe('Modalidades Page', () => {
  beforeEach(() => {
    cy.visit('/modalidades'); 
  });

  it('should display the page title correctly', () => {
    cy.contains('Modalidades').should('be.visible');
  });

  it('should display the breadcrumbs correctly', () => {
    cy.get('[data-test="breadcrumbs"]').should('be.visible'); 
  });

  it('should display the "Incluir Modalidade" button', () => {
    cy.get('[data-test="buttonIncluirModalidade"]').should('be.visible').and('contain', 'Incluir Modalidade');
  });

  it('should allow searching by keyword', () => {
    const keyword = 'testKeyword';
    cy.get('[data-test="inputPesquisarPalavraChave"]').type(keyword); 
    cy.get('[data-test="buttonBuscar"]').click();
    cy.get('[data-test="dataTableModalidades"] tbody tr').should(($rows) => {
      expect($rows).to.have.length.greaterThan(0); 
      $rows.each(($row) => {
        cy.wrap($row).find('td').each(($td) => {
          cy.wrap($td).invoke('text').should('include', keyword); 
        });
      });
    });
  });

  it('should clear the search input', () => {
    cy.get('[data-test="inputPesquisarPalavraChave"]').type('keyword').clear().should('have.value', '');
  });

  it('should display the data table', () => {
    cy.get('[data-test="dataTableModalidades"]').should('be.visible');
  });

  it('should handle pagination', () => {
    let initialPageCount = 0;
    cy.get('[data-test="dataTableModalidades"] tbody tr').then(($rows) => {
      initialPageCount = $rows.length;
    });

    if (initialPageCount > 5) { 
      cy.get('.v-data-table__pagination').contains('Next').click();
      cy.get('[data-test="dataTableModalidades"] tbody tr').should(($rows) => {
        expect($rows).to.have.length.greaterThan(0);
      });
    }
  });

  it('should display "Não há dados para serem exibidos!" when no data is available', () => {
    cy.intercept('/api/modalidades', { body: [] }).as('getModalidades'); 
    cy.visit('/modalidades');
    cy.wait('@getModalidades');
    cy.get('[data-test="dataTableModalidades"]').contains('Não há dados para serem exibidos!').should('be.visible');
  });

  it('should allow viewing details of a modalidade', () => {
    cy.get('[data-test="linkSigla"]').first().click(); 
    cy.url().should('include', '/modalidade/DetailsModalidade/'); 
  });

  it('should allow editing a modalidade', () => {
    cy.get('[data-test="iconEdit"]').first().click(); 
    cy.url().should('include', '/modalidade/EditModalidade/'); 
  });

  it('should handle loading state', () => {
    cy.intercept('/api/modalidades', { fixture: 'modalidades.json' }).as('getModalidades');
    cy.visit('/modalidades');
    cy.wait('@getModalidades');
    cy.get('.v-skeleton-loader').should('not.exist');
  });


  it('should display the correct number of items per page', () => {
    cy.get('.v-select__selections').click(); 
    cy.get('.v-list-item__title').contains('5').click(); 
    cy.get('[data-test="dataTableModalidades"] tbody tr').should('have.length', 5); 

    cy.get('.v-select__selections').click(); 
    cy.get('.v-list-item__title').contains('10').click(); 
    cy.get('[data-test="dataTableModalidades"] tbody tr').should('have.length', 10); 
  });

  it('should sort the table by Sigla (ascending)', () => {
    cy.get('[data-test="dataTableModalidades"] th').contains('Sigla').click(); 
    cy.get('[data-test="dataTableModalidades"] tbody tr').then(($rows) => {
      const siglas = [];
      $rows.each(($row) => {
        siglas.push(Cypress.$($row).find('td:first').text());
      });
      expect(siglas).to.be.sorted(); 
    });
  });

  it('should handle errors gracefully', () => {
    cy.intercept('/api/modalidades', { statusCode: 500 }).as('getModalidadesError');
    cy.visit('/modalidades');
    cy.wait('@getModalidadesError');
    cy.contains('Error fetching data').should('be.visible');
  });

  it('should test the "Incluir Modalidade" button functionality', () => {
    cy.get('[data-test="buttonIncluirModalidade"]').click();
    cy.url().should('include', '/modalidade/CreateModalidade'); 
  });

  it('should handle empty search', () => {
    cy.get('[data-test="inputPesquisarPalavraChave"]').clear();
    cy.get('[data-test="buttonBuscar"]').click();
  });
});