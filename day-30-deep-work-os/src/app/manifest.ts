import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deep Work OS",
    short_name: "Deep Work",
    description:
      "Protect the work. Local-first deep work sessions.",
    start_url: "/home",
    display: "standalone",
    background_color: "#f3f0e9",
    theme_color: "#f3f0e9",
    orientation: "any",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}