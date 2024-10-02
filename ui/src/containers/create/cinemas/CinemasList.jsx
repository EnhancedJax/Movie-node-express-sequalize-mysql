"use client";
import { useCinemas } from "@/app/create/cinemas/provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react"; // Import icons
import { useEffect } from "react";
import CinemaModal from "./CinemaModal";
import TheaterModal from "./TheaterModal";

export default function CinemasList() {
  const {
    cinemas,
    isLoading,
    fetchCinemas,
    setSelectedCinema,
    setSelectedTheater,
    setIsCinemaModalOpen,
    setIsTheaterModalOpen,
    handleDeleteCinema,
    handleDeleteTheater,
  } = useCinemas();

  useEffect(() => {
    fetchCinemas();
  }, []);

  const handleAddCinema = () => {
    setSelectedCinema(null);
    setIsCinemaModalOpen(true);
  };

  const handleEditCinema = (cinema) => {
    setSelectedCinema(cinema);
    setIsCinemaModalOpen(true);
  };

  const handleAddTheater = (cinemaId) => {
    setSelectedTheater(null);
    setSelectedCinema({ id: cinemaId });
    setIsTheaterModalOpen(true);
  };

  const handleEditTheater = (theater) => {
    setSelectedTheater(theater);
    setIsTheaterModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Cinemas</h1>
        <Button onClick={handleAddCinema}>Add New Cinema</Button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {cinemas.map((cinema) => (
          <AccordionItem key={cinema.id} value={cinema.id}>
            <AccordionTrigger>
              <div className="flex justify-between w-full">
                <span>{cinema.name}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCinema(cinema);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCinema(cinema.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4">
                <h3 className="mb-2 font-semibold">Theaters:</h3>
                <ul>
                  {cinema.theaters.items.map((theater) => (
                    <li
                      key={theater.id}
                      className="flex items-center justify-between mb-2"
                    >
                      <span>{theater.name}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditTheater(theater)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteTheater(theater.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-4">
                  <span>Total Theaters: {cinema.theaters.count}</span>
                  <Button onClick={() => handleAddTheater(cinema.id)}>
                    Add Theater
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <CinemaModal />
      <TheaterModal />
    </div>
  );
}
