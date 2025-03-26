import { BannerRes } from "@/interface/response/LandingPage.interface";
import Slider from "react-slick";
import Banner1 from "@/assets/images/banner-1.jpg";
import Banner2 from "@/assets/images/banner-2.jpg";
import Banner3 from "@/assets/images/auth-background.jpg";
import { Link } from "react-router-dom";
import { BsArrowRightCircle } from "react-icons/bs";

export default function HomeBanner() {
    const settings = {
        dots: false,
        fade: true,
        infinite: true,
        autoplay: true,
        speed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 10000,
        waitForAnimate: false,
        arrows: false
    };

    const dataBanner: BannerRes[] = [
        {
            picture: Banner1,
            title: "Aplikasi Perpustakaan Universitas Suryadarma",
            subtitle: null,
        },
        {
            picture: Banner2,
            title: "Akses E-Journal Universitas",
            subtitle: "Sistem menyediakan akses buku dan karya tulis",
        },
        {
            picture: Banner3,
            title: "Aplikasi Perpustakaan Universitas Suryadarma",
            subtitle: null,
        }
    ];
    return (
        <div className="w-full">
            <Slider {...settings}>
                {dataBanner.map((item, index) => (
                    <div className="bg-primary relative w-full h-screen" key={index}>
                        <img src={item.picture} alt={item.title || `gambar-slider ${index}`} className="object-cover object-center min-h-screen min-w-full" />
                        <div className="bg-black/60 inset-0 absolute"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-4xl font-semibold text-white">{item.title}</h1>
                                <p className="text-white mb-3">{item.subtitle}</p>
                                <Link to={"/repository"} className="mx-auto max-w-48 text-white border border-white p-1 flex items-center justify-center gap-4 rounded-md hover:bg-white/20 duration-300">Baca Selengkapnya <BsArrowRightCircle /></Link>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}