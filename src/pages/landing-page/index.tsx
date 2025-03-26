import HomeBanner from "@/components/Banner/HomeBanner";
import { FaBook, FaGavel, FaUniversity } from "react-icons/fa";
import { Link } from "react-router-dom";
import Repository from "@/assets/images/repository.jpg";
import Catalog from "@/assets/images/catalog.jpg";


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

    const threePointSecond: { title: string; icon: JSX.Element; subtitle: string, link: string; }[] = [
        { 
            title: 'Katalog Buku', 
            image: Catalog
        },
        { 
            title: 'Skripsi, Penelitian, Tesis, Disertasi', 
            image:Repository
        },
    ];

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
            <div className="grid md:grid-cols-5 grid-cols-1 xl:px-40 lg:px-36 md:px-28 sm:px-16 px-8 lg:py-20 py-10">
                <div className="md:col-span-2 col-span-1 md:text-left text-center">
                    <h1 className="text-3xl font-semibold text-secondary">Informasi Layanan Pustaka Untuk Anda</h1>
                    <p className="text-base italic mt-2">Layanan yang disediakan oleh Perpustakaan Universitas Dirgantara Marsekal Suryadarma adalah</p>
                </div>
                <div className="md:col-span-2 col-span-1"></div>
            </div>
            <div className="bg-gradient-to-b from-primary to-white lg:py-20 py-10">
                <h1 className="text-center font-semibold text-4xl">Berita Terbaru</h1>
                <hr className="w-72 mx-auto my-4" />
                <Link to="/berita-informasi">Lihat Selengkapnya</Link>
            </div>
        </div>
    )
}