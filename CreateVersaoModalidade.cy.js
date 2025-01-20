/// <reference types="cypress" />

describe('Nova Versão de Modalidade de Bolsa', () => {
  beforeEach(() => {
    cy.visit('/path/to/your/form'); // Replace with the actual route.  Assume login and navigation are handled elsewhere.
  });

  it('Selecionar Resolução', () => {
    cy.get('[data-test="selectResolucao"]').select('Resolução 1'); // Replace 'Resolução 1' with a valid option.  Consider using a data-testid on the option itself for more robust selection.
    cy.get('[data-test="selectResolucao"]').should('have.value', 'expectedValue'); // Replace 'expectedValue' with the expected value.
  });

  it('Preencher Data de Início de Vigência', () => {
    const today = new Date().toISOString().slice(0, 10);
    cy.get('[data-test="inputDataInicioVigencia"]').type(today);
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.value', today);
  });

  it('Preencher Nome da Versão', () => {
    cy.get('[data-test="inputNomeVersao"]').type('2024');
    cy.get('[data-test="inputNomeVersao"]').should('have.value', '2024');
  });

  it('Preencher Nome da Modalidade', () => {
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeNome"]').should('have.value', 'Nome da Modalidade');
  });

  it('Preencher Sigla da Modalidade', () => {
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('[data-test="inputModalidadeSigla"]').should('have.value', 'SIGLA');
  });

  it('Campos obrigatórios devem ser validados', () => {
    cy.get('form').submit();
    cy.get('[data-test="selectResolucao"]').should('have.class', 'v-input--error'); 
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.class', 'v-input--error'); 
    cy.get('[data-test="inputNomeVersao"]').should('have.class', 'v-input--error'); 
    cy.get('[data-test="inputModalidadeNome"]').should('have.class', 'v-input--error'); 
    cy.get('[data-test="inputModalidadeSigla"]').should('have.class', 'v-input--error'); 
  });

  it('Deve ser possível preencher todos os campos e salvar com sucesso', () => {
    const today = new Date().toISOString().slice(0, 10);
    cy.get('[data-test="selectResolucao"]').select('1'); // Replace '1' with a valid ID
    cy.get('[data-test="inputDataInicioVigencia"]').type(today);
    cy.get('[data-test="inputNomeVersao"]').type('2024');
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('[data-test="buttonSubmit"]').click();
    cy.contains('Salvo com sucesso!').should('be.visible'); 
  });

  it('Botão "Cancelar" deve redirecionar para a página anterior', () => {
    cy.get('[data-test="buttonCancelar"]').click();
    cy.url().should('include', '/modalidade/DetailsModalidade/'); 
  });

  it('Tabelas de requisitos e níveis devem exibir dados corretamente', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible').within(() => {
      cy.get('tbody tr').should('have.length.greaterThan', 0); 
    });
    cy.get('[data-test="dataTableNiveis"]').should('be.visible').within(() => {
      cy.get('tbody tr').should('have.length.greaterThan', 0); 
    });
  });

  it('Tratamento de erro na submissão do formulário', () => {
    cy.get('[data-test="inputDataInicioVigencia"]').clear().type('invalid date');
    cy.get('form').submit();
    cy.contains('Erro ao salvar!').should('be.visible'); 
  });

  it('Deve ser possível selecionar uma resolução', () => {
    cy.get('[data-test="selectResolucao"]').click();
    cy.get('[data-test="selectResolucao"] li').first().click(); 
    cy.get('[data-test="selectResolucao"]').should('not.have.value', ''); 
  });

  it('Deve ser possível inserir a data de início de vigência', () => {
    const today = new Date().toISOString().slice(0, 10); 
    cy.get('[data-test="inputDataInicioVigencia"]').type(today);
    cy.get('[data-test="inputDataInicioVigencia"]').should('have.value', today);
  });

  it('Deve ser possível inserir o nome da versão', () => {
    cy.get('[data-test="inputNomeVersao"]').type('2024');
    cy.get('[data-test="inputNomeVersao"]').should('have.value', '2024');
  });

  it('Deve ser possível cancelar a criação da versão', () => {
    cy.get('[data-test="buttonCancelar"]').click();
    cy.url().should('not.include', '/criar-nova-versao'); 
  });

  it('Deve ser possível visualizar os requisitos da modalidade na tabela', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible');
    cy.get('[data-test="dataTableRequisitos"] tbody tr').should('have.length.greaterThan', 0); 
  });

  it('Deve ser possível visualizar os níveis e requisitos de níveis na tabela', () => {
    cy.get('[data-test="dataTableNiveis"]').should('be.visible');
    cy.get('[data-test="dataTableNiveis"] tbody tr').should('have.length.greaterThan', 0); 
  });

  it('Ao submeter o formulário com dados válidos, deve criar uma nova versão da modalidade e redirecionar para a página de detalhes da modalidade', () => {
    cy.intercept('POST', '/api/versaoModalidade', { 
      statusCode: 201, 
      body: { id: 'newlyCreatedVersionId' } 
    }).as('createVersion');

    cy.get('[data-test="selectResolucao"]').click();
    cy.get('[data-test="selectResolucao"] li').first().click();
    cy.get('[data-test="inputDataInicioVigencia"]').type('2024-03-15');
    cy.get('[data-test="inputNomeVersao"]').type('2024');
    cy.get('[data-test="inputModalidadeNome"]').type('Nome da Modalidade');
    cy.get('[data-test="inputModalidadeSigla"]').type('SIGLA');
    cy.get('[data-test="buttonSubmit"]').click();

    cy.wait('@createVersion').then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
      cy.url().should('include', `/modalidade/DetailsModalidade/${interception.response.body.id}`); 
    });
  });
});