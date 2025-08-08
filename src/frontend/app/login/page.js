// /src/frontend/app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message, Divider } from "antd";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../store/slices/userSlice";
import { useGuestGuard } from "../../hooks/useAuth";
import axios from "axios";
import { API_BASE_URL } from "../../utils/consts";

const LoginPage = () => {
  const [loginForm, keyForm] = Form.useForm();
  const [keyCode, setKeyCode] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useGuestGuard();

  const onFinishLogin = () => {
    loginForm.validateFields().then((values) => {
      axios
        .post(`${API_BASE_URL}/users/login`, values)
        .then((response) => {
          const data = response.data;
          
          dispatch(setUserInfo(data.user));
          message.success("Login successful");
          router.push("/dashboard");
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.error || "An error occurred while logging in";
          message.error(errorMessage);
        });
    }).catch((errorInfo) => {
      message.error('Validation failed: ' + errorInfo);
    });
  };

  const onFinishRegisterWithCode = () => {
    axios
      .post(`${API_BASE_URL}/keys/checkKey/${keyCode}`, {})
      .then((response) => {
        const keyCheckData = response.data;
        if (keyCheckData.valid) {
          router.push(`/register?keyCode=${encodeURIComponent(keyCode)}`);
        } else {
          message.error(keyCheckData.message || "Invalid key code");
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error ||
          "An error occurred while checking the key code";
        message.error(errorMessage);
      });
  };

  const handleKeyCodeChange = (e) => {
    setKeyCode(e.target.value);
  };

  if (isAuthenticated || isLoading) {
    return null;
  }

  return (
    <div style={{ maxWidth: "300px", margin: "auto", marginTop: "100px" }}>
      <Form
        form={loginForm}
        name="login"
        onFinish={onFinishLogin}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>

      <Divider>Or</Divider>
      <Form
        form={keyForm}
        name="register_with_key_code"
        onFinish={onFinishRegisterWithCode}
        layout="vertical"
      >
        <Form.Item
          label="Do you have Key Code?"
          name="keyCode"
          rules={[
            { required: true, message: "Please input a valid key code!" },
          ]}
        >
          <Input onChange={handleKeyCodeChange} value={keyCode} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;