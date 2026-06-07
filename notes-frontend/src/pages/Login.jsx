import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");
    const [loginMessageType, setLoginMessageType] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            //Api call to login user
            const response = await loginUser({ email, password });
            localStorage.setItem("token", response.data.token);

            setLoginMessage("Login successful! Redirecting...");
            setLoginMessageType("green");

            await new Promise(resolve => setTimeout(resolve, 500));
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setLoginMessage("Invalid email or password");
            setLoginMessageType("red");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h5>Email</h5>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setLoginMessage(""); }} />
                </div>
                <div>
                    <h5>Password</h5>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setLoginMessage(""); }} />
                </div>
                <button type="submit" disabled={loading || !email || !password}>Login</button>
            </form>
            <p style={{ color: loginMessageType }}>{loginMessage}</p>
            <p>Don't have an account? <button disabled={loading} onClick={() => navigate("/register")}>Sign Up</button></p>
        </div>
    );
}

export default Login;