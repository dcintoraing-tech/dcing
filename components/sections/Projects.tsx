import { ProjectWindow } from "@/components/sections/ProjectWindow";
import { SectionHeading } from "@/components/ui/Reveal";
import { projects } from "@/lib/site";

export function Projects() {
  return (
    <section id="proyectos" className="relative scroll-mt-24 px-5 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          label="Proyectos"
          title={
            <>
              Sistemas que ya
              <br />
              están funcionando.
            </>
          }
          description="Cuatro productos, una misma manera de construir."
        />

        <div className="mt-16 flex flex-col gap-20 sm:gap-24 lg:gap-28">
          {projects.map((project, index) => (
            <ProjectWindow key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
