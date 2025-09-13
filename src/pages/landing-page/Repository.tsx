import Background from "@/assets/images/profil-unsurya.jpg"
import { useGetListKaryaTulis } from "@/services/landing-page";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Pagination, Skeleton } from "@nextui-org/react";
import { FaBook, FaCalendarCheck, FaUserAstronaut } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { TbRestore } from "react-icons/tb";
import EmptyData from "@/assets/images/empty.svg"; 

export default function Repository() {
    const [page, setPage] = useState(1);

    const [judulSearch, setJudulSearch] = useState<string | null>(null);
    const [penulisSearch, setPenulisSearch] = useState<string | null>(null);
    const [nimSearch, setNIMSearch] = useState<string | null>(null);
    const [tahunSearch, setTahunSearch] = useState<string | null>(null);

    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);

    const { data, isLoading, refetch } = useGetListKaryaTulis(12, page, nimSearch, judulSearch, penulisSearch, tahunSearch);

    const DATA_FETCHING = useMemo(() => {
        if (data) {
            setTotalPage(data.data.pagination.totalPages || 0);
            setTotalData(data.data.pagination.totalItems || 0);
            setFromPage(data.data.pagination.from || 0);
            setToPage(data.data.pagination.to || 0);
            return data.data.data;
        } else {
            return [];
        }
    }, [data, page]);

    useEffect(() => {
        refetch();
    }, [page]);

    useEffect(() => {
        setPage(1);
        setJudulSearch("");
        setPenulisSearch("");
        setNIMSearch("");
        setTahunSearch("");
    }, []);

    const handleSearch = () => {
        setPage(1);    
        refetch()
    };

    const handleReset = () => {
        setJudulSearch("");
        setPenulisSearch("");
        setNIMSearch("");
        setTahunSearch("");

        setTimeout(() => {
            setPage(1);
            refetch();
        }, 500);

    }

    return (
        <div className="bg-[#e0e0e0]">
            <div className="relative md:h-[24rem] h-60">
                <img src={Background} alt="Background-landing-page" className="h-full w-full object-cover" />
                <div className="bg-black/40 absolute inset-0"></div>
                <div className="absolute bottom-0 bg-black/20 backdrop-blur-lg w-full px-4 sm:py-8 py-4 text-white sm:text-2xl font-medium">
                    Repository Perpustakaan
                </div>
            </div>
            <div className="text-center lg:pb-20 pb-10 pt-10 sm:px-8 px-4 xl:text-xl lg:text-lg sm:text-base text-sm relative bg-white min-h-[80vh]">
                <div className="flex sm:items-end items-center justify-between sm:flex-row flex-col gap-2 mb-8">
                    <div className="flex items-center sm:flex-row flex-col gap-2 w-full">
                        <div className="w-full text-justify">
                            <label htmlFor="search-name" className="font-semibold text-sm text-primary">Judul Koleksi (TA/Skripsi/Tesis)</label>
                            <Input
                                id="search-name"
                                aria-label="Nama"
                                placeholder="Cari berdasarkan judul"
                                variant="bordered" 
                                radius="sm"
                                value={judulSearch || ""}
                                onChange={(e) => setJudulSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
                            />
                        </div>
                        <div className="w-full text-justify">
                            <label htmlFor="search-nim" className="font-semibold text-sm text-primary">Penulis</label>
                            <Input
                                id="search-nim"
                                aria-label="NIM"
                                placeholder="Cari berdasarkan penulis"
                                variant="bordered" 
                                radius="sm"
                                value={penulisSearch || ""}
                                onChange={(e) => setPenulisSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
                            />
                        </div>
                        <div className="w-full text-justify">
                            <label htmlFor="search-year" className="font-semibold text-sm text-primary">Tahun Terbit</label>
                            <Input
                                type="number"
                                id="search-year"
                                aria-label="year"
                                placeholder="Cari berdasarkan tahun"
                                variant="bordered" 
                                radius="sm"
                                value={tahunSearch || ""}
                                onChange={(e) => setTahunSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            radius="sm"
                            variant="bordered"
                            onPress={handleSearch}
                            className="border border-primary text-primary font-semibold flex items-center sm:w-auto w-full"
                        >
                            <BiSearch size={16} /> Cari
                        </Button>
                        <Button
                            radius="sm"
                            variant="bordered"
                            onPress={handleReset}
                            className="border border-danger text-danger font-semibold flex items-center sm:w-auto w-full"
                        >
                            <TbRestore size={16} /> Reset
                        </Button>
                    </div>
                </div>
                <div className="relative">
                    {isLoading && (
                        <div>
                            <Skeleton className="h-60 w-full rounded-md" />
                        </div>
                    )}
                    {DATA_FETCHING?.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center text-primary py-8">
                            <img src={EmptyData} alt="" />
                            <span className="italic mt-2 sm:text-lg">
                                <strong>Data kosong.</strong> Mohon dicoba kembali
                            </span>
                        </div>
                    ) : (
                        <div className={`grid grid-cols-1 gap-4 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2`}>
                            {DATA_FETCHING?.map((item) => (
                                <Card key={item.id} radius="sm" shadow="sm" className="border">
                                    <>
                                        <div className="sm:h-60 p-6 overflow-hidden rounded-sm relative bg-[#dae1e7] flex items-center justify-center">
                                            {item.cover ? (
                                                <img src={item.cover} alt="picture-news" loading="lazy" className="object-cover object-center max-w-full max-h-full rounded-lg" />
                                            ) : (
                                                <div className="border w-full h-full flex items-center justify-center rounded-md p-4">
                                                    <FaBook className="text-4xl" />
                                                </div>
                                            )}
                                            <p className="absolute top-0 left-0 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-br-md font-medium flex items-center gap-2">
                                                <FaUserAstronaut />{item.penulis}
                                            </p>
                                            <div className="absolute bottom-0 right-0 text-xs px-2 py-1 bg-black/40 backdrop-blur-sm text-white rounded-tl-md font-medium flex items-center gap-2">
                                                <FaCalendarCheck /> {item.tahun_terbit}
                                            </div>
                                        </div>
                                        <div className="flex flex-col divide-y-1">
                                            <Link to={`/repository/${item.id}`} className="hover:underline hover:text-primary duration-300">
                                                <div className="text-justify p-2">
                                                    <h2 className="md:text-base text-sm font-medium">{item.judul}</h2>
                                                </div>
                                            </Link>
                                        </div>
                                    </>
                                </Card>
                            ))}
                            {!isLoading ? (
                                <div className={`xl:col-span-5 lg:col-span-4 md:col-span-3 sm:col-span-2 col-span-1`}>
                                    <div className="m-3 flex justify-between items-center sm:flex-row flex-col gap-2">
                                        <h1 className="text-sm sm:text-justify text-center">
                                            Menampilkan <span className="font-semibold">{fromPage}</span> sampai{" "}
                                            <span className="font-semibold">{toPage}</span> data dari{" "}
                                            <span className="font-semibold">{totalData}</span> data
                                        </h1>
                                        {totalData && totalData > 0 ? (
                                            <Pagination
                                                loop
                                                showControls
                                                color="primary"
                                                initialPage={1}
                                                page={page}
                                                total={totalPage || 0}
                                                onChange={(page) => setPage(page)}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
