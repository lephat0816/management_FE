import { useState, useEffect, type FormEvent } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";

import type { ProductData } from "./AddEditProductPage";
import type { SupplierData } from "./AddEditSupplierPage";

type PurChaseData = {
    productId: number;
    quantity: number;
    supplierId: number;
    description: string;
    note: string;
}
const PurchasePage = () => {

    const [purchase, setPurchase] = useState<PurChaseData>({
        productId: 0,
        quantity: 0,
        supplierId: 0,
        description: "",
        note: "",
    });
    const [products, setProducts] = useState<ProductData[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProductsAndSuppliers();
    }, []);

    const fetchProductsAndSuppliers = async () => {
        try {
            const resProducts = await ApiService.getAllProducts();
            const resSuppliers = await ApiService.getAllSuppliers();
            setProducts(resProducts.products);
            setSuppliers(resSuppliers.suppliers);
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "Error Getting Products(Suppliers)" + error
            );
        }
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 1000);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!purchase.productId || !purchase.supplierId || !purchase.quantity) {
            showMessage("Please fill in all required fields")
        }

        try {
            const resPurchase = await ApiService.purchaseProduct(purchase);
            showMessage(resPurchase.message);
            resetForm();
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "Error Purchase Products" + error
            );
        }
    }

    const resetForm = () => setPurchase({
        productId: 0,
        quantity: 0,
        supplierId: 0,
        description: "",
        note: "",
    });

    return(
        <Layout
            page={
                <>
                    {message && <div className="message">{message}</div>}
                    <div className="purchase-form-page">
                        <h1>Recive Inventory</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Select product</label>
                                <select 
                                    value={purchase.productId}
                                    onChange={(e) => setPurchase((prev) => ({...prev, productId: Number(e.target.value)}))}
                                >
                                    <option value="">Select a product</option>
                                    {products.map((product) => (
                                        <option value={product.id} key={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Select Supplier</label>
                                <select 
                                    value={purchase.supplierId}
                                    onChange={(e) => setPurchase((prev) => ({...prev, supplierId: Number(e.target.value)}))}
                                >
                                    <option value="">Select a product</option>
                                    {suppliers.map((supplier) => (
                                        <option value={supplier.id} key={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label >Description</label>
                                <input
                                    type="text"
                                    value={purchase.description}
                                    onChange={(e) => setPurchase((prev) => ({...prev, description: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Note</label>
                                <input
                                    type="text"
                                    value={purchase.note}
                                    onChange={(e) => setPurchase((prev) => ({...prev, note: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={purchase.quantity}
                                    onChange={(e) => setPurchase((prev) => ({...prev, quantity: Number(e.target.value)}))}
                                    required
                                />
                            </div>
                            <button type="submit">Purchase Product</button>                            
                        </form>
                    </div>
                </>
            }
        />
    )
}

export default PurchasePage;