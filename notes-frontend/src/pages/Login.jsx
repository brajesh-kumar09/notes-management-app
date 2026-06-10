import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { toast } from "react-toastify";
import "./auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            //Api call to login user
            const response = await loginUser({ email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            toast.success("Login successful! Redirecting...", { autoClose: 1000 });
            await new Promise(resolve => setTimeout(resolve, 1000));

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h3>Email</h3>
                    <input name="emailId" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <h3>Password</h3>
                    <input name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="buttons authButtons" type="submit" disabled={loading || !email || !password}>Login</button>
            </form>

            <p className="Umy">Don't have an account? <button className="navigateBtn" disabled={loading} onClick={() => navigate("/register")}>Sign Up</button></p>
        </div>
    );
}

export default Login;