import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../../Iconos/Iconos-NavBar";

const SearchTransportista = ({
  transportistas,
  selectedTransportista,
  setSelectedTransportista,
}) => {
  const [query, setQuery] = useState("");

  const filteredTransportistas = [
    { id: "", razon_social_proveedor: "Elegir Transportista" },
    ...(query === ""
      ? transportistas
      : transportistas.filter((transportista) =>
          transportista.razon_social_proveedor
            .toLowerCase()
            .includes(query.toLowerCase())
        )),
  ];

  const handleSelectionChange = (value) => {
    if (value === null || value === "" || !value.id) {
      setSelectedTransportista(null);
    } else {
      setSelectedTransportista(value);
    }
  };

  return (
    <Combobox
      value={selectedTransportista}
      onChange={handleSelectionChange}
    >
      <div className="w-[90%] mt-1 h-5 text-xs  px-1   rounded-sm border  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md  flex truncate">
        <Combobox.Input
          className="w-full  py-0   text-xs u leading-5 text-black focus:ring-0 focus:outline-none"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(transportista) =>
            transportista ? transportista.razon_social_proveedor : ""
          }
          placeholder="Elige Transportista"
        />
        <Combobox.Button className="flex inset-y-0   items-center bottom-5  cursor-default">
          <IconoAbajo
            className="cursor-pointer w-5 h-3 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options className="absolute  mt-1 max-h-20 w-[20%]  overflow-auto  rounded-sm bg-gray-100 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
          {filteredTransportistas.length === 0 && query !== "" ? (
            <div className="cursor-default select-none py-2 px-4  text-gray-700">
              No se encontraron resultados.
            </div>
          ) : (
            filteredTransportistas.map((transportista) => (
              <Combobox.Option
                key={transportista.id || "empty"}
                value={transportista.id ? transportista : ""}
                className={({ active }) =>
                  `relative cursor-default text-xs p-1 select-none ps-1 pr-4 ${
                    active ? "text-white bg-blue-300 rounded-sm" : "text-black"
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {transportista.razon_social_proveedor}
                    </span>
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
};

export default SearchTransportista;
