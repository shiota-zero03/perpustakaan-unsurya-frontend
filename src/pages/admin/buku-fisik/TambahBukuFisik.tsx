import { FaBook } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Button, Input, Select, SelectItem, Textarea, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";

import UserImage from "@/assets/images/buku.png";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { BukuFisikInterfaceErrorReq, BukuFisikInterfaceReq } from "@/interface/request/BukuFisik.interface";
import { useStoreBukuFisik } from "@/services/buku-fisik";
import { useGetAllDepartment } from "@/services/option";

export default function TambahDataBukuFisik(){

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
        studyProgramId: null,
        book_description: null,
        locations: null,
        language: null,
        physical_description: null,
        edition: null,
    })

    const [ formDataError, setFormDataError ] = useState<BukuFisikInterfaceErrorReq>({})
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const {
        data: prodiData,
        refetch: prodiRefetch,
        isFetching: prodiIsFetching
    } = useGetAllDepartment(null);

    const PRODI_DATA = useMemo(() => {
        if(!prodiData) return [];
        else return prodiData.data;
    }, [prodiData])

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
            studyProgramId: null,
            book_description: null,
            locations: null,
            language: null,
            physical_description: null,
            edition: null,
        });
        setPreviewImage(null);
        setFormDataError({})
        prodiRefetch();
    }, [])
    
    const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, cover: file });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, cover: null });
            setPreviewImage(null);
        }
    }

    const [ loadingSend, setLoadingSend ] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {mutate: mutatePost} = useStoreBukuFisik();
    const handleSubmit = () => {
        setLoadingSend(true)
        setFormDataError({})

        const formDataSend = new FormData();

        formData.cover && formDataSend.append("cover", formData.cover)
        formData.kode_klasifikasi && formDataSend.append("kode_klasifikasi", formData.kode_klasifikasi)
        formData.judul && formDataSend.append("judul", formData.judul)
        formData.penulis && formDataSend.append("penulis", formData.penulis)
        formData.penerbit && formDataSend.append("penerbit", formData.penerbit)
        formData.tahun_terbit && formDataSend.append("tahun_terbit", String(formData.tahun_terbit))
        formData.isbn && formDataSend.append("no_urut", formData.isbn)
        formData.isbn && formDataSend.append("isbn", formData.isbn)
        formData.tanggal_masuk && formDataSend.append("tanggal_masuk", formData.tanggal_masuk)
        formData.kode_rak && formDataSend.append("kode_rak", formData.kode_rak)
        formData.stok && formDataSend.append("stok", String(formData.stok))
        formData.denda_harian && formDataSend.append("denda_harian", String(formData.denda_harian))
        formData.kode_rak && formDataSend.append("kode_rak", formData.kode_rak)
        formData.book_description && formDataSend.append("book_description", formData.book_description)
        formData.locations && formDataSend.append("locations", formData.locations)
        formData.language && formDataSend.append("language", formData.language)
        formData.physical_description && formDataSend.append("physical_description", formData.physical_description)
        formData.edition && formDataSend.append("edition", formData.edition)
        formData.studyProgramId && formDataSend.append("studyProgramId", String(formData.studyProgramId))

        try {
            mutatePost(
                formDataSend,
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
                                    book_description: errors.book_description || "",
                                    studyProgramId: errors.studyProgramId || "",
                                    locations: errors.locations || "",
                                    language: errors.language || "",
                                    physical_description: errors.physical_description || "",
                                    edition: errors.edition || "",
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
                            <div className="sm:col-span-2 col-span-1">
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
                            <div>
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
                                <label htmlFor="prodi" className="text-primary font-semibold text-sm">Program Studi</label>
                                <Select
                                    aria-label="prodi"
                                    id="prodi"
                                    variant="bordered"
                                    color="primary"
                                    isLoading={prodiIsFetching}
                                    radius="sm"
                                    placeholder="--- Pilih program studi ---"
                                    selectedKeys={[String(formData.studyProgramId || "")]}
                                    onChange={(e) => setFormData({...formData, studyProgramId: Number(e.target.value)})}
                                    classNames={{
                                        trigger: "border border-primary rounded",
                                        value: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                >
                                    {prodiIsFetching ? (
                                        <SelectItem value={""} key={""}>Loading ...</SelectItem>
                                    ) : PRODI_DATA.map(item => (
                                        <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                    ))}
                                </Select>
                                <div className="text-danger italic text-xs">{formDataError.studyProgramId}</div>
                            </div>
                            <div>
                                <label htmlFor="isbn" className="text-primary font-semibold text-sm">ISBN/ISSN</label>
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
                                <label htmlFor="locations" className="text-primary font-semibold text-sm">Lokasi Buku</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="locations"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="book location here"
                                    value={formData.locations || ""}
                                    onChange={(e) => setFormData({...formData, locations: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.locations}</div>
                            </div>
                            <div>
                                <label htmlFor="bahasa" className="text-primary font-semibold text-sm">Bahasa</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="bahasa"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="book language here"
                                    value={formData.language || ""}
                                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.language}</div>
                            </div>
                            <div>
                                <label htmlFor="physical_description" className="text-primary font-semibold text-sm">Deskripsi Fisik</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="physical_description"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="book physical description here (ex: vi+266 hlm; 16x23 cm)"
                                    value={formData.physical_description || ""}
                                    onChange={(e) => setFormData({...formData, physical_description: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.physical_description}</div>
                            </div>
                            <div>
                                <label htmlFor="edition" className="text-primary font-semibold text-sm">Edisi</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="edition"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="book edition here"
                                    value={formData.edition || ""}
                                    onChange={(e) => setFormData({...formData, edition: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.edition}</div>
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
                            <div className="sm:col-span-2 col-span-1">
                                <label htmlFor="book_description" className="text-primary font-semibold text-sm">Deskripsi Buku</label>
                                <Textarea
                                    aria-label="Nomor Urut"
                                    id="book_description"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="book description here"
                                    value={formData.book_description || ""}
                                    onChange={(e) => setFormData({...formData, book_description: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.book_description}</div>
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