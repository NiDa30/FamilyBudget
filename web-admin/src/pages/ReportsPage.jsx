import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const { Option } = Select;

// Dữ liệu giả lập
const mockTrendData = [
  { month: "Tháng 1", expense: 1200 },
  { month: "Tháng 2", expense: 1500 },
  { month: "Tháng 3", expense: 900 },
  { month: "Tháng 4", expense: 1700 },
  { month: "Tháng 5", expense: 1400 },
];

const mockCategoryData = [
  { name: "Ăn uống", value: 400 },
  { name: "Di chuyển", value: 300 },
  { name: "Giải trí", value: 200 },
  { name: "Khác", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function ReportsPage() {
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("6 tháng");

  useEffect(() => {
    // Giả lập fetch API
    setTrendData(mockTrendData);
    setCategoryData(mockCategoryData);
  }, []);

  return (
    <div>
      <h3>📊 Báo cáo tổng hợp</h3>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Select
            value={timeFilter}
            onChange={setTimeFilter}
            style={{ width: 200 }}
          >
            <Option value="6 tháng">6 tháng</Option>
            <Option value="12 tháng">12 tháng</Option>
            <Option value="24 tháng">24 tháng</Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="Xu hướng chi tiêu theo tháng">
            <LineChart
              width={600}
              height={300}
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Phân loại chi tiêu">
            <PieChart width={300} height={300}>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReportsPage;
