// src/pages/ReportsPage.jsx
import React, { useState } from "react";
import ExpensesDashboard from "../components/ExpensesDashboard";
import FamilyDataTable from "../components/FamilyDataTable";

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="reports-page">
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard Thống kê
        </button>
        <button
          className={`tab ${activeTab === "data" ? "active" : ""}`}
          onClick={() => setActiveTab("data")}
        >
          📋 Dữ liệu Chi tiết
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "dashboard" && <ExpensesDashboard />}
        {activeTab === "data" && <FamilyDataTable />}
      </div>
    </div>
  );
};

export default ReportsPage;
