"use client";
import Loader from "@/components/Loader";
import { useAuth } from "@/providers/auth";
import { EMAIL_SCHEMA, PASSWORD_SCHEMA } from "@/schemas/credentials";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { useForm } from "react-hook-form";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export function UserProvider({ children }) {
  const { user, updateProfile, loading: authIsLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const emailForm = useForm({
    resolver: yupResolver(EMAIL_SCHEMA),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(PASSWORD_SCHEMA),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleEmailUpdate = async (data) => {
    await updateProfile(data.email);
    setIsChangingEmail(false);
  };

  const handlePasswordUpdate = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      passwordForm.setError("confirmNewPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    await updateProfile(null, data.oldPassword, data.newPassword);
    setIsChangingPassword(false);
    passwordForm.reset();
  };

  if (authIsLoading) {
    return <Loader />;
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        emailForm,
        passwordForm,
        handleEmailUpdate,
        handlePasswordUpdate,
        isChangingEmail,
        isChangingPassword,
        setIsChangingEmail,
        setIsChangingPassword,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
