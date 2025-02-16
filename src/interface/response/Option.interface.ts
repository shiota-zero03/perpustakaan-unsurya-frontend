import { BaseRes } from "./base.interface";

export interface OptionIDNameRes {
    id: string;
    name: string | null;
}

export interface IOptionIDNameRes extends BaseRes {
    data: OptionIDNameRes[];
}