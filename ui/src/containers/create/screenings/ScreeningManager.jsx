"use client";
import { useScreening } from "@/app/create/screenings/provider";
import { Button } from "@/components/ui/button";
import TheaterSelector from "../cinemas/TheaterSelector";
import ScreeningForm from "./ScreeningForm";
import WeeklyCalendar from "./WeeklyCalendar";

export default function ScreeningManager() {
  const { selectedTheater, currentWeek, goToNextWeek, goToPreviousWeek } =
    useScreening();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Screening Manager</h1>
      <TheaterSelector />
      {selectedTheater && (
        <div className="flex mt-4">
          <div className="w-4/5 pr-4">
            <div className="flex items-center justify-between mb-4">
              <Button onClick={goToPreviousWeek}>&lt; Previous Week</Button>
              <span className="font-semibold">
                Week of {currentWeek.toDateString()}
              </span>
              <Button onClick={goToNextWeek}>Next Week &gt;</Button>
            </div>
            <WeeklyCalendar />
          </div>
          <div className="w-1/5">
            <ScreeningForm />
          </div>
        </div>
      )}
    </div>
  );
}
