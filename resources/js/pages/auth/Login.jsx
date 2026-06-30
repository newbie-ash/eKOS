import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, LogIn } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log In - eKOS" />

            {/* Welcoming Header inside Card */}
            <div className="mb-6 space-y-1 text-center">
                <h3 className="text-xl font-bold text-cozy-brown-900">Selamat Datang Kembali</h3>
                <p className="text-xs text-cozy-brown-400">Silakan login untuk masuk ke dasbor manajemen Anda.</p>
            </div>

            {status && (
                <div className="mb-4 text-xs font-bold text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">
                        Alamat Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-cozy-brown-300" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="nama@email.com"
                            value={data.email}
                            className={`w-full pl-10 pr-4 py-2.5 bg-cozy-cream-50 border ${
                                errors.email ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'
                            } text-cozy-brown-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-cozy-brown-500 transition-all`}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && (
                        <span className="text-xs font-semibold text-orange-600 block mt-1">
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="block text-xs font-bold text-cozy-brown-400 uppercase tracking-wider">
                            Kata Sandi
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-cozy-brown-400 hover:text-cozy-brown-600 hover:underline transition"
                            >
                                Lupa sandi?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-cozy-brown-300" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={data.password}
                            className={`w-full pl-10 pr-4 py-2.5 bg-cozy-cream-50 border ${
                                errors.password ? 'border-orange-400 focus:ring-orange-200' : 'border-cozy-cream-200 focus:ring-cozy-brown-500/20'
                            } text-cozy-brown-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-cozy-brown-500 transition-all`}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    {errors.password && (
                        <span className="text-xs font-semibold text-orange-600 block mt-1">
                            {errors.password}
                        </span>
                    )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-cozy-cream-300 text-cozy-brown-500 focus:ring-cozy-brown-500/30 w-4 h-4 bg-cozy-cream-50"
                        />
                        <span className="ms-2 text-xs font-semibold text-cozy-brown-400">
                            Ingat saya
                        </span>
                    </label>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex items-center justify-center px-5 py-3 bg-cozy-brown-500 hover:bg-cozy-brown-600 text-white rounded-xl font-bold shadow-md shadow-cozy-brown-500/10 transition-all duration-200 disabled:opacity-50"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        {processing ? 'Mencoba Masuk...' : 'Masuk Sekarang'}
                    </button>
                </div>

                {/* Register Link */}
                <div className="text-center pt-2 text-xs text-cozy-brown-400 font-medium">
                    Belum punya akun?{' '}
                    <Link
                        href={route('register')}
                        className="text-cozy-brown-500 hover:text-cozy-brown-600 font-bold hover:underline"
                    >
                        Daftar Baru
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
