"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginCredentials } from "@/types/auth";
import { getUser, loginUser, logOutUser } from "@/services/auth-service";
import { setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loginMutation = loginUser();
  const logoutMutation = logOutUser();
  const profileMutation = getUser()
  const { data, isLoading: isUserLoading, error } = getUser();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (data) {
          setUser(data.data);
        } else if (error) {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [data, error]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await loginMutation.mutateAsync(credentials, {
        onSuccess: (res) => {
          setCookie("access_token", res.data.token, {
            maxAge: 30 * 24 * 60 * 60, // 30 day
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          setCookie("role", res.data.user.role, {
            maxAge: 30 * 24 * 60 * 60, // 30 day
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        },
      });

      // const user = await
      setUser(response.data.user);
      router.push("/dashboard");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutMutation.mutateAsync();
      setUser(null);
      deleteCookie("access_token", { path: "/" });
      deleteCookie("role", { path: "/" });
      router.push("/login");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    isLoading: isLoading || isUserLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};