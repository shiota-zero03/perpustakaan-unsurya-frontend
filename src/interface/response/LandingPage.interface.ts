import { BaseRes } from "./base.interface";

export interface BannerRes {
    picture: string;
    title: string | null;
    subtitle: string | null;
}

export interface IBannerRes extends BaseRes {
    data: BannerRes[];
}