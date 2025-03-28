import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface NewsListRes {
    id: number;
    title: string;
    author: string;
    created: string;
    tags: string;
    picture: string;
    content: string;
    slug: string;
}

export interface INewsListRes extends BaseRes {
    data: {
        data: NewsListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface INewsDetailRes extends BaseRes {
    data: NewsListRes;
}