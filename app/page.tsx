import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/sections/Nav";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Transformation } from "@/components/sections/Transformation";
import { services, site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  slogan: site.tagline,
  areaServed: "Global",
  knowsLanguage: ["es"],
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: service.title, description: service.description },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="contenido">
        <Hero />
        <Services />
        <Process />
        <Projects />
        <Transformation />
      </main>
      <Contact />
    </>
  );
}
