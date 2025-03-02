import AuthWelcome from "@/assets/images/auth-welcome.png";
import Logo from "@/assets/images/logo.png";
import { ButtonBordered } from "@/components/UI/button";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export default function Auth () {

    const navigate = useNavigate()

    return (
        <div className="w-full">
            <div className="grid grid-cols-11">
                <div className="items-center justify-center md:h-[85vh] h-[90vh] lg:col-span-6 lg:flex hidden relative">
                <div className="absolute w-full flex items-center justify-between top-0 py-4 px-4">
                    <ButtonBordered className="text-white text-sm border-white font-bold h-10" content="Home" startContent={<BiSolidLeftArrowCircle className="text-white sm:text-xl text-base" />} onPress={() => navigate('/')} />
                </div>
                    <img src={AuthWelcome} alt="auth-welcome" loading="lazy" className="w-80" />
                </div>
                <div className="lg:col-span-5 col-span-11 bg-white w-full md:h-[85vh] h-[90vh] flex items-center justify-center flex-col px-4 overflow-y-auto py-4 scrollbar-hide">
                    <img src={Logo} alt="logo-unsurya" loading="lazy" className="w-32 mb-10" />
                    <div className="text-xl text-center text-primary font-bold mb-2">
                        SELAMAT DATANG DI<br />SISTEM INFORMASI PERPUSTAKAAN
                    </div>
                    <div className="text-3xl text-center text-primary font-extrabold mb-8">
                        UNSURYA
                    </div>
                    <div className="bg-primary rounded-full p-2 mb-6">
                        {/* <Link to={"/auth/sign-up"} className="py-1 px-6 font-bold text-white">Daftar</Link> */}
                        {/* <Link to={"/auth/sign-in"} className="bg-white py-1 px-6 rounded-full font-bold text-primary">Masuk</Link> */}
                        <Link to={"/auth/sign-in"} className=" py-1 px-12 rounded-full font-bold text-white">Masuk</Link>
                    </div>
                    <div>
                        <Link to={"/visitor"} className="text-primary flex items-center gap-2 font-medium sm:text-sm text-xs">Ke halaman pengunjung dan cari buku <BsArrowRight /></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}