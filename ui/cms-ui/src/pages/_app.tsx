import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import Navigation from "@/components/navigation/Navigation";
import '../i18n'
import { appWithTranslation } from 'next-i18next';


 function App({ Component, pageProps }: AppProps) {

  return (
    <Provider store={store}>
        <Navigation />

        <Component {...pageProps} />
    </Provider>
  )
}
export default appWithTranslation(App);
