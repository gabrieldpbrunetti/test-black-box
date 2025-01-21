/// <reference types="cypress" />

describe('Edital Visualização', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/editais/*').as('getEdital'); 
    cy.visit(`/importaredital/VisualizarEdital/${Cypress.env('editalId') || 1}`); 
    cy.wait('@getEdital');
  });

  it('Deve exibir informações do edital', () => {
    cy.contains('NOME DO EDITAL:').should('be.visible');
    cy.contains('ÁREA TÉCNICA:').should('be.visible');
    cy.contains('PROJETOS COMPLETOS:').should('be.visible');
    cy.contains('ALOCAÇÕES COMPLETAS:').should('be.visible');
    cy.get('[data-testid="edital-nome"]').should('contain', 'Nome do Edital de Teste'); 
  });

  it('Deve exibir a lista de projetos', () => {
    const editalData = Cypress.$(`@getEdital`).response().body;
    const numProjects = editalData.Projetos.length;
    cy.get('v-data-table tbody tr').should('have.length', numProjects); 
  });

  it('Deve permitir a busca de projetos por nome', () => {
    const searchTerm = 'Projeto Teste'; 
    cy.get('v-text-field[label="Pesquise o nome do edital"]').type(searchTerm);
    cy.get('v-btn').contains('Buscar').click();
    cy.wait('@getEdital'); 
    cy.contains(searchTerm).should('be.visible'); 
  });

  it('Deve exibir mensagem "Sem dados!" quando não houver projetos', () => {
    cy.intercept('GET', '/api/editais/*', { statusCode: 200, body: { Projetos: [] } }).as('getEditalEmpty');
    cy.reload();
    cy.wait('@getEditalEmpty');
    cy.contains('Sem dados!').should('be.visible');
  });

  it('Deve permitir a navegação para detalhes do projeto', () => {
    const projectId = Cypress.$('@getEdital').response().body.Projetos[0].Id; 
    cy.contains('a', Cypress.$('@getEdital').response().body.Projetos[0].Nome).click(); 
    cy.url().should('include', `/importaredital/FormProjeto/${projectId}`);
  });

  it('Deve permitir a paginação da lista de projetos', () => {
    const numProjects = Cypress.$('@getEdital').response().body.Projetos.length;
    if (numProjects > 10) { 
      cy.get('.v-data-table__pagination').should('be.visible'); 
      cy.get('.v-data-table__pagination__next').click(); 
    }
  });

  it('Botão "Voltar" deve redirecionar para a página anterior', () => {
    cy.get('.navigate-back').click();
    cy.url().should('include', '/importaredital/IndexImportarEdital'); 
  });

  it('Deve exibir o status do projeto corretamente', () => {
    Cypress.$('@getEdital').response().body.Projetos.forEach(project => {
      const status = project.StatusPreenchimento;
      cy.contains(status).should('be.visible');
      if (status === 'INCOMPLETO') {
        cy.contains(status).should('have.class', 'text-error');
      } else {
        cy.contains(status).should('have.class', 'text-success');
      }
    });
  });

  it('Deve exibir o número de alocações completas corretamente', () => {
    Cypress.$('@getEdital').response().body.Projetos.forEach(project => {
      cy.contains(`${project.AlocacoesCompletas}/${project.AlocacaoBolsistas.length}`).should('be.visible');
    });
  });

  it('Deve lidar com erros na busca de dados do edital', () => {
    cy.intercept('GET', '/api/editais/*', { statusCode: 500 }).as('getEditalError');
    cy.reload();
    cy.wait('@getEditalError');
    cy.contains('Erro ao carregar dados').should('be.visible');
  });

  it('Deve exibir a tabela de projetos', () => {
    cy.get('v-data-table').should('be.visible');
    cy.get('v-data-table tbody tr').should('have.length.greaterThan', 0);
  });

  it('Deve permitir a visualização de detalhes do projeto', () => {
    cy.get('v-data-table tbody tr').first().find('a').click();
    cy.url().should('include', '/importaredital/FormProjeto/');
  });

  it('Paginação deve funcionar corretamente', () => {
    cy.get('v-data-table').should('be.visible');
    // Add assertions to verify pagination functionality (e.g., changing pages, items per page).  This depends on your implementation of pagination.
  });
});