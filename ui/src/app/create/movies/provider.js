"use client";
import { createMovie, deleteMovie, getMovies, updateMovie } from "@/api/movie";
import { useToast } from "@/hooks/use-toast";
import { createContext, useContext, useEffect, useState } from "react";

const MoviesContext = createContext();

export const useMovies = () => useContext(MoviesContext);

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [seeAll, setSeeAll] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await getMovies(1, 100, seeAll);
      setMovies(response.data.items);
      setTotalCount(response.data.count);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = async (movieData) => {
    try {
      await createMovie(movieData);
      toast({
        title: "Success",
        description: "Movie added successfully",
      });
      fetchMovies(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add movie",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMovie = async (id, movieData) => {
    try {
      await updateMovie(id, movieData);
      toast({
        title: "Success",
        description: "Movie updated successfully",
      });
      fetchMovies(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update movie",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await deleteMovie(id);
      toast({
        title: "Success",
        description: "Movie deleted successfully",
      });
      fetchMovies(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete movie",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [seeAll]);

  return (
    <MoviesContext.Provider
      value={{
        movies,
        totalCount,
        currentPage,
        isLoading,
        selectedMovie,
        isModalOpen,
        seeAll,
        setSeeAll,
        fetchMovies,
        handleAddMovie,
        handleUpdateMovie,
        handleDeleteMovie,
        setSelectedMovie,
        setIsModalOpen,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}
