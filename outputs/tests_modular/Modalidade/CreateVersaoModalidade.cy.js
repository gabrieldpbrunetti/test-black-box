/// <reference types="cypress"/>

describe('Nova Versão de Modalidade de Bolsa', () => {
  beforeEach(() => {
    cy.visit('/path/to/your/create/new/version/page'); 
  });

  it('Campos obrigatórios devem ser validados', () => {
    cy.get('form').submit();
    cy.get('[data-test="selectResolucao"]').should('have.class', 'v-input--error'); 
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.class', 'v-input--error');
    cy.get('[data-test="inputNomeVersao"]').should('have.class', 'v-input--error');
    cy.get('[data-test="inputModalidadeNome"]').should('have.class', 'v-input--error');
    cy.get('[data-test="inputModalidadeSigla"]').should('have.class', 'v-input--error');
  });

  it('Selecionar uma resolução válida deve funcionar corretamente', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="selectResolucao"]').should('have.value', '1'); 
  });

  it('Data de início de vigência deve ser validada', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('invalid date');
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.class', 'v-input--error'); 
    cy.get('[data-test="inputDataInicioVigencia"]').clear().type('2024-01-26');
    cy.get('[data-test="inputDataInicioVigencia"]').should('not.have.class', 'v-input--error');
  });

  it('Nome da versão deve ter um limite de caracteres', () => {
    cy.get('[data-test="inputNomeVersao"]').type('ThisIsAVeryLongVersionNameThatExceedsTheMaxLength');
    // Assertion depends on how exceeding max length is handled (truncation or error message).  Add appropriate assertion here.
  });

  it('Botão "Cancelar" deve redirecionar para a página anterior', () => {
    cy.get('[data-test="buttonCancelar"]').click();
    cy.url().should('include', '/path/to/previous/page'); 
  });

  it('Preencher todos os campos obrigatórios e submeter o formulário deve criar uma nova versão', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-01-26');
    cy.get('[data-test="inputNomeVersao"]').type('2024');
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('[data-test="buttonSubmit"]').click();
    cy.url().should('include', '/path/to/success/page'); 
  });

  it('Datas inválidas no campo "Data de início vigência" devem ser rejeitadas', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('invalid date');
    cy.get('form').submit();
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.class', 'v-input--error'); 
  });

  it('Campo "Nome da versão" deve aceitar até 20 caracteres', () => {
    cy.get('[data-test="inputNomeVersao"]').type('123456789012345678901'); 
    cy.get('form').submit();
    // Add assertion to check for error message or truncation based on your form's behavior.
  });

  it('Tabelas de requisitos e níveis devem exibir dados corretamente', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible').and('contain', 'Requisito'); 
    cy.get('[data-test="dataTableNiveis"]').should('be.visible').and('contain', 'Nível'); 
  });

  it('Deve ser possível preencher todos os campos e salvar uma nova versão', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-01-26');
    cy.get('[data-test="inputNomeVersao"]').type('2024');
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('form').submit();
    cy.contains('Salvo com sucesso!').should('be.visible'); 
    //or
    cy.url().should('include', '/path/to/confirmation'); 
  });


  it('Deve ser possível inserir uma data de início de vigência válida', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-12-31');
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.value', '2024-12-31');
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

  it('Tabelas de requisitos e níveis devem ser exibidas corretamente', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').should('be.visible');
  });

  it('Botão "Cancelar" deve redirecionar para a página de detalhes da modalidade', () => {
    cy.get('[data-test="buttonCancelar"]').click();
    cy.url().should('include', '/modalidade/DetailsModalidade/'); 
  });

  it('Ao submeter o formulário com dados válidos, deve ser exibida uma mensagem de sucesso e redirecionamento', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-12-31');
    cy.get('[data-test="inputNomeVersao"]').type('2024-VersaoTeste');
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('[data-test="buttonSubmit"]').click();
    cy.contains('Salvo com sucesso!').should('be.visible'); 
    cy.url().should('include', '/modalidade/DetailsModalidade/'); 
  });

  it('Tratamento de erros na submissão do formulário', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('2023-12-31'); 
    cy.get('[data-test="buttonSubmit"]').click();
    cy.contains('Erro ao salvar!').should('be.visible'); 
  });
});