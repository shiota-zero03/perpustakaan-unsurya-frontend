import Auth1 from "@/assets/images/auth-1.png";
import Logo from "@/assets/images/logo.png";
import TopAuth from "@/components/Auth/TopAuth";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { ButtonSolid } from "@/components/UI/button";
import { IRegisterReq } from "@/interface/request/Auth.interface";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { useAuthRegister } from "@/services/auth";
import { errorToast } from "@/utils/toastMessage";
import { Checkbox, Input, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp () {

    const [ checkCondition, setCheckCondition ] = useState<boolean>(false)

    const [ showPassword, SetShowPassword ] = useState<boolean>(false)
    const [ sLoading, SetSLoading ] = useState<boolean>(false)

    const [ formData, setFormData ] = useState<IRegisterReq>({
        name: '',
        email: '',
        identityNumber: '',
        password: '',
        accountType: ''
    });

    const [ formDataError, setFormDataError ] = useState<IRegisterReq>();

    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const { mutate: mutateRegister } = useAuthRegister();

    const navigate = useNavigate();

    const handleSubmit = () => {
        SetSLoading(true);
        setFormDataError({})

        if(!checkCondition) {
            isFinished()
            errorToast({ text: 'Mohon cek syarat dan ketentuan terlebih dahulu' });
            return;
        }

        try {
            mutateRegister(
                formData,
                {
                    onSuccess: () => {
                        navigate('/auth/sign-up/confirmation')
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
                                    password: errors.password,
                                    name: errors.name,
                                    identityNumber: errors.identityNumber,
                                    accountType: errors.accountType
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
                <div className="lg:col-span-5 col-span-11 bg-white w-full md:h-[85vh] h-[90vh] flex items-center justify-center flex-col py-4 relative">
                    <TopAuth content="Daftar" />
                    <img src={Logo} alt="logo-unsurya" loading="lazy" className="w-32 mb-8 sm:mt-0 mt-12" />
                    <form 
                        className="flex flex-col gap-2 h-[45vh] overflow-y-auto px-8 overflow-smooth-primary" 
                        onSubmit={
                            (e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                onOpen()
                            }
                        }>
                        <div className="w-full">
                            <div>
                                <label htmlFor="nama" className="font-bold text-primary text-sm">Nama *</label>
                            </div>
                            <Input
                                id="nama"
                                type="text"
                                value={formData.name || ""}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                variant="bordered"
                                aria-label="nama"
                                labelPlacement="outside"
                                radius="sm"
                                className="w-full"
                                placeholder="Nama anda disini"
                                color="primary"
                                classNames={{
                                    base: 'flex justify-center',
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                }}
                            />
                            <div className="-mt-1"><small className="text-danger"><em>{formDataError?.name}</em></small></div>
                        </div>
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
                        <div className="w-full">
                            <div>
                                <label htmlFor="identityNumber" className="font-bold text-primary text-sm">Nomor Identitas (NIM / NIDN) *</label>
                            </div>
                            <Input
                                id="identityNumber"
                                type="text"
                                value={formData.identityNumber || ""}
                                onChange={(e) => setFormData({...formData, identityNumber: e.target.value})}
                                variant="bordered"
                                aria-label="identityNumber"
                                labelPlacement="outside"
                                radius="sm"
                                className="w-full"
                                placeholder="Nomor identitas anda disini"
                                color="primary"
                                classNames={{
                                    base: 'flex justify-center',
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                }}
                            />
                            <div className="-mt-1"><small className="text-danger"><em>{formDataError?.identityNumber}</em></small></div>
                        </div>
                        <div className="w-full">
                            <div>
                                <label htmlFor="password" className="font-bold text-primary text-sm">Password *</label>
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password || ""}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                variant="bordered"
                                aria-label="password"
                                labelPlacement="outside"
                                radius="sm"
                                className="w-full"
                                placeholder="Password anda disini"
                                color="primary"
                                endContent={
                                    showPassword ? <FaEyeSlash cursor={'pointer'} onClick={() => SetShowPassword(false)} /> : <FaEye cursor={'pointer'} onClick={() => SetShowPassword(true)} />
                                }
                                classNames={{
                                    base: 'flex justify-center',
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                }}
                            />
                            <div className="-mt-1"><small className="text-danger"><em>{formDataError?.password}</em></small></div>
                        </div>
                        <div className="w-full">
                            <div>
                                <label htmlFor="type" className="font-bold text-primary text-sm">Tipe Akun *</label>
                            </div>
                            <Select
                                id="type"
                                variant="bordered"
                                aria-label="type"
                                labelPlacement="outside"
                                radius="sm"
                                className="w-full"
                                placeholder="--- Pilih tipe akun anda ---"
                                color="primary"
                                selectedKeys={[formData.accountType || ""]}
                                onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                                classNames={{ 
                                    trigger: 'border-primary'
                                 }}
                            >
                                <SelectItem key={'Teacher'} value={'Teacher'}>Dosen</SelectItem>
                                <SelectItem key={'Student'} value={'Student'}>Mahasiswa</SelectItem>
                            </Select>
                            <div className="-mt-1"><small className="text-danger"><em>{formDataError?.accountType}</em></small></div>
                        </div>
                        <div className="my-2">
                            <Checkbox isSelected={checkCondition} onChange={() => setCheckCondition(!checkCondition)} size="sm" color="primary" radius="none">
                                <span className="font-medium text-primary sm:text-sm text-xs">
                                    Saya menyetujui <Link to={"#"} className="underline">persyaratan layanan dan perjanjian</Link>
                                </span>
                            </Checkbox>
                        </div>
                        <div>
                            <ButtonSolid type="submit" className="bg-primary text-sm text-white font-bold h-10 w-full" content="Sign Up" />
                        </div>
                        <div className="flex items-center justify-center gap-1 sm:text-sm text-xs text-primary font-medium">
                            Sudah memiliki akun ? <Link to={"/auth/sign-in"} className="font-bold underline">Masuk</Link>
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