import { BaseRes } from "./base.interface";

export interface IRegisterRes extends BaseRes {
    userId: string;
    email: string;
    name: string;
    identityNumber: string;
    accountType: string;
}

export interface ITokenRes extends BaseRes {
    data: {
      token: string;
      refresh: string;
      user: {
        user_id:string | null;
        nama:string | null;
        fakultas:string | null;
        prodi:string | null;
        jeniskelamin:string | null;
        no_telpon:string | null;
        email:string | null;
        email_kampus:string | null;
        status:string | null;
      };
      role?: string;
    };
  }