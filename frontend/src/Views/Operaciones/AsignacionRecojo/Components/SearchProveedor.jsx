import React, { Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { IconoAbajo } from "../../../../Iconos/Iconos-NavBar";

export default function SearchProveedor({
  proveedores,
  setSelectedProveedor,
  selectedProveedorId,
}) {
  const [query, setQuery] = useState("");
  const [selectedProveedor, setSelectedProveedorLocal] = useState(null);
  
  
  // Opción por defecto
  const defaultOption = {
    id: null,
    razon_social_proveedor: "Elegir proveedor",
  };

  useEffect(() => {
    if (selectedProveedorId) {
      const selected = proveedores.find((p) => p.id === selectedProveedorId);
      setSelectedProveedorLocal(selected);
    } else {
      setSelectedProveedorLocal(null);
    }
  }, [selectedProveedorId, proveedores]);

  const handleSelectProveedor = (proveedor) => {
    setSelectedProveedorLocal(proveedor);
    setSelectedProveedor(proveedor);
  };

  const filteredProveedores =
    query === ""
      ? [defaultOption, ...proveedores]
      : [
          defaultOption,
          ...proveedores.filter((proveedor) =>
            proveedor.razon_social_proveedor
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          ),
        ];

  return (
    <Combobox value={selectedProveedor} onChange={handleSelectProveedor}>
      <div className="w-[90%] mt-1 h-5 text-xs bg-gray-100 px-1   rounded-sm border  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md  flex truncate">
        <Combobox.Input
          className="w-[88%]  py-0  bg-gray-100 text-xs u leading-5 text-black focus:ring-0 focus:outline-none "
          displayValue={(proveedor) =>
            proveedor ? proveedor.razon_social_proveedor : ""
          }
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Elegir Proveedor"
        />
        <Combobox.Button className=" inset-y-0 right-14  items-center bottom-5 absolute cursor-default">
          <IconoAbajo
            className="cursor-pointer w-5 h-3 mr-2 text-gray-400"
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
        {filteredProveedores.length > 0 ? (
          <Combobox.Options className="absolute  mt-1 max-h-20 overflow-auto ScrollTable w-[235px] rounded-sm bg-gray-100 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {filteredProveedores.map((proveedor) => (
              <Combobox.Option
                key={proveedor.id ?? "default"}
                className={({ active }) =>
                  ` relative cursor-default text-xs  select-none  ps-1 pr-4 ${
                    active ? "bg-blue-300 text-white" : "text-gray-900"
                  } ${
                    selectedProveedor && selectedProveedor.id === proveedor.id
                      ? ""
                      : ""
                  }`
                }
                value={proveedor}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={` block truncate  ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {proveedor.razon_social_proveedor}
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
