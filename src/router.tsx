import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/components/Loader";

const LandingLayout = lazy(() => import("@/components/Layout/LandingLayout"));
const AuthLayout = lazy(() => import("@/components/Layout/AuthLayout"));
const MainLayout = lazy(() => import("@/components/Layout/MainLayout"));

const Home = lazy(() => import("@/pages/landing-page"));

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
const KartuAnggotaDosen = lazy(() => import("@/pages/admin/dosen/KartuAnggotaDosen"));

const DataMahasiswa = lazy(() => import("@/pages/admin/mahasiswa"));
const TambahDataMahasiswa = lazy(() => import("@/pages/admin/mahasiswa/TambahMahasiswa"));
const UpdateDataMahasiswa = lazy(() => import("@/pages/admin/mahasiswa/UpdateMahasiswa"));
const DetailMahasiswa = lazy(() => import("@/pages/admin/mahasiswa/DetailMahasiswa"));

const DataPetugas = lazy(() => import("@/pages/admin/petugas"));
const TambahDataPetugas = lazy(() => import("@/pages/admin/petugas/TambahPetugas"));
const UpdateDataPetugas = lazy(() => import("@/pages/admin/petugas/UpdatePetugas"));
const DetailPetugas = lazy(() => import("@/pages/admin/petugas/DetailPetugas"));

const DataPengunjung = lazy(() => import("@/pages/admin/pengunjung"));

const DataFakultas = lazy(() => import("@/pages/admin/data-fakultas"));
const DataProdi = lazy(() => import("@/pages/admin/data-prodi"));

export default function Router() {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={ <LandingLayout /> }>
            <Route path="/" element={<Home />} />
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

          <Route element={ <MainLayout /> } >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/data-anggota/dosen" element={<DataDosen />} />
            <Route path="/data-anggota/dosen/tambah-data" element={<TambahDataDosen />} />
            <Route path="/data-anggota/dosen/edit-data/:id" element={<UpdateDataDosen />} />
            <Route path="/data-anggota/dosen/detail/:id" element={<DetailDosen />} />
            <Route path="/data-anggota/dosen/kartu-anggota/:id" element={<KartuAnggotaDosen />} />

            <Route path="/data-anggota/mahasiswa" element={<DataMahasiswa />} />
            <Route path="/data-anggota/mahasiswa/tambah-data" element={<TambahDataMahasiswa />} />
            <Route path="/data-anggota/mahasiswa/edit-data/:id" element={<UpdateDataMahasiswa />} />
            <Route path="/data-anggota/mahasiswa/detail/:id" element={<DetailMahasiswa />} />

            <Route path="/data-master/petugas" element={<DataPetugas />} />
            <Route path="/data-master/petugas/tambah-data" element={<TambahDataPetugas />} />
            <Route path="/data-master/petugas/edit-data/:id" element={<UpdateDataPetugas />} />
            <Route path="/data-master/petugas/detail/:id" element={<DetailPetugas />} />
            
            <Route path="/data-master/buku" element={<Dashboard />} />
            <Route path="/data-master/ta-&-skripsi" element={<Dashboard />} />
            <Route path="/data-master/pengunjung" element={<DataPengunjung />} />
            <Route path="/data-transaksi/peminjaman" element={<Dashboard />} />
            <Route path="/data-transaksi/laporan-denda" element={<Dashboard />} />

            <Route path="/cms/fakultas" element={<DataFakultas />} />
            <Route path="/cms/program-studi" element={<DataProdi />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }