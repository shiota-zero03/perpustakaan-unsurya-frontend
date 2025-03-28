import { BaseRes } from "./base.interface";

export interface SettingListRes {
    profil: string | null;
    petunjuk: string | null;
    prosedur: string | null;
}

export interface ISettingDetailRes extends BaseRes {
    data: SettingListRes;
}