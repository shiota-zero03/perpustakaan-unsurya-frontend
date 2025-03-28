export interface NewsInterfaceReq {
    title?: string | null;
    author?: string | null;
    created?: string | null;
    picture?: File | null;
    content?: string | null;
}

export interface NewsInterfaceErrorReq {
    title?: string | null;
    author?: string | null;
    created?: string | null;
    picture?: string | null;
    content?: string | null;
}