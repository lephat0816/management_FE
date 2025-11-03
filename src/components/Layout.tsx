import type React from "react";
import Sidebar from "./Sidebar";
import type { JSX } from "react";
import '../styles/Layout.css'

type LayoutProps = {
    page: React.ReactNode;
}
const Layout = ({page}: LayoutProps): JSX.Element => {
    return (
        <div className="layout">
            <Sidebar/>
            <div className="main-content">
                {page}
            </div>
        </div>
    )
}

export default Layout;