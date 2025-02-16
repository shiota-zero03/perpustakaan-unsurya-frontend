import { useGetProfile } from "@/services/profile";
import { useEffect, useMemo, useState } from "react";
import Profile from "@/assets/images/profile.png";
import { CardDashboard, CardDashboardChart, CardDashboardHarian } from "@/components/Card";
import { FaUsers } from "react-icons/fa6";
import { BiBookOpen } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import { DateValue, RangeValue } from "@nextui-org/react";
import { returnFormatDate } from "@/utils/dateFormat";

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



    const currentDate = new Date();
    const lastSevenDays = new Date();
    lastSevenDays.setDate(currentDate.getDate() - 7);

    const [ datePengujung, setDatePengunjung ] = useState({
        startDate: lastSevenDays,
        endDate: currentDate
    })

    const changeDatePengunjung = (newDate: RangeValue<DateValue> | null) => {
        if(newDate) {
            setDatePengunjung({
                startDate: new Date(returnFormatDate(newDate.start)),
                endDate: new Date(returnFormatDate(newDate.end))
            })
        }
    }


    return (
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
            <div>
                <div className="grid sm:grid-cols-3 grid-cols-1 lg:gap-6 gap-2">
                    <CardDashboard text="Banyak Anggota" count={0} icon={FaUsers} />
                    <CardDashboard text="Banyak Buku dan TA" count={0} icon={BiBookOpen} />
                    <CardDashboard text="Banyak Transaksi" count={0} icon={TbReport} />
                </div>
            </div>
            <div>
                <div className="flex items-center gap-1">
                    <div className="text-primary text-lg font-bold">Data Harian</div><div className="text-primary text-[10px] mt-1 font-medium italic">( {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} )</div>
                </div>
                <div className="grid sm:grid-cols-3 grid-cols-1 lg:gap-6 gap-2">
                    <CardDashboardHarian text="Peminjaman Buku" count={'0'} percentase={'100'} category={'up'} />
                    <CardDashboardHarian text="Pengembalian Telat" count={'0'} percentase={'100'} category={'up'} />
                    <CardDashboardHarian 
                        text="Total Denda Masuk" 
                        count={`Rp
                            ${new Intl.NumberFormat("id-ID", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            }).format(1000000000)}
                        `} 
                        percentase={'100'} 
                        category={'down'} 
                    />
                </div>
            </div>
            <div>
                <div className="grid sm:grid-cols-2 grid-cols-1 lg:gap-6 gap-2">
                    <CardDashboardChart 
                        title={"Pengunjung Perpustakaan"} 
                        startDate={datePengujung.startDate} 
                        endDate={datePengujung.endDate} 
                        onChangeDate={(newDate) => changeDatePengunjung(newDate)} 
                        linkText={"Lihat Detail Pengunjung"} 
                        linkUrl={"/data-master/pengunjung"}
                    ></CardDashboardChart>
                    <CardDashboardChart 
                        title={"Transaksi"} 
                        desc="Peminjaman dan Pengembalian Buku"
                        startDate={datePengujung.startDate} 
                        endDate={datePengujung.endDate} 
                        onChangeDate={(newDate) => changeDatePengunjung(newDate)} 
                        linkText={"Lihat Detail Transaksi"} 
                        linkUrl={"/data-transaksi/peminjaman"}
                    ></CardDashboardChart>
                </div>
            </div>
        </main>
    )
}