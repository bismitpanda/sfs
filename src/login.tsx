import "@fontsource/space-grotesk/latin-400.css";
import React from "react";
import ReactDOM from "react-dom/client";

import { LoginScreen } from "./LoginScreen";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <LoginScreen />
    </React.StrictMode>,
);
