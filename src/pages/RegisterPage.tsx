
import React, { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

interface FormRegister {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
}

const RegisterPage = (): JSX.Element => {
    const [formData, setFormData] = useState<FormRegister>({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await ApiService.registerUser(formData);
            setMessage("Registration Successfully");
            navigate("/login");
        } catch (error: any) {
            showMessage(error.response?.data?.message || "Error Registering a User: " + error);
            console.log(error)
        }
    }

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    }

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleRegister}>
                <input 
                type="text" 
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                />
                <input 
                type="email" 
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                />
                <input 
                type="password" 
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                />
                <input 
                type="text" 
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required
                />

                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>

        </div>
    )
}

export default RegisterPage;