import React, { useState } from 'react';
import { 
    Plus, Trash2, X, AlertTriangle, Menu, 
    Home, BedDouble, Users, ReceiptText, LogOut, Calendar, ShieldAlert, Search, UserCheck
} from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';

// Shared Layout Component - Designed with Warm & Cozy Theme
const AdminLayout = ({ children, isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
        { name: 'Data Kamar', icon: BedDouble, href: '/admin/kamar', active: false },
        { name: 'Penghuni', icon: Users, href: '/admin/penghuni', active: false },
        { name: 'Data Sewa', icon: ReceiptText, href: '/admin/sewa', active: true },
        { name: 'Tagihan', icon: ReceiptText, href: '/admin/tagihan', active: false },
    ];

    return (
        <div className="min-h-screen bg-cozy-cream-50 text-cozy-brown-900 font-sans flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-[#372213]/40 z-40 md:hidden transition-opacity backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-cozy-cream-200 shadow-sm
                transform transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:flex-shrink-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Brand Header */}
                    <div className="h-16 flex items-center px-6 border-b border-cozy-cream-200">
                        <div className="bg-cozy-cream-100 p-2 rounded-lg mr-3">
                            <BedDouble className="w-6 h-6 text-cozy-brown-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-cozy-brown-500 tracking-tight">eKOS</h1>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                                    item.active 
                                    ? 'bg-cozy-cream-100 text-cozy-brown-500 font-semibold shadow-sm' 
                                    : 'text-cozy-brown-400 hover:bg-cozy-cream-50 hover:text-cozy-brown-500'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Logout Footer */}
                    <div className="p-4 border-t border-cozy-cream-200">
                        <Link 
                            method="post" 
                            href="/logout" 
                            as="button" 
                            className="flex items-center w-full px-4 py-3 text-cozy-brown-400 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Keluar
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <header className="h-16 bg-white border-b border-cozy-cream-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-30">
                    <div className="flex items-center">
                        <button 
                            className="md:hidden p-2 -ml-2 mr-2 text-cozy-brown-500 hover:bg-cozy-cream-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-cozy-brown-900 hidden sm:block">Manajemen Sewa & Kamar</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-cozy-brown-400 hidden sm:block">Halo, Admin</span>
                        <div className="w-9 h-9 rounded-full bg-cozy-brown-500 text-white flex items-center justify-center font-bold shadow-sm">
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

