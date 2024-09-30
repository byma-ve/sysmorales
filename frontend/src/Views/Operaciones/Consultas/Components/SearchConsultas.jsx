import SearchFilter from "./SearchFilter";
import Select from "react-select";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "30px",
    height: "10px",
    fontSize: "16px",
    borderRadius: "10px",
    backgroundColor: "transparent",
    border: "none",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "5px",
    fontSize: "14px",
    margin: "6px 0",
    padding: "8px 0px",
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: "5px",
    padding: "4px 12px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 8px",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    display: "none", // Oculta el indicador
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: "none", // Oculta la barrita al lado del indicador
  }),
};
const SearchConsultas = ({ titlle, registros, handleSelectGuia }) => {
  return (
    <>
      <div className="-mt-[8px] mb-3 cont-logo ">
        <div className="text-white flex justify-between align-middle  ">
          <h1 className="text-3xl font-semibold">{titlle}</h1>
          {/* <SearchFilter
            registros={registros}
            handleSelectGuia={handleSelectGuia}
          /> */}
          <div className="flex  ">
            <Select
              options={registros}
              styles={customStyles}
              onChange={(selectedOption) =>
                handleSelectGuia({
                  target: {
                    name: "guia",
                    value: selectedOption.value,
                  },
                })
              }
              placeholder="Buscar Guía"
              isSearchable={true}
              className="w-56 h-[30px] bg-white rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchConsultas;
