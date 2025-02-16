import { ButtonBordered } from "@/components/UI/button";
import { Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Pengunjung from "./Pengunjung";

export default function Visitor () {

    const [ selectedTab, setSelectedTab ] = useState<string>('pengunjung')
    const navigate = useNavigate()

    return (
        <div className="w-full md:h-[85vh] h-[90vh] bg-white relative">
            <div className="absolute w-full flex sm:items-end items-center sm:flex-row flex-col justify-between top-0 pt-2 px-4 border-b-2 border-primary bg-white">
                <div className="mb-2">
                    <ButtonBordered className="text-primary text-sm border-primary font-bold h-10" content="Back" startContent={<BiSolidLeftArrowCircle className="text-primary sm:text-xl text-base" />} onPress={() => navigate('/auth')} />
                </div>
                <div>
                    <Tabs 
                        color="primary"
                        variant="light"
                        classNames={{
                            base: 'rounded-t-xl border-t-2 border-x-2 border-primary bg-white',
                            tabContent: 'text-primary font-semibold'
                        }}
                        selectedKey={selectedTab}
                        onSelectionChange={(e) => setSelectedTab(String(e))}
                    >
                        <Tab key={'pengunjung'} title="Pengunjung"></Tab>
                        <Tab key={'cari-buku'} title="Cari Buku"></Tab>
                    </Tabs>
                </div>
            </div>
            <div className="relative w-full sm:top-20 top-28 h-[70vh] overflow-y-auto overflow-smooth-primary">
                {selectedTab === 'pengunjung' ? <Pengunjung /> : null}
            </div>
        </div>
    )
}