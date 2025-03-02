import { FakultasInterfaceReq } from "@/interface/request/Fakultas.interface";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { useGetDetailFakultas, useUpdateFakultas } from "@/services/fakultas";
import { errorToast, successToast } from "@/utils/toastMessage";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Spinner } from "@nextui-org/react";
import { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { BiX } from "react-icons/bi";

interface props {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    afterClose: () => void;
}

interface errorProps {
    name?: string;
    code?: string;
}

const UpdateModal = ({ id, isOpen, onClose, afterClose }: props) => {

    const [ isLoading, setLoading ] = useState<boolean>(false)
    const [ formData, setFormData ] = useState<FakultasInterfaceReq>({
        name: '',
        code: ''
    })

    const [ formError, setFormError ] = useState<errorProps>({});

    const { data, isFetching, refetch, isError, error } = useGetDetailFakultas(id)

    useEffect(() => {
        setFormData({
            name: '',
            code: ''
        })
        setFormError({});
        refetch();
    }, [isOpen])

    useEffect(() => {
        if(data) {
            setFormData({
                name: data.data.name || "",
                code: data.data.code || "",
            })
        }
    }, [isOpen, data])

    useEffect(() => {
        if (!isFetching && (!data || isError)) {
            errorToast({ text: `Data dengan id ${id} tidak ditemukan` })
            onClose()
        }
    }, [data, isFetching, isError, error]);

    const { mutate: mutatePost } = useUpdateFakultas();
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        try {
            mutatePost(
                {id: id, data: formData},
                {
                    onSuccess: (res) => {
                        successToast({ text: res.message || "Data berhasil diperbarui" })
                        setTimeout(() => {
                            onClose();
                            afterClose();
                            setLoading(false);
                        }, 500);
                        
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        setLoading(false);
                        if (error.response && error.response.data) {
                            const { data, status } = error.response;
                            const { errors, message } = data;
                            errorToast({ text: message || "" });

                            if(status === 422) {
                                setFormError({
                                    ...formError,
                                    name: errors.name,
                                    code: errors.code
                                })
                            }
                        } else {
                            errorToast({ text: error.message || "Terjadi kesalahan yang tidak terduga" });
                        }
                        
                        throw error;
                    },
                }
            )
        } catch (error) {
            console.error("Error during form submission:", error);
            setLoading(false);
            throw error;
        }
    }

    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            onClose={onClose}
            isDismissable={!isOpen}
            hideCloseButton
        >
            <ModalContent className="relative">
                {isFetching ? (
                    <div className="absolute inset-0 bg-black/10 z-30 flex items-center justify-center">
                        <Spinner size="lg" className="scale-150" />
                    </div>
                ) : null}
                <ModalHeader className="flex items-center justify-between">
                    <span className="font-semibold text-primary">Edit Fakultas</span>
                    <BiX className="text-danger border rounded-full p-1 cursor-pointer border-danger" size={32} onClick={onClose} />
                </ModalHeader>
                <hr />
                <ModalBody className="flex flex-col gap-y-5 pb-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                            <Input
                                label="Kode Fakultas"
                                placeholder="Masukkan kode fakultas"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="sm"
                                color="primary"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                classNames={{
                                    label: 'text-xs font-medium'
                                }}
                            />
                            <small><em className="text-danger">{formError.code}</em></small>
                        </div>
                        <div>
                            <Input
                                label="Nama Fakultas"
                                placeholder="Masukkan nama fakultas"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="sm"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                color="primary"
                                classNames={{
                                    label: 'text-xs font-medium'
                                }}
                            />
                            <small><em className="text-danger">{formError.name}</em></small>
                        </div>
                        <div>
                            <Button isLoading={isLoading} type="submit" color="secondary" className="w-full" size="sm">Simpan</Button>
                        </div>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default UpdateModal;