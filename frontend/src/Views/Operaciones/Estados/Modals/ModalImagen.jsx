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
  IconoRecojos,
} from "../../../../Iconos/Iconos-NavBar";
export default function ModalImagen({ datos }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} className="bg-transparent text-gray-600 ">
        <IconoRecojos className=" text-2xl" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Imagen</ModalHeader>
              <ModalBody>
                <div className="max-w-[900px] gap-2 grid grid-cols-2 grid-rows-1px-8 ">
                  {datos?.imagen_estado_recojo && (
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <a
                          href={datos.imagen_estado_recojo}
                          target="_blank"
                        >
                          <Button
                            className="text-base text-white bg-black/75"
                            variant="flat"
                            color="default"
                            radius="lg"
                            size="sm"
                          >
                            <h4 className="text-white font-medium text-large">
                              Imagen
                            </h4>
                          </Button>
                        </a>
                      </CardHeader>
                      <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={`https://images.weserv.nl/?url=${datos.imagen_estado_recojo}`}
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
