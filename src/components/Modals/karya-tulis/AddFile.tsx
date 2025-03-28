import { errorToast } from "@/utils/toastMessage";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  confirmAction: ( title: string, file: File | null ) => void;
}

const AddFileKarya = ({ isOpen, onClose, confirmAction }: Props) => {

    const [ file, setFile ] = useState<File | null>(null);
    const [ title, setTitle ] = useState<string>("");

    const handleSave = () => {
        if(!file || !title) {
            errorToast({ text: 'Lengkapi form terlebih dahulu' })
        } else {
            confirmAction(title, file)
            onClose();
        }
    }

    const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setFile(file);
      } else {
          setFile(null);
      }
    }

    useEffect(() => {
        setFile(null);
        setTitle("");
    }, [isOpen])

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={!isOpen}
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
            <span className="font-semibold text-primary">Tambah File</span>
            <BiX className="text-danger border rounded-full p-1 cursor-pointer border-danger" size={32} onClick={onClose} />
        </ModalHeader>
        <hr />
        <ModalBody className="flex flex-col gap-y-2 py-4 px-8">
            <div>
                <label htmlFor="import" className="font-semibold text-primary">Upload file <span className="text-danger">*</span></label>
                <input onChange={handleChangeFile} type="file" className="border !border-primary w-full" id="import" accept=".pdf" />
            </div>
            <div>
                <label htmlFor="no_urut" className="text-primary font-semibold text-sm">Judul File <span className="text-danger">*</span></label>
                <Input
                    aria-label="Nomor Urut"
                    id="no_urut"
                    variant="bordered"
                    color="primary"
                    radius="sm"
                    placeholder="file title here"
                    value={title || ""}
                    onChange={(e) => setTitle(e.target.value)}
                    classNames={{
                        inputWrapper: "border border-primary rounded",
                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                        label: "text-primary font-semibold text-sm"
                    }}
                />
            </div>
          <div className="w-full">
            <Button
              className="bg-primary text-white font-semibold w-full"
              onPress={handleSave}
            >
              Simpan
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddFileKarya;
