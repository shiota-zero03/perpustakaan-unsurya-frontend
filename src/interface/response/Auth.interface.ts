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
      accessToken: string;
      refreshToken: string;
      role?: string;
    };
  }