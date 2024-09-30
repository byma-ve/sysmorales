import React, { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../Iconos/Iconos-NavBar";

export default function SearchVehiculo({
  vehiculos,
  setSelectedVehiculo,
  selectedVehiculoId,
}) {
  const [query, setQuery] = useState("");
  const [selectedVehiculo, setSelectedVehiculoLocal] = useState(null);

  // Opción por defecto
  const defaultOption = {
    id: null,
    placa_vehiculo: "Elegir Placa",
  };
  useEffect(() => {
    if (selectedVehiculoId) {
      const selected = vehiculos.find((c) => c.id === selectedVehiculoId);
      setSelectedVehiculoLocal(selected);
      setSelectedVehiculo(selected);
    } else {
      setSelectedVehiculoLocal(null);
      setSelectedVehiculo(null);
    }
  }, [selectedVehiculoId, vehiculos]);

  const handleSelectVehiculo = (vehiculo) => {
    setSelectedVehiculoLocal(vehiculo);
    setSelectedVehiculo(vehiculo);
  };

  const filteredVehiculos =
    query === ""
      ? [defaultOption, ...vehiculos]
      : [
        vehiculos.filter((vehiculo) =>
          vehiculo.placa_vehiculo.toLowerCase().includes(query.toLowerCase())
          ),
        ];

  return (
    <Combobox value={selectedVehiculo} onChange={handleSelectVehiculo}>
      <div className="w-[90%] mt-1 h-5 text-xs bg-gray-100 ps-1 rounded-sm border focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md flex truncate">
        <Combobox.Input
          className="w-[100%] py-0  bg-gray-100 text-xs leading-5 text-black focus:ring-0 focus:outline-none"
          displayValue={(vehiculo) => (vehiculo ? vehiculo.placa_vehiculo : "")}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por DNI"
        />
        <Combobox.Button className="inset-y-0  items-center   cursor-default">
          <IconoAbajo
            className="cursor-pointer w-5 h-3  text-gray-400"
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
        {filteredVehiculos.length > 0 ? (
          <Combobox.Options className="absolute mt-1 max-h-20 overflow-auto  w-[217px] rounded-sm bg-gray-100 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {filteredVehiculos.map((vehiculo) => (
              <Combobox.Option
                key={vehiculo.id ?? "default"}
                className={({ active }) =>
                  `relative cursor-default text-xs select-none ps-1 pr-4 ${
                    active ? "bg-blue-300 text-white" : "text-gray-900"
                  } ${
                    selectedVehiculo && selectedVehiculo.id === vehiculo.id
                      ? ""
                      : ""
                  }`
                }
                value={vehiculo}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {vehiculo.placa_vehiculo}
                    </span>
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        ) : (
          <div className="mt-1 absolute max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            <p className="px-4 py-2 text-gray-500">Sin Resultado</p>
          </div>
        )}
      </Transition>
    </Combobox>
  );
}
