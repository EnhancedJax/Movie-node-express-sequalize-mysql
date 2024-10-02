"use client";
import api from "@/api/index";
import { useToast } from "@/hooks/use-toast";
import { createContext, useContext, useState } from "react";

const CinemasContext = createContext();

export const useCinemas = () => useContext(CinemasContext);

export function CinemasProvider({ children }) {
  const [cinemas, setCinemas] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [isCinemaModalOpen, setIsCinemaModalOpen] = useState(false);
  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchCinemas = async () => {
    setIsLoading(true);
    try {
      const response = await api.getCinemas("Theaters");
      console.log(response.data.items);
      setCinemas(response.data.items);
      setTotalCount(response.data.count);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cinemas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCinema = async (cinemaData) => {
    try {
      await api.createCinema(cinemaData);
      toast({
        title: "Success",
        description: "Cinema added successfully",
      });
      fetchCinemas();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add cinema",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCinema = async (id, cinemaData) => {
    try {
      await api.updateCinema(id, cinemaData);
      toast({
        title: "Success",
        description: "Cinema updated successfully",
      });
      fetchCinemas();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cinema",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCinema = async (id) => {
    try {
      await api.deleteCinema(id);
      toast({
        title: "Success",
        description: "Cinema deleted successfully",
      });
      fetchCinemas();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete cinema",
        variant: "destructive",
      });
    }
  };

  const handleAddTheater = async (theaterData) => {
    try {
      await api.createTheater(theaterData);
      toast({
        title: "Success",
        description: "Theater added successfully",
      });
      fetchCinemas();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add theater",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTheater = async (id, theaterData) => {
    try {
      await api.updateTheater(id, theaterData);
      toast({
        title: "Success",
        description: "Theater updated successfully",
      });
      fetchCinemas();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theater",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTheater = async (id) => {
    try {
      await api.deleteTheater(id);
      toast({
        title: "Success",
        description: "Theater deleted successfully",
      });
      fetchCinemas();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete theater",
        variant: "destructive",
      });
    }
  };

  return (
    <CinemasContext.Provider
      value={{
        cinemas,
        totalCount,
        isLoading,
        selectedCinema,
        selectedTheater,
        isCinemaModalOpen,
        isTheaterModalOpen,
        fetchCinemas,
        handleAddCinema,
        handleUpdateCinema,
        handleDeleteCinema,
        handleAddTheater,
        handleUpdateTheater,
        handleDeleteTheater,
        setSelectedCinema,
        setSelectedTheater,
        setIsCinemaModalOpen,
        setIsTheaterModalOpen,
      }}
    >
      {children}
    </CinemasContext.Provider>
  );
}
