import { Outlet } from "react-router-dom";
import { BiSolidChevronLeftCircle } from "react-icons/bi";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { useGetProfile } from "@/services/profile";
import store from "@/redux/store";

const MainLayout = () => {

    const { role } = store.getState().auth;

    const [ openSidebar, setOpenSidebar ] = useState<boolean>(true)

    const toggleSidebar = () => {
        setOpenSidebar(!openSidebar)
    }

    const [ dataLayoutProfile, setDataLayoutProfile ] = useState<{name: string, email: string, picture: string | null}>({
        name: 'Anonymous',
        email: 'anonymous@mail.com',
        picture: null
    })

    const { data: dataProfile, isLoading: isLoadingProfile, refetch: refetchProfile } = useGetProfile();
    useMemo(() => {
        if(dataProfile && dataProfile.data) {
            setDataLayoutProfile({
                name: dataProfile.data.name,
                email: dataProfile.data.email,
                picture: role === "Admin" ? (dataProfile.data.admin?.profilePicture || null) : (
                    role === "Teacher" ? (dataProfile.data.teacher?.profilePicture || null) : (
                        dataProfile.data.student?.profilePicture || null
                    )
                )
            })
        }
    }, [dataProfile, isLoadingProfile, refetchProfile])

    useEffect(() => {
        refetchProfile();
    }, [dataProfile, refetchProfile])
    
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