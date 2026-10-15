import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/utils/env'; // Adjust this path based on your folder structure

// 1. Initialize the Secure Admin Connection
// We now pull from the Zod-validated env object instead of process.env
const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req: Request) {
  try {
    // 2. Unpack the JSON envelope sent by the frontend
    const body = await req.json();
    const { amount, paymentMethod, cashierId } = body;

    // Backend Validation: Never trust the frontend completely
    if (!amount || amount <= 0 || !paymentMethod || !cashierId) {
      return NextResponse.json(
        { error: 'Invalid transaction data' }, 
        { status: 400 }
      );
    }

    // 3. The Business Logic (The Math)
    // We calculate a 1.5% merchant fee for digital payments, and 0% for Cash.
    let feePercentage = 0.015;
    if (paymentMethod === 'Cash') {
      feePercentage = 0;
    }

    // Calculate the exact ringgit amounts
    const feeDeducted = amount * feePercentage;
    const netSettlement = amount - feeDeducted;

    // 4. Secure Database Insertion
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert([
        {
          cashier_id: cashierId,
          amount: amount,
          fee_deducted: feeDeducted,
          net_settlement: netSettlement,
          payment_method: paymentMethod,
        }
      ])
      .select(); // Tells Supabase to return the newly created row

    // Handle database-specific errors
    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: 'Failed to save transaction' }, 
        { status: 500 }
      );
    }

    // 5. Send the "OK" signal back to the frontend
    return NextResponse.json(
      { success: true, transaction: data[0] }, 
      { status: 201 }
    );

  } catch (error) {
    // Catch fatal server crashes
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}