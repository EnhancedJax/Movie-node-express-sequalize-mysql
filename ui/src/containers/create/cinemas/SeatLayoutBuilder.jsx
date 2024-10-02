import { Button } from "@/components/ui/button";
import { SEAT_LABELS, SEAT_TYPES } from "@/constants/seat";
import { useState } from "react";

export default function SeatLayoutBuilder({ value, onChange }) {
  const [rows, setRows] = useState(value.length);
  const [cols, setCols] = useState(value[0].length);

  const updateSeatType = (rowIndex, colIndex) => {
    const newLayout = [...value];
    newLayout[rowIndex][colIndex] = (newLayout[rowIndex][colIndex] + 1) % 3;
    console.log(newLayout);
    onChange(newLayout);
  };

  const addRow = () => {
    const newRow = Array(cols).fill(1);
    onChange([...value, newRow]);
    setRows(rows + 1);
  };

  const removeRow = () => {
    if (rows > 1) {
      onChange(value.slice(0, -1));
      setRows(rows - 1);
    }
  };

  const addColumn = () => {
    const newLayout = value.map((row) => [...row, 1]);
    onChange(newLayout);
    setCols(cols + 1);
  };

  const removeColumn = () => {
    if (cols > 1) {
      const newLayout = value.map((row) => row.slice(0, -1));
      onChange(newLayout);
      setCols(cols - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-x-2">
        <Button type="button" onClick={addRow}>
          Add Row
        </Button>
        <Button type="button" onClick={addColumn}>
          Add Column
        </Button>
        <Button type="button" onClick={removeRow}>
          Remove Row
        </Button>
        <Button type="button" onClick={removeColumn}>
          Remove Column
        </Button>
      </div>
      <div className="overflow-x-auto">
        <div
          className="inline-grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(2rem, 2rem))` }}
        >
          {value.map((row, rowIndex) =>
            row.map((seat, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 rounded-sm ${
                  seat === 0
                    ? "bg-gray-100"
                    : seat === 1
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
                onClick={() => updateSeatType(rowIndex, colIndex)}
                type="button"
              />
            ))
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 font-bold ">Legend:</h3>
        {Object.entries(SEAT_TYPES)
          .filter(([type, className]) => type !== "3")
          .map(([type, className]) => (
            <div key={type} className="flex items-center mb-1">
              <div className={`w-6 h-6 ${className} mr-2 rounded-sm`}></div>
              <span>{SEAT_LABELS[type]}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
