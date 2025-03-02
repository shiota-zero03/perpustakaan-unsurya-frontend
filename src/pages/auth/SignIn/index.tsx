import Auth1 from "@/assets/images/auth-1.png";
import Logo from "@/assets/images/logo.png";
import TopAuth from "@/components/Auth/TopAuth";
import { ButtonSolid } from "@/components/UI/button";
import { ILoginReq } from "@/interface/request/Auth.interface";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { clearAuthTokens, setAuthTokens } from "@/redux/slices/auth.slice";
import { useAuthLogin } from "@/services/auth";
import { errorToast, successToast } from "@/utils/toastMessage";
import { Checkbox, Input } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaRegAddressCard } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn () {
    const [ checkCondition, setCheckCondition ] = useState<boolean>(false)

    const [ showPassword, SetShowPassword ] = useState<boolean>(false)
    const [ sLoading, SetSLoading ] = useState<boolean>(false)

    const [ formData, setFormData ] = useState<ILoginReq>({
        email: '',
        password: ''
    });

    const [ formDataError, setFormDataError ] = useState<ILoginReq>();
    
    const dispatch = useDispatch();

    const { mutate: mutateLogin } = useAuthLogin();

    const navigate = useNavigate();

    const handleSubmit = () => {
        SetSLoading(true);
        setFormDataError({})

        dispatch(clearAuthTokens());

        try {
            mutateLogin(
                formData,
                {
                    onSuccess: (res) => {
                        successToast({ text: res.message })
                        dispatch(
                            setAuthTokens({
                                token: res.data.token,
                                role: res.data.role || ""
                            }),
                        );
                        navigate('/dashboard')
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
                                    email: errors.email,
                                    password: errors.password
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
    }
    return (
        <div className="w-full">
            <div className="grid grid-cols-11">
                <div className="lg:col-span-5 col-span-11 bg-white w-full md:h-[85vh] h-[90vh] flex items-center justify-center flex-col overflow-y-auto py-4 scrollbar-hide relative">
                    <TopAuth content="Masuk" />
                    <img src={Logo} alt="logo-unsurya" loading="lazy" className="w-32 mb-8 sm:mt-0 mt-12" />
                    <form 
                        className="w-[80%] mx-auto flex flex-col gap-2"
                        onSubmit={
                            (e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                handleSubmit()
                            }
                        }
                    >
                        <div className="w-full">
                            <Input
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                variant="bordered"
                                aria-label="Email"
                                labelPlacement="inside"
                                radius="sm"
                                className="w-full"
                                placeholder="your email here"
                                color="primary"
                                classNames={{
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                    label: 'text-secondary font-semibold'
                                }}
                                endContent={<FaRegAddressCard className="text-secondary" size={24} />}
                            />
                            <div className="-mt-1"><small className="text-danger"><em>{formDataError?.email}</em></small></div>
                        </div>
                        <div className="w-full">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={formData.password || ""}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                variant="bordered"
                                aria-label="Password"
                                labelPlacement="inside"
                                radius="sm"
                                className="w-full"
                                placeholder="your password here"
                                color="primary"
                                classNames={{
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                    label: 'text-secondary font-semibold'
                                }}
                                endContent={
                                    showPassword ? <FaEyeSlash className="text-secondary" cursor={'pointer'} onClick={() => SetShowPassword(false)} /> : <FaEye className="text-secondary" cursor={'pointer'} onClick={() => SetShowPassword(true)} />
                                }
                            />
                            <div className="-mt-1"><small className="text-danger"><em>{formDataError?.password}</em></small></div>
                        </div>
                        <div className="flex items-center justify-between my-2">
                            <Checkbox isSelected={checkCondition} onChange={() => setCheckCondition(!checkCondition)} size="sm" color="primary" radius="none"><span className="font-medium text-primary">Ingat saya</span></Checkbox>
                            <Link to={"/auth/forgot-password"} className="sm:text-sm text-xs font-medium text-primary underline">Lupa password ?</Link>
                        </div>
                        <div>
                            <ButtonSolid type="submit" isLoading={sLoading} className="bg-primary text-sm text-white font-bold h-10 w-full" content="Sign In" />
                        </div>
                        {/* <div className="flex items-center justify-center gap-1 sm:text-sm text-xs text-primary font-medium">
                            Belum punya akun ? <Link to={"/auth/sign-up"} className="font-bold underline">Daftar</Link>
                        </div> */}
                    </form>
                </div>
                <div className="items-center justify-center md:h-[85vh] h-[90vh] lg:col-span-6 lg:flex hidden">
                    <img src={Auth1} alt="auth-image" loading="lazy" className="w-80" />
                </div>
            </div>
        </div>
    )
}