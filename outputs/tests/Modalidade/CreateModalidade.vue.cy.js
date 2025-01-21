/// <reference types="cypress"/>

describe('Modalidade de Bolsa Form', () => {
  beforeEach(() => {
    cy.visit('/path/to/your/form'); 
  });

  it('should successfully submit the form with valid data', () => {
    cy.get('[data-test="selectResolucao"]').select('Resolução 1'); 
    cy.get('[data-test="inputModalidadeSigla"]').type('BPIG');
    cy.get('[data-test="inputModalidadeNome"]').type('Bolsa de Pesquisa');
    cy.get('[data-test="textareaModalidadeDescricao"]').type('Descrição da bolsa de pesquisa.');
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-01-01'); 
    cy.get('[data-test="checkboxReducaoPorVinculo"]').check();
    cy.get('[data-test="inputReducaoPorVinculo"]').type('50');
    cy.get('[data-test="selectModalidadesAcumulativas"]').select(['id1', 'id2']); 
    cy.get('[data-test="buttonSalvar"]').click();
    cy.url().should('include', '/path/to/success/page'); 
  });

  it('should display error messages for missing required fields', () => {
    cy.get('[data-test="buttonSalvar"]').click();
    cy.get('[data-test="selectResolucao"] + .v-messages__message').should('be.visible');
    cy.get('[data-test="inputModalidadeSigla"] + .v-messages__message').should('be.visible');
    cy.get('[data-test="inputModalidadeNome"] + .v-messages__message').should('be.visible');
    cy.get('[data-test="textareaModalidadeDescricao"] + .v-messages__message').should('be.visible');
    cy.get('[data-test="inputDataInicioVigencia"] + .v-messages__message').should('be.visible');
  });

  it('should handle invalid data input', () => {
    cy.get('[data-test="selectResolucao"]').select('Resolução 1');
    cy.get('[data-test="inputModalidadeSigla"]').type('Invalid Sigla'); 
    cy.get('[data-test="inputModalidadeNome"]').type('Nome muito longo que excede o limite de 100 caracteres.');
    cy.get('[data-test="textareaModalidadeDescricao"]').type('Descrição muito longa que excede o limite de 500 caracteres. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
    cy.get('[data-test="inputReducaoPorVinculo"]').type('101'); 
    cy.get('[data-test="inputDataInicioVigencia"]').type('invalid date');
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('Erro ao salvar!').should('be.visible'); 
  });

  it('should enable/disable fields correctly', () => {
    cy.get('[data-test="checkboxReducaoPorVinculo"]').check();
    cy.get('[data-test="inputReducaoPorVinculo"]').should('not.be.disabled');
    cy.get('[data-test="checkboxReducaoPorVinculo"]').uncheck();
    cy.get('[data-test="inputReducaoPorVinculo"]').should('be.disabled');
  });

  it('should navigate back to the previous page', () => {
    cy.get('[data-test="buttonVoltar"]').click();
    cy.url().should('include', '/modalidade/IndexModalidade'); 
  });

  it('should open the "Cadastrar Resolução" modal', () => {
    cy.get('[data-test="buttonIncluirResolucao"]').click();
    cy.url().should('include', '/cadastro/resolucao'); 
  });

  it('should add a new requisito', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
    cy.get('.v-dialog').should('be.visible');
  });

  it('should handle character count for description', () => {
    cy.get('[data-test="textareaModalidadeDescricao"]').type('a'.repeat(501));
    cy.contains('501/500 caracteres').should('have.class', 'text-danger'); 
  });

  it('should handle date validation', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('10/10/1899');
    cy.get('[data-test="inputDataInicioVigencia"]').type('invalid date');
    cy.contains('Data inválida!').should('be.visible'); 
  });

  it('should handle duplicate modalidade names', () => {
    cy.get('[data-test="inputModalidadeNome"]').type('Existing Modalidade Name'); 
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('Já existe uma modalidade com o nome').should('be.visible'); 
  });

  it('Should display an error message if description exceeds 500 characters', () => {
    cy.get('[data-test="textareaModalidadeDescricao"]').type('a'.repeat(501));
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('A Descrição deve ter no máximo 500 caracteres.').should('be.visible');
  });

  it('Should handle invalid date input', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('invalid date');
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('Data inválida.').should('be.visible'); 
  });
});