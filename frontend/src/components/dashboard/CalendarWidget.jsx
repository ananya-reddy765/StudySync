import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        Calendar
      </h2>

      <Calendar
        onChange={setDate}
        value={date}
      />
    </div>
  );
};

export default CalendarWidget;