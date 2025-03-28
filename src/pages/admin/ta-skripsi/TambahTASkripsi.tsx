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
import { KaryaTulisInterfaceErrorReq, KaryaTulisInterfaceReq } from "@/interface/request/KaryaTulis.interface";
import { useStoreKaryaTulis } from "@/services/karya-tulis";
import { useGetAllDepartment, useGetAllFaculty } from "@/services/option";
import { BsFileArrowUpFill, BsFiletypePdf, BsXCircle } from "react-icons/bs";
import AddFileKarya from "@/components/Modals/karya-tulis/AddFile";

export default function TambahBukuDigital(){

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<KaryaTulisInterfaceReq>({
        judul: null,
        cover: null,
        penulis: null,
        nim: null,
        facultyId: null,
        studyProgramId: null,
        tahun_terbit: null,
        jenis: null,
        no_urut: null,
        kode_klasifikasi: null,
        tanggal_masuk: null,
        kode_rak: null,
        denda_harian: null,
        abstrak: null,
    })

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [ document, setDocument ] = useState<{ id: number | null; file: File | null; title: string; }[]>([])

    const removeDoc = (index: number) => {
        setDocument(document.filter((_, i) => i !== index));
    };

    const [ formDataError, setFormDataError ] = useState<KaryaTulisInterfaceErrorReq>({})

    const {
        data: facultyData,
        refetch: facultyRefetch,
        isFetching: facultyIsFetching
    } = useGetAllFaculty();

    const FAKULTAS_DATA = useMemo(() => {
        if(!facultyData) return [];
        else return facultyData.data;
    }, [facultyData])

    const {
        data: prodiData,
        refetch: prodiRefetch,
        isFetching: prodiIsFetching
    } = useGetAllDepartment(String(formData.facultyId));

    const PRODI_DATA = useMemo(() => {
        if(!prodiData) return [];
        else return prodiData.data;
    }, [prodiData])

    useEffect(() => {
        setFormData({
            judul: null,
            cover: null,
            penulis: null,
            nim: null,
            facultyId: null,
            studyProgramId: null,
            tahun_terbit: null,
            jenis: null,
            no_urut: null,
            kode_klasifikasi: null,
            tanggal_masuk: null,
            kode_rak: null,
            denda_harian: null,
            abstrak: null,
        });
        setPreviewImage(null)
        facultyRefetch();
        prodiRefetch();
        setFormDataError({})
    }, [])

    useEffect(() => {
        prodiRefetch();
        setFormData({
            ...formData,
            studyProgramId: null
        })
    }, [formData.facultyId])
    
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
    const { isOpen: isOpenFile, onOpen: onOpenFile, onClose: onCloseFile } = useDisclosure();

    const {mutate: mutatePost} = useStoreKaryaTulis();
    const handleSubmit = () => {
        setLoadingSend(true)
        setFormDataError({})

        const formDataSend = new FormData();

        formData.cover && formDataSend.append("cover", formData.cover)
        formData.judul && formDataSend.append("judul", formData.judul)
        formData.penulis && formDataSend.append("penulis", formData.penulis)
        formData.nim && formDataSend.append("nim", formData.nim)
        formData.facultyId && formDataSend.append("facultyId", String(formData.facultyId))
        formData.studyProgramId && formDataSend.append("studyProgramId", String(formData.studyProgramId))
        formData.tahun_terbit && formDataSend.append("tahun_terbit", String(formData.tahun_terbit))
        formData.jenis && formDataSend.append("jenis", formData.jenis)
        formData.no_urut && formDataSend.append("no_urut", formData.no_urut)
        formData.kode_klasifikasi && formDataSend.append("kode_klasifikasi", formData.kode_klasifikasi)
        formData.tanggal_masuk && formDataSend.append("tanggal_masuk", formData.tanggal_masuk)
        formData.kode_rak && formDataSend.append("kode_rak", formData.kode_rak)
        formData.denda_harian && formDataSend.append("denda_harian", String(formData.denda_harian))
        formData.abstrak && formDataSend.append("abstrak", formData.abstrak)
        document?.forEach((doc) => {
            if (doc.file) {
                formDataSend.append("document[]", doc.file); // notice "document[]" supaya backend tau ini array
                formDataSend.append(`document_title[]`, doc.title); // kalau perlu kirim title-nya juga
            }
        });

        try {
            mutatePost(
                formDataSend,
                {
                    onSuccess: (res) => {
                        successToast({text: res.message})
                        isFinished()
                        navigate('/data-master/ta-&-skripsi')
                        
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
                                    judul: errors.judul || "",
                                    cover: errors.cover || "",
                                    penulis: errors.penulis || "",
                                    nim: errors.nim || "",
                                    facultyId: errors.facultyId || "",
                                    studyProgramId: errors.studyProgramId || "",
                                    tahun_terbit: errors.tahun_terbit || "",
                                    jenis: errors.jenis || "",
                                    no_urut: errors.no_urut || "",
                                    kode_klasifikasi: errors.kode_klasifikasi || "",
                                    tanggal_masuk: errors.tanggal_masuk || "",
                                    kode_rak: errors.kode_rak || "",
                                    denda_harian: errors.denda_harian || "",
                                    abstrak: errors.abstrak || "",
                                    document: errors.document || "",
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

    const handleChangeFile = (id: null, title: string, file: File | null) => {
        if(file) {
            setDocument([...document, { id: id, file: file, title: title }]);
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
            <AddFileKarya
                isOpen={isOpenFile}
                onClose={onCloseFile}
                confirmAction={(title: string, file: File | null) => handleChangeFile(null, title, file)}
            />
            <BreadcrumbWithCustomSeparator icon={FaBook} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">FORM TAMBAH KARYA TULIS</h1>
                </div>
                <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-4">
                    <div className="col-span-1">
                        <div>
                            <div className="border border-primary rounded-md flex items center justify-center md:p-4 p-2 mb-2">
                                <img src={previewImage || UserImage} alt="user-image" loading="lazy" className={previewImage ? "w-full" : "w-1/2"} />
                            </div>
                            <input type="file" id="cover" className="hidden" onChange={handleChangeImage} accept=".jpg,.jpeg,.png" />
                            <label htmlFor="cover">
                                <div 
                                    className="w-full border border-primary rounded-md font-semibold p-2 text-xs text-center text-primary cursor-pointer"
                                >
                                    UPLOAD COVER
                                </div>
                            </label>
                            <div className="text-danger italic text-xs">{formDataError.cover}</div>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="penulis" className="text-primary font-semibold text-sm">Nama Penulis</label>
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
                        </div>
                        <div>
                            <div>
                                <label htmlFor="nim" className="text-primary font-semibold text-sm">NIM</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="nim"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="author nim here"
                                    value={formData.nim || ""}
                                    onChange={(e) => setFormData({...formData, nim: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.nim}</div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="type" className="text-primary font-semibold text-sm">Jenis Karya Tulis</label>
                            <Select
                                aria-label="type"
                                id="type"
                                variant="bordered"
                                color="primary"
                                radius="sm"
                                placeholder="--- Pilih jenis karya tulis ---"
                                selectedKeys={[String(formData.jenis || "")]}
                                onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                                classNames={{
                                    trigger: "border border-primary rounded",
                                    value: "text-primary text-xs font-medium italic placeholder:text-primary",
                                    label: "text-primary font-semibold text-sm"
                                }}
                            >
                                <SelectItem value={'Skripsi'} key={'Skripsi'}>Skripsi</SelectItem>
                                <SelectItem value={'TA'} key={'TA'}>TA</SelectItem>
                                <SelectItem value={'Tesis'} key={'Tesis'}>Tesis</SelectItem>
                                <SelectItem value={'Disertasi'} key={'Disertasi'}>Disertasi</SelectItem>
                            </Select>
                            <div className="text-danger italic text-xs">{formDataError.jenis}</div>
                        </div>
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1 -mt-2">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
                            <div>
                                <label htmlFor="no_urut" className="text-primary font-semibold text-sm">No. Urut Karya Tulis</label>
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
                            <div>
                                <label htmlFor="judul" className="text-primary font-semibold text-sm">Judul Karya Tulis</label>
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
                                <label htmlFor="faculty" className="text-primary font-semibold text-sm">Fakultas</label>
                                <Select
                                    aria-label="Faculty"
                                    id="faculty"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="--- Pilih fakultas ---"
                                    selectedKeys={[String(formData.facultyId || "")]}
                                    onChange={(e) => setFormData({...formData, facultyId: Number(e.target.value)})}
                                    classNames={{
                                        trigger: "border border-primary rounded",
                                        value: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                >
                                    {facultyIsFetching ? (
                                        <SelectItem value={""} key={""}>Loading ...</SelectItem>
                                    ) : FAKULTAS_DATA.map(item => (
                                        <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                    ))}
                                </Select>
                                <div className="text-danger italic text-xs">{formDataError.facultyId}</div>
                            </div>
                            <div>
                                <label htmlFor="prodi" className="text-primary font-semibold text-sm">Program Studi</label>
                                <Select
                                    aria-label="prodi"
                                    id="prodi"
                                    variant="bordered"
                                    color="primary"
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
                            <div className="sm:col-span-2 col-span-1">
                                <label htmlFor="abstrak" className="text-primary font-semibold text-sm">Abstrak</label>
                                <Textarea
                                    aria-label="Nomor Urut"
                                    id="abstrak"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    rows={10}
                                    placeholder="abstract here"
                                    value={formData.abstrak || ""}
                                    onChange={(e) => setFormData({...formData, abstrak: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.abstrak}</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 sm:col-span-3 col-span-1">
                        <hr className="border-0.5 border-primary" />
                    </div>
                    <div className="lg:col-span-4 sm:col-span-3 col-span-1">
                        <div className="mt-2 w-full">
                            <div 
                                className="w-full bg-primary/20 border border-primary rounded-md font-semibold p-2 text-xs text-primary"
                            >
                                Dokumen Karya Tulis
                            </div>
                            <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 mt-2 gap-4">
                                {document.map((item, index) => (
                                    <div key={index} className="md:h-40 h-24 flex flex-col items-center justify-center border border-dashed border-primary text-secondary rounded-md gap-2 font-semibold text-center relative">
                                        <BsXCircle className="absolute right-2 top-2 text-danger cursor-pointer" onClick={() => removeDoc(index)} />
                                        <BsFiletypePdf size={32} />
                                        <div className="text-xs">{item.title}</div>
                                    </div>    
                                ))}
                                <div className="md:h-40 h-24 flex items-center justify-center border border-dashed border-primary text-secondary rounded-md cursor-pointer" onClick={onOpenFile}>
                                    <BsFileArrowUpFill size={32} />
                                </div>
                            </div>
                            <div className="text-danger italic text-xs">{formDataError.document}</div>
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