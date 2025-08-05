"use client";

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = (redirectTo = '/login', requireAuth = true) => {
  const userInfo = useSelector((state) => state.user?.userInfo);
  const router = useRouter();
  const isAuthenticated = !!userInfo;

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      // User should be authenticated but isn't - redirect to login
      router.push('/login');
    } else if (!requireAuth && isAuthenticated) {
      // User shouldn't be on this page if authenticated - redirect away
      router.push(redirectTo);
    }
  }, [isAuthenticated, requireAuth, redirectTo, router]);

  return {
    isAuthenticated,
    userInfo,
    isLoading: false // Can be extended later for loading states
  };
};

export const useAuthGuard = () => {
  return useAuth('/login', true);
};

export const useGuestGuard = (redirectTo = '/dashboard') => {
  return useAuth(redirectTo, false);
}; 