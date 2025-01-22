/// <reference types="cypress" />

describe('Modalidade Details Page', () => {
  beforeEach(() => {
    cy.visit('/modalidade/details/123'); 
  });

  it('displays breadcrumb navigation', () => {
    cy.get('[data-test="componentBreadcrumb"]').should('be.visible');
  });

  it('displays active version information when available', () => {
    cy.get('[data-test="inputVersaoAtiva"]').should('be.visible');
  });

  it('displays a warning alert if a draft version exists', () => {
    cy.get('[data-test="alertDraftVersion"]').should('be.visible');
    cy.get('[data-test="linkVisualizarVersao"]').should('be.visible').and('have.attr', 'href');
  });

  it('displays all fields in the modalidade card', () => {
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


  it('displays versions of the modality', () => {
    cy.get('[data-test="cardVersoesModalidade"]').within(() => {
      cy.get('[data-test="listVersoes"]').should('be.visible');
      cy.get('[data-test="listItemVersao"]').should(($lis) => {
        expect($lis).to.have.length.greaterThan(0); 
      });
      cy.get('[data-test="listItemSemVersoes"]').should('not.exist'); 
      cy.get('[data-test="buttonVisualizarVersao"]').should('be.visible').and('have.attr', 'href');
    });
  });

  it('handles the case where no versions are available', () => {
    cy.intercept('/modalidade/details/123', {
      body: {VersaoModalidadesBolsas: []}
    }).as('getModalidade');
    cy.visit('/modalidade/details/123');
    cy.wait('@getModalidade');
    cy.get('[data-test="listItemSemVersoes"]').should('be.visible');
  });

  it('displays version states correctly', () => {
    cy.get('[data-test="listItemVersao"]').each((el) => {
      cy.wrap(el).within(() => {
        cy.get('[data-test="spanEstadoVersao"]').should('be.visible'); 
      });
    });
  });

  it('displays requirements data table', () => {
    cy.get('[data-test="dataTableRequisitos"]').should('be.visible');
    cy.get('[data-test="dataTableRequisitos"]').contains('th', 'Tipo');
    cy.get('[data-test="dataTableRequisitos"]').contains('th', 'Requisito');
    cy.get('[data-test="dataTableRequisitos"] tbody tr').should('have.length.greaterThan', 0);
  });

  it('displays levels data table', () => {
    cy.get('[data-test="dataTableNiveis"]').should('be.visible');
    cy.get('[data-test="dataTableNiveis"]').contains('th', 'Sigla');
    cy.get('[data-test="dataTableNiveis"]').contains('th', 'Valor');
    cy.get('[data-test="dataTableNiveis"]').contains('th', 'Moeda');
    cy.get('[data-test="dataTableNiveis"] tbody tr').should('have.length.greaterThan', 0);
  });

  it('enables/disables the "Desativar modalidade" button correctly', () => {
    cy.get('[data-test="buttonDesativarModalidade"]').then(($button) => {
      const isDisabled = $button.attr('disabled') !== undefined;
      expect(isDisabled).to.be.true; // Example assertion, adjust based on application logic
    });
  });

  it('enables/disables the "Criar nova versão" button correctly', () => {
    cy.get('[data-test="buttonCriarNovaVersao"]').then(($button) => {
      const isEnabled = $button.attr('disabled') === undefined;
      expect(isEnabled).to.be.true; // Example assertion, adjust based on application logic
    });
  });

  it('navigates to create new version page', () => {
    cy.get('[data-test="buttonCriarNovaVersao"]').click();
    cy.url().should('include', '/modalidade/CreateVersaoModalidade/');
  });

  it('handles desativar modalidade button click', () => {
    cy.intercept({
      method: 'DELETE',
      url: '/modalidade/*'
    }, {
      statusCode: 200,
      body: {}
    }).as('deleteModalidade');
    cy.get('[data-test="buttonDesativarModalidade"]').click();
    cy.contains('Tem certeza que quer desativar essa versão da modalidade?').should('be.visible');
    cy.wait('@deleteModalidade');
  });

  it('navigates to version details in edition', () => {
    cy.get('[data-test="buttonVisualizarVersao"]').click();
    // Add assertions to verify navigation to the correct version details page.
  });
});