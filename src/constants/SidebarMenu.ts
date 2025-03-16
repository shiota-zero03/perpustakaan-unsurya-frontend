import { FaUsers } from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { TbReport } from "react-icons/tb";
import { BsDatabaseFillGear } from "react-icons/bs";
import { IconType } from "react-icons/lib";
import { TbBinaryTree } from "react-icons/tb";

interface PropsMenu {
    text: string;
    name: string;
    link: string;
    icon: IconType;
    subMenu?: {
        text: string;
        name: string;
        link: string;
    }[];
}

export const AdminSidebar: PropsMenu[] = [
    {
        text: 'Dashboard',
        name: 'dashboard',
        link: '/dashboard',
        icon: IoGridOutline
    },
    {
        text: 'Data Anggota',
        name: 'data-anggota',
        link: '#',
        icon: FaUsers,
        subMenu: [
            {
                text: 'Data Dosen',
                name: 'dosen',
                link: '/data-anggota/dosen'
            },
            {
                text: 'Data Mahasiswa',
                name: 'mahasiswa',
                link: '/data-anggota/mahasiswa'
            },
        ]
    },
    {
        text: 'Data Master',
        name: 'data-master',
        link: '#',
        icon: BsDatabaseFillGear,
        subMenu: [
            {
                text: 'Data Petugas',
                name: 'petugas',
                link: '/data-master/petugas'
            },
            {
                text: 'Data Buku Fisik',
                name: 'buku-fisik',
                link: '/data-master/buku-fisik'
            },
            {
                text: 'Data Buku Digital',
                name: 'buku-digital',
                link: '/data-master/buku-digital'
            },
            {
                text: 'Data TA/Skripsi',
                name: 'ta-&-skripsi',
                link: '/data-master/ta-&-skripsi'
            },
            {
                text: 'Data Pengunjung',
                name: 'pengunjung',
                link: '/data-master/pengunjung'
            },
        ]
    },
    {
        text: 'Data Transaksi',
        name: 'data-transaksi',
        link: '#',
        icon: TbReport,
        subMenu: [
            {
                text: 'Data Peminjaman',
                name: 'peminjaman',
                link: '/data-transaksi/peminjaman'
            },
            {
                text: 'Laporan Denda',
                name: 'laporan-denda',
                link: '/data-transaksi/laporan-denda'
            },
        ]
    },
    {
        text: 'CMS',
        name: 'cms',
        link: '#',
        icon: TbBinaryTree,
        subMenu: [
            {
                text: 'Data Fakultas',
                name: 'fakultas',
                link: '/cms/fakultas'
            },
            {
                text: 'Data Prodi',
                name: 'program-studi',
                link: '/cms/program-studi'
            },
            {
                text: 'Banner',
                name: 'banner',
                link: '/cms/banner'
            },
            {
                text: 'Profil Perpustakaan',
                name: 'profil-perpustakaan',
                link: '/cms/profil-perpustakaan'
            },
            {
                text: 'Petunjuk',
                name: 'petunjuk',
                link: '/cms/petunjuk'
            },
            {
                text: 'Prosedur',
                name: 'prosedur',
                link: '/cms/prosedur'
            },
            {
                text: 'Berita dan informasi',
                name: 'berita-informasi',
                link: '/cms/berita-informasi'
            },
        ]
    },
];