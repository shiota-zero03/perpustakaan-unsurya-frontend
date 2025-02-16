import { Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { BiPowerOff } from "react-icons/bi";

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  text: string;
  onClose: () => void;
  confirmAction: () => void;
}

const LogoutAlert = ({ isOpen, onClose, isLoading, text, confirmAction }: Props) => {
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
          <BiPowerOff size={90} className="text-danger text-center w-full" />
          <p className="text-center text-danger font-semibold">
            {text}
          </p>
          <div className="flex justify-center items-center w-full gap-x-5">
            <Button
              variant="bordered"
              className="hover:bg-danger active:bg-danger border-danger text-danger hover:text-white active:text-white font-semibold w-1/2"
              isLoading={isLoading}
              onPress={onClose}
            >
              Batal
            </Button>
            <Button
              className="bg-danger text-white font-semibold w-1/2"
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

export default LogoutAlert;
