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
import { THEATER_SCHEMA } from "@/schemas/theater";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import SeatLayoutBuilder from "./SeatLayoutBuilder";

export default function TheaterModal() {
  const {
    selectedCinema,
    selectedTheater,
    isTheaterModalOpen,
    setIsTheaterModalOpen,
    handleAddTheater,
    handleUpdateTheater,
  } = useCinemas();

  const form = useForm({
    resolver: yupResolver(THEATER_SCHEMA),
    defaultValues: {
      name: "",
      screenDistance: "",
      seatLayout: [[0]],
      cinemaId: selectedCinema?.id,
    },
  });

  useEffect(() => {
    if (selectedTheater) {
      form.reset({
        name: selectedTheater.name,
        screenDistance: selectedTheater.screenDistance,
        seatLayout: selectedTheater.seatLayout,
        cinemaId: selectedCinema?.id,
      });
    } else {
      console.log(selectedCinema);
      form.reset({
        name: "",
        screenDistance: "",
        seatLayout: [[0]],
        cinemaId: selectedCinema?.id,
      });
    }
  }, [selectedTheater, selectedCinema, form]);

  const onSubmit = (data) => {
    if (selectedTheater) {
      handleUpdateTheater(selectedTheater.id, data);
    } else {
      handleAddTheater(data);
    }
    setIsTheaterModalOpen(false);
  };

  return (
    <Dialog open={isTheaterModalOpen} onOpenChange={setIsTheaterModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedTheater ? "Edit Theater" : "Add New Theater"}
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
              name="screenDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Screen Distance</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seatLayout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seat Layout</FormLabel>
                  <FormControl>
                    <SeatLayoutBuilder
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {selectedTheater ? "Update" : "Add"} Theater
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
