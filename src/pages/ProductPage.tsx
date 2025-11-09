import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import '../styles/Product.css'

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 3;

    useEffect(() => {
        getProducts();
    }, [currentPage]);

    const getProducts = async () => {
        try {
            const response = await ApiService.getAllProducts();
            if (response.status === 200) {
                setTotalPages(Math.ceil(response.products.length / itemsPerPage));
                setProducts(
                    response.products.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                    )
                );
            } else {

            }
        } catch (error: any) {
            showMessage(error.response?.data?.message || "Error Getting Products: " + error);
            console.log(error);
        };
    };

    const handleDeleteProduct = async (productId: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await ApiService.removeProduct(productId);
                showMessage("Product successfully deleted");
                getProducts();
            } catch (error: any) {
                showMessage(
                    error.response?.data?.message || "Error Deleting in a product: " + error
                );
            };
        };
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
                    <div className="product-page">
                        <div className="product-header">
                            <h1>Products</h1>
                            <button className="add-product-btn" onClick={() => navigate("/add-product")}>Add Product</button>
                        </div>

                        {products &&
                            <div className="product-list">
                                {products.map((product: any) => (
                                    <div key={product.id} className="product-item">
                                        <img
                                            className="product-image"
                                            src={product.imageUrl ? product.imageUrl : 'https://www.pngitem.com/pimgs/m/27-272007_transparent-product-icon-png-product-vector-icon-png.png'}
                                            alt={product.name}
                                        />
                                        <div className="product-info">
                                            <h3 className="name">{product.name}</h3>
                                            <p className="sku">Sku: {product.sku}</p>
                                            <p className="price">Price: {product.price}</p>
                                            <p className="quantity">Quantity: {product.stockQuantity}</p>
                                        </div>

                                        <div className="product-actions">
                                            <button className="edit-btn" onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            }
        />
    );
};

export default ProductPage;