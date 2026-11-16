import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090A",
          color: "#D8FF3E",
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        A
      </div>
    ),
    size,
  );
}
