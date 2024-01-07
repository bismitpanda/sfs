import React from "react";
import ReactDOM from "react-dom/client";

import { LoginScreen } from "../src/Login";
import "../src/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <LoginScreen />
    </React.StrictMode>,
);
