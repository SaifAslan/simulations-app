"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import "antd/dist/reset.css"; // Import Ant Design CSS

export default function Home() {
  const router = useRouter();
  const userInfo = useSelector((state) => state.user?.userInfo);
  const isAuthenticated = !!userInfo;

  useEffect(() => {
    // Redirect based on authentication state
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Show loading spinner while redirecting
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <Spin size="large" />
    </div>
  );
}
