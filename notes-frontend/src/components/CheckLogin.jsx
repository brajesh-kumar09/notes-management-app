import {Navigate} from "react-router-dom";

function CheckLogin({ children }) {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default CheckLogin;