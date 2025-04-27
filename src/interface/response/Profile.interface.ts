import { BaseRes } from "./base.interface";

export interface GetProfileInterface extends BaseRes {
    data: {
        id: number;
        userId: string;
        name: string;
        email: string;
        identityNumber: string | null;
        status: string;
        student?: {
            id: number;
            userId: number;
            profilePicture: string | null;
            gender: string | null;
            position?: string | null;
            phoneNumber?: string | null;
            validUntil?: string | null;
            facultyId?: number;
            studyProgramId?: number;
            faculty?: {
                id: number;
                name: string;
                code: string;
            } | null;
            studyProgram?: {
                id: number;
                name: string;
                code: string;
            } | null;
        } | null;
        teacher?: {
            id: number;
            userId: number;
            profilePicture: string | null;
            gender: string | null;
            phoneNumber?: string | null;
            validUntil?: string | null;
        } | null;
        admin?: {
            userId: number;
            profilePicture: string | null;
            gender: string | null;
            position?: string | null;
        } | null;
    }
};