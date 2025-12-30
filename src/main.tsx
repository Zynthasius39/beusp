import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Index from "./Index";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Index />
  </StrictMode>,
);
