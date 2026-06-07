import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserAccount } from "../services/api";

function DeleteAccount() {
    const navigate = useNavigate();
    const [delMessage, setDelMessage] = useState("");

    const handleDeleteAccount = async (e) => {
        try {
            const token = localStorage.getItem("token");
            //Delete Account api called
            const response = await deleteUserAccount(token);
            localStorage.removeItem("token");
            console.log(response?.data);

            setDelMessage(true)
            await new Promise(resolve => setTimeout(resolve, 2000));

            navigate("/register");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <p>Are you sure to DELETE your Notes Account?</p>
            <button disabled={delMessage} onClick={handleDeleteAccount}>Delete my Account</button>
            <button disabled={delMessage} onClick={() => navigate("/dashboard")}>Cancel</button>
            {delMessage && <p style={{ color: 'green' }}>Account deletion successfull!</p>}
        </div>
    )
}

export default DeleteAccount;