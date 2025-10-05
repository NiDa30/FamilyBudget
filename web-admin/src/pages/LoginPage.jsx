import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { FaUserShield } from "react-icons/fa";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const { Title } = Typography;
const { TabPane } = Tabs;

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  // Đăng nhập
  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAuth", "true");
      message.success("Đăng nhập thành công!");
      navigate("/admin/users");
    } catch (error) {
      let errorMessage = "Đăng nhập thất bại!";

      if (error.code === "auth/user-not-found") {
        errorMessage = "Tài khoản không tồn tại!";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Mật khẩu không chính xác!";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Email hoặc mật khẩu không chính xác!";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email không hợp lệ!";
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký
  const handleRegister = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAuth", "true");
      message.success("Đăng ký thành công! Chuyển hướng...");
      setTimeout(() => {
        navigate("/admin/users");
      }, 1000);
    } catch (error) {
      let errorMessage = "Đăng ký thất bại!";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email đã được sử dụng!";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email không hợp lệ!";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Mật khẩu quá yếu! Cần ít nhất 6 ký tự.";
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.setItem("isAuth", "true");
      message.success("Đăng nhập Google thành công!");
      navigate("/admin/users");
    } catch (error) {
      message.error("Lỗi đăng nhập Google: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        style={{
          width: 450,
          padding: "20px 30px",
          borderRadius: 16,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: 36,
              animation: "pulse 2s infinite",
            }}
          >
            <FaUserShield />
          </div>
        </div>

        <Title
          level={3}
          style={{ textAlign: "center", marginBottom: 24, fontWeight: "600" }}
        >
          Quản lý gợi ý chi tiêu
        </Title>

        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Đăng nhập" key="1">
            <Form
              form={loginForm}
              layout="vertical"
              onFinish={handleLogin}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  style={{
                    marginTop: 10,
                    borderRadius: 8,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    height: 45,
                  }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Đăng ký" key="2">
            <Form
              form={registerForm}
              layout="vertical"
              onFinish={handleRegister}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Xác nhận mật khẩu"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  style={{
                    marginTop: 10,
                    borderRadius: 8,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    height: 45,
                  }}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <span style={{ color: "#999" }}>hoặc</span>
        </div>

        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          loading={loading}
          size="large"
          block
          style={{
            borderRadius: 8,
            height: 45,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Đăng nhập với Google
        </Button>
      </Card>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
}

export default LoginPage;
