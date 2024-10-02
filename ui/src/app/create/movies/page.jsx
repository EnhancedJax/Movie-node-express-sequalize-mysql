"use client";
import MoviesList from "@/containers/create/movies/MoviesList";
import { MoviesProvider } from "./provider";

export default function MoviesPage() {
  return (
    <MoviesProvider>
      <MoviesList />
    </MoviesProvider>
  );
}
