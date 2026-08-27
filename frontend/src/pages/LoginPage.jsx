import { useState } from 'react';
import { Mail, Lock, User, ShieldCheck, Globe, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onLoginSuccess = () => {} }) {
  const { lang, setLang } = useLanguage();
  const { login } = useAuth();
  const isEn = lang === 'en';

  // State Mode Auth: 'login' atau 'register'
  const [authMode, setAuthMode] = useState('login');
  
  // State Peran (Role)
  const [selectedRole, setSelectedRole] = useState('buyer');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nik, setNik] = useState('');
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);

  // SIMULASI POPUP PEMILIH AKUN GOOGLE (KARENA BELUM ADA BACKEND API)
  const handleGoogleLogin = () => {
    if (!isCaptchaChecked) {
      alert(isEn ? 'Please check reCAPTCHA first!' : 'Harap centang reCAPTCHA terlebih dahulu!');
      return;
    }

    // Memunculkan dialog simulasi pilihan akun Google
    const chosenEmail = prompt(
      isEn ? "Google Account Chooser:\nEnter your Google Email address:" : "Pilih / Masukkan Alamat Email Google Anda:",
      email || "pembeli.google@gmail.com"
    );

    // Jika pengguna menekan Batal (Cancel) pada dialog
    if (!chosenEmail) return;

    const googleUser = {
      id: `GGL-${Date.now()}`,
      name: chosenEmail.split('@')[0],
      email: chosenEmail,
      role: selectedRole,
      status: 'active'
    };

    login(googleUser);
    onLoginSuccess(googleUser);
  };

  // SUBMIT FORM MANUAL (LOGIN / REGISTER)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isCaptchaChecked) {
      alert(isEn ? 'Please check reCAPTCHA first!' : 'Harap centang reCAPTCHA terlebih dahulu!');
      return;
    }

    if (authMode === 'register') {
      if (password !== confirmPassword) {
        alert(isEn ? 'Passwords do not match!' : 'Konfirmasi kata sandi tidak cocok!');
        return;
      }

      if (selectedRole === 'seller' && (!nik || nik.length < 16)) {
        alert(isEn ? 'Please enter a valid 16-digit NIK!' : 'Harap masukkan 16 digit NIK yang valid untuk pendaftaran Penjual!');
        return;
      }

      const newUser = {
        id: `USR-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role: selectedRole,
        nik: selectedRole === 'seller' ? nik : null,
        status: selectedRole === 'seller' ? 'pending' : 'active'
      };

      // 1. Simpan Akun Baru ke LocalStorage
      const existingUsers = JSON.parse(localStorage.getItem('app_registered_users') || '[]');
      localStorage.setItem('app_registered_users', JSON.stringify([...existingUsers, newUser]));

      // 2. Jika daftar sebagai Penjual, kirim ke daftar Pengajuan Admin
      if (selectedRole === 'seller') {
        const existingPending = JSON.parse(localStorage.getItem('app_pending_sellers') || '[]');
        const newPendingSeller = {
          id: `PEND-${Date.now()}`,
          name: `${name} Store`,
          owner: name,
          email: email,
          nik: nik,
          date: 'Hari Ini'
        };
        const updatedPending = [...existingPending, newPendingSeller];
        
        localStorage.setItem('app_pending_sellers', JSON.stringify(updatedPending));
        window.dispatchEvent(new Event('storage'));

        alert(isEn ? 'Registration submitted! Please wait for Admin approval.' : 'Pendaftaran berhasil! Toko Anda telah dikirim ke Admin untuk disetujui.');
      } else {
        alert(isEn ? 'Account created successfully!' : 'Akun berhasil dibuat!');
      }

      login(newUser);
      onLoginSuccess(newUser);

    } else {
      // MODE LOGIN MANUAL
      const userObj = {
        id: `USR-${Date.now()}`,
        name: name || email.split('@')[0] || (selectedRole === 'admin' ? 'Admin Super' : 'Pengguna'),
        email,
        role: selectedRole
      };

      login(userObj);
      onLoginSuccess(userObj);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans text-neutral-900">
      
      {/* SWITCH BAHASA */}
      <div className="fixed top-6 right-6 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-neutral-200 shadow-xs text-xs font-semibold">
        <Globe className="w-3.5 h-3.5 text-neutral-500" />
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          className="bg-transparent font-bold cursor-pointer outline-none"
        >
          <option value="id">Indonesia</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* CARD AUTH CONTAINER */}
      <div className="bg-white max-w-md w-full rounded-3xl border border-neutral-200 shadow-2xl p-8 space-y-6">
        
        {/* LOGO & HEADING */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-black text-white font-black flex items-center justify-center rounded-xl mx-auto text-base">
            ▲
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            SOPI'I <span className="font-light text-neutral-400">COMMERCE</span>
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            {authMode === 'login' 
              ? (isEn ? 'Welcome back! Please sign in to your account.' : 'Selamat datang kembali. Silakan masuk ke akun Anda.')
              : (isEn ? 'Create your new account to start shopping or selling.' : 'Buat akun baru untuk mulai berbelanja atau berjualan.')
            }
          </p>
        </div>

        {/* PERAN (ROLE SELECTOR) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block text-center">
            {authMode === 'login' ? (isEn ? 'SIGN IN AS' : 'MASUK SEBAGAI') : (isEn ? 'REGISTER AS' : 'DAFTAR SEBAGAI')}
          </label>
          <div className="grid grid-cols-3 gap-2 bg-neutral-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedRole('buyer')}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedRole === 'buyer' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isEn ? 'Buyer' : 'Pembeli'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('seller')}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedRole === 'seller' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isEn ? 'Seller' : 'Penjual'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedRole === 'admin' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* TOMBOL GOOGLE AUTH */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 bg-white border border-neutral-200 hover:border-neutral-400 rounded-xl text-xs font-bold text-neutral-800 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{authMode === 'login' ? (isEn ? 'Sign in with Google' : 'Lanjutkan dengan Google') : (isEn ? 'Sign up with Google' : 'Daftar dengan Google')}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute">
            {isEn ? 'OR EMAIL' : 'ATAU EMAIL'}
          </span>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">

          {authMode === 'register' && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                {isEn ? 'Full Name' : 'Nama Lengkap'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? "John Doe" : "Budi Santoso"}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-neutral-900 outline-none focus:border-black transition"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {authMode === 'register' && selectedRole === 'seller' && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                {isEn ? 'NIK KTP (16 Digits)' : 'NIK KTP Pemilik Toko (16 Digit)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                  placeholder="3201019283749201"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-mono text-neutral-900 outline-none focus:border-black transition"
                />
                <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
              EMAIL / GMAIL
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-neutral-900 outline-none focus:border-black transition"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
              {isEn ? 'PASSWORD' : 'KATA SANID'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-neutral-900 outline-none focus:border-black transition"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                {isEn ? 'CONFIRM PASSWORD' : 'ULANGI KATA SANID'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-neutral-900 outline-none focus:border-black transition"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* RECAPTCHA WIDGET */}
          <div className="pt-2">
            <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isCaptchaChecked}
                  onChange={(e) => setIsCaptchaChecked(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
                <span>{isEn ? "I'm not a robot" : "Saya bukan robot"}</span>
              </label>
              <div className="flex flex-col items-end text-[9px] text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>reCAPTCHA</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-neutral-300 hover:bg-black hover:text-white text-neutral-700 font-extrabold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer mt-4"
          >
            {authMode === 'login' 
              ? (isEn ? 'Sign In Now' : 'Masuk Sekarang')
              : (isEn ? 'Create Account' : 'Buat Akun Sekarang')
            }
          </button>
        </form>

        {/* TOGGLE MODES */}
        <div className="text-center border-t border-neutral-100 pt-4">
          {authMode === 'login' ? (
            <p className="text-xs text-neutral-500">
              {isEn ? "Don't have an account yet? " : "Belum punya akun di web ini? "}
              <button 
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-black hover:underline cursor-pointer"
              >
                {isEn ? 'Register Now' : 'Buat Akun Baru'}
              </button>
            </p>
          ) : (
            <p className="text-xs text-neutral-500">
              {isEn ? "Already have an account? " : "Sudah memiliki akun? "}
              <button 
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-black hover:underline cursor-pointer"
              >
                {isEn ? 'Sign In' : 'Masuk Ke Akun'}
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
}