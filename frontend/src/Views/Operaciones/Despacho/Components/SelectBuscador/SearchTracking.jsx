import React, { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../../Iconos/Iconos-NavBar";

export default function SearchTracking({
  trackings,
  setSelectedTracking,
  selectedGuiaUnitaria,
}) {
  const [query, setQuery] = useState("");
  const [selectedTracking, setSelectedTrackingLocal] = useState(null);
  // Opción por defecto
  const defaultOption = {
    id: null,
    id_num_guia_registro_carga: "Elegir Tracking",
  };
  useEffect(() => {
    if (selectedGuiaUnitaria) {
      const selected = trackings.find(
        (t) => t.id_num_guia_registro_carga === selectedGuiaUnitaria
      );
      setSelectedTrackingLocal(selected);
    } else {
      setSelectedTrackingLocal(null);
      setSelectedTracking("");
    }
  }, [selectedGuiaUnitaria, trackings]);

  const handleSelectTracking = (tracking) => {
    setSelectedTrackingLocal(tracking);
    setSelectedTracking(tracking);
  };

  const filteredTrackings =
    query === ""
      ? [defaultOption, ...trackings]
      : trackings.filter((tracking) =>
          tracking.id_num_guia_registro_carga
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox value={selectedTracking} onChange={handleSelectTracking}>
      <div className="w-[90%] mt-1 h-5 text-xs bg-gray-100 px-1 rounded-sm border focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md flex truncate">
        <Combobox.Input
          className="w-full py-0 bg-gray-100 text-xs u leading-5 text-black focus:ring-0 focus:outline-none "
          displayValue={(tracking) =>
            tracking ? tracking.id_num_guia_registro_carga : ""
          }
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Elegir Número de Rastreo"
          required
        />
        <Combobox.Button className=" inset-y-0  items-center bottom-5  cursor-default">
          <IconoAbajo
            className="cursor-pointer w-3 h-3  text-gray-400"
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
        {filteredTrackings.length > 0 ? (
          <Combobox.Options className="absolute mt-1 max-h-20 overflow-auto w-[211.5px] rounded-sm bg-gray-100 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {filteredTrackings.map((tracking) => (
              <Combobox.Option
                key={tracking.id_num_guia_registro_carga ?? "default"}
                className={({ active }) =>
                  `relative cursor-default text-xs select-none ps-1 pr-4 ${
                    active ? "bg-blue-300 text-white" : "text-gray-900"
                  } ${
                    selectedTracking &&
                    selectedTracking.id_num_guia_registro_carga ===
                      tracking.id_num_guia_registro_carga
                      ? ""
                      : ""
                  }`
                }
                value={tracking}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {tracking.id_num_guia_registro_carga}
                    </span>
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        ) : (
          <div className="mt-1 absolute max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            <p className="px-4 py-2 text-gray-500">Sin Resultado</p>
          </div>
        )}
      </Transition>
    </Combobox>
  );
}
