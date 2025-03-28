import { FaChevronRight, FaFilePdf } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import UserImage from "@/assets/images/buku.png";
import { errorToast } from "@/utils/toastMessage";
import { useGetDetailBuku } from "@/services/landing-page";

export default function DetailBuku(){

    const { id } = useParams();

    const [ formData, setFormData ] = useState({
        cover: "",
        judul: "",
        penulis: "",
        penerbit: "",
        tahun_terbit: "",
        isbn: "",
        link_book: "",
        no_urut: "",
        kode_klasifikasi: "",
        tanggal_masuk: "",
        kode_rak: "",
        stok: "",
        denda_harian: "",
    })

    const { data, isLoading, isFetching, refetch, error } = useGetDetailBuku(id || "")
    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data, id]);

    useEffect(() => {
        if (dataFetching && Object.keys(dataFetching).length > 0) {
            setFormData({
                ...formData,
                cover: dataFetching.cover || "",
                judul: dataFetching.judul || "",
                penulis: dataFetching.penulis || "",
                penerbit: dataFetching.penerbit || "",
                tahun_terbit: dataFetching.tahun_terbit ? String(dataFetching.tahun_terbit) : "",
                isbn: dataFetching.isbn || "",
                link_book: dataFetching.link_book || "",
                no_urut: dataFetching.no_urut || "",
                kode_klasifikasi: dataFetching.kode_klasifikasi || "",
                tanggal_masuk: dataFetching.tanggal_masuk || "",
                kode_rak: dataFetching.kode_rak || "",
                stok: dataFetching.stok ? String(dataFetching.stok) : "",
                denda_harian: dataFetching.denda_harian ? String(dataFetching.denda_harian) : "",
            })
        }
    }, [dataFetching])

    useEffect(() => {
        refetch();
    }, [])

    const navigate = useNavigate();

    useEffect(() => {
        if(!isFetching && error) {
            navigate('/katalog-buku');
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
                <Link to={'/katalog-buku'} className="text-primary">Katalog Buku</Link>
                <FaChevronRight size={10} className="text-primary" />
                <Link to={'#'}>{formData.judul}</Link>
            </div>
            <hr />
            <div className="lg:px-8 px-4 flex flex-col gap-4 pb-4 min-h-[90vh]">
                <h1 className="text-primary font-semibold md:text-lg">{formData.judul}</h1>
                <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                    <div className="col-span-1 border border-primary rounded-md">
                        <div className="flex items center justify-center md:p-4 p-2 mb-2">
                            <img src={formData.cover || UserImage} alt="user-image" loading="lazy" className="w-full" />
                        </div>
                        {formData.link_book && (
                            <Link
                                to={formData.link_book}
                                target="__blakn"
                                className="w-full rounded font-semibold flex items-center justify-center bg-primary text-white py-2 gap-4"
                            >
                                <FaFilePdf /> Unduh File PDF
                            </Link>
                        )}
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1 border border-primary rounded-md">
                        <div className="md:px-6 md:py-4 px-2 py-2">
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
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nomor Urut Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.no_urut || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Kode Klasifikasi Koleksi Perpustakaan</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.kode_klasifikasi || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Kode Rak Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.kode_rak || "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}