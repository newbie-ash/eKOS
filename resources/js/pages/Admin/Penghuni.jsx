import React, { useState, useEffect } from 'react';
import { 
    Plus, Trash2, X, AlertTriangle, Menu, 
    Home, BedDouble, Users, ReceiptText, LogOut, Mail, Phone 
} from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';


const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Perhatikan: 'active: true' sekarang ada di 'Penghuni'
    const navItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
        { name: 'Data Kamar', icon: BedDouble, href: '/admin/kamar', active: false },
        { name: 'Penghuni', icon: Users, href: '/admin/penghuni', active: true },
        { name: 'Data Sewa', icon: ReceiptText, href: '/admin/sewa', active: false },
        { name: 'Tagihan', icon: ReceiptText, href: '/admin/tagihan', active: false },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-sans flex overflow-hidden">
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E8E0D5] shadow-sm
                transform transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:flex-shrink-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-[#E8E0D5]">
                        <BedDouble className="w-8 h-8 text-[#8B5E3C] mr-3" />
                        <h1 className="text-2xl font-bold text-[#8B5E3C] tracking-tight">eKOS</h1>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl transition-colors duration-200 ${
                                    item.active 
                                    ? 'bg-[#F5F0E6] text-[#8B5E3C] font-semibold' 
                                    : 'text-[#7D6B5D] hover:bg-[#FAF6F0] hover:text-[#8B5E3C]'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-[#E8E0D5]">
                        <Link method="post" href="/logout" as="button" className="flex items-center w-full px-4 py-3 text-[#7D6B5D] hover:bg-[#FFF0F0] hover:text-red-700 rounded-xl transition-colors">
                            <LogOut className="w-5 h-5 mr-3" />
                            Keluar
                        </Link>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <header className="h-16 bg-white border-b border-[#E8E0D5] flex items-center justify-between px-4 sm:px-6 shadow-sm z-30">
                    <div className="flex items-center">
                        <button 
                            className="md:hidden p-2 -ml-2 mr-2 text-[#8B5E3C] hover:bg-[#FAF6F0] rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-[#4A3B32] hidden sm:block">Manajemen Penghuni</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-[#7D6B5D] hidden sm:block">Halo, Admin</span>
                        <div className="w-9 h-9 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-bold shadow-sm">
                            A
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default function Penghuni({ penghunis = [] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Form Inertia untuk menambah data
    const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
        nomor_ktp: '',
        nama: '',
        email: '',
        tanggal_lahir: '',
        alamat: '',
        nomor_telepon: '',
    });

    const openAddModal = () => {
        reset();
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setTimeout(() => reset(), 200);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/penghuni', { 
            onSuccess: () => closeAddModal(),
        });
    };

    const confirmDelete = (id) => setDeleteConfirmId(id);

    const executeDelete = () => {
        if (deleteConfirmId) {
            destroy(`/admin/penghuni/${deleteConfirmId}`, {
                onSuccess: () => setDeleteConfirmId(null)
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Data Penghuni" />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#4A3B32] sm:hidden mb-1">Data Penghuni</h2>
                        <p className="text-sm text-[#7D6B5D]">Kelola data penyewa kos beserta akun login mereka.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-[#8B5E3C] text-white rounded-xl font-semibold shadow-md shadow-[#8B5E3C]/20 hover:bg-[#6D462B] hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Penghuni
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D5] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E8E0D5]">
                            <thead className="bg-[#FDFBF7]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] uppercase tracking-wider">Info Penghuni</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] uppercase tracking-wider">Kontak & Akun</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] uppercase tracking-wider">No. KTP / Tgl Lahir</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-[#7D6B5D] uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#F5F0E6]">
                                {penghunis.length > 0 ? (
                                    penghunis.map((penghuni) => (
                                        <tr key={penghuni.id} className="hover:bg-[#FAF6F0] transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#F5F0E6] flex items-center justify-center text-[#8B5E3C] font-bold">
                                                        {penghuni.nama.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-[#4A3B32]">{penghuni.nama}</div>
                                                        <div className="text-xs text-[#7D6B5D] truncate max-w-[150px]">{penghuni.alamat}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#7D6B5D]">
                                                <div className="flex items-center mb-1">
                                                    <Mail className="w-4 h-4 mr-2 text-[#D3C6BC]" />
                                                    {penghuni.user?.email || '-'}
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    <Phone className="w-4 h-4 mr-2 text-[#D3C6BC]" />
                                                    {penghuni.nomor_telepon}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#7D6B5D]">
                                                <div className="font-medium text-[#4A3B32]">{penghuni.nomor_ktp}</div>
                                                <div className="text-xs">{penghuni.tanggal_lahir}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => confirmDelete(penghuni.id)} 
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Hapus Penghuni & Akun"
                                                >
                                                    <Trash2 className="w-5 h-5 inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <Users className="w-12 h-12 text-[#D3C6BC] mx-auto mb-3" />
                                            <p className="text-[#7D6B5D] text-sm font-medium">Belum ada data penghuni kos.</p>
                                            <p className="text-xs text-[#D3C6BC] mt-1">Klik "Tambah Penghuni" untuk memulai.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#4A3B32]/40 backdrop-blur-sm transition-opacity" onClick={closeAddModal}></div>

                        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-6 pt-6 pb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-[#4A3B32]">Tambah Penghuni Baru</h3>
                                        <button type="button" onClick={closeAddModal} className="text-[#D3C6BC] hover:text-[#8B5E3C] bg-transparent hover:bg-[#FAF6F0] rounded-full p-1 transition">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    
                                    <div className="bg-[#F5F0E6] border border-[#E8E0D5] rounded-xl p-4 mb-6">
                                        <p className="text-sm text-[#8B5E3C] font-medium flex items-start">
                                            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                                            Menambahkan penghuni di sini akan otomatis membuatkan akun login untuk anak kos tersebut dengan password default: <strong>kos12345</strong>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Nama Lengkap</label>
                                            <input
                                                type="text" required placeholder="Sesuai KTP"
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                                                value={data.nama} onChange={e => setData('nama', e.target.value)}
                                            />
                                            {errors?.nama && <span className="text-red-500 text-xs mt-1">{errors.nama}</span>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Nomor KTP (NIK)</label>
                                            <input
                                                type="text" required maxLength="16" placeholder="16 Digit NIK"
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                                                value={data.nomor_ktp} onChange={e => setData('nomor_ktp', e.target.value)}
                                            />
                                            {errors?.nomor_ktp && <span className="text-red-500 text-xs mt-1">{errors.nomor_ktp}</span>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Email (Untuk Login Akun)</label>
                                            <input
                                                type="email" required placeholder="email@contoh.com"
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                                                value={data.email} onChange={e => setData('email', e.target.value)}
                                            />
                                            {errors?.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Tanggal Lahir</label>
                                            <input
                                                type="date" required
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                                                value={data.tanggal_lahir} onChange={e => setData('tanggal_lahir', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Nomor Telepon/WA</label>
                                            <input
                                                type="text" required placeholder="0812xxxxxx"
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                                                value={data.nomor_telepon} onChange={e => setData('nomor_telepon', e.target.value)}
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Alamat Asal</label>
                                            <textarea
                                                required rows="3" placeholder="Alamat lengkap sesuai KTP"
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] resize-none"
                                                value={data.alamat} onChange={e => setData('alamat', e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#FAF6F0] px-6 py-4 border-t border-[#E8E0D5] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                    <button
                                        type="button" onClick={closeAddModal}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#D3C6BC] text-[#7D6B5D] font-semibold rounded-xl hover:bg-[#F5F0E6] transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit" disabled={processing}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-[#8B5E3C] text-white font-semibold rounded-xl hover:bg-[#6D462B] shadow-sm shadow-[#8B5E3C]/30 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan & Buat Akun'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmId && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#4A3B32]/40 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirmId(null)}></div>
                        
                        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-bold text-[#4A3B32]">Hapus Penghuni</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-[#7D6B5D]">
                                            Yakin menghapus penghuni ini? <strong>Akun login, riwayat sewa, dan tagihannya</strong> juga akan ikut terhapus permanen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                <button
                                    type="button" onClick={() => setDeleteConfirmId(null)}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#D3C6BC] text-[#7D6B5D] font-semibold rounded-xl hover:bg-[#F5F0E6]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button" onClick={executeDelete} disabled={processing}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-sm shadow-red-600/30 disabled:opacity-50"
                                >
                                    {processing ? 'Menghapus...' : 'Ya, Hapus Semua'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}