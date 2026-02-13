import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerAutoSync } from "./lib/offlineSync";

// Register background sync for offline quiz results
registerAutoSync();

createRoot(document.getElementById("root")!).render(<App />);
