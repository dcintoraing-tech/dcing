import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Wordmark } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { mailto, navLinks, rutaCotizar, site } from "@/lib/site";

export function Contact() {
  const year = new Date().getFullYear();

  return (
    <section
      id="contacto"
      className="relative scroll-mt-24 overflow-hidden rounded-t-[30px] bg-contrast px-5 pt-28 pb-10 text-on-contrast sm:rounded-t-[44px] sm:pt-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-inverse opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-18%] left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_62%)] blur-2xl"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal>
          <span className="label-mono inline-flex items-center gap-2 text-on-contrast/40">
            <span className="h-[5px] w-[5px] rounded-full bg-on-contrast/40" />
            Contacto
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-7 text-[clamp(2.1rem,6vw,4.2rem)] leading-[1.02] font-medium tracking-[-0.042em] text-balance">
            ¿Listo para transformar tu negocio?
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10">
            <ButtonLink href={rutaCotizar} variant="inverse" size="lg" arrow>
              Hablemos de tu proyecto
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <a
            href={mailto}
            className="label-mono mt-7 inline-block text-on-contrast/35 transition-colors duration-300 hover:text-on-contrast/70"
          >
            {site.email}
          </a>
        </Reveal>
      </div>

      <footer className="relative mx-auto mt-24 flex max-w-6xl flex-col gap-6 border-t border-line-inverse pt-8 sm:mt-32 sm:flex-row sm:items-center sm:justify-between">
        <Wordmark className="text-[15px] text-on-contrast" />

        <nav aria-label="Pie de página" className="flex flex-wrap gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label-mono text-on-contrast/35 transition-colors duration-300 hover:text-on-contrast/70"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/privacidad"
            className="label-mono text-on-contrast/35 transition-colors duration-300 hover:text-on-contrast/70"
          >
            Privacidad
          </Link>
        </nav>

        <p className="label-mono text-on-contrast/25">
          © {year} {site.name} — Diseño + Ingeniería
        </p>
      </footer>
    </section>
  );
}
