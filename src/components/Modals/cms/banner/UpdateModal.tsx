import { BannerInterfaceReq } from "@/interface/request/Banner.interface";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { useGetDetailBanner, useUpdateBanner } from "@/services/banner";
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
    title?: string;
    subtitle?: string;
    picture?: string;
}

const UpdateModal = ({ id, isOpen, onClose, afterClose }: props) => {

    const [ isLoading, setLoading ] = useState<boolean>(false)
    const [ formData, setFormData ] = useState<BannerInterfaceReq>({
        title: '',
        subtitle: '',
        picture: null
    })

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [ formError, setFormError ] = useState<errorProps>({});

    const { data, isFetching, refetch, isError, error } = useGetDetailBanner(id)

    useEffect(() => {
        refetch();
    }, [isOpen])

    useEffect(() => {
        if(data) {
            setFormData({
                ...formData,
                title: data.data.title || "",
                subtitle: data.data.subtitle || "",
                picture: null
            })

            setPreviewImage(data.data.picture)
        }
    }, [isOpen, data])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, picture: file });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, picture: null });
            setPreviewImage(null);
        }
    };

    useEffect(() => {
        if (!isFetching && (!data || isError)) {
            errorToast({ text: `Data dengan id ${id} tidak ditemukan` })
            onClose()
        }
    }, [data, isFetching, isError, error]);

    const { mutate: mutatePost } = useUpdateBanner();
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        const formDataSend = new FormData();
        formDataSend.append("_method", "PUT");
        formData.picture && formDataSend.append("picture", formData.picture);
        formData.title && formDataSend.append("title", formData.title);
        formData.subtitle && formDataSend.append("subtitle", formData.subtitle);
        
        try {
            mutatePost(
                {id: id, data: formDataSend},
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
                        console.error(error)
                        setLoading(false);
                        if (error.response && error.response.data) {
                            const { data, status } = error.response;
                            const { errors, message } = data;
                            errorToast({ text: message || "" });

                            if(status === 422) {
                                setFormError({
                                    ...formError,
                                    title: errors.title,
                                    subtitle: errors.subtitle,
                                    picture: errors.picture
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
            <ModalContent>
                {isFetching ? (
                    <div className="absolute inset-0 bg-black/10 z-30 flex items-center justify-center">
                        <Spinner size="lg" className="scale-150" />
                    </div>
                ) : null}
                <ModalHeader className="flex items-center justify-between">
                    <span className="font-semibold text-primary">Tambah Banner</span>
                    <BiX className="text-danger border rounded-full p-1 cursor-pointer border-danger" size={32} onClick={onClose} />
                </ModalHeader>
                <hr />
                <ModalBody className="flex flex-col gap-y-5 pb-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <Input
                                label="Judul Banner"
                                placeholder="Masukkan Judul Banner"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="sm"
                                color="primary"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                classNames={{
                                    label: 'text-xs font-medium'
                                }}
                            />
                            <small><em className="text-danger">{formError.title}</em></small>
                        </div>
                        <div>
                            <Input
                                label="Subtitle"
                                placeholder="Masukkan subtitle (optional)"
                                labelPlacement="outside"
                                variant="bordered"
                                radius="sm"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                color="primary"
                                classNames={{
                                    label: 'text-xs font-medium'
                                }}
                            />
                            <small><em className="text-danger">{formError.subtitle}</em></small>
                        </div>
                        <div>
                            <label htmlFor="picture" className="text-sm text-primary font-medium">Gambar Banner</label>
                            <input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                            {previewImage && <img src={previewImage} alt="Preview" className="mt-2 w-full h-40 object-cover rounded" />}
                            <small><em className="text-danger">{formError.picture}</em></small>
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