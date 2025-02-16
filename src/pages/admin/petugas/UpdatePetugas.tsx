import { FaUserGraduate } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";

import UserImage from "@/assets/images/user.png";
import { convertFileToBase64 } from "@/utils/base64Formater";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { PetugasInterfaceErrorReq, PetugasInterfaceReq } from "@/interface/request/Petugas.interface";
import { useGetDetailPetugas, useUpdatePetugas } from "@/services/petugas";
import { JabatanPetugas } from "@/constants/EnumAdmin";

export default function UpdateDataPetugas(){

    const { id } = useParams();

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<PetugasInterfaceReq>({
        id: null,
        profilePicture: null,
        name: null,
        gender: null,
        email: null,
        password: null,
        status: null,
        position: null,
    })

    const [ formDataError, setFormDataError ] = useState<PetugasInterfaceErrorReq>({})

    const { data, isLoading, isFetching, refetch } = useGetDetailPetugas(id || "")

    const dataFetching = useMemo(() => {
        if(!data) {
            setFormData({
                id: null,
                profilePicture: null,
                name: null,
                gender: null,
                email: null,
                password: null,
                status: null,
                position: null,
            })
            return null;
        } else {
            setFormData({
                id: data.data.id,
                profilePicture: data.data.profile_picture,
                name: data.data.name,
                gender: data.data.gender,
                email: data.data.email,
                password: null,
                status: data.data.status === 'Aktif' ? 'Active' : 'InActive',
                position: data.data.position,
            })
            return data.data;
        }
    }, [data, id])

    useEffect(() => {
        refetch()
    }, [id])

    const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64Icon = await convertFileToBase64(file);
            setFormData({
              ...formData,
              profilePicture: base64Icon,
            });
          } else {
            setFormData((prev) => ({ ...prev, profilePicture: dataFetching?.profile_picture }));
          }
    }

    const [ loadingSend, setLoadingSend ] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {mutate: mutatePut} = useUpdatePetugas();
    const handleSubmit = () => {
        setLoadingSend(true)
        setFormDataError({})

        const formToSend: PetugasInterfaceReq = {};
        if(formData.profilePicture ){
            if(formData.profilePicture !== dataFetching?.profile_picture) formToSend.profilePicture = formData.profilePicture;
        }
        if(formData.name) formToSend.name = formData.name;
        if(formData.gender) formToSend.gender = formData.gender;
        if(formData.email) formToSend.email = formData.email;
        if(formData.password) formToSend.password = formData.password;
        if(formData.status) formToSend.status = formData.status;
        if(formData.position) formToSend.position = formData.position;

        try {
            mutatePut(
                {data: formToSend, userId: id || ""},
                {
                    onSuccess: (res) => {
                        successToast({text: res.message})
                        isFinished()
                        navigate('/data-master/petugas')
                        
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { data, status } = error.response;
                            const { message, errors } = data;

                            errorToast({ text: message || "Terjadi kesalahan yang tidak terduga" });
                            if(status === 422) {
                                setFormDataError({
                                    ...formDataError,
                                    profilePicture: errors.profilePicture || null,
                                    name: errors.name || null,
                                    gender: errors.gender || null,
                                    email: errors.email || null,
                                    password: errors.password || null,
                                    status: errors.status || null,
                                    position: errors.position || null,
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
        setLoadingSend(false);
        onClose();
    }

    return (
        <main className="flex flex-col gap-4">
            {isLoading || isFetching ? (
                <div className="inset-0 fixed bg-black/10 z-10 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-[6px] border-t-4 h-20 w-20 mb-4" />
                </div>
            ) : null}
            <ConfirmAlert 
                isOpen={isOpen} 
                isLoading={loadingSend} 
                text={"Apakah anda yakin untuk menyimpan data ini ?"} 
                onClose={onClose}
                confirmAction={() => handleSubmit()}
            />
            <BreadcrumbWithCustomSeparator icon={FaUserGraduate} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">FORM EDIT DATA PETUGAS</h1>
                </div>
                <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-4">
                    <div className="col-span-1">
                        <div className="border border-primary rounded-md flex items center justify-center md:p-4 p-2 mb-2">
                            <img src={formData.profilePicture || UserImage} alt="user-image" loading="lazy" className="w-full" />
                        </div>
                        <input type="file" id="profilePicture" className="hidden" onChange={handleChangeImage} />
                        <label htmlFor="profilePicture">
                            <div 
                                className="w-full border border-primary rounded-md font-semibold p-2 text-xs text-center text-primary cursor-pointer"
                            >
                                UPLOAD FOTO PROFIL
                            </div>
                        </label>
                        <div className="text-danger italic text-xs">{formDataError.profilePicture}</div>
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1 -mt-2">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
                            <div className="col-span-2">
                                <label htmlFor="id_petugas" className="text-primary font-semibold text-sm">ID Petugas</label>
                                <Input
                                    aria-label="id_petugas"
                                    id="id_petugas"
                                    variant="bordered"
                                    color="primary"
                                    isDisabled
                                    isReadOnly
                                    radius="sm"
                                    value={formData.id || ""}
                                    placeholder="AUTO_FILLED"
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="text-primary font-semibold text-sm">Nama</label>
                                <Input
                                    aria-label="Nama"
                                    id="name"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="your name here"
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.name}</div>
                            </div>
                            <div>
                                <label htmlFor="email" className="text-primary font-semibold text-sm">Email</label>
                                <Input
                                    aria-label="Email"
                                    id="email"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="your email here"
                                    value={formData.email || ""}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.email}</div>
                            </div>
                            <div>
                                <label htmlFor="gender" className="text-primary font-semibold text-sm">Jenis Kelamin</label>
                                <Select
                                    aria-label="Jenis Kelamin"
                                    id="gender"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="--- Pilih Jenis Kelamin ---"
                                    selectedKeys={[formData.gender || ""]}
                                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                    classNames={{
                                        trigger: "border border-primary rounded",
                                        value: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                >
                                    <SelectItem value={'L'} key={'L'}>Laki - Laki</SelectItem>
                                    <SelectItem value={'P'} key={'P'}>Perempuan</SelectItem>
                                </Select>
                                <div className="text-danger italic text-xs">{formDataError.gender}</div>
                            </div>
                            <div>
                                <label htmlFor="password" className="text-primary font-semibold text-sm">Password</label>
                                <Input
                                    type="password"
                                    aria-label="Password"
                                    id="password"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="your password here"
                                    value={formData.password || ""}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.password}</div>
                            </div>
                            <div>
                                <label htmlFor="position" className="text-primary font-semibold text-sm">Jabatan Perpustakaan</label>
                                <Select
                                    aria-label="Jabatan Perpustakaan"
                                    id="position"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="--- Pilih Jabatan Perpustakaan ---"
                                    selectedKeys={[formData.position || ""]}
                                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                                    classNames={{
                                        trigger: "border border-primary rounded",
                                        value: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                >
                                    {JabatanPetugas.map(item => (
                                        <SelectItem value={item.key} key={item.key}>{item.name}</SelectItem>
                                    ))}
                                </Select>
                                <div className="text-danger italic text-xs">{formDataError.position}</div>
                            </div>
                            <div>
                                <label htmlFor="status" className="text-primary font-semibold text-sm">Status Kepengurusan</label>
                                <Select
                                    aria-label="Status Kepengurusan"
                                    id="status"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="--- Pilih Status Kepengurusan ---"
                                    selectedKeys={[formData.status || ""]}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    classNames={{
                                        trigger: "border border-primary rounded",
                                        value: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                >
                                    <SelectItem value={'Active'} key={'Active'}>Aktif</SelectItem>
                                    <SelectItem value={'InActive'} key={'InActive'}>Tidak Aktif</SelectItem>
                                </Select>
                                <div className="text-danger italic text-xs">{formDataError.status}</div>
                            </div>
                        </div>
                        <div className="pt-2 pb-6">
                            <Button
                                onPress={onOpen}
                                isLoading={loadingSend}
                                variant="bordered"
                                color="primary"
                                size="sm"
                                className="w-full border rounded font-semibold"
                            >
                                SIMPAN
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}