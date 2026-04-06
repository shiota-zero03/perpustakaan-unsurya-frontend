import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface IVisitorRes extends BaseRes {
    data: {
        name: string;
        activity: string;
    }
}

export interface ListVisitorRes {
    id: number;
    member: string | null;
    name: string | null;
    activity: string | null;
    time: string | null;
    prodi: string | null;
}

export interface IListVisitorRes extends BaseRes {
    data: {
        data: ListVisitorRes[];
        pagination: PaginationBaseRes;
    }
}