// /src/frontend/hooks/useAuth.js
"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export const useAuth = (redirectTo = null, requireAuth = true) => {
  const [isLoading, setIsLoading] = useState(true);
  const userInfo = useSelector((state) => state.user?.userInfo);
  const router = useRouter();
  const isAuthenticated = !!userInfo;

  useEffect(() => {
    setIsLoading(false);

    if (redirectTo) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, redirectTo, requireAuth, router]);

  return { isAuthenticated, userInfo, isLoading };
};

export const useAuthGuard = () => {
  const { isAuthenticated, userInfo, isLoading } = useAuth("/login", true);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Additional logic if needed when redirecting
    }
  }, [isLoading, isAuthenticated]);

  return { isAuthenticated, userInfo, isLoading };
};

export const useGuestGuard = (redirectTo = "/dashboard") => {
  const { isAuthenticated, userInfo, isLoading } = useAuth(redirectTo, false);
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Additional logic if needed when redirecting
    }
  }, [isLoading, isAuthenticated]);

  return { isAuthenticated, userInfo, isLoading };
};