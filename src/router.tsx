import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/components/Loader";
import ScrollToTop from "./components/Scroll/ScrollToTop";

const LandingLayout = lazy(() => import("@/components/Layout/LandingLayout"));
const AuthLayout = lazy(() => import("@/components/Layout/AuthLayout"));
const MainLayout = lazy(() => import("@/components/Layout/MainLayout"));

const Home = lazy(() => import("@/pages/landing-page"));
const Petunjuk = lazy(() => import("@/pages/landing-page/Petunjuk"));
const Prosedur = lazy(() => import("@/pages/landing-page/Prosedur"));
const Profil = lazy(() => import("@/pages/landing-page/Profil"));
const News = lazy(() => import("@/pages/landing-page/News"));
const NewsDetail = lazy(() => import("@/pages/landing-page/DetailBerita"));
const Repository = lazy(() => import("@/pages/landing-page/Repository"));
const RepositoryDetail = lazy(() => import("@/pages/landing-page/RepositoryDetail"));
const Katalog = lazy(() => import("@/pages/landing-page/Katalog"));
const KatalogDetail = lazy(() => import("@/pages/landing-page/KatalogDetail"));

const Auth = lazy(() => import("@/pages/auth"));
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const SignUpConfirmation = lazy(() => import("@/pages/auth/SignUp/Confirmation"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const Visitor = lazy(() => import("@/pages/visitors"));

const Dashboard = lazy(() => import("@/pages/admin/dashboard"));
const DataDosen = lazy(() => import("@/pages/admin/dosen"));
const TambahDataDosen = lazy(() => import("@/pages/admin/dosen/TambahDosen"));
const UpdateDataDosen = lazy(() => import("@/pages/admin/dosen/UpdateDosen"));
const DetailDosen = lazy(() => import("@/pages/admin/dosen/DetailDosen"));
const KartuAnggotaDosen = lazy(() => import("@/pages/admin/dosen/KartuAnggota"));
const CetakKartuAnggotaDosen = lazy(() => import("@/pages/admin/dosen/CetakKartu"));

const DataMahasiswa = lazy(() => import("@/pages/admin/mahasiswa"));
const TambahDataMahasiswa = lazy(() => import("@/pages/admin/mahasiswa/TambahMahasiswa"));
const UpdateDataMahasiswa = lazy(() => import("@/pages/admin/mahasiswa/UpdateMahasiswa"));
const DetailMahasiswa = lazy(() => import("@/pages/admin/mahasiswa/DetailMahasiswa"));
const KartuAnggotaMahasiswa = lazy(() => import("@/pages/admin/mahasiswa/KartuAnggota"));
const CetakKartuAnggotaMahasiswa = lazy(() => import("@/pages/admin/mahasiswa/CetakKartu"));

const DataBukuFisik = lazy(() => import("@/pages/admin/buku-fisik"));
const TambahDataBukuFisik =  lazy(() => import("@/pages/admin/buku-fisik/TambahBukuFisik"));
const UpdateDataBukuFisik =  lazy(() => import("@/pages/admin/buku-fisik/UpdateBukuFisik"));
const DetailBukuFisik =  lazy(() => import("@/pages/admin/buku-fisik/DetailBukuFisik"));
const CetakBarcodeBukuFisik =  lazy(() => import("@/pages/admin/buku-fisik/CetakBarcode"));

const DataBukuDigital = lazy(() => import("@/pages/admin/buku-digital"));
const TambahDataBukuDigital =  lazy(() => import("@/pages/admin/buku-digital/TambahBukuDigital"));
const UpdateDataBukuDigital =  lazy(() => import("@/pages/admin/buku-digital/UpdateBukuDigital"));
const DetailBukuDigital =  lazy(() => import("@/pages/admin/buku-digital/DetailBukuDigital"));

const DataTASkripsi = lazy(() => import("@/pages/admin/ta-skripsi"));
const TambahDataTASkripsi =  lazy(() => import("@/pages/admin/ta-skripsi/TambahTASkripsi"));
const UpdateDataTASkripsi =  lazy(() => import("@/pages/admin/ta-skripsi/UpdateTASkripsi"));
const DetailTASkripsi =  lazy(() => import("@/pages/admin/ta-skripsi/DetailTASkripsi"));

const DataPetugas = lazy(() => import("@/pages/admin/petugas"));
const TambahDataPetugas = lazy(() => import("@/pages/admin/petugas/TambahPetugas"));
const UpdateDataPetugas = lazy(() => import("@/pages/admin/petugas/UpdatePetugas"));
const DetailPetugas = lazy(() => import("@/pages/admin/petugas/DetailPetugas"));

const DataPengunjung = lazy(() => import("@/pages/admin/pengunjung"));

const DataTransaksi = lazy(() => import("@/pages/admin/transaksi"));
const TambahDataTransaksi = lazy(() => import("@/pages/admin/transaksi/TambahTransaksi"));
const UpdateDataTransaksi = lazy(() => import("@/pages/admin/transaksi/UpdateTransaksi"));
const DetailTransaksi = lazy(() => import("@/pages/admin/transaksi/DetailTransaksi"));

const DataDenda = lazy(() => import("@/pages/admin/denda"));
const UpdateDataDenda = lazy(() => import("@/pages/admin/denda/UpdateDenda"));
const DetailDenda = lazy(() => import("@/pages/admin/denda/DetailDenda"));

const DataFakultas = lazy(() => import("@/pages/admin/data-fakultas"));
const DataProdi = lazy(() => import("@/pages/admin/data-prodi"));
const DataBanner = lazy(() => import("@/pages/admin/cms/Banner"));
const DataProfilPerpustakaan = lazy(() => import("@/pages/admin/cms/ProfilPerpustakaan"));
const DataBerita = lazy(() => import("@/pages/admin/news"));
const TambahDataBerita =  lazy(() => import("@/pages/admin/news/TambahBerita"));
const UpdateDataBerita =  lazy(() => import("@/pages/admin/news/UpdateBerita"));
const DetailBerita =  lazy(() => import("@/pages/admin/news/DetailBerita"));

const UpdateProfil =  lazy(() => import("@/pages/admin/profil"));

export default function Router() {
    return (
      <Suspense fallback={<Loader />}>
        <ScrollToTop />
        <Routes>
          <Route element={ <LandingLayout /> }>
            <Route path="/" element={<Home />} />
            <Route path="/petunjuk" element={<Petunjuk />} />
            <Route path="/prosedur" element={<Prosedur />} />
            <Route path="/profil-perpustakaan" element={<Profil />} />
            <Route path="/berita-informasi" element={<News />} />
            <Route path="/berita-informasi/:slug" element={<NewsDetail />} />
            <Route path="/repository" element={<Repository />} />
            <Route path="/repository/:id" element={<RepositoryDetail />} />
            <Route path="/katalog-buku" element={<Katalog />} />
            <Route path="/katalog-buku/:id" element={<KatalogDetail />} />
          </Route>
          <Route element={ <AuthLayout /> } >
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/auth/sign-up/confirmation" element={<SignUpConfirmation />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/visitor" element={<Visitor />} />
          </Route>

          <Route path="/data-anggota/dosen/cetak-kartu/:id" element={<CetakKartuAnggotaDosen />} />
          <Route path="/data-anggota/mahasiswa/cetak-kartu/:id" element={<CetakKartuAnggotaMahasiswa />} />
          <Route path="/data-master/buku-fisik/barcode/:id" element={<CetakBarcodeBukuFisik />} />

          <Route element={ <MainLayout /> } >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-profil" element={<UpdateProfil />} />

            <Route path="/data-anggota/dosen" element={<DataDosen />} />
            <Route path="/data-anggota/dosen/tambah-data" element={<TambahDataDosen />} />
            <Route path="/data-anggota/dosen/edit-data/:id" element={<UpdateDataDosen />} />
            <Route path="/data-anggota/dosen/detail/:id" element={<DetailDosen />} />
            <Route path="/data-anggota/dosen/kartu-anggota/:id" element={<KartuAnggotaDosen />} />

            <Route path="/data-anggota/mahasiswa" element={<DataMahasiswa />} />
            <Route path="/data-anggota/mahasiswa/tambah-data" element={<TambahDataMahasiswa />} />
            <Route path="/data-anggota/mahasiswa/edit-data/:id" element={<UpdateDataMahasiswa />} />
            <Route path="/data-anggota/mahasiswa/detail/:id" element={<DetailMahasiswa />} />
            <Route path="/data-anggota/mahasiswa/kartu-anggota/:id" element={<KartuAnggotaMahasiswa />} />

            <Route path="/data-master/petugas" element={<DataPetugas />} />
            <Route path="/data-master/petugas/tambah-data" element={<TambahDataPetugas />} />
            <Route path="/data-master/petugas/edit-data/:id" element={<UpdateDataPetugas />} />
            <Route path="/data-master/petugas/detail/:id" element={<DetailPetugas />} />
            
            <Route path="/data-master/buku-fisik" element={<DataBukuFisik />} />
            <Route path="/data-master/buku-fisik/tambah-data" element={<TambahDataBukuFisik />} />
            <Route path="/data-master/buku-fisik/edit-data/:id" element={<UpdateDataBukuFisik />} />
            <Route path="/data-master/buku-fisik/detail/:id" element={<DetailBukuFisik />} />

            <Route path="/data-master/buku-digital" element={<DataBukuDigital />} />
            <Route path="/data-master/buku-digital/tambah-data" element={<TambahDataBukuDigital />} />
            <Route path="/data-master/buku-digital/edit-data/:id" element={<UpdateDataBukuDigital />} />
            <Route path="/data-master/buku-digital/detail/:id" element={<DetailBukuDigital />} />

            <Route path="/data-master/ta-&-skripsi" element={<DataTASkripsi />} />
            <Route path="/data-master/ta-&-skripsi/tambah-data" element={<TambahDataTASkripsi />} />
            <Route path="/data-master/ta-&-skripsi/edit-data/:id" element={<UpdateDataTASkripsi />} />
            <Route path="/data-master/ta-&-skripsi/detail/:id" element={<DetailTASkripsi />} />

            <Route path="/data-master/pengunjung" element={<DataPengunjung />} />

            <Route path="/data-transaksi/peminjaman" element={<DataTransaksi />} />
            <Route path="/data-transaksi/peminjaman/tambah-data" element={<TambahDataTransaksi />} />
            <Route path="/data-transaksi/peminjaman/edit-data/:slug" element={<UpdateDataTransaksi />} />
            <Route path="/data-transaksi/peminjaman/detail/:slug" element={<DetailTransaksi />} />

            <Route path="/data-transaksi/laporan-denda" element={<DataDenda />} />
            <Route path="/data-transaksi/laporan-denda/edit-data/:slug" element={<UpdateDataDenda />} />
            <Route path="/data-transaksi/laporan-denda/detail/:slug" element={<DetailDenda />} />

            <Route path="/cms/fakultas" element={<DataFakultas />} />
            <Route path="/cms/program-studi" element={<DataProdi />} />
            <Route path="/cms/banner" element={<DataBanner />} />
            <Route path="/cms/profil-perpustakaan" element={<DataProfilPerpustakaan />} />
            <Route path="/cms/berita-informasi" element={<DataBerita />} />
            <Route path="/cms/berita-informasi/tambah-data" element={<TambahDataBerita />} />
            <Route path="/cms/berita-informasi/edit-data/:slug" element={<UpdateDataBerita />} />
            <Route path="/cms/berita-informasi/detail/:slug" element={<DetailBerita />} />

          </Route>
        </Routes>
      </Suspense>
    );
  }