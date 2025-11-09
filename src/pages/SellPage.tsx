import { useState, useEffect, type FormEvent } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";

import type { ProductData } from "./AddEditProductPage";

type SellData = {
    productId: number;
    quantity: number;
    description: string;
    note: string;
}
const SellPage = () => {

    const [sell, setSell] = useState<SellData>({
        productId: 0,
        quantity: 0,
        description: "",
        note: "",
    });
    const [products, setProducts] = useState<ProductData[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const resProducts = await ApiService.getAllProducts();
            setProducts(resProducts.products);
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "Error Getting Products" + error
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

        if (!sell.productId || !sell.quantity) {
            showMessage("Please fill in all required fields")
        }

        try {
            const resSell = await ApiService.sellProduct(sell);
            showMessage(resSell.message);
            resetForm();
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "Error Sell Products" + error
            );
        }
    }

    const resetForm = () => setSell({
        productId: 0,
        quantity: 0,
        description: "",
        note: "",
    });

    return(
        <Layout
            page={
                <>
                    {message && <div className="message">{message}</div>}
                    <div className="sell-form-page">
                        <h1>Sell Inventory</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Select product</label>
                                <select 
                                    value={sell.productId}
                                    onChange={(e) => setSell((prev) => ({...prev, productId: Number(e.target.value)}))}
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
                                <label >Description</label>
                                <input
                                    type="text"
                                    value={sell.description}
                                    onChange={(e) => setSell((prev) => ({...prev, description: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Note</label>
                                <input
                                    type="text"
                                    value={sell.note}
                                    onChange={(e) => setSell((prev) => ({...prev, note: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={sell.quantity}
                                    onChange={(e) => setSell((prev) => ({...prev, quantity: Number(e.target.value)}))}
                                    required
                                />
                            </div>
                            <button type="submit">Sell Product</button>                            
                        </form>
                    </div>
                </>
            }
        />
    )
}

export default SellPage;