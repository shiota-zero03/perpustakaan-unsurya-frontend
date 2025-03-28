import Background from "@/assets/images/bg-repository.jpg";
import { useGetListBuku } from "@/services/landing-page";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Pagination, Spinner } from "@nextui-org/react";
import { FaBook, FaCalendarCheck, FaUserAstronaut } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaRegFrownOpen } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { TbRestore } from "react-icons/tb";

export default function Katalog() {
    const [page, setPage] = useState(1);

    const [judulSearch, setJudulSearch] = useState<string | null>(null);
    const [penulisSearch, setPenulisSearch] = useState<string | null>(null);
    const [tahunSearch, setTahunSearch] = useState<string | null>(null);

    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);

    const { data, isFetching, refetch } = useGetListBuku(12, page, judulSearch, penulisSearch, tahunSearch);

    const DATA_FETCHING = useMemo(() => {
        if (data) {
            setTotalPage(data.data.pagination.totalPages || 0);
            setTotalData(data.data.pagination.totalItems || 0);
            setFromPage(data.data.pagination.from || 0);
            setToPage(data.data.pagination.to || 0);
            return data.data.data;
        }
    }, [data, page]);

    useEffect(() => {
        refetch();
    }, [page]);

    useEffect(() => {
        setPage(1);
        setJudulSearch("");
        setPenulisSearch("");
        setTahunSearch("");
    }, []);

    const handleSearch = () => {
        setPage(1);    
        refetch()
    };

    const handleReset = () => {
        setJudulSearch("");
        setPenulisSearch("");
        setTahunSearch("");

        setTimeout(() => {
            setPage(1);
            refetch();
        }, 500);

    }

    return (
        <div className="bg-[#e0e0e0]">
            <div className="relative md:h-[32rem] h-60 bg-danger">
                <img src={Background} alt="Background-landing-page" className="h-full w-full object-cover" />
                <div className="bg-black/40 absolute inset-0"></div>
                <div className="absolute bottom-0 bg-black/20 backdrop-blur-lg w-full px-4 sm:py-8 py-4 text-white sm:text-2xl font-medium">
                    Katalog Buku
                </div>
            </div>
            <div className="text-center lg:pb-20 pb-10 pt-10 sm:px-8 px-4 xl:text-xl lg:text-lg sm:text-base text-sm relative bg-white min-h-[80vh]">
                <div className="flex sm:items-end items-center justify-between sm:flex-row flex-col gap-2 mb-8">
                    <div className="flex items-center sm:flex-row flex-col gap-2 w-full">
                        <div className="w-full text-justify">
                            <label htmlFor="search-name" className="font-semibold text-sm text-primary">Judul Buku</label>
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
                    {isFetching && (
                        <div className="w-full flex items-center justify-center bg-slate-50/20 inset-0 absolute py-8 h-[40vh] z-10">
                            <Spinner className="scale-150" />
                        </div>
                    )}
                    {DATA_FETCHING?.length === 0 && !isFetching ? (
                        <div className="flex flex-col items-center text-primary">
                            <FaRegFrownOpen size={72} />
                            <span className="italic mt-2 sm:text-lg">Tidak ada repository ditemukan</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4">
                            {DATA_FETCHING?.map((item) => (
                                <Card key={item.id} radius="sm" shadow="sm" className="border">
                                    <Link to={`/katalog-buku/${item.id}`}>
                                        <div className="h-36 overflow-hidden rounded-sm relative">
                                            {item.cover ? (
                                                <img src={item.cover} alt="picture-news" loading="lazy" className="object-cover object-center" />
                                            ) : (
                                                <div className="border w-full h-full flex items-center justify-center rounded-md">
                                                    <FaBook className="text-4xl" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/20"></div>
                                                <p className="absolute top-0 left-0 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-br-md font-medium flex items-center gap-2">
                                                    <FaUserAstronaut />{item.penulis}
                                                </p>
                                                <div className="absolute bottom-0 right-0 text-xs px-2 py-1 bg-black/40 backdrop-blur-sm text-white rounded-tl-md font-medium flex items-center gap-2">
                                                    <FaCalendarCheck /> {item.tahun_terbit}
                                                </div>
                                        </div>
                                        <div className="text-justify p-4">
                                            <h2 className="sm:text-base text-sm font-medium">{item.judul}</h2>
                                        </div>
                                    </Link>
                                </Card>
                            ))}
                            <div className="xl:col-span-4 lg:col-span-3 sm:col-span-2 col-span-1">
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
