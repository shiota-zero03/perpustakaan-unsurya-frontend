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
import { formatDateYMD } from "@/utils/dateFormat";
import { MahasiswaInterfaceErrorReq, MahasiswaInterfaceReq } from "@/interface/request/Mahasiswa.interface";
import { useGetDetailMahasiswa, useUpdateMahasiswa } from "@/services/mahasiswa";
import { useGetAllDepartment, useGetAllFaculty } from "@/services/option";

export default function UpdateDataMahasiswa(){

    const { id } = useParams();

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<MahasiswaInterfaceReq>({
        profilePicture: null,
        name: null,
        nim: null,
        gender: null,
        phoneNumber: null,
        email: null,
        password: null,
        faculty: null,
        department: null,
        status: null,
        validUntil: null
    })

    const [ formDataError, setFormDataError ] = useState<MahasiswaInterfaceErrorReq>({})

    const { data, isLoading, isFetching, refetch } = useGetDetailMahasiswa(id || "")

    const {
        data: facultyData,
        isFetching: facultyIsFetching
    } = useGetAllFaculty();

    const FAKULTAS_DATA = useMemo(() => {
        if(!facultyData) return [];
        else return facultyData.data;
    }, [facultyData])

    const {
        data: prodiData,
        refetch: prodiRefetch,
        isFetching: prodiIsFetching
    } = useGetAllDepartment(String(formData.faculty));

    const PRODI_DATA = useMemo(() => {
        if(!prodiData) return [];
        else return prodiData.data;
    }, [prodiData])

    useEffect(() => {
        prodiRefetch();
    }, [formData.faculty])

    const dataFetching = useMemo(() => {
        if(!data) {
            setFormData({
                profilePicture: null,
                name: null,
                nim: null,
                gender: null,
                phoneNumber: null,
                email: null,
                password: null,
                faculty: null,
                department: null,
                status: null,
                validUntil: null
            })
            return null;
        } else {
            setFormData({
                profilePicture: data.data.profile_picture,
                name: data.data.name,
                nim: data.data.nim,
                gender: data.data.gender,
                phoneNumber: data.data.phone_number,
                email: data.data.email,
                faculty: data.data.faculty?.id,
                department: data.data.department?.id,
                password: null,
                status: data.data.status === 'Aktif' ? 'Active' : 'InActive',
                validUntil: data.data.valid_until ? formatDateYMD(data.data.valid_until) : null
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

    const {mutate: mutatePut} = useUpdateMahasiswa();
    const handleSubmit = () => {
        setLoadingSend(true)
        setFormDataError({})

        const formToSend: MahasiswaInterfaceReq = {};
        if(formData.profilePicture ){
            if(formData.profilePicture !== dataFetching?.profile_picture) formToSend.profilePicture = formData.profilePicture;
        }
        if(formData.name) formToSend.name = formData.name;
        if(formData.nim) formToSend.nim = formData.nim;
        if(formData.gender) formToSend.gender = formData.gender;
        if(formData.phoneNumber) formToSend.phoneNumber = formData.phoneNumber;
        if(formData.email) formToSend.email = formData.email;
        if(formData.password) formToSend.password = formData.password;
        if(formData.status) formToSend.status = formData.status;
        if(formData.faculty) formToSend.faculty = formData.faculty;
        if(formData.department) formToSend.department = formData.department;
        if(formData.validUntil) formToSend.validUntil = formData.validUntil;

        try {
            mutatePut(
                {data: formToSend, userId: id || ""},
                {
                    onSuccess: (res) => {
                        successToast({text: res.message})
                        isFinished()
                        navigate('/data-anggota/mahasiswa')
                        
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
                                    nim: errors.nim || null,
                                    gender: errors.gender || null,
                                    phoneNumber: errors.phoneNumber || null,
                                    email: errors.email || null,
                                    password: errors.password || null,
                                    faculty: errors.faculty || null,
                                    department: errors.department || null,
                                    status: errors.status || null,
                                    validUntil: errors.validUntil || null
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
                    <h1 className="text-primary font-semibold">FORM EDIT DATA MAHASISWA</h1>
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
                                <label htmlFor="nim" className="text-primary font-semibold text-sm">NIM</label>
                                <Input
                                    aria-label="NIM"
                                    id="nim"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="your nim here"
                                    value={formData.nim || ""}
                                    onChange={(e) => setFormData({...formData, nim: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.nim}</div>
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
                                <label htmlFor="phoneNumber" className="text-primary font-semibold text-sm">No. HP</label>
                                <Input
                                    aria-label="No. HP"
                                    id="phoneNumber"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="your phone number here"
                                    value={formData.phoneNumber || ""}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.phoneNumber}</div>
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
                                <label htmlFor="password" className="text-primary font-semibold text-sm flex items-end gap-1 flex-wrap mb-1">Password <small className="italic text-[8px]">(Kosongkan jika tidak ingin mengganti password)</small></label>
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
                                <label htmlFor="faculty" className="text-primary font-semibold text-sm">Fakultas</label>
                                <Select
                                    aria-label="Faculty"
                                    id="faculty"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="--- Pilih fakultas ---"
                                    selectedKeys={[String(formData.faculty || "")]}
                                    onChange={(e) => setFormData({...formData, faculty: Number(e.target.value)})}
                                    classNames={{
                                        trigger: "border border-primary rounded",
                                        value: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                >
                                    {facultyIsFetching ? (
                                        <SelectItem value={""} key={""}>Loading ...</SelectItem>
                                    ) : FAKULTAS_DATA.map(item => (
                                        <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                    ))}
                                </Select>
                                <div className="text-danger italic text-xs">{formDataError.faculty}</div>
                            </div>
                            <div>
                                <label htmlFor="prodi" className="text-primary font-semibold text-sm">Program Studi</label>
                                <Select
                                    aria-label="prodi"
                                    id="prodi"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="--- Pilih program studi ---"
                                    selectedKeys={[String(formData.department || "")]}
                                    onChange={(e) => setFormData({...formData, department: Number(e.target.value)})}
                                    classNames={{
                                        trigger: "border border-primary rounded",
                                        value: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                >
                                    {prodiIsFetching ? (
                                        <SelectItem value={""} key={""}>Loading ...</SelectItem>
                                    ) : PRODI_DATA.map(item => (
                                        <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                    ))}
                                </Select>
                                <div className="text-danger italic text-xs">{formDataError.department}</div>
                            </div>
                            <div>
                                <label htmlFor="status" className="text-primary font-semibold text-sm">Status Keanggotaan</label>
                                <Select
                                    aria-label="Status Keanggotaan"
                                    id="status"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="--- Pilih Status Keanggotaan ---"
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
                            <div>
                                <label htmlFor="validUntil" className="text-primary font-semibold text-sm">Masa Berlaku Keanggotaan</label>
                                <Input
                                    aria-label="Masa Berlaku Keanggotaan"
                                    id="validUntil"
                                    type="date"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="mm/dd/yyyy"
                                    value={formData.validUntil || ""}
                                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.validUntil}</div>
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