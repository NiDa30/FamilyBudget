import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const monthlyData = [
    { month: "T4", users: 120, transactions: 240 },
    { month: "T5", users: 156, transactions: 310 },
    { month: "T6", users: 189, transactions: 380 },
    { month: "T7", users: 234, transactions: 450 },
    { month: "T8", users: 278, transactions: 520 },
    { month: "T9", users: 312, transactions: 610 },
  ];

  const categoryStats = [
    { name: "Ăn uống", value: 35 },
    { name: "Di chuyển", value: 20 },
    { name: "Giải trí", value: 15 },
    { name: "Giáo dục", value: 12 },
    { name: "Y tế", value: 10 },
    { name: "Khác", value: 8 },
  ];

  const COLORS = [
    "#0D9488",
    "#06B6D4",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
  ];

  const stats = [
    {
      label: "Tổng người dùng",
      value: "312",
      change: "↑ 12%",
      gradient: "from-teal-600 to-cyan-600",
      border: "border-teal-100",
    },
    {
      label: "Giao dịch/tháng",
      value: "6,100",
      change: "↑ 17%",
      gradient: "from-purple-600 to-pink-600",
      border: "border-purple-100",
    },
    {
      label: "Tổng chi tiêu",
      value: "110M",
      change: "↑ 15%",
      gradient: "from-green-600 to-emerald-600",
      border: "border-green-100",
    },
    {
      label: "Tài khoản đang khóa",
      value: "1",
      change: "0.3%",
      color: "text-red-600",
      border: "border-red-100",
      changeColor: "text-gray-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Tổng quan hệ thống
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white p-6 rounded-2xl shadow-md border ${stat.border} hover:shadow-xl transition-shadow`}
          >
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p
              className={`text-3xl font-bold ${
                stat.gradient
                  ? `bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`
                  : stat.color
              }`}
            >
              {stat.value}
            </p>
            <p
              className={`text-xs mt-2 ${stat.changeColor || "text-green-600"}`}
            >
              {stat.change} so với tháng trước
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Xu hướng tăng trưởng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#14b8a6"
                strokeWidth={3}
                name="Người dùng"
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#06b6d4"
                strokeWidth={3}
                name="Giao dịch (x10)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Phân bố chi tiêu theo danh mục
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
