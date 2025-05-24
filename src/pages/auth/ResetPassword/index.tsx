import Auth1 from "@/assets/images/auth-1.png";
import Logo from "@/assets/images/logo.png";
import TopAuth from "@/components/Auth/TopAuth";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { ButtonSolid } from "@/components/UI/button";
import { IResetReq } from "@/interface/request/Auth.interface";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { useAuthReset } from "@/services/auth";
import { errorToast, successToast } from "@/utils/toastMessage";
import { Input, useDisclosure } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword () {

    const [searchParams] = useSearchParams();

    const email = searchParams.get('e') || '';
    const token = searchParams.get('t') || '';

    const [ showPassword, SetShowPassword ] = useState<boolean>(false)
    const [ sLoading, SetSLoading ] = useState<boolean>(false)

    const [ formData, setFormData ] = useState<IResetReq>({
        email: email,
        token: token,
        new_password: '',
        confirmation_password: ''
    });

    const [ formDataError, setFormDataError ] = useState<IResetReq>();

    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const { mutate: mutateRegister } = useAuthReset();

    const navigate = useNavigate();

    const handleSubmit = () => {
        SetSLoading(true);
        setFormDataError({})

        try {
            mutateRegister(
                formData,
                {
                    onSuccess: (res) => {
                        successToast({ text: res.message })
                        navigate('/auth/sign-in')
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        console.error(error)
                        isFinished()
                        if (error.response && error.response.data) {
                            const { data, status } = error.response;
                            const { errors, message } = data;
                            errorToast({ text: message || "" });

                            if(status === 422) {
                                setFormDataError({
                                    ...formDataError,
                                    email: errors.email,
                                    token: errors.token,
                                    new_password: errors.new_password,
                                    confirmation_password: errors.confirmation_password
                                })
                            }
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
        <div className="w-full">
            <ConfirmAlert
                isOpen={isOpen} 
                isLoading={sLoading} 
                text={"Apakah anda yakin ingin mengirim data ?"} 
                onClose={onClose} 
                confirmAction={handleSubmit}                
            />
            <div className="grid grid-cols-11">
                <div className="lg:col-span-5 col-span-11 bg-white w-full md:h-[85vh] h-[90vh] flex items-center justify-center flex-col overflow-y-auto py-4 scrollbar-hide relative">
                    <TopAuth content="Reset Password" />
                    <img src={Logo} alt="logo-unsurya" loading="lazy" className="w-32 mb-8 sm:mt-0 mt-12" />
                    <form 
                        className="w-[80%] mx-auto flex flex-col gap-2"
                        onSubmit={
                            (e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                onOpen()
                            }
                        }
                    >
                        <div className="w-full">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={formData.new_password || ""}
                                onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                                variant="bordered"
                                aria-label="Password"
                                labelPlacement="inside"
                                radius="sm"
                                className="w-full"
                                placeholder="your new password here"
                                color="primary"
                                classNames={{
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                    label: 'text-secondary font-semibold'
                                }}
                                endContent={
                                    showPassword ? <FaEyeSlash cursor={'pointer'} onClick={() => SetShowPassword(false)} /> : <FaEye cursor={'pointer'} onClick={() => SetShowPassword(true)} />
                                }
                            />
                            <div className="-mt-1"><small className="text-danger"><em>{formDataError?.new_password}</em></small></div>
                        </div>
                        <div className="w-full">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={formData.confirmation_password || ""}
                                onChange={(e) => setFormData({...formData, confirmation_password: e.target.value})}
                                variant="bordered"
                                aria-label="Password"
                                labelPlacement="inside"
                                radius="sm"
                                className="w-full"
                                placeholder="your confirmation password here"
                                color="primary"
                                classNames={{
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                    label: 'text-secondary font-semibold'
                                }}
                                endContent={
                                    showPassword ? <FaEyeSlash cursor={'pointer'} onClick={() => SetShowPassword(false)} /> : <FaEye cursor={'pointer'} onClick={() => SetShowPassword(true)} />
                                }
                            />
                            <div className="-mt-1"><small className="text-danger"><em>{formDataError?.confirmation_password}</em></small></div>
                        </div>
                        <div>
                            <ButtonSolid type="submit" isLoading={sLoading} className="bg-primary text-sm text-white font-bold h-10 w-full" content="Reset Password" />
                        </div>
                        <div className="flex items-center justify-center gap-1 sm:text-sm text-xs text-primary font-medium">
                            Kembali ke halaman<Link to={"/auth/sign-in"} className="font-bold underline">masuk</Link>
                        </div>
                    </form>
                </div>
                <div className="items-center justify-center md:h-[85vh] h-[90vh] lg:col-span-6 lg:flex hidden">
                    <img src={Auth1} alt="auth-image" loading="lazy" className="w-80" />
                </div>
            </div>
        </div>
    )
}