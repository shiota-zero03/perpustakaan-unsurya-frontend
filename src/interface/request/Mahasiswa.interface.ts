export interface MahasiswaInterfaceErrorReq {
    profilePicture?: string | null;
    name?: string | null;
    nim?: string | null;
    gender?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    password?: string | null;
    status?: string | null;
    faculty?: string | null;
    department?: string | null;
    validUntil?: string | null;
}
export interface MahasiswaInterfaceReq {
    profilePicture?: File | null;
    name?: string | null;
    nim?: string | null;
    gender?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    password?: string | null;
    status?: string | null;
    faculty?: number | null;
    department?: number | null;
    validUntil?: string | null;
}