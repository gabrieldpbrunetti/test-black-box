/// <reference types="cypress" />

describe('Black Box Testing - Alocação de Bolsistas', () => {
  beforeEach(() => {
    cy.login(); 
    cy.visit('/path/to/your/allocation/page'); 
    cy.wait(500); 
  });

  it('Verifica o carregamento da página com esqueleto', () => {
    cy.intercept('/api/allocations', { fixture: 'initial_data.json' }).as('getAlocacoes');
    cy.wait('@getAlocacoes');
    cy.get('.skeleton-loader').should('be.visible');
    cy.wait('@getAlocacoes').then(() => {
      cy.get('.skeleton-loader').should('not.exist');
    });
  });

  it('Pesquisa por nome do bolsista', () => {
    const searchTerm = 'John Doe'; 
    cy.get('input[label="Pesquisar o nome do bolsista"]').type(searchTerm);
    cy.get('button:contains("Buscar")').click(); 
    cy.contains('td', searchTerm).should('be.visible');
  });

  it('Filtra por status da alocação', () => {
    const status = 'ATIVA';
    cy.get('v-select[label="Filtrar por status da alocação"]').select(status);
    cy.get('button:contains("Buscar")').click(); 
    cy.get('tbody tr').each(($el) => {
      cy.wrap($el).find('td:nth-child(2)').should('contain', 'Ativa');
    });
  });

  it('Pesquisa com nome e status', () => {
    const searchTerm = 'John';
    const status = 'ATIVA';
    cy.get('input[label="Pesquisar o nome do bolsista"]').type(searchTerm);
    cy.get('v-select[label="Filtrar por status da alocação"]').select(status);
    cy.get('button:contains("Buscar")').click(); 
    cy.contains('td', searchTerm).should('be.visible');
    cy.get('tbody tr').each(($el) => {
      cy.wrap($el).find('td:nth-child(2)').should('contain', 'Ativa');
    });
  });

  it('Atualiza quantidade de cotas pagas', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('input[type="number"]').then(($input) => {
        const initialCotas = parseInt($input.val());
        const newCotas = initialCotas + 1;
        cy.wrap($input).clear().type(newCotas.toString());
        cy.wrap($input).blur();
        cy.wrap($input).should('have.value', newCotas.toString());
        // Add assertion to check if API call was successful and data updated
      });
    });
  });

  it('Verifica validação de cotas pagas', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('span').then(($span) => {
        const totalCotas = parseInt($span.text());
        cy.get('input[type="number"]').clear().type((totalCotas + 1).toString());
        cy.get('.input-error').should('be.visible');
        cy.get('input[type="number"]').clear().type('');
        cy.get('.input-error').should('be.visible');
      });
    });
  });

  it('Cancela uma alocação', () => {
    cy.get('tbody tr').first().within(() => {
      cy.contains('mdi-cancel').click();
    });
    cy.get('v-dialog').should('be.visible');
    cy.get('input[type="date"]').type('2024-03-15');
    cy.get('v-textarea[name="justificativa"]').type('Justificativa de teste');
    cy.contains('Cancelar alocação').click();
    // Add assertion to check if API call was successful and data updated
  });

  it('Visualiza detalhes de cancelamento', () => {
    cy.get('tbody tr').first().within(() => {
      cy.contains('mdi-eye').click();
    });
    cy.get('v-dialog').should('be.visible');
    // Assertions to check displayed data
  });

  it('Verifica mensagem "Sem dados!"', () => {
    cy.intercept('/api/allocations', { body: { AlocacaoBolsistas: [] } }).as('getEmptyAllocations'); 
    cy.reload();
    cy.wait('@getEmptyAllocations');
    cy.contains('Sem dados!').should('be.visible');
  });

  it('Navegação "Voltar"', () => {
    cy.get('.navigate-back').click();
    // Assertion to check navigation
  });

  it('Handles errors gracefully', () => {
    cy.intercept('/api/allocations', { statusCode: 500 }).as('getData');
    cy.wait('@getData');
    cy.contains('Error loading data').should('be.visible'); 
  });
});