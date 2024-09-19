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
export default function ModalImagen({ Icono }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} className="bg-transparent text-gray-600 ">
        <IconoRecojos className=" text-xl" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Imagen</ModalHeader>
              <ModalBody>
                <div className="max-w-[900px] gap-2 grid grid-cols-2 grid-rows-1px-8 ">
                  <Card className="col-span-12 sm:col-span-4 h-[200px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                      <h4 className="text-white font-medium text-large">
                        Imagen
                      </h4>
                    </CardHeader>
                    <Image
                      removeWrapper
                      alt="Card background"
                      className="z-0 w-full h-full object-cover"
                      src="https://nextui.org/images/card-example-3.jpeg"
                    />
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
