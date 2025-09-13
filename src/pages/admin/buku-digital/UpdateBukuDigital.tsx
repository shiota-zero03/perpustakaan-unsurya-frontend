import { FaUserGraduate } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";

import UserImage from "@/assets/images/buku.png";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { BukuDigitalInterfaceErrorReq, BukuDigitalInterfaceReq } from "@/interface/request/BukuDigital.interface";
import { useGetDetailBukuDigital, useUpdateBukuDigital } from "@/services/buku-digital";

export default function UpdateBukuDigital(){

    const { id } = useParams();

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<BukuDigitalInterfaceReq>({
        cover: null,
        judul: null,
        penulis: null,
        penerbit: null,
        tahun_terbit: null,
        isbn: null,
        link_book: null,
    })

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewLink, setPreviewLink] = useState<string | null>(null);

    const [ formDataError, setFormDataError ] = useState<BukuDigitalInterfaceErrorReq>({})

    const { data, isLoading, isFetching, refetch, error } = useGetDetailBukuDigital(id || "")

    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data, id]);

    useEffect(() => {
        if (dataFetching && Object.keys(dataFetching).length > 0) {
            setFormData({
                ...formData,
                cover: null,
                judul: dataFetching.judul,
                penulis: dataFetching.penulis,
                penerbit: dataFetching.penerbit,
                tahun_terbit: dataFetching.tahun_terbit,
                isbn: dataFetching.isbn
            })
            setPreviewImage(dataFetching.cover)
            setPreviewLink(dataFetching.link_book)
        }
    }, [dataFetching])

    useEffect(() => {
        refetch();
        setFormDataError({})
    }, [])

    const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, cover: file });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, cover: null });
            setPreviewImage(dataFetching?.cover || "");
        }
    }

    const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, link_book: file });
            setPreviewLink(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, link_book: null });
            setPreviewImage(dataFetching?.link_book || "");
        }
    }

    const [ loadingSend, setLoadingSend ] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {mutate: mutatePut} = useUpdateBukuDigital();
    const handleSubmit = () => {
        setLoadingSend(true)
        setFormDataError({})

        const formDataSend = new FormData();

        formDataSend.append("_method", "PUT");
        formData.cover && formDataSend.append("cover", formData.cover)
        formData.judul && formDataSend.append("judul", formData.judul)
        formData.penulis && formDataSend.append("penulis", formData.penulis)
        formData.penerbit && formDataSend.append("penerbit", formData.penerbit)
        formData.tahun_terbit && formDataSend.append("tahun_terbit", String(formData.tahun_terbit))
        formData.isbn && formDataSend.append("isbn", formData.isbn)
        formData.link_book && formDataSend.append("link_book", formData.link_book)

        try {
            mutatePut(
                {data: formDataSend, userId: id || ""},
                {
                    onSuccess: (res) => {
                        successToast({text: res.message})
                        isFinished()
                        navigate('/data-master/buku-digital')
                        
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { data, status } = error.response;
                            const { message, errors } = data;

                            errorToast({ text: message || "Terjadi kesalahan yang tidak terduga" });
                            if(status === 422) {
                                setFormDataError({
                                    ...formDataError,
                                    cover: errors.cover || "",
                                    judul: errors.judul || "",
                                    penulis: errors.penulis || "",
                                    penerbit: errors.penerbit || "",
                                    tahun_terbit: errors.tahun_terbit || "",
                                    isbn: errors.isbn || "",
                                    link_book: errors.link_book || "",
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
            isFinished()
            throw error;
        }
    }

    const isFinished = () => {
        setLoadingSend(false);
        onClose();
    }

    useEffect(() => {
        if(!isFetching && error) {
            navigate('/data-master/buku-digital');
            errorToast({ text: "Data tidak ditemukan" })
        }
    }, [isFetching])

    return (
        <main className="flex flex-col gap-4">
            {isLoading || isFetching ? (
                <div className="inset-0 fixed bg-black/10 z-10 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-[6px] border-t-4 h-20 w-20 mb-4" />
                </div>
            ) : null}
            <ConfirmAlert 
                isOpen={isOpen} 
                isLoading={loadingSend} 
                text={"Apakah anda yakin untuk menyimpan data ini ?"} 
                onClose={onClose}
                confirmAction={() => handleSubmit()}
            />
            <BreadcrumbWithCustomSeparator icon={FaUserGraduate} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">FORM EDIT DATA BUKU</h1>
                </div>
                <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-4">
                    <div className="col-span-1">
                        <div className="border border-primary rounded-md flex items center justify-center md:p-4 p-2 mb-2">
                            <img src={previewImage || UserImage} alt="user-image" loading="lazy" className={previewImage ? "w-full" : "w-1/2"} />
                        </div>
                        <input type="file" id="cover" className="hidden" onChange={handleChangeImage} accept=".jpg,.jpeg,.png" />
                        <label htmlFor="cover">
                            <div 
                                className="w-full border border-primary rounded-md font-semibold p-2 text-xs text-center text-primary cursor-pointer"
                            >
                                UPLOAD COVER BUKU
                            </div>
                        </label>
                        <div className="text-danger italic text-xs">{formDataError.cover}</div>
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1 -mt-2">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="judul" className="text-primary font-semibold text-sm">Judul Buku</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="judul"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="book title here"
                                    value={formData.judul || ""}
                                    onChange={(e) => setFormData({...formData, judul: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.judul}</div>
                            </div>
                            <div>
                                <label htmlFor="penulis" className="text-primary font-semibold text-sm">Nama Pengarang</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="penulis"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="author name here"
                                    value={formData.penulis || ""}
                                    onChange={(e) => setFormData({...formData, penulis: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.penulis}</div>
                            </div>
                            <div>
                                <label htmlFor="penerbit" className="text-primary font-semibold text-sm">Penerbit</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="penerbit"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="publisher name here"
                                    value={formData.penerbit || ""}
                                    onChange={(e) => setFormData({...formData, penerbit: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.penerbit}</div>
                            </div>
                            <div>
                                <label htmlFor="tahun_terbit" className="text-primary font-semibold text-sm">Tahun Terbit</label>
                                <Input
                                    type="number"
                                    min={1900}
                                    max={new Date().getFullYear()}
                                    aria-label="Nomor Urut"
                                    id="tahun_terbit"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="publish year here"
                                    value={String(formData.tahun_terbit || "")}
                                    onChange={(e) => setFormData({...formData, tahun_terbit: Number(e.target.value)})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.tahun_terbit}</div>
                            </div>
                            <div>
                                <label htmlFor="isbn" className="text-primary font-semibold text-sm">ISBN</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="isbn"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="book isbn here"
                                    value={formData.isbn || ""}
                                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.isbn}</div>
                            </div>
                            <div className="sm:col-span-2 flex flex-col gap-1">
                                <label htmlFor="url" className="text-primary font-semibold text-sm">File Buku</label>
                                <div className="flex">
                                    <Link target="__blank" to={previewLink || ""} className="text-white text-xs bg-primary flex items-center py-1 px-2 rounded-md">Lihat File</Link>
                                </div>
                                <input
                                    className="border border-primary"
                                    type="file"
                                    id="url"
                                    onChange={handleChangeFile}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <div className="text-danger italic text-xs">{formDataError.link_book}</div>
                            </div>
                        </div>
                        <div className="pt-2 pb-6">
                            <Button
                                onPress={onOpen}
                                isLoading={loadingSend}
                                variant="bordered"
                                color="primary"
                                size="sm"
                                className="w-full border rounded font-semibold"
                            >
                                SIMPAN
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}