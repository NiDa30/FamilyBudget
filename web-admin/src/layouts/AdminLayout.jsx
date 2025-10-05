import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  SettingOutlined,
  CloudSyncOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

function AdminLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { key: "users", label: "Quản lý người dùng", icon: <UserOutlined /> },
    {
      key: "categories",
      label: "Quản lý danh mục",
      icon: <AppstoreOutlined />,
    },
    { key: "reports", label: "Báo cáo tổng hợp", icon: <BarChartOutlined /> },
    { key: "config", label: "Cấu hình", icon: <SettingOutlined /> },
    { key: "sync-logs", label: "Log đồng bộ", icon: <CloudSyncOutlined /> },
    { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined /> },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("isAuth");
      navigate("/login");
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div
          style={{
            height: 64,
            margin: 16,
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          ⚡ Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{ background: "#fff", paddingLeft: 20, fontWeight: "bold" }}
        >
          Dashboard Admin
        </Header>
        <Content style={{ margin: "20px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
