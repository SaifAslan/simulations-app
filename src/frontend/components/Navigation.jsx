// /src/frontend/components/Navigation.jsx
"use client";
import { Layout, Menu, Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clearUserInfo } from "../store/slices/userSlice";

const { Header } = Layout;

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user?.userInfo);

  const menuItems = [
    {
      key: "/dashboard",
      label: "Dashboard",
    },
    {
      key: "/simulations",
      label: "Simulations",
    },
  ];

  const handleMenuClick = ({ key }) => {
    router.push(key);
  };

  const handleLogout = () => {
    dispatch(clearUserInfo());
    message.success("Logged out successfully");
    router.push("/login");
  };

  const getSelectedKey = () => {
    if (pathname.startsWith("/simulations/")) {
      return "/simulations";
    }
    return pathname;
  };

  if (!userInfo) {
    return null;
  }

  return (
    <Header style={{ 
      display: "flex", 
      alignItems: "center", 
      background: "#fff",
      borderBottom: "1px solid #f0f0f0",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: "64px"
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px"
      }}>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          Business Simulations
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Menu
            mode="horizontal"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ 
              border: "none",
              background: "transparent"
            }}
          />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: "#ff4d4f" }}
          >
            Logout
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default Navigation;