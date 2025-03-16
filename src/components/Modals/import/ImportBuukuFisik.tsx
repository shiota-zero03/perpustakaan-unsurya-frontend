import { BaseErrorRes } from "@/interface/response/base.interface";
import { useImportBukuFisik } from "@/services/buku-fisik";
import { sampleBukuFisikExport } from "@/services/buku-fisik/http";
import { convertFileToBase64 } from "@/utils/base64Formater";
import { errorToast, successToast } from "@/utils/toastMessage";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { BsCloudDownloadFill } from "react-icons/bs";
import ConfirmAlert from "../ConfirmAlert";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  confirmAction: () => void;
}

const ImportBukuFisik = ({ isOpen, onClose, confirmAction }: Props) => {
  const [ isLoading, setLoading ] = useState<boolean>(false)
  const [ isLoadingImport, setIsLoadingExport ] = useState<boolean>(false)
  const [ dataImport, setDataImport ] = useState<string>('')
  const handleDownloadTemplate = async () => {
    try {
      setIsLoadingExport(true);
      await sampleBukuFisikExport();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: { status: number } | any) {
      if (error?.status === 404) {
        errorToast({
          text: "Data buku fisik tidak ditemukan",
        });
      }
      throw error;
    } finally {
      setIsLoadingExport(false);
    }
  };

  const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure();

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64Icon = await convertFileToBase64(file);
      setDataImport(base64Icon);
    } else {
      setDataImport('');
    }
  }

  const {mutate: mutatePost} = useImportBukuFisik();
  const handleSubmit = () => {
    setLoading(true)
    try {
      mutatePost(
        {dataImport: dataImport},
        {
          onSuccess: (res) => {
            successToast({text: res.message})
            setLoading(false);
            confirmAction();
            onCloseConfirm()
            onClose();
          },
          onError: (error: AxiosError<BaseErrorRes>) => {
            setLoading(false)
            if (error.response && error.response.data) {
              const { message } = error.response.data;
              errorToast({ text: message || "Terjadi kesalahan yang tidak terduga" });
            } else {
              errorToast({ text: error.message || "Terjadi kesalahan yang tidak terduga" });
            }
                        
            throw error;
          },
        }
      )
    } catch (error) {
      console.error("Error during form submission:", error);
      setLoading(false)
      throw error;
    }
  }

  useEffect(() => {
    setDataImport('')
  }, [isOpen])
  
  return (
    <>
      <ConfirmAlert 
        isOpen={isOpenConfirm} 
        isLoading={isLoading} 
        text={'Apakah anda yakin untuk mengimport data ?'} 
        onClose={onCloseConfirm}
        confirmAction={() => handleSubmit()}
      />
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        isDismissable={!isOpen}
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-between">
            <span className="font-semibold text-primary">Import Data Buku</span>
            <BiX className="text-danger border rounded-full p-1 cursor-pointer border-danger" size={32} onClick={onClose} />
          </ModalHeader>
          <hr />
          <ModalBody className="flex flex-col gap-y-5 p-8">
            <div>
              <Button onPress={handleDownloadTemplate} isLoading={isLoadingImport} className="bg-primary text-white w-full rounded-md"><BsCloudDownloadFill /> Sample Buku Import</Button>
            </div>
            <div>
              <label htmlFor="import" className="font-semibold text-primary">Upload file import <span className="text-danger">*</span></label>
              <input onChange={handleChangeFile} type="file" className="border !border-primary w-full" id="import" />
            </div>
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
                onPress={onOpenConfirm}
              >
                Import Excel
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImportBukuFisik;
