import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/AddEditSupplier.css'

export interface SupplierData {
    id: number;
    name: string;
    contactInfo: string;
    address: string;
}
const AddEditSupplierPage = () => {

    const { supplierId } = useParams();
    const [supplier, setSupplier] = useState<SupplierData>({
        id:0,
        name: "",
        contactInfo: "",
        address: "",
    });
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (supplierId) {
            setIsEditing(true);
            const fetchSupplier = async () => {
                try {
                    const response = await ApiService.getSupplierById(Number(supplierId));
                    if (response.status === 200) {
                        console.log("ok");
                        setSupplier({
                            id: response.supplier.id,
                            name: response.supplier.name,
                            contactInfo: response.supplier.contactInfo,
                            address: response.supplier.address,
                        });
                    }
                } catch (error: any) {
                    showMessage(error.response?.data?.message || "Error Getting a Supplier " + error);
                }
            }
            fetchSupplier();
        }
        
    }, [supplierId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const supplierData = {
            name: supplier.name,
            contactInfo: supplier.contactInfo,
            address: supplier.address
        };

        try {
            if (isEditing) {
                await ApiService.updateSupplier(Number(supplierId), supplierData);
                showMessage("Supplier Edited successfully");
            } else {
                await ApiService.addSupplier(supplierData);
                showMessage("supplier Added successfully");
                navigate("/supplier")
            }
        } catch (error: any) {
            showMessage(error.response?.data?.message || "Error Getting a Supplier " + error);
        };
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 2000);
    };

    return (
        <Layout
            page={
                <>
                    {message && <div className="message">{message}</div>}
                    <div className="supplier-form-page">
                        <h1>{isEditing ? "Edit Supplier" : "Add Supplier"}</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Supplier Name</label>
                                <input
                                    type="text"
                                    value={supplier.name}
                                    onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Supplier Info</label>
                                <input
                                    type="text"
                                    value={supplier.contactInfo}
                                    onChange={(e) => setSupplier({ ...supplier, contactInfo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Supplier Address</label>
                                <input
                                    type="text"
                                    value={supplier.address}
                                    onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit">{isEditing ? "Edit" : "Add"}</button>
                        </form>
                    </div>
                </>
            }
        />
    )
}

export default AddEditSupplierPage;