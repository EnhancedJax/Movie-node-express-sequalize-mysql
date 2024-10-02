"use client";
import { Separator } from "@/components/ui/separator";
import MovieCard from "@/containers/MovieCard";
import MovieSkeleton from "@/containers/MovieSkeleton";
import { HomeProvider, useHome } from "./provider";

function Home() {
  const { movies, isLoading } = useHome();

  return (
    <main className="m-10">
      <h1 className="mb-4 text-4xl font-bold">Movies airing now!</h1>
      <p>
        Get tickets for movies you will never see, at cinemas you will never
        visit. If you haven't noticed already, you can't buy tickets on this
        website. Feel free to explore!
      </p>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array(6)
              .fill()
              .map((_, index) => <MovieSkeleton key={index} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </main>
  );
}

export default function WrappedHome() {
  return (
    <HomeProvider>
      <Home />
    </HomeProvider>
  );
}
