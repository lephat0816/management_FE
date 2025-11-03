
import React, { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

interface FormLogin {
    email: string;
    password: string;
}

const LoginPage = (): JSX.Element => {
    const [formData, setFormData] = useState<FormLogin>({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await ApiService.loginUser(formData);
            console.log(res);
            if (res.status == 200) {
                ApiService.saveToken(res.token);
                ApiService.saveRole(res.role);
                setMessage(res.message);
                navigate("/dashboard");
            }
        } catch (error: any) {
            showMessage(error.response?.data?.message || "Error Loggin in a User: " + error);
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
            <h2>Login</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleLogin}>
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
            
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>

        </div>
    )
}

export default LoginPage;