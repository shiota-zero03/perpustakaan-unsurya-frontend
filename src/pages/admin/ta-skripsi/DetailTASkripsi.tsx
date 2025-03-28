import { FaBook } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import UserImage from "@/assets/images/buku.png";
import { formatDateDMYIn } from "@/utils/dateFormat";
import { useGetDetailKaryaTulis } from "@/services/karya-tulis";
import { KaryaTulisInterfaceErrorReq } from "@/interface/request/KaryaTulis.interface";
import { BsFiletypePdf } from "react-icons/bs";
import { errorToast } from "@/utils/toastMessage";

export default function DetailTASkripsi(){

    const { id } = useParams();

    const [ formData, setFormData ] = useState<KaryaTulisInterfaceErrorReq>({
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

    const [ document, setDocument ] = useState<{ id: number | null; file: string; title: string; }[]>([])

    const { data, isLoading, isFetching, refetch, error } = useGetDetailKaryaTulis(id || "")
    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data, id]);

    useEffect(() => {
        if (dataFetching && Object.keys(dataFetching).length > 0) {
            setFormData({
                judul: dataFetching.judul,
                cover: dataFetching.cover,
                penulis: dataFetching.penulis,
                nim: dataFetching.nim,
                facultyName: dataFetching.faculty?.name || "",
                facultyId: String(dataFetching.faculty?.id || ""),
                studyProgramName: dataFetching.department?.name,
                studyProgramId: String(dataFetching.department?.id || ""),
                tahun_terbit: String(dataFetching.tahun_terbit || ""),
                jenis: dataFetching.jenis,
                no_urut: dataFetching.no_urut,
                kode_klasifikasi: dataFetching.kode_klasifikasi,
                tanggal_masuk: dataFetching.tanggal_masuk,
                kode_rak: dataFetching.kode_rak,
                denda_harian: String(dataFetching.denda_harian || ""),
                abstrak: dataFetching.abstrak,
            })
            setDocument(dataFetching.dokumen)
        }
    }, [dataFetching])

    useEffect(() => {
        refetch()
    }, [])

    const navigate = useNavigate();
    useEffect(() => {
        if(!isFetching && error) {
            navigate('/data-master/ta-&-skripsi');
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
            <BreadcrumbWithCustomSeparator icon={FaBook} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">{formData.judul}</h1>
                </div>
                <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                    <div className="col-span-1">
                        <div className="border border-primary rounded-md flex items center justify-center md:p-4 p-2 mb-2">
                            <img src={formData.cover || UserImage} alt="user-image" loading="lazy" className="w-full" />
                        </div>
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1">
                        <div className="border border-primary rounded-md md:px-6 md:py-4 px-2 py-2">
                            <div className="grid grid-cols-3">
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nama Penulis</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.penulis || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">NIM Penulis</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.nim || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Jenis Karya Tulis</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.jenis || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nomor Urut Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.no_urut || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Kode Klasifikasi Koleksi Perpustakaan</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.kode_klasifikasi || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Judul Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.judul || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Tahun Terbit</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.tahun_terbit || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Tanggal Masuk Perpustakaan</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.tanggal_masuk ? formatDateDMYIn(formData.tanggal_masuk) : "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Kode Rak Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.kode_rak || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Fakultas</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.facultyName || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Program Studi</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.studyProgramName || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Abstrak</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.abstrak || "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <hr className="border-0.5 border-primary" />
                </div>
                <div>
                    <div className="mt-2 w-full">
                        <div 
                            className="w-full bg-primary/20 border border-primary rounded-md font-semibold p-2 text-xs text-primary"
                        >
                            Dokumen Karya Tulis
                        </div>
                        <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 mt-2 gap-4">
                            {document.map((item, index) => (
                                <a href={item.file} target="__blank" key={index} className="md:h-40 h-24 flex flex-col items-center justify-center border border-dashed border-primary text-secondary rounded-md gap-2 font-semibold text-center relative">
                                    <BsFiletypePdf size={32} />
                                    <div className="text-xs">{item.title}</div>
                                </a>    
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}