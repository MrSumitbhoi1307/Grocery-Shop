import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllProduct from './pages/AllProduct';
import ProductCategories from './pages/ProductCategories';
import Login from './components/Login';
import Footer from './components/Footer';
import { Toaster } from "react-hot-toast";
import { useAppContext } from './context/AppContext';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';

// Seller Components
import SellerLogin from './components/seller/SellerLogin'; 
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct'; 
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders'; // Ise yahan add kiya h

const App = () => {
    const { showUserLogin, isSeller } = useAppContext(); 
    const location = useLocation();
    const isSellerPath = location.pathname.toLowerCase().includes("seller");

    return (
        <div className="text-default min-h-screen text-gray-700 bg-white">
            <Toaster />
            {showUserLogin && <Login />}
            {!isSellerPath && <Navbar />}
            
            <div className={isSellerPath ? "" : "px-4 md:px-8"}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<AllProduct />} />
                    <Route path="/products/:categoryName" element={<ProductCategories />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/add-address" element={<AddAddress />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    
                    {/* SELLER ROUTES */}
                    <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
                        <Route index element={
                            <div className="p-10 text-center w-full flex flex-col items-center justify-center">
                                <h1 className="text-4xl font-bold text-primary italic">
                                    Sumit Grocery Store - Seller Dashboard
                                </h1>
                                <p className="mt-4 text-gray-500">Welcome back, Sumit!</p>
                            </div>
                        } />
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="product-list" element={<ProductList />} /> 
                        <Route path="orders" element={<Orders />} /> 
                    </Route>
                </Routes>
            </div>
            
            {!isSellerPath && <Footer />}
        </div>
    );
};

export default App;