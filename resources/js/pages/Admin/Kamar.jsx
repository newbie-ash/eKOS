import React, { useState, useEffect } from 'react';
import { 
    Plus, Edit, Trash2, X, AlertTriangle, Menu, 
    Home, BedDouble, Users, ReceiptText, LogOut 
} from 'lucide-react';
import { Link, Head, useForm } from '@inertiajs/react';
  

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
        { name: 'Data Kamar', icon: BedDouble, href: '/admin/kamar', active: true },
        { name: 'Penghuni', icon: Users, href: '/admin/penghuni', active: false },
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

            {}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <header className="h-16 bg-white border-b border-[#E8E0D5] flex items-center justify-between px-4 sm:px-6 shadow-sm z-30">
                    <div className="flex items-center">
                        <button 
                            className="md:hidden p-2 -ml-2 mr-2 text-[#8B5E3C] hover:bg-[#FAF6F0] rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-[#4A3B32] hidden sm:block">Manajemen Kamar</h2>
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

export default function Kamar({ kamars = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        nomor_kamar: '',
        tipe_kamar: '',
        harga_per_bulan: '',
        status_kamar: 'Kosong',
    });

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const openAddModal = () => {
        reset(); 
        setModalMode('add');
        setIsModalOpen(true);
    };

    const openEditModal = (kamar) => {
        setData('nomor_kamar', kamar.nomor_kamar);
        setData('tipe_kamar', kamar.tipe_kamar);
        setData('harga_per_bulan', kamar.harga_per_bulan);
        setData('status_kamar', kamar.status_kamar);
        setEditingId(kamar.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => { reset(); setEditingId(null); }, 200); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post('/admin/kamar', { onSuccess: closeModal });
        } else {
            put(`/admin/kamar/${editingId}`, { onSuccess: closeModal });
        }
    };

    const confirmDelete = (id) => setDeleteConfirmId(id);

    const executeDelete = () => {
        if (deleteConfirmId) {
            destroy(`/admin/kamar/${deleteConfirmId}`, {
                onSuccess: () => setDeleteConfirmId(null)
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Kamar Kos" />

            <div className="max-w-7xl mx-auto">
                {}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#4A3B32] sm:hidden mb-1">Data Kamar</h2>
                        <p className="text-sm text-[#7D6B5D]">Kelola informasi kamar, harga, dan ketersediaan.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-[#8B5E3C] text-white rounded-xl font-semibold shadow-md shadow-[#8B5E3C]/20 hover:bg-[#6D462B] hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Kamar
                    </button>
                </div>

                {}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D5] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E8E0D5]">
                            <thead className="bg-[#FDFBF7]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] uppercase tracking-wider">No. Kamar</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] uppercase tracking-wider">Tipe Kamar</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] uppercase tracking-wider">Harga/Bulan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#7D6B5D] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-[#7D6B5D] uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#F5F0E6]">
                                {kamars.length > 0 ? (
                                    kamars.map((kamar) => (
                                        <tr key={kamar.id} className="hover:bg-[#FAF6F0] transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#4A3B32]">
                                                {kamar.nomor_kamar}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7D6B5D]">
                                                {kamar.tipe_kamar}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#8B5E3C]">
                                                {formatRupiah(kamar.harga_per_bulan)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                                    kamar.status_kamar === 'Kosong' 
                                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                                        : 'bg-red-100 text-red-800 border border-red-200'
                                                }`}>
                                                    {kamar.status_kamar}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => openEditModal(kamar)} 
                                                    className="text-[#8B5E3C] hover:text-[#6D462B] mr-3 p-2 rounded-lg hover:bg-[#F5F0E6] transition-colors"
                                                >
                                                    <Edit className="w-5 h-5 inline" />
                                                </button>
                                                <button 
                                                    onClick={() => confirmDelete(kamar.id)} 
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5 inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <BedDouble className="w-12 h-12 text-[#D3C6BC] mx-auto mb-3" />
                                            <p className="text-[#7D6B5D] text-sm">Belum ada data kamar.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#4A3B32]/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>

                        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-6 pt-6 pb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-[#4A3B32]">
                                            {modalMode === 'add' ? 'Tambah Kamar Baru' : 'Edit Data Kamar'}
                                        </h3>
                                        <button type="button" onClick={closeModal} className="text-[#D3C6BC] hover:text-[#8B5E3C] bg-transparent hover:bg-[#FAF6F0] rounded-full p-1 transition">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Nomor Kamar</label>
                                            <input
                                                type="text" required placeholder="Contoh: A-01"
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                                                value={data.nomor_kamar} onChange={e => setData('nomor_kamar', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Tipe Kamar</label>
                                            <input
                                                type="text" required placeholder="Contoh: Kamar Mandi Dalam + AC"
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                                                value={data.tipe_kamar} onChange={e => setData('tipe_kamar', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Harga Per Bulan (Rp)</label>
                                            <input
                                                type="number" required min="0" placeholder="Contoh: 1500000"
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                                                value={data.harga_per_bulan} onChange={e => setData('harga_per_bulan', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#7D6B5D] mb-1">Status Kamar</label>
                                            <select
                                                className="w-full bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A3B32] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                                                value={data.status_kamar} onChange={e => setData('status_kamar', e.target.value)}
                                            >
                                                <option value="Kosong">Kosong</option>
                                                <option value="Terisi">Terisi</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#FAF6F0] px-6 py-4 border-t border-[#E8E0D5] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                    <button
                                        type="button" onClick={closeModal}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#D3C6BC] text-[#7D6B5D] font-semibold rounded-xl hover:bg-[#F5F0E6] transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit" disabled={processing}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-[#8B5E3C] text-white font-semibold rounded-xl hover:bg-[#6D462B] shadow-sm shadow-[#8B5E3C]/30 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {}
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
                                    <h3 className="text-lg font-bold text-[#4A3B32]">Hapus Kamar</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-[#7D6B5D]">
                                            Yakin mau menghapus data kamar ini? Data yang terhapus tidak bisa dikembalikan.
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
                                    {processing ? 'Menghapus...' : 'Ya, Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}