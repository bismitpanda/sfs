import React from "react";
import ReactDOM from "react-dom/client";

import { PhotoViewer } from "../src/Photo";
import "../src/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <PhotoViewer />
    </React.StrictMode>,
);
