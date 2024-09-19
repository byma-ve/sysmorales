import { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../Iconos/Iconos-NavBar";

export default function SearchDate({ years, handleSelectYear }) {
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? years
      : years.filter((person) =>
          person.nombre_year
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className=" relative  z-[5]">
      <Combobox
        value={selected}
        onChange={(selectedYear) => {
          setSelected(selectedYear);
          handleSelectYear(selectedYear);
        }}
      >
        <div className=" ">
          <div className="relative w-[10rem] cursor-default overflow-hidden rounded-lg  text-left shadow-md focus:outline-none focus-visible:ring-2  sm:text-sm">
            <Combobox.Input
              className="w-full  border-none py-1 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none"
              displayValue={(value) =>
                typeof value === "string" ? "Todos" : value.nombre_year
              }
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Elegir Año"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <IconoAbajo
                className="h-5 w-5 text-gray-400"
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
            <Combobox.Options className="absolute mt-1 max-h-60 w-full ScrollTableVertical overflow-auto rounded-md bg-white py-1 text-base shadow-lg  focus:outline-none sm:text-sm z-10">
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  No se encontraron años.
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
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
                          {person.nombre_year}
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
    </div>
  );
}
