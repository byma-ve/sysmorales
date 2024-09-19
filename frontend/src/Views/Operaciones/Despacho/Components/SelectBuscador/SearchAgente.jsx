import React, { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../../Iconos/Iconos-NavBar";

export default function SearchAgente({
  agentes,
  setSelectedAgente,
  selectedAgenteEnvio,
}) {
  const [query, setQuery] = useState("");
  const [selectedAgente, setSelectedAgenteLocal] = useState(null);
  // Opción por defecto
  const defaultOption = {
    id: null,
    razon_social_proveedor: "Elegir Agente",
  };
  useEffect(() => {
    if (selectedAgenteEnvio) {
      const selected = agentes.find((a) => a.id === selectedAgenteEnvio);
      setSelectedAgenteLocal(selected);
    } else {
      setSelectedAgenteLocal(null);
      setSelectedAgente("");
    }
  }, [selectedAgenteEnvio, agentes]);

  const handleSelectAgente = (agente) => {
    setSelectedAgenteLocal(agente);
    setSelectedAgente(agente);
  };

  const filteredAgentes =
    query === ""
      ? [defaultOption, ...agentes]
      : agentes.filter((agente) =>
          `${agente.razon_social_proveedor} - ${agente.tipo_servicio_proveedor}`
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox value={selectedAgente} onChange={handleSelectAgente}>
      <div className="w-[90%] mt-1 h-5 text-xs bg-gray-100 px-1 rounded-sm border focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md flex truncate">
        <Combobox.Input
          className="w-[95%] py-0 bg-gray-100 text-xs u leading-5 text-black focus:ring-0 focus:outline-none "
          displayValue={(agente) =>
            agente
              ? `${agente.razon_social_proveedor} - ${agente.tipo_servicio_proveedor}`
              : ""
          }
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Elegir Agente"
        />
        <Combobox.Button className="items-center  cursor-default">
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
        {filteredAgentes.length > 0 ? (
          <Combobox.Options className="absolute mt-1 max-h-60 overflow-auto w-[211.5px] rounded-sm bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm z-10">
            {filteredAgentes.map((agente) => (
              <Combobox.Option
                key={agente.id}
                className={({ active }) =>
                  `relative cursor-default text-xs select-none ps-1 pr-4 ${
                    active ? "bg-blue-300 text-white" : "text-gray-900"
                  } ${
                    selectedAgente && selectedAgente.id === agente.id ? "" : ""
                  }`
                }
                value={agente}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {`${agente.razon_social_proveedor} - ${agente.tipo_servicio_proveedor}`}
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
