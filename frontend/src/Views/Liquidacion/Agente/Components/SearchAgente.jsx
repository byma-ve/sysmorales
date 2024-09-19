import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../Iconos/Iconos-NavBar";

export default function SearchAgente({ agentes, handleSelectAgente }) {
  const [selected, setSelected] = useState(agentes[0]);
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? agentes
      : agentes.filter((person) =>
        person.razon_social_proveedor
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""))
      );

  return (
    <div className=" relative flex z-[3] mx-4">
      <Combobox value={selected}
        onChange={(selectedAgente) => {
          setSelected(selectedAgente);
          handleSelectAgente(selectedAgente);
        }}>
        <div className=" ">
          <div className="relative w-[350px] cursor-default overflow-hidden rounded-lg text-left  focus:outline-none   sm:text-sm 
           text-sm font-semibold py-1 h-10 text-slate-700  bg-white  
        border-none   outline-none">
            <Combobox.Input
              className="w-full border-none py-1 px-5 text-left pl-3  text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none"
              displayValue={(value) =>
                typeof value === "string" ? "Todos" : value.razon_social_proveedor
              }
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrar Agente"
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
            <Combobox.Options className="absolute mt-1 max-h-60 w-full ScrollTableVertical overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              <Combobox.Option
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-4  ${active ? "bg-blue-300 text-white" : "text-gray-900"
                  }`
                }
                value=""
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? "font-medium" : "font-normal"
                        }`}
                    >
                      Todos
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-teal-600"
                          }`}
                      ></span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  No se encontró Agentes.
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-3 pr-4 ${active ? "bg-blue-300 text-white" : "text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? "font-medium" : "font-normal"
                            }`}
                        >
                          {person.razon_social_proveedor}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-teal-600"
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
