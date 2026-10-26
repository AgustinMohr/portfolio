import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  const [firstWord, ...rest] = profile.headline.split(" ");
  const lastWord = rest.pop() ?? "";
  const middleWords = rest.join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08090A",
          color: "#F3F1EA",
          padding: "72px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-140px",
            top: "-180px",
            width: "560px",
            height: "560px",
            borderRadius: "9999px",
            border: "1px solid rgba(216,255,62,0.22)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "40px",
            top: "-20px",
            width: "260px",
            height: "260px",
            borderRadius: "9999px",
            backgroundColor: "rgba(216,255,62,0.07)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "17px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#8F9297",
          }}
        >
          <span>{profile.name}</span>
          <span style={{ color: "#D8FF3E" }}>
            {profile.availabilityLabel}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "104px",
            lineHeight: 0.95,
            letterSpacing: "-6px",
            fontWeight: 600,
          }}
        >
          <span>{firstWord}</span>
          <span style={{ display: "flex" }}>
            {middleWords ? <span>{middleWords}</span> : null}
            <span
              style={{
                color: "#D8FF3E",
                marginLeft: middleWords ? "0.2em" : 0,
              }}
            >
              {lastWord}.
            </span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(243,241,234,0.16)",
            paddingTop: "26px",
            fontSize: "16px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#8F9297",
          }}
        >
          <span>{profile.role}</span>
          <span>{profile.location}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
