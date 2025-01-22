/// <reference types="cypress"/>

describe('Modalidade Form', () => {
  beforeEach(() => {
    cy.visit('/modalidade/CreateModalidade'); 
  });

  it('should display the form with all fields', () => {
    cy.get('[data-test="selectResolucao"]').should('be.visible');
    cy.get('[data-test="inputModalidadeSigla"]').should('be.visible');
    cy.get('[data-test="inputModalidadeNome"]').should('be.visible');
    cy.get('[data-test="textareaModalidadeDescricao"]').should('be.visible');
    cy.get('[data-test="checkboxReducaoPorVinculo"]').should('be.visible');
    cy.get('[data-test="inputReducaoPorVinculo"]').should('be.visible');
    cy.get('[data-test="inputDataInicioVigencia"]').should('be.visible');
    cy.get('[data-test="selectModalidadesAcumulativas"]').should('be.visible');
    cy.get('[data-test="buttonVoltar"]').should('be.visible');
    cy.get('[data-test="buttonSalvar"]').should('be.visible');
    cy.get('[data-test="buttonIncluirResolucao"]').should('be.visible');
    cy.get('[data-test="buttonAdicionarRequisito"]').should('be.visible');
  });

  it('Should successfully submit the form with valid data', () => {
    const sigla = 'TEST';
    const nome = 'Teste Modalidade';
    const descricao = 'Descrição da modalidade de teste.';
    const dataInicioVigencia = '2024-03-15';

    cy.get('[data-test="selectResolucao"]')
      .select('Resolução 1'); 

    cy.get('[data-test="inputModalidadeSigla"]')
      .type(sigla);

    cy.get('[data-test="inputModalidadeNome"]')
      .type(nome);

    cy.get('[data-test="textareaModalidadeDescricao"]')
      .type(descricao);

    cy.get('[data-test="inputDataInicioVigencia"]')
      .type(dataInicioVigencia);

    cy.get('[data-test="buttonSalvar"]')
      .click();

    cy.url().should('include', '/modalidade/EditarModalidade'); 
  });

  it('should allow filling and submitting the form', () => {
    cy.get('[data-test="selectResolucao"]').select('Resolução 1'); 
    cy.get('[data-test="inputModalidadeSigla"]').type('TEST');
    cy.get('[data-test="inputModalidadeNome"]').type('Teste Modalidade');
    cy.get('[data-test="textareaModalidadeDescricao"]').type('Descrição da modalidade de teste.');
    cy.get('[data-test="checkboxReducaoPorVinculo"]').check();
    cy.get('[data-test="inputReducaoPorVinculo"]').type('50');
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-01-01');
    cy.get('[data-test="selectModalidadesAcumulativas"]').select(['1']); 
    cy.get('[data-test="buttonSalvar"]').click();

    cy.url().should('include', '/modalidade/EditarModalidade'); 
  });


  it('Should display error messages for required fields', () => {
    cy.get('[data-test="buttonSalvar"]')
      .click();

    cy.get('[data-test="selectResolucao"]')
      .should('have.class', 'v-input--error');

    cy.get('[data-test="inputModalidadeSigla"]')
      .should('have.class', 'v-input--error');

    cy.get('[data-test="inputModalidadeNome"]')
      .should('have.class', 'v-input--error');

    cy.get('[data-test="textareaModalidadeDescricao"]')
      .should('have.class', 'v-input--error');

    cy.get('[data-test="inputDataInicioVigencia"]')
      .should('have.class', 'v-input--error');
  });

  it('should handle character limits', () => {
    const longDescription = 'This is a very long description that exceeds the 500 character limit.';
    cy.get('[data-test="textareaModalidadeDescricao"]').type(longDescription);
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('A Descrição deve ter no máximo 500 caracteres.').should('be.visible'); 
  });

  it('Should handle description character limit', () => {
    const longDescription = 'This is a very long description that exceeds the 500 character limit. This is a very long description that exceeds the 500 character limit. This is a very long description that exceeds the 500 character limit.';
    cy.get('[data-test="textareaModalidadeDescricao"]')
      .type(longDescription);

    cy.get('.text-danger')
      .should('contain', '500');
      
    cy.get('[data-test="buttonSalvar"]')
      .click();

    cy.contains('A Descrição deve ter no máximo 500 caracteres.').should('be.visible'); 
  });

  it('should handle invalid date input', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('invalid date');
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('Data inválida.').should('be.visible'); 
  });

  it('Should handle invalid date input', () => {
    cy.get('[data-test="inputDataInicioVigencia"]')
      .type('invalid date');

    cy.get('[data-test="buttonSalvar"]')
      .click();

    cy.contains('Data inválida.').should('be.visible'); 
  });

  it('should show error message if modalidade name already exists', () => {
    cy.get('[data-test="selectResolucao"]').select('Resolução 1'); 
    cy.get('[data-test="inputModalidadeSigla"]').type('TEST2');
    cy.get('[data-test="inputModalidadeNome"]').type('Existing Modalidade'); 
    cy.get('[data-test="textareaModalidadeDescricao"]').type('Descrição da modalidade de teste.');
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('Já existe uma modalidade com o nome').should('be.visible'); 

  });

  it('Should allow adding and removing acumulative modalities', () => {
    cy.get('[data-test="selectModalidadesAcumulativas"]')
      .select(['Modalidade 1', 'Modalidade 2']); 

    cy.get('[data-test="selectModalidadesAcumulativas"]')
      .select(['Modalidade 1']); 

  });

  it('Should handle checkbox for reduction in case of employment', () => {
    cy.get('[data-test="checkboxReducaoPorVinculo"]')
      .check();

    cy.get('[data-test="inputReducaoPorVinculo"]')
      .should('not.be.disabled');

    cy.get('[data-test="checkboxReducaoPorVinculo"]')
      .uncheck();

    cy.get('[data-test="inputReducaoPorVinculo"]')
      .should('be.disabled');
  });

  it('should navigate back to the list', () => {
    cy.get('[data-test="buttonVoltar"]').click();
    cy.url().should('include', '/modalidade/IndexModalidade');
  });

  it('Should navigate back to the modality list', () => {
    cy.get('[data-test="buttonVoltar"]')
      .click();

    cy.url().should('include', '/modalidade/IndexModalidade');
  });

  it('should open the "incluirResolucao" modal', () => {
    cy.get('[data-test="buttonIncluirResolucao"]').click();
    cy.url().should('include', '/resolucao/CreateResolucao'); 
  });

  it('Should navigate to create a new resolution', () => {
    cy.get('[data-test="buttonIncluirResolucao"]')
      .click();

    cy.url().should('include', '/resolucao/CreateResolucao'); 
  });

  it('should add a requisito', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
  });

  it('Should open the "Add Requirement" dialog', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]')
      .click();
  });

});