import { FaList } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";

import UserImage from "@/assets/images/buku.png";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { NewsInterfaceErrorReq, NewsInterfaceReq } from "@/interface/request/News.interface";
import { useStoreNews } from "@/services/news";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, SimpleUploadAdapter } from "ckeditor5";
import { ckPlugins, ckToolbar } from "@/constants/CkEditorPlugin";

export default function TambahNews(){

    const BASE_URL: string = import.meta.env.VITE_HTTP_API;

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<NewsInterfaceReq>({
        title: null,
        author: null,
        created: null,
        picture: null,
        content: null,
    })

    const [ formDataError, setFormDataError ] = useState<NewsInterfaceErrorReq>({})

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        setFormData({
            title: null,
            author: null,
            created: null,
            picture: null,
            content: null,
        });
        setPreviewImage(null);
        setFormDataError({})
    }, [])
    
    const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, picture: file });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, picture: null });
            setPreviewImage(null);
        }
    }

    const [ loadingSend, setLoadingSend ] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {mutate: mutatePost} = useStoreNews();
    const handleSubmit = () => {
        setLoadingSend(true)
        setFormDataError({})

        const formDataSend = new FormData();
        formData.picture && formDataSend.append("picture", formData.picture);
        formData.title && formDataSend.append("title", formData.title);
        formData.author && formDataSend.append("author", formData.author);
        formData.created && formDataSend.append("created", formData.created);
        formData.content && formDataSend.append("content", formData.content);

        try {
            mutatePost(
                formDataSend,
                {
                    onSuccess: (res) => {
                        successToast({text: res.message})
                        isFinished()
                        navigate('/cms/berita-informasi')
                        
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { data, status } = error.response;
                            const { message, errors } = data;

                            errorToast({ text: message || "Terjadi kesalahan yang tidak terduga" });
                            if(status === 422) {
                                setFormDataError({
                                    ...formDataError,
                                    title: errors.title || "",
                                    author: errors.author || "",
                                    created: errors.created || "",
                                    picture: errors.picture || "",
                                    content: errors.content || "",
                                })
                            }
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
        setLoadingSend(false);
        onClose();
    }

    return (
        <main className="flex flex-col gap-4">
            <ConfirmAlert 
                isOpen={isOpen} 
                isLoading={loadingSend} 
                text={"Apakah anda yakin untuk menyimpan data ini ?"} 
                onClose={onClose}
                confirmAction={() => handleSubmit()}
            />
            <BreadcrumbWithCustomSeparator icon={FaList} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">FORM TAMBAH BERITA</h1>
                </div>
                <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-4">
                    <div className="col-span-1">
                        <div className="border border-primary rounded-md flex items center justify-center md:p-4 p-2 mb-2">
                            <img src={previewImage || UserImage} alt="user-image" loading="lazy" className={previewImage ? "w-full" : "w-1/2"} />
                        </div>
                        <input type="file" id="picture" className="hidden" onChange={handleChangeImage} accept=".jpg,.jpeg,.png" />
                        <label htmlFor="picture">
                            <div 
                                className="w-full border border-primary rounded-md font-semibold p-2 text-xs text-center text-primary cursor-pointer"
                            >
                                UPLOAD THUMBNAIL BERITA
                            </div>
                        </label>
                        <div className="text-danger italic text-xs">{formDataError.picture}</div>
                    </div>
                    <div className="lg:col-span-3 sm:col-span-2 col-span-1 flex flex-col gap-1 -mt-2">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="title" className="text-primary font-semibold text-sm">Judul Berita</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="title"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="news title here"
                                    value={formData.title || ""}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.title}</div>
                            </div>
                            <div>
                                <label htmlFor="author" className="text-primary font-semibold text-sm">Nama Penulis</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="author"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="author name here"
                                    value={formData.author || ""}
                                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.author}</div>
                            </div>
                            <div>
                                <label htmlFor="created" className="text-primary font-semibold text-sm">Waktu Berita</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    type="datetime-local"
                                    id="created"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="created date here"
                                    value={formData.created || ""}
                                    onChange={(e) => setFormData({...formData, created: e.target.value})}
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.created}</div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="content" className="text-primary font-semibold text-sm">Isi Berita</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={formData.content || ""}
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
                                        setFormData({...formData, content: editor.getData()});
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.content}</div>
                            </div>
                        </div>
                        <div className="pt-2 pb-6">
                            <Button
                                onPress={onOpen}
                                isLoading={loadingSend}
                                variant="bordered"
                                color="primary"
                                size="sm"
                                className="w-full border rounded font-semibold"
                            >
                                SIMPAN
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}