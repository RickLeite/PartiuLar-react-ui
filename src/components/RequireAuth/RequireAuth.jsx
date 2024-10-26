// src/components/RequireAuth/RequireAuth.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Layout } from "../../routes/layout/layout";

function RequireAuth() {
    const { currentUser, updateUser } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && !currentUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.token) {
                    updateUser(parsedUser);
                } else {
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem('user');
            }
        }
    }, [currentUser, updateUser]);

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Layout><Outlet /></Layout>;
}

export default RequireAuth;