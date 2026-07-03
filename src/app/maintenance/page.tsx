import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Wrench className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Mode Pemeliharaan</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Portal Pusdatin sedang dalam mode pemeliharaan. Silakan kembali lagi
          nanti. Terima kasih atas pengertian Anda.
        </p>
      </div>
    </div>
  );
}
