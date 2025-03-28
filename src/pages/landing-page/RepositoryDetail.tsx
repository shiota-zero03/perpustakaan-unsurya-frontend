import { FaChevronRight } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { KaryaTulisInterfaceErrorReq } from "@/interface/request/KaryaTulis.interface";
import { BsFiletypePdf } from "react-icons/bs";
import { errorToast } from "@/utils/toastMessage";
import { useGetDetailRepository } from "@/services/landing-page";
import { FaRegFrownOpen } from "react-icons/fa";

export default function RepositoryDetail(){

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

    const { data, isLoading, isFetching, refetch, error } = useGetDetailRepository(id || "")
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
            navigate('/repository');
            errorToast({ text: "Data tidak ditemukan" })
        }
    }, [isFetching])

    return (
        <main className="flex flex-col gap-4 pt-24">
            {isLoading || isFetching ? (
                <div className="inset-0 fixed bg-black/10 z-10 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-[6px] border-t-4 h-20 w-20 mb-4" />
                </div>
            ) : null}
            <div className="flex items-center gap-2 text-sm lg:px-8 px-4">
                <Link to={'/repository'} className="text-primary">Repository</Link>
                <FaChevronRight size={10} className="text-primary" />
                <Link to={'#'}>{formData.judul}</Link>
            </div>
            <hr />
            <div className="lg:px-8 px-4 flex flex-col gap-4 pb-4 min-h-[90vh]">
                <h1 className="text-primary font-semibold md:text-lg">{formData.judul}</h1>
                <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
                    <div className="lg:col-span-2 sm:col-span-2 col-span-1 flex flex-col gap-1 border border-primary rounded-md">
                        <div className=" md:px-6 md:py-4 px-2 py-2">
                            <div className="font-semibold text-primary uppercase">
                                Identitas Karya Tulis
                            </div>
                            <hr className="my-4" />
                            <div className="grid grid-cols-3">
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nama Penulis</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.penulis || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">NIM Penulis</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.nim || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Jenis Karya Tulis</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.jenis || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Tahun Terbit</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.tahun_terbit || "-"}</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1 border border-primary rounded-md">
                        <div className="rounded-md md:px-6 md:py-4 px-2 py-2">
                            <div className="font-semibold text-primary uppercase">
                                Abstrak
                            </div>
                            <hr className="my-4" />
                            <div className="text-sm text-justify text-secondary">
                                {formData.abstrak || "-"}
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
                            Dokumen Karya Tulis <sub>(Login untuk melihat dokumen)</sub>
                        </div>
                        <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 mt-2 gap-4">
                            {document.length > 0 ? document.map((item, index) => (
                                <div key={index} className="md:h-40 h-24 flex flex-col items-center justify-center border border-dashed border-primary text-secondary rounded-md gap-2 font-semibold text-center relative">
                                    <BsFiletypePdf size={32} />
                                    <div className="text-xs">{item.title}</div>
                                </div>    
                            )) : (
                                <div className="flex flex-col items-center text-primary lg:col-span-5 sm:col-span-3 col-span-2 py-8">
                                    <FaRegFrownOpen size={72} />
                                    <span className="italic mt-2 sm:text-lg">Tidak ada dokumen ditemukan</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}