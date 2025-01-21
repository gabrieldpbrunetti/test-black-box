/// <reference types="cypress" />

describe('Modalidade Details Page', () => {
  beforeEach(() => {
    cy.visit('/modalidade/details/123'); 
  });

  it('displays breadcrumb correctly', () => {
    cy.get('[data-test="componentBreadcrumb"]').should('be.visible');
    cy.get('[data-test="componentBreadcrumb"] a').should('have.length.greaterThan', 0); 
  });

  it('displays active version information when available', () => {
    cy.get('[data-test="inputVersaoAtiva"]').should('be.visible');
    // Add assertions for other fields in the active version section as needed.
  });

  it('displays alert for draft version when available', () => {
    cy.get('[data-test="alertDraftVersion"]').should('be.visible');
    cy.get('[data-test="linkVisualizarVersao"]').should('be.visible').and('have.attr', 'href').should('include', '/modalidade/DetailsModalidadeEmEdicao/');
  });

  it('displays modalidade data correctly', () => {
    cy.get('[data-test="cardDadosModalidade"]').within(() => {
      cy.get('[data-test="inputVersaoAtiva"]').should('be.visible');
      cy.get('[data-test="inputResolucao"]').should('be.visible');
      cy.get('[data-test="inputNomeModalidade"]').should('be.visible');
      cy.get('[data-test="inputSigla"]').should('be.visible');
      cy.get('[data-test="inputDataInicioVigencia"]').should('be.visible');
      cy.get('[data-test="inputDataFimVigencia"]').should('be.visible');
      cy.get('[data-test="inputReducaoVinculo"]').should('be.visible');
      cy.get('[data-test="inputDescricao"]').should('be.visible');
    });
  });

  it('displays versions correctly', () => {
    cy.get('[data-test="cardVersoesModalidade"]').within(() => {
      cy.get('[data-test="listVersoes"]').should('be.visible');
      cy.get('[data-test="listItemVersao"]').each(($el) => {
        cy.wrap($el).find('[data-test="spanEstadoVersao"]').should('be.visible');
        cy.wrap($el).find('[data-test="buttonVisualizarVersao"]').should(($btn) => {
          //Check for button visibility based on version state.  This assertion needs refinement based on your application logic.
          expect($btn).to.have.length(1);
        });
      });
      cy.get('[data-test="listItemSemVersoes"]').should('not.exist'); 
    });
  });

  it('displays requirements data table correctly', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible');
    cy.get('[data-test="dataTableRequisitos"]').contains('th', 'Tipo').should('be.visible');
    cy.get('[data-test="dataTableRequisitos"]').contains('th', 'Requisito').should('be.visible');
    cy.get('[data-test="dataTableRequisitos"]').find('tbody tr').should('have.length.greaterThan', 0);
  });

  it('displays levels data table correctly', () => {
    cy.get('[data-test="dataTableNiveis"]').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').contains('th', 'Sigla').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').contains('th', 'Valor').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').contains('th', 'Moeda').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').find('tbody tr').should('have.length.greaterThan', 0);
  });

  it('disables "Desativar modalidade" button correctly', () => {
    cy.get('[data-test="buttonDesativarModalidade"]').should(($button) => {
      const isDisabled = Cypress.$('[data-test="listItemVersao"]').length === 0 || Cypress.$('[data-test="listItemVersao"]').filter((i, el) => Cypress.$(el).find('[data-test="spanEstadoVersao"]').text().includes('Inativa')).length === Cypress.$('[data-test="listItemVersao"]').length;
      expect($button).to.have.attr('disabled', isDisabled ? 'disabled' : null);
    });
  });

  it('"Criar nova versão da modalidade" button is visible and functional when appropriate', () => {
    cy.get('[data-test="buttonCriarNovaVersao"]').should(($button) => {
      const isVisible = Cypress.$('[data-test="listItemVersao"]').filter((i, el) => !Cypress.$(el).find('[data-test="spanEstadoVersao"]').text().includes('Inativa')).length > 0;
      expect($button).to.be.visible.and(($el) => expect($el).to.have.length(isVisible ? 1 : 0));
    });
    cy.get('[data-test="buttonCriarNovaVersao"]').click();
    cy.url().should('include', '/modalidade/CreateVersaoModalidade/');
  });

  it('desactivates modalidade with confirmation', () => {
    cy.get('[data-test="buttonDesativarModalidade"]').click();
    cy.contains('Tem certeza que quer desativar essa versão da modalidade?').should('be.visible');
  });
});