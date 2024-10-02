"use client";
import { getMovies } from "@/api/movie";
import { createScreening, getScreenings } from "@/api/screening";
import { useToast } from "@/hooks/use-toast";
import { addMinutes, format, isWithinInterval, startOfWeek } from "date-fns";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ScreeningContext = createContext();

export const useScreening = () => useContext(ScreeningContext);

export function ScreeningProvider({ children }) {
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [screenings, setScreenings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingScreenings, setPendingScreenings] = useState([]);
  const [formScreenings, setFormScreenings] = useState([]);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      price: "",
      movieId: "",
      theaterId: selectedTheater?.id,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (
        name &&
        (name.startsWith("screeningDate") ||
          name.startsWith("screeningTime") ||
          name === "movieId")
      ) {
        updateFormScreenings();
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedTheater) {
      fetchScreenings();
      form.setValue("theaterId", selectedTheater.id);
    }
  }, [selectedTheater]);

  const updateFormScreenings = () => {
    const values = form.getValues();
    const newFormScreenings = [];

    for (let i = 0; i < 10; i++) {
      // Assuming a maximum of 10 screening times
      const dateKey = `screeningDate-${i}`;
      const timeKey = `screeningTime-${i}`;
      const date = values[dateKey];
      const time = values[timeKey];

      if (date && time && values.movieId) {
        const screeningDate = format(new Date(date), "yyyy-MM-dd");
        const startTime = new Date(`${screeningDate}T${time}:00`);
        const selectedMovie = movies.find(
          (movie) => movie.id === values.movieId
        );

        if (selectedMovie) {
          newFormScreenings.push({
            ...values,
            screeningDate: date,
            screeningTime: time,
            startTime: format(startTime, "yyyy-MM-dd HH:mm:ss"),
            Movie: selectedMovie,
          });
        }
      }
    }

    setFormScreenings(newFormScreenings);
  };

  const fetchMovies = async () => {
    try {
      const response = await getMovies();
      setMovies(response.data.items);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchScreenings = async () => {
    setIsLoading(true);
    try {
      const weekDate = currentWeek.toISOString().split("T")[0];
      const response = await getScreenings(
        "Movie",
        selectedTheater.id,
        weekDate
      );
      setScreenings(response.data.items);
    } catch (error) {
      console.error("Error fetching screenings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateScreening = async (screeningData) => {
    try {
      console.log(screeningData);
      await createScreening(screeningData);
      toast({
        title: "Screenings created",
        description: `${screeningData.length} screening(s) have been successfully created.`,
      });
      fetchScreenings();
      setPendingScreenings([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create screenings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const goToNextWeek = () => {
    setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const onSubmit = (screenings) => {
    console.log(screenings);
    const screeningsToCreate = screenings
      .map((screening) => {
        if (
          !screening.screeningDate ||
          !screening.screeningTime ||
          !screening.movieId ||
          !screening.price
        ) {
          console.error("Invalid screening data:", screening);
          return null;
        }

        const screeningDate = format(
          new Date(screening.screeningDate),
          "yyyy-MM-dd"
        );
        const startTime = new Date(
          `${screeningDate}T${screening.screeningTime}:00`
        );
        const selectedMovie = movies.find(
          (movie) => movie.id === screening.movieId
        );

        if (!selectedMovie) {
          console.error("Selected movie not found:", screening.movieId);
          return null;
        }

        const endTime = addMinutes(startTime, selectedMovie.duration);

        const isOverlapping = [...screenings, ...pendingScreenings].some(
          (existingScreening) => {
            const existingStart = new Date(existingScreening.startTime);
            const existingEnd = addMinutes(
              existingStart,
              selectedMovie.duration
            );
            return (
              isWithinInterval(startTime, {
                start: existingStart,
                end: existingEnd,
              }) ||
              isWithinInterval(endTime, {
                start: existingStart,
                end: existingEnd,
              })
            );
          }
        );

        if (isOverlapping) {
          toast({
            title: "Overlap detected",
            description: `Screening at ${format(
              startTime,
              "yyyy-MM-dd HH:mm"
            )} overlaps with an existing screening.`,
            variant: "destructive",
          });
          return null;
        }

        return {
          ...screening,
          startTime: format(startTime, "yyyy-MM-dd HH:mm:ss"),
          theaterId: selectedTheater.id,
        };
      })
      .filter(Boolean);

    if (screeningsToCreate.length > 0) {
      handleCreateScreening(screeningsToCreate);
    } else {
      toast({
        title: "No valid screenings",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
    }
    form.reset();
    setFormScreenings([]);
  };

  return (
    <ScreeningContext.Provider
      value={{
        selectedTheater,
        setSelectedTheater,
        currentWeek,
        screenings,
        pendingScreenings,
        movies,
        isLoading,
        handleCreateScreening,
        goToNextWeek,
        goToPreviousWeek,
        form,
        onSubmit,
        formScreenings,
        updateFormScreenings,
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
}
