import StoreProvider from "@/app/StoreProvider";
import {Layout} from "../../../shared/layout/Layout";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <StoreProvider>
            <Layout>
                {children}
            </Layout>
        </StoreProvider>
    )
}
