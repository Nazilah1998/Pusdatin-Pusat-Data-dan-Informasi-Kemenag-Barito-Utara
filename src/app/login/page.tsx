"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Turnstile } from "@/components/ui/Turnstile";
import { useAdminLogin } from "@/hooks/useAdminLogin";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    turnstileToken,
    setTurnstileToken,
    loading,
    error,
    handleSubmit,
  } = useAdminLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Section - Branding/Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 overflow-hidden items-center justify-center">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950"></div>

        {/* Glowing orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-green-400/10 blur-[100px] mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-12 animate-fade-in-up">
          <div className="rounded-full bg-white/10 p-6 backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
            <img
              src="/branding/kemenag.svg"
              alt="Kemenag"
              className="h-24 w-24 drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">
            PUSDATIN (Pusat Data & Informasi)
          </h1>
          <p className="text-emerald-50 text-lg max-w-md font-light leading-relaxed opacity-90">
            Sistem Informasi Manajemen dan Integrasi Data Terpadu Kementerian
            Agama Kabupaten Barito Utara
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
        <div className="mx-auto w-full max-w-sm animate-fade-in-up">
          {/* Mobile Header */}
          <div className="mb-10 lg:hidden text-center flex flex-col items-center">
            <div className="rounded-full bg-emerald-50 p-4 mb-4">
              <img
                src="/branding/kemenag.svg"
                alt="Kemenag"
                className="h-16 w-16"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Pusdatin Kemenag
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-[250px] mx-auto">
              Portal Pusat Data dan Informasi Kemenag Barito Utara
            </p>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Silakan masuk ke akun Anda untuk melanjutkan.
            </p>
          </div>

          <div className="bg-white lg:bg-transparent lg:shadow-none shadow-xl lg:border-none border border-slate-100 rounded-2xl p-6 lg:p-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <Input
                  id="email"
                  label="Alamat Email"
                  type="email"
                  placeholder="admin@kemenag.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4 text-slate-400" />}
                  required
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1 relative">
                <Input
                  id="password"
                  label="Kata Sandi"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4 text-slate-400" />}
                  required
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="pt-2">
                <Turnstile onVerify={setTurnstileToken} />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-0.5">
                    <svg
                      className="h-4 w-4 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 py-6 text-base font-medium rounded-xl transition-all hover:-translate-y-0.5 mt-4"
              >
                Masuk ke Dasbor
              </Button>
            </form>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-emerald-700">
              Pusdatin Kemenag Barito Utara
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