export default function Sewa({ sewas = [], kamars = [], penghunis = [] }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form Inertia untuk memproses sewa baru
    const { data, setData, post, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        penghuni_id: '',
        kamar_id: '',
        tanggal_masuk: new Date().toISOString().split('T')[0], // Default tanggal hari ini
    });

    const openAddModal = () => {
        clearErrors();
        reset();
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setTimeout(() => reset(), 200);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/sewa', { 
            onSuccess: () => closeAddModal(),
        });
    };

    const confirmDelete = (id) => setDeleteConfirmId(id);

    const executeDelete = () => {
        if (deleteConfirmId) {
            destroy(`/admin/sewa/${deleteConfirmId}`, {
                onSuccess: () => setDeleteConfirmId(null)
            });
        }
    };

    // Filter sewa berdasarkan nomor kamar atau nama penghuni
    const filteredSewas = sewas.filter((sewa) => {
        const query = searchTerm.toLowerCase();
        return (
            (sewa.kamar?.nomor_kamar && sewa.kamar.nomor_kamar.toLowerCase().includes(query)) ||
            (sewa.penghuni?.nama && sewa.penghuni.nama.toLowerCase().includes(query)) ||
            (sewa.petugas?.name && sewa.petugas.name.toLowerCase().includes(query))
        );
    });

    // Format harga rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AdminLayout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
            <Head title="Manajemen Sewa Kos" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-cozy-cream-200 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-cozy-brown-900 mb-1">Riwayat Sewa & Penempatan</h2>
                        <p className="text-sm text-cozy-brown-400">Atur penempatan kamar untuk penghuni kos yang aktif.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        disabled={kamars.length === 0}
                        className="w-full md:w-auto inline-flex items-center justify-center px-5 py-3 bg-cozy-brown-500 text-white rounded-xl font-semibold shadow-md shadow-cozy-brown-500/10 hover:bg-cozy-brown-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Check-In Penghuni
                    </button>
                </div>

                {/* Filter and Search Action bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-white p-4 rounded-xl border border-cozy-cream-200 shadow-sm">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cozy-brown-300" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nomor kamar, nama penghuni, atau admin..."
                            className="w-full pl-10 pr-4 py-2.5 bg-cozy-cream-50 border border-cozy-cream-200 rounded-lg text-sm text-cozy-brown-900 focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/35 focus:border-cozy-brown-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-cozy-brown-300 hover:text-cozy-brown-500 text-xs"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="text-xs text-cozy-brown-400 font-medium whitespace-nowrap">
                        Menampilkan {filteredSewas.length} dari {sewas.length} Transaksi
                    </div>
                </div>

                {/* Table / List Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-cozy-cream-200 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-cozy-cream-200">
                            <thead className="bg-cozy-cream-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Kamar & Tipe</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Penghuni</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Mulai Masuk</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Petugas Admin</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-cozy-cream-100">
                                {filteredSewas.length > 0 ? (
                                    filteredSewas.map((sewa) => (
                                        <tr key={sewa.id} className="hover:bg-cozy-cream-50/50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="bg-cozy-cream-100 p-2 rounded-lg text-cozy-brown-500 mr-3">
                                                        <BedDouble className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-cozy-brown-900">Kamar {sewa.kamar?.nomor_kamar}</div>
                                                        <div className="text-xs text-cozy-brown-400 font-medium">{sewa.kamar?.tipe_kamar} • {formatRupiah(sewa.kamar?.harga_per_bulan)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900">
                                                <div className="font-bold text-cozy-brown-900">{sewa.penghuni?.nama}</div>
                                                <div className="text-xs text-cozy-brown-400 font-medium">{sewa.penghuni?.nomor_telepon}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900">
                                                <div className="flex items-center text-xs font-semibold text-cozy-brown-700">
                                                    <Calendar className="w-3.5 h-3.5 mr-2 text-cozy-brown-300" />
                                                    {sewa.tanggal_masuk}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-400">
                                                <span className="text-xs font-medium bg-cozy-cream-100 text-cozy-brown-500 px-2.5 py-1 rounded-full">
                                                    {sewa.petugas?.name || 'Sistem'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => confirmDelete(sewa.id)} 
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-semibold text-xs border border-transparent hover:border-red-200"
                                                    title="Akhiri Masa Sewa Kamar"
                                                >
                                                    Akhiri Sewa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <ReceiptText className="w-12 h-12 text-cozy-cream-400 mx-auto mb-3" />
                                            <p className="text-cozy-brown-500 text-sm font-medium">Belum ada riwayat penempatan sewa kamar.</p>
                                            <p className="text-xs text-cozy-brown-400 mt-1">Klik "Check-In Penghuni" untuk memulainya.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card-List View */}
                    <div className="block md:hidden divide-y divide-cozy-cream-200">
                        {filteredSewas.length > 0 ? (
                            filteredSewas.map((sewa) => (
                                <div key={sewa.id} className="p-4 space-y-3 bg-white hover:bg-cozy-cream-50/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className="bg-cozy-cream-100 p-2.5 rounded-lg text-cozy-brown-500 mr-3">
                                                <BedDouble className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-cozy-brown-900">Kamar {sewa.kamar?.nomor_kamar}</h4>
                                                <p className="text-xs text-cozy-brown-400">{sewa.kamar?.tipe_kamar} • {formatRupiah(sewa.kamar?.harga_per_bulan)}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => confirmDelete(sewa.id)} 
                                            className="text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg text-xs font-bold transition-all border border-red-200"
                                        >
                                            Akhiri
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-cozy-cream-50 p-3 rounded-lg border border-cozy-cream-200">
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">Nama Penghuni</span>
                                            <span className="text-cozy-brown-900 font-bold">{sewa.penghuni?.nama}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">Mulai Masuk</span>
                                            <span className="text-cozy-brown-800 font-medium">{sewa.tanggal_masuk}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">Petugas Admin</span>
                                            <span className="text-cozy-brown-800">{sewa.petugas?.name || 'Sistem'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">Status Kamar</span>
                                            <span className="text-green-700 font-bold">Terisi</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-white">
                                <ReceiptText className="w-10 h-10 text-cozy-cream-400 mx-auto mb-2" />
                                <p className="text-cozy-brown-500 text-sm font-medium">Data sewa tidak ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Check-In/Add Lease Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={closeAddModal}></div>

                        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-6 pt-6 pb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-cozy-brown-900">Proses Check-In (Sewa Baru)</h3>
                                        <button 
                                            type="button" 
                                            onClick={closeAddModal} 
                                            className="text-cozy-brown-300 hover:text-cozy-brown-500 bg-transparent hover:bg-cozy-cream-100 rounded-full p-1 transition"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    
                                    <div className="bg-cozy-cream-100 border border-cozy-cream-200 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-cozy-brown-600 font-medium flex items-start">
                                            <UserCheck className="w-5 h-5 mr-2 flex-shrink-0 text-cozy-brown-500" />
                                            <span>
                                                Pilih penghuni dan tautkan ke kamar kosong yang tersedia untuk memulai masa sewa aktif.
                                            </span>
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Pilih Penghuni */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Pilih Penghuni Kos</label>
                                            <select
                                                required
                                                className={`w-full bg-cozy-cream-50 border ${errors?.penghuni_id ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.penghuni_id}
                                                onChange={e => setData('penghuni_id', e.target.value)}
                                            >
                                                <option value="">-- Pilih Penghuni --</option>
                                                {penghunis.map((penghuni) => (
                                                    <option key={penghuni.id} value={penghuni.id}>
                                                        {penghuni.nama} (KTP: {penghuni.nomor_ktp})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors?.penghuni_id && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.penghuni_id}</span>}
                                        </div>

                                        {/* Pilih Kamar Kosong */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Pilih Kamar Kosong</label>
                                            <select
                                                required
                                                className={`w-full bg-cozy-cream-50 border ${errors?.kamar_id ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.kamar_id}
                                                onChange={e => setData('kamar_id', e.target.value)}
                                            >
                                                <option value="">-- Pilih Kamar (Hanya Kamar Kosong) --</option>
                                                {kamars.map((kamar) => (
                                                    <option key={kamar.id} value={kamar.id}>
                                                        Kamar {kamar.nomor_kamar} - {kamar.tipe_kamar} ({formatRupiah(kamar.harga_per_bulan)})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors?.kamar_id && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.kamar_id}</span>}
                                        </div>

                                        {/* Tanggal Masuk */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Tanggal Mulai Sewa (Check-In)</label>
                                            <input
                                                type="date"
                                                required
                                                className={`w-full bg-cozy-cream-50 border ${errors?.tanggal_masuk ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.tanggal_masuk}
                                                onChange={e => setData('tanggal_masuk', e.target.value)}
                                            />
                                            {errors?.tanggal_masuk && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.tanggal_masuk}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div className="bg-cozy-cream-50 px-6 py-4 border-t border-cozy-cream-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                    <button
                                        type="button" 
                                        onClick={closeAddModal}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-white border border-cozy-cream-300 text-cozy-brown-400 font-semibold rounded-xl hover:bg-cozy-cream-100 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-cozy-brown-500 text-white font-semibold rounded-xl hover:bg-cozy-brown-600 shadow-md shadow-cozy-brown-500/10 disabled:opacity-50"
                                    >
                                        {processing ? 'Memproses...' : 'Proses Check-In'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* End Lease Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirmId(null)}></div>
                        
                        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ShieldAlert className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-bold text-cozy-brown-900">Akhiri Masa Sewa</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-cozy-brown-400">
                                            Apakah Anda yakin ingin mengakhiri masa sewa kamar untuk penghuni ini? **Status kamar akan otomatis kembali menjadi Kosong**.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                <button
                                    type="button" 
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-white border border-cozy-cream-300 text-cozy-brown-400 font-semibold rounded-xl hover:bg-cozy-cream-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button" 
                                    onClick={executeDelete} 
                                    disabled={processing}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-md shadow-red-600/10 disabled:opacity-50"
                                >
                                    {processing ? 'Mengakhiri...' : 'Ya, Akhiri Sewa'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
