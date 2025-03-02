import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface FakultasListRes {
    id: number;
    name: string | null;
    code: string | null;
}

export interface IFakultasListRes extends BaseRes {
    data: {
        data: FakultasListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IFakultasDetailRes extends BaseRes {
    data: {
        id: string;
        name: string | null;
        code: string | null;
    }
}