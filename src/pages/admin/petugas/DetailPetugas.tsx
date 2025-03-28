import { FaUserGraduate } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";

import UserImage from "@/assets/images/user.png";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { PetugasInterfaceErrorReq } from "@/interface/request/Petugas.interface";
import { useGetDetailPetugas, usePostSelectedPetugas } from "@/services/petugas";

export default function DetailPetugas(){

    const { id } = useParams();

    const [ formData, setFormData ] = useState<PetugasInterfaceErrorReq>({
        id: null,
        profilePicture: null,
        name: null,
        gender: null,
        email: null,
        password: null,
        status: null,
        position: null
    })

    const { data, isLoading, isFetching, refetch, error } = useGetDetailPetugas(id || "")
    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data, id]);

    useEffect(() => {
        if (dataFetching && Object.keys(dataFetching).length > 0) {
            setFormData({
                ...formData,
                profilePicture: dataFetching.profile_picture,
                id: dataFetching.id,
                name: dataFetching.name,
                gender: dataFetching.gender,
                email: dataFetching.email,
                password: null,
                position: dataFetching.position,
                status: dataFetching.status === "Aktif" ? "Active" : "InActive",
            })
        }
    }, [dataFetching])

    useEffect(() => {
        refetch()
    }, [])

    const [ loadingSend, setLoadingSend ] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {mutate: mutatePut} = usePostSelectedPetugas();
    const handleSubmit = () => {
        setLoadingSend(true)

        const formToSend: SelectedDataReq = {
            action: formData.status === 'Active' ? 'non-activated' : 'activated',
            selectedId: [id || ""]
        }

        try {
            mutatePut(
                formToSend,
                {
                    onSuccess: (res) => {
                        successToast({text: res.message})
                        isFinished();
                        refetch();
                        
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { message } = error.response.data;

                            errorToast({ text: message || "Terjadi kesalahan yang tidak terduga" });
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

    const navigate = useNavigate();

    useEffect(() => {
        if(!isFetching && error) {
            navigate('/data-master/petugas');
            errorToast({ text: "Data tidak ditemukan" })
        }
    }, [isFetching])

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
                text={`Apakah anda yakin untuk ${formData.status === 'Active' ? 'menonaktifkan' : 'megaktifkan'} data ini ?`} 
                onClose={onClose}
                confirmAction={() => handleSubmit()}
            />
            <BreadcrumbWithCustomSeparator icon={FaUserGraduate} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">{formData.name}</h1>
                </div>
                <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                    <div className="col-span-1">
                        <div className="border border-primary rounded-md flex items center justify-center md:p-4 p-2 mb-2">
                            <img src={formData.profilePicture || UserImage} alt="user-image" loading="lazy" className="w-full" />
                        </div>
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1">
                        <div className="border border-primary rounded-md md:px-6 md:py-4 px-2 py-2">
                            <div className="grid grid-cols-3">
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">ID Petugas</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.id?.replace(/-/g, '').toUpperCase()}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nama</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.name}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Jenis Kelamin</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.gender === 'L' ? 'Laki - Laki' : ( formData.gender === 'P' ? 'Perempuan' : '-' )}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Email</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.email}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Jabatan Perpustakaan</div>
                                <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.position}</div>
                                <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Status Kepengurusan</div>
                                <div className={`text-left  ${formData.status === 'Active' ? 'text-primary' : 'text-danger'} font-bold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4`}>
                                    <span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span><span className="italic">{formData.status === 'Active' ? 'Aktif' : 'Tidak Aktif'}</span>
                                    <button onClick={onOpen} className={`${formData.status === 'Active' ? 'bg-danger' : 'bg-primary'} text-white font-semibold py-1 px-3 text-xs rounded-md sm:ms-12 sm:w-auto w-full`}>
                                        {formData.status === 'Active' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}