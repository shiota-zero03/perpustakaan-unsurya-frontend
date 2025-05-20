import instance from "@/api/axios";
import VisitorPost from "@/interface/request/Visitor";
import { IListVisitorRes, IVisitorRes } from "@/interface/response/Visitor.interface";

export const getListVisitor = async (
    limit: number | null,
    page: number | null,
    identityNumber: string | null,
    name: string | null,
    date: string | null,
    end: string | null
): Promise<IListVisitorRes> => {
    const params = new URLSearchParams();
  
    if (page) params.set("page", page.toString());
    if (limit) params.set("limit", limit.toString());
    if (identityNumber) params.set("identityNumber", identityNumber);
    if (name) params.set("name", name);
    if (date) params.set("date", date);
    if (end) params.set("end", end);
  
    const link = `/visitor?${params.toString()}`;
    const response = await instance.get(link);
    return response.data;
};

export const storeVisitor = async (data: VisitorPost): Promise<IVisitorRes> => {
    const response = await instance.post(`/visitor`, data);
    return response.data;
};