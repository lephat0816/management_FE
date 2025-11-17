import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import type { TransactionData } from '../pages/TransactionsPage';
import Box from '@mui/material/Box';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

type Props = {
    open: boolean;
    onClose: () => void;
    info: TransactionData | null;
    isLoading: boolean;
}
export default function CustomizeDialogs({ open, onClose, info, isLoading }: Props) {

    return (
        <React.Fragment>

            <BootstrapDialog
                onClose={onClose}
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Transaction Infomation
                </DialogTitle>
                <IconButton
                    aria-label='close'
                    onClick={onClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    {isLoading || !info ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '400px', minHeight: '200px' }}>
                            <Typography>Loading...</Typography>
                        </Box>
                    ) : (
                        <>
                            <Typography variant='h6'>
                                Transaction Infomation
                            </Typography>
                            <Typography>Type: {info.transactionType}</Typography>
                            <Typography>Status: {info.status}</Typography>
                            <Typography>Description: {info.description}</Typography>
                            <Typography>Total Products: {Number(info.totalProducts).toFixed(2)}</Typography>
                            <Typography>Total Price: {info.totalPrice.toLocaleString("ja-JP", {
                                style: "currency",
                                currency: "JPY",
                            })}
                            </Typography>
                            <Typography>Created At: {new Date(info.createdAt).toLocaleDateString()}</Typography>
                            {info.updateAt && (<Typography>Updated At: {new Date(info.updateAt).toLocaleDateString()}</Typography>)}
                            <br />
                            <Typography variant="h6">Product Information</Typography>
                            <Typography>Name: {info.product.name}</Typography>
                            <Typography>SKU: {info.product.sku}</Typography>
                            <Typography>
                                Price: {Number(info.product.price).toLocaleString("ja-JP", {
                                    style: "currency",
                                    currency: "JPY",
                                })}
                            </Typography>
                            <Typography>Description: {info.product.description}</Typography>
                            <Typography>Stock Quantity: {info.product.stockQuantity}</Typography>
                            <br />
                            <Typography variant="h6">User Information</Typography>
                            <Typography>Name: {info.user.name}</Typography>
                            <Typography>Email: {info.user.email}</Typography>
                            <Typography>Phone Number: {info.user.phoneNumber}</Typography>
                            <Typography>Role: {info.user.role}</Typography>
                            {info.user.createdAt && (<Typography>Create At: {new Date(info.user.createdAt).toLocaleDateString()}</Typography>)}
                        </>
                    )}

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="contained" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    )
}