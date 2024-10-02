"use client";
import api from "@/api/index.js";
import Loader from "@/components/Loader";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SeatSelectionContext = createContext();

export const useSeatSelection = () => useContext(SeatSelectionContext);

export function SeatSelectionProvider({ children, screeningId }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [screening, setScreening] = useState(null);
  const { toast } = useToast();
  const router = useRouter();
  const getScreeningDetails = async (screeningId) => {
    try {
      const response = await api.getScreeningById(screeningId, "Theater");
      setScreening(response.data);
    } catch (error) {
      console.error("Error fetching screening details:", error);
    }
  };
  const markedSeatLayout = useMemo(() => {
    return screening?.markedSeatLayout || [[0]];
  }, [screening]);

  const handleSeatClick = (rowIndex, colIndex) => {
    const seatType = markedSeatLayout[rowIndex][colIndex];
    if (seatType === 0 || seatType === 3) return;

    const seatNumber = getSeatNumber(rowIndex, colIndex);
    const newSelectedSeats = selectedSeats.includes(seatNumber)
      ? selectedSeats.filter((seat) => seat !== seatNumber)
      : [...selectedSeats, seatNumber];

    setSelectedSeats(newSelectedSeats);
  };

  const getSeatNumber = (rowIndex, colIndex) => {
    if (markedSeatLayout[rowIndex][colIndex] === 0) {
      return "N/A";
    }
    const row = String.fromCharCode(65 + rowIndex);
    let seatNumber = 0;
    for (let i = 0; i <= colIndex; i++) {
      if (markedSeatLayout[rowIndex][i] !== 0) {
        seatNumber++;
      }
    }
    return `${row}${seatNumber}`;
  };

  const isSeatSelected = (rowIndex, colIndex) => {
    const seatNumber = getSeatNumber(rowIndex, colIndex);
    return seatNumber !== "N/A" && selectedSeats.includes(seatNumber);
  };

  const getTotalCost = () => selectedSeats.length * screening.price;

  const handlePurchase = async () => {
    try {
      await api.createBooking({
        screeningId: screening.id,
        seats: selectedSeats,
      });
      toast({
        title: "Tickets Purchased!",
        description: `You have purchased seats: ${selectedSeats.join(", ")}`,
      });
      router.back();
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error?.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getScreeningDetails(screeningId);
  }, []);

  return (
    <SeatSelectionContext.Provider
      value={{
        selectedSeats,
        handleSeatClick,
        getSeatNumber,
        isSeatSelected,
        getTotalCost,
        handlePurchase,
        screening,
      }}
    >
      {screening ? children : <Loader />}
    </SeatSelectionContext.Provider>
  );
}
