import React, { useState } from 'react';
import { 
    Plus, Trash2, X, AlertTriangle, Menu, 
    Home, BedDouble, Users, ReceiptText, LogOut, CheckCircle, Clock, Eye, Download, Search, DollarSign
} from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';

// Shared Layout Component - Designed with Warm & Cozy Theme
const AdminLayout = ({ children, isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
        { name: 'Data Kamar', icon: BedDouble, href: '/admin/kamar', active: false },
        { name: 'Penghuni', icon: Users, href: '/admin/penghuni', active: false },
        { name: 'Data Sewa', icon: ReceiptText, href: '/admin/sewa', active: false },
        { name: 'Tagihan', icon: ReceiptText, href: '/admin/tagihan', active: true },
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
                        <h2 className="text-xl font-bold text-cozy-brown-900 hidden sm:block">Manajemen Tagihan & Keuangan</h2>
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

export default function Tagihan({ tagihans = [], sewas = [] }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewProofUrl, setViewProofUrl] = useState(null);

    // Form Inertia untuk membuat tagihan baru
    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        sewa_id: '',
        bulan_tagihan: 'Juni',
        tahun_tagihan: new Date().getFullYear().toString(),
        jumlah_tagihan: '',
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

    const handleSewaChange = (sewaId) => {
        setData(prev => {
            const updated = { ...prev, sewa_id: sewaId };
            // Auto fill jumlah tagihan berdasarkan harga sewa kamar yang dipilih
            const selectedSewa = sewas.find(s => s.id.toString() === sewaId.toString());
            if (selectedSewa && selectedSewa.kamar) {
                updated.jumlah_tagihan = selectedSewa.kamar.harga_per_bulan;
            } else {
                updated.jumlah_tagihan = '';
            }
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/tagihan', { 
            onSuccess: () => closeAddModal(),
        });
    };

    // Update status pembayaran (Lunas / Belum Bayar)
    const handleUpdateStatus = (id, newStatus) => {
        put(`/admin/tagihan/${id}`, {
            status_pembayaran: newStatus
        });
    };

    const confirmDelete = (id) => setDeleteConfirmId(id);

    const executeDelete = () => {
        if (deleteConfirmId) {
            destroy(`/admin/tagihan/${deleteConfirmId}`, {
                onSuccess: () => setDeleteConfirmId(null)
            });
        }
    };

    // Filter & Search data tagihan
    const filteredTagihans = tagihans.filter((tagihan) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = 
            (tagihan.sewa?.kamar?.nomor_kamar && tagihan.sewa.kamar.nomor_kamar.toLowerCase().includes(query)) ||
            (tagihan.sewa?.penghuni?.nama && tagihan.sewa.penghuni.nama.toLowerCase().includes(query)) ||
            tagihan.bulan_tagihan.toLowerCase().includes(query) ||
            tagihan.tahun_tagihan.includes(query);

        const matchesStatus = 
            statusFilter === 'Semua' || 
            tagihan.status_pembayaran === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const listBulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <AdminLayout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
            <Head title="Kelola Tagihan Kos" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-cozy-cream-200 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-cozy-brown-900 mb-1">Tagihan Penyewa Kos</h2>
                        <p className="text-sm text-cozy-brown-400">Terbitkan tagihan bulanan dan kelola verifikasi pembayaran anak kos.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        disabled={sewas.length === 0}
                        className="w-full md:w-auto inline-flex items-center justify-center px-5 py-3 bg-cozy-brown-500 text-white rounded-xl font-semibold shadow-md shadow-cozy-brown-500/10 hover:bg-cozy-brown-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Buat Tagihan Baru
                    </button>
                </div>

                {/* Filter and Search Action bar */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full bg-white p-4 rounded-xl border border-cozy-cream-200 shadow-sm">
                    {/* Search bar */}
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cozy-brown-300" />
                        <input
                            type="text"
                            placeholder="Cari kamar, nama anak kos, bulan..."
                            className="w-full pl-10 pr-4 py-2.5 bg-cozy-cream-50 border border-cozy-cream-200 rounded-lg text-sm text-cozy-brown-900 focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/35 focus:border-cozy-brown-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-cozy-brown-300">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Dropdown Filter Status */}
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                        {['Semua', 'Belum Bayar', 'Lunas'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                                    statusFilter === filter 
                                    ? 'bg-cozy-cream-100 text-cozy-brown-500 border-cozy-cream-300' 
                                    : 'bg-white text-cozy-brown-400 border-cozy-cream-200 hover:bg-cozy-cream-50'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table / List Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-cozy-cream-200 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-cozy-cream-200">
                            <thead className="bg-cozy-cream-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Kamar & Nama</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Bulan Tagihan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Jumlah Tagihan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Status & Bukti</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-cozy-cream-100">
                                {filteredTagihans.length > 0 ? (
                                    filteredTagihans.map((tagihan) => (
                                        <tr key={tagihan.id} className="hover:bg-cozy-cream-50/50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-cozy-brown-900">Kamar {tagihan.sewa?.kamar?.nomor_kamar}</div>
                                                <div className="text-xs text-cozy-brown-400 font-medium">{tagihan.sewa?.penghuni?.nama}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900 font-semibold">
                                                {tagihan.bulan_tagihan} {tagihan.tahun_tagihan}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900 font-bold">
                                                {formatRupiah(tagihan.jumlah_tagihan)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        tagihan.status_pembayaran === 'Lunas' 
                                                        ? 'bg-green-50 text-green-700 border border-green-100' 
                                                        : 'bg-orange-50 text-orange-700 border border-orange-100'
                                                    }`}>
                                                        {tagihan.status_pembayaran === 'Lunas' ? (
                                                            <CheckCircle className="w-3 h-3 mr-1.5" />
                                                        ) : (
                                                            <Clock className="w-3 h-3 mr-1.5" />
                                                        )}
                                                        {tagihan.status_pembayaran}
                                                    </span>
                                                    
                                                    {/* Bukti Bayar */}
                                                    {tagihan.bukti_bayar && (
                                                        <button 
                                                            onClick={() => setViewProofUrl(`/storage/${tagihan.bukti_bayar}`)}
                                                            className="inline-flex items-center text-xs font-semibold text-cozy-brown-500 hover:text-cozy-brown-700 hover:bg-cozy-cream-100 px-2 py-1 rounded transition"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 mr-1" />
                                                            Struk
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                                {tagihan.status_pembayaran === 'Belum Bayar' ? (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(tagihan.id, 'Lunas')}
                                                        className="text-green-600 hover:bg-green-50 border border-transparent hover:border-green-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Set Lunas
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(tagihan.id, 'Belum Bayar')}
                                                        className="text-orange-600 hover:bg-orange-50 border border-transparent hover:border-orange-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Batalkan Lunas
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => confirmDelete(tagihan.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-lg transition"
                                                    title="Hapus Tagihan"
                                                >
                                                    <Trash2 className="w-4 h-4 inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <ReceiptText className="w-12 h-12 text-cozy-cream-400 mx-auto mb-3" />
                                            <p className="text-cozy-brown-500 text-sm font-medium">Data tagihan tidak ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card-List View */}
                    <div className="block md:hidden divide-y divide-cozy-cream-200">
                        {filteredTagihans.length > 0 ? (
                            filteredTagihans.map((tagihan) => (
                                <div key={tagihan.id} className="p-4 space-y-3 bg-white hover:bg-cozy-cream-50/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-bold text-cozy-brown-900">Kamar {tagihan.sewa?.kamar?.nomor_kamar}</h4>
                                            <p className="text-xs text-cozy-brown-400">{tagihan.sewa?.penghuni?.nama}</p>
                                        </div>
                                        <button 
                                            onClick={() => confirmDelete(tagihan.id)} 
                                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-cozy-cream-50 p-3 rounded-lg border border-cozy-cream-200">
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">Bulan</span>
                                            <span className="text-cozy-brown-900 font-bold">{tagihan.bulan_tagihan} {tagihan.tahun_tagihan}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">Jumlah</span>
                                            <span className="text-cozy-brown-900 font-extrabold">{formatRupiah(tagihan.jumlah_tagihan)}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">Status</span>
                                            <span className={`inline-flex items-center font-bold ${
                                                tagihan.status_pembayaran === 'Lunas' ? 'text-green-700' : 'text-orange-700'
                                            }`}>
                                                {tagihan.status_pembayaran}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5 font-bold">Bukti Transfer</span>
                                            {tagihan.bukti_bayar ? (
                                                <button 
                                                    onClick={() => setViewProofUrl(`/storage/${tagihan.bukti_bayar}`)}
                                                    className="text-cozy-brown-500 font-bold underline"
                                                >
                                                    Lihat Struk
                                                </button>
                                            ) : (
                                                <span className="text-cozy-brown-300">Belum diupload</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {tagihan.status_pembayaran === 'Belum Bayar' ? (
                                            <button 
                                                onClick={() => handleUpdateStatus(tagihan.id, 'Lunas')}
                                                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                                            >
                                                Tandai Lunas
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleUpdateStatus(tagihan.id, 'Belum Bayar')}
                                                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                                            >
                                                Batalkan Lunas
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-white">
                                <ReceiptText className="w-10 h-10 text-cozy-cream-400 mx-auto mb-2" />
                                <p className="text-cozy-brown-500 text-sm font-medium">Data tagihan tidak ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Invoice Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={closeAddModal}></div>

                        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-6 pt-6 pb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-cozy-brown-900">Buat Tagihan Baru</h3>
                                        <button 
                                            type="button" 
                                            onClick={closeAddModal} 
                                            className="text-cozy-brown-300 hover:text-cozy-brown-500 bg-transparent hover:bg-cozy-cream-100 rounded-full p-1 transition"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Pilih Sewa Kamar Aktif */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Pilih Penempatan Sewa</label>
                                            <select
                                                required
                                                className={`w-full bg-cozy-cream-50 border ${errors?.sewa_id ? 'border-orange-400' : 'border-cozy-cream-200'} text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/20 focus:border-cozy-brown-500`}
                                                value={data.sewa_id}
                                                onChange={e => handleSewaChange(e.target.value)}
                                            >
                                                <option value="">-- Pilih Kamar & Penghuni --</option>
                                                {sewas.map((sewa) => (
                                                    <option key={sewa.id} value={sewa.id}>
                                                        Kamar {sewa.kamar?.nomor_kamar} - {sewa.penghuni?.nama}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors?.sewa_id && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.sewa_id}</span>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Bulan Tagihan */}
                                            <div>
                                                <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Bulan</label>
                                                <select
                                                    required
                                                    className="w-full bg-cozy-cream-50 border border-cozy-cream-200 text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/20 focus:border-cozy-brown-500"
                                                    value={data.bulan_tagihan}
                                                    onChange={e => setData('bulan_tagihan', e.target.value)}
                                                >
                                                    {listBulan.map(b => (
                                                        <option key={b} value={b}>{b}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Tahun Tagihan */}
                                            <div>
                                                <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Tahun</label>
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength="4"
                                                    className="w-full bg-cozy-cream-50 border border-cozy-cream-200 text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/20 focus:border-cozy-brown-500"
                                                    value={data.tahun_tagihan}
                                                    onChange={e => setData('tahun_tagihan', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Jumlah Tagihan */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Jumlah Tagihan (Nominal Rupiah)</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cozy-brown-400">Rp</div>
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="Jumlah Tagihan"
                                                    className={`w-full pl-9 pr-4 py-2.5 bg-cozy-cream-50 border ${errors?.jumlah_tagihan ? 'border-orange-400' : 'border-cozy-cream-200'} text-cozy-brown-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/20 focus:border-cozy-brown-500`}
                                                    value={data.jumlah_tagihan}
                                                    onChange={e => setData('jumlah_tagihan', e.target.value)}
                                                />
                                            </div>
                                            <span className="text-[10px] text-cozy-brown-400 mt-1 block">
                                                *Otomatis terisi sesuai harga sewa bulanan kamar yang dipilih.
                                            </span>
                                            {errors?.jumlah_tagihan && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.jumlah_tagihan}</span>}
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
                                        {processing ? 'Menyimpan...' : 'Terbitkan Tagihan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Proof of Payment Viewer Modal */}
            {viewProofUrl && (
                <div className="fixed inset-0 z-[70] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={() => setViewProofUrl(null)}></div>
                        
                        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-cozy-brown-900">Bukti Transfer Struk</h3>
                                <button onClick={() => setViewProofUrl(null)} className="text-cozy-brown-300 hover:text-cozy-brown-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="bg-cozy-cream-50 border border-cozy-cream-200 rounded-xl overflow-hidden flex items-center justify-center p-2 max-h-[400px]">
                                <img 
                                    src={viewProofUrl} 
                                    alt="Bukti Pembayaran Struk"
                                    className="max-h-[380px] object-contain rounded-lg shadow-sm"
                                />
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button" 
                                    onClick={() => setViewProofUrl(null)}
                                    className="px-5 py-2 bg-cozy-brown-500 text-white font-semibold rounded-xl hover:bg-cozy-brown-600 transition"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirmId(null)}></div>
                        
                        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-bold text-cozy-brown-900">Hapus Tagihan</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-cozy-brown-400">
                                            Apakah Anda yakin ingin menghapus tagihan bulanan ini secara permanen dari sistem keuangan?
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
