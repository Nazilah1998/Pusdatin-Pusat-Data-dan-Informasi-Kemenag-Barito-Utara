"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!turnstileToken) {
        setError("Silakan lakukan verifikasi keamanan");
        return;
      }

      setLoading(true);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get("returnTo");

        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, turnstileToken, returnTo }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Email atau password salah");
        }

        if (data.data?.ssoLink) {
          window.location.href = data.data.ssoLink;
          return;
        }

        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    },
    [email, password, turnstileToken, router],
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    turnstileToken,
    setTurnstileToken,
    loading,
    error,
    handleSubmit,
  };
}
