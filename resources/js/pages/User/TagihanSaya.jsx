import React from 'react';
import { 
    ReceiptText, CreditCard, LogOut, CheckCircle, Clock, MessageSquare, ExternalLink, Sparkles
} from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

// Simple, Elegant Top Navbar Layout for Tenants
const UserLayout = ({ children, userName }) => {
    return (
        <div className="min-h-screen bg-cozy-cream-50 text-cozy-brown-900 font-sans flex flex-col">
            {/* Top Navigation Bar */}
            <header className="h-16 bg-white border-b border-cozy-cream-200 shadow-sm z-30 sticky top-0">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-cozy-cream-100 p-2 rounded-lg">
                            <ReceiptText className="w-5 h-5 text-cozy-brown-500" />
                        </div>
                        <span className="text-xl font-bold text-cozy-brown-500 tracking-tight">eKOS</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-cozy-brown-800">{userName || 'Penghuni Kos'}</span>
                            <div className="w-8 h-8 rounded-full bg-cozy-brown-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                        
                        {/* Logout */}
                        <Link 
                            method="post" 
                            href="/logout" 
                            as="button" 
                            className="p-2 text-cozy-brown-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Keluar Aplikasi"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Page Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
};

export default function TagihanSaya({ tagihans = [], auth = {} }) {
    const userName = auth.user?.name;

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Helper untuk WA konfirmasi pembayaran
    const getConfirmWhatsAppUrl = (tagihan) => {
        const adminPhone = '6281234567890'; // Default admin number
        const roomNo = tagihan.sewa?.kamar?.nomor_kamar || '';
        const msg = `Halo Admin eKOS, saya ingin mengonfirmasi pembayaran kos untuk Kamar ${roomNo} bulan ${tagihan.bulan_tagihan} ${tagihan.tahun_tagihan} sebesar ${formatRupiah(tagihan.jumlah_tagihan)}. Berikut terlampir bukti struk transfernya.`;
        return `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    };

    return (
        <UserLayout userName={userName}>
            <Head title="Tagihan Saya" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Welcome Card */}
                <div className="relative overflow-hidden bg-white p-6 rounded-3xl border border-cozy-cream-200 shadow-sm space-y-2">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-cozy-cream-100 rounded-full blur-3xl -z-10 opacity-70"></div>
                    <div className="inline-flex items-center gap-2 bg-cozy-cream-100 text-cozy-brown-500 px-3 py-1 rounded-full text-[10px] font-bold">
                        <Sparkles className="w-3 h-3" />
                        <span>Tagihan Aktif</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-cozy-brown-900">Halo, {userName}!</h2>
                    <p className="text-xs sm:text-sm text-cozy-brown-400">
                        Berikut adalah rincian tagihan kos bulanan Anda. Silakan selesaikan pembayaran sesuai dengan instruksi yang tertera.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Invoice Lists */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-cozy-brown-400">Daftar Tagihan Anda</h3>
                        
                        {tagihans.length > 0 ? (
                            tagihans.map((tagihan) => (
                                <div key={tagihan.id} className="bg-white p-5 rounded-2xl border border-cozy-cream-200 shadow-sm space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs text-cozy-brown-400 font-semibold block">Periode</span>
                                            <h4 className="text-base font-bold text-cozy-brown-900">{tagihan.bulan_tagihan} {tagihan.tahun_tagihan}</h4>
                                            <span className="text-[10px] text-cozy-brown-400 mt-0.5 block">Kamar {tagihan.sewa?.kamar?.nomor_kamar} ({tagihan.sewa?.kamar?.tipe_kamar})</span>
                                        </div>
                                        
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                            tagihan.status_pembayaran === 'Lunas' 
                                            ? 'bg-green-50 text-green-700 border border-green-100' 
                                            : 'bg-orange-50 text-orange-700 border border-orange-100'
                                        }`}>
                                            {tagihan.status_pembayaran === 'Lunas' ? (
                                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                            ) : (
                                                <Clock className="w-3.5 h-3.5 mr-1" />
                                            )}
                                            {tagihan.status_pembayaran}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-baseline border-t border-cozy-cream-100 pt-4">
                                        <div>
                                            <span className="text-xs text-cozy-brown-400 font-medium block">Total Pembayaran</span>
                                            <span className="text-lg font-extrabold text-cozy-brown-900">{formatRupiah(tagihan.jumlah_tagihan)}</span>
                                        </div>

                                        {tagihan.status_pembayaran === 'Belum Bayar' && (
                                            <a 
                                                href={getConfirmWhatsAppUrl(tagihan)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                                            >
                                                <MessageSquare className="w-4 h-4 mr-1.5" />
                                                Kirim Struk WA
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-8 rounded-2xl border border-cozy-cream-200 shadow-sm text-center">
                                <ReceiptText className="w-12 h-12 text-cozy-cream-400 mx-auto mb-3" />
                                <p className="text-cozy-brown-500 text-sm font-medium">Tidak ada tagihan bulanan.</p>
                                <p className="text-xs text-cozy-brown-300 mt-1">Hubungi admin jika Anda merasa ada kesalahan data.</p>
                            </div>
                        )}
                    </div>

                    {/* Payment Instruction Sidebar Card */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-cozy-brown-400">Cara Pembayaran</h3>
                        
                        <div className="bg-white p-5 rounded-2xl border border-cozy-cream-200 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 border-b border-cozy-cream-100 pb-3">
                                <div className="bg-cozy-cream-100 p-2 rounded-lg text-cozy-brown-500">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-cozy-brown-900 text-sm">Transfer Bank</h4>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="block text-cozy-brown-400 font-medium">Bank BCA</span>
                                    <span className="block text-sm font-bold text-cozy-brown-900 tracking-wider">8012-3456-78</span>
                                    <span className="block text-cozy-brown-400">a.n. Pemilik Kos (eKOS)</span>
                                </div>
                                
                                <div className="border-t border-cozy-cream-100 pt-3">
                                    <span className="block text-cozy-brown-400 font-medium">Bank Mandiri</span>
                                    <span className="block text-sm font-bold text-cozy-brown-900 tracking-wider">137-00-12345-678</span>
                                    <span className="block text-cozy-brown-400">a.n. Pemilik Kos (eKOS)</span>
                                </div>
                            </div>

                            <div className="bg-cozy-cream-50 p-3.5 rounded-xl border border-cozy-cream-200 text-[10px] text-cozy-brown-500 leading-relaxed">
                                <span className="font-bold block mb-1">💡 Petunjuk Pembayaran:</span>
                                1. Transfer nominal sesuai tagihan.<br/>
                                2. Simpan struk/bukti transfer Anda.<br/>
                                3. Klik tombol **"Kirim Struk WA"** pada tagihan di samping untuk mengirimkan bukti pembayaran ke Admin.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
