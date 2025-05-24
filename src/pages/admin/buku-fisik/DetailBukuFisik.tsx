import { FaBook, FaPrint } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import UserImage from "@/assets/images/buku.png";
import { formatDateDMYIn } from "@/utils/dateFormat";
import { useGetDetailBukuFisik } from "@/services/buku-fisik";
import { BukuFisikInterfaceReq } from "@/interface/request/BukuFisik.interface";
import { errorToast } from "@/utils/toastMessage";

export default function DetailBukuFisik(){

    const { id } = useParams();

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
        book_description: null,
        prodi: null,
    })

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch, error } = useGetDetailBukuFisik(id || "")
    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data, id]);

    useEffect(() => {
        if (dataFetching && Object.keys(dataFetching).length > 0) {
            setFormData({
                ...formData,
                no_urut: dataFetching.no_urut,
                kode_klasifikasi: dataFetching.kode_klasifikasi,
                judul: dataFetching.judul,
                penulis: dataFetching.penulis,
                penerbit: dataFetching.penerbit,
                tahun_terbit: dataFetching.tahun_terbit,
                isbn: dataFetching.isbn,
                tanggal_masuk: dataFetching.tanggal_masuk,
                kode_rak: dataFetching.kode_rak,
                stok: dataFetching.stok,
                denda_harian: dataFetching.denda_harian,
                book_description: dataFetching.book_description,
                prodi: dataFetching.prodi?.name ?? "-",
            })
            setPreviewImage(dataFetching.cover)
        }
    }, [dataFetching])

    useEffect(() => {
        refetch()
    }, [id])


    const navigate = useNavigate();
    useEffect(() => {
        if(!isFetching && error) {
            navigate('/data-master/buku-fisik');
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
                            <img src={previewImage || UserImage} alt="user-image" loading="lazy" className="w-full" />
                        </div>
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1">
                        <div className="border border-primary rounded-md md:px-6 md:py-4 px-2 py-2 mb-2">
                            <div className="grid grid-cols-3">
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Kode Klasifikasi Koleksi Perpustakaan</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.kode_klasifikasi || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Judul Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.judul || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nama Pengarang</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.penulis || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Penerbit</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.penerbit || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Tahun Terbit</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.tahun_terbit || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Program Studi</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.prodi || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">ISBN</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.isbn || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Tanggal Masuk Perpustakaan</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.tanggal_masuk ? formatDateDMYIn(formData.tanggal_masuk) : "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Kode Rak Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.kode_rak || "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Jumlah Eksemplar</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.stok ? formData.stok.toLocaleString('id-ID') : "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Denda / Hari</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>Rp {formData.denda_harian ? formData.denda_harian.toLocaleString('id-ID') : "-"}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Deskripsi Buku</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.book_description || "-"}</div>
                            </div>
                        </div>
                        <Link to={`/data-master/buku-fisik/barcode/${id}`} className="border-[0.8px] border-primary text-secondary font-semibold w-full flex gap-2 items-center justify-center py-2 rounded-md" target="__blank">
                            <FaPrint /> Cetak QR Code
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}