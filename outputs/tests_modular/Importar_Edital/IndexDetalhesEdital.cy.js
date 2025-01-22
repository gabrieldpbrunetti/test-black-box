/// <reference types="cypress" />

describe('Visualizar Edital', () => {
  let editalId;
  let editalNome;
  let editalAreaTecnica;

  beforeEach(() => {
    editalId = Cypress.env('editalId') || 1; // Use environment variable or default to 1
    editalNome = Cypress.env('editalNome') || 'Nome do Edital de Teste';
    editalAreaTecnica = Cypress.env('editalAreaTecnica') || 'Área Técnica de Teste';
    cy.intercept('GET', `/api/edital/${editalId}`, { fixture: 'edital.json' }).as('getEdital'); 
    cy.visit(`/importaredital/VisualizarEdital/${editalId}`); 
    cy.wait('@getEdital');
  });

  it('should display edital details correctly', () => {
    cy.contains('strong', 'NOME DO EDITAL:').next().should('contain', editalNome); 
    cy.contains('strong', 'ÁREA TÉCNICA:').next().should('contain', editalAreaTecnica); 
    cy.contains('strong', 'PROJETOS COMPLETOS:').next().should('be.visible'); 
    cy.contains('strong', 'ALOCAÇÕES COMPLETAS:').next().should('be.visible'); 
  });

  it('should allow searching for projects', () => {
    const searchTerm = Cypress.env('searchProject') || 'search term';
    cy.get('v-text-field[label="Pesquise o nome do edital"]').type(searchTerm);
    cy.get('v-btn').contains('Buscar').click();
    cy.get('v-data-table').should(($table) => {
      if ($table.find('tbody tr').length > 0) {
        $table.find('tbody tr').each(($row) => {
          cy.wrap($row).should('contain', searchTerm);
        });
      } else {
        cy.contains('Sem dados!').should('be.visible');
      }
    });
  });


  it('should display projects in a data table', () => {
    cy.get('v-data-table').should('be.visible');
    cy.get('v-data-table tbody tr').should(($rows) => {
      expect($rows).to.have.length.greaterThan(0);
    });
  });

  it('should navigate to project details page', () => {
    cy.get('v-data-table tbody tr a').first().click(); 
    cy.url().should('include', '/importaredital/FormProjeto/');
  });

  it('should handle pagination correctly', () => {
    cy.get('[data-testid="items-per-page-select"]').then(($select) => {
      if ($select.length > 0) {
        cy.wrap($select).select('25'); 
        cy.get('v-data-table tbody tr').should('have.length.greaterThan', 0);
      }
    });
  });

  it('should handle empty search results', () => {
    cy.get('v-text-field[label="Pesquise o nome do edital"]').type('nonexistent term');
    cy.get('v-btn').contains('Buscar').click();
    cy.contains('Sem dados!').should('be.visible'); 
  });

  it('should handle errors gracefully', () => {
    cy.intercept('GET', `/api/edital/${editalId}`, { statusCode: 500 }).as('getEditalError');
    cy.reload();
    cy.wait('@getEditalError');
    cy.contains('Error fetching data').should('be.visible'); 
  });

  it('should allow navigation back', () => {
    cy.get('.navigate-back').click({force: true});
    cy.url().should('not.include', `/importaredital/VisualizarEdital/${editalId}/`); 
  });

  it('should display correct status for projects', () => {
    cy.get('v-data-table').contains('COMPLETO').should('have.class', 'text-success');
    cy.get('v-data-table').contains('INCOMPLETO').should('have.class', 'text-error');
  });

  it('should display the correct number of completed projects and allocations', () => {
    cy.get('p:contains("PROJETOS COMPLETOS:")').next().should('be.visible'); 
    cy.get('p:contains("ALOCAÇÕES COMPLETAS:")').next().should('be.visible'); 
  });
});