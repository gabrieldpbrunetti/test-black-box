/// <reference types="cypress"/>

describe('Modalidade Visualização', () => {
  beforeEach(() => {
    cy.visit('/modalidade/DetailsModalidade/1'); // Replace '1' with a valid ID for testing, use a different ID for other tests if needed.  Consider using a fixture or environment variable for dynamic ID management.
  });

  it('Deve exibir o título da página corretamente', () => {
    cy.get('[data-test="baseBreadcrumb"]').contains('Visualizar Versão da Modalidade');
  });

  it('Deve exibir um alerta se houver uma versão em andamento', () => {
    cy.get('[data-test="linkVisualizarModalidade"]').should('be.visible');
    cy.get('[data-test="linkVisualizarModalidade"]').should('have.attr', 'href').and('include', '/modalidade/DetailsModalidade/');
  });

  it('Deve exibir os dados da modalidade corretamente', () => {
    cy.get('[data-test="inputVersaoEdicao"]').should('be.visible');
    cy.get('[data-test="inputNumeroResolucao"]').should('be.visible');
    cy.get('[data-test="inputNomeModalidade"]').should('be.visible');
    cy.get('[data-test="inputSigla"]').should('be.visible');
    cy.get('[data-test="inputDataInicioVigencia"]').should('be.visible');
    cy.get('[data-test="inputDataFimVigencia"]').should('be.visible');
    cy.get('[data-test="inputDescricao"]').should('be.visible');
    cy.get('[data-test="inputReducaoVinculo"]').should('be.visible');
  });

  it('Deve exibir as versões da modalidade', () => {
    cy.get('[data-test="cardVersoesModalidade"]').should('be.visible');
    cy.get('[data-test="listItemVersaoModalidade"]').should('be.visible'); 
    cy.get('[data-test="listItemVersaoModalidade"]').each(($el) => {
      cy.wrap($el).find('span').should('have.length.greaterThan', 0); 
    });
  });

  it('Deve permitir visualizar uma versão ativa', () => {
    cy.get('[data-test="buttonVisualizarVersao"]').should('be.visible').click();
    cy.url().should('include', '/modalidade/DetailsModalidade/'); //Verify navigation
  });

  it('Deve exibir as tabelas de requisitos e níveis', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').should('be.visible');
  });

  it('Deve permitir excluir uma versão', () => {
    cy.get('[data-test="buttonExcluirVersao"]').click();
    cy.contains('Tem certeza que deseja apagar essa versão?').should('be.visible'); //Check SweetAlert
    cy.get('.swal2-confirm').click(); //Confirm delete (adapt if needed)
    cy.contains('Deletado com sucesso!').should('be.visible'); //Check success message (adapt if needed)
  });

  it('Deve permitir alterar uma versão', () => {
    cy.get('[data-test="buttonAlterarVersao"]').click();
    cy.url().should('include', '/modalidade/EditModalidade/'); //Verify navigation
  });

  it('Deve permitir publicar uma nova versão', () => {
    cy.get('[data-test="buttonPublicarVersao"]').click();
    cy.contains('Tem certeza que quer ativar essa modalidade?').should('be.visible'); //Check SweetAlert
    cy.get('.swal2-confirm').click(); //Confirm publish (adapt if needed)
    cy.contains('Modalidade publicada!').should('be.visible'); //Check success message (adapt if needed)
  });

  it('Deve exibir mensagem quando não houver versões', () => {
    cy.intercept('/modalidade/1', {
      fixture: 'modalidadeSemVersoes.json' // Assuming you have a fixture file named modalidadeSemVersoes.json
    }).as('getModalidade');

    cy.visit('/modalidade/DetailsModalidade/1');
    cy.wait('@getModalidade');
    cy.get('[data-test="listItemVersaoModalidade"]').contains('Não existem versões dessa modalidade!');
  });

  it('Deve formatar corretamente o estado da versão', () => {
    cy.get('[data-test="listItemVersaoModalidade"]')
      .contains('Ativa') 
      .should('have.class', 'text-success'); 
  });
});