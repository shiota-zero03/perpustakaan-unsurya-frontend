import AuthThankyou from "@/assets/images/auth-thank-you.png";
import Logo from "@/assets/images/logo.png";
import { ButtonBordered } from "@/components/UI/button";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpConfirmation () {

    const navigate = useNavigate()

    return (
        <div className="w-full">
            <div className="grid grid-cols-11">
                <div className="items-center justify-center md:h-[85vh] h-[90vh] lg:col-span-6 lg:flex hidden relative">
                <div className="absolute w-full flex items-center justify-between top-0 py-4 px-4">
                    <ButtonBordered className="text-white text-sm border-white font-bold h-10" content="Home" startContent={<BiSolidLeftArrowCircle className="text-white sm:text-xl text-base" />} onPress={() => navigate('/')} />
                </div>
                    <img src={AuthThankyou} alt="auth-thankyou" loading="lazy" className="w-80" />
                </div>
                <div className="lg:col-span-5 col-span-11 bg-white w-full md:h-[85vh] h-[90vh] flex items-center justify-center flex-col px-6 overflow-y-auto py-4 scrollbar-hide">
                    <div className="md:text-2xl text-xl text-center text-primary font-bold">
                        TERIMA KASIH ATAS<br />PENDAFTARAN ANDA
                    </div>
                    <img src={Logo} alt="logo-unsurya" loading="lazy" className="w-32 my-6" />
                    <div className="md:text-lg text-xs text-center text-primary font-medium leading-5 mb-6">
                        Langkah terakhir dalam pendaftaran anda adalah menunggu verifikasi admin, kami akan mengirimkan email jika admin sudah memverifikasi akun anda
                    </div>
                    <div className="bg-primary rounded-full p-2 mb-6 md:text-base text-xs">
                        <Link to={"/auth/sign-in"} className="py-1 px-6 font-bold text-white">Kembalik ke halaman masuk</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}