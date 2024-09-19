import React, { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../../Iconos/Iconos-NavBar";

export default function SearchServicio({
  servicios,
  setSelectedServicio,
  selectedServicioId,
}) {
  const [query, setQuery] = useState("");
  const [selectedServicio, setSelectedServicioLocal] = useState(null);
  const defaultOption = {
    id: null,
    id_orden_servicio_registro_carga: "Elegir orden",
  };
  useEffect(() => {
    if (selectedServicioId) {
      const selected = servicios.find((s) => s.id_orden_servicio_registro_carga === selectedServicioId);
      setSelectedServicioLocal(selected);
    } else {
      setSelectedServicioLocal(null);
    }
  }, [selectedServicioId, servicios]);

  const handleSelectServicio = (servicio) => {
    setSelectedServicioLocal(servicio);
    setSelectedServicio(servicio);
  };

  const filteredServicios =
    query === ""
      ? [defaultOption, ...servicios]
      : servicios.filter((servicio) =>
          servicio.id_orden_servicio_registro_carga
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox value={selectedServicio} onChange={handleSelectServicio}>
      <div className="w-[90%] mt-1 h-5 text-xs bg-gray-100 px-1 rounded-sm border focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md flex truncate">
        <Combobox.Input
          className="w-[95%] py-0 bg-gray-100 text-xs font-semibold leading-5 text-black focus:ring-0 focus:outline-none "
          displayValue={(servicio) =>
            servicio ? servicio.id_orden_servicio_registro_carga : ""
          }
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Elegir Orden de Servicio"
          required
        />
        <Combobox.Button className=" inset-y-0  items-center bottom-5  cursor-default">
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
        {filteredServicios.length > 0 ? (
          <Combobox.Options className="absolute mt-1 max-h-20 overflow-auto w-[211.5px] rounded-sm bg-gray-100 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {filteredServicios.map((servicio) => (
              <Combobox.Option
                key={servicio.id_orden_servicio_registro_carga ?? 'default'}
                className={({ active }) =>
                  `relative cursor-default text-xs font-semibold select-none ps-1 pr-4 ${
                    active ? "bg-blue-300 text-white" : "text-gray-900"
                  } ${
                    selectedServicio && selectedServicio.id_orden_servicio_registro_carga === servicio.id_orden_servicio_registro_carga
                      ? ""
                      : ""
                  }`
                }
                value={servicio}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {servicio.id_orden_servicio_registro_carga}
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
