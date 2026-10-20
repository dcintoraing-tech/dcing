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
          background: "#faf9f5",
          color: "#141413",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "20px",
            letterSpacing: "4px",
            color: "#8b877b",
          }}
        >
          <div style={{ position: "relative", display: "flex", width: "26px", height: "30px" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "8.3px",
                width: "21.7px",
                height: "21.7px",
                borderRadius: "50%",
                background: "#141413",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "19.2px",
                top: 0,
                width: "6.7px",
                height: "30px",
                background: "#141413",
              }}
            />
          </div>
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
            color: "#45443c",
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
            color: "#a8a497",
          }}
        >
          {new URL(site.url).host.toUpperCase()}
        </div>
      </div>
    ),
    { ...size },
  );
}
