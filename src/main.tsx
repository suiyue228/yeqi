import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./fonts.css";
import "./styles.css";
import "./scenes.css";
import "./ritual.css";
import "./audio.css";
import "./rooms.css";
import "./modules.css";
import "./theatre.css";
import "./typography.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
