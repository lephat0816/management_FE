import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminRoute, ProtectedRoute } from './service/Guard';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CategoryPage from './pages/CategoryPage';
import SupplierPage from './pages/SupplierPage';
import AddEditSupplierPage from './pages/AddEditSupplierPage';
import ProductPage from './pages/ProductPage';
import AddEditProductPage from './pages/AddEditProductPage';
import PurchasePage from './pages/PurchasePage';
import SellPage from './pages/SellPage';
import TransactionsPage from './pages/TransactionsPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/register' element={<RegisterPage />}></Route>
        <Route path='/login' element={<LoginPage />}></Route>

        {/* ADMIN ROUTES */}
        <Route path='/category' element={<AdminRoute element={<CategoryPage />} />} />
        <Route path='/supplier' element={<AdminRoute element={<SupplierPage />} />} />
        <Route path='/add-supplier' element={<AdminRoute element={<AddEditSupplierPage />} />} />
        <Route path='/edit-supplier/:supplierId' element={<AdminRoute element={<AddEditSupplierPage />} />} />
        <Route path='/product' element={<AdminRoute element={<ProductPage />} />} />
        <Route path='/add-product' element={<AdminRoute element={<AddEditProductPage />} />} />
        <Route path='/edit-product/:productId' element={<AdminRoute element={<AddEditProductPage />} />} />
        {/* ADMIN AND MANAGERS ROUTES */}
        <Route path='/purchase' element={<ProtectedRoute element={<PurchasePage />} />} />
        <Route path='/sell' element={<ProtectedRoute element={<SellPage />} />} />
        <Route path='/transaction' element={<ProtectedRoute element={<TransactionsPage />} />} />
      </Routes>
    </Router>
  )
}

export default App
