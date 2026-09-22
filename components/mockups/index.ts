import type { ProjectId } from "@/lib/site";
import { AtlasMockup } from "./AtlasMockup";
import { KoraMockup } from "./KoraMockup";
import { MeridianMockup } from "./MeridianMockup";
import { NucleoMockup } from "./NucleoMockup";

export const MOCKUPS: Record<ProjectId, () => React.JSX.Element> = {
  meridian: MeridianMockup,
  atlas: AtlasMockup,
  kora: KoraMockup,
  nucleo: NucleoMockup,
};
