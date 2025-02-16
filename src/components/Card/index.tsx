import { Card, CardBody, CardFooter, CardHeader, DateRangePicker, DateValue, Divider, RangeValue } from "@nextui-org/react"
import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import { IconType } from "react-icons/lib";
import { Outlet, useNavigate } from "react-router-dom";
import {parseDate} from "@internationalized/date";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormat";
import { ButtonSolid } from "../UI/button";

interface CardDashboard {
    text: string;
    count: number;
    icon: IconType;
}

export const CardDashboard = ({ text, count, icon: Icon }: CardDashboard) => {

    return (
        <Card shadow="none" radius="sm" className="drop-shadow-[0_4px_1px_rgba(0,0,0,0.25)]">
            <CardBody>
                <div className="relative lg:p-2 p-1">
                    <div className="flex flex-col">
                        <div className="text-primary font-medium lg:text-base text-xs">{text}</div>
                        <div className="lg:text-3xl text-lg font-bold text-primary">{count}</div>
                    </div>
                    <div className="absolute right-2 top-[50%] -translate-y-[50%]">
                        <Icon size={36} className="text-primary/50" />
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

interface CardHarianDashboard {
    text: string;
    count: string;
    percentase: string;
    category: 'up' | 'down';
}

export const CardDashboardHarian = ({ text, count, percentase, category }: CardHarianDashboard) => {

    return (
        <Card shadow="none" radius="sm" className="drop-shadow-[0_4px_1px_rgba(0,0,0,0.25)]">
            <CardBody>
                <div className="relative lg:p-2 p-1">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="text-primary font-medium xl:text-base text-xs">{text}</div>
                            <div className="lg:flex sm:hidden flex items-center">
                                {category === 'up' ? <BiCaretUp className={`text-primary mt-0.5`} /> : <BiCaretDown className={`text-danger`} /> }
                                <span className={`text-xs font-semibold ${category === 'up' ? 'text-primary' : 'text-danger'}`}>{percentase} %</span>
                            </div>
                        </div>
                        <div className="xl:text-2xl text-base font-bold text-primary">{count}</div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

interface CardDashboardChartInterface {
    title: string;
    desc?: string;
    startDate: Date;
    endDate: Date;
    onChangeDate: (newDate: RangeValue<DateValue> | null) => void;
    linkText: string;
    linkUrl: string;
}
export const CardDashboardChart = ({ title, desc, startDate, endDate, onChangeDate, linkText, linkUrl } : CardDashboardChartInterface) => {

    const navigate = useNavigate();

    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(formatDate(startDate)),
        end: parseDate(formatDate(endDate)),
    });

    useEffect(() => {   
        setDate({
            start: parseDate(formatDate(startDate)),
            end: parseDate(formatDate(endDate)),
        })
    }, [startDate, endDate])

    return (
        <Card shadow="none" radius="sm" className="drop-shadow-[0_4px_1px_rgba(0,0,0,0.25)]">
            <CardHeader>
                <div className="grid xl:grid-cols-5 grid-cols-1 gap-2 items-center justify-between w-full">
                    <div className="xl:col-span-3 flex flex-col">
                        <span className="text-primary font-semibold xl:text-xl sm:text-base text-sm">{title}</span>
                        <span className="text-primary font-medium italic md:text-sm text-xs">{desc}</span>
                    </div>
                    <DateRangePicker
                        aria-label="select-date"
                        variant="bordered"
                        color="primary"
                        radius="sm"
                        selectorButtonPlacement="start"
                        showMonthAndYearPickers={true}
                        disableAnimation={true}
                        value={date}
                        onChange={(newDate) => onChangeDate(newDate)}
                        className="text-primary oveflow-hidden xl:col-span-2"
                        classNames={{
                            inputWrapper: 'border border-primary text-primary text-xs',
                            base: 'overflow-hidden text-xs',
                            calendar: 'text-xs'
                        }}
                    />
                </div>
            </CardHeader>
            <Divider className="bg-primary" />
            <CardBody>
                <Outlet />
            </CardBody>
            <CardFooter className="pb-6">
                <ButtonSolid onPress={() => navigate(linkUrl)} className={"bg-primary text-white text-sm h-8 mx-auto"} content={linkText} />
            </CardFooter>
        </Card>
    )
}