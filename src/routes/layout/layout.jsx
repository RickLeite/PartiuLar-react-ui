// src/routes/layout/layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import "./layout.scss";

export function Layout({ children }) {
    return (
        <div className="layout">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="content">
                {children || <Outlet />}
            </div>
        </div>
    );
}