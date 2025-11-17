import { useState, useEffect, type FormEvent, use } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import '../styles/Profile.css'
type UserInfo = {
    name: string,
    email: string,
    phoneNumber: string,
    role: string,
}
const ProfilePage = () => {

    const [user, setUser] = useState<UserInfo>({
        name: "",
        email: "",
        phoneNumber: "",
        role: "",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchUserInFo();
    }, []);
    const fetchUserInFo = async () => {
        try {
            const userRes = await ApiService.getLoggedInUser();
            setUser(userRes);
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "Error Loggin in a User" + error
            );
        }
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

    return (
        <Layout
            page={
                <>
                    {message && <div className="message">{message}</div>}
                    <div className="profile-page">
                        {user && (
                            <div className="profile-card">
                                <h1>Hello, {user.name}</h1>
                                <div className="profile-info">


                                    <div className="profile-item">
                                        <label>Name</label>
                                        <span>{user.name}</span>
                                    </div>
                                    <div className="profile-item">
                                        <label>Email</label>
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="profile-item">
                                        <label>Phone Number</label>
                                        <span>{user.phoneNumber}</span>
                                    </div>
                                    <div className="profile-item">
                                        <label>Role</label>
                                        <span>{user.role}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            }
        />
    )
};

export default ProfilePage;
