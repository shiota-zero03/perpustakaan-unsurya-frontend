import { FaCalendar, FaChevronRight, FaUser } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import UserImage from "@/assets/images/buku.png";
import { NewsInterfaceReq } from "@/interface/request/News.interface";
import { errorToast } from "@/utils/toastMessage";
import { formatedTimestamp } from "@/utils/dateFormat";
import { useGetDetailNews } from "@/services/landing-page";

export default function DetailNews(){

    const { slug } = useParams();
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<NewsInterfaceReq>({})
    const [ content, setContent ] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, isLoading, isFetching, refetch, error } = useGetDetailNews(slug || "")
    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data, slug]);
    
    useEffect(() => {
        if (dataFetching && Object.keys(dataFetching).length > 0) {
            setFormData({
                ...formData,
                title: dataFetching.title || "",
                author: dataFetching.author || "",
                created: dataFetching.created || "",
            });
            setContent(dataFetching.content || "")
            setPreviewImage(dataFetching.picture || null);
        }
    }, [dataFetching]);

    useEffect(() => {
        refetch()
    }, [])

    useEffect(() => {
        if(!isFetching && error) {
            navigate('/berita-informasi');
            errorToast({ text: "Data tidak ditemukan" })
        }
    }, [isFetching])

    return (
        <main className="flex flex-col gap-4 pt-24">
            {isLoading || isFetching ? (
                <div className="inset-0 fixed bg-black/10 z-10 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-[6px] border-t-4 h-20 w-20 mb-4" />
                </div>
            ) : null}
            <div className="flex items-center gap-2 text-sm lg:px-8 px-4">
                <Link to={'/berita-informasi'} className="text-primary">Berita dan Informasi</Link>
                <FaChevronRight size={10} className="text-primary" />
                <Link to={'#'}>{formData.title}</Link>

            </div>
            <hr />
            <div className="lg:px-8 px-4 flex flex-col gap-4 pb-4">
                    <h1 className="text-primary font-semibold md:text-lg">{formData.title}</h1>
                <div>
                    <div className="border border-primary rounded-md flex items center justify-center md:p-4 p-2 mb-2 max-h-[40rem] relative">
                        <img src={previewImage || UserImage} alt="user-image" loading="lazy" className="w-full min-h-full object-cover" />
                    </div>
                    <div className="border border-primary rounded-md md:p-4 p-2 mb-2 max-h-[30rem] relative">
                        <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2  md:text-sm text-xs text-primary">
                            <div className="flex items-center gap-2">
                                <FaUser /> {formData.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCalendar /> {formatedTimestamp(formData.created || "")}
                            </div>
                        </div>
                    </div>
                    <div className="border border-primary rounded-md flex items center justify-center md:p-4 p-2 mb-2 max-h-[30rem] relative">
                        <div dangerouslySetInnerHTML={{ __html: content || "" }} />
                    </div>
                </div>
            </div>
        </main>
    )
}