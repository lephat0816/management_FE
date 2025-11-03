import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApiService from './service/ApiService';
import { ProtectedRoute, AdminRoute } from './service/Guard';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CategoryPage from './pages/CategoryPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/register' element={<RegisterPage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>

        {/* ADMIN ROUTES */}
        <Route path='/category' element={<AdminRoute element={<CategoryPage/>}/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
