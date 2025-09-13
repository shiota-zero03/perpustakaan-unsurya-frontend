import { FaChevronRight, FaFilePdf } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import UserImage from "@/assets/images/buku.png";
import { errorToast } from "@/utils/toastMessage";
import { useGetDetailBuku } from "@/services/landing-page";
import { Divider } from "@nextui-org/react";

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
        desctiption: "",
        prodi: "",
        locations: "",
        language: "",
        physical_description: "",
        edition: "",
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
                desctiption: dataFetching.book_description || "",
                prodi: dataFetching.prodi?.name || "",
                locations: dataFetching.locations || "",
                language: dataFetching.language || "",
                physical_description: dataFetching.physical_description || "",
                edition: dataFetching.edition || "",
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
            <div className="lg:px-8 px-4 flex flex-col gap-4 pb-4 min-h-[90vh] w-full lg:max-w-7xl lg:mx-auto">
                <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-8">
                    <div className="col-span-1">
                        <div className="flex items center justify-center md:p-4 p-2 mb-2 bg-[#dae1e7] rounded-lg">
                            <img src={formData.cover || UserImage} alt="user-image" loading="lazy" className="w-full rounded-lg" />
                        </div>
                        {formData.link_book && (
                            <Link
                                to={formData.link_book}
                                target="__blakn"
                                className="w-full rounded font-semibold hidden items-center justify-center bg-primary text-white py-2 gap-4"
                            >
                                <FaFilePdf /> Unduh File PDF
                            </Link>
                        )}
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-2">
                        <div className="font-bold text-primary lg:text-2xl md:text-xl text-base">{formData.judul || "-"}</div>
                        <div className="font-semibold text-black lg:text-xl md:text-lg text-sm">- {formData.penulis || "-"}</div>
                        <Divider />
                        <div className={`text-gray-500 lg:text-lg md:text-base text-sm ${formData.desctiption ? "" : "italic"} sm:py-3 py-2`}>{formData.desctiption || "Tidak Tersedia Deskripsi"}</div>
                        <Divider />


                        <div className="font-bold text-primary lg:text-xl md:text-lg text-sm">Ketersediaan</div>
                        <div className="border flex sm:flex-row flex-col items-center justify-between rounded-md">
                            <div className={`font-medium lg:text-lg md:text-base text-sm ${formData.locations ? "" : "italic text-gray-500"} p-4`}>
                                {formData.locations ? `Lokasi : ${formData.locations}` : "Belum memasukkan lokasi"}
                            </div>
                            <div className="p-4 sm:border-s sm:border-t-0 border-t min-w-32">
                                <span className={`${formData.stok && Number(formData.stok) > 0 ? "bg-primary" : "bg-danger"} p-2 text-white rounded-lg`}>{formData.stok && Number(formData.stok) > 0 ? `Tersedia (${formData.stok} Exemplar)` : "Tidak Tersedia"}</span>
                            </div>
                        </div>


                        <div className="font-bold text-primary lg:text-xl md:text-lg text-sm">Informasi Detail</div>
                        <div className="flex items-start gap-2">
                            <h2 className="lg:text-lg md:text-base text-sm text-start font-bold sm:max-w-40 sm:min-w-40 max-w-32 min-w-32">Penerbit</h2>
                            <h2 className="lg:text-lg md:text-base text-sm text-start">{formData.penerbit || "-"}</h2>
                        </div>
                        <div className="flex items-start gap-2">
                            <h2 className="lg:text-lg md:text-base text-sm text-start font-bold sm:max-w-40 sm:min-w-40 max-w-32 min-w-32">Deksripsi Fisik</h2>
                            <h2 className="lg:text-lg md:text-base text-sm text-start">{formData.physical_description || "-"}</h2>
                        </div>
                        <div className="flex items-start gap-2">
                            <h2 className="lg:text-lg md:text-base text-sm text-start font-bold sm:max-w-40 sm:min-w-40 max-w-32 min-w-32">Bahasa</h2>
                            <h2 className="lg:text-lg md:text-base text-sm text-start">{formData.language || "-"}</h2>
                        </div>
                        <div className="flex items-start gap-2">
                            <h2 className="lg:text-lg md:text-base text-sm text-start font-bold sm:max-w-40 sm:min-w-40 max-w-32 min-w-32">ISBN/ISSN</h2>
                            <h2 className="lg:text-lg md:text-base text-sm text-start">{formData.isbn || "-"}</h2>
                        </div>
                        <div className="flex items-start gap-2">
                            <h2 className="lg:text-lg md:text-base text-sm text-start font-bold sm:max-w-40 sm:min-w-40 max-w-32 min-w-32">Klasifikasi</h2>
                            <h2 className="lg:text-lg md:text-base text-sm text-start">{formData.kode_klasifikasi || "-"}</h2>
                        </div>
                        <div className="flex items-start gap-2">
                            <h2 className="lg:text-lg md:text-base text-sm text-start font-bold sm:max-w-40 sm:min-w-40 max-w-32 min-w-32">Edisi</h2>
                            <h2 className="lg:text-lg md:text-base text-sm text-start">{formData.edition || "-"}</h2>
                        </div>
                        <div className="flex items-start gap-2">
                            <h2 className="lg:text-lg md:text-base text-sm text-start font-bold sm:max-w-40 sm:min-w-40 max-w-32 min-w-32">Tahun Terbit</h2>
                            <h2 className="lg:text-lg md:text-base text-sm text-start">{formData.tahun_terbit || "-"}</h2>
                        </div>
                        <div className="flex items-start gap-2">
                            <h2 className="lg:text-lg md:text-base text-sm text-start font-bold sm:max-w-40 sm:min-w-40 max-w-32 min-w-32">Kode Rak Buku</h2>
                            <h2 className="lg:text-lg md:text-base text-sm text-start">{formData.kode_rak || "-"}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}