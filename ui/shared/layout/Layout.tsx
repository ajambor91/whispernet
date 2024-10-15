
import "../styles/globals.css";
import React from "react";


interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
      <div className="container">
        <main>{children ? children : undefined}</main>
      </div>
  )
}
