"use client";

import { Button } from "@/components/ui/button";
import { SEAT_LABELS, SEAT_TYPES } from "@/constants/seat";
import { SeatSelectionProvider, useSeatSelection } from "./provider";

function SeatSelectionPage() {
  const {
    selectedSeats,
    handleSeatClick,
    getSeatNumber,
    isSeatSelected,
    getTotalCost,
    handlePurchase,
    screening,
  } = useSeatSelection();
  const { markedSeatLayout } = screening;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Select Seats</h2>
      <div className="relative mb-4">
        <div className="flex items-center justify-center w-full h-8 mb-2 bg-gray-300">
          Screen
        </div>
        <div className="absolute left-0 right-0 text-xs text-center border-t border-gray-400 border-dashed top-10">
          {screening.Theater.screenDistance}m
        </div>
        <div className="flex mt-8">
          <div className="flex flex-col items-center justify-between mr-2">
            {markedSeatLayout.map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center justify-center h-8 text-sm font-bold"
              >
                {String.fromCharCode(65 + rowIndex)}
              </div>
            ))}
          </div>
          <div
            className="inline-grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${markedSeatLayout[0].length}, minmax(2rem, 2rem))`,
            }}
          >
            {markedSeatLayout.map((row, rowIndex) =>
              row.map((seat, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-8 h-8 rounded-sm ${SEAT_TYPES[seat]} ${
                    isSeatSelected(rowIndex, colIndex)
                      ? "ring-2 ring-yellow-500"
                      : ""
                  } flex items-center justify-center text-xs font-bold`}
                  onClick={() => handleSeatClick(rowIndex, colIndex)}
                  disabled={seat === 0 || seat === 3}
                >
                  {seat !== 0 &&
                    seat !== 3 &&
                    getSeatNumber(rowIndex, colIndex).slice(1)}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-2 font-bold">Legend:</h3>
        {Object.entries(SEAT_TYPES).map(([type, className]) => (
          <div key={type} className="flex items-center mb-1">
            <div className={`w-6 h-6 ${className} mr-2 rounded-sm`}></div>
            <span>{SEAT_LABELS[type]}</span>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <p>Selected Seats: {selectedSeats.join(", ")}</p>
        <p>Total Cost: ${getTotalCost()}</p>
      </div>
      <div className="flex justify-between">
        <Button onClick={handlePurchase} disabled={selectedSeats.length === 0}>
          Purchase
        </Button>
      </div>
    </div>
  );
}

export default function WrappedSeatSelectionPage({
  params: { id, screeningId },
}) {
  return (
    <SeatSelectionProvider screeningId={screeningId}>
      <SeatSelectionPage />
    </SeatSelectionProvider>
  );
}
