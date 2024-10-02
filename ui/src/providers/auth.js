"use client";
import { setAuthToken } from "@/api";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserEmail,
  updateUserPassword,
} from "@/api/user";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials.email, credentials.password);
      setUser(response.data);
      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
      router.push("/");
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const signup = async (credentials) => {
    try {
      const response = await registerUser(
        credentials.email,
        credentials.password
      );
      setUser(response.data);
      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
      router.push("/");
      toast({
        title: "Signup successful",
        description: "Welcome to our platform!",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setAuthToken(null);
    router.push("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (newEmail, oldPassword, newPassword) => {
    try {
      if (newEmail && newEmail !== user.email) {
        await updateUserEmail(newEmail);
        const updatedUser = await getUserProfile();
        setUser(updatedUser.data);
        toast({
          title: "Email updated",
          description: "Your email has been successfully updated.",
        });
      }
      if (oldPassword && newPassword) {
        await updateUserPassword(oldPassword, newPassword);
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
        const response = await getUserProfile();
        setUser(response.data);
        toast({
          title: "Login successful",
          description: "Welcome to our platform!",
        });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
