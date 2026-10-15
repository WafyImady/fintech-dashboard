describe('Cashier Dashboard E2E Walkthrough', () => {
  
  it('successfully processes a complete digital transaction', () => {
    // 1. Navigate to the app (using the baseUrl we set)
    cy.visit('/dashboard');

    // 2. Verify the page loaded correctly
    cy.contains('New Transaction').should('be.visible');

    // 3. Act as the cashier typing the amount
    cy.get('input[type="number"]')
      .type('250.00')
      .should('have.value', '250.00');

    // 4. Select the payment method
    cy.get('select')
      .select('GrabPay')
      .should('have.value', 'GrabPay');

    // 5. Submit the transaction
    cy.contains('button', 'Submit Payment').click();

    // 6. Verify the UI updates to loading state
    cy.contains('button', 'Processing...').should('be.visible');

    // 7. Verify the final success state from the backend response
    cy.contains('Transaction recorded successfully!').should('be.visible');

    // 8. Verify the form cleared itself for the next customer
    cy.get('input[type="number"]').should('have.value', '');
  });
});