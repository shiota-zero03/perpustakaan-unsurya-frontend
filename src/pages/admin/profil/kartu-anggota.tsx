import store from "@/redux/store";
import { useGetProfile } from "@/services/profile";
import { useEffect, useMemo } from "react";
import KartuAnggotaNahasiswa from "./ka-mahasiswa";
import { useNavigate } from "react-router-dom";
import { errorToast } from "@/utils/toastMessage";
import KartuAnggotaDosen from "./ka-dosen";

export default function UpdateProfil(){

    const { role } = store.getState().auth;

    const { data, isFetching, refetch, error } = useGetProfile()
    
    const navigate = useNavigate()

    const dataFetching = useMemo(() => {
        return data ? data.data : null;
    }, [data]);

    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if(!isFetching && error) {
            navigate('/');
            errorToast({ text: "Data tidak ditemukan" })
        }
    }, [isFetching])

    return role === "Student" ? <KartuAnggotaNahasiswa id={dataFetching?.userId ? String(dataFetching?.userId) : ""} /> : (
        role === "Teacher" ? <KartuAnggotaDosen id={dataFetching?.userId ? String(dataFetching?.userId) : ""} /> : null
    );
}