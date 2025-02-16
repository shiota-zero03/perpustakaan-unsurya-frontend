import formatTitle from "@/utils/formatTitle";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, useDisclosure } from "@nextui-org/react";
import { BiBell, BiChevronDown, BiPowerOff, BiSearch } from "react-icons/bi";
import { BsCircleFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "@/assets/images/profile.png";
import { FaUserGear } from "react-icons/fa6";
import { useAuthLogout } from "@/services/auth";
import { useState } from "react";
import { errorToast, successToast } from "@/utils/toastMessage";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { AxiosError } from "axios";
import LogoutAlert from "../Modals/LogoutAlert";
import useTitle from "@/utils/hooks/useTitle";

const Header = ({ profile, openSidebar }: { profile: { name: string, email: string, picture: string | null}, openSidebar: boolean }) => {
    const { pathname } = useLocation();
    const nameOfPage = formatTitle(pathname)

    useTitle(
        nameOfPage !== "/" ? `Perpustakan Unsurya - ${nameOfPage}` : "Perpustakan Unsurya",
    );
    
    const [ sLoading, SetSLoading ] = useState<boolean>(false)

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { mutate: mutateLogout } = useAuthLogout();
    const navigate = useNavigate();

    const handleSubmit = () => {
        SetSLoading(true);

        try {
            mutateLogout
            (
                {},
                {
                    onSuccess: (res) => {
                        successToast({ text: res.message })
                        navigate('/auth')
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { data } = error.response;
                            const { message } = data;
                            errorToast({ text: message || "" });
                        } else {
                            errorToast({ text: error.message || "Terjadi kesalahan yang tidak terduga" });
                        }
                        
                        throw error;
                    },
                }
            )
        } catch (error) {
            console.error("Error during form submission:", error);
            isFinished()
            throw error;
        }
    }

    const isFinished = () => {
        SetSLoading(false);
        onClose();
    }

    return (
        <header className="fixed z-20 h-12 w-full bg-white">
            <LogoutAlert
                isOpen={isOpen} 
                isLoading={sLoading} 
                text={"Apakah anda yakin ingin keluar ?"} 
                onClose={onClose} 
                confirmAction={handleSubmit}                
            />
            <div className={`border-b-2 border-primary/50 h-12 ${!openSidebar ? 'md:w-[calc(100%-50px)]' : 'md:w-[calc(100%-250px)]'} w-[calc(100%-50px)] flex items-center sm:justify-between justify-end absolute right-0 duration-300 px-4`}>
                <div className="sm:block hidden text-primary font-bold">
                    { nameOfPage }
                </div>
                <div className="flex items-center gap-8">
                    <div className="h-8 sm:block hidden">
                        <Input
                            aria-label="search"
                            size="sm"
                            placeholder="Cari disini ..."
                            color="primary"
                            variant="underlined"
                            classNames={{
                                inputWrapper: 'border-primary italic',
                                input: 'italic text-primary'
                            }}
                            endContent={
                                <BiSearch className="text-primary" size={20} />
                            }
                        />
                    </div>
                    <div className="relative">
                        <BiBell size={24} className="text-primary" />
                        <BsCircleFill size={8} className="text-danger absolute top-0.5 right-1" />
                    </div>
                    <div>
                    <Dropdown radius="sm" shadow="sm" className="border border-primary">
                        <DropdownTrigger>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Avatar src={profile.picture || Profile} className="h-6 w-6" isBordered color="primary" alt="profile-picture" />
                                <span className="text-sm font-semibold text-primary sm:block hidden">{profile.name}</span>
                                <BiChevronDown />
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu 
                            aria-label="Menu Dropdown" 
                        >
                            <DropdownItem
                                aria-label="profile"
                                key={'profile'}
                                className={`text-secondary`}
                                startContent={
                                    <FaUserGear className="text-primary" size={20} />
                                }
                            >
                                <span className="font-semibold">Pengaturan Profil</span>
                            </DropdownItem>
                            <DropdownItem
                                aria-label="logout"
                                onPress={onOpen}
                                key={'logout'}
                                className={`bg-danger text-white`}
                                startContent={
                                    <BiPowerOff className="text-white" size={20} />
                                }
                            >
                                <span className="font-semibold">Logout</span>
                            </DropdownItem>
                        </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;