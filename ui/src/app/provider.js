"use client";

import api from "@/api/index.js";
import { createContext, useContext, useEffect, useState } from "react";

const HomeContext = createContext();

export const useHome = () => useContext(HomeContext);

export function HomeProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await api.getMovies();
      setMovies(response.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <HomeContext.Provider value={{ movies, setMovies, isLoading }}>
      {children}
    </HomeContext.Provider>
  );
}
