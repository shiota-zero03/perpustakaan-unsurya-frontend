import { Button, Input, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  confirmAction: (data: string) => void;
}

const ScanAnggota = ({ isOpen, onClose, confirmAction }: Props) => {

  const [ search, onSearch ] = useState<string>("")

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onSearch("");
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="flex flex-col gap-y-2 p-8">
          <p className="text-primary font-semibold">
            ID Peminjam (Nomor Identitas)
          </p>
          <Input 
            ref={inputRef}
            value={search} 
            onChange={(e) => onSearch(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirmAction(search);
              }
            }}
            variant="bordered" 
            classNames={{ inputWrapper: "border-[0.8px] border-primary", input: "text-primary" }} 
            radius="sm" 
            placeholder="Masukkan / Scan nomor identitas" 
          />
          <div className="flex justify-center items-center w-full gap-x-5">
            <Button
              className="bg-primary text-white font-semibold w-full"
              onPress={() => confirmAction(search)}
            >
              Cari
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ScanBuku = ({ isOpen, onClose, confirmAction }: Props) => {

  const [ search, onSearch ] = useState<string>("")

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onSearch("");
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="flex flex-col gap-y-2 p-8">
          <p className="text-primary font-semibold">
            Nomor ISBN Buku
          </p>
          <Input 
            ref={inputRef}
            value={search} 
            onChange={(e) => onSearch(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirmAction(search);
              }
            }}
            variant="bordered" 
            classNames={{ inputWrapper: "border-[0.8px] border-primary", input: "text-primary" }} 
            radius="sm" 
            placeholder="Masukkan / Scan nomor isbn" 
          />
          <div className="flex justify-center items-center w-full gap-x-5">
            <Button
              className="bg-primary text-white font-semibold w-full"
              onPress={() => confirmAction(search)}
            >
              Cari
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { ScanAnggota, ScanBuku };
