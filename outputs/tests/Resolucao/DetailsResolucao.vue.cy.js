/// <reference types="cypress" />

describe('Resolução Form', () => {
  beforeEach(() => {
    cy.visit('/resolucao/create'); 
  });

  it('Successfully submits a new resolution', () => {
    const resolutionNumber = '1234';
    const resolutionDate = '2024-03-15';
    const resolutionSummary = 'This is a test resolution summary.';
    const resolutionLink = 'https://fapes.es.gov.br/testlink';
    const eDocsNumber = 'WTC-12345';

    cy.get('v-text-field[type="number"]').type(resolutionNumber);
    cy.get('v-text-field[type="date"]').type(resolutionDate);
    cy.get('v-textarea').type(resolutionSummary);
    cy.get('v-text-field[placeholder="https://fapes.es.gov.br/..."').type(resolutionLink);
    cy.get('v-text-field[placeholder="EX: WTC-10192"]').type(eDocsNumber);
    cy.contains('Incluir resolução').click();

    cy.url().should('include', '/resolucao/IndexResolucao'); 
    // Add assertions to check if the resolution was added to the database.  This requires backend interaction or checking the UI for the new resolution.
  });


  it('Displays validation errors for invalid inputs', () => {
    cy.get('v-text-field[type="number"]').type('-1');
    cy.get('v-textarea').type('This is a very long summary that exceeds the 500 character limit.'.repeat(10));
    cy.get('v-text-field[placeholder="https://fapes.es.gov.br/..."').type('invalid-link');
    cy.contains('Incluir resolução').click();

    cy.contains('Número inválido').should('be.visible');
    cy.contains('Ementa não pode ter mais de 500 caracteres.').should('be.visible');
    cy.contains('Link inválido').should('be.visible');
  });

  it('Successfully updates an existing resolution', () => {
    cy.intercept('GET', '/api/resolucao/*').as('getResolution'); 
    cy.intercept('PUT', '/api/resolucao/*').as('updateResolution'); 
    cy.visit('/resolucao/edit/1'); 

    cy.wait('@getResolution');

    cy.get('v-text-field[type="number"]').clear().type('5678'); 
    cy.contains('Alterar resolução').click();
    cy.wait('@updateResolution');

    cy.url().should('include', '/resolucao/IndexResolucao'); 
    // Add assertions to verify the resolution was updated in the database.
  });

  it('Successfully deletes a resolution', () => {
    cy.intercept('DELETE', '/api/resolucao/*').as('deleteResolution'); 
    cy.visit('/resolucao/edit/1'); 

    cy.contains('Excluir resolução').click();
    cy.contains('Excluir').click();
    cy.wait('@deleteResolution');

    cy.url().should('include', '/resolucao/IndexResolucao'); 
    // Add assertions to verify the resolution was deleted from the database.
  });

  it('Handles the cancellation of resolution deletion', () => {
    cy.visit('/resolucao/edit/1'); 
    cy.contains('Excluir resolução').click();
    cy.contains('Cancelar').click();

    cy.contains('Alterar resolução').should('be.visible'); 
  });

  it('Character counter for Ementa works correctly', () => {
    cy.get('v-textarea').type('a'.repeat(500));
    cy.contains('500/500 caracteres').should('be.visible');
    cy.get('v-textarea').type('a');
    cy.contains('501/500 caracteres').should('be.visible').and('have.class', 'text-danger');
  });

  it('Correctly handles the date input', () => {
    cy.get('v-text-field[type="date"]').type('2024-03-15');
    cy.get('v-text-field[type="date"]').should('have.value', '2024-03-15');
  });

  it('Handles deletion failure gracefully', () => {
    cy.intercept('DELETE', '/api/resolucao/*', { statusCode: 500, body: { message: 'Failed to delete resolution' } }).as('deleteResolution');
    cy.visit('/resolucao/edit/1'); 

    cy.contains('Excluir resolução').click();
    cy.contains('Excluir').click();
    cy.wait('@deleteResolution');

    cy.contains('Não foi possível apagar, pois a resolução está vinculada a um projeto').should('be.visible'); 
  });

  it('Shows correct breadcrumbs', () => {
    cy.get('.v-breadcrumbs').contains('Resolução').should('be.visible');
    cy.get('.v-breadcrumbs').contains('Incluir nova resolução').should('be.visible'); 
  });
});