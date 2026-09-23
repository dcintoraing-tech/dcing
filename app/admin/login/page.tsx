import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { haySesion } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Acceso",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await haySesion()) redirect("/admin");

  return (
    <main id="contenido" className="relative flex min-h-[100svh] items-center justify-center px-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_50%_40%_at_50%_50%,#000,transparent_70%)]"
      />
      <LoginForm />
    </main>
  );
}
