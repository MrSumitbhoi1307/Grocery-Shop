import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ FIX 1

// Context import
import { useAppContext } from "../context/AppContext"; 

// Profile icon import
import profileIcon from "../assets/profile_icon.png"; 

const Navbar = () => {
  // ✅ FIX 2: added setUser + user here
  const { 
    setShowUserLogin, 
    setSearchQuery, 
    searchQuery, 
    getCartCount, 
    cartItems,
    user,
    setUser
  } = useAppContext(); 
  
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ FIX 3: logout working
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/user/logout", { // ✅ full URL
        withCredentials: true
      });

      setUser(null);   // UI update
      navigate("/");

    } catch (error) {
      console.log(error);
    }
  };

  const goToCart = () => {
    navigate("/cart");             
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-4 border-b bg-white relative z-50">

      {/* --- LOGO SECTION --- */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <img 
          src="/favicon.svg" 
          alt="GreenCart Logo" 
          className="w-9 h-9 object-contain" 
        />
        <h1 className="text-2xl font-semibold text-gray-800">
          <span className="text-green-600">Sumit</span>Grocery
        </h1>
      </div>

      {/* --- DESKTOP MENU --- */}
      <div className="hidden md:flex items-center gap-8 text-gray-700">

        <NavLink to="/" className={({ isActive }) => isActive ? "text-green-600 font-medium" : "hover:text-green-600"}>
          Home
        </NavLink>

        <NavLink to="/products" className={({ isActive }) => isActive ? "text-green-600 font-medium" : "hover:text-green-600"}>
          All Products
        </NavLink>

        <NavLink to="/contact" className={({ isActive }) => isActive ? "text-green-600 font-medium" : "hover:text-green-600"}>
          Contact
        </NavLink>

        {/* --- SEARCH BAR --- */}
        <div className="flex items-center border border-gray-300 px-4 py-2 rounded-full bg-gray-50 focus-within:border-green-500 transition-all">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="outline-none text-sm w-40 md:w-48 lg:w-64 bg-transparent"
          />
          <span className="text-gray-400">🔍</span>
        </div>

        {/* Cart Icon (Desktop) */}
        <div className="relative cursor-pointer group" onClick={goToCart}>
          <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-xl group-hover:bg-green-50 transition-all">
            🛒
          </div>
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {getCartCount()}
          </span>
        </div>

        {/* --- LOGIN / PROFILE --- */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)} 
            className="bg-green-600 hover:bg-green-700 text-white px-7 py-2 rounded-full text-sm font-medium transition-all shadow-md active:scale-95"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <button className="flex items-center focus:outline-none">
              <img
                src={profileIcon}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-green-500 transition-all cursor-pointer"
              />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-2xl rounded-xl py-3 text-gray-800 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
              <p 
                onClick={() => navigate("/orders")} 
                className="px-4 py-2 hover:bg-green-50 hover:text-green-600 cursor-pointer text-sm font-medium"
              >
                My Orders
              </p>
              <hr className="my-1 border-gray-50" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MOBILE HAMBURGER SECTION --- */}
      <div className="flex items-center gap-6 md:hidden">
        <div className="relative cursor-pointer group" onClick={goToCart}>
          <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-xl group-hover:bg-green-50 transition-all">
            🛒
          </div>
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {getCartCount()}
          </span>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className=" text-2xl focus:outline-none text-gray-700"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-2xl flex flex-col items-center gap-5 py-8 px-6 md:hidden z-40 border-t border-gray-100 animate-fadeIn">
          
          <div className="w-full max-w-xs flex items-center border border-gray-200 px-4 py-2 rounded-full bg-gray-50">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none text-sm w-full bg-transparent"
            />
          </div>

          <NavLink to="/" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-green-600">Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-green-600">All Products</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-green-600">Contact</NavLink>

          <div
            className="flex items-center gap-3 bg-green-50 px-8 py-3 rounded-full w-full max-w-xs justify-center cursor-pointer border border-green-100"
            onClick={() => { goToCart(); setOpen(false); }}
          >
            <span className="text-xl">🛒</span>
            <span className="font-semibold text-green-700 tracking-wide">
              Cart ({getCartCount()})
            </span>
          </div>

          {!user ? (
            <button
              onClick={() => {
                setShowUserLogin(true);
                setOpen(false);
              }}
              className="bg-green-600 text-white px-10 py-3 rounded-full w-full max-w-xs font-bold text-lg shadow-lg active:scale-95"
            >
              Login
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full border-t pt-6 border-gray-100">
              <img src={profileIcon} className="w-16 h-16 rounded-full border-4 border-green-50 shadow-sm" alt="profile" />
              <p onClick={() => {navigate("/orders"); setOpen(false)}} className="text-lg font-bold text-gray-700 hover:text-green-600 cursor-pointer transition-colors">My Orders</p>
              <button onClick={handleLogout} className="text-red-600 font-extrabold text-lg mt-2 uppercase tracking-wider">Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;