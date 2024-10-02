"use client";
import { useMovies } from "@/app/create/movies/provider";
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
import { Textarea } from "@/components/ui/textarea";
import { MOVIE_SCHEMA } from "@/schemas/movie";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function MovieModal() {
  const {
    selectedMovie,
    isModalOpen,
    setIsModalOpen,
    handleAddMovie,
    handleUpdateMovie,
  } = useMovies();

  const form = useForm({
    resolver: yupResolver(MOVIE_SCHEMA),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      releaseDate: "",
    },
  });

  useEffect(() => {
    if (selectedMovie) {
      form.reset({
        title: selectedMovie.title,
        description: selectedMovie.description,
        duration: selectedMovie.duration,
        releaseDate: selectedMovie.releaseDate.split("T")[0],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        duration: "",
        releaseDate: "",
      });
    }
  }, [selectedMovie, form]);

  const onSubmit = (data) => {
    if (selectedMovie) {
      handleUpdateMovie(selectedMovie.id, data);
    } else {
      handleAddMovie(data);
    }
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedMovie ? "Edit Movie" : "Add New Movie"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {selectedMovie ? "Update" : "Add"} Movie
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
