import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import '../styles/Supplier.css';

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getSuppliers();
    }, []);
    const getSuppliers = async () => {
        try {
            const responseData = await ApiService.getAllSuppliers();
            if (responseData.status === 200) {
                setSuppliers(responseData.suppliers);
            } else {
                showMessage(responseData.message);
            }
        } catch (error: any) {

        }
    }
    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    }

    const handleDeleteSupplier = async (supplierId: number) => {
        try {
            if (window.confirm("Are you sure you want to delete this supplier")) {
                await ApiService.deleteSupplier(supplierId);
                getSuppliers();
            }
        } catch (error: any) {
            showMessage(error.response?.data?.message || "Error Deleting a Supplier: " + error);
            console.log(error);
        };
    };

    return (
        <Layout page={
            <>
                {message && <div className="message">{message}</div>}
                <div className="supplier-page">
                    <div className="supplier-header">
                        <h1>Suppliers</h1>
                        <div className="add-supplier">
                            <button onClick={() => navigate("/add-supplier")}>Add Supplier</button>
                        </div>
                    </div>
                    {suppliers &&
                        <ul className="supplier-list">
                            {suppliers.map((supplier: any) => (
                                <li className="supplier-item" key={supplier.id}>
                                    <span>{supplier.name}</span>
                                    <div className="supplier-action">
                                        <button onClick={() => navigate(`/edit-supplier/${supplier.id}`)}>Edit</button>
                                        <button onClick={() => handleDeleteSupplier(supplier.id)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div>

            </>
        } />


    )
}

export default SupplierPage;