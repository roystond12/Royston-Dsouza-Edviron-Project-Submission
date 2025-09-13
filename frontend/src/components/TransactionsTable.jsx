import React, { useMemo, useState } from "react";
import axios from "axios";
import styles from "./TransactionsTable.module.css";

export default function TransactionsTable({ page = 1, onPageChange }) {
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("payment_time");
  const [order, setOrder] = useState("desc");
  const [isVisible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const dummyData = [
    {
      collect_id: "COLLECT-001",
      school_id: "SCH-001",
      gateway: "Stripe",
      order_amount: 1200,
      transaction_amount: 1200,
      status: "success",
      custom_order_id: "ORD-001",
      payment_time: "2023-01-01T10:00:00Z",
    },
    {
      collect_id: "COLLECT-002",
      school_id: "SCH-002",
      gateway: "PayPal",
      order_amount: 1500,
      transaction_amount: 1500,
      status: "pending",
      custom_order_id: "ORD-002",
      payment_time: "2023-01-02T11:00:00Z",
    },
    {
      collect_id: "COLLECT-003",
      school_id: "SCH-003",
      gateway: "Stripe",
      order_amount: 900,
      transaction_amount: 900,
      status: "failed",
      custom_order_id: "ORD-003",
      payment_time: "2023-01-03T12:00:00Z",
    },
  ];

  const filteredData = useMemo(() => {
    let arr = dummyData.slice();
    if (filterStatus) {
      arr = arr.filter(
        (r) => (r.status || "").toLowerCase() === filterStatus.toLowerCase()
      );
    }
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter(
        (r) =>
          (r.collect_id || "").toLowerCase().includes(s) ||
          (r.school_id || "").toLowerCase().includes(s) ||
          (r.custom_order_id || "").toLowerCase().includes(s)
      );
    }
    arr.sort((a, b) => {
      const aVal = a[sort] ?? "";
      const bVal = b[sort] ?? "";
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filterStatus, search, sort, order]);

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/create-payment", {
        order_id: "ORD" + Date.now(),
        amount: 2000,
        school_id: "65b0e6293e9f76a9694d84b4",
        student_info: {
          id: "stu123",
          name: "John Doe",
          email: "john@example.com",
        },
      });

      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        alert("Payment failed to initiate");
      }
    } catch (err) {
      console.error("Payment error:", err);
      if (err.response) {
        alert(`Payment error: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        alert("No response from payment server");
      } else {
        alert("Payment request error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by order / school..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.statusDropdown}
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={styles.statusDropdown}
        >
          <option value="payment_time">Date</option>
          <option value="transaction_amount">Amount</option>
          <option value="status">Status</option>
        </select>
        <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
          {order === "asc" ? "⬆️" : "⬇️"}
        </button>
        <button onClick={handlePayNow} disabled={loading} style={{ marginLeft: 20 }}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {isVisible && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Collect ID</th>
              <th>School ID</th>
              <th>Gateway</th>
              <th>Order Amount</th>
              <th>Transaction Amount</th>
              <th>Status</th>
              <th>Custom Order ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <tr key={row.collect_id} className={styles.row}>
                  <td>{row.collect_id}</td>
                  <td>{row.school_id}</td>
                  <td>{row.gateway}</td>
                  <td>{row.order_amount}</td>
                  <td>{row.transaction_amount}</td>
                  <td>
                    <span className={`${styles.status} ${styles[row.status] || ""}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.custom_order_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.empty}>
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => onPageChange(page + 1)}>Next</button>
        <button onClick={() => setVisible(!isVisible)}>Toggle Visibility</button>
      </div>
    </div>
  );
}
