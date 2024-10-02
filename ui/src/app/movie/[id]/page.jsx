"use client";
import MovieDetails from "@/containers/movie/MovieDetails";
import MovieSkeleton from "@/containers/movie/MovieSkeleton";
import ScreeningsList from "@/containers/movie/ScreeningList";
import { MovieProvider, useMovie } from "./provider";

function MoviePage() {
  const { data, isLoading } = useMovie();

  if (isLoading) {
    return (
      <div className="container p-4 mx-auto">
        <MovieSkeleton />
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      <MovieDetails movie={data} />
      <h2 className="mt-8 mb-4 text-2xl font-bold">Screenings</h2>
      <ScreeningsList cinemas={data.cinemas} />
    </div>
  );
}

export default function WrappedMoviePage(props) {
  return (
    <MovieProvider id={props.params.id}>
      <MoviePage {...props} />
    </MovieProvider>
  );
}
