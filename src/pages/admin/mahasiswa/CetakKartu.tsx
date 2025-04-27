import React, { useEffect, useMemo } from "react";
import { errorToast } from "@/utils/toastMessage";
import { useNavigate, useParams } from "react-router-dom";
import { KartuMahasiswa } from "./KartuMahasiswa";
import "@/assets/css/printCard.css";
import { Spinner } from "@nextui-org/react";
import { useGetDetailMahasiswa } from "@/services/mahasiswa";

const LibraryCard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching, refetch, error } = useGetDetailMahasiswa(id || "")
    
  const dataFetching = useMemo(() => {
    return data ? data.data : null;
  }, [data, id]);

  useEffect(() => {
    if(!isFetching && error) {
      navigate('/data-anggota/mahasiswa');
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
          <KartuMahasiswa dataFetching={dataFetching} />
        </div>
      )}
    </div>
  );
};

export default LibraryCard;
