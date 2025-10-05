import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";

// Dữ liệu giả lập
const mockCategories = [
  { id: 1, name: "Ăn uống" },
  { id: 2, name: "Di chuyển" },
  { id: 3, name: "Giải trí" },
];

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    // Giả lập fetch API
    setCategories(mockCategories);
  }, []);

  const openModal = (category = null) => {
    setEditingCategory(category);
    setIsModalVisible(true);
    form.setFieldsValue({ name: category ? category.name : "" });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingCategory) {
        // Sửa danh mục
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, name: values.name } : cat
          )
        );
        message.success("Cập nhật danh mục thành công");
      } else {
        // Thêm danh mục mới
        const newCategory = {
          id: categories.length
            ? Math.max(...categories.map((c) => c.id)) + 1
            : 1,
          name: values.name,
        };
        setCategories((prev) => [...prev, newCategory]);
        message.success("Thêm danh mục thành công");
      }
      handleCancel();
    });
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    message.success("Xoá danh mục thành công");
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá danh mục này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3>📂 Quản lý danh mục</h3>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 16 }}
      >
        Thêm danh mục
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        open={isModalVisible} // ✅ antd v5 dùng "open"
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="categoryForm">
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoriesPage;
