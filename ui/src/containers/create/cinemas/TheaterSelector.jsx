"use client";
import { getCinemas } from "@/api/cinema";
import { useScreening } from "@/app/create/screenings/provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function TheaterSelector() {
  const [cinemas, setCinemas] = useState([]);
  const { setSelectedTheater } = useScreening();
  const [selectedCinema, setSelectedCinema] = useState(null);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const response = await getCinemas("Theaters");
      setCinemas(response.data.items);
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    }
  };

  const handleCinemaChange = (cinemaId) => {
    const cinema = cinemas.find((c) => c.id === cinemaId);
    setSelectedCinema(cinema);
    setSelectedTheater(null);
  };

  const handleTheaterChange = (theaterId) => {
    const theater = selectedCinema.theaters.items.find(
      (t) => t.id === theaterId
    );
    setSelectedTheater(theater);
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={handleCinemaChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a cinema" />
        </SelectTrigger>
        <SelectContent>
          {cinemas.map((cinema) => (
            <SelectItem key={cinema.id} value={cinema.id.toString()}>
              {cinema.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedCinema && (
        <Select onValueChange={handleTheaterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a theater" />
          </SelectTrigger>
          <SelectContent>
            {selectedCinema.theaters.items.map((theater) => (
              <SelectItem key={theater.id} value={theater.id.toString()}>
                {theater.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
