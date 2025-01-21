/// <reference types="cypress" />

describe('Modalidade Details Page', () => {
  beforeEach(() => {
    cy.visit(`/modalidade/DetailsModalidade/${Cypress.env('modalidadeId')}`); 
  });

  it('displays breadcrumb correctly', () => {
    cy.get('[data-test="componentBreadcrumb"]').should('be.visible');
    cy.get('[data-test="componentBreadcrumb"] a').should('have.length', 2); 
  });

  it('displays active version information when available', () => {
    cy.get('[data-test="inputVersaoAtiva"]').should('be.visible').should('not.be.disabled'); 
    cy.get('[data-test="inputResolucao"]').should('be.visible');
    cy.get('[data-test="inputNomeModalidade"]').should('be.visible');
    cy.get('[data-test="inputSigla"]').should('be.visible');
    cy.get('[data-test="inputDataInicioVigencia"]').should('be.visible');
    cy.get('[data-test="inputDataFimVigencia"]').should('be.visible');
    cy.get('[data-test="inputReducaoVinculo"]').should('be.visible');
    cy.get('[data-test="inputDescricao"]').should('be.visible');
    cy.get('[data-test="inputVersaoAtiva"]').should(($input) => {
      const expectedValue = Cypress.env('activeVersionSigla'); 
      expect($input.val()).to.eq(expectedValue);
    });
  });

  it('displays alert for draft version when available', () => {
    cy.get('[data-test="alertDraftVersion"]').should('be.visible');
    cy.get('[data-test="linkVisualizarVersao"]').should('be.visible').and('have.attr', 'href');
  });

  it('displays modalidade data correctly', () => {
    cy.get('[data-test="cardDadosModalidade"]').should('be.visible');
  });

  it('displays versions correctly', () => {
    cy.get('[data-test="cardVersoesModalidade"]').should('be.visible');
    cy.get('[data-test="listVersoes"]').should('be.visible');

    cy.get('[data-test="listItemSemVersoes"]').then(($el) => {
      if ($el.length > 0) {
        cy.wrap($el).should('be.visible');
      } else {
        cy.get('[data-test="listItemVersao"]').should('have.length.greaterThan', 0);
        cy.get('[data-test="buttonVisualizarVersao"]').each(($btn) => {
          cy.wrap($btn).should('have.attr', 'href');
        });
      }
    });
  });

  it('displays requirements data table correctly', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible');
    cy.get('[data-test="dataTableRequisitos"]').then(($table) => {
      if ($table.find('tbody tr').length === 0) {
        cy.get('[data-test="dataTableRequisitos"] .v-alert').should('contain', 'Não há dados');
      } else {
        cy.get('[data-test="dataTableRequisitos"] tbody tr').should('have.length.greaterThan', 0);
      }
    });
  });

  it('displays levels data table correctly', () => {
    cy.get('[data-test="dataTableNiveis"]').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').then(($table) => {
      if ($table.find('tbody tr').length === 0) {
        cy.get('[data-test="dataTableNiveis"] .v-alert').should('contain', 'Não há dados');
      } else {
        cy.get('[data-test="dataTableNiveis"] tbody tr').should('have.length.greaterThan', 0);
      }
    });
  });

  it('enables/disables "Desativar modalidade" button correctly', () => {
    cy.get('[data-test="buttonDesativarModalidade"]').should(($btn) => {
      const isEnabled = !$btn.attr('disabled'); 
      const expectedEnabled = Cypress.env('desativarButtonEnabled'); 
      expect(isEnabled).to.eq(expectedEnabled); 
    });
  });

  it('enables/disables "Criar nova versão" button correctly', () => {
    cy.get('[data-test="buttonCriarNovaVersao"]').should(($btn) => {
      const isEnabled = !$btn.attr('disabled'); 
      const expectedEnabled = Cypress.env('criarNovaVersaoButtonEnabled'); 
      expect(isEnabled).to.eq(expectedEnabled); 
    });
  });

  it('navigates to create new version page', () => {
    cy.get('[data-test="buttonCriarNovaVersao"]').click();
    cy.url().should('include', '/modalidade/CreateVersaoModalidade/');
  });

  it('handles desativar modalidade correctly', () => {
    cy.get('[data-test="buttonDesativarModalidade"]').click();
    cy.contains('Tem certeza que quer desativar essa versão da modalidade?').should('be.visible');
    cy.get('[data-test="swal2-confirm"]').click(); 
    cy.url().should('include', '/modalidade/IndexModalidade'); 
  });

});