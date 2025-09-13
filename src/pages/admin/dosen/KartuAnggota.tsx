import { FaPrint, FaUserGraduate } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { DosenInterfaceErrorReq } from "@/interface/request/Dosen.interface";
import { useGetDetailDosen } from "@/services/dosen";
import { errorToast } from "@/utils/toastMessage";
import { KartuDosen } from "./KartuDosen";

export default function KartuAnggotaDosen(){

    const { id } = useParams();

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<DosenInterfaceErrorReq>({
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

    const { data, isLoading, isFetching, refetch, error } = useGetDetailDosen(id || "")

    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data, id]);

    useEffect(() => {
        if (dataFetching && Object.keys(dataFetching).length > 0) {
            setFormData({
                ...formData,
                profilePicture: dataFetching.profile_picture,
                name: dataFetching.name,
                nidn: dataFetching.nidn,
                gender: dataFetching.gender,
                phoneNumber: dataFetching.phone_number,
                email: dataFetching.email,
                password: null,
                status: dataFetching.status === "Aktif" ? "Active" : "InActive",
                validUntil: dataFetching.valid_until,
            })
        }
    }, [dataFetching])

    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if(!isFetching && error) {
            navigate('/data-anggota/pegawai');
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
            <BreadcrumbWithCustomSeparator icon={FaUserGraduate} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">Kartu Anggota {formData.name}</h1>
                </div>
                <div className="flex items-center md:flex-row flex-col justify-center xl:scale-150 xl:my-20">
                    <KartuDosen dataFetching={dataFetching} />
                </div>
                <Link to={`/data-anggota/pegawai/cetak-kartu/${id}`} className="mx-auto flex items-center justify-center gap-2 border border-primary p-2 text-white bg-primary px-4 rounded-lg" target="__blank">
                    <FaPrint /> Cetak Kartu
                </Link>
            </div>
        </main>
    )
}