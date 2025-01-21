/// <reference types="cypress"/>

describe('Modalidade de Bolsa Form', () => {
  beforeEach(() => {
    cy.login(); // Assuming you have a login function
    cy.visit('/path/to/your/form'); // Replace with your actual route
  });

  it('should display the form correctly', () => {
    cy.get('[data-test="selectResolucao"]').should('be.visible');
    cy.get('[data-test="inputSiglaModalidade"]').should('be.visible');
    cy.get('[data-test="inputNomeModalidade"]').should('be.visible');
    cy.get('[data-test="inputNomeVersao"]').should('be.visible');
    cy.get('[data-test="inputStatusVersao"]').should('be.visible');
    cy.get('[data-test="textareaDescricao"]').should('be.visible');
    cy.get('[data-test="checkboxReducaoVinculo"]').should('be.visible');
    cy.get('[data-test="inputPercentualReducao"]').should('be.visible');
    cy.get('[data-test="inputDataVigencia"]').should('be.visible');
    cy.get('[data-test="selectModalidadesCompativeis"]').should('be.visible');
    cy.get('[data-test="buttonVoltar"]').should('be.visible');
    cy.get('[data-test="buttonSalvar"]').should('be.visible');
    cy.get('[data-test="buttonSalvarSair"]').should('be.visible');
    cy.get('[data-test="buttonExcluirVersao"]').should('be.visible');
    cy.get('[data-test="buttonAtivarVersao"]').should('be.visible');
    cy.get('[data-test="buttonCadastrarResolucao"]').should('be.visible');
    cy.get('[data-test="buttonAdicionarRequisito"]').should('be.visible');
    cy.get('[data-test="buttonAdicionarNivel"]').should('be.visible');

  });

  it('should allow filling and submitting the form', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="inputSiglaModalidade"]').type('TEST');
    cy.get('[data-test="inputNomeModalidade"]').type('Test Modalidade');
    cy.get('[data-test="inputNomeVersao"]').type('Test Version');
    cy.get('[data-test="textareaDescricao"]').type('Test Description');
    cy.get('[data-test="inputDataVigencia"]').type('2024-01-20'); 
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('Modalidade salva com sucesso!').should('be.visible'); 
  });

  it('should handle required fields validation', () => {
    cy.get('[data-test="buttonSalvar"]').click();
    cy.contains('Este campo é obrigatório').should('be.visible'); 
  });

  it('should handle the "Redução em caso de vínculo empregatício" checkbox', () => {
    cy.get('[data-test="checkboxReducaoVinculo"]').check();
    cy.get('[data-test="inputPercentualReducao"]').should('not.be.disabled');
    cy.get('[data-test="checkboxReducaoVinculo"]').uncheck();
    cy.get('[data-test="inputPercentualReducao"]').should('be.disabled');
  });


  it('should handle "Salvar e sair" button', () => {
    cy.get('[data-test="buttonSalvarSair"]').click();
    cy.url().should('not.include', '/path/to/your/form'); 
  });

  it('should handle "Excluir versão" button', () => {
    cy.get('[data-test="buttonExcluirVersao"]').click();
    cy.contains('Tem certeza que deseja excluir esta versão?').should('be.visible'); 
    cy.get('[data-test="buttonDeletarVersao"]').click(); 
    cy.contains('Versão excluída com sucesso!').should('be.visible'); 
  });

  it('should handle "Ativar versão de modalidade" button', () => {
    cy.get('[data-test="buttonAtivarVersao"]').click();
    cy.contains('Versão ativada com sucesso!').should('be.visible'); 
  });

  it('O botão "Cadastrar" deve redirecionar para a página de cadastro de resolução', () => {
    cy.get('[data-test="buttonCadastrarResolucao"]').click();
    cy.url().should('include', '/path/to/resolucao/cadastro'); 
  });

  // Requisitos e Níveis -  These tests require a more robust setup to ensure data exists before attempting to edit or delete.  Consider adding beforeEach hooks to create sample data.

  it('Deve ser possível adicionar um requisito', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
    cy.get('[data-test="selectTipoRequisito"]').select('Qualificação'); 
    cy.get('[data-test="textareaDescricaoRequisito"]').type('Descrição do requisito');
    cy.get('[data-test="buttonSalvarRequisito"]').click();
    cy.get('[data-test="iconEditarRequisito"]').should('be.visible'); 
  });

  it('Deve ser possível editar um requisito', () => {
    cy.get('[data-test="iconEditarRequisito"]').first().click(); 
    cy.get('[data-test="textareaDescricaoRequisito"]').clear().type('Descrição editada');
    cy.get('[data-test="buttonSalvarRequisito"]').click();
    cy.contains('Descrição editada').should('be.visible'); 
  });

  it('Deve ser possível deletar um requisito', () => {
    cy.get('[data-test="iconDeletarRequisito"]').first().click(); 
    cy.get('[data-test="buttonDeletarRequisito"]').click();
    cy.contains('Descrição do requisito').should('not.exist'); 
  });

  it('Deve ser possível adicionar um nível', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="inputSiglaNivel"]').type('NIVEL');
    cy.get('[data-test="selectMoedaNivel"]').select('Real'); 
    cy.get('[data-test="inputValorNivel"]').type('1000');
    cy.get('[data-test="buttonSalvarNivel"]').click();
    cy.get('[data-test="iconEditarNivel"]').should('be.visible'); 
  });

  it('Deve ser possível editar um nível', () => {
    cy.get('[data-test="iconEditarNivel"]').first().click(); 
    cy.get('[data-test="inputValorNivel"]').clear().type('1500');
    cy.get('[data-test="buttonSalvarNivel"]').click();
    cy.contains('1500').should('be.visible'); 
  });

  it('Deve ser possível deletar um nível', () => {
    cy.get('[data-test="iconDeletarNivel"]').first().click(); 
    cy.get('[data-test="buttonDeletarNivel"]').click();
    cy.contains('NIVEL').should('not.exist'); 
  });

  it('Deve ser possível adicionar um requisito de nível', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="buttonAdicionarRequisitoNivel"]').click();
    cy.get('[data-test="selectTipoRequisitoNivel"]').select('Qualificação'); 
    cy.get('[data-test="textareaDescricaoRequisitoNivel"]').type('Requisito de nível');
    cy.get('[data-test="buttonSalvarRequisitoNivel"]').click();
    cy.get('[data-test="iconEditarRequisitoNivel"]').should('be.visible'); 
  });

  it('Deve ser possível editar um requisito de nível', () => {
    cy.get('[data-test="iconEditarRequisitoNivel"]').first().click(); 
    cy.get('[data-test="textareaDescricaoRequisitoNivel"]').clear().type('Requisito de nível editado');
    cy.get('[data-test="buttonSalvarRequisitoNivel"]').click();
    cy.contains('Requisito de nível editado').should('be.visible'); 
  });

  it('Deve ser possível deletar um requisito de nível', () => {
    cy.get('[data-test="iconDeletarRequisitoNivel"]').first().click(); 
    cy.get('[data-test="buttonDeletarRequisitoNivel"]').click();
    cy.contains('Requisito de nível').should('not.exist'); 
  });

  it('Data de vigência deve ter valores mínimos e máximos', () => {
    cy.get('[data-test="inputDataVigencia"]').should('have.attr', 'min', '1960-01-01');
    cy.get('[data-test="inputDataVigencia"]').should('have.attr', 'max', '9999-12-30');
  });

  it('O campo de sigla do nível deve ter um limite de 15 caracteres', () => {
    cy.get('[data-test="inputSiglaNivel"]').should('have.attr', 'maxlength', '15');
  });

  it('A descrição do requisito deve ter um limite de 500 caracteres', () => {
    cy.get('[data-test="textareaDescricaoRequisito"]').type('a'.repeat(501)); 
    cy.contains('500/500 caracteres').should('not.exist'); 
  });


  // Add more tests as needed to cover all functionalities and edge cases.  Remember to replace placeholder values and selectors with your actual ones.
});