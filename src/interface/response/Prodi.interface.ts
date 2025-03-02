import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface ProdiListRes {
    id: number;
    name: string | null;
    code: string | null;
    fakultas_id: number;
    fakultas: {
        id: number;
        name: string;
        code: string;
    }
}

export interface IProdiListRes extends BaseRes {
    data: {
        data: ProdiListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IProdiDetailRes extends BaseRes {
    data: {
        id: string;
        name: string | null;
        code: string | null;
        fakultas_id: number;
        fakultas: {
            id: number;
            name: string;
            code: string;
        }
    }
}