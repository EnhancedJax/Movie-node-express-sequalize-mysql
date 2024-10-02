"use client";
import api from "@/api/index.js";
import { createContext, useContext, useEffect, useState } from "react";

const MovieContext = createContext();

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider");
  }
  return context;
};

export function MovieProvider({ children, id }) {
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovie = async () => {
    setIsLoading(true);
    try {
      const response = await api.getMovieWithScreenings(id, 6);
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  return (
    <MovieContext.Provider
      value={{ data, isLoading, selectedDate, setSelectedDate }}
    >
      {children}
    </MovieContext.Provider>
  );
}
