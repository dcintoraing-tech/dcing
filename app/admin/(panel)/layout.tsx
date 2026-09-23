import Link from "next/link";
import { salir } from "@/app/admin/actions";
import { Wordmark } from "@/components/ui/Logo";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { requiereSesion } from "@/lib/admin/auth";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  await requiereSesion();

  return (
    <div className="min-h-[100svh]">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-3 transition-opacity hover:opacity-70">
            <Wordmark />
            <span className="label-mono hidden text-ink/30 sm:inline">Panel</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <form action={salir}>
              <button
                type="submit"
                className="rounded-full border border-line px-4 py-2 text-[13px] text-ink/55 transition-colors duration-300 hover:border-ink/25 hover:text-ink"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-6xl px-5 py-10 sm:py-14">{children}</main>
    </div>
  );
}
