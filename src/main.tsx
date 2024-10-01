import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import React from "react";

import "./index.css";

// Get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  // Create the root and render the app
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Root element not found");
}
