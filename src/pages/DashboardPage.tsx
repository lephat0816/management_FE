import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { LineChart, Line, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, XAxis } from "recharts";
import '../styles/Dashboard.css'

type DailyStat = {
    day: number;
    count: number;
    quantity: number;
    amount: number
};

const DashboardPage = () => {

    const [message, setMessage] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedData, setSelectedData] = useState("amount");
    const [chartData, setChartData] = useState<DailyStat[]>([]);

    const [valueToSearch, setValueToSeach] = useState("");

    useEffect(() => {
        fetchData();
    }, [selectedMonth, selectedYear, selectedData]);

    const fetchData = async () => {
        try {
            const transactionRes = await ApiService.getAllTransactions(valueToSearch);
            if (transactionRes.status === 200) {
                const transformed = transformTransactionData(
                    transactionRes.transactions,
                    selectedMonth,
                    selectedYear
                );
                setChartData(transformed);
            }
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "Error Getting Transactions: " + error
            )
        }
    };

    const transformTransactionData = (
        transactions: any[],
        month: number,
        year: number
    ) => {
        const dailyData: Record<number, DailyStat> = {};
        const daysInMonths = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonths; day++) {
            dailyData[day] = {
                day,
                count: 0,
                quantity: 0,
                amount: 0,
            }
        }
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.createdAt);
            const transactionMonth = transactionDate.getMonth() + 1;
            const transactionYear = transactionDate.getFullYear();

            if (transactionMonth == month && transactionYear == year) {
                const day = transactionDate.getDate();
                dailyData[day].count += 1;
                dailyData[day].quantity += transaction.totalProducts;;
                dailyData[day].amount += transaction.totalPrice;
            };
        });
        return Object.values(dailyData);
    };

    const handleMonthChange = (e: any) => {
        setSelectedMonth(parseInt(e.target.value, 10));
    }

    const handleYearChange = (e: any) => {
        setSelectedYear(parseInt(e.target.value, 10));
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
                    {message && <div className="message">{message}</div>}
                    <div className="dashboard-page">
                        <div className="button-group">
                            <button onClick={() => setSelectedData("count")}>Total No Of Transactions</button>
                            <button onClick={() => setSelectedData("quantity")}>Product Quantity</button>
                            <button onClick={() => setSelectedData("amount")}>Amount</button>
                        </div>
                    </div>

                    <div className="dashboard-content">
                        <div className="filter-section">
                            <label htmlFor="">Select Month</label>
                            <select value={selectedMonth} id="month-select" onChange={handleMonthChange}>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option value={i + 1} key={i + 1}>
                                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-section">
                            <label>Select Year</label>
                            <select value={selectedYear} id="month-select" onChange={handleYearChange}>
                                {Array.from({ length: 5 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <option value={year} key={year}>
                                            {year}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="chart-section">
                            <div className="chart-container">
                                <h3>Daily Transactions</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="day"
                                            label={{
                                                value: "day",
                                                position: "insideBottomRight",
                                                offset: -5
                                            }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type={"monotone"}
                                            dataKey={selectedData}
                                            stroke="#008080"
                                            fillOpacity={0.3}
                                            fill="#008080"
                                            dot={{ r: 3 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            }
        />
    )
};
export default DashboardPage;