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

import { IconoCargo, IconoView } from "../../../../Iconos/Iconos-NavBar";

export default function ModalCargos({ datos }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const getModalSize = () => {
    const imageCount = [
      datos.imagen_1_estado_guia,
      datos.imagen_2_estado_guia,
      datos.imagen_3_estado_guia,
    ].filter(Boolean).length;
    switch (imageCount) {
      case 1:
        return "sm:max-w-[186px]";
      case 2:
        return "sm:max-w-[332px]";
      default:
        return "sm:max-w-[480px]";
    }
  };

  const getGridCols = () => {
    const imageCount = [
      datos.imagen_1_estado_guia,
      datos.imagen_2_estado_guia,
      datos.imagen_3_estado_guia,
    ].filter(Boolean).length;
    switch (imageCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      default:
        return "grid-cols-3";
    }
  };
  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-transparent text-gray-600 text-2xl"
      >
        <IconoCargo className="  " />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={getModalSize()}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cargos</ModalHeader>
              <ModalBody>
                <div className={`gap-2 grid ${getGridCols()}`}>
                  {datos?.imagen_4_estado_guia && (
                    <Card className=" h-[200px]">
                      <CardHeader className="absolute z-10 -top-3 right-8 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_4_estado_guia}>
                          <Button
                            className="bg-transparent"
                            variant="flat"
                            color="default"
                            radius="sm"
                            size="xl"
                          >
                            <IconoView className="text-white text-3xl" />
                          </Button>
                        </a>
                      </CardHeader>
                      <CardHeader className="absolute z-10 top-[150px] flex-col !items-center">
                        <h4 className="text-white font-medium text-large">
                          Global
                        </h4>
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
                    <Card className="h-[200px]">
                      <CardHeader className="absolute z-10 -top-3 right-8 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_5_estado_guia}>
                          <Button
                            className="bg-transparent"
                            variant="flat"
                            color="default"
                            radius="sm"
                            size="xl"
                          >
                            <IconoView className="text-white text-3xl" />
                          </Button>
                        </a>
                      </CardHeader>
                      <CardHeader className="absolute z-10 top-[150px] flex-col !items-center">
                        <h4 className="text-white font-medium text-large">
                          Remitente
                        </h4>
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
                    <Card className="h-[200px]">
                      <CardHeader className="absolute z-10 -top-3 right-8 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_6_estado_guia}>
                          <Button
                            className="bg-transparent"
                            variant="flat"
                            color="default"
                            radius="sm"
                            size="xl"
                          >
                            <IconoView className="text-white text-3xl" />
                          </Button>
                        </a>
                      </CardHeader>
                      <CardHeader className="absolute z-10 top-[150px] flex-col !items-center">
                        <h4 className="text-white font-medium text-large">
                          Factura
                        </h4>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Card background"
                        // style={{ opacity: 0.5 }}
                        className="z-0 w-full h-full object-cover"
                        src={ImgPDF}
                      />
                    </Card>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="px-6 py-2 text-white bg-gradient-to-t   from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br rounded-md "
                >
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
