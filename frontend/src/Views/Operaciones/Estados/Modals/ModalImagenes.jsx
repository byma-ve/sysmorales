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
import {
  IconoBox,
  IconoMuñeco,
  IconoView,
} from "../../../../Iconos/Iconos-NavBar";
export default function ModalImagenes({ datos }) {
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
      <Button onPress={onOpen} className="bg-transparent text-gray-600 ">
        <IconoBox className="  absolute " />
        <IconoMuñeco className="ml-[26px]" />
        {/* <IconoOjito2 /> */}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={getModalSize()}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Imagenes
              </ModalHeader>
              <ModalBody>
                <div className={`gap-2 grid ${getGridCols()}`}>
                  {datos?.imagen_1_estado_guia && (
                    <Card className="h-[200px]">
                      <CardHeader className="absolute z-10 -top-3 right-8 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_1_estado_guia}>
                          <Button
                            className="bg-transparent"
                            variant="flat"
                            color="default"
                            radius="sm"
                            size="xl"
                          >
                            <IconoView className="text-blue-500 text-3xl" />
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Imagen 1"
                        className="z-0 w-full h-full object-cover"
                        src={`https://images.weserv.nl/?url=${datos.imagen_1_estado_guia}`}
                      />
                    </Card>
                  )}

                  {datos?.imagen_2_estado_guia && (
                    <Card className="h-[200px]">
                      <CardHeader className="absolute z-10 -top-3 right-8 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_2_estado_guia}>
                          <Button
                            className="bg-transparent"
                            variant="flat"
                            color="default"
                            radius="sm"
                            size="xl"
                          >
                            <IconoView className="text-blue-500 text-3xl" />
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Imagen 2"
                        className="z-0 w-full h-full object-cover"
                        src={`https://images.weserv.nl/?url=${datos.imagen_2_estado_guia}`}
                      />
                    </Card>
                  )}

                  {datos?.imagen_3_estado_guia && (
                    <Card className="h-[200px]">
                      <CardHeader className="absolute z-10 -top-3 right-8 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_3_estado_guia}>
                          <Button
                            className="bg-transparent"
                            variant="flat"
                            color="default"
                            radius="sm"
                            size="xl"
                          >
                            <IconoView className="text-blue-500 text-3xl" />
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Imagen 3"
                        className="z-0 w-full h-full object-cover"
                        src={`https://images.weserv.nl/?url=${datos.imagen_3_estado_guia}`}
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
