export interface PetugasInterfaceErrorReq {
    id?: string | null;
    profilePicture?: string | null;
    name?: string | null;
    gender?: string | null;
    email?: string | null;
    password?: string | null;
    status?: string | null;
    position?: string | null;
}
export interface PetugasInterfaceReq {
    id?: string | null;
    profilePicture?: File | null;
    name?: string | null;
    gender?: string | null;
    email?: string | null;
    password?: string | null;
    status?: string | null;
    position?: string | null;
}