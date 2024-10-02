"use client";
import { useScreening } from "@/app/create/screenings/provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMinutes, format } from "date-fns";
import { useEffect, useState } from "react";

export default function ScreeningForm() {
  const { form, onSubmit, updateFormScreenings, movies, currentWeek } =
    useScreening();
  const [screeningTimes, setScreeningTimes] = useState([
    { date: "", time: "" },
  ]);

  useEffect(() => {
    updateFormScreenings();
  }, [screeningTimes]);

  const handleAddScreeningTime = () => {
    setScreeningTimes([...screeningTimes, { date: "", time: "" }]);
  };

  const handleRemoveScreeningTime = (index) => {
    const newScreeningTimes = screeningTimes.filter((_, i) => i !== index);
    setScreeningTimes(newScreeningTimes);
  };

  const handleScreeningTimeChange = (index, field, value) => {
    const newScreeningTimes = [...screeningTimes];
    newScreeningTimes[index][field] = value;
    setScreeningTimes(newScreeningTimes);
    form.setValue(`screeningDate-${index}`, newScreeningTimes[index].date);
    form.setValue(`screeningTime-${index}`, newScreeningTimes[index].time);
  };

  const handleSubmit = (values) => {
    const screenings = screeningTimes
      .filter((screeningTime) => screeningTime.date && screeningTime.time)
      .map((screeningTime, index) => ({
        movieId: values.movieId,
        price: values.price,
        screeningDate: screeningTime.date,
        screeningTime: screeningTime.time,
      }));

    if (screenings.length > 0) {
      onSubmit(screenings);
      setScreeningTimes([{ date: "", time: "" }]);
    } else {
      console.error("No valid screenings to submit");
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Create Screening</h2>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="movieId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Movie</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a movie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {movies.map((movie) => (
                      <SelectItem key={movie.id} value={movie.id.toString()}>
                        {movie.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {screeningTimes.map((screeningTime, index) => (
            <div key={index} className="flex space-x-2">
              <FormField
                control={form.control}
                name={`screeningDate-${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={screeningTime.date}
                        onChange={(e) =>
                          handleScreeningTimeChange(
                            index,
                            "date",
                            e.target.value
                          )
                        }
                        min={format(currentWeek, "yyyy-MM-dd")}
                        max={format(
                          addMinutes(currentWeek, 6 * 24 * 60),
                          "yyyy-MM-dd"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`screeningTime-${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={screeningTime.time}
                        onChange={(e) =>
                          handleScreeningTimeChange(
                            index,
                            "time",
                            e.target.value
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index > 0 && (
                <Button
                  type="button"
                  onClick={() => handleRemoveScreeningTime(index)}
                  className="mt-8"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={handleAddScreeningTime}>
            Add Screening Time
          </Button>
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min="0" step="0.01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-2">
            <Button type="submit">Create Screenings</Button>
            <Button type="button" onClick={() => console.log(form.getValues())}>
              Log values
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
