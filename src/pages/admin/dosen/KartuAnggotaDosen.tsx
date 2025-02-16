import { FaUserGraduate } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { ReactBarcode } from 'react-jsbarcode';

import { DosenInterfaceReq } from "@/interface/request/Dosen.interface";
import { useGetDetailDosen, usePostSelectedDosen } from "@/services/dosen";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { formatDateYMD } from "@/utils/dateFormat";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import Logo from "@/assets/images/logo.png";

export default function KartuAnggotaDosen(){

    const { id } = useParams();

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<DosenInterfaceReq>({
        profilePicture: null,
        name: null,
        nidn: null,
        gender: null,
        phoneNumber: null,
        email: null,
        password: null,
        status: null,
        validUntil: null
    })

    const { data, isLoading, isFetching, refetch } = useGetDetailDosen(id || "")
    useMemo(() => {
        if(!data) {
            setFormData({
                profilePicture: null,
                name: null,
                nidn: null,
                gender: null,
                phoneNumber: null,
                email: null,
                password: null,
                status: null,
                validUntil: null
            })
            return null;
        } else {
            setFormData({
                profilePicture: data.data.profile_picture,
                name: data.data.name,
                nidn: data.data.nidn,
                gender: data.data.gender,
                phoneNumber: data.data.phone_number,
                email: data.data.email,
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

    const [ loadingSend, setLoadingSend ] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {mutate: mutatePut} = usePostSelectedDosen();
    const handleSubmit = () => {
        setLoadingSend(true)

        onOpen();
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


    const [barcodeWidth, setBarcodeWidth] = useState(window.innerWidth * 1.5); // 80% dari lebar layar

    useEffect(() => {
        const handleResize = () => {
        setBarcodeWidth(window.innerWidth * 0.8);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                    <h1 className="text-primary font-semibold">Kartu Anggota {formData.name}</h1>
                </div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                    <div className="col-span-1 border border-primary rounded-md items center justify-center md:px-6 md:py-6 px-4 py-4">
                        <div className="flex justify-between items-center w-full">
                            <img src={Logo} alt="Logo" className="w-16 h-auto" loading="lazy" />
                            <div className="text-center">
                                <div className="text-primary font-bold text-base">Kartu Anggota Perpustakaan</div>
                                <div className="text-primary font-bold text-base -mt-1">Universitas Dirgantara Marsekal Suryadarma</div>
                                <div className="text-primary font-normal text-sm mt-2">Jl. Halim Perdana Kusuma No.1 - Jakarta Timur</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-1 border border-primary rounded-md md:px-8 md:py-8 px-4 py-4 items-center justify-center">
                        <ReactBarcode value={formData.nidn || ""} options={{ format: 'CODE128',
                            width: barcodeWidth/300,
                            height: 80,
                            displayValue: true,
                            fontSize: 16,
                            font: 'Arial',
                            textMargin: 5,
                            background: '#ffffff',
                            lineColor: '#085C94',
                            margin: 10 }}
                        />
                        <div className="flex gap-4 mt-4">
                            <img src={Logo} alt="Logo" className="w-24 h-24" loading="lazy" />
                            <div>
                                <div className="text-primary text-[10px] font-medium mb-1">Kartu ini harap disimpan baik baik dan apabila hilang agar segera melapor ke pihak yang berwajib dan melakukan pembayaran denda kehilangan</div>
                                <div className="text-primary text-[10px] font-medium mb-1">Kartu hanya dapat digunakan di lingkungan perpustakaan Universitas Dirgantara Marsekal Suryadarma serta tidak digunakan sebagai alat tukar menukar</div>
                                <div className="text-primary text-[10px] font-medium">Penggunaan kartu ini diatur sedemikian rupa dan tunduk pada aturan perpustakaan Universitas Dirgantara Marsekal Suryadarma</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <Button
            onPress={() => navigate(`/data-anggota/dosen/kartu-anggota/${id}`)}
            variant="bordered"
            color="primary"
            size="md"
            radius="md"
            className="w-full border rounded mt-4 font-bold"
        >
            Lihat Kartu Anggota
        </Button>
        </main>
    )
}