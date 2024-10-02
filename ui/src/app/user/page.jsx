"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const emailForm = useForm({
    defaultValues: {
      email: user?.email || "",
    },
  });

  const passwordForm = useForm({
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

  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="container max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Email</h2>
            {isChangingEmail ? (
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(handleEmailUpdate)}
                  className="space-y-4"
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Email</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsChangingEmail(false)}
                  >
                    Cancel
                  </Button>
                </form>
              </Form>
            ) : (
              <>
                <p>{user.email}</p>
                <Button onClick={() => setIsChangingEmail(true)}>
                  Change Email
                </Button>
              </>
            )}
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">Password</h2>
            {isChangingPassword ? (
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Password</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Cancel
                  </Button>
                </form>
              </Form>
            ) : (
              <>
                <p>Current Password</p>
                <Button onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
