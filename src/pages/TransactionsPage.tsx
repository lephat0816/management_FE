import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import '../styles/Transaction.css'
import type { ProductData } from "./AddEditProductPage";
import type { SupplierData } from "./AddEditSupplierPage";
interface UserData {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt?: Date;
}
export interface TransactionData {
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
    supplier: SupplierData;
    updateAt?: Date;
}

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("");
    const [valueToSearch, setValueToSeach] = useState("");
    const [sortField, setSortField] = useState<keyof TransactionData | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        getTransactions();
    }, [currentPage, valueToSearch, sortField, sortOrder]);

    const getTransactions = async () => {
        try {
            const response = await ApiService.getAllTransactions(valueToSearch);
            if (response.status === 200) {
                let sortedTransactions = [...response.transactions];

                if (sortField) {
                    sortedTransactions.sort((a, b) => {
                        const fieldA = a[sortField];
                        const fieldB = b[sortField];

                        if (typeof fieldA === "string" && typeof fieldB === "string") {
                            return sortOrder === "asc"
                                ? fieldA.localeCompare(fieldB)
                                : fieldB.localeCompare(fieldA);
                        }
                        if (fieldA instanceof Date && fieldB instanceof Date) {
                            return sortOrder === "asc"
                                ? fieldA.getTime() - fieldB.getTime()
                                : fieldB.getTime() - fieldA.getTime();
                        }
                        return sortOrder === "asc"
                            ? (fieldA as number) - (fieldB as number)
                            : (fieldB as number) - (fieldA as number);
                    });
                }
                setTotalPages(Math.ceil(response.transactions.length / itemsPerPage));
                setTransactions(
                    sortedTransactions.slice(
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

    const toggleSort = (field: keyof TransactionData) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
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
                                        <th onClick={() => toggleSort("transactionType")} className="sortable">
                                            TYPE{" "}
                                            {sortField === "transactionType" && (
                                                <span className="sort-icon">
                                                    {sortOrder === "asc" ? "▲" : "▼"}
                                                </span>)}
                                        </th>
                                        <th>STATUS</th>
                                        <th>TOTAL PRICE</th>
                                        <th>NO OF PRODUCTS</th>
                                        <th onClick={() => toggleSort("createdAt")} className="sortable">
                                            DATE{" "}
                                            {sortField === "createdAt" && (
                                                <span className="sort-icon">
                                                    {sortOrder === "asc" ? "▲" : "▼"}
                                                </span>)}
                                        </th>
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