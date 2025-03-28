import Logo from "@/assets/images/logo.png";
import Profile from "@/assets/images/profile.png";
import { AdminSidebar, StudentSidebar } from "@/constants/SidebarMenu";
import store from "@/redux/store";
import { useRef } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ profile, openSidebar }: {profile: { name: string, email: string, picture: string | null}, openSidebar: boolean}) => {

    const { pathname } = useLocation();

    const activeSubMenuRef = useRef<string>(pathname.split("/")[1] || "");

    const name = profile.name;
    const email = profile.email;

    const handleSubMenuClick = (menuName: string) => {
        if(activeSubMenuRef.current === menuName) {
            activeSubMenuRef.current = "";    
        } else {
            activeSubMenuRef.current = menuName;
        }
    };

    const { auth } = store.getState();

    return (
        <section className={`${!openSidebar ? 'w-[50px]' : 'w-[250px]'} fixed bg-primary h-screen overflow-hidden z-20 duration-300`}>
            <div className="relative">
                <div className="h-12 flex items-center justify-evenly">
                    <img src={Logo} alt="logo-unsurya" loading="lazy" className="h-8" />
                    <div className={`text-white font-bold text-2xl ${openSidebar ? 'block animate-appearance-in' : 'hidden animate-appearance-out'} duration-300 animate-appearance-in`}>
                        UNSURYA
                    </div>
                </div>
            </div>
            <div className="overflow-smooth-white overflow-y-auto h-[calc(100vh-60px)] mt-[12px] text-white">
                <div className={`w-full flex items-center justify-center flex-col gap-2 ${openSidebar ? 'block animate-appearance-in' : 'hidden animate-appearance-out'} duration-300`}>
                    <img src={profile.picture || Profile} alt="profile-user" className="w-16 h-auto object-cover object-center rounded-md" />
                    <div className="text-center">
                        <div className="text-lg font-bold">{name}</div>
                        <div className="text-sm -mt-1"><em>{email}</em></div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-center mt-4 w-full">
                    {auth.role !== "Teacher" && auth.role !== "Student" ? 
                        AdminSidebar.map(item => (
                            <div key={item.name} className="w-full">
                                <Link 
                                    onClick={() => handleSubMenuClick(item.name)}
                                    to={item.link} 
                                    className={`flex items-center mx-auto w-[90%] hover:bg-secondary p-2 
                                        ${openSidebar ? 'rounded-lg px-3' : 'rounded-sm justify-center'} 
                                        ${pathname && pathname.includes(item.name) ? 'bg-secondary' : 'bg-transparent'}
                                    duration-300 gap-2 group`}
                                >
                                    <item.icon size={20} />
                                    <span className={`font-semibold text-sm ${openSidebar ? 'block animate-appearance-in' : 'hidden animate-appearance-out'} duration-300 group-hover:text-base`}>{item.text}</span>
                                    {item.subMenu ? (
                                        <FaChevronDown 
                                            size={10} 
                                            className={`ms-auto
                                                ${openSidebar ? 'block' : 'hidden animate-appearance-out'} 
                                                ${
                                                    activeSubMenuRef.current === item.name
                                                    ? 'rotate-180'
                                                    : 'rotate-0'
                                                } 
                                            duration-500`} />
                                    ) : null}
                                </Link>
                                {item.subMenu ? (
                                    <div 
                                        id={item.name} 
                                        className={`w-[90%] mx-auto flex flex-col gap-1 mt-1 overflow-hidden transition-[max-height] ease-in-out duration-500 
                                            ${openSidebar ? 'block animate-appearance-in' : 'hidden animate-appearance-out'} 
                                            ${
                                                activeSubMenuRef.current === item.name
                                                ? 'max-h-[500px]'
                                                : 'max-h-0'
                                            }
                                        `}>
                                        { item.subMenu.map(subItem => (
                                            <Link 
                                                key={subItem.name} 
                                                to={subItem.link} 
                                                className={`flex items-center hover:bg-secondary p-2 
                                                    ${openSidebar ? 'rounded-lg px-3' : 'rounded-sm justify-center'} 
                                                    ${pathname && pathname.includes(subItem.name) ? 'bg-secondary' : 'bg-transparent'} 
                                                duration-300 gap-2 group`}>
                                                <span className={`ps-7 font-semibold text-sm duration-300 group-hover:text-base`}>{subItem.text}</span>
                                            </Link>
                                        )) }
                                    </div>
                                ) : null}
                            </div>
                        )) : StudentSidebar.map(item => (
                            <div key={item.name} className="w-full">
                                <Link 
                                    onClick={() => handleSubMenuClick(item.name)}
                                    to={item.link} 
                                    className={`flex items-center mx-auto w-[90%] hover:bg-secondary p-2 
                                        ${openSidebar ? 'rounded-lg px-3' : 'rounded-sm justify-center'} 
                                        ${pathname && pathname.includes(item.name) ? 'bg-secondary' : 'bg-transparent'}
                                    duration-300 gap-2 group`}
                                >
                                    <item.icon size={20} />
                                    <span className={`font-semibold text-sm ${openSidebar ? 'block animate-appearance-in' : 'hidden animate-appearance-out'} duration-300 group-hover:text-base`}>{item.text}</span>
                                    {item.subMenu ? (
                                        <FaChevronDown 
                                            size={10} 
                                            className={`ms-auto
                                                ${openSidebar ? 'block' : 'hidden animate-appearance-out'} 
                                                ${
                                                    activeSubMenuRef.current === item.name
                                                    ? 'rotate-180'
                                                    : 'rotate-0'
                                                } 
                                            duration-500`} />
                                    ) : null}
                                </Link>
                                {item.subMenu ? (
                                    <div 
                                        id={item.name} 
                                        className={`w-[90%] mx-auto flex flex-col gap-1 mt-1 overflow-hidden transition-[max-height] ease-in-out duration-500 
                                            ${openSidebar ? 'block animate-appearance-in' : 'hidden animate-appearance-out'} 
                                            ${
                                                activeSubMenuRef.current === item.name
                                                ? 'max-h-[500px]'
                                                : 'max-h-0'
                                            }
                                        `}>
                                        { item.subMenu.map(subItem => (
                                            <Link 
                                                key={subItem.name} 
                                                to={subItem.link} 
                                                className={`flex items-center hover:bg-secondary p-2 
                                                    ${openSidebar ? 'rounded-lg px-3' : 'rounded-sm justify-center'} 
                                                    ${pathname && pathname.includes(subItem.name) ? 'bg-secondary' : 'bg-transparent'} 
                                                duration-300 gap-2 group`}>
                                                <span className={`ps-7 font-semibold text-sm duration-300 group-hover:text-base`}>{subItem.text}</span>
                                            </Link>
                                        )) }
                                    </div>
                                ) : null}
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Sidebar;