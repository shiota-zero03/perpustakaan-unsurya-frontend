import { BaseRes } from "./base.interface";

export interface OptionIDNameRes {
    id: string;
    name: string | null;
}

export interface IOptionIDNameRes extends BaseRes {
    data: OptionIDNameRes[];
}


export interface OptionAnggotaRes {
    id: string;
    name: string | null;
    identityNumber: string | null;
}

export interface IOptionAnggotaRes extends BaseRes {
    data: OptionAnggotaRes[];
}


export interface OptionBukuRes {
    id: string;
    type: string | null;
    book_id: string | null;
    judul: string | null;
    penulis: string | null;
}

export interface IOptionBukuRes extends BaseRes {
    data: OptionBukuRes[];
}