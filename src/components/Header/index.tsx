import formatTitle from "@/utils/formatTitle";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import { BiChevronDown, BiPowerOff } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "@/assets/images/profile.png";
// import { useAuthLogout } from "@/services/auth";
import { useState } from "react";
import { successToast } from "@/utils/toastMessage";
// import { BaseErrorRes } from "@/interface/response/base.interface";
// import { AxiosError } from "axios";
import LogoutAlert from "../Modals/LogoutAlert";
import useTitle from "@/utils/hooks/useTitle";
import { useDispatch } from "react-redux";
import { clearAuthTokens } from "@/redux/slices/auth.slice";
import { FaUserCog } from "react-icons/fa";

const Header = ({ profile, openSidebar }: { profile: { name: string, email: string, picture: string | null}, openSidebar: boolean }) => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const nameOfPage = formatTitle(pathname)

    useTitle(
        nameOfPage !== "/" ? `Perpustakan Unsurya - ${nameOfPage}` : "Perpustakan Unsurya",
    );
    
    const [ sLoading, SetSLoading ] = useState<boolean>(false)

    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const handleSubmit = () => {
        SetSLoading(true);
        dispatch(clearAuthTokens())
        successToast({ text: "Berhasil keluar dari sistem" })
        navigate('/auth')
        SetSLoading(false);
        onClose()
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
                                aria-label="profil"
                                onPress={() => navigate('/edit-profil')}
                                key={'profil'}
                                className={`text-primary`}
                                startContent={
                                    <FaUserCog className="text-primary" size={20} />
                                }
                            >
                                <span className="font-semibold">Edit Profil</span>
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