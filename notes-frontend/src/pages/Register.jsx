import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { toast } from "react-toastify";
import "./auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
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
            //Api call to register user
            const response = await registerUser({ name, email, password });
            console.log(response.data);

            toast.success("Registration successful! Redirecting to login.", { autoClose: 1000 });
            await new Promise(resolve => setTimeout(resolve, 1000));

            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.warning(error.response.data.message);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="register">
            <h1>Create Account</h1>
            <form noValidate onSubmit={handleSubmit}>
                <div>
                    <h3>Name</h3>
                    <input name="name" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <h3>Email</h3>
                    <input name="emailId" type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setIsLoading(false); setEmailError("") }} />
                    <p className="errorText">{emailError}</p>
                </div>
                <div>
                    <h3>Password</h3>
                    <input name="password" type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                    <p className="errorText">{passwordError}</p>
                </div>
                <button className="buttons authButtons" disabled={!name || !email || emailError || passwordError || isLoading} type="submit">Sign Up</button>
            </form>
            <p className="Umy">Already have an account? <button className="navigateBtn" disabled={isLoading} onClick={() => navigate("/login")}>Login</button></p>
        </div>
    );
}

export default Register;
