import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../Iconos/Iconos-NavBar";

export default function SearchDashboard({ clientes, handleSelectCliente }) {
  const [selected, setSelected] = useState(clientes[0]);
  const [query, setQuery] = useState("");

  const filteredCliente =
    query === ""
      ? clientes
      : clientes.filter((person) =>
        person.razon_social_cliente
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""))
      );

  return (
    <div className=" relative flex z-[3]">
      <Combobox
        value={selected}
        onChange={(selectedCliente) => {
          setSelected(selectedCliente);
          handleSelectCliente(selectedCliente);
        }}
      >
        <div className=" ">
          <div className="relative w-[320px] py-1 cursor-default overflow-hidden rounded-lg bg-white text-left  focus:outline-none  focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm ps-2">
            <Combobox.Input
              className=" w-full border-none py-1  bg-slate-100 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none"
              displayValue={(value) =>
                typeof value === "string" ? "Todos" : value.razon_social_cliente
              }
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Elegir Cliente"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <IconoAbajo />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 text-left  max-h-60 w-full ScrollTableVertical overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              <Combobox.Option
                className={({ active }) =>
                  `relative cursor-default select-none py-2 ps-2 ${active ? "bg-blue-300 text-white" : "text-gray-900"
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
                      Elegir Todos
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white " : "text-teal-600"
                          }`}
                      ></span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>

              {filteredCliente.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2  text-gray-700">
                  No Encontrado.
                </div>
              ) : (
                filteredCliente.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 ps-2  ${active ? "bg-blue-300 text-white" : "text-gray-900"
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
                          {person.razon_social_cliente}
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
