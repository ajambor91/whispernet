import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./app";
import {logInfo, startCatchingError} from "../../shared/error-logger/web";
startCatchingError();
logInfo({data: "App initialized"})
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
