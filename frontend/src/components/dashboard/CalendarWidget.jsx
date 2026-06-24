import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarWidget = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">
        Calendar
      </h2>

      <Calendar />

    </div>
  );
};

export default CalendarWidget;