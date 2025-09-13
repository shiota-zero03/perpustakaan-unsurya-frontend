import Logo from "@/assets/images/logo.png";
import ExportBottom from "@/assets/images/export-bottom.png";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import Barcode from "react-barcode";
import { formatDateDMYIn } from "@/utils/dateFormat";

interface props {
    id: string;
    name: string | null;
    email: string | null;
    nidn: string | null;
    status: string | null;
    gender: string | null;
    phone_number: string | null;
    valid_until: string | null;
    waktu_terdaftar: string | null;
    profile_picture: string | null;
}
export const KartuDosen = ({dataFetching}: {dataFetching: props | null}) => {
    return (
        <>
          <Card shadow="none" className="w-[84.0mm] h-[52.38mm] border border-primary m-[0.8mm] relative overflow-hidden">
            <CardHeader className="w-full">
              <div className="flex items-center justify-between w-full">
                <img
                  src={Logo}
                  alt="Foto"
                  className="w-10 h-11"
                />
                <div className="text-[6.5pt] text-center text-secondary">
                  <h1 className="font-bold -mb-0.5 text-primary">Kartu Anggota Perpustakaan</h1>
                  <h1 className="font-bold mb-1 text-primary">Universitas Dirgantara Marsekal Suryadarma</h1>
                  <p className="text-[5.5pt] font-normal text-primary">Jl. Halim Perdana Kusuma No.1 - Jakarta Timur</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="overflow-hidden">
              <div className="flex items-center text-primary text-[6.5pt]">
                <h1 className="font-semibold w-20">Nama Anggota</h1>
                <span className="font-semibold">:</span>
                <h1 className="font-semibold">&nbsp;{dataFetching?.name}</h1>
              </div>
              <div className="flex items-center text-primary text-[6.5pt]">
                <h1 className="font-semibold w-20">ID Anggota</h1>
                <span className="font-semibold">:</span>
                <h1 className="font-semibold">&nbsp;{dataFetching?.nidn}</h1>
              </div>
              <div className="flex items-center text-primary text-[6.5pt]">
                <h1 className="font-semibold w-20">Jenis Kelamin</h1>
                <span className="font-semibold">:</span>
                <h1 className="font-semibold">&nbsp;{dataFetching?.gender}</h1>
              </div>
            </CardBody>
            <CardFooter>
               <div className="relative z-10 flex items-end justify-end w-full">
                 
                <div>
                  <p className="text-[5pt] text-primary font-normal">Jakarta, {formatDateDMYIn(new Date().toDateString())}</p>
                  <br />
                  <p className="text-[5pt] text-primary italic font-semibold">Kepala Perpustakaan UNSURYA</p>
                </div>
              </div>
              <img src={ExportBottom} alt="export-bottom" className="w-full absolute bottom-0 left-0 z-0" />
            </CardFooter>
          </Card>
          <Card shadow="none" className="w-[84.0mm] h-[52.38mm] border border-primary m-[0.8mm] relative overflow-hidden">
            <img src={ExportBottom} alt="export-bottom" className="w-full absolute top-0 left-0 z-0 scale-[-1]" />
            <CardBody className="overflow-hidden flex items-center justify-center">
              <div className="w-[70mm] mt-2 overflow-hidden flex items-center justify-center">
                <Barcode 
                  value={dataFetching?.nidn || ""}
                  format="CODE128"
                  background="transparent"
                  fontSize={10}
                  textMargin={1}
                  height={50}
                  displayValue={true}
                  lineColor="#085C94"
                />  
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex items-center justify-between w-full gap-4 mb-2">
                <img
                  src={Logo}
                  alt="Foto"
                  className="w-10 h-11"
                />
                <div className="text-[6.5pt] text-justify text-secondary">
                  <p className="text-[4pt] text-primary font-medium">Kartu ini harap disimpan baik baik dan apabila hilang agar segera melapor ke pihak yang berwajib dan melakukan pembayaran denda kehilangan</p>
                  <p className="text-[4pt] text-primary font-medium my-0.5">Kartu hanya dapat digunakan di lingkungan perpustakaan Universitas Dirgantara Marsekal Suryadarma serta tidak digunakan sebagai alat tukar menukar</p>
                  <p className="text-[4pt] text-primary font-medium">Penggunaan kartu ini diatur sedemikian rupa dan tunduk pada aturan perpustakaan Universitas Dirgantara Marsekal Suryadarma</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </>
    )
}