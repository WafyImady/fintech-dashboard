"use client";

import { useState } from "react";

export default function CashierDashboard() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Sends the data to our secure Next.js backend API
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod: paymentMethod,
          cashierId: "47c9f0f5-e842-4630-a4e2-8c7897b6e65c", 
        }),
      });

      if (!res.ok) throw new Error("Failed to process transaction");

      setStatus("success");
      setAmount(""); // Clear the input for the next customer
      
      // Reset the success message after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Transaction</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (MYR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">RM</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Payment Method Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white transition-colors"
            >
              <option value="Cash">Cash</option>
              <option value="DuitNow">DuitNow QR</option>
              <option value="GrabPay">GrabPay</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Processing..." : "Submit Payment"}
          </button>

          {/* Status Messages */}
          {status === "success" && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg text-center font-medium">
              Transaction recorded successfully!
            </div>
          )}
          {status === "error" && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg text-center font-medium">
              Error processing transaction. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}