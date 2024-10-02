"use client";
import { useScreening } from "@/app/create/screenings/provider";
import {
  addDays,
  addHours,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "date-fns";

const HOURS_IN_DAY = 24;
const HOUR_HEIGHT = 30; // pixels per hour

export default function WeeklyCalendar() {
  const { formScreenings, currentWeek, screenings, isLoading } = useScreening();
  const weekStart = startOfWeek(currentWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: HOURS_IN_DAY }, (_, i) => i);

  const getScreeningStyle = (screening) => {
    const startTime = new Date(screening.startTime);
    const endTime = addHours(startTime, screening.Movie.duration / 60);
    const dayStart = startOfDay(startTime);

    const top = ((startTime - dayStart) / (1000 * 60 * 60)) * HOUR_HEIGHT;
    const height = ((endTime - startTime) / (1000 * 60 * 60)) * HOUR_HEIGHT;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  return (
    <div className="relative overflow-x-auto">
      <div className="flex">
        <div className="flex-shrink-0 w-16"></div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="flex-1 text-center border-l">
            <div className="sticky top-0 z-10 py-2 bg-white">
              <h3 className="font-semibold">{format(day, "EEE dd/MM")}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <div className="flex-shrink-0 w-16">
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative text-xs"
              style={{ height: `${HOUR_HEIGHT}px` }}
            >
              <span className="absolute -mt-2 right-2">
                {format(addHours(startOfDay(currentWeek), hour), "HH:mm")}
              </span>
            </div>
          ))}
        </div>
        <div
          className="relative flex-grow"
          style={{ height: `${HOURS_IN_DAY * HOUR_HEIGHT}px` }}
        >
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute w-full border-t"
              style={{ top: `${hour * HOUR_HEIGHT}px` }}
            ></div>
          ))}
          {weekDays.map((day, dayIndex) => (
            <div
              key={day.toISOString()}
              className="absolute top-0 bottom-0 border-l"
              style={{ left: `${dayIndex * (100 / 7)}%`, width: `${100 / 7}%` }}
            >
              {isLoading ? (
                <p className="p-2">Loading...</p>
              ) : (
                <>
                  {screenings
                    .filter((screening) =>
                      isSameDay(new Date(screening.startTime), day)
                    )
                    .map((screening) => (
                      <div
                        key={screening.id}
                        className="absolute left-0 right-0 p-1 overflow-hidden text-xs bg-blue-200 border border-blue-300 rounded"
                        style={getScreeningStyle(screening)}
                      >
                        <div className="font-semibold">
                          {screening.Movie.title}
                        </div>
                        <div>
                          {format(new Date(screening.startTime), "HH:mm")}
                        </div>
                      </div>
                    ))}
                  {formScreenings
                    .filter((screening) =>
                      isSameDay(new Date(screening.startTime), day)
                    )
                    .map((screening, index) => (
                      <div
                        key={`form-${index}`}
                        className="absolute left-0 right-0 p-1 overflow-hidden text-xs bg-green-200 border border-green-300 rounded"
                        style={getScreeningStyle(screening)}
                      >
                        <div className="font-semibold">
                          {screening.Movie.title} (Pending)
                        </div>
                        <div>
                          {format(new Date(screening.startTime), "HH:mm")}
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
