import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

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
          background: "#171816",
          color: "#f3f0e9",
          fontSize: 110,
          letterSpacing: "-8px",
          fontFamily: "sans-serif",
        }}
      >
        DW
      </div>
    ),
    size,
  );
}