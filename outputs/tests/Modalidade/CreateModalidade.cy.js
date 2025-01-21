/// <reference types="cypress"/>

describe('Modalidade de Bolsa Form', () => {
  beforeEach(() => {
    cy.login(); 
    cy.visit('/modalidade/CreateModalidade'); 
  });

  it('Should successfully submit the form with valid data', () => {
    const resolucaoId = 1; 
    const sigla = 'TEST';
    const nome = 'Teste Modalidade';
    const descricao = 'Descrição da modalidade de teste.';
    const dataInicioVigencia = '2024-03-15'; 
    const modalidadesAcumulativas = [1, 2]; 

    cy.get('[data-test="selectResolucao"]').select(resolucaoId);
    cy.get('[data-test="inputModalidadeSigla"]').type(sigla);
    cy.get('[data-test="inputModalidadeNome"]').type(nome);
    cy.get('[data-test="textareaModalidadeDescricao"]').type(descricao);
    cy.get('[data-test="inputDataInicioVigencia"]').type(dataInicioVigencia);
    cy.get('[data-test="selectModalidadesAcumulativas"]').select(modalidadesAcumulativas);
    cy.get('[data-test="buttonSalvar"]').click();

    cy.url().should('include', '/modalidade/EditarModalidade'); 
    cy.contains('Modalidade criada com sucesso!').should('be.visible'); 
  });

  it('Should display error messages for required fields', () => {
    cy.get('[data-test="buttonSalvar"]').click();

    cy.get('[data-test="selectResolucao"]').should('have.class', 'v-input--error');
    cy.get('[data-test="inputModalidadeSigla"]').should('have.class', 'v-input--error');
    cy.get('[data-test="inputModalidadeNome"]').should('have.class', 'v-input--error');
    cy.get('[data-test="textareaModalidadeDescricao"]').should('have.class', 'v-input--error');
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.class', 'v-input--error');
    cy.contains('Campo obrigatório').should('be.visible'); 
  });

  it('Should handle invalid data input', () => {
    cy.get('[data-test="selectResolucao"]').select(null);
    cy.get('[data-test="inputModalidadeSigla"]').type('Invalid Sigla');
    cy.get('[data-test="inputModalidadeNome"]').type('Invalid Name');
    cy.get('[data-test="textareaModalidadeDescricao"]').type('Invalid Description');
    cy.get('[data-test="inputDataInicioVigencia"]').type('Invalid Date');
    cy.get('[data-test="buttonSalvar"]').click();

    cy.contains('Data inválida').should('be.visible');
    cy.contains('Sigla deve ter no máximo 20 caracteres').should('be.visible'); 
    cy.contains('Nome deve ter no máximo 100 caracteres').should('be.visible'); 
    cy.contains('A Descrição deve ter no máximo 500 caracteres').should('be.visible'); 
  });

  it('Should allow adding and removing items from the "Modalidades de bolsa acumulativas" select', () => {
    cy.get('[data-test="selectModalidadesAcumulativas"]').select(1); 
    cy.get('[data-test="selectModalidadesAcumulativas"]').select(2); 
    cy.get('[data-test="selectModalidadesAcumulativas"]').unselect(1); 
  });

  it('Should handle the "Redução em caso de vínculo empregatício" checkbox and input', () => {
    cy.get('[data-test="checkboxReducaoPorVinculo"]').check(); 
    cy.get('[data-test="inputReducaoPorVinculo"]').type('50'); 

    cy.get('[data-test="checkboxReducaoPorVinculo"]').uncheck(); 
    cy.get('[data-test="inputReducaoPorVinculo"]').should('be.disabled'); 
  });

  it('Should navigate back to the previous page using the "Voltar" button', () => {
    cy.get('[data-test="buttonVoltar"]').click();
    cy.url().should('include', '/modalidade/IndexModalidade'); 
  });

  it('Should open the "Cadastrar" link for Resolucao', () => {
    cy.get('[data-test="buttonIncluirResolucao"]').click();
    cy.url().should('include', '/resolucao/CreateResolucao'); 
  });

  it('Should handle description character limit', () => {
    const longDescription = 'a'.repeat(501);
    cy.get('[data-test="textareaModalidadeDescricao"]').type(longDescription);
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('A Descrição deve ter no máximo 500 caracteres.').should('be.visible');
  });

  it('Should handle invalid date input', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('invalid date');
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('Data inválida').should('be.visible');
  });

  it('Should display an error message if a modalidade with the same name already exists', () => {
    const resolucaoId = 1; 
    const sigla = 'TEST3';
    const nome = 'Teste Modalidade';
    const descricao = 'Descrição da modalidade de teste 3.';
    const dataInicioVigencia = '2024-03-17'; 

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
    cy.contains('Já existe uma modalidade com o nome').should('be.visible'); 
  });

  it('Should handle multiple selection in Modalidades de bolsa acumulativas', () => {
    cy.get('[data-test="selectModalidadesAcumulativas"]')
      .select(['option1', 'option2']); 

    cy.get('[data-test="buttonSalvar"]')
      .click();
  });

  it('should add a requisito', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
  });
});