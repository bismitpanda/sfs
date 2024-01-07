import "@fontsource/space-grotesk/latin-400.css";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "../src/Main";
import "../src/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
