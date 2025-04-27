import React, { useEffect, useMemo } from "react";
import { errorToast } from "@/utils/toastMessage";
import { useNavigate, useParams } from "react-router-dom";
import "@/assets/css/printBarcode.css";
import { Spinner } from "@nextui-org/react";
import { useGetDetailBukuFisik } from "@/services/buku-fisik";
import { QRCodeCanvas } from "qrcode.react";

const LibraryCard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching, refetch, error } = useGetDetailBukuFisik(id || "")
    
  const dataFetching = useMemo(() => {
    return data ? data.data : null;
  }, [data, id]);

  useEffect(() => {
    if(!isFetching && error) {
      navigate('/data-master/buku-fisik');
      errorToast({ text: "Data tidak ditemukan" })
    }
  }, [isFetching])

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    if (!isFetching && dataFetching) {
      // Tunggu render selesai dulu baru trigger print
      setTimeout(() => {
        window.print();
      }, 500);

      // Setelah print ditutup, close tab
      const handleAfterPrint = () => {
        window.close();
      };

      window.addEventListener("afterprint", handleAfterPrint);

      return () => {
        window.removeEventListener("afterprint", handleAfterPrint);
      };
    }
  }, [isFetching, dataFetching]);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      {isFetching ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <div className="flex items-center flex-col justify-center">
          <QRCodeCanvas
            value={dataFetching?.isbn || dataFetching?.kode_klasifikasi || ""}
            size={150}
            bgColor="transparent"
            fgColor="#085c94"
            level="H"
          />
          <p className="mt-1 text-center text-xs text-primary font-semibold">
            {dataFetching?.isbn || dataFetching?.kode_klasifikasi || ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default LibraryCard;
