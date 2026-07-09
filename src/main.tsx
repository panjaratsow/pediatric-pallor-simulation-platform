import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BleedingApp } from "./BleedingApp";
import { PallorApp } from "./PallorApp";
import "./styles.css";

function App() {
  const [module, setModule] = useState<"bleeding" | "pallor">("bleeding");
  return module === "bleeding" ? (
    <BleedingApp onSwitchToPallor={() => setModule("pallor")} />
  ) : (
    <PallorApp onSwitchToBleeding={() => setModule("bleeding")} />
  );
}


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
