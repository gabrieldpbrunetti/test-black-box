/// <reference types="cypress"/>

describe('Resolução Form', () => {
  beforeEach(() => {
    cy.visit('/resolucao/create'); 
  });

  it('Successfully submits a valid form', () => {
    const resolutionNumber = 123;
    const publicationDate = '2024-03-15';
    const ementa = 'This is a test ementa.';
    const publicationLink = 'https://fapes.es.gov.br/testlink';
    const eDocsNumber = 'WTC-10192';

    cy.get('v-text-field[type="number"]').type(resolutionNumber);
    cy.get('v-text-field[type="date"]').type(publicationDate);
    cy.get('v-textarea').type(ementa);
    cy.get('v-text-field[placeholder="https://fapes.es.gov.br/"]').type(publicationLink);
    cy.get('v-text-field[placeholder="EX: WTC-10192"]').type(eDocsNumber);
    cy.contains('Incluir resolução').click();

    cy.url().should('not.include', '/create'); 
    cy.contains('Salvo com sucesso!').should('be.visible'); 
  });

  it('Displays error messages for invalid inputs', () => {
    cy.get('v-text-field[type="number"]').type('-1');
    cy.get('v-text-field[type="date"]').type('invalid date');
    cy.get('v-textarea').type(''.padEnd(501, 'a')); 
    cy.get('v-text-field[placeholder="https://fapes.es.gov.br/"]').type('invalid link');
    cy.contains('Incluir resolução').click();

    cy.contains('Número inválido').should('be.visible'); 
    cy.contains('Ementa inválida!').should('be.visible'); 
    cy.contains('Link inválido!').should('be.visible'); 

  });

  it('Handles large resolution numbers', () => {
    const largeNumber = 2147483648; 
    cy.get('v-text-field[type="number"]').type(largeNumber);
    cy.get('v-text-field[type="date"]').type('2024-03-15');
    cy.get('v-textarea').type('Test Ementa');
    cy.get('v-text-field[placeholder="https://fapes.es.gov.br/"]').type('https://fapes.es.gov.br/test');
    cy.get('v-text-field[placeholder="EX: WTC-10192"]').type('WTC-10192');
    cy.contains('Incluir resolução').click();
    cy.contains('Número inválido!').should('be.visible'); 
  });

  it('Handles empty fields', () => {
    cy.contains('Incluir resolução').click();
    cy.contains('O número da resolução deve ser maior que zero.').should('be.visible'); 
    cy.contains('Ementa não pode ter mais de 500 caracteres.').should('be.visible'); 
    cy.contains('O link deve ser do domínio da FAPES.').should('be.visible'); 

  });

  it('Navigates back to the list', () => {
    cy.contains('Voltar').click();
    cy.url().should('include', '/resolucao/IndexResolucao'); 
  });

  it('Successfully updates an existing resolution', () => {
    cy.intercept('GET', '/api/modalidadebolsa/resolucao/*').as('getResolution');
    cy.intercept('PUT', '/api/modalidadebolsa/resolucao/*').as('updateResolution');
    cy.visit('/resolucao/edit/1'); 
    cy.wait('@getResolution');

    cy.get('v-text-field[type="number"]').clear().type('456');
    cy.get('v-text-field[type="date"]').clear().type('2024-04-20');
    cy.get('v-textarea').clear().type('Updated Ementa');
    cy.get('v-text-field[placeholder="https://fapes.es.gov.br/"]').clear().type('https://fapes.es.gov.br/updated');
    cy.get('v-text-field[placeholder="EX: WTC-10192"]').clear().type('WTC-10193');
    cy.contains('Alterar resolução').click();
    cy.wait('@updateResolution');
    cy.contains('Salvo com sucesso!').should('be.visible'); 
  });

  it('Character counter for Ementa works correctly', () => {
    cy.get('v-textarea').type('a'.repeat(500));
    cy.get('v-label').contains('500/500 caracteres').should('be.visible');
    cy.get('v-textarea').type('a');
    cy.get('v-label').contains('501/500 caracteres').should('be.visible').and('have.class', 'text-danger');
  });

  it('Correctly handles array params for ID', () => {
    cy.visit('/resolucao/edit/[1,2]'); 
    cy.contains('Alterar Resolução').should('be.visible'); 
  });
});