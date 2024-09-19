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
import { IconoOjito2 } from "../../../../Iconos/Iconos-NavBar";
import { IconoBox, IconoMuñeco } from "../../../../Iconos/Iconos-NavBar";
export default function ModalImagenes({ datos }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} className="bg-transparent text-gray-600 ">
        <IconoBox className="  absolute " />
        <IconoMuñeco className="ml-[26px]" />
        {/* <IconoOjito2 /> */}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Imagenes
              </ModalHeader>
              <ModalBody>
                <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-1px-8 ">
                  {datos?.imagen_1 && (
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_1}>
                          <Button
                            className="text-base px- text-white bg-black/75"
                            variant="flat"
                            color="default"
                            radius="lg"
                            size="sm"
                          >
                            <h4 className="text-white font-medium text-large">
                              Imagen 1
                            </h4>
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={`https://images.weserv.nl/?url=${datos.imagen_1}`}
                      />
                    </Card>
                  )}

                  {datos?.imagen_2 && (
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_2}>
                          <Button
                            className="text-base px- text-white bg-black/75"
                            variant="flat"
                            color="default"
                            radius="lg"
                            size="sm"
                          >
                            <h4 className="text-white font-medium text-large">
                              Imagen 2
                            </h4>
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={`https://images.weserv.nl/?url=${datos.imagen_2}`}
                      />
                    </Card>
                  )}
                  {datos?.imagen_3 && (
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <a target="_blank" href={datos.imagen_3}>
                          <Button
                            className="text-base px- text-white bg-black/75"
                            variant="flat"
                            color="default"
                            radius="lg"
                            size="sm"
                          >
                            <h4 className="text-white font-medium text-large">
                              Imagen 3
                            </h4>
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={`https://images.weserv.nl/?url=${datos.imagen_3}`}
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
