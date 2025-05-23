import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./app";
import {logInfo, startCatchingError} from "../../shared/error-logger/web";
import {ToastProvider} from "../../shared/providers/toast-provider";
import ToastContainer from "../../shared/components/toast/Toast";
import './i18n';
import RootLayout from "@/app/layout";

startCatchingError();
logInfo({data: "App initialized"})
ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <ToastProvider>
        <div id="main-app">
            <RootLayout>
                <App/>
            </RootLayout>
        </div>
        <ToastContainer/>
    </ToastProvider>
    // </React.StrictMode>
);
