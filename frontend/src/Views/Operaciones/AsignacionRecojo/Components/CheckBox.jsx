function CheckBox({ onCheckboxChange, opcionSeleccionada }) {
  return (
    <>
      <div className="cont-checkbox flex w-full mb-4 px-6">
        <div
          className="w-[50%] flex items-center ps-4   rounded"
          onClick={() => onCheckboxChange("externos")}
        >
          <input
            id="bordered-checkbox-1"
            type="checkbox"
            value=""
            name="bordered-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 "
            checked={opcionSeleccionada === "externos"}
            readOnly
          />
          <label
            htmlFor="bordered-checkbox-1"
            className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
          >
            Trabajadores Externos
          </label>
        </div>
        <div
          className="w-[50%] flex items-center ps-4  rounded "
          onClick={() => onCheckboxChange("propios")}
        >
          <input
            id="bordered-checkbox-2"
            type="checkbox"
            value=""
            name="bordered-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={opcionSeleccionada === "propios"}
            readOnly
          />
          <label
            htmlFor="bordered-checkbox-2"
            className="w-full py-4 ms-2 text-sm font-medium text-gray-900 "
          >
            Trabajadores Propios
          </label>
        </div>
      </div>
    </>
  );
}

export default CheckBox;
