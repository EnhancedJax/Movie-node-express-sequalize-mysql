import { useMovie } from "@/app/movie/[id]/provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ScreeningsList({ cinemas }) {
  const { selectedDate, setSelectedDate } = useMovie();

  const getColorByPercentage = (percentage) => {
    if (percentage === 0) return "bg-gray-500 opacity-50 pointer-events-none";
    if (percentage <= 33) return "bg-red-500";
    if (percentage <= 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  const filterScreeningsByDate = (screenings, date) => {
    return screenings.filter((screening) => {
      const screeningDate = new Date(screening.startTime);
      return screeningDate.toDateString() === date.toDateString();
    });
  };

  const generateWeekDates = () => {
    const today = new Date();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = generateWeekDates();

  const getScreeningsCountForDate = (date) => {
    return (
      cinemas?.items?.reduce((count, cinema) => {
        return (
          count +
          filterScreeningsByDate(cinema.screenings?.items || [], date).length
        );
      }, 0) || 0
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4 space-x-2">
        {weekDates.map((date, index) => {
          const screeningsCount = getScreeningsCountForDate(date);
          return (
            <Button
              key={index}
              onClick={() => setSelectedDate(date)}
              variant={
                date.toDateString() === selectedDate.toDateString()
                  ? "default"
                  : "outline"
              }
              disabled={screeningsCount === 0}
              className={screeningsCount === 0 ? "opacity-50" : ""}
            >
              <div className="flex flex-col items-center">
                <span>
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {screeningsCount > 0 && (
                  <span className="text-xs">{screeningsCount} screenings</span>
                )}
              </div>
            </Button>
          );
        })}
      </div>
      {cinemas?.items?.length > 0 ? (
        cinemas.items.map((cinema) => {
          const filteredScreenings = filterScreeningsByDate(
            cinema.screenings?.items || [],
            selectedDate
          );
          if (filteredScreenings.length === 0) return null;
          return (
            <div key={cinema.id} className="mb-8">
              <h3 className="mb-4 text-xl font-bold">{cinema.name}</h3>
              <div className="flex flex-wrap gap-4">
                {filteredScreenings.map((screening) =>
                  screening.remainingPercentage === 0 ? (
                    <Button
                      key={screening.id}
                      variant="outline"
                      className={`w-32 h-24 text-xs flex flex-col justify-between ${getColorByPercentage(
                        screening.remainingPercentage
                      )}`}
                      disabled
                    >
                      <span className="font-semibold">
                        {screening.Theater.name}
                      </span>
                      <span>
                        {new Date(screening.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>${screening.price}</span>
                    </Button>
                  ) : (
                    <Link
                      key={screening.id}
                      href={`/movie/${cinema.id}/screening/${screening.id}`}
                      scroll={false}
                    >
                      <Button
                        variant="outline"
                        className={`w-32 h-24 text-xs flex flex-col justify-between ${getColorByPercentage(
                          screening.remainingPercentage
                        )}`}
                      >
                        <span className="font-semibold">
                          {screening.Theater.name}
                        </span>
                        <span>
                          {new Date(screening.startTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        <span>${screening.price}</span>
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>No screenings found for this day.</p>
      )}
    </div>
  );
}
