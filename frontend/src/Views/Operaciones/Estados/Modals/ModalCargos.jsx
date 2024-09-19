import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  CardHeader,
  Image,
} from "@nextui-org/react";
import ImgPDF from "../../../../Static/Img_Pred/PDF.webp";

import { IconoCargo } from "../../../../Iconos/Iconos-NavBar";

export default function ModalCargos({ datos }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-transparent text-gray-600 text-2xl"
      >
        <IconoCargo className="  " />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cargos</ModalHeader>
              <ModalBody>
                <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-1px-8 ">
                  {datos?.imagen_4_estado_guia && (
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_4_estado_guia}>
                          <Button
                            className="text-base px- text-white bg-black/75"
                            variant="flat"
                            color="default"
                            radius="lg"
                            size="sm"
                          >
                            <h4 className="text-white font-medium text-large">
                              Global
                            </h4>
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={ImgPDF}
                      />
                    </Card>
                  )}
                  {datos?.imagen_5_estado_guia && (
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_5_estado_guia}>
                          <Button
                            className="text-base px- text-white bg-black/75"
                            variant="flat"
                            color="default"
                            radius="lg"
                            size="sm"
                          >
                            <h4 className="text-white font-medium text-large">
                              Remitente
                            </h4>
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={ImgPDF}
                      />
                    </Card>
                  )}
                  {datos?.imagen_6_estado_guia && (
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_6_estado_guia}>
                          <Button
                            className="text-base px- text-white bg-black/75"
                            variant="flat"
                            color="default"
                            radius="lg"
                            size="sm"
                          >
                            <h4 className="text-white font-medium text-large">
                            Factura
                            </h4>
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={ImgPDF}
                      />
                    </Card>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
