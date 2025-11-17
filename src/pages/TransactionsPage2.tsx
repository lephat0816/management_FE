import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useQuery } from "@tanstack/react-query";
import type { TransactionData } from "./TransactionsPage";
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { DataGrid, GridDeleteIcon, Toolbar, ToolbarButton, } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { jaJP } from '@mui/x-data-grid/locales';
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import CustomizeDialogs from "../components/TransactionDetail";

function CustomToolbar({ onDelete }: { onDelete: () => void }) {
    return (
        <Toolbar>
            <Tooltip title="Delete items">
                <ToolbarButton onClick={onDelete}>
                    <GridDeleteIcon fontSize="small" />
                </ToolbarButton>
            </Tooltip>
        </Toolbar>
    )
};

function TransactionsPage2() {

    const paginationModel = { page: 0, pageSize: 5 };
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>();
    const [open, setOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);

    const { isLoading, error, data } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const resTransactions = await ApiService.getAllTransactions("");
            return resTransactions.transactions;
        }
    });

    const { data: fullInfo, isLoading: isLoadingDetail } = useQuery({
        queryKey: ['transactionDetail', selectedTransactionId],
        queryFn: async () => {
            const resTransactionDetail = await ApiService.getTransactionById(selectedTransactionId!);
            return resTransactionDetail.transaction;
        },
        enabled: !!selectedTransactionId,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading transactions</div>;

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'transactionType', headerName: 'TYPE', flex: 1 },
        { field: 'status', headerName: 'STATUS', flex: 1 },
        {
            field: 'totalPrice',
            headerName: 'TOTAL PRICE',
            flex: 1,

            valueFormatter: (value) => value && Number(value).toLocaleString("ja-JP", {
                style: "currency",
                currency: "JPY",
            }),
        },
        { field: 'totalProducts', headerName: 'NO OF PRODUCTS', flex: 1 },
        {
            field: 'createdAt',
            headerName: 'DATE',
            width: 100,
            valueFormatter: (value) => value && new Date(value).toLocaleDateString(),
        },
        {
            field: 'details',
            headerName: '',
            width: 70,
            renderCell: (params) => (
                <Toolbar>
                    <Tooltip title="Detail">
                        <ToolbarButton onClick={() => handleDetails(params.row)}>
                            <InfoIcon fontSize="small" />
                        </ToolbarButton>
                    </Tooltip>
                </Toolbar>
            ),

        }

    ];

    const rows = data.map((transaction: TransactionData) => ({
        id: transaction.id,
        transactionType: transaction.transactionType,
        status: transaction.status,
        totalPrice: transaction.totalPrice,
        totalProducts: transaction.totalProducts,
        createdAt: transaction.createdAt,
    }));

    const handleDeleteClick = () => {
        let idsArray: (string | number)[] = [];

        if (selectedRows?.type === 'include') {
            idsArray = Array.from(selectedRows.ids);
        } else if (selectedRows?.type === 'exclude') {
            idsArray = rows
                .map((row: any) => row.id)
                .filter((id: number) => !selectedRows.ids.has(id));
        }
        console.log("Delete IDs:", idsArray);
        console.log(selectedRows)
        console.log(selectedRows?.ids.has(14))
    };

    const handleDetails = (row: any) => {
        setSelectedTransactionId(row.id);
        setOpen(true);
        console.log(row.id);

    }


    return (
        <Layout
            page={
                <>
                    <h1>Transactions</h1>
                    <Paper sx={{ height: 421, width: '100%' }}>

                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection={true}
                            disableRowSelectionOnClick
                            onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
                            slots={{
                                toolbar: () => (
                                    <CustomToolbar
                                        onDelete={handleDeleteClick}
                                    />
                                )
                            }}
                            showToolbar
                            sx={{ border: 0 }}
                            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
                        />
                        <CustomizeDialogs
                            open={open}
                            onClose={() => setOpen(false)}
                            info={fullInfo}
                            isLoading={isLoadingDetail}
                        />
                    </Paper>
                </>
            }
        />
    )
}

export default TransactionsPage2;
