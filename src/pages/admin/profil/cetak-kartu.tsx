import store from "@/redux/store";
import CetakKartuMahasiswa from "./CetakKartuMahasiswa";
import CetakKartuDosen from "./CetakKartuDosen";

export default function UpdateProfil(){

    const { role } = store.getState().auth;

    return role === "Student" ? <CetakKartuMahasiswa /> : (
        role === "Teacher" ? <CetakKartuDosen /> : null
    );
}