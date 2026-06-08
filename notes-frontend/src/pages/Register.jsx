import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "./auth.css";

function Register() {
    const [name, setName] = useState("sfa");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signUpMessage, setSignupMessage] = useState("");
    const [signUpMessageType, setSignupMessageType] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            //Api call to register user
            const response = await registerUser({ name, email, password });
            console.log(response.data);

            setSignupMessage("Registration successful! Redirecting to login.");
            setSignupMessageType("green");
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate("/login");
        } catch (error) {
            console.error(error);
            setSignupMessage(error.response.data.message);
            setSignupMessageType("orange");
        }
    };

    return (
        <div className="register">
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h3>Name</h3>
                    <input name="name" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <h3>Email</h3>
                    <input name="emailId" type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setSignupMessage(""); setIsLoading(false); }} />
                </div>
                <div>
                    <h3>Password</h3>
                    <input name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="buttons authButtons" disabled={!name || !email || !password || isLoading} type="submit">Sign Up</button>
            </form>
            <p className="Umy" style={{ color: signUpMessageType }}>{signUpMessage}</p>
            <p className="Umy">Already have an account? <button className="navigateBtn" disabled={signUpMessageType==='green'} onClick={() => navigate("/login")}>Login</button></p>
        </div>
    );
}

export default Register;
