import { FaPrint, FaUserGraduate } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { errorToast } from "@/utils/toastMessage";
import { KartuMahasiswa } from "./KartuMahasiswa";
import { MahasiswaInterfaceErrorReq } from "@/interface/request/Mahasiswa.interface";
import { useGetDetailMahasiswa } from "@/services/mahasiswa";

export default function KartuAnggotaNahasiswa({ id }: {id: string}){

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<MahasiswaInterfaceErrorReq>({
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

    const { data, isLoading, isFetching, refetch, error } = useGetDetailMahasiswa(id || "")

    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data, id]);

    useEffect(() => {
        if (dataFetching && Object.keys(dataFetching).length > 0) {
            setFormData({
                ...formData,
                profilePicture: dataFetching.profile_picture,
                name: dataFetching.name,
                nim: dataFetching.nim,
                gender: dataFetching.gender,
                phoneNumber: dataFetching.phone_number,
                email: dataFetching.email,
                password: null,
                faculty: dataFetching.faculty?.name,
                department: dataFetching.department?.name,
                status: dataFetching.status === "Aktif" ? "Active" : "InActive",
                validUntil: dataFetching.valid_until
            })
        }
    }, [dataFetching])

    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if(!isFetching && error) {
            navigate('/edit-profil');
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
                    <KartuMahasiswa dataFetching={dataFetching} />
                </div>
                <Link to={`/edit-profil/cetak-kartu/${id}`} className="mx-auto flex items-center justify-center gap-2 border border-primary p-2 text-white bg-primary px-4 rounded-lg" target="__blank">
                    <FaPrint /> Cetak Kartu
                </Link>
            </div>
        </main>
    )
}