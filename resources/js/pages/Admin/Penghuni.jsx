import React, { useState } from 'react';
import { 
    Plus, Trash2, X, AlertTriangle, Menu, 
    Home, BedDouble, Users, ReceiptText, LogOut, Mail, Phone, Search, MessageSquare, ShieldAlert
} from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';

// Shared Layout Component - Designed with Warm & Cozy Theme
const AdminLayout = ({ children, isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
        { name: 'Data Kamar', icon: BedDouble, href: '/admin/kamar', active: false },
        { name: 'Penghuni', icon: Users, href: '/admin/penghuni', active: true },
        { name: 'Data Sewa', icon: ReceiptText, href: '/admin/sewa', active: false },
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
                        <h2 className="text-xl font-bold text-cozy-brown-900 hidden sm:block">Manajemen Penghuni</h2>
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

export default function Penghuni({ penghunis = [] }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form Inertia untuk menambah data
    const { data, setData, post, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        nomor_ktp: '',
        nama: '',
        email: '',
        tanggal_lahir: '',
        alamat: '',
        nomor_telepon: '',
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

    // Helper untuk membuat tautan WA
    const getWhatsAppUrl = (phone) => {
        if (!phone) return '#';
        let cleaned = phone.replace(/[^0-9]/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.slice(1);
        }
        return `https://wa.me/${cleaned}`;
    };

    // Filter data penghuni berdasarkan NIK, nama, atau telp secara client-side
    const filteredPenghunis = penghunis.filter((penghuni) => {
        const query = searchTerm.toLowerCase();
        return (
            penghuni.nama.toLowerCase().includes(query) ||
            penghuni.nomor_ktp.includes(query) ||
            penghuni.nomor_telepon.includes(query) ||
            (penghuni.user?.email && penghuni.user.email.toLowerCase().includes(query))
        );
    });

    return (
        <AdminLayout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
            <Head title="Data Penghuni" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-cozy-cream-200 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-cozy-brown-900 mb-1">Data Penghuni</h2>
                        <p className="text-sm text-cozy-brown-400">Kelola informasi penyewa kamar kos dan akses masuk akun mereka.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="w-full md:w-auto inline-flex items-center justify-center px-5 py-3 bg-cozy-brown-500 text-white rounded-xl font-semibold shadow-md shadow-cozy-brown-500/10 hover:bg-cozy-brown-600 transition-all duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Penghuni
                    </button>
                </div>

                {/* Filter and Search Action bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-white p-4 rounded-xl border border-cozy-cream-200 shadow-sm">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cozy-brown-300" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, NIK, atau nomor telepon..."
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
                        Menampilkan {filteredPenghunis.length} dari {penghunis.length} Penghuni
                    </div>
                </div>

                {/* Table / List Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-cozy-cream-200 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-cozy-cream-200">
                            <thead className="bg-cozy-cream-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Info Penghuni</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Kontak & Akun</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">KTP / Tanggal Lahir</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-cozy-cream-100">
                                {filteredPenghunis.length > 0 ? (
                                    filteredPenghunis.map((penghuni) => (
                                        <tr key={penghuni.id} className="hover:bg-cozy-cream-50/50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cozy-cream-200 text-cozy-brown-600 flex items-center justify-center font-bold">
                                                        {penghuni.nama.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-cozy-brown-900">{penghuni.nama}</div>
                                                        <div className="text-xs text-cozy-brown-400 truncate max-w-[200px]" title={penghuni.alamat}>{penghuni.alamat}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900">
                                                <div className="flex items-center mb-1 text-cozy-brown-500">
                                                    <Mail className="w-4 h-4 mr-2 text-cozy-brown-300" />
                                                    <span className="text-cozy-brown-900 text-xs">{penghuni.user?.email || '-'}</span>
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    <Phone className="w-4 h-4 mr-2 text-cozy-brown-300" />
                                                    <span className="text-cozy-brown-400 font-medium">{penghuni.nomor_telepon}</span>
                                                    <a 
                                                        href={getWhatsAppUrl(penghuni.nomor_telepon)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-2 inline-flex items-center p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                        title="Hubungi via WhatsApp"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cozy-brown-900">
                                                <div className="font-semibold text-cozy-brown-800 text-xs">{penghuni.nomor_ktp}</div>
                                                <div className="text-xs text-cozy-brown-400">{penghuni.tanggal_lahir}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => confirmDelete(penghuni.id)} 
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
                                            <Users className="w-12 h-12 text-cozy-cream-400 mx-auto mb-3" />
                                            <p className="text-cozy-brown-500 text-sm font-medium">Data penghuni tidak ditemukan.</p>
                                            <p className="text-xs text-cozy-brown-400 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card-List View */}
                    <div className="block md:hidden divide-y divide-cozy-cream-200">
                        {filteredPenghunis.length > 0 ? (
                            filteredPenghunis.map((penghuni) => (
                                <div key={penghuni.id} className="p-4 space-y-3 bg-white hover:bg-cozy-cream-50/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-cozy-cream-200 text-cozy-brown-600 flex items-center justify-center font-bold text-sm">
                                                {penghuni.nama.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="text-sm font-bold text-cozy-brown-900">{penghuni.nama}</h4>
                                                <p className="text-xs text-cozy-brown-400">{penghuni.alamat}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => confirmDelete(penghuni.id)} 
                                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-cozy-cream-50 p-3 rounded-lg border border-cozy-cream-200">
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">Email Akun</span>
                                            <span className="text-cozy-brown-800 break-all">{penghuni.user?.email || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">No. Telepon</span>
                                            <span className="inline-flex items-center text-cozy-brown-800">
                                                {penghuni.nomor_telepon}
                                                <a 
                                                    href={getWhatsAppUrl(penghuni.nomor_telepon)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-1 text-green-600 p-0.5"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5 inline" />
                                                </a>
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">NIK (KTP)</span>
                                            <span className="text-cozy-brown-800">{penghuni.nomor_ktp}</span>
                                        </div>
                                        <div>
                                            <span className="block text-cozy-brown-400 font-medium mb-0.5">Tanggal Lahir</span>
                                            <span className="text-cozy-brown-800">{penghuni.tanggal_lahir}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-white">
                                <Users className="w-10 h-10 text-cozy-cream-400 mx-auto mb-2" />
                                <p className="text-cozy-brown-500 text-sm font-medium">Data penghuni tidak ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Tenant Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-[#372213]/40 backdrop-blur-sm transition-opacity" onClick={closeAddModal}></div>

                        <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-6 pt-6 pb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-cozy-brown-900">Tambah Penghuni Baru</h3>
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
                                            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 text-cozy-brown-500" />
                                            <span>
                                                Menambahkan penghuni di sini akan **otomatis membuatkan akun login** untuk anak kos tersebut dengan password default: <strong>kos12345</strong>
                                            </span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Nama Lengkap */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Nama Lengkap</label>
                                            <input
                                                type="text" 
                                                required 
                                                placeholder="Sesuai KTP"
                                                className={`w-full bg-cozy-cream-50 border ${errors?.nama ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.nama} 
                                                onChange={e => setData('nama', e.target.value)}
                                            />
                                            {errors?.nama && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.nama}</span>}
                                        </div>

                                        {/* NIK */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Nomor KTP (NIK)</label>
                                            <input
                                                type="text" 
                                                required 
                                                maxLength="16" 
                                                placeholder="16 Digit NIK"
                                                className={`w-full bg-cozy-cream-50 border ${errors?.nomor_ktp ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.nomor_ktp} 
                                                onChange={e => setData('nomor_ktp', e.target.value)}
                                            />
                                            {errors?.nomor_ktp && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.nomor_ktp}</span>}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Email (Untuk Login Akun)</label>
                                            <input
                                                type="email" 
                                                required 
                                                placeholder="email@contoh.com"
                                                className={`w-full bg-cozy-cream-50 border ${errors?.email ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.email} 
                                                onChange={e => setData('email', e.target.value)}
                                            />
                                            {errors?.email && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.email}</span>}
                                        </div>

                                        {/* Tanggal Lahir */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Tanggal Lahir</label>
                                            <input
                                                type="date" 
                                                required
                                                className="w-full bg-cozy-cream-50 border border-cozy-cream-200 text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cozy-brown-500/20 focus:border-cozy-brown-500"
                                                value={data.tanggal_lahir} 
                                                onChange={e => setData('tanggal_lahir', e.target.value)}
                                            />
                                            {errors?.tanggal_lahir && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.tanggal_lahir}</span>}
                                        </div>

                                        {/* No Telp */}
                                        <div>
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Nomor Telepon/WA</label>
                                            <input
                                                type="text" 
                                                required 
                                                placeholder="0812xxxxxx"
                                                className={`w-full bg-cozy-cream-50 border ${errors?.nomor_telepon ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500`}
                                                value={data.nomor_telepon} 
                                                onChange={e => setData('nomor_telepon', e.target.value)}
                                            />
                                            {errors?.nomor_telepon && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.nomor_telepon}</span>}
                                        </div>

                                        {/* Alamat Asal */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-cozy-brown-400 mb-1">Alamat Asal</label>
                                            <textarea
                                                required 
                                                rows="3" 
                                                placeholder="Alamat lengkap sesuai KTP"
                                                className={`w-full bg-cozy-cream-50 border ${errors?.alamat ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'} text-cozy-brown-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-cozy-brown-500 resize-none`}
                                                value={data.alamat} 
                                                onChange={e => setData('alamat', e.target.value)}
                                            ></textarea>
                                            {errors?.alamat && <span className="text-orange-600 text-xs mt-1 block font-medium">{errors.alamat}</span>}
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
                                        {processing ? 'Menyimpan...' : 'Simpan & Buat Akun'}
                                    </button>
                                </div>
                            </form>
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
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-50 sm:mx-0 sm:h-10 sm:w-10">
                                    <ShieldAlert className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-bold text-cozy-brown-900">Hapus Penghuni</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-cozy-brown-400">
                                            Apakah Anda yakin ingin menghapus penghuni ini? **Akun login, riwayat sewa, dan tagihannya** juga akan terhapus secara permanen.
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