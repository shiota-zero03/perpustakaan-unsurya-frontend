import Auth1 from "@/assets/images/auth-1.png";
import Logo from "@/assets/images/logo.png";
import TopAuth from "@/components/Auth/TopAuth";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { ButtonSolid } from "@/components/UI/button";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { useAuthForgot } from "@/services/auth";
import { errorToast, successToast } from "@/utils/toastMessage";
import { Input, useDisclosure } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword () {

    const [ sLoading, SetSLoading ] = useState<boolean>(false)

    const [ formData, setFormData ] = useState<{ email?: string }>({
        email: ''
    });

    const [ formDataError, setFormDataError ] = useState<{ email?: string }>();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { mutate: mutateAuth } = useAuthForgot();

    const navigate = useNavigate();

    const handleSubmit = () => {
        SetSLoading(true);
        setFormDataError({})

        try {
            mutateAuth(
                { email: formData.email || "" },
                {
                    onSuccess: (res) => {
                        successToast({ text: res.message })
                        navigate('/auth/sign-in')
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { data, status } = error.response;
                            const { errors, message } = data;
                            errorToast({ text: message || "" });

                            if(status === 422) {
                                setFormDataError({
                                    ...formDataError,
                                    email: errors.email
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
        onClose()
    }

    return (
        <div className="w-full">
            <ConfirmAlert
                isOpen={isOpen} 
                isLoading={sLoading} 
                text={"Apakah anda yakin ingin mereset password anda ?"} 
                onClose={onClose} 
                confirmAction={handleSubmit}                
            />
            <div className="grid grid-cols-11">
                <div className="lg:col-span-5 col-span-11 bg-white w-full md:h-[85vh] h-[90vh] flex items-center justify-center flex-col overflow-y-auto py-4 scrollbar-hide relative">
                    <TopAuth content="Lupa Password" />
                    <img src={Logo} alt="logo-unsurya" loading="lazy" className="w-32 mb-4 sm:mt-0 mt-12" />
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
                            <div>
                                <label htmlFor="email" className="font-bold text-primary text-sm">Email *</label>
                            </div>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                variant="bordered"
                                aria-label="email"
                                labelPlacement="outside"
                                radius="sm"
                                className="w-full"
                                placeholder="Email anda disini"
                                color="primary"
                                classNames={{
                                    base: 'flex justify-center',
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                }}
                            />
                            <div className="-mt-1"><small className="text-danger"><em>{formDataError?.email}</em></small></div>
                        </div>
                        <div>
                            <ButtonSolid type="submit" isLoading={sLoading} className="bg-primary text-sm text-white font-bold h-10 w-full" content="Kirim link reset password" />
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