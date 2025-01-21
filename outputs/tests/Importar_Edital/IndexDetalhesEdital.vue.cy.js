/// <reference types="cypress" />

describe('Edital Visualização', () => {
  beforeEach(() => {
    cy.intercept('/api/editais-projetos/*').as('getEdital'); 
    cy.visit(`/importaredital/VisualizarEdital/${Cypress.env('editalId')}`); 
    cy.wait('@getEdital'); 
  });

  it('Deve exibir informações do edital corretamente', () => {
    cy.contains('strong', 'NOME DO EDITAL:').should('be.visible');
    cy.contains('strong', 'ÁREA TÉCNICA:').should('be.visible');
    cy.contains('strong', 'PROJETOS COMPLETOS:').should('be.visible');
    cy.contains('strong', 'ALOCAÇÕES COMPLETAS:').should('be.visible');

    cy.contains(Cypress.env('editalNome')).should('be.visible'); 
    cy.contains(Cypress.env('editalAreaTecnica')).should('be.visible'); 
  });


  it('Deve permitir a busca de projetos por nome', () => {
    const searchTerm = 'Projeto Teste'; 

    cy.get('v-text-field[label="Pesquise o nome do edital"]').type(searchTerm);
    cy.get('v-btn').contains('Buscar').click();

    cy.get('v-data-table tbody tr').should(($rows) => {
      expect($rows).to.have.length.greaterThan(0);
      $rows.each(($row) => {
        cy.wrap($row).find('td:first-child').should('contain', searchTerm);
      });
    });
  });

  it('Deve exibir uma mensagem "Sem dados!" quando não houver projetos', () => {
    cy.intercept('/api/editais-projetos/*', { fixture: 'emptyEdital.json' }).as('getEmptyEdital');
    cy.reload();
    cy.wait('@getEmptyEdital');

    cy.contains('Sem dados!').should('be.visible');
  });

  it('Deve permitir a visualização de detalhes do projeto', () => {
    cy.get('v-data-table tbody tr:first-child td:first-child a').click(); 

    cy.url().should('include', '/importaredital/FormProjeto/'); 
  });

  it('Deve exibir o status do projeto corretamente (Completo/Incompleto)', () => {
    cy.get('v-data-table tbody tr').each(($row) => {
      const status = $row.find('td:nth-child(2)').text().trim();
      expect(['COMPLETO', 'INCOMPLETO']).to.include(status); 
    });
  });

  it('Deve permitir a navegação de volta', () => {
    cy.get('.navigate-back').click();
    cy.url().should('not.include', '/importaredital/VisualizarEdital/'); 
  });

  it('Deve exibir a paginação corretamente', () => {
    cy.get('.v-data-table__pagination').should('be.visible'); 
  });

  it('Deve exibir o breadcrumb corretamente', () => {
    cy.get('#BaseBreadcrumb').should('be.visible').and('contain', Cypress.env('editalNome')); 
  });

  it('Deve lidar com erros na busca de projetos', () => {
    cy.intercept('/api/editais-projetos/*', { statusCode: 500 }).as('errorEdital');
    cy.get('v-text-field[label="Pesquise o nome do edital"]').type('some search term');
    cy.get('v-btn').contains('Buscar').click();
    cy.wait('@errorEdital');
    cy.contains('Erro ao buscar dados do edital').should('be.visible'); 
  });

  it('Deve exibir o número correto de alocações completas', () => {
    cy.get('v-data-table tbody tr').each(($row) => {
      const alocacoes = $row.find('td:nth-child(3)').text().trim();
      expect(alocacoes).to.match(/^\d+\/\d+$/); 
    });
  });
});