import { FaBook } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import UserImage from "@/assets/images/buku.png";
import { useGetDetailBukuDigital } from "@/services/buku-digital";
import { BukuDigitalInterfaceErrorReq } from "@/interface/request/BukuDigital.interface";
import { errorToast } from "@/utils/toastMessage";

export default function DetailBukuDigital(){

    const { id } = useParams();

    const [ formData, setFormData ] = useState<BukuDigitalInterfaceErrorReq>({
        cover: null,
        judul: null,
        penulis: null,
        penerbit: null,
        tahun_terbit: null,
        isbn: null,
        link_book: null,
    })

    const { data, isLoading, isFetching, refetch, error } = useGetDetailBukuDigital(id || "")
    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data, id]);

    useEffect(() => {
        if (dataFetching && Object.keys(dataFetching).length > 0) {
            setFormData({
                ...formData,
                cover: dataFetching.cover,
                judul: dataFetching.judul,
                penulis: dataFetching.penulis,
                penerbit: dataFetching.penerbit,
                tahun_terbit: String(dataFetching.tahun_terbit),
                isbn: dataFetching.isbn,
                link_book: dataFetching.link_book,
            })
        }
    }, [dataFetching])

    useEffect(() => {
        refetch();
    }, [])

    const navigate = useNavigate();

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
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Judul Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.judul || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nama Pengarang</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.penulis || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Penerbit</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.penerbit || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Tahun Terbit</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.tahun_terbit || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">ISBN</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.isbn || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">URL Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.link_book || "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}