import SearchFilter from "./SearchFilter";
const SearchConsultas = ({ titlle, registros, handleSelectGuia }) => {
  return (
    <>
      <div className="-mt-[8px] mb-3 cont-logo ">
        <div className="text-white flex justify-between items-center align-middle text-center  ">
          <h1 className="text-3xl font-semibold">{titlle}</h1>
          <SearchFilter
            registros={registros}
            handleSelectGuia={handleSelectGuia}
          />
        </div>
      </div>
    </>
  );
};

export default SearchConsultas;
