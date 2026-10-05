import React from "react";
import { createRoot } from "react-dom/client";
import ClihubShowcase from "./ClihubShowcase";

createRoot(document.getElementById("root")).render(
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", boxSizing: "border-box", background: "#08080C" }}>
    <ClihubShowcase />
  </div>
);
