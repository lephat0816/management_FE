import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import type { CategoryData } from "./CategoryPage";
import '../styles/AddEditProduct.css'

export interface ProductData {
    id?: number;
    // productId?: number;
    name: string;
    sku: string;
    price: string;
    stockQuantity: string;
    categoryId: number;
    description: string;
    imageUrl: string;
    // createdAt?: string;
}

const AddEditProductPage = () => {

    const { productId } = useParams();
    const [product, setProduct] = useState<ProductData>({
        name: "",
        sku: "",
        price: "",
        stockQuantity: "",
        categoryId: 0,
        description: "",
        imageUrl: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [message, setMessage] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchProductById();
    }, [productId]);

    const fetchCategories = async () => {
        try {
            const resCat = await ApiService.getAllCategories();
            setCategories(resCat.categories.map((cat: any) => ({
                ...cat,
                title: cat.name,
            })));
        } catch (error: any) {
            showMessage(error.response?.data?.message || "Error Getting All Categories " + error);
        }
    };
    const fetchProductById = async () => {
        if (productId) {
            setIsEditing(true);
            try {
                const resProduct = await ApiService.getProductById(Number(productId));
                if (resProduct.status === 200) {
                    setProduct(resProduct.product);
                } else {
                    showMessage(resProduct.message);
                }
            } catch (error: any) {
                showMessage(error.response?.data?.message || "Error Getting a Product " + error);
            }
        };

    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProduct((prev) => ({
                ...prev,
                imageUrl: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("sku", product.sku);
        formData.append("price", product.price);
        formData.append("stockQuantity", product.stockQuantity);
        formData.append("categoryId", product.categoryId.toString());
        formData.append("description", product.description);
        if (imageFile) {
            console.log(imageFile);
            formData.append("imageFile", imageFile);
        }

        try {
            if (isEditing) {
                formData.append("productId", productId as string);
                // console.log(formData.forEach((a,b) => {console.log(a,b)}));
                await ApiService.updateProduct(formData);
                showMessage("Product successfully updated")
            } else {
                await ApiService.addProduct(formData);
                showMessage("Product successfully saved");
            }
            navigate("/product")
        } catch (error: any) {

        }
    }

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
                    <div className="product-form-page">
                        <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="">Product Name</label>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Sku</label>
                                <input
                                    type="text"
                                    value={product.sku}
                                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Stock quantity</label>
                                <input
                                    type="number"
                                    value={product.stockQuantity}
                                    onChange={(e) => setProduct({ ...product, stockQuantity: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Price</label>
                                <input
                                    type="number"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Description</label>
                                <textarea
                                    value={product.description}
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Category Id</label>
                                <select
                                    value={product.categoryId}
                                    onChange={(e) => setProduct({ ...product, categoryId: Number(e.target.value) })}
                                    required
                                >
                                    <option value="">
                                        Select a category
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Product Image</label>
                                <input type="file" onChange={handleImageChange} />
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        className="image-privew"
                                        alt="iamge"
                                    />
                                )}
                            </div>
                            <button type="submit">{isEditing ? "Edit Product" : "Add Product"}</button>
                        </form>
                    </div>
                </>
            }
        />
    )
}

export default AddEditProductPage;