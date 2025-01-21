/// <reference types="cypress"/>

describe('Formulário de Nova Versão de Modalidade', () => {
  beforeEach(() => {
    cy.visit('/path/to/form'); 
  });

  it('Campos obrigatórios devem ser validados', () => {
    cy.get('form').submit();
    cy.get('[data-test="selectResolucao"]').should('have.class', 'v-input--error'); 
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.class', 'v-input--error');
    cy.get('[data-test="inputNomeVersao"]').should('have.class', 'v-input--error');
    cy.get('[data-test="inputModalidadeNome"]').should('have.class', 'v-input--error');
    cy.get('[data-test="inputModalidadeSigla"]').should('have.class', 'v-input--error');
  });

  it('Selecionar uma resolução válida', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="selectResolucao"]').should('have.value', '1'); 
  });

  it('Data de início de vigência deve ser válida', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-03-15');
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.value', '2024-03-15');
  });

  it('Nome da versão deve ter um limite de caracteres', () => {
    cy.get('[data-test="inputNomeVersao"]').type('Exceeding the 20 character limit is not allowed');
    cy.get('[data-test="inputNomeVersao"]').should('have.value', 'Exceeding the 20 char'); 
  });

  it('Botão "Cancelar" deve redirecionar para a página anterior', () => {
    cy.get('[data-test="buttonCancelar"]').click();
    cy.url().should('include', '/modalidade/DetailsModalidade/'); 
  });

  it('Submit do formulário com dados válidos', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-03-15');
    cy.get('[data-test="inputNomeVersao"]').type('2024');
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('[data-test="buttonSubmit"]').click();
    cy.url().should('include', '/modalidade/DetailsModalidade/'); 
  });

  it('Tabelas de requisitos e níveis devem exibir dados', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible').find('tbody tr').should('have.length.greaterThan', 0); 
    cy.get('[data-test="dataTableNiveis"]').should('be.visible').find('tbody tr').should('have.length.greaterThan', 0); 
  });

  it('Tabela de requisitos e níveis devem exibir mensagem "Sem dados!" quando estiverem vazias', () => {
      cy.get('[data-test="dataTableRequisitos"]').should('contain', 'Sem dados!');
      cy.get('[data-test="dataTableNiveis"]').should('contain', 'Sem dados!');
  });

  it('Deve ser possível selecionar uma resolução', () => {
    cy.get('[data-test="selectResolucao"]').click();
    cy.get('.v-list-item__title').contains('Resolução 1').click(); 
    cy.get('[data-test="selectResolucao"]').should('have.value', '1'); 
  });

  it('Deve ser possível inserir uma data de início de vigência válida', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-01-26');
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.value', '2024-01-26');
  });

  it('Deve ser possível inserir um nome de versão', () => {
    cy.get('[data-test="inputNomeVersao"]').type('2024-VersaoTeste');
    cy.get('[data-test="inputNomeVersao"]').should('have.value', '2024-VersaoTeste');
  });

  it('Deve ser possível preencher as informações da modalidade', () => {
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('[data-test="inputModalidadeNome"]').should('have.value', 'Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').should('have.value', 'SIGLA');
  });

  it('Ao submeter o formulário com dados válidos, deve criar uma nova versão da modalidade', () => {
    cy.get('[data-test="selectResolucao"]').click();
    cy.get('.v-list-item__title').contains('Resolução 1').click(); 
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-01-26');
    cy.get('[data-test="inputNomeVersao"]').type('2024-VersaoTeste');
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('[data-test="buttonSubmit"]').click();
    cy.contains('Salvo com sucesso!').should('be.visible'); 
  });

  it('Data de início de vigência inválida deve gerar erro', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('invalid date');
    cy.get('form').submit();
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.class', 'v-input--error');
  });

  it('Nome de versão com mais de 20 caracteres deve gerar erro', () => {
    cy.get('[data-test="inputNomeVersao"]').type('ThisIsAVeryLongVersionNameThatExceedsThe20CharacterLimit');
    cy.get('form').submit();
    //Assert error -  Method depends on how your form handles this error.
  });

  it('Tabelas de requisitos e níveis devem exibir dados corretamente', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').should('be.visible');
  });

  it('Tratamento de erro na API deve exibir mensagem de erro ao usuário', () => {
    cy.intercept({
      method: 'POST',
      url: '/api/versaoModalidade', 
    }, {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('postVersaoModalidade');

    cy.get('[data-test="buttonSubmit"]').click();
    cy.wait('@postVersaoModalidade');
    cy.contains('Erro ao salvar!').should('be.visible'); 
  });

  it('Datas inválidas no campo "Data de início vigência" devem ser tratadas', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('31/02/2024');
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-13-01');
    cy.get('[data-test="inputDataInicioVigencia"]').type('abc');
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.class', 'v-input--error');
  });

  it('O componente de seleção de resolução deve funcionar corretamente', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="selectResolucao"]').should('have.value', '1'); 
  });

  it('Limite de caracteres no campo "Nome da versão" deve ser respeitado', () => {
    cy.get('[data-test="inputNomeVersao"]').type('Texto com mais de vinte caracteres');
    cy.get('[data-test="inputNomeVersao"]').should('have.value', 'Texto com mais de vinte caracte'); 
  });
});