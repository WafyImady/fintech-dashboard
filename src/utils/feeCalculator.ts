// src/utils/feeCalculator.ts

export function calculateSettlement(amount: number, paymentMethod: string) {
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const feePercentage = paymentMethod === 'Cash' ? 0 : 0.015;
  
  // Calculate to exactly 2 decimal places to prevent floating-point errors
  const feeDeducted = Number((amount * feePercentage).toFixed(2));
  const netSettlement = Number((amount - feeDeducted).toFixed(2));

  return { feeDeducted, netSettlement };
}