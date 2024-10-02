"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
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
import { handleDownloadQRCode } from "@/utils/qrCode";
import { useState } from "react";
import QRCode from "react-qr-code";
import { UserProvider, useUser } from "./provider";

function UserProfilePage() {
  const { user } = useAuth();
  const {
    emailForm,
    passwordForm,
    handleEmailUpdate,
    handlePasswordUpdate,
    isChangingEmail,
    isChangingPassword,
    setIsChangingEmail,
    setIsChangingPassword,
  } = useUser();

  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <div className="container max-w-2xl mx-auto mt-10">
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {user.bookings.items.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center p-4 mb-4 border rounded-lg"
            >
              <div
                className="mr-4 cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <QRCode value={booking.id} size={100} />
              </div>
              <div>
                <h3 className="font-semibold">
                  {booking.Screening.Movie.title}
                </h3>
                <p>Theater: {booking.Screening.Theater.name}</p>
                <p>
                  Date: {new Date(booking.Screening.startTime).toLocaleString()}
                </p>
                <p>Seats: {booking.seats.join(", ")}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center">
            <div id="qr-code">
              <QRCode value={selectedBooking?.id || ""} size={200} />
            </div>
            <div className="mt-4 space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={handleDownloadQRCode}>Download</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function WrappedUserProfilePage() {
  return (
    <UserProvider>
      <UserProfilePage />
    </UserProvider>
  );
}
