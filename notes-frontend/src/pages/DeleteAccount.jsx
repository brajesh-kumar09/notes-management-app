import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserAccount } from "../services/api";
import { toast } from "react-toastify";
import "./dashboard.css"

function DeleteAccount() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteAccount = async (e) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            //Delete Account api called
            const response = await deleteUserAccount(token);
            localStorage.removeItem("token");
            console.log(response?.data);

            toast.success("Account deletion successfull!", {autoClose: 2500});
            await new Promise(resolve => setTimeout(resolve, 2000));

            navigate("/register");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <p id="delCnf">Are you sure to DELETE your Notes Account?</p>
            <button className="buttons delButton" disabled={isLoading} onClick={handleDeleteAccount}>Delete my Account</button>
            <button className="buttons cancel" disabled={isLoading} onClick={() => navigate("/dashboard")}>Cancel</button>
        </div>
    )
}

export default DeleteAccount;