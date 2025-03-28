import Background from "@/assets/images/backgroundlanding.jpg"
import { useGetSetting } from "@/services/landing-page";
import { useMemo } from "react";
import { Card, CardBody, CardHeader, Divider, Spinner } from "@nextui-org/react";

export default function Petunjuk(){
    const { data, isFetching } = useGetSetting();
    const FETCHING_DATA = useMemo(() => {
        return data ? data.data : null
    }, [data]);

    return (
        <div className="bg-[#e0e0e0]">
            <div className="relative md:h-[32rem] h-60 bg-danger">
                <img src={Background} alt="Background-landing-page" className="h-full object-cover" />
                <div className="bg-black/20 absolute inset-0"></div>
                <div className="absolute bottom-0 bg-black/20 backdrop-blur-lg w-full px-4 sm:py-8 py-4 text-white sm:text-2xl font-medium">
                    Petunjuk Perpustakaan
                </div>
            </div>
            <div className="text-center lg:py-20 py-10 xl:px-52 lg:px-36 md:px-28 sm:px-16 px-8 xl:text-xl lg:text-lg sm:text-base text-sm relative">
                {isFetching ? (
                    <div className="w-full flex items-center justify-center bg-slate-50/20 inset-0 py-8 h-[40vh]">
                        <Spinner className="scale-150" />
                    </div>
                ) : (
                    <Card radius="sm" shadow="sm">
                        <CardHeader className="text-center font-medium md:text-xl md:p-6 text-lg p-4 flex items-center justify-center">Petunjuk Perpustakaan</CardHeader>
                        <Divider />
                        <CardBody className="md:p-8 p-4 text-sm text-justify">
                            <div dangerouslySetInnerHTML={{ __html: FETCHING_DATA?.petunjuk || "" }} />
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    )
}