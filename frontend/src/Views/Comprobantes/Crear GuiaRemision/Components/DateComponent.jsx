import React, { useState } from "react";
const DateComponent = ({ name, id, className, required }) => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));

  return (
    <input
      type="date"
      name="contacto_area"
      id="contacto_area"
      className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      placeholder=" "
      required
      value={currentDate}
      onChange={(e) => setCurrentDate(e.target.value)}
    />
  );
};

export default DateComponent;
