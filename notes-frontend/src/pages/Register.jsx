import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

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
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h5>Name</h5>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <h5>Email</h5>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setSignupMessage(""); setIsLoading(false); }} />
                </div>
                <div>
                    <h5>Password</h5>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button disabled={!name || !email || !password || isLoading} type="submit">Register</button>
            </form>
            <p style={{ color: signUpMessageType }}>{signUpMessage}</p>
            <p>Already have an account? <button disabled={signUpMessageType==='green'} onClick={() => navigate("/login")}>Login</button></p>
        </div>
    );
}

export default Register;
