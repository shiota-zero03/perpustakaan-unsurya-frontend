import { FaBook } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";

import UserImage from "@/assets/images/buku.png";
import { convertFileToBase64 } from "@/utils/base64Formater";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { BukuFisikInterfaceErrorReq, BukuFisikInterfaceReq } from "@/interface/request/BukuFisik.interface";
import { useStoreBukuFisik } from "@/services/buku-fisik";

export default function TambahDataTASkripsi(){

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<BukuFisikInterfaceReq>({
        no_urut: null,
        cover: null,
        kode_klasifikasi: null,
        judul: null,
        penulis: null,
        penerbit: null,
        tahun_terbit: null,
        isbn: null,
        tanggal_masuk: null,
        kode_rak: null,
        stok: null,
        denda_harian: null,
    })

    const [ formDataError, setFormDataError ] = useState<BukuFisikInterfaceErrorReq>({})

    useEffect(() => {
        setFormData({
            no_urut: null,
            cover: null,
            kode_klasifikasi: null,
            judul: null,
            penulis: null,
            penerbit: null,
            tahun_terbit: null,
            isbn: null,
            tanggal_masuk: null,
            kode_rak: null,
            stok: null,
            denda_harian: null,
        });
        setFormDataError({})
    }, [])
    
    const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64Icon = await convertFileToBase64(file);
            console.log(base64Icon)
            setFormData({
              ...formData,
              cover: base64Icon,
            });
          } else {
            setFormData((prev) => ({ ...prev, cover: null }));
          }
    }

    const [ loadingSend, setLoadingSend ] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {mutate: mutatePost} = useStoreBukuFisik();
    const handleSubmit = () => {
        setLoadingSend(true)
        setFormDataError({})
        try {
            mutatePost(
                formData,
                {
                    onSuccess: (res) => {
                        successToast({text: res.message})
                        isFinished()
                        navigate('/data-master/buku-fisik')
                        
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
                                    no_urut: errors.no_urut || "",
                                    cover: errors.cover || "",
                                    kode_klasifikasi: errors.kode_klasifikasi || "",
                                    judul: errors.judul || "",
                                    penulis: errors.penulis || "",
                                    penerbit: errors.penerbit || "",
                                    tahun_terbit: errors.tahun_terbit || "",
                                    isbn: errors.isbn || "",
                                    tanggal_masuk: errors.tanggal_masuk || "",
                                    kode_rak: errors.kode_rak || "",
                                    stok: errors.stok || "",
                                    denda_harian: errors.denda_harian || "",
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

    return (
        <main className="flex flex-col gap-4">
            <ConfirmAlert 
                isOpen={isOpen} 
                isLoading={loadingSend} 
                text={"Apakah anda yakin untuk menyimpan data ini ?"} 
                onClose={onClose}
                confirmAction={() => handleSubmit()}
            />
            <BreadcrumbWithCustomSeparator icon={FaBook} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">FORM TAMBAH BUKU FISIK</h1>
                </div>
                <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-4">
                    <div className="col-span-1">
                        <div className="border border-primary rounded-md flex items center justify-center md:p-4 p-2 mb-2">
                            <img src={formData.cover || UserImage} alt="user-image" loading="lazy" className={formData.cover ? "w-full" : "w-1/2"} />
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
                            <div>
                                <label htmlFor="no_urut" className="text-primary font-semibold text-sm">No. Urut Buku</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="no_urut"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="book serial number here"
                                    value={formData.no_urut || ""}
                                    onChange={(e) => setFormData({...formData, no_urut: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.no_urut}</div>
                            </div>
                            <div>
                                <label htmlFor="kode_klasifikasi" className="text-primary font-semibold text-sm">Kode Klasifikasi Koleksi Perpustakaan</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="kode_klasifikasi"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="library classification code here"
                                    value={formData.kode_klasifikasi || ""}
                                    onChange={(e) => setFormData({...formData, kode_klasifikasi: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.kode_klasifikasi}</div>
                            </div>
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
                            <div>
                                <label htmlFor="tanggal_masuk" className="text-primary font-semibold text-sm">Tanggal Masuk Perpustakaan</label>
                                <Input
                                    aria-label="Masa Berlaku Keanggotaan"
                                    id="tanggal_masuk"
                                    type="date"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="mm/dd/yyyy"
                                    value={formData.tanggal_masuk || ""}
                                    onChange={(e) => setFormData({...formData, tanggal_masuk: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.tanggal_masuk}</div>
                            </div>
                            <div>
                                <label htmlFor="kode_rak" className="text-primary font-semibold text-sm">Kode Rak</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="kode_rak"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="placement code here"
                                    value={formData.kode_rak || ""}
                                    onChange={(e) => setFormData({...formData, kode_rak: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.kode_rak}</div>
                            </div>
                            <div>
                                <label htmlFor="stok" className="text-primary font-semibold text-sm">Jumlah Eksemplar</label>
                                <Input
                                    type="number"
                                    aria-label="Nomor Urut"
                                    id="stok"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="book total exemplar here"
                                    value={String(formData.stok || "")}
                                    onChange={(e) => setFormData({...formData, stok: Number(e.target.value)})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.stok}</div>
                            </div>
                            <div>
                                <label htmlFor="denda_harian" className="text-primary font-semibold text-sm">Denda Harian</label>
                                <Input
                                    type="number"
                                    startContent={<div className="text-xs text-center text-primary italic font-semibold">Rp</div>}
                                    aria-label="Nomor Urut"
                                    id="denda_harian"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="your daily fine here"
                                    value={String(formData.denda_harian || "")}
                                    onChange={(e) => setFormData({...formData, denda_harian: Number(e.target.value)})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.denda_harian}</div>
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