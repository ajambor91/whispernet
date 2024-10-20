
import "../styles/globals.scss";
import React from "react";


interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
      <div className="container full-screen">
        <main className="full-screen">{children ? children : undefined}</main>
      </div>
  )
}
