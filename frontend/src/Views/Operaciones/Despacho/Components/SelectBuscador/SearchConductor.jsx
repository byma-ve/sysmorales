import React, { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../../Iconos/Iconos-NavBar";

export default function SearchConductor({
  conductores,
  selectedConductorId,
  setSelectedConductor,
}) {
  const [query, setQuery] = useState("");
  const [selectedConductor, setSelectedConductorLocal] = useState(null);
  // Opción por defecto
  const defaultOption = {
    id: null,
    dni_usuario: "Elegir Conductor",
    colaborador_usuario: "Dni",
  };
  useEffect(() => {
    if (selectedConductorId) {
      const selected = conductores.find((c) => c.id === selectedConductorId);
      setSelectedConductorLocal(selected);
    }
  }, [selectedConductorId, conductores]);

  const handleSelectConductor = (conductor) => {
    setSelectedConductorLocal(conductor);
    setSelectedConductor(conductor);
  };

  const filteredConductores =
    query === ""
      ? [defaultOption, ...conductores]
      : conductores.filter(
          (conductor) =>
            conductor.dni_usuario.toLowerCase().includes(query.toLowerCase()) ||
            conductor.colaborador_usuario
              .toLowerCase()
              .includes(query.toLowerCase())
        );

  return (
    <Combobox value={selectedConductor} onChange={handleSelectConductor}>
      <div className="w-[90%] mt-1 h-5 text-xs  px-1 rounded-sm border focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md flex truncate">
        <Combobox.Input
          className="w-full py-0  text-xs u leading-5 text-black focus:ring-0 focus:outline-none "
          displayValue={(conductor) =>
            conductor
              ? `${conductor.dni_usuario} - ${conductor.colaborador_usuario}`
              : ""
          }
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Elegir Conductor"
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
        {filteredConductores.length > 0 ? (
          <Combobox.Options className="absolute  mt-1 max-h-20 w-[20%]  overflow-auto  rounded-sm bg-gray-100 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {filteredConductores.map((conductor) => (
              <Combobox.Option
                key={conductor.id ?? "default"}
                className={({ active }) =>
                  `relative cursor-default text-xs p-1 select-none ps-1 pr-4 ${
                    active ? "text-white bg-blue-300 rounded-sm" : "text-black"
                  } ${
                    selectedConductor && selectedConductor.id === conductor.id
                      ? "bg-blue-300 text-white"
                      : ""
                  }`
                }
                value={conductor}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {`${conductor.dni_usuario} - ${conductor.colaborador_usuario}`}
                    </span>
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        ) : (
          <div className="mt-1 absolute max-h-60 w-[20%] overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            <p className="px-4 py-2 text-gray-500">Sin Resultado</p>
          </div>
        )}
      </Transition>
    </Combobox>
  );
}
