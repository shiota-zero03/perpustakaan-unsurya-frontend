import BreadcrumbWithCustomSeparator from '@/components/Breadcrumb';
import { ckPlugins, ckToolbar } from '@/constants/CkEditorPlugin';
import { SettingInterfaceReq } from '@/interface/request/Setting.interface';
import { BaseErrorRes } from '@/interface/response/base.interface';
import { useGetDetailSetting, useUpdateSetting } from '@/services/setting';
import { errorToast, successToast } from '@/utils/toastMessage';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Spinner, Tab, Tabs } from '@nextui-org/react';
import { AxiosError } from 'axios';
import {
  ClassicEditor,
  SimpleUploadAdapter
} from 'ckeditor5';
import { useEffect, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { FaList } from 'react-icons/fa6';

export default function DataProfilPerpustakaan() {

    const BASE_URL: string = import.meta.env.VITE_HTTP_API;
    const [ loading, setLoading ] = useState<boolean>(false);

    const [ formData, setFormData ] = useState<SettingInterfaceReq>({
        profil: "",
        petunjuk: "",
        prosedur: ""
    });

    const { data, isFetching, refetch } = useGetDetailSetting();

    const DATA_SETTING = useMemo(() => {
        if(!data) return null;
        return data.data;
    }, [data, isFetching])

    useEffect(() => {
        if(DATA_SETTING) {
            setFormData({
                profil: DATA_SETTING.profil || "",
                petunjuk: DATA_SETTING.petunjuk || "",
                prosedur: DATA_SETTING.prosedur || "",
            })
        }
    }, [data, isFetching, DATA_SETTING])

    useEffect(() => {
        refetch();
    }, [])

    const { mutate: mutatePost } = useUpdateSetting();

    const handleSubmit = () => {
        setLoading(true)
        try {
            mutatePost(
                formData,
                {
                    onSuccess: (res) => {
                        successToast({ text: res.message || "Data berhasil ditambahkan" })
                        setTimeout(() => {
                            setLoading(false);
                            refetch();
                        }, 500);
                        
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        setLoading(false);
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
            setLoading(false);
            throw error;
        }
    }

    return (
        <main className="flex flex-col gap-4 h-screen mb-24">
            <BreadcrumbWithCustomSeparator icon={FaList} />
            <Tabs 
                fullWidth 
                aria-label="Profil Perpustakaan"
                size="md"
                color='primary'
                classNames={{
                    tabList: "bg-white m-0 border shadow rounded-md",
                    tab: "!text-white m-0",
                    panel: "bg-white p-4 border shadow rounded-md flex flex-col gap-4",
                    tabContent: "text-primary m-0",
                }}
            >
                <Tab 
                    key="profil" 
                    title="Profil"
                >
                    <div className='relative'>
                        <div className="flex justify-end mb-2">
                            <Button
                                isLoading={loading}
                                onPress={handleSubmit}
                                size='sm'
                                className='bg-secondary text-white flex items-center justify-center font-medium rounded-md'
                            >
                                <FaSave /> Simpan
                            </Button>
                        </div>
                        {isFetching ? (
                            <div className="absolute inset-0 bg-slate-50/10 z-30 flex items-center justify-center">
                                <Spinner size="lg" className="scale-150" />
                            </div>
                        ) : null}
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.profil}
                            config={{
                                extraPlugins: [SimpleUploadAdapter],
                                toolbar: ckToolbar,
                                plugins: ckPlugins,
                                image: {
                                    toolbar: [ 'imageTextAlternative', 'imageStyle:full', 'imageStyle:side' ],
                                    upload: {
                                        types: [ 'jpeg', 'png', 'gif', 'bmp', 'webp' ]
                                    }
                                },
                                simpleUpload: {
                                    uploadUrl: `${BASE_URL}/upload-image`,
                                }
                            }}
                            onChange={(_event, editor) => {
                                setFormData({...formData, profil: editor.getData()});
                            }}
                        />
                    </div>
                </Tab>
                <Tab key="petunjuk" title="Petunjuk">
                    <div className='relative'>
                        <div className="flex justify-end mb-2">
                            <Button
                                isLoading={loading}
                                onPress={handleSubmit}
                                size='sm'
                                className='bg-secondary text-white flex items-center justify-center font-medium rounded-md'
                            >
                                <FaSave /> Simpan
                            </Button>
                        </div>
                        {isFetching ? (
                            <div className="absolute inset-0 bg-slate-50/10 z-30 flex items-center justify-center">
                                <Spinner size="lg" className="scale-150" />
                            </div>
                        ) : null}
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.petunjuk}
                            config={{
                                extraPlugins: [SimpleUploadAdapter],
                                toolbar: ckToolbar,
                                plugins: ckPlugins,
                                image: {
                                    toolbar: [ 'imageTextAlternative', 'imageStyle:full', 'imageStyle:side' ],
                                    upload: {
                                        types: [ 'jpeg', 'png', 'gif', 'bmp', 'webp' ]
                                    }
                                },
                                simpleUpload: {
                                    uploadUrl: `${BASE_URL}/upload-image`,
                                }
                            }}
                            onChange={(_event, editor) => {
                                setFormData({...formData, petunjuk: editor.getData()});
                            }}
                        />
                    </div>
                </Tab>
                <Tab key="prosedur" title="Prosedur">
                    <div className='relative'>
                        <div className="flex justify-end mb-2">
                            <Button
                                isLoading={loading}
                                onPress={handleSubmit}
                                size='sm'
                                className='bg-secondary text-white flex items-center justify-center font-medium rounded-md'
                            >
                                <FaSave /> Simpan
                            </Button>
                        </div>
                        {isFetching ? (
                            <div className="absolute inset-0 bg-slate-50/10 z-30 flex items-center justify-center">
                                <Spinner size="lg" className="scale-150" />
                            </div>
                        ) : null}
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.prosedur}
                            config={{
                                extraPlugins: [SimpleUploadAdapter],
                                toolbar: ckToolbar,
                                plugins: ckPlugins,
                                image: {
                                    toolbar: [ 'imageTextAlternative', 'imageStyle:full', 'imageStyle:side' ],
                                    upload: {
                                        types: [ 'jpeg', 'png', 'gif', 'bmp', 'webp' ]
                                    }
                                },
                                simpleUpload: {
                                    uploadUrl: `${BASE_URL}/upload-image`,
                                }
                            }}
                            onChange={(_event, editor) => {
                                setFormData({...formData, prosedur: editor.getData()});
                            }}
                        />
                    </div>
                </Tab>
            </Tabs>
        </main>
    );
}
