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
  IconoView,
  IconoMuñeco,
  IconoRecojos,
} from "../../../../Iconos/Iconos-NavBar";
export default function ModalImagen({ dato }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} className="bg-transparent text-gray-600 ">
        <IconoRecojos className=" text-xl" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-[190px]">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Imagen</ModalHeader>
              <ModalBody>
                <div className="max-w-[900px] gap-2 grid grid-cols-2 grid-rows-1px-8 ">
                  {dato && (
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                      <CardHeader className="absolute z-10 -top-3 right-8 flex-col !items-start">
                        <a href={dato} target="_blank">
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
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={`https://images.weserv.nl/?url=${dato}`}
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
