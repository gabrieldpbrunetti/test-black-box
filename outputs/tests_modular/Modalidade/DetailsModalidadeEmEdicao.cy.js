/// <reference types="cypress"/>

describe('Modalidade Visualização', () => {
  beforeEach(() => {
    cy.intercept('/api/modalidade/*').as('getModalidade');
    cy.visit('/modalidade/DetailsModalidade/1');
    cy.wait('@getModalidade');
  });

  it('Deve exibir o título da página corretamente', () => {
    cy.get('[data-test="baseBreadcrumb"]').contains('Visualizar Versão da Modalidade');
  });

  it('Deve exibir os dados da modalidade em campos desabilitados', () => {
    cy.get('[data-test="inputVersaoEdicao"]').should('be.disabled');
    cy.get('[data-test="inputNumeroResolucao"]').should('be.disabled');
    cy.get('[data-test="inputNomeModalidade"]').should('be.disabled');
    cy.get('[data-test="inputSigla"]').should('be.disabled');
    cy.get('[data-test="inputDataInicioVigencia"]').should('be.disabled');
    cy.get('[data-test="inputDataFimVigencia"]').should('be.disabled');
    cy.get('[data-test="inputDescricao"]').should('be.disabled');
    cy.get('[data-test="inputReducaoVinculo"]').should('be.disabled');
  });

  it('Deve exibir um alerta se houver uma versão em andamento', () => {
    cy.get('[data-test="linkVisualizarModalidade"]').should('exist');
  });

  it('Deve exibir as versões da modalidade', () => {
    cy.get('[data-test="cardVersoesModalidade"]').should('be.visible');
    cy.get('[data-test="listItemVersaoModalidade"]').should('be.visible');
  });

  it('Deve permitir visualizar uma versão ativa', () => {
    cy.get('[data-test="buttonVisualizarVersao"]').should('exist').click();
    cy.url().should('include', '/modalidade/DetailsModalidade/');
  });

  it('Deve exibir as tabelas de requisitos e níveis', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').should('be.visible');
  });

  it('Deve permitir excluir uma versão', () => {
    cy.get('[data-test="buttonExcluirVersao"]').click();
    cy.contains('Tem certeza que deseja apagar essa versão?').should('be.visible');
  });

  it('Deve permitir alterar a versão da modalidade', () => {
    cy.get('[data-test="buttonAlterarVersao"]').click();
    cy.url().should('include', '/modalidade/EditModalidade/');
  });

  it('Deve permitir publicar uma nova versão da modalidade', () => {
    cy.get('[data-test="buttonPublicarVersao"]').click();
    cy.contains('Tem certeza que quer ativar essa modalidade?').should('be.visible');
  });

  it('Deve exibir mensagem quando não houver versões', () => {
    cy.intercept('/api/modalidade/*', {
      statusCode: 200,
      body: { value: [{ VersaoModalidadesBolsas: [] }] }
    }).as('emptyVersions');
    cy.reload();
    cy.wait('@emptyVersions');
    cy.get('[data-test="listItemVersaoModalidade"]').contains('Não existem versões dessa modalidade!').should('be.visible');
  });

  it('Links devem funcionar corretamente', () => {
    cy.get('[data-test="linkVisualizarModalidade"]').should('have.attr', 'href').and('include', '/modalidade/DetailsModalidade/');
    cy.get('[data-test="buttonVisualizarVersao"]').should('have.attr', 'href').and('include', '/modalidade/DetailsModalidade/');
  });
});