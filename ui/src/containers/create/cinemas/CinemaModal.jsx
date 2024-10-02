"use client";
import { useCinemas } from "@/app/create/cinemas/provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CINEMA_SCHEMA } from "@/schemas/cinema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CinemaModal() {
  const {
    selectedCinema,
    isCinemaModalOpen,
    setIsCinemaModalOpen,
    handleAddCinema,
    handleUpdateCinema,
  } = useCinemas();

  const form = useForm({
    resolver: yupResolver(CINEMA_SCHEMA),
    defaultValues: {
      name: "",
      location: "",
      lat: "",
      lng: "",
    },
  });

  useEffect(() => {
    if (selectedCinema) {
      form.reset({
        name: selectedCinema.name,
        location: selectedCinema.location,
        lat: selectedCinema.lat,
        lng: selectedCinema.lng,
      });
    } else {
      form.reset({
        name: "",
        location: "",
        lat: "",
        lng: "",
      });
    }
  }, [selectedCinema, form]);

  const onSubmit = (data) => {
    if (selectedCinema) {
      handleUpdateCinema(selectedCinema.id, data);
    } else {
      handleAddCinema(data);
    }
    setIsCinemaModalOpen(false);
  };

  return (
    <Dialog open={isCinemaModalOpen} onOpenChange={setIsCinemaModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedCinema ? "Edit Cinema" : "Add New Cinema"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lng"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {selectedCinema ? "Update" : "Add"} Cinema
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
