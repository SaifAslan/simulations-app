"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../store/slices/userSlice";
import { useGuestGuard } from "../../hooks/useAuth";
import axios from "axios";

const RegisterPage = () => {
  const { isAuthenticated } = useGuestGuard();
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [keyCode, setKeyCode] = useState("");
  const keyCodeParam = searchParams.get("keyCode");

  const validatePassword = (_, value) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (value && !passwordRegex.test(value)) {
    return Promise.reject(new Error('Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character'));
  }
  return Promise.resolve();
};

  useEffect(() => {
    
    if (keyCodeParam) {
      setKeyCode(keyCodeParam);
    }
  }, [keyCodeParam]);

  // Function to handle form submission
  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        axios
          .post(`http://localhost:3030/users/register`, { ...values, keyCode })
          .then((response) => {
            const data = response.data;
            if (data.success) {
              dispatch(setUserInfo(data.user));
              router.push("/dashboard");
            } else {
              message.error(data.error);
            }
          })
          .catch((error) => {
            const errorMessage =
              error.response?.data?.error ||
              "An error occurred while registering";
            message.error(errorMessage);
          });
      })
      .catch((errorInfo) => {
        message.error("Validation failed: " + errorInfo);
      });
  };

  // Don't render register form if user is authenticated (they'll be redirected)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div style={{ maxWidth: "300px", margin: "auto", marginTop: "100px" }}>
      <Form form={form} name="register" onFinish={onFinish} layout="vertical">
        <Form.Item name="keyCode" label="Key Code">
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

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
          rules={[
            { required: true, message: "Please input your password!" },
            { validator: validatePassword },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            { type: "string", message: "Phone number must be a string!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[{ type: "string", message: "Name must be a string!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="surname"
          label="Surname"
          rules={[{ type: "string", message: "Surname must be a string!" }]}
        >
          <Input />
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

export default RegisterPage;
