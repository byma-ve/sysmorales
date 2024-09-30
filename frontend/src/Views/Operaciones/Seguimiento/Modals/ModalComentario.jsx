import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { IconoComentario } from "../../../../Iconos/Iconos-NavBar";

export default function ModalComentario2({ dato }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button className="bg-transparent text-xl text-gray-500" onPress={onOpen}>
        <IconoComentario />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Observacion
              </ModalHeader>
              <ModalBody>
                <p>{dato}</p>
              </ModalBody>
              <ModalFooter>
                <Button
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
