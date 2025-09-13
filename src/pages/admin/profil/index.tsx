import { FaUserGraduate } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ProfilInterfaceReq } from "@/interface/request/Mahasiswa.interface";
import store from "@/redux/store";

export default function UpdateProfil(){

    const { role, user } = store.getState().auth;

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<ProfilInterfaceReq>({})


    useEffect(() => {
        setFormData({
            ...formData,
            name: user?.nama || "",
            email: user?.email || "",
            password: "",
            gender: user?.jeniskelamin || "",
            phoneNumber: user?.no_telpon || "",
            identityNumber: user?.user_id || "",
            faculty: user?.fakultas || "",
            department: user?.prodi || ""
        })
    }, [user])



    return (
        <main className="flex flex-col gap-4">
            <BreadcrumbWithCustomSeparator icon={FaUserGraduate} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">PROFIL PENGGUNA</h1>
                </div>
                {role === "Student" ? (
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        <div className="lg:col-span-3 col-span-1 flex flex-col gap-1">
                            <div className="border border-primary rounded-md md:px-6 md:py-4 px-2 py-2 mb-2">
                                <div className="grid grid-cols-3">
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">NIM</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.identityNumber}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nama</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.name}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Jenis Kelamin</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.gender}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">No. Hp</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.phoneNumber}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Email</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.email}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Fakultas</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.faculty}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Program Studi</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.department}</div>
                                </div>
                            </div>
                            <Button onPress={() => navigate(`/edit-profil/lihat-kartu-anggota`)} variant="bordered" radius="sm" className="border-[0.8px] border-primary text-secondary font-semibold">
                                Lihat Kartu Anggota
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1">
                            <div className="border border-primary rounded-md md:px-6 md:py-4 px-2 py-2 mb-2">
                                <div className="grid grid-cols-3">
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nomor Identitas</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.identityNumber}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Nama</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.name}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Jenis Kelamin</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.gender}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">No. Hp</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.phoneNumber}</div>
                                    <div className="text-primary lg:text-base text-sm lg:col-span-1 col-span-3">Email</div>
                                    <div className="text-left text-primary font-semibold lg:text-base text-sm lg:col-span-2 col-span-3 mb-4"><span className="lg:inline hidden">&nbsp;: &nbsp; </span><span className="lg:hidden">&nbsp;- </span>{formData.email}</div>
                                </div>
                            </div>
                            <Button onPress={() => navigate(`/edit-profil/lihat-kartu-anggota`)} variant="bordered" radius="sm" className="border-[0.8px] border-primary text-secondary font-semibold">
                                Lihat Kartu Anggota
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}