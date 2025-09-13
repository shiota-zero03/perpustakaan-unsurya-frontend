import BreadcrumbWithCustomSeparator from '@/components/Breadcrumb';
import ConfirmAlert from '@/components/Modals/ConfirmAlert';
import { BaseErrorRes } from '@/interface/response/base.interface';
import { useCronMahasiswa } from '@/services/mahasiswa';
import { errorToast, successToast } from '@/utils/toastMessage';
import { Button, Divider, useDisclosure } from '@nextui-org/react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { BsGear } from 'react-icons/bs';
import { TbPlugConnected } from 'react-icons/tb';

export default function DataProfilPerpustakaan() {

    const [ loadingSinkron, setLoadingSinkron ] = useState<boolean>(false);

    const { mutate: mutatePost } = useCronMahasiswa();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSubmit = () => {
        setLoadingSinkron(true)
        try {
            mutatePost(
                null,
                {
                    onSuccess: (res) => {
                        successToast({ text: res.message || "Data berhasil disinkronkan" })
                        setTimeout(() => {
                            setLoadingSinkron(false);
                        }, 500);
                        onClose();
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        setLoadingSinkron(false);
                        if (error.response && error.response.data) {
                            const { message } = error.response.data;
                            errorToast({ text: message || "" });
                        } else {
                            errorToast({ text: error.message || "Terjadi kesalahan yang tidak terduga" });
                        }
                        onClose();
                        throw error;
                    },
                }
            )
        } catch (error) {
            onClose();
            console.error("Error during form submission:", error);
            setLoadingSinkron(false);
            throw error;
        }
    }

    return (
        <main className="flex flex-col gap-4 h-screen mb-24">
            <ConfirmAlert 
                isOpen={isOpen} 
                isLoading={loadingSinkron} 
                text={"Apakah anda yakin ingin menyinkronkan data anggota perpustakaan dengan data UNSURYA? Harap tidak merefresh halaman sebelum proses sinkronisasi selesai."} 
                onClose={onClose}
                confirmAction={() => handleSubmit()}
            />
            <BreadcrumbWithCustomSeparator icon={BsGear} />
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <h1 className='lg:text-lg md:text-base text-sm font-semibold'>Sinkronkan data anggota perpustakaan dengan data UNSURYA</h1>
                <Divider />
                <div className="flex items-center justify-between sm:flex-row flex-col gap-2">
                    <Button
                        size="sm"
                        radius="sm"
                        color="primary"
                        isLoading={loadingSinkron}
                        className="font-semibold flex items-center"
                        onPress={onOpen}
                    >
                        <TbPlugConnected /> Sinkronkan Data Anggota
                    </Button>
                </div>
            </div>
        </main>
    );
}
