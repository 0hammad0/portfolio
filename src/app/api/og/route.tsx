import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters
    const title = searchParams.get("title") || "Portfolio";
    const description = searchParams.get("description") || "";
    const type = searchParams.get("type") || "default"; // default, blog, project

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
          }}
        >
          {/* Noise overlay effect */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
              opacity: 0.1,
            }}
          />

          {/* Content container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px",
              maxWidth: "900px",
              textAlign: "center",
            }}
          >
            {/* Type badge */}
            {type !== "default" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  backgroundColor: "rgba(6, 182, 212, 0.2)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: "100px",
                  marginBottom: "30px",
                }}
              >
                <span
                  style={{
                    color: "#06b6d4",
                    fontSize: "18px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {type === "blog" ? "Blog Post" : "Project"}
                </span>
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontSize: title.length > 40 ? "52px" : "64px",
                fontWeight: 700,
                color: "#fafafa",
                lineHeight: 1.2,
                marginBottom: "20px",
                background: "linear-gradient(135deg, #fafafa 0%, #06b6d4 100%)",
                backgroundClip: "text",
                // @ts-ignore - WebkitBackgroundClip is valid
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p
                style={{
                  fontSize: "24px",
                  color: "#a1a1aa",
                  lineHeight: 1.5,
                  maxWidth: "700px",
                }}
              >
                {description.length > 150
                  ? description.substring(0, 150) + "..."
                  : description}
              </p>
            )}

            {/* Author section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "40px",
              }}
            >
              {/* Logo */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                J
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    color: "#fafafa",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  jahan.dev
                </span>
                <span style={{ color: "#71717a", fontSize: "16px" }}>
                  Full-Stack Developer
                </span>
              </div>
            </div>
          </div>

          {/* Bottom gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100px",
              background:
                "linear-gradient(to top, rgba(6, 182, 212, 0.1), transparent)",
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("OG Image generation error:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
