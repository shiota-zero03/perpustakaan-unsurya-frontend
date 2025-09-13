export interface IRegisterReq {
    email?: string;
    password?: string;
    name?: string;
    identityNumber?: string;
    accountType?: string;
}

export interface ILoginReq {
    username?: string;
    password?: string;
}

export interface IResetReq {
    email?: string;
    token?: string;
    new_password?: string;
    confirmation_password?: string;
}