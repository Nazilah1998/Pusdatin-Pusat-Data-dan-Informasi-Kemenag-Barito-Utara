"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody } from "@/components/ui/Card";
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <img
            src="/branding/kemenag.svg"
            alt="Kemenag"
            className="mx-auto h-16 w-16"
          />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Pusdatin</h1>
          <p className="mt-1 text-sm text-slate-500">
            Portal Pusat Data dan Informasi Kemenag Barito Utara
          </p>
        </div>

        <Card>
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="admin@kemenag.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
              />

              <div className="relative">
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Turnstile onVerify={setTurnstileToken} />

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full">
                Masuk
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Pusdatin Kemenag Barito Utara
        </p>
      </div>
    </div>
  );
}
