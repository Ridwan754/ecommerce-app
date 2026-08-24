import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/useLanguage';
import { Lock, Mail, ShieldCheck, Store, User, Globe } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { lang, setLang } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('buyer');
  
  // State & Ref untuk reCAPTCHA
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const recaptchaRef = useRef(null);

  const isEn = lang === 'en';

  const handleCaptchaChange = (token) => {
    if (token) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(false);
    }
  };

  const handleCaptchaExpired = () => {
    setIsCaptchaVerified(false);
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (!email) return alert(isEn ? 'Please enter your email' : 'Masukkan email Anda');

    // Ambil token reCAPTCHA untuk dikirim ke backend nanti
    const captchaToken = recaptchaRef.current?.getValue();

    login({
      email,
      name: email.split('@')[0],
      role: selectedRole,
      captchaToken // disertakan ke fungsi login
    });
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();

        login({
          email: profile.email || 'user.google@gmail.com',
          name: profile.name || 'Google User',
          role: selectedRole,
        });
      } catch (err) {
        login({
          email: 'user.google@gmail.com',
          name: 'Google User',
          role: selectedRole,
        });
      }
    },
    onError: () => {
      alert(isEn ? 'Google Login Failed' : 'Gagal Login menggunakan Google');
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-sans text-neutral-900 antialiased">
      
      {/* Switch Bahasa Kanan Atas */}
      <div className="absolute top-6 right-6 flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold shadow-xs">
        <Globe className="w-3.5 h-3.5 text-neutral-500" />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-transparent text-neutral-900 font-bold cursor-pointer outline-none"
        >
          <option value="id">Indonesia</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="bg-white max-w-md w-full rounded-2xl p-8 border border-neutral-200 shadow-sm space-y-6">
        
        {/* Vercel Style Logo & Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-10 h-10 bg-black text-white items-center justify-center rounded-xl font-bold text-lg mb-1">
            ▲
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">
            SOPI'I <span className="text-neutral-400 font-light">COMMERCE</span>
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            {isEn ? 'Welcome back. Sign in to your account.' : 'Selamat datang kembali. Silakan masuk ke akun Anda.'}
          </p>
        </div>

        {/* Role Switcher Minimalis */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            {isEn ? 'Login As' : 'Masuk Sebagai'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('buyer')}
              className={`py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'buyer'
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              {isEn ? 'Buyer' : 'Pembeli'}
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('seller')}
              className={`py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'seller'
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              {isEn ? 'Seller' : 'Penjual'}
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>

        {/* Custom Google OAuth Button */}
        <div>
          <button
            type="button"
            onClick={() => googleLoginHandler()}
            className="w-full py-3 px-4 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs rounded-xl border border-neutral-300 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isEn ? 'Continue with Google' : 'Lanjutkan dengan Google'}</span>
          </button>
        </div>

        {/* Divider Minimalis */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[10px] text-neutral-400 font-bold uppercase tracking-wider absolute">
            {isEn ? 'or email' : 'atau email'}
          </span>
        </div>

        {/* Form Manual Email/Gmail */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
              Email / Gmail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:border-black outline-none transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
              {isEn ? 'Password' : 'Kata Sandi'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:border-black outline-none transition font-medium"
              />
            </div>
          </div>

          {/* Widget Google reCAPTCHA v2 */}
          <div className="flex justify-center pt-2 overflow-x-auto">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={handleCaptchaChange}
              onExpired={handleCaptchaExpired}
            />
          </div>

          <button
            type="submit"
            disabled={!isCaptchaVerified}
            className={`w-full py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-sm ${
              isCaptchaVerified
                ? 'bg-black hover:bg-neutral-800 text-white cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {isEn ? 'Sign In' : 'Masuk Sekarang'}
          </button>
        </form>

      </div>
    </div>
  );
}