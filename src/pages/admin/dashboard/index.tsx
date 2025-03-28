import { useGetProfile } from "@/services/profile";
import { useEffect, useMemo, useState } from "react";
import Profile from "@/assets/images/profile.png";
import { CardDashboard, CardDashboardChart, CardDashboardHarian } from "@/components/Card";
import { FaUsers } from "react-icons/fa6";
import { BiBookOpen } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import { useGetDashgetDashboard, useGetDashgetDashboardKunjungan, useGetDashgetDashboardTransaksi } from "@/services/dashboard";
import CustomChart from "@/components/Charts/Recharts";
import store from "@/redux/store";
import { Card, CardBody } from "@nextui-org/react";

export default function Dashboard(){
    const [ dataLayoutProfile, setDataLayoutProfile ] = useState<{name: string, picture: string | null}>({
        name: 'Anonymous',
        picture: null
    })

    const { data: dataProfile, isLoading: isLoadingProfile, refetch: refetchProfile } = useGetProfile();
    useMemo(() => {
        if(dataProfile && dataProfile.data) {
            setDataLayoutProfile({
                name: dataProfile.data.name,
                picture: dataProfile.data.profile?.profilePicture || null
            })
        }
    }, [dataProfile, isLoadingProfile, refetchProfile])

    useEffect(() => {
        refetchProfile();
    }, [dataProfile, refetchProfile])

    const { data: dataDashboard, isLoading: isFetchingDashboard, refetch: refetchDashboard } = useGetDashgetDashboard();
    const DASHBOARD_FETCHING = useMemo(() => {
        return dataDashboard ? dataDashboard.data : null;
    }, [dataDashboard])

    const currentDate = new Date();
    const lastSevenDays = new Date();
    lastSevenDays.setDate(currentDate.getDate() - 7);

    const [dateKunjungan, setDateKunjungan] = useState<string>(`${new Date().getFullYear()}`)

    const changeDatePengunjung = (newDate: string | null) => {
        if(newDate) {
            setDateKunjungan(newDate)
        }
    }

    const [dateTransaksi, setDateTransaksi] = useState<string>(`${new Date().getFullYear()}`)

    const changeDateTransaksi = (newDate: string | null) => {
        if(newDate) {
            setDateTransaksi(newDate)
        }
    }

    const { data: dataDashboardTransaksi, isFetching: isFetchingDashboardTransaksi, refetch: refetchDashboardTransaksi } = useGetDashgetDashboardTransaksi(dateTransaksi);
    const DASHBOARDTRANSAKSI_FETCHING = useMemo(() => {
        return dataDashboardTransaksi ? dataDashboardTransaksi.data : [];
    }, [dataDashboardTransaksi])

    const { data: dataDashboardKunjungan, isFetching: isFetchingDashboardKunjungan, refetch: refetchDashboardKunjungan } = useGetDashgetDashboardKunjungan(dateKunjungan);
    const DASHBOARDKUNJUNGAN_FETCHING = useMemo(() => {
        return dataDashboardKunjungan ? dataDashboardKunjungan.data : [];
    }, [dataDashboardKunjungan])

    useEffect(() => {
        refetchDashboard();
        refetchDashboardTransaksi();
        refetchDashboardKunjungan();
    }, [])

    useEffect(() => {
        refetchDashboardKunjungan();
    }, [dateKunjungan])

    useEffect(() => {
        refetchDashboardTransaksi();
    }, [dateTransaksi])

    const { auth } = store.getState();

    return (
        <>
            {auth.role === "Student" || auth.role === "Teacher" ? (
                <main className="flex flex-col gap-8">
                    <div className="flex sm:flex-row flex-col items-center gap-4">
                        <img src={dataLayoutProfile.picture || Profile} alt="profile-user" className="w-20 h-20 object-cover object-center border border-primary rounded-full " />
                        <div className="flex flex-col text-primary sm:items-start items-center">
                            <div className="lg:text-2xl text-xl font-bold mb-1">Hi, {dataLayoutProfile.name}</div>
                            <div className="lg:text-base sm:text-sm text-xs italic sm:text-start text-center">Hari yang cerah dan selamat beraktivitas - {
                                    new Date().toLocaleDateString("id-ID", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <Card radius="sm" shadow="sm">
                        <CardBody className="md:text-xl md:p-8 text-sm p-4 text-justify font-medium">
                            Selamat Datang di Sistem Informasi Perpustakaan Online UNSURYA. Dengan adanya sistem informasi ini, diharapkan para mahasiswa dapat menambah wawasan mengenai buku-buku mata kuliah yang tersedia di Perpustakaan ini. Koleksi buku yang ada di perpustakaan UNSURYA dapat diakses melalui website ini. Selamat menikmati layanan perpustakaan online kami.<br /><br />
                            Semoga dengan adanya Sistem Informasi Perpustakaan Online ini, fasilitas dan minat baca di kalangan para mahasiswa UNSURYA semakin meningkat.
                        </CardBody>
                    </Card>
                </main>
            ) : (
                <main className="flex flex-col gap-8">
                    {isLoadingProfile || isFetchingDashboard ? (
                        <div className="inset-0 fixed bg-black/10 z-10 flex items-center justify-center">
                            <div className="loader ease-linear rounded-full border-[6px] border-t-4 h-20 w-20 mb-4" />
                        </div>
                    ) : null}
                    <div className="flex sm:flex-row flex-col items-center gap-4">
                        <img src={dataLayoutProfile.picture || Profile} alt="profile-user" className="w-20 h-20 object-cover object-center border border-primary rounded-full " />
                        <div className="flex flex-col text-primary sm:items-start items-center">
                            <div className="lg:text-2xl text-xl font-bold mb-1">Hi, {dataLayoutProfile.name}</div>
                            <div className="lg:text-base sm:text-sm text-xs italic sm:text-start text-center">Hari yang cerah dan selamat beraktivitas - {
                                    new Date().toLocaleDateString("id-ID", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid sm:grid-cols-3 grid-cols-1 lg:gap-6 gap-2">
                            <CardDashboard text="Banyak Anggota" count={DASHBOARD_FETCHING?.anggota ? Number(DASHBOARD_FETCHING?.anggota) : 0} icon={FaUsers} />
                            <CardDashboard text="Banyak Buku dan TA" count={DASHBOARD_FETCHING?.buku ? Number(DASHBOARD_FETCHING?.buku) : 0} icon={BiBookOpen} />
                            <CardDashboard text="Pengunjung Hari Ini" count={DASHBOARD_FETCHING?.transaksi ? Number(DASHBOARD_FETCHING?.transaksi) : 0} icon={TbReport} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <div className="text-primary text-lg font-bold">Data Harian</div><div className="text-primary text-[10px] mt-1 font-medium italic">( {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} )</div>
                        </div>
                        <div className="grid sm:grid-cols-3 grid-cols-1 lg:gap-6 gap-2">
                            <CardDashboardHarian text="Peminjaman Buku" count={DASHBOARD_FETCHING?.transaksiHariIni ? DASHBOARD_FETCHING?.transaksiHariIni : "0"}  percentase={DASHBOARD_FETCHING?.selisihTransaksi ? DASHBOARD_FETCHING?.selisihTransaksi : "0"} category={DASHBOARD_FETCHING?.statusTransaksi === "down" ? "down" : "up"} />
                            <CardDashboardHarian text="Pengembalian Telat" count={DASHBOARD_FETCHING?.pengembalianHariIni ? DASHBOARD_FETCHING?.pengembalianHariIni : "0"}  percentase={DASHBOARD_FETCHING?.selisihPengembalian ? DASHBOARD_FETCHING?.selisihPengembalian : "0"} category={DASHBOARD_FETCHING?.statusPengembalian === "down" ? "down" : "up"} />
                            <CardDashboardHarian 
                                text="Total Denda Masuk" 
                                count={`Rp
                                    ${new Intl.NumberFormat("id-ID", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                    }).format(
                                        DASHBOARD_FETCHING?.bayarHariIni ? Number(DASHBOARD_FETCHING?.bayarHariIni) : 0
                                    )}
                                `} 
                                percentase={DASHBOARD_FETCHING?.selisihBayar ? DASHBOARD_FETCHING?.selisihBayar : "0"} 
                                category={DASHBOARD_FETCHING?.statusbayar === "down" ? "down" : "up"}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="grid sm:grid-cols-2 grid-cols-1 lg:gap-6 gap-2">
                            <CardDashboardChart
                                isLoading={isFetchingDashboardKunjungan}
                                title={"Pengunjung Perpustakaan"} 
                                dateValue={dateKunjungan}
                                onChangeDate={(newDate) => changeDatePengunjung(newDate)} 
                                linkText={"Lihat Detail Pengunjung"} 
                                linkUrl={"/data-master/pengunjung"}
                            >
                                <CustomChart data={DASHBOARDKUNJUNGAN_FETCHING} dataKey="total" type="line" color="#8884d8" />
                            </CardDashboardChart>
                            <CardDashboardChart
                                isLoading={isFetchingDashboardTransaksi}
                                title={"Transaksi"} 
                                desc="Peminjaman dan Pengembalian Buku"
                                dateValue={dateTransaksi}
                                onChangeDate={(newDate) => changeDateTransaksi(newDate)} 
                                linkText={"Lihat Detail Transaksi"} 
                                linkUrl={"/data-transaksi/peminjaman"}
                            >
                                <CustomChart data={DASHBOARDTRANSAKSI_FETCHING} dataKey="total" type="line" color="#8884d8" />
                            </CardDashboardChart>
                        </div>
                    </div>
                </main>
            )}
        </>
    )
}