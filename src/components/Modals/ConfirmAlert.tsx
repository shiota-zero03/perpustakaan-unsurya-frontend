import { Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { BiInfoCircle } from "react-icons/bi";

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  text: string;
  onClose: () => void;
  confirmAction: () => void;
}

const ConfirmAlert = ({ isOpen, onClose, isLoading, text, confirmAction }: Props) => {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={!isOpen}
      hideCloseButton
    >
      <ModalContent>
        <ModalBody className="flex flex-col gap-y-5 p-8">
          <BiInfoCircle size={90} className="text-primary text-center w-full animate-bounce" />
          <p className="text-center text-primary font-semibold">
            {text}
          </p>
          <div className="flex justify-center items-center w-full gap-x-5">
            <Button
              variant="bordered"
              className="hover:bg-primary active:bg-primary border-primary text-primary hover:text-white active:text-white font-semibold w-1/2"
              isLoading={isLoading}
              onPress={onClose}
            >
              Batal
            </Button>
            <Button
              className="bg-primary text-white font-semibold w-1/2"
              isLoading={isLoading}
              onPress={confirmAction}
            >
              Ya
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmAlert;
