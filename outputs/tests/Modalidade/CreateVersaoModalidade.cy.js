/// <reference types="cypress"/>

describe('Formulário de Nova Versão de Modalidade', () => {
  beforeEach(() => {
    cy.visit('/path/to/your/form'); 
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

  it('Data de início de vigência deve rejeitar datas inválidas', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').type('invalid date');
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.class', 'v-input--error');
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
    cy.get('form').submit();
    cy.url().should('include', '/modalidade/DetailsModalidade/'); 
  });

  it('Tabelas de requisitos e níveis devem exibir dados', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible').within(() => {
      cy.get('tbody tr').should('have.length.greaterThan', 0); 
    });
    cy.get('[data-test="dataTableNiveis"]').should('be.visible').within(() => {
      cy.get('tbody tr').should('have.length.greaterThan', 0); 
    });
  });

  it('Tabela de requisitos deve exibir mensagem "Sem dados!" quando estiver vazia', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible').within(() => {
      cy.contains('Sem dados!').should('be.visible');
    });
  });

  it('Tabela de níveis deve exibir mensagem "Sem dados!" quando estiver vazia', () => {
    cy.get('[data-test="dataTableNiveis"]').should('be.visible').within(() => {
      cy.contains('Sem dados!').should('be.visible');
    });
  });

  it('Deve ser possível preencher todos os campos corretamente e salvar', () => {
    const today = new Date().toISOString().slice(0, 10); 
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="inputDataInicioVigencia"]').type(today);
    cy.get('[data-test="inputNomeVersao"]').type('2024');
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('form').submit();
    cy.contains('Salvo com sucesso!').should('be.visible'); 
  });

  it('Datas futuras devem ser permitidas', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const formattedFutureDate = futureDate.toISOString().slice(0, 10);
    cy.get('[data-test="inputDataInicioVigencia"]').type(formattedFutureDate);
    cy.get('[data-test="inputDataInicioVigencia"]').should('not.have.class', 'v-input--error');
  });

  it('Limite de caracteres nos campos de texto deve ser respeitado', () => {
    cy.get('[data-test="inputNomeVersao"]').type('Excede o limite de caracteres'.repeat(10));
    cy.get('[data-test="inputModalidadeSigla"]').type('Excede o limite de caracteres'.repeat(10));
    cy.get('[data-test="inputNomeVersao"]').should('have.value', 'Excede o limite de caracteres'.repeat(10).substring(0,20));
    cy.get('[data-test="inputModalidadeSigla"]').should('have.value', 'Excede o limite de caracteres'.repeat(10).substring(0,20));
  });

  it('Tabelas de requisitos e níveis devem ser exibidas corretamente', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').should('be.visible');
  });

  it('Tratamento de erros de requisição', () => {
    cy.intercept('/api/your/endpoint', { statusCode: 500, body: { message: 'Internal Server Error' } }).as('failingRequest');
    cy.get('form').submit();
    cy.contains('Erro ao salvar!').should('be.visible'); 
    cy.contains('Internal Server Error').should('be.visible'); 
  });
});