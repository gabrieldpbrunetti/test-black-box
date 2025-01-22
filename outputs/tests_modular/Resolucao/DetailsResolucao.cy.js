/// <reference types="cypress"/>

describe('Resolução Form', () => {
  beforeEach(() => {
    cy.visit('/resolucao/create'); 
  });

  it('should display the form correctly', () => {
    cy.contains('Número da resolução').should('be.visible');
    cy.contains('Data de publicação').should('be.visible');
    cy.contains('Ementa').should('be.visible');
    cy.contains('Link da publicação').should('be.visible');
    cy.contains('Número do E-Docs').should('be.visible');
    cy.contains('Excluir resolução').should('be.visible');
    cy.contains('Incluir resolução').should('be.visible'); 
  });

  it('Successfully submits a new resolution', () => {
    const resolutionData = {
      Numero: '123',
      Data: '2024-03-08',
      Ementa: 'Teste de ementa com menos de 500 caracteres',
      Link: 'https://fapes.es.gov.br/test',
      NumRastreioEdocs: 'WTC-10192'
    };

    cy.get('v-text-field[type="number"]').type(resolutionData.Numero);
    cy.get('v-text-field[type="date"]').type(resolutionData.Data);
    cy.get('v-textarea').type(resolutionData.Ementa);
    cy.get('v-text-field[placeholder="https://fapes.es.gov.br/..."').type(resolutionData.Link);
    cy.get('v-text-field[placeholder="EX: WTC-10192"]').type(resolutionData.NumRastreioEdocs);
    cy.contains('Incluir resolução').click();

    cy.url().should('include', '/resolucao/IndexResolucao'); 
  });

  it('should validate number field', () => {
    cy.get('v-text-field[type="number"]').type('0');
    cy.get('v-btn[type="submit"]').click();
    cy.contains('Número inválido').should('be.visible');

    cy.get('v-text-field[type="number"]').clear().type('-1');
    cy.get('v-btn[type="submit"]').click();
    cy.contains('Número inválido').should('be.visible');

    cy.get('v-text-field[type="number"]').clear().type('123');
    cy.get('v-btn[type="submit"]').click();
    cy.contains('Número inválido').should('not.exist');
  });

  it('should validate ementa length', () => {
    cy.get('v-textarea').type('a'.repeat(501));
    cy.get('v-btn[type="submit"]').click();
    cy.contains('Não foi possível realizar essa ação').should('be.visible');

    cy.get('v-textarea').clear().type('a'.repeat(500));
    cy.get('v-btn[type="submit"]').click();
    cy.contains('Não foi possível realizar essa ação').should('not.exist');
  });

  it('should validate link field', () => {
    cy.get('v-text-field[type="text"]').type('invalid-link');
    cy.get('v-btn[type="submit"]').click();
    cy.contains('Link inválido').should('be.visible');

    cy.get('v-text-field[type="text"]').clear().type('https://fapes.es.gov.br/test');
    cy.get('v-btn[type="submit"]').click();
    cy.contains('Link inválido').should('not.exist');
  });

  it('should submit the form successfully', () => {
    cy.get('v-text-field[type="number"]').type('123');
    cy.get('v-text-field[type="date"]').type('2024-01-26');
    cy.get('v-textarea').type('Ementa de teste');
    cy.get('v-text-field[type="text"]').type('https://fapes.es.gov.br/test');
    cy.get('v-text-field:nth-child(5)').type('WTC-10192');
    cy.get('v-btn[type="submit"]').click();
    cy.contains('Salvo com sucesso!').should('be.visible');
  });

  it('should show delete confirmation dialog', () => {
    cy.contains('Excluir resolução').click();
    cy.contains('Confirmar Exclusão').should('be.visible');
    cy.contains('Cancelar').click();
    cy.contains('Confirmar Exclusão').should('not.exist');
  });

  it('Successfully deletes a resolution', () => {
    cy.intercept('DELETE', '/api/resolucao/*').as('deleteResolution');
    cy.visit('/resolucao/edit/1'); 
    cy.wait('@getResolution');

    cy.contains('Excluir resolução').click();
    cy.contains('Excluir').click();
    cy.wait('@deleteResolution').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.url().should('include', '/resolucao/IndexResolucao');
  });

  it('should delete the item', () => {
    cy.contains('Excluir resolução').click();
    cy.contains('Excluir').click();
    cy.contains('Deletado com sucesso!').should('be.visible');
  });


  it('Handles deletion failure gracefully', () => {
    cy.intercept('DELETE', '/api/resolucao/*', {
      statusCode: 500,
      body: { message: 'Failed to delete resolution' }
    }).as('deleteResolution');
    cy.visit('/resolucao/edit/1'); 
    cy.wait('@getResolution');

    cy.contains('Excluir resolução').click();
    cy.contains('Excluir').click();
    cy.wait('@deleteResolution');
    cy.contains('Não foi possível apagar, pois a resolução está vinculada a um projeto').should('be.visible');
  });

  it('Successfully updates an existing resolution', () => {
    cy.intercept('GET', '/api/resolucao/*').as('getResolution');
    cy.intercept('PUT', '/api/resolucao/*').as('updateResolution');

    cy.visit('/resolucao/edit/1'); 

    cy.wait('@getResolution');

    const updatedResolutionData = {
      Numero: '456',
      Data: '2024-03-09',
      Ementa: 'Updated ementa',
      Link: 'https://fapes.es.gov.br/updated-link',
      NumRastreioEdocs: 'WTC-10193'
    };

    cy.get('v-text-field[type="number"]').clear().type(updatedResolutionData.Numero);
    cy.get('v-text-field[type="date"]').clear().type(updatedResolutionData.Data);
    cy.get('v-textarea').clear().type(updatedResolutionData.Ementa);
    cy.get('v-text-field[placeholder="https://fapes.es.gov.br/..."').clear().type(updatedResolutionData.Link);
    cy.get('v-text-field[placeholder="EX: WTC-10192"]').clear().type(updatedResolutionData.NumRastreioEdocs);
    cy.contains('Alterar resolução').click();

    cy.wait('@updateResolution').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.url().should('include', '/resolucao/IndexResolucao');
  });

  it('should update an existing resolution', () => {
    cy.visit('/resolucao/edit/1'); 
    cy.get('v-text-field[type="number"]').clear().type('456');
    cy.get('v-text-field[type="date"]').clear().type('2024-02-28');
    cy.get('v-textarea').clear().type('Ementa atualizada');
    cy.get('v-text-field[type="text"]').clear().type('https://fapes.es.gov.br/updated');
    cy.get('v-text-field:nth-child(5)').clear().type('WTC-10193');
    cy.get('v-btn[type="submit"]').click();
    cy.contains('Salvo com sucesso!').should('be.visible');
  });

  it('should handle character count in Ementa field', () => {
    cy.get('v-textarea').type('a'.repeat(500));
    cy.get('.font-weight-small').should('contain', '500/500');
    cy.get('v-textarea').type('a');
    cy.get('.font-weight-small').should('contain', '501/500').and('have.class', 'text-danger');
  });

  it('Navigation breadcrumbs are correct', () => {
    cy.contains('Resolução').should('be.visible').and('have.attr', 'href', '/resolucao/IndexResolucao');
    cy.contains('Incluir nova resolução').should('be.visible');

    cy.visit('/resolucao/edit/1'); 
    cy.contains('Resolução').should('be.visible').and('have.attr', 'href', '/resolucao/IndexResolucao');
    cy.contains('Alterar Resolução').should('be.visible');
  });
});