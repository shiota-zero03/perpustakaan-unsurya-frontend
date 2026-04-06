import { Outlet } from "react-router-dom";
import { BiSolidChevronLeftCircle } from "react-icons/bi";
import { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import store from "@/redux/store";

const MainLayout = () => {

    const { user } = store.getState().auth;

    const [ openSidebar, setOpenSidebar ] = useState<boolean>(true)

    const toggleSidebar = () => {
        setOpenSidebar(!openSidebar)
    }

    const dataLayoutProfile: {name: string, email: string, picture: string | null, jeniskelamin: string | null} = {
        name: user?.nama ?? 'Anonymous',
        email: user?.user_id ?? 'anonymous@mail.com',
        jeniskelamin: user?.jeniskelamin ?? null,
        picture: null
    }

    return (
        <section className="bg-[#F5F5F5] w-full min-h-screen">
            <div className={`fixed ${!openSidebar ? 'left-[38px]' : 'left-[238px]'} top-8 bg-white rounded-full cursor-pointer duration-300 z-30`} onClick={toggleSidebar}>
                <BiSolidChevronLeftCircle className={`text-secondary ${!openSidebar ? 'rotate-180' : 'rotate-0'} duration-300`} size={28} />
            </div>
            <Header profile={dataLayoutProfile} openSidebar={openSidebar} />

            <Sidebar profile={dataLayoutProfile} openSidebar={openSidebar} />
            <div className={`${!openSidebar ? 'lg:w-[calc(100%-72px)]' : 'lg:w-[calc(100%-272px)]'} w-[calc(100%-72px)] ms-auto me-[12px] duration-300 pt-12 text-justify overflow-hidden`}>
                <div className="sm:p-8 p-2">
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default MainLayout;