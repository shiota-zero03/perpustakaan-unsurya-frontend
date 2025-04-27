import HomeBanner from "@/components/Banner/HomeBanner";
import { FaBook, FaGavel, FaUniversity } from "react-icons/fa";
import { Link } from "react-router-dom";
import Repository from "@/assets/images/repository.jpg";
import Catalog from "@/assets/images/catalog.jpg";
import { BiRightArrowCircle } from "react-icons/bi";
import { FaRegFrownOpen } from "react-icons/fa";
import { useGetNews } from "@/services/landing-page";
import { useEffect, useMemo } from "react";
import { Spinner } from "@nextui-org/react";

export default function Home(){

    const threePointFirst: { title: string; icon: JSX.Element; subtitle: string, link: string; }[] = [
        { 
            title: 'Prosedur Peminjaman', 
            icon: <FaBook />, 
            subtitle: 'Panduan lengkap untuk meminjam buku dengan mudah.',
            link: "/prosedur"
        },
        { 
            title: 'Aturan Perpustakaan', 
            icon: <FaGavel />, 
            subtitle: 'Ketahui peraturan dan kebijakan perpustakaan.',
            link: "/petunjuk"
        },
        { 
            title: 'Profil Perpustakaan', 
            icon: <FaUniversity />, 
            subtitle: 'Informasi tentang sejarah dan visi perpustakaan.',
            link: "/profil-perpustakaan"
        },
    ];

    const twoPointSecond: { title: string; image: string; link: string; }[] = [
        { 
            title: 'Katalog Buku', 
            image: Catalog,
            link: '/katalog-buku'
        },
        { 
            title: 'Skripsi, Penelitian, Tesis', 
            image:Repository,
            link: '/repository'
        },
    ];

    const { data, isFetching, refetch } = useGetNews(6, 1, null, null);
    const FETCHING_DATA = useMemo(() => {
        return data ? data.data.data : []
    }, [data]);

    useEffect(() => {
        refetch();
    }, [])

    return (
        <div className="bg-[#e0e0e0]">
            <HomeBanner />
            <div className="text-center lg:py-20 py-10 xl:px-52 lg:px-36 md:px-28 sm:px-16 px-8 xl:text-xl lg:text-lg sm:text-base text-sm">
                <q className="text-primary font-medium">
                    &nbsp;Perpustakaan adalah tempat di mana masa lalu, masa kini, dan masa depan bertemu dalam satu ruang. Di sinilah kisah-kisah terdahulu mengajarkan kita kebijaksanaan, penelitian masa kini membuka wawasan, dan impian masa depan mulai dirangkai&nbsp;
                </q>
            </div>
            <div className="grid sm:grid-cols-3 grid-cols-1 xl:px-52 lg:px-36 md:px-28 sm:px-16 px-8 lg:py-20 py-10 bg-white gap-4">
                {threePointFirst.map((item, index) => (
                    <div key={index} className="text-center border shadow-sm rounded-lg p-4 relative flex flex-col">
                        <div className="absolute -top-4 bg-primary/20 p-2 rounded-full shadow-md left-[50%] -translate-x-[50%]">
                            {item.icon}
                        </div>
                        <div className="mt-2">
                            <h1 className="font-semibold">{item.title}</h1>
                            <p className="text-sm leading-4 italic mb-2">{item.subtitle}</p>

                            <Link to={item.link} className="text-sm font-medium text-primary hover:text-secondary hover:underline duration-200">Selengkapnya ...</Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid xl:grid-cols-4 grid-cols-1 xl:px-40 lg:px-36 md:px-28 sm:px-16 px-4 lg:py-20 py-10 gap-7 items-center">
                <div className="xl:col-span-2 col-span-1 lg:text-left text-center xl:pe-4">
                    <h1 className="lg:text-3xl text-2xl font-semibold text-secondary">Informasi Layanan Pustaka</h1>
                    <p className="lg:text-sm text-xs italic mt-2">Perpustakaan Universitas Dirgantara Marsekal Suryadarma menyediakan layanan peminjaman buku, akses jurnal, ruang baca, dan bimbingan referensi untuk mendukung kebutuhan akademik Anda.</p>
                </div>
                <div className="xl:col-span-2 col-span-1 grid grid-cols-2 gap-2">
                    {twoPointSecond.map((item, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden pt-2 bg-gradient-to-r from-primary via-danger to-black sm:h-48 h-32 group">
                            <img src={item.image} alt={item.title} className="min-h-full" />
                            <div className="inset-0 absolute group-hover:bg-black/20 duration-300"></div>
                            <div className="absolute -bottom-24 group-hover:bottom-0 duration-300 bg-black/40 w-full text-white p-4 font-medium md:text-base text-sm">
                                <Link className="hover:text-blue-200 hover:underline duration-200" to={item.link}>{item.title}</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gradient-to-b from-primary via-white to-white lg:py-20 py-10">
                <h1 className="text-center font-semibold lg:text-4xl text-2xl text-white">Berita Terbaru</h1>
                <hr className="lg:w-72 w-40 mx-auto my-4" />
                <div className="relative my-8 xl:px-40 lg:px-36 md:px-28 sm:px-16 px-4 w-full overflow-hidden">
                    {isFetching && (
                        <div className="w-full flex items-center justify-center scale-150 absolute bg-slate-50/20 inset-0 py-8">
                            <Spinner />
                        </div>
                    )}
                    {FETCHING_DATA.length > 0 ? (
                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-between gap-4">
                            {FETCHING_DATA.map((item, index) => (
                                <div className="flex flex-col items-center text-primary h-[250px] w-full overflow-hidden relative rounded-md" key={index}>
                                    <img src={item.picture} alt="thumbnail" className="" />
                                    <div className="absolute bottom-0 bg-black/40 backdrop-blur-lg w-full p-4 text-white text-sm font-medium">
                                        {item.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="my-8">
                            <div className="flex flex-col items-center text-primary">
                                <FaRegFrownOpen size={72} />
                                <span className="italic mt-2 sm:text-lg">Tidak ada berita ditemukan</span>
                            </div>
                        </div>
                    )}
                </div>
                <Link to="/berita-informasi" className="mx-auto font-medium border border-primary rounded-md md:p-2 p-1 text-primary hover:bg-primary hover:text-white duration-300 flex items-center gap-3 max-w-48 justify-center md:text-sm text-xs">Lihat Selengkapnya <BiRightArrowCircle size={24} /></Link>
            </div>
        </div>
    )
}