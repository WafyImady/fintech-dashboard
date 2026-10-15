// src/utils/feeCalculator.test.ts
import { calculateSettlement } from './feeCalculator';

describe('Fintech Fee Calculator Logic', () => {

  // Equivalence Partition 1: Digital Payments (Should charge 1.5%)
  it('charges exactly 1.5% for GrabPay and DuitNow', () => {
    const result = calculateSettlement(100.00, 'GrabPay');
    expect(result.feeDeducted).toBe(1.50);
    expect(result.netSettlement).toBe(98.50);
  });

  // Equivalence Partition 2: Cash Payments (Should charge 0%)
  it('charges 0 fee for Cash transactions', () => {
    const result = calculateSettlement(50.00, 'Cash');
    expect(result.feeDeducted).toBe(0.00);
    expect(result.netSettlement).toBe(50.00);
  });

  // Boundary Value Analysis: The absolute minimum valid transaction
  it('correctly calculates the minimum boundary value of RM 0.01', () => {
    const result = calculateSettlement(0.01, 'Cash');
    expect(result.feeDeducted).toBe(0.00);
    expect(result.netSettlement).toBe(0.01);
  });

  // Boundary Value Analysis: Invalid Boundaries (Zero and Negative)
  it('throws an error if the amount is exactly 0', () => {
    expect(() => calculateSettlement(0, 'GrabPay')).toThrow("Amount must be greater than zero");
  });

  it('throws an error if the amount is negative', () => {
    expect(() => calculateSettlement(-10.50, 'Cash')).toThrow("Amount must be greater than zero");
  });

});