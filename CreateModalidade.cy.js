/// <reference types="cypress" />

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

  it('should allow filling and submitting the form', () => {
    const resolucaoId = 1; 
    const sigla = 'TEST';
    const nome = 'Teste Modalidade';
    const descricao = 'Descrição da modalidade de teste.';
    const dataInicioVigencia = '2024-03-15';

    cy.get('[data-test="selectResolucao"]')
      .select(resolucaoId);

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

    cy.contains('Salvo com sucesso!').should('be.visible');
    cy.url().should('include', '/modalidade/EditarModalidade'); 
  });

  it('should handle character limits', () => {
    const longDescription = 'This is a very long description that exceeds the 500 character limit.';
    cy.get('[data-test="textareaModalidadeDescricao"]')
      .type(longDescription);
    cy.get('[data-test="buttonSalvar"]')
      .click();
    cy.contains('A Descrição deve ter no máximo 500 caracteres.').should('be.visible');
  });

  it('should handle invalid date input', () => {
    cy.get('[data-test="inputDataInicioVigencia"]')
      .type('invalid date');
    cy.get('[data-test="buttonSalvar"]')
      .click();
    cy.contains('Data inválida.').should('be.visible');
  });

  it('should handle required fields', () => {
    cy.get('[data-test="buttonSalvar"]')
      .click();
    cy.contains('Erro: Resolução é obrigatório.').should('be.visible');
    cy.contains('Erro: Sigla é obrigatório.').should('be.visible');
    cy.contains('Erro: Nome da modalidade é obrigatório.').should('be.visible');
    cy.contains('Erro: Descrição é obrigatório.').should('be.visible');
    cy.contains('Erro: Data de vigência é obrigatório.').should('be.visible');
  });

  it('should allow adding a requirement', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]')
      .click();
    // Assertions to check for the modal or form to add a requirement
    // cy.get('#requirement-modal').should('be.visible');
  });

  it('should navigate back to the list', () => {
    cy.get('[data-test="buttonVoltar"]')
      .click();
    cy.url().should('include', '/modalidade/IndexModalidade');
  });

  it('should handle the "incluirResolucao" link', () => {
    cy.get('[data-test="buttonIncluirResolucao"]')
      .click();
    cy.url().should('include', '/resolucao/CreateResolucao'); 
  });

  it('should handle checkbox and acumulative modalities select', () => {
    cy.get('[data-test="checkboxReducaoPorVinculo"]').check();
    cy.get('[data-test="inputReducaoPorVinculo"]').type('50');
    cy.get('[data-test="selectModalidadesAcumulativas"]').select(['1', '2']); 
    cy.get('[data-test="buttonSalvar"]').click();
  });

  it('should enable/disable reduction field based on checkbox', () => {
    cy.get('[data-test="checkboxReducaoPorVinculo"]')
      .check();
    cy.get('[data-test="inputReducaoPorVinculo"]')
      .should('not.be.disabled');

    cy.get('[data-test="checkboxReducaoPorVinculo"]')
      .uncheck();
    cy.get('[data-test="inputReducaoPorVinculo"]')
      .should('be.disabled');
  });


  it('should display an error message if a modalidade with the same name already exists', () => {
    const sigla = 'TEST2';
    const nome = 'Modalidade Existente'; 
    const descricao = 'Descrição de teste.';
    const dataInicioVigencia = '2024-03-16';

    cy.get('[data-test="selectResolucao"]')
      .select(1); 

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

    cy.contains('Já existe uma modalidade com o nome').should('be.visible');
  });
});