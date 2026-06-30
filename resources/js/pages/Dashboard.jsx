import React, { useState } from 'react';
import { 
    Home, BedDouble, Users, ReceiptText, LogOut, Menu, 
    ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, AlertCircle, Plus, Sparkles
} from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

// Shared Layout Component - Designed with Warm & Cozy Theme
const AdminLayout = ({ children, isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard', active: true },
        { name: 'Data Kamar', icon: BedDouble, href: '/admin/kamar', active: false },
        { name: 'Penghuni', icon: Users, href: '/admin/penghuni', active: false },
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
                        <h2 className="text-xl font-bold text-cozy-brown-900 hidden sm:block">Dashboard Utama</h2>
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

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock statistik untuk mempresentasikan tampilan premium & cozy
    const stats = [
        {
            name: 'Kamar Terisi',
            value: '8 / 12',
            sub: '4 Kamar Kosong',
            icon: BedDouble,
            color: 'bg-cozy-cream-100 text-cozy-brown-500',
        },
        {
            name: 'Total Penghuni Aktif',
            value: '8 Orang',
            sub: 'Semua berkas lengkap',
            icon: Users,
            color: 'bg-cozy-cream-100 text-cozy-brown-500',
        },
        {
            name: 'Pemasukan Bulan Ini',
            value: 'Rp 12.400.000',
            sub: '+15% dari bulan lalu',
            icon: TrendingUp,
            color: 'bg-green-50 text-green-700 border border-green-100',
            trend: 'up',
        },
        {
            name: 'Tagihan Belum Lunas',
            value: '3 Tagihan',
            sub: 'Rp 2.100.000 tertunggak',
            icon: AlertCircle,
            color: 'bg-orange-50 text-orange-700 border border-orange-100',
            trend: 'down',
        }
    ];

    // Mock aktivitas terbaru untuk memperkaya visual dashboard
    const recentActivities = [
        { id: 1, type: 'checkin', text: 'Budi Santoso masuk ke Kamar 102', time: '2 jam yang lalu' },
        { id: 2, type: 'payment', text: 'Siti Rahma melunasi tagihan bulan Juni', time: '5 jam yang lalu' },
        { id: 3, type: 'maintenance', text: 'Perbaikan AC di Kamar 105 selesai', time: '1 hari yang lalu' },
        { id: 4, type: 'checkout', text: 'Andi Wijaya keluar dari Kamar 109', time: '2 hari yang lalu' },
    ];

    return (
        <AdminLayout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
            <Head title="Dashboard eKOS" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Card banner */}
                <div className="relative overflow-hidden bg-white p-6 sm:p-8 rounded-3xl border border-cozy-cream-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Background Cozy Gradients */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-cozy-cream-100 rounded-full blur-3xl -z-10 opacity-60"></div>
                    <div className="absolute right-12 bottom-0 w-32 h-32 bg-cozy-cream-200 rounded-full blur-2xl -z-10 opacity-40"></div>

                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-cozy-cream-100 text-cozy-brown-500 px-3 py-1 rounded-full text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>eKOS Versi Baru</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-cozy-brown-900">Selamat Datang di eKOS Admin!</h2>
                        <p className="text-sm text-cozy-brown-400 max-w-xl">
                            Pantau tingkat hunian kos, catat data sewa, dan kelola tagihan bulanan anak kos dalam satu antarmuka yang hangat dan nyaman.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <Link 
                            href="/admin/penghuni" 
                            className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2.5 bg-cozy-brown-500 hover:bg-cozy-brown-600 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-cozy-brown-500/10"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Kelola Penyewa
                        </Link>
                        <Link 
                            href="/admin/kamar" 
                            className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-cozy-cream-100 border border-cozy-cream-300 text-cozy-brown-500 text-sm font-semibold rounded-xl transition"
                        >
                            <BedDouble className="w-4 h-4 mr-2" />
                            Data Kamar
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-cozy-cream-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="space-y-1">
                                <span className="block text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">{stat.name}</span>
                                <span className="block text-xl sm:text-2xl font-extrabold text-cozy-brown-900">{stat.value}</span>
                                <span className="block text-xs text-cozy-brown-400 font-medium">{stat.sub}</span>
                            </div>
                            <div className={`p-3.5 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Dashboard Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Occupancy Rate & Quick Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-cozy-cream-200 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-cozy-brown-900">Tingkat Hunian Kamar Kos</h3>
                                <p className="text-xs text-cozy-brown-400">Persentase kamar kos yang terisi saat ini.</p>
                            </div>
                            
                            {/* Occupancy Progress Bar */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-cozy-brown-500">Hunian Aktif</span>
                                    <span className="text-cozy-brown-900">66.7% (8/12 Kamar)</span>
                                </div>
                                <div className="w-full h-4 bg-cozy-cream-100 rounded-full overflow-hidden p-0.5 border border-cozy-cream-200">
                                    <div 
                                        className="h-full bg-cozy-brown-500 rounded-full transition-all duration-500 shadow-sm"
                                        style={{ width: '66.7%' }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center border-t border-cozy-cream-100 pt-6">
                                <div className="space-y-1">
                                    <span className="block text-xs text-cozy-brown-400 font-semibold uppercase">Total Kamar</span>
                                    <span className="block text-lg font-bold text-cozy-brown-900">12 Kamar</span>
                                </div>
                                <div className="space-y-1 border-x border-cozy-cream-100">
                                    <span className="block text-xs text-cozy-brown-400 font-semibold uppercase">Kamar Terisi</span>
                                    <span className="block text-lg font-bold text-cozy-brown-900 text-cozy-brown-500">8 Kamar</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-xs text-cozy-brown-400 font-semibold uppercase">Kosong</span>
                                    <span className="block text-lg font-bold text-cozy-brown-900">4 Kamar</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips or Welcome banner */}
                        <div className="bg-cozy-brown-900 text-cozy-cream-50 p-6 rounded-3xl border border-cozy-brown-800 shadow-sm flex items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <h4 className="font-bold text-sm sm:text-base text-white">Butuh bantuan mengelola eKOS?</h4>
                                <p className="text-xs text-cozy-brown-200">
                                    Anda dapat melihat panduan penggunaan cepat, mengunduh template laporan bulanan, atau menghubungi tim support eKOS.
                                </p>
                            </div>
                            <button className="whitespace-nowrap px-4 py-2 bg-cozy-brown-500 hover:bg-cozy-brown-600 text-white rounded-lg text-xs font-semibold shadow-sm transition">
                                Hubungi Kami
                            </button>
                        </div>
                    </div>

                    {/* Recent Activities Panel */}
                    <div className="bg-white p-6 rounded-3xl border border-cozy-cream-200 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-cozy-brown-900">Aktivitas Terbaru</h3>
                            <p className="text-xs text-cozy-brown-400">Log kejadian terbaru pada kos-kosan.</p>
                        </div>

                        <div className="space-y-4">
                            {recentActivities.map((act) => (
                                <div key={act.id} className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-cozy-brown-500 mt-1.5 flex-shrink-0"></div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-semibold text-cozy-brown-900 leading-relaxed">{act.text}</p>
                                        <span className="block text-[10px] text-cozy-brown-300 font-medium">{act.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
