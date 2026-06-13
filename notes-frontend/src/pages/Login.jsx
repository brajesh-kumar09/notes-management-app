import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { toast } from "react-toastify";
import "./auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const value = e.target.value;

        setPassword(value);

        if (value.length < 6) {
            setPasswordError(
                "*Password must be at least 6 characters"
            );
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!emailRegex.test(email)) {
            setEmailError("*Enter a valid email");
            setIsLoading(false);
            return;
        }

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
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <h1>Login</h1>
            <form noValidate onSubmit={handleSubmit}>
                <div>
                    <h3>Email</h3>
                    <input name="emailId" type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError("") }} />
                    <p className="errorText">{emailError}</p>
                </div>
                <div>
                    <h3>Password</h3>
                    <input name="password" type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                    <p className="errorText">{passwordError}</p>
                </div>
                <button className="buttons authButtons" type="submit" disabled={isLoading || !email || passwordError || emailError}>Login</button>
            </form>

            <p className="Umy">Don't have an account? <button className="navigateBtn" disabled={isLoading} onClick={() => navigate("/register")}>Sign Up</button></p>
        </div>
    );
}

export default Login;