import Background from "@/assets/images/backgroundlanding.jpg";
import { useGetNews } from "@/services/landing-page";
import { useEffect, useState } from "react";
import { Card, Input, Spinner } from "@nextui-org/react";
import { NewsListRes } from "@/interface/response/News.interface";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCalendarCheck, FaUserAstronaut } from "react-icons/fa6";
import { formatedTimestampWitoutWeekday } from "@/utils/dateFormat";
import { Link, useLocation } from "react-router-dom";
import { FaRegFrownOpen, FaSearch } from "react-icons/fa";

export default function News() {
    const [news, setNews] = useState<NewsListRes[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [search2, setSearch2] = useState("");
    const [hasMore, setHasMore] = useState(true);

    const { data, isFetching } = useGetNews(12, page, search, null);

    useEffect(() => {
        if (data) {
            if (page === 1) {
                setNews(data.data.data);
            } else {
                setNews((prev) => [...prev, ...data.data.data]);
            }
            setHasMore(data.data.pagination.hasMore || false);
        }
    }, [data, page]);

    const loadMore = () => {
        if (!isFetching && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/berita") {
            setNews([]);
            setPage(1);
            setSearch("");
            setSearch2("");
        }
    }, [location.pathname]);

    const handleSearch = () => {
        setSearch(search2);
        setPage(1);    
        setNews([]);   
    };

    return (
        <div className="bg-[#e0e0e0]">
            <div className="relative md:h-[32rem] h-60 bg-danger">
                <img src={Background} alt="Background-landing-page" className="h-full object-cover" />
                <div className="bg-black/20 absolute inset-0"></div>
                <div className="absolute bottom-0 bg-black/20 backdrop-blur-lg w-full px-4 sm:py-8 py-4 text-white sm:text-2xl font-medium">
                    Berita dan Informasi
                </div>
            </div>
            <div className="text-center lg:py-20 py-10 sm:px-8 px-4 xl:text-xl lg:text-lg sm:text-base text-sm relative bg-white min-h-[80vh]">
                <div className="max-w-lg mx-auto mb-10">
                    <label htmlFor="search" className="font-medium text-primary">Cari Berita</label><br />
                    <Input
                        placeholder="Cari judul berita..."
                        value={search2}
                        onChange={(e) => setSearch2(e.target.value)}
                        radius="md"
                        variant="bordered"
                        className="mt-2"
                        classNames={{
                            inputWrapper: "border-primary",
                            input: "placehoder:text-primary placeholder:italic text-primary"
                        }}
                        endContent={<button onClick={handleSearch}><FaSearch className="text-primary" /></button>}
                        fullWidth
                    />
                </div>
                {news.length === 0 && !isFetching ? (
                    <div className="flex flex-col items-center text-primary">
                        <FaRegFrownOpen size={72} />
                        <span className="italic mt-2 sm:text-lg">Tidak ada berita ditemukan</span>
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={news.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={<Spinner className="scale-150 my-5" />}
                    >
                        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4">
                            {news.map((item) => (
                                <Card key={item.id} radius="sm" shadow="sm" className="border">
                                    <Link to={`/berita-informasi/${item.slug}`}>
                                        <div className="h-36 overflow-hidden rounded-sm relative">
                                            <img src={item.picture} alt="picture-news" loading="lazy" className="object-cover object-center" />
                                            <div className="absolute inset-0 bg-black/20"></div>
                                                <p className="absolute top-0 left-0 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium flex items-center gap-2">
                                                    <FaUserAstronaut />{item.author}
                                                </p>
                                                <div className="absolute bottom-0 right-0 text-xs px-2 py-1 bg-black/40 backdrop-blur-sm text-white rounded-md font-medium flex items-center gap-2">
                                                    <FaCalendarCheck /> {formatedTimestampWitoutWeekday(item.created)}
                                                </div>
                                        </div>
                                        <div className="text-justify p-4">
                                            <h2 className="sm:text-base text-sm font-medium">{item.title}</h2>
                                        </div>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
}
