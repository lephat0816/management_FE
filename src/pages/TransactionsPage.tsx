import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import '../styles/Transaction.css'
import type { ProductData } from "./AddEditProductPage";
interface UserData {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
}
interface TransactionData {
    id: number;
    totalProducts: number;
    totalPrice: number;
    transactionType: string;
    status: string;
    description: string;
    note: string;
    createdAt: Date;
    product: ProductData;
    user: UserData;
}

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("");
    const [valueToSerach, setValueToSeach] = useState("");

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        getTransactions();
    }, [currentPage, valueToSerach]);

    const getTransactions = async () => {
        try {
            const response = await ApiService.getAllTransactions(valueToSerach);
            if (response.status === 200) {
                setTotalPages(Math.ceil(response.transactions.length / itemsPerPage));
                setTransactions(
                    response.transactions.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                    )
                );
            } else {

            }
        } catch (error: any) {
            showMessage(error.response?.data?.message || "Error Getting Transactions: " + error);
            console.log(error);
        };
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        setValueToSeach(filter)
    }

    const navigateToTransactionDetailsPage = (transactionId: number) => {
        navigate(`/transaction/${transactionId}`);
    }
    return (
        <Layout
            page={
                <>
                    {message && <p className="message">{message}</p>}
                    <div className="transaction-page">
                        <div className="transaction-header">
                            <h1>Transactions</h1>
                            <div className="transaction-search">
                                <input
                                    type="text"
                                    placeholder="Search transaction..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                                <button onClick={handleSearch}>Search</button>
                            </div>
                        </div>

                        {transactions.length > 0 &&
                            <table className="transaction-table">
                                <thead>
                                    <tr>
                                        <th>TYPE</th>
                                        <th>STATUS</th>
                                        <th>TOTAL PRICE</th>
                                        <th>NO OF PRODUCTS</th>
                                        <th>DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>{transaction.transactionType}</td>
                                            <td>{transaction.status}</td>
                                            <td>{transaction.totalPrice}</td>
                                            <td>{transaction.totalProducts}</td>
                                            <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => navigateToTransactionDetailsPage(transaction.id)}>View Details</button>
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        }
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

export default TransactionsPage;