import { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../Iconos/Iconos-NavBar";

export default function SearchArea({ areas, handleSelectArea, idCliente }) {
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? areas
      : areas.filter((person) =>
          person.nombre_area
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  useEffect(() => {
    setSelected("");
  }, [idCliente]);

  return (
    <div className=" relative flex z-[3]">
      <Combobox
        value={selected}
        onChange={(selectedArea) => {
          setSelected(selectedArea);
          handleSelectArea(selectedArea);
        }}
      >
        <div className=" ">
          <div className="relative w-[10rem]  cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none  focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-1 pl-3  text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none "
              displayValue={(person) => person.nombre_area}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Elegir Area"
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
            <Combobox.Options className="absolute mt-1 max-h-60 w-full ScrollTableVertical overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm z-10">
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  No se encontraron Areas.
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
                          {person.nombre_area}
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
