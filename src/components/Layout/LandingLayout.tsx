import { Link, Outlet, useNavigate } from "react-router-dom";
import Logo from "@/assets/images/logo.png";
import { FaCaretDown, FaRightToBracket, FaBars, FaX } from "react-icons/fa6";
import { useState, useEffect } from "react";

export default function LandingLayout() {
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 50);
            setOpenMenu(null);
        };

        document.addEventListener("scroll", handleScroll);
        return () => document.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest(".menu-container")) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const toggleMenu = (index: number, link: string) => {
        setOpenMenu(openMenu === index ? null : index);
        if (index !== 3) navigate(link);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const menu = [
        { name: "Profil", link: "/profil-perpustakaan" },
        { name: "Petunjuk", link: "/petunjuk" },
        { name: "Prosedur", link: "/prosedur" },
        {
            name: "Layanan",
            link: "#",
            subMenu: [
                { name: "Repository", link: "/repository" },
                { name: "Katalog Buku", link: "/katalog-buku" },
            ],
        },
        { name: "Berita dan Informasi", link: "/berita-informasi" },
        { name: "Login", link: "/auth" },
    ];

    return (
        <>
            {/* Navbar */}
            <div className={`fixed w-full flex items-center justify-between py-2 px-8 z-50 transition-all duration-300 ${scrolling ? "bg-white shadow-md" : "bg-white/40 backdrop-blur-md border-b"}`}>
                <Link to={"/"}>
                    <div className="flex items-center gap-2">
                        <img src={Logo} alt="logo" className="w-12" />
                        <div className="flex flex-col">
                            <span className="text-primary font-bold text-sm">Perpustakaan</span>
                            <div className="text-[10px] text-primary italic ms-2 leading-[11px]">
                                Universitas Dirgantara<br />
                                <span className="ms-2">Marsekal Suryadarma</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-4 menu-container">
                    {menu.map((item, index) => (
                        <div key={index} className="relative">
                            <Link
                                to={item.link}
                                onClick={() => toggleMenu(index, item.link)}
                                className="px-4 text-secondary hover:text-primary/60 text-sm font-semibold flex items-center gap-2 duration-300"
                            >
                                {item.name === "Login" && <FaRightToBracket />}
                                {item.name}
                                {item.subMenu && <FaCaretDown className={`${openMenu === index ? 'rotate-180' : 'rotate-0'} duration-300 text-xs`} />}
                            </Link>

                            {item.subMenu && openMenu === index && (
                                <div className="absolute left-0 mt-2 bg-white border shadow-md rounded-md w-48 z-10">
                                    {item.subMenu.map((itemSub, indexSub) => (
                                        <Link
                                            key={indexSub}
                                            to={itemSub.link}
                                            className="block px-4 py-2 text-sm text-secondary hover:text-primary duration-300 hover:bg-primary/10"
                                        >
                                            {itemSub.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button className="lg:hidden text-secondary" onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? <FaX size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed top-16 left-0 w-full bg-white border-b shadow-md py-4 z-50">
                    <div className="flex flex-col items-start gap-2 px-4">
                        {menu.map((item, index) => (
                            <div key={index} className="w-full">
                                <button
                                    onClick={() => toggleMenu(index, item.link)}
                                    className="w-full text-left px-4 py-2 text-secondary text-sm font-semibold flex items-center gap-2"
                                >
                                    {item.name === "Login" && <FaRightToBracket />}
                                    {item.name}
                                    {item.subMenu && <FaCaretDown className={`${openMenu === index ? 'rotate-180' : 'rotate-0'} duration-300 text-xs`} />}
                                </button>

                                {item.subMenu && openMenu === index && (
                                    <div className="bg-white border rounded-md">
                                        {item.subMenu.map((itemSub, indexSub) => (
                                            <Link
                                                key={indexSub}
                                                to={itemSub.link}
                                                className="block px-6 py-2 text-sm text-secondary font-normal"
                                            >
                                                {itemSub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Outlet />

            <footer>
                <div className="bg-secondary text-white text-center font-medium py-2">
                    Perpustakaan UNSURYA &copy; {new Date().getFullYear()}. All rights reserved.
                </div>
            </footer>
        </>
    );
}
