describe('JSON-CSV Conversion', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should convert JSON to CSV', () => {
    const jsonInput = '{"key1": "value1", "key2": "value2"}';
    const expectedCsv = 'Key,English,Chinese,Bangladesh,Indonesia\nkey1,value1,,,\nkey2,value2,,,';

    cy.get('#json-input').type(jsonInput);
    cy.get('button').contains('Convert').click();
    cy.get('pre').should('contain', expectedCsv);
  });

  it('should convert CSV to JSON', () => {
    const csvInput = 'Key,English,Chinese,Bangladesh,Indonesia\nkey1,value1,,,\nkey2,value2,,,';
    const expectedJson = '{\n  "key1": "value1",\n  "key2": "value2"\n}';

    cy.get('button').contains('CSV to JSON').click();
    cy.uploadFile('test.csv', csvInput, 'text/csv');
    cy.get('button').contains('Convert').click();
    cy.get('pre').should('contain', expectedJson);
  });

  it('should change conversion direction', () => {
    cy.get('button').contains('JSON to CSV').should('have.class', 'p-button-info');
    cy.get('button').contains('CSV to JSON').click();
    cy.get('button').contains('CSV to JSON').should('have.class', 'p-button-info');
  });

  it('should select languages', () => {
    cy.get('#language-select').click();
    cy.get('.p-multiselect-item').contains('Chinese').click();
    cy.get('.p-multiselect-item').contains('Bangladesh').click();
    cy.get('#language-select').should('contain', 'Chinese');
    cy.get('#language-select').should('contain', 'Bangladesh');
  });

  it('should download converted file', () => {
    const jsonInput = '{"key1": "value1", "key2": "value2"}';
    cy.get('#json-input').type(jsonInput);
    cy.get('button').contains('Convert').click();
    cy.get('button').contains('Download CSV').click();
    cy.readFile('cypress/downloads/converted.csv').should('exist');
  });

  it('should copy JSON to clipboard', () => {
    const csvInput = 'Key,English,Chinese,Bangladesh,Indonesia\nkey1,value1,,,\nkey2,value2,,,';
    cy.get('button').contains('CSV to JSON').click();
    cy.uploadFile('test.csv', csvInput, 'text/csv');
    cy.get('button').contains('Convert').click();
    cy.get('button[icon="pi pi-copy"]').click();
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.contain('"key1": "value1"');
        expect(text).to.contain('"key2": "value2"');
      });
    });
  });
});