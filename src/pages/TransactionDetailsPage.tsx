import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import type { TransactionData } from "./TransactionsPage";

const TransactionDetailsPage = () => {

    const { transactionId } = useParams();
    const [transaction, setTransaction] = useState<TransactionData | null>(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransaction();
    }, [transactionId]);

    const fetchTransaction = async () => {
        try {
            const transactionRes = await ApiService.getTransactionById(Number(transactionId));
            if (transactionRes.status === 200) {
                setTransaction(transactionRes.transaction);
            }
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "Error Getting Transaction: " + error
            )
        }
    };

    const handleUpdateStatus = async () => {
        if (!transaction?.status) {
            showMessage("Transaction status is missing");
            return;
        }
        try {
            await ApiService.updateTransactionStatus(Number(transactionId), transaction?.status)
            navigate("/transaction");
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "Error Updating a Transaction: " + error
            )
        };
    }

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
                    {message && <p className="message">{message}</p>}
                    <div className="transaction-details-page">
                        {transaction && (
                            <>
                                <div className="section-card">
                                    <h2>Transaction Infomation</h2>
                                    <p>Type: {transaction.transactionType}</p>
                                    <p>Status: {transaction.status}</p>
                                    <p>Description: {transaction.description}</p>
                                    <p>Total Products: {Number(transaction.totalProducts).toFixed(2)}</p>
                                    <p>Total Price: {Number(transaction.totalPrice).toFixed(2)}</p>
                                    <p>Created At: {new Date(transaction.createdAt).toLocaleDateString()}</p>
                                    <p>Updated At: {transaction?.updateAt && new Date(transaction.updateAt).toLocaleDateString()}</p>
                                </div>

                                <div className="section-card">
                                    <h2>Product Infomation</h2>
                                    <p>Name: {transaction.product.name}</p>
                                    <p>SKU: {transaction.product.sku}</p>
                                    <p>Price: {Number(transaction.product.price).toFixed(2)}</p>
                                    <p>Description: {transaction.product.description}</p>
                                    <p>Stock Quantity: {Number(transaction.product.stockQuantity).toFixed(2)}</p>
                                    {transaction.product.imageUrl && (
                                        <img src={transaction.product.imageUrl} alt={transaction.product.name} />
                                    )}
                                </div>

                                <div className="section-card">
                                    <h2>User Infomation</h2>
                                    <p>Name: {transaction.user.name}</p>
                                    <p>Email: {transaction.user.email}</p>
                                    <p>Phome Number: {transaction.user.phoneNumber}</p>
                                    <p>Role: {transaction.user.role}</p>
                                    <p>Create At: {transaction.user.createdAt && new Date(transaction.user.createdAt).toLocaleDateString()}</p>
                                </div>
                                
                                {transaction.supplier && (
                                    <div className="section-card">
                                        <h2>Supplier Infomation</h2>
                                        <p>Name: {transaction.supplier.name}</p>
                                        <p>Contact Info: {transaction.supplier.contactInfo}</p>
                                        <p>Address: {transaction.supplier.address}</p>
                                    </div>
                                )}

                                <div className="section-card transaction-status-update">
                                    <label htmlFor="">Status:</label>
                                    <select
                                        value={transaction.status}
                                        onChange={(e) => setTransaction((prev) =>
                                            prev ? { ...prev, status: e.target.value } : prev
                                        )}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCLLED</option>
                                    </select>
                                    <button onClick={() => handleUpdateStatus()}>Update Status</button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            }
        />
    )
};

export default TransactionDetailsPage;