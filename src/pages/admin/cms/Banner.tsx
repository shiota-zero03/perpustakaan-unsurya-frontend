import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import MyReactTable from "@/components/DataTable";
import CreateModal from "@/components/Modals/cms/banner/CreateModal";
import UpdateModal from "@/components/Modals/cms/banner/UpdateModal";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { BannerListRes } from "@/interface/response/Banner.interface";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { useDeletedBanner, useGetListBanner } from "@/services/banner";
import { errorToast, successToast } from "@/utils/toastMessage";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { createColumnHelper, Row } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { BiEdit, BiSearch, BiTrash } from "react-icons/bi";
import { BsPlusSquareFill } from "react-icons/bs";
import { FaList } from "react-icons/fa6";
import { TbRestore } from "react-icons/tb";

export default function DataBanner() {

    const limit = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [nameSearch, setNameSearch] = useState<string | null>(null);
    
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);
    
    const [selectedId, setSelectedId] = useState<string>('')

    const {
        data: dataFetch,
        refetch: refetchData,
        isLoading: isLoadingData,
        isFetching: isFetchingData,
    } = useGetListBanner(
        limit,
        currentPage,
        nameSearch
    );

    const FETCH_DATA = useMemo(() => {
        if (!dataFetch || !dataFetch.data) return [];
        setTotalPage(dataFetch.data.pagination.totalPages || 0);
        setTotalData(dataFetch.data.pagination.totalItems || 0);
        setFromPage(dataFetch.data.pagination.from || 0);
        setToPage(dataFetch.data.pagination.to || 0);

        return dataFetch.data.data
    }, [dataFetch, currentPage]);

    useEffect(() => {
        refetchData();
    }, [currentPage]);

    const columnHelper = createColumnHelper<BannerListRes>();

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
                header: () => <span>Gambar</span>,
            }),
            columnHelper.accessor("title", {
                id: "title",
                cell: (info) => info.getValue(),
                header: () => <span>Judul Banner</span>,
            }),
            columnHelper.accessor("subtitle", {
                id: "subtitle",
                cell: (info) => info.getValue(),
                header: () => <span>Subtitle Banner</span>,
            }),
            {
                id: "action",
                header: () => <span>Aksi</span>,
                cell: ({ row }: { row: Row<BannerListRes> }) => {
                    const { id } = row.original;

                    return (
                        <div className="flex items-center justify-start gap-2">
                            <Button onPress={() => updatedAction(String(id))} isIconOnly size="sm" variant="bordered" color="warning"><BiEdit /></Button>
                            <Button onPress={() => deletedAction(String(id))} isIconOnly size="sm" variant="bordered" color="danger"><BiTrash /></Button>
                        </div>
                    );
                },
            },
        ],
        [currentPage],
    );

    const handleSearch = () => {
        setCurrentPage(1);
        refetchData();
    }

    const handleReset = () => {
        setNameSearch(null);
        setTimeout(() => {
            setCurrentPage(1);
            refetchData();
        }, 500);
    }

    const [ isLoadingAction, setLoadingAction ] = useState<boolean>(false);

    const { isOpen: isOpenDeleted, onOpen: onOpenDeleted, onClose: onCloseDeleted } = useDisclosure();
    const { isOpen: isOpenCreated, onOpen: onOpenCreated, onClose: onCloseCreated } = useDisclosure();
    const { isOpen: isOpenUpdated, onOpen: onOpenUpdated, onClose: onCloseUpdated } = useDisclosure();

    const {mutate: mutateDeleted} = useDeletedBanner();
    const deletedAction = (id: string) => {
        setSelectedId(id)
        onOpenDeleted()
    }
    const updatedAction = (id: string) => {
        setSelectedId(id)
        onOpenUpdated()
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
                            refetchData()
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
        } finally {
            setSelectedId('')
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
            <CreateModal
                isOpen={isOpenCreated}
                onClose={onCloseCreated}
                afterClose={refetchData}
            />
            <UpdateModal
                id={selectedId}
                isOpen={isOpenUpdated}
                onClose={onCloseUpdated}
                afterClose={() => {refetchData(); setSelectedId('');}}
            />
            <BreadcrumbWithCustomSeparator icon={FaList} />
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex items-center justify-end sm:flex-row flex-col gap-2">
                    <Button
                        size="sm"
                        radius="sm"
                        color="primary"
                        className="font-semibold flex items-center"
                        onPress={() => onOpenCreated()}
                    >
                        <BsPlusSquareFill /> Tambah Banner
                    </Button>
                </div>
            </div>
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex sm:items-end items-center justify-between sm:flex-row flex-col gap-2">
                    <div className="flex items-center sm:flex-row flex-col gap-2 w-full">
                        <div className="w-full">
                            <label htmlFor="search-title" className="font-semibold text-sm text-primary">Judul Banner</label>
                            <Input
                                id="search-title"
                                aria-label="Judul"
                                placeholder="Cari berdasarkan judul"
                                variant="bordered" 
                                radius="sm"
                                value={nameSearch || ""}
                                onChange={(e) => setNameSearch(e.target.value)}
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
                <MyReactTable<BannerListRes>
                    data={FETCH_DATA}
                    columns={columns}
                    currentPage={currentPage}
                    totalDatas={totalData}
                    totalPage={totalPage}
                    fromPage={fromPage}
                    toPage={toPage}
                    handlePageChange={(page: number) => setCurrentPage(page)}
                    isFetching={isFetchingData}
                    isLoading={isLoadingData}
                />
            </div>
        </main>
    )
}