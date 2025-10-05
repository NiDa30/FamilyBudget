import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  message,
  Popconfirm,
  Card,
  Tag,
} from "antd";

// Mẫu dữ liệu giả lập
const mockUsers = [
  { id: 1, name: "Nguyen Van A", email: "a@gmail.com", status: "active" },
  { id: 2, name: "Tran Thi B", email: "b@gmail.com", status: "locked" },
  { id: 3, name: "Le Van C", email: "c@gmail.com", status: "active" },
  { id: 4, name: "Pham Thi D", email: "d@gmail.com", status: "active" },
  { id: 5, name: "Hoang Van E", email: "e@gmail.com", status: "locked" },
];

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Giả lập fetch API
    setUsers(mockUsers);
  }, []);

  const handleLockUnlock = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "active" ? "locked" : "active" }
          : user
      )
    );
    const user = users.find((u) => u.id === id);
    message.success(
      `${user.name} đã được ${user.status === "active" ? "khoá" : "mở khoá"}`
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Họ và tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) =>
        text === "active" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Đã khoá</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={`Bạn có chắc muốn ${
              record.status === "active" ? "khoá" : "mở khoá"
            } tài khoản này?`}
            onConfirm={() => handleLockUnlock(record.id)}
          >
            <Button
                className={record.status === "active" ? "btn-lock" : "btn-unlock"}
            >
                {record.status === "active" ? "Khoá" : "Mở khoá"}
            </Button>

          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="📋 Quản lý người dùng"
      bordered={false}
      style={{
        borderRadius: 16,
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
      headStyle={{
        background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
        color: "#fff",
        borderRadius: "16px 16px 0 0",
        fontSize: 18,
      }}
    >
      <Input.Search
        placeholder="🔍 Tìm theo tên hoặc email"
        allowClear
        style={{ width: 300, marginBottom: 16, borderRadius: 8 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
    </Card>
  );
}

export default UsersPage;
