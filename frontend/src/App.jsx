import React, { useEffect, useState } from "react";
import API from "./api"; // ✅ use your configured axios instance

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ token automatically added by API.js interceptor
        const res = await API.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("❌ Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Collect ID</th>
                <th className="p-2">School ID</th>
                <th className="p-2">Gateway</th>
                <th className="p-2">Order Amt</th>
                <th className="p-2">Txn Amt</th>
                <th className="p-2">Status</th>
                <th className="p-2">Custom Order ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr key={txn.collect_id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{txn.collect_id}</td>
                    <td className="p-2">{txn.school_id}</td>
                    <td className="p-2">{txn.gateway}</td>
                    <td className="p-2">{txn.order_amount}</td>
                    <td className="p-2">{txn.transaction_amount}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          txn.status === "success"
                            ? "bg-green-500"
                            : txn.status === "failed"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-2">{txn.custom_order_id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
