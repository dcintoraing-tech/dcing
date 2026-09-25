import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Cómo DCing recaba, usa y protege los datos personales que nos compartes a través de este sitio.",
  alternates: { canonical: "/privacidad" },
};

/** Fecha de la última revisión del aviso. Actualízala si cambia el contenido. */
const ACTUALIZADO = "24 de septiembre de 2026";

function Seccion({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-8">
      <span className="label-mono text-ink/30">{numero}</span>
      <h2 className="mt-3 text-[clamp(1.15rem,2.2vw,1.45rem)] leading-tight font-medium tracking-[-0.025em]">
        {titulo}
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-[14.5px] leading-relaxed text-ink/60">
        {children}
      </div>
    </section>
  );
}

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3.5">
          <span aria-hidden="true" className="mt-[10px] h-px w-3.5 shrink-0 bg-ink/25" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacidadPage() {
  return (
    <>
      <Nav />
      <main id="contenido" className="relative px-5 pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_60%_35%_at_50%_0%,#000,transparent_70%)]"
        />

        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <span className="label-mono inline-flex items-center gap-2 text-ink/40">
              <span className="h-[5px] w-[5px] rounded-full bg-ink/25" />
              Legal
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 text-[clamp(2rem,4.6vw,3rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
              Aviso de privacidad.
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/45">
              En cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de
              los Particulares. Última actualización: {ACTUALIZADO}.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-14 flex flex-col gap-10">
            <Seccion numero="01" titulo="Quién es responsable de tus datos">
              <p>
                DCing, con domicilio en la Ciudad de México y correo de contacto{" "}
                <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">
                  {site.email}
                </a>
                , es responsable del uso y protección de los datos personales que nos compartes a
                través de este sitio.
              </p>
            </Seccion>

            <Seccion numero="02" titulo="Qué datos recabamos">
              <p>Cuando llenas el formulario de cotización recabamos:</p>
              <Lista
                items={[
                  "Nombre",
                  "Número de celular",
                  "Correo electrónico",
                  "Nombre de tu empresa o negocio, si decides proporcionarlo",
                  "La descripción del proyecto que nos escribes",
                ]}
              />
              <p>
                Por seguridad del propio formulario, el sistema también registra de forma
                automática tu dirección IP y el navegador desde el que nos escribiste. Esos dos
                datos se usan únicamente para evitar envíos automatizados y abuso.
              </p>
              <p>
                <strong className="font-medium text-ink/80">
                  No recabamos datos personales sensibles
                </strong>{" "}
                ni información financiera o patrimonial a través de este sitio. Nunca te pediremos
                contraseñas ni datos bancarios por correo.
              </p>
            </Seccion>

            <Seccion numero="03" titulo="Para qué los usamos">
              <p>Tus datos se utilizan exclusivamente para:</p>
              <Lista
                items={[
                  "Analizar tu solicitud y preparar una cotización estimada",
                  "Enviarte esa cotización y responder tus preguntas",
                  "Contactarte por correo o WhatsApp para dar seguimiento al proyecto",
                  "Llevar un registro interno de las solicitudes recibidas",
                ]}
              />
              <p>
                No usamos tus datos para publicidad, no te inscribimos a ninguna lista de correos
                y no los vendemos ni los compartimos con terceros para fines comerciales.
              </p>
            </Seccion>

            <Seccion numero="04" titulo="Con quién se comparten">
              <p>
                No vendemos tus datos. Para operar el sitio usamos proveedores de servicio que los
                almacenan o procesan por nuestra cuenta, sujetos a sus propias obligaciones de
                confidencialidad:
              </p>
              <Lista
                items={[
                  "Vercel — hospedaje del sitio web",
                  "Supabase — base de datos donde se guarda tu solicitud",
                  "Resend — envío de los correos que recibes de nuestra parte",
                ]}
              />
              <p>
                Estos servicios operan servidores fuera de México, principalmente en Estados
                Unidos, por lo que tus datos se transfieren y almacenan en ese país. Al enviar el
                formulario aceptas esta transferencia, que es necesaria para poder atenderte.
              </p>
            </Seccion>

            <Seccion numero="05" titulo="Cuánto tiempo los conservamos">
              <p>
                Conservamos tu solicitud y su cotización mientras exista una relación comercial o
                una conversación abierta contigo, y hasta por veinticuatro meses después del
                último contacto, por si retomas el proyecto. Pasado ese plazo, o antes si nos lo
                pides, los eliminamos.
              </p>
            </Seccion>

            <Seccion numero="06" titulo="Tus derechos ARCO">
              <p>
                En cualquier momento puedes pedirnos <strong className="font-medium text-ink/80">acceder</strong> a
                los datos que tenemos de ti, <strong className="font-medium text-ink/80">rectificarlos</strong> si
                son inexactos, <strong className="font-medium text-ink/80">cancelarlos</strong> cuando consideres
                que no los necesitamos, u <strong className="font-medium text-ink/80">oponerte</strong> a que los
                usemos para un fin específico. También puedes revocar tu consentimiento.
              </p>
              <p>
                Para ejercer cualquiera de estos derechos escribe a{" "}
                <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">
                  {site.email}
                </a>{" "}
                indicando tu nombre, el correo con el que nos escribiste y qué deseas hacer.
                Respondemos en un plazo máximo de veinte días hábiles y no cobramos por ello.
              </p>
            </Seccion>

            <Seccion numero="07" titulo="Cookies y rastreo">
              <p>
                Este sitio no usa cookies de publicidad ni de rastreo de terceros. Lo único que se
                guarda en tu navegador es tu preferencia de tema claro u oscuro, que se queda en tu
                dispositivo y nunca llega a nuestros servidores.
              </p>
            </Seccion>

            <Seccion numero="08" titulo="Cambios a este aviso">
              <p>
                Podemos actualizar este aviso cuando cambien nuestros servicios o la legislación
                aplicable. La versión vigente siempre estará publicada en esta página, con su fecha
                de última actualización al inicio. Si el cambio es relevante y tenemos tu correo,
                te lo avisamos.
              </p>
            </Seccion>

            <Seccion numero="09" titulo="Autoridad">
              <p>
                Si consideras que tu derecho a la protección de datos ha sido vulnerado, puedes
                acudir ante la autoridad competente en materia de protección de datos personales en
                México.
              </p>
            </Seccion>
          </Reveal>
        </div>
      </main>
    </>
  );
}
