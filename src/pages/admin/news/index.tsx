import { FaList } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useEffect, useMemo, useState } from "react";
import { createColumnHelper, Row } from "@tanstack/react-table";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import MyReactTable from "@/components/DataTable";
import { BiEdit, BiSearch, BiTrash } from "react-icons/bi";
import { BsEye, BsPlusSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { TbRestore } from "react-icons/tb";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { NewsListRes } from "@/interface/response/News.interface";
import { useGetListNews, useDeletedNews } from "@/services/news";

export default function DataBerita(){

    const navigate = useNavigate();

    const limit = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [judulSearch, setJudulSearch] = useState<string | null>(null);
    const [penulisSearch, setPenulisSearch] = useState<string | null>(null);
    
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);
    
    const [selectedId, setSelectedId] = useState<string>('')

    const {
        data: dataNews,
        refetch: refetchNews,
        isLoading: isLoadingNews,
        isFetching: isFetchingNews,
    } = useGetListNews(
        limit,
        currentPage,
        judulSearch,
        penulisSearch
    );
    
    const NEWS_DATA = useMemo(() => {
        if (!dataNews || !dataNews.data) return [];
        setTotalPage(dataNews.data.pagination.totalPages || 0);
        setTotalData(dataNews.data.pagination.totalItems || 0);
        setFromPage(dataNews.data.pagination.from || 0);
        setToPage(dataNews.data.pagination.to || 0);

        return dataNews.data.data
    }, [dataNews, currentPage]);

    useEffect(() => {
        refetchNews();
    }, [currentPage]);

    const columnHelper = createColumnHelper<NewsListRes>();

    const columns = useMemo(
        () => [
            columnHelper.accessor("picture", {
                id: "picture",
                cell: (info) => {
                    const pic = info.getValue() as string;
                    return (
                        <div>
                            <img src={pic} alt="picture-data" width={120} />
                        </div>
                    )
                },
                header: () => <span>Thumbnail</span>,
            }),
            columnHelper.accessor("title", {
                id: "title",
                cell: (info) => info.getValue(),
                header: () => <span>Judul Berita</span>,
            }),
            columnHelper.accessor("author", {
                id: "author",
                cell: (info) => info.getValue(),
                header: () => <span>Penulis</span>,
            }),
            columnHelper.accessor("created", {
                id: "created",
                cell: (info) => info.getValue(),
                header: () => <span>Tanggal Berita</span>,
            }),
            {
                id: "action",
                header: () => <span>Aksi</span>,
                cell: ({ row }: { row: Row<NewsListRes> }) => {
                    const { slug } = row.original;

                    return (
                        <div className="flex items-center gap-2">
                            <Button onPress={() => navigate(`/cms/berita-informasi/detail/${slug}`)} isIconOnly size="sm" variant="bordered" color="primary"><BsEye /></Button>
                            <Button onPress={() => navigate(`/cms/berita-informasi/edit-data/${slug}`)} isIconOnly size="sm" variant="bordered" color="warning"><BiEdit /></Button>
                            <Button onPress={() => deletedAction(slug)} isIconOnly size="sm" variant="bordered" color="danger"><BiTrash /></Button>
                        </div>
                    );
                },
            },
        ],
        [currentPage],
    );

    const handleSearch = () => {
        setCurrentPage(1);
        refetchNews();
    }

    const handleReset = () => {
        setJudulSearch(null);
        setPenulisSearch(null);
        setTimeout(() => {
            setCurrentPage(1);
            refetchNews();
        }, 500);
    }

    const [ isLoadingAction, setLoadingAction ] = useState<boolean>(false);

    const { isOpen: isOpenDeleted, onOpen: onOpenDeleted, onClose: onCloseDeleted } = useDisclosure();
    const {mutate: mutateDeleted} = useDeletedNews();
    const deletedAction = (id: string) => {
        setSelectedId(id)
        onOpenDeleted()
    }
    const handleDelete = (id: string) => {
        setLoadingAction(true)
        try {
            mutateDeleted(
                {userId: id},
                {
                    onSuccess: (res) => {
                        setTimeout(() => {
                            setCurrentPage(1);
                            successToast({text: res.message})
                            refetchNews()
                            setSelectedId("")
                            onCloseDeleted()
                            isFinished()
                        }, 500);
                        
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { message } = error.response.data;
                            errorToast({ text: message || "" });
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
        setLoadingAction(false);
    }


    return (
        <main className="flex flex-col gap-4">
            <ConfirmAlert 
                isOpen={isOpenDeleted} 
                isLoading={isLoadingAction} 
                text={"Apakah anda yakin untuk menghapus data terpilih? Data yang dihapus tidak bisa dikembalikan"} 
                onClose={onCloseDeleted}
                confirmAction={() => handleDelete(selectedId)}
            />

            <BreadcrumbWithCustomSeparator icon={FaList} />
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex items-center justify-between sm:flex-row flex-col gap-2">
                    <Button
                        size="sm"
                        radius="sm"
                        color="primary"
                        className="font-semibold flex items-center"
                        onPress={() => navigate('/cms/berita-informasi/tambah-data')}
                    >
                        <BsPlusSquareFill /> Tambah Data Berita
                    </Button>
                </div>
            </div>
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex sm:items-end items-center justify-between sm:flex-row flex-col gap-2">
                    <div className="flex items-center sm:flex-row flex-col gap-2 w-full">
                        <div className="w-full">
                            <label htmlFor="search-name" className="font-semibold text-sm text-primary">Judul Berita</label>
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
                        <div className="w-full">
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
                <MyReactTable<NewsListRes>
                    data={NEWS_DATA}
                    columns={columns}
                    currentPage={currentPage}
                    totalDatas={totalData}
                    totalPage={totalPage}
                    fromPage={fromPage}
                    toPage={toPage}
                    handlePageChange={(page: number) => setCurrentPage(page)}
                    isFetching={isFetchingNews}
                    isLoading={isLoadingNews}
                />
            </div>
        </main>
    )
}