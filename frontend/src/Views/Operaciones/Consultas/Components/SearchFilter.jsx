import React, { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../Iconos/Iconos-NavBar";

export default function SearchFilter({ registros, handleSelectGuia }) {
  const [query, setQuery] = useState("");
  const [selectedVendedor, setSelectedVendedorLocal] = useState(null);
  // Opción por defecto
  const defaultOption = {
    id: null,
    id_num_guia_registro_carga: "Elegir Registro",
  };
  const filteredPeople =
    query === ""
      ? [defaultOption, ...registros]
      : registros.filter((person) =>
          person.id_num_guia_registro_carga
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox
      onSelect={(person) => {
        handleSelectGuia(person);
      }}
    >
      <div className=" ">
        <div
          className="relative w-[12rem] cursor-default overflow-hidden rounded-lg text-left  focus:outline-none   sm:text-sm 
           text-sm font-semibold py-1 text-slate-700  bg-white  
        border-none   outline-none "
        >
          <Combobox.Input
            className=" w-full border-none py-1 ps-3    text-sm leading-5  text-slate-800 focus:ring-0 focus:outline-none placeholder:text-gray-600 placeholder:font-semibold"
            displayValue={(person) => person.id_num_guia_registro_carga}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar datos"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <IconoAbajo className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-[12rem] text-left ScrollTableVertical overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredPeople.length === 0 && query !== "" ? (
              <div className="relative font-semibold cursor-default select-none px-4 py-2 text-gray-700">
                No Encontrado
              </div>
            ) : (
              filteredPeople.map((person) => (
                <Combobox.Option
                  key={person.id_num_guia_registro_carga}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 ps-3 pr-4 ${
                      active ? "bg-blue-300 text-white" : "text-gray-900"
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.id_num_guia_registro_carga}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
