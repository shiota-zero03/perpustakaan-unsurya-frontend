import Logo from "@/assets/images/logo.png";
import { ButtonSolid } from "@/components/UI/button";
import { LibraryActivity } from "@/constants/Visitor";
import VisitorPost from "@/interface/request/Visitor";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { useStoreVisitor } from "@/services/visitor";
import { errorToast } from "@/utils/toastMessage";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useState } from "react";
const Pengunjung = () => {

    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ isSend, setIsSend ] = useState<boolean>(false)
    const [ visitName, setVisitName ] = useState<string>('')

    const [formData, setFormData] = useState<VisitorPost>({
        type: '',
        member: '',
        email: '',
        name: '',
        activity: ''
    });

    const [formDataError, setFormDataError] = useState<VisitorPost>({});

    const { mutate: mutatePost } = useStoreVisitor();

    const sendData = () => {
        setIsLoading(true);
        setFormDataError({})

        try {
            mutatePost(
                formData,
                {
                    onSuccess: (res) => {
                        setVisitName(res.data.name)
                        isFinished()
                        setFormData({
                            member: '',
                            activity: ''
                        })
                        setIsSend(true)
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { data, status } = error.response;
                            const { errors, message } = data;
                            errorToast({ text: message || "" });

                            if(status === 422) {
                                setFormDataError({
                                    ...formDataError,
                                    type: errors.type,
                                    member: errors.member,
                                    activity: errors.activity
                                })
                            }
                        } else {
                            errorToast({ text: error.message || "Terjadi kesalahan yang tidak terduga" });
                        }
                        
                        throw error;
                    },
                }
            )
        } catch (error) {
            console.error("Error during form submission:", error);
            isFinished()
            throw error;
        }
    }

    const isFinished = () => {
        setIsLoading(false);
    }

    if(!isSend) {
        return(
            <section className="flex items-center justify-center flex-col gap-2 w-[94%] mx-auto">
                <div>
                    <img src={Logo} alt="logo-unsurya" loading="lazy" className="sm:w-32 w-28 mb-4" />
                </div>
                <form 
                    className="w-full flex flex-col gap-2"
                    onSubmit={
                        (e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            sendData()
                        }
                    }
                >
                    <div className="w-full">
                        <div>
                            <label htmlFor="member" className="font-bold text-primary text-sm">Tipe Pengunjung</label>
                        </div>
                        <Select
                            id="type"
                            selectedKeys={[formData.type || ""]}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            variant="bordered"
                            aria-label="member"
                            labelPlacement="outside"
                            radius="sm"
                            className="w-full"
                            placeholder="Pilih tipe pengunjung"
                            color="primary"
                            classNames={{
                                trigger: 'border-primary'
                            }}
                        >
                            <SelectItem key={"Akademisi"}>Akademisi (Dosen / Mahasiswa)</SelectItem>
                            <SelectItem key={"Umum"}>Umum</SelectItem>
                        </Select>
                        <div className="-mt-1"><small><em className="text-danger">{formDataError.type}</em></small></div>
                    </div>
                    {formData.type === "Akademisi" && (
                        <div className="w-full">
                            <div>
                                <label htmlFor="member" className="font-bold text-primary text-sm">Nomor Identitas</label>
                            </div>
                            <Input
                                id="member"
                                value={formData.member || ""}
                                onChange={(e) => setFormData({...formData, member: e.target.value})}
                                type="text"
                                variant="bordered"
                                aria-label="member"
                                labelPlacement="outside"
                                radius="sm"
                                className="w-full"
                                placeholder="Nomor Identitas anda disini"
                                color="primary"
                                classNames={{
                                    base: 'flex justify-center',
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                }}
                            />
                            <div className="-mt-1"><small><em className="text-danger">{formDataError.member}</em></small></div>
                        </div>
                    )}
                    {formData.type === "Umum" && (
                        <div className="w-full">
                            <div>
                                <label htmlFor="member" className="font-bold text-primary text-sm">Nama</label>
                            </div>
                            <Input
                                id="name"
                                value={formData.name || ""}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                type="text"
                                variant="bordered"
                                aria-label="member"
                                labelPlacement="outside"
                                radius="sm"
                                className="w-full"
                                placeholder="Nama anda disini"
                                color="primary"
                                classNames={{
                                    base: 'flex justify-center',
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                }}
                            />
                            <div className="-mt-1"><small><em className="text-danger">{formDataError.name}</em></small></div>
                        </div>
                    )}
                    {formData.type === "Umum" && (
                        <div className="w-full">
                            <div>
                                <label htmlFor="member" className="font-bold text-primary text-sm">Email</label>
                            </div>
                            <Input
                                id="email"
                                value={formData.email || ""}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                type="text"
                                variant="bordered"
                                aria-label="member"
                                labelPlacement="outside"
                                radius="sm"
                                className="w-full"
                                placeholder="Email anda disini"
                                color="primary"
                                classNames={{
                                    base: 'flex justify-center',
                                    inputWrapper: 'border-primary text-primary',
                                    input: 'text-primary italic font-semibold placehorder:text-primary placeholder:font-italic',
                                }}
                            />
                            <div className="-mt-1"><small><em className="text-danger">{formDataError.email}</em></small></div>
                        </div>
                    )}
                    <div className="w-full">
                        <div>
                            <label htmlFor="type" className="font-bold text-primary text-sm">Kegiatan di Perpustakaan</label>
                        </div>
                        <Select
                            id="type"
                            variant="bordered"
                            aria-label="type"
                            labelPlacement="outside"
                            radius="sm"
                            className="w-full"
                            placeholder="--- Pilih Kegiatan di Perpustakaan ---"
                            color="primary"
                            classNames={{ 
                                trigger: 'border-primary'
                            }}
                            selectedKeys={[formData.activity || ""]}
                            onChange={(e) => setFormData({...formData, activity: e.target.value})}
                        >
                            {LibraryActivity.map(item => (
                                <SelectItem key={item.key} value={item.key}>{item.name}</SelectItem>
                            ))}
                        </Select>
                        <div className="-mt-1"><small><em className="text-danger">{formDataError.activity}</em></small></div>
                    </div>
                    <div className="max-w-72 w-[90%] mx-auto sm:mt-4 mt-2">
                        <ButtonSolid isLoading={isLoading} radius="full" className="bg-primary text-sm text-white font-medium h-9 w-full" content="Simpan" type="submit" />
                    </div>
                </form>
            </section>
        )
    } else {
        setTimeout(() => {
            setIsSend(false)
        }, 2000);
        return (
            <section className="flex items-center justify-center flex-col gap-2 w-[94%] mx-auto mt-12">
                <div>
                    <img src={Logo} alt="logo-unsurya" loading="lazy" className="sm:w-32 w-28 mb-4" />
                </div>
                <div className="text-center">
                    <h1 className="sm:text-2xl text-lg font-bold text-primary">Halo, {visitName}</h1>
                    <h1 className="sm:text-2xl text-lg font-bold text-primary">Terimakasih telah mengunjungi perpustakaan UNSURYA</h1>
                </div>
            </section>
        )
    }
}

export default Pengunjung;