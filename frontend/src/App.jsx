// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TransactionsTable from "./components/TransactionsTable";
import PrivateRoute from "./components/PrivateRoute";
import API from "./api";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <TransactionsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function TransactionsPage() {
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTx = async () => {
      setLoading(true);
      try {
        // use API which adds token automatically
        const res = await API.get("/transactions", { params: { page, limit: 10 } });
        // assume backend returns { data: [...], total: n } or just array — adjust as needed
        setData(res.data || []);
      } catch (err) {
        console.error("❌ Error loading transactions:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [page]);

  return loading ? (
    <div style={{ padding: 24 }}>Loading...</div>
  ) : (
    <TransactionsTable data={data} page={page} onPageChange={setPage} />
  );
}

export default App;
