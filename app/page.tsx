"use client";

import React from "react";

export default function Home() {
  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Rendereel Studio</h1>
      <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>Platform is loading...</p>
      <div style={{ marginTop: "1rem" }}>
        <a href="/generate/image" style={{
          display: "inline-block",
          background: "#0066ff",
          color: "#fff",
          padding: "0.5rem 0.75rem",
          borderRadius: 8,
          textDecoration: "none"
        }}>
          Go to FLUX Generator
        </a>
      </div>
    </div>
  );
}
