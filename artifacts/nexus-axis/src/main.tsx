import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { loadI18n } from "./i18n/index";

const root = createRoot(document.getElementById("root")!);

loadI18n().then(() => {
  root.render(<App />);
}).catch((err) => {
  console.error("Failed to load i18n:", err);
  root.render(<App />);
});
