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
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovie = async () => {
    setIsLoading(true);
    try {
      const response = await api.getMovieWithScreenings(id, 6);
      setData(response.data);

      // Find the first date with a screening
      const firstScreeningDate = findFirstScreeningDate(response.data);
      setSelectedDate(firstScreeningDate || new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const findFirstScreeningDate = (movieData) => {
    if (!movieData || !movieData.cinemas || !movieData.cinemas.items) {
      return null;
    }

    let earliestDate = null;

    for (const cinema of movieData.cinemas.items) {
      if (cinema.screenings && cinema.screenings.items) {
        for (const screening of cinema.screenings.items) {
          const screeningDate = new Date(screening.startTime);
          if (!earliestDate || screeningDate < earliestDate) {
            earliestDate = screeningDate;
          }
        }
      }
    }

    return earliestDate;
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
