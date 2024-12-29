import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import {Layout} from "../../../shared/layout/Layout";
import Navigation from "@/components/navigation/Navigation";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Navigation />
    <Component {...pageProps} />
    </Provider>
  )
}
