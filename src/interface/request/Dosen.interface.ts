export interface DosenInterfaceErrorReq {
    profilePicture?: string | null;
    name?: string | null;
    nidn?: string | null;
    gender?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    password?: string | null;
    status?: string | null;
    validUntil?: string | null;
}

export interface DosenInterfaceReq {
    profilePicture?: File | null;
    name?: string | null;
    nidn?: string | null;
    gender?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    password?: string | null;
    status?: string | null;
    validUntil?: string | null;
}