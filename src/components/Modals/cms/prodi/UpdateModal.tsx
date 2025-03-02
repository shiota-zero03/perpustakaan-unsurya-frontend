import { ProdiInterfaceReq } from "@/interface/request/Prodi.interface";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { useGetAllFaculty } from "@/services/option";
import { useGetDetailProdi, useUpdateProdi } from "@/services/prodi";
import { errorToast, successToast } from "@/utils/toastMessage";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem, Spinner } from "@nextui-org/react";
import { AxiosError } from "axios";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BiX } from "react-icons/bi";

interface props {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    afterClose: () => void;
}

interface errorProps {
    fakultasId?: string;
    name?: string;
    code?: string;
}

const UpdateModal = ({ id, isOpen, onClose, afterClose }: props) => {

    const [ isLoading, setLoading ] = useState<boolean>(false)
    const [ formData, setFormData ] = useState<ProdiInterfaceReq>({
        fakultasId: null,
        name: '',
        code: ''
    })

    const [ formError, setFormError ] = useState<errorProps>({});

    const {
        data: facultyData,
        isFetching: facultyIsFetching
    } = useGetAllFaculty();

    const FAKULTAS_DATA = useMemo(() => {
        if(!facultyData) return [];
        else return facultyData.data;
    }, [facultyData])

    const { data, isFetching, refetch, isError, error } = useGetDetailProdi(id)

    useEffect(() => {
        setFormData({
            fakultasId: null,
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
                fakultasId: data.data.fakultas_id || null,
            })
        }
    }, [isOpen, data])

    useEffect(() => {
        if (!isFetching && (!data || isError)) {
            errorToast({ text: `Data dengan id ${id} tidak ditemukan` })
            onClose()
        }
    }, [data, isFetching, isError, error]);

    const { mutate: mutatePost } = useUpdateProdi();
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
                                    code: errors.code,
                                    fakultasId: errors.fakultasId
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
                    <span className="font-semibold text-primary">Edit Program Studi</span>
                    <BiX className="text-danger border rounded-full p-1 cursor-pointer border-danger" size={32} onClick={onClose} />
                </ModalHeader>
                <hr />
                <ModalBody className="flex flex-col gap-y-5 pb-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <Select
                                label="Fakultas"
                                labelPlacement="outside"
                                id="faculty"
                                variant="bordered"
                                color="primary"
                                radius="sm"
                                placeholder="--- Pilih fakultas ---"
                                selectedKeys={[String(formData.fakultasId)]}
                                onChange={(e) => setFormData({...formData, fakultasId: Number(e.target.value)})}
                                classNames={{
                                    label: 'text-xs font-medium'
                                }}
                            >
                                {facultyIsFetching ? (
                                    <SelectItem value={""} key={""}>Loading ...</SelectItem>
                                ) : FAKULTAS_DATA.map(item => (
                                    <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                ))}
                            </Select>
                            <small><em className="text-danger">{formError.fakultasId}</em></small>
                        </div>
                        <div>
                            <Input
                                label="Kode Program Studi"
                                placeholder="Masukkan kode program studi"
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
                                label="Nama Program Studi"
                                placeholder="Masukkan nama program studi"
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