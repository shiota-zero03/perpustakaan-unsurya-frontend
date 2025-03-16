import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface BannerListRes {
    id: number;
    title: string;
    subtitle: string | null;
    picture: string | null;
}

export interface IBannerListRes extends BaseRes {
    data: {
        data: BannerListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IBannerDetailRes extends BaseRes {
    data: BannerListRes;
}