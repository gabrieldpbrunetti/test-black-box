/// <reference types="cypress" />

describe('Modalidade de Bolsa Form', () => {
  beforeEach(() => {
    cy.visit('/modalidade/NovaVersaoModalidade'); 
  });

  it('should render the form', () => {
    cy.get('form').should('exist');
    cy.get('[data-test="selectResolucao"]').should('exist');
    cy.get('[data-test="inputSiglaModalidade"]').should('exist');
    cy.get('[data-test="inputNomeModalidade"]').should('exist');
    cy.get('[data-test="inputNomeVersao"]').should('exist');
    cy.get('[data-test="inputStatusVersao"]').should('exist');
    cy.get('[data-test="textareaDescricao"]').should('exist');
    cy.get('[data-test="checkboxReducaoVinculo"]').should('exist');
    cy.get('[data-test="inputPercentualReducao"]').should('exist');
    cy.get('[data-test="inputDataVigencia"]').should('exist');
    cy.get('[data-test="selectModalidadesCompativeis"]').should('exist');
    cy.get('[data-test="buttonVoltar"]').should('exist');
    cy.get('[data-test="buttonSalvar"]').should('exist');
    cy.get('[data-test="buttonSalvarSair"]').should('exist');
    cy.get('[data-test="buttonExcluirVersao"]').should('exist');
    cy.get('[data-test="buttonAtivarVersao"]').should('exist');
    cy.get('[data-test="buttonCadastrarResolucao"]').should('exist');

  });

  it('Deve ser possível preencher todos os campos obrigatórios e salvar a modalidade', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="inputSiglaModalidade"]').type('TEST');
    cy.get('[data-test="inputNomeModalidade"]').type('Teste de Modalidade');
    cy.get('[data-test="inputNomeVersao"]').type('Versão Teste');
    cy.get('[data-test="textareaDescricao"]').type('Descrição da modalidade de teste.');
    cy.get('[data-test="checkboxReducaoVinculo"]').check();
    cy.get('[data-test="inputPercentualReducao"]').type('50');
    cy.get('[data-test="inputDataVigencia"]').type('2024-01-01');
    cy.get('[data-test="buttonSalvar"]').click();
    cy.url().should('include', '/sucesso'); 
  });

  it('Deve ser possível adicionar um novo requisito', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
    cy.get('[data-test="selectTipoRequisito"]').select('0'); 
    cy.get('[data-test="textareaDescricaoRequisito"]').type('Requisito de teste');
    cy.get('[data-test="buttonSalvarRequisito"]').click();
    cy.get('tbody tr').should('contain', 'Requisito de teste');
  });

  it('Deve ser possível editar um requisito existente', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
    cy.get('[data-test="selectTipoRequisito"]').select('0');
    cy.get('[data-test="textareaDescricaoRequisito"]').type('Requisito a ser editado');
    cy.get('[data-test="buttonSalvarRequisito"]').click();
    cy.get('[data-test="iconEditarRequisito"]').first().click(); 
    cy.get('[data-test="textareaDescricaoRequisito"]').clear().type('Requisito editado');
    cy.get('[data-test="buttonSalvarRequisito"]').click();
    cy.get('tbody tr').should('contain', 'Requisito editado');
    cy.get('tbody tr').should('not.contain', 'Requisito a ser editado');
  });

  it('Deve ser possível deletar um requisito existente', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
    cy.get('[data-test="selectTipoRequisito"]').select('0');
    cy.get('[data-test="textareaDescricaoRequisito"]').type('Requisito a ser deletado');
    cy.get('[data-test="buttonSalvarRequisito"]').click();
    cy.get('[data-test="iconDeletarRequisito"]').first().click(); 
    cy.get('[data-test="buttonDeletarRequisito"]').click();
    cy.get('tbody tr').should('not.contain', 'Requisito a ser deletado');
  });

  it('Deve ser possível adicionar um novo nível', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="inputSiglaNivel"]').type('NIVEL-TESTE');
    cy.get('[data-test="selectMoedaNivel"]').select('1'); 
    cy.get('[data-test="inputValorNivel"]').type('1000');
    cy.get('[data-test="buttonSalvarNivel"]').click();
    cy.get('tbody tr').should('contain', 'NIVEL-TESTE');
  });

  it('Deve ser possível adicionar um requisito a um nível', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="inputSiglaNivel"]').type('NIVEL-REQUISITO');
    cy.get('[data-test="selectMoedaNivel"]').select('1');
    cy.get('[data-test="inputValorNivel"]').type('1000');
    cy.get('[data-test="buttonSalvarNivel"]').click();
    cy.get('[data-test="buttonAdicionarRequisitoNivel"]').click();
    cy.get('[data-test="selectTipoRequisitoNivel"]').select('0');
    cy.get('[data-test="textareaDescricaoRequisitoNivel"]').type('Requisito do nível');
    cy.get('[data-test="buttonSalvarRequisitoNivel"]').click();
    cy.contains('tbody tr', 'Requisito do nível').should('be.visible');
  });

  it('Deve ser possível editar um nível existente', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="inputSiglaNivel"]').type('NIVEL-EDITAR');
    cy.get('[data-test="selectMoedaNivel"]').select('1');
    cy.get('[data-test="inputValorNivel"]').type('1000');
    cy.get('[data-test="buttonSalvarNivel"]').click();
    cy.get('[data-test="iconEditarNivel"]').first().click();
    cy.get('[data-test="inputValorNivel"]').clear().type('2000');
    cy.get('[data-test="buttonSalvarNivel"]').click();
    cy.contains('tbody tr', '2000').should('be.visible');
  });

  it('Deve ser possível deletar um nível existente', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="inputSiglaNivel"]').type('NIVEL-DELETAR');
    cy.get('[data-test="selectMoedaNivel"]').select('1');
    cy.get('[data-test="inputValorNivel"]').type('1000');
    cy.get('[data-test="buttonSalvarNivel"]').click();
    cy.get('[data-test="iconDeletarNivel"]').first().click();
    cy.get('[data-test="buttonDeletarNivel"]').click();
    cy.get('tbody tr').should('not.contain', 'NIVEL-DELETAR');
  });

  it('Deve ser possível cancelar a edição de um requisito', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
    cy.get('[data-test="selectTipoRequisito"]').select('0');
    cy.get('[data-test="textareaDescricaoRequisito"]').type('Requisito a ser cancelado');
    cy.get('[data-test="buttonCancelarRequisito"]').click();
    cy.get('[data-test="buttonAdicionarRequisito"]').should('be.visible');
    cy.get('tbody tr').should('not.contain', 'Requisito a ser cancelado');
  });

  it('Deve ser possível cancelar a edição de um nível', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="inputSiglaNivel"]').type('NIVEL-CANCELAR');
    cy.get('[data-test="selectMoedaNivel"]').select('1');
    cy.get('[data-test="inputValorNivel"]').type('1000');
    cy.get('[data-test="buttonFecharNivel"]').click();
    cy.get('[data-test="buttonAdicionarNivel"]').should('be.visible');
    cy.get('tbody tr').should('not.contain', 'NIVEL-CANCELAR');
  });

  it('Deve ser possível cancelar a exclusão de um requisito', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
    cy.get('[data-test="selectTipoRequisito"]').select('0');
    cy.get('[data-test="textareaDescricaoRequisito"]').type('Requisito a ser cancelado');
    cy.get('[data-test="buttonSalvarRequisito"]').click();
    cy.get('[data-test="iconDeletarRequisito"]').first().click();
    cy.get('[data-test="buttonCancelarDeletarRequisito"]').click();
    cy.get('[data-test="iconDeletarRequisito"]').should('be.visible');
    cy.get('tbody tr').should('contain', 'Requisito a ser cancelado');
  });

  it('Deve ser possível cancelar a exclusão de um nível', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="inputSiglaNivel"]').type('NIVEL-CANCELAR-DELETE');
    cy.get('[data-test="selectMoedaNivel"]').select('1');
    cy.get('[data-test="inputValorNivel"]').type('1000');
    cy.get('[data-test="buttonSalvarNivel"]').click();
    cy.get('[data-test="iconDeletarNivel"]').first().click();
    cy.get('[data-test="buttonCancelarDeletarNivel"]').click();
    cy.get('[data-test="iconDeletarNivel"]').should('be.visible');
    cy.get('tbody tr').should('contain', 'NIVEL-CANCELAR-DELETE');
  });


  it('Ao clicar em "Salvar e sair", deve salvar e redirecionar para a página anterior', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="inputSiglaModalidade"]').type('SAVEEXIT');
    cy.get('[data-test="inputNomeModalidade"]').type('Salvar e sair');
    cy.get('[data-test="inputNomeVersao"]').type('Versão Salvar e sair');
    cy.get('[data-test="textareaDescricao"]').type('Descrição da modalidade salvar e sair.');
    cy.get('[data-test="buttonSalvarSair"]').click();
    cy.url().should('not.include', '/NovaVersaoModalidade'); 
  });

  it('Deve ser possível excluir a versão da modalidade', () => {
    cy.get('[data-test="buttonExcluirVersao"]').click();
    // Adicione asserções para verificar se a versão foi excluída e se houve redirecionamento ou mensagem de sucesso.
  });

  it('Deve ser possível ativar a versão da modalidade', () => {
    cy.get('[data-test="buttonAtivarVersao"]').click();
    // Adicione asserções para verificar se a versão foi ativada e se houve redirecionamento ou mensagem de sucesso.
  });

  it('Campos obrigatórios devem exibir mensagem de erro ao tentar salvar sem preenchimento', () => {
    cy.get('[data-test="buttonSalvar"]').click();
    cy.get('[data-test="selectResolucao"] + .v-input__details').should('be.visible').and('contain', 'Este campo é obrigatório');
    cy.get('[data-test="inputSiglaModalidade"] + .v-input__details').should('be.visible').and('contain', 'Este campo é obrigatório');
    cy.get('[data-test="inputNomeModalidade"] + .v-input__details').should('be.visible').and('contain', 'Este campo é obrigatório');
    cy.get('[data-test="inputNomeVersao"] + .v-input__details').should('be.visible').and('contain', 'Este campo é obrigatório');
    cy.get('[data-test="textareaDescricao"] + .v-input__details').should('be.visible').and('contain', 'Este campo é obrigatório');
    cy.get('[data-test="inputDataVigencia"] + .v-input__details').should('be.visible').and('contain', 'Este campo é obrigatório');
  });

  it('Campo de percentual de redução deve aceitar apenas valores numéricos entre 0 e 100', () => {
    cy.get('[data-test="checkboxReducaoVinculo"]').check();
    cy.get('[data-test="inputPercentualReducao"]').type('101');
    cy.get('[data-test="inputPercentualReducao"] + .v-input__details').should('be.visible').and('contain', 'Valor deve ser entre 0 e 100');
    cy.get('[data-test="inputPercentualReducao"]').clear().type('-1');
    cy.get('[data-test="inputPercentualReducao"] + .v-input__details').should('be.visible').and('contain', 'Valor deve ser entre 0 e 100');
    cy.get('[data-test="inputPercentualReducao"]').clear().type('abc');
    cy.get('[data-test="inputPercentualReducao"] + .v-input__details').should('be.visible').and('contain', 'Valor inválido');
  });

  it('Campo de data de vigência deve aceitar apenas datas válidas', () => {
    cy.get('[data-test="inputDataVigencia"]').type('abc');
    cy.get('[data-test="inputDataVigencia"] + .v-input__details').should('be.visible').and('contain', 'Data inválida');
  });

  it('Ao clicar em "Cadastrar" no link "Cadastrar Resolução", deve redirecionar para a página de cadastro de resolução', () => {
    cy.get('[data-test="buttonCadastrarResolucao"]').click();
    cy.url().should('include', '/cadastro-resolucao'); 
  });

  it('Deve ser possível selecionar múltiplas modalidades compatíveis', () => {
    cy.get('[data-test="selectModalidadesCompativeis"]').select(['1', '2']); 
  });

  it('should open and close the requisito dialog', () => {
    cy.get('[data-test="buttonAdicionarRequisito"]').click();
    cy.get('[data-test="selectTipoRequisito"]').should('be.visible');
    cy.get('[data-test="textareaDescricaoRequisito"]').should('be.visible');
    cy.get('[data-test="buttonCancelarRequisito"]').click();
    cy.get('[data-test="selectTipoRequisito"]').should('not.be.visible');
    cy.get('[data-test="textareaDescricaoRequisito"]').should('not.be.visible');
  });

  it('should open and close the nivel dialog', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="inputSiglaNivel"]').should('be.visible');
    cy.get('[data-test="selectMoedaNivel"]').should('be.visible');
    cy.get('[data-test="inputValorNivel"]').should('be.visible');
    cy.get('[data-test="buttonFecharNivel"]').click();
    cy.get('[data-test="inputSiglaNivel"]').should('not.be.visible');
    cy.get('[data-test="selectMoedaNivel"]').should('not.be.visible');
    cy.get('[data-test="inputValorNivel"]').should('not.be.visible');
  });

  it('should open and close the requisito nivel dialog', () => {
    cy.get('[data-test="buttonAdicionarNivel"]').click();
    cy.get('[data-test="buttonAdicionarRequisitoNivel"]').click();
    cy.get('[data-test="selectTipoRequisitoNivel"]').should('be.visible');
    cy.get('[data-test="textareaDescricaoRequisitoNivel"]').should('be.visible');
    cy.get('[data-test="buttonCancelarRequisitoNivel"]').click();
    cy.get('[data-test="selectTipoRequisitoNivel"]').should('not.be.visible');
    cy.get('[data-test="textareaDescricaoRequisitoNivel"]').should('not.be.visible');
  });

  it('should handle delete confirmation dialogs', () => {
    cy.get('[data-test="iconDeletarRequisito"]').first().click();
    cy.get('[data-test="buttonCancelarDeletarRequisito"]').click();
    cy.get('[data-test="iconDeletarRequisitoNivel"]').first().click();
    cy.get('[data-test="buttonCancelarDeletarRequisitoNivel"]').click();
    cy.get('[data-test="iconDeletarNivel"]').first().click();
    cy.get('[data-test="buttonCancelarDeletarNivel"]').click();
  });

  it('Deve ser possível clicar no botão "Voltar"', () => {
    cy.get('[data-test="buttonVoltar"]').click();
  });

  it('Deve ser possível clicar no botão "Salvar e sair"', () => {
    cy.get('[data-test="selectResolucao"]').select('1'); 
    cy.get('[data-test="inputSiglaModalidade"]').type('TESTE2');
    cy.get('[data-test="inputNomeModalidade"]').type('Teste Modalidade 2');
    cy.get('[data-test="inputNomeVersao"]').type('Versão Teste 2');
    cy.get('[data-test="textareaDescricao"]').type('Descrição da modalidade de teste 2.');
    cy.get('[data-test="buttonSalvarSair"]').click();
  });

  it('Deve ser possível clicar no botão "Excluir versão"', () => {
    cy.get('[data-test="buttonExcluirVersao"]').click();
  });

  it('Deve ser possível clicar no botão "Ativar versão de modalidade"', () => {
    cy.get('[data-test="buttonAtivarVersao"]').click();
  });

});