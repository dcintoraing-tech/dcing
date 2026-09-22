import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          background: "#ffffff",
          color: "#0a0a0b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "20px",
            letterSpacing: "4px",
            color: "#8b8b93",
          }}
        >
          <div style={{ width: "26px", height: "26px", borderRadius: "9px", background: "#0a0a0b" }} />
          DISEÑO + INGENIERÍA + AUTOMATIZACIÓN
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "38px",
            fontSize: "164px",
            fontWeight: 600,
            letterSpacing: "-8px",
            lineHeight: 1,
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "30px",
            fontSize: "42px",
            letterSpacing: "-1.5px",
            color: "#3f3f46",
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: "22px",
            letterSpacing: "2px",
            color: "#a1a1aa",
          }}
        >
          DCING.COM
        </div>
      </div>
    ),
    { ...size },
  );
}
